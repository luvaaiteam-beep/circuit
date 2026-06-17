export function solveCircuit(components: any[], wires: any[]) {
  const pinToNode: Record<string, number> = {};
  let nextNodeId = 1;

  const getPinKey = (compId: string, pinIdx: number) => `${compId}:${pinIdx}`;

  components.forEach(c => {
    pinToNode[getPinKey(c.id, 0)] = nextNodeId++;
    pinToNode[getPinKey(c.id, 1)] = nextNodeId++;
    if (c.type === 'potentiometer' || c.type === 'transistor_npn') {
      pinToNode[getPinKey(c.id, 2)] = nextNodeId++;
    }
    if (c.type === 'rgb_led' || c.type === 'transformer' || c.type === 'relay') {
      pinToNode[getPinKey(c.id, 2)] = nextNodeId++;
      pinToNode[getPinKey(c.id, 3)] = nextNodeId++;
    }
  });

  const parent: number[] = [];
  for (let i = 0; i < nextNodeId; i++) parent[i] = i;
  
  const find = (i: number): number => {
    if (parent[i] === i) return i;
    return parent[i] = find(parent[i]);
  };
  const union = (i: number, j: number) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
    }
  };

  wires.forEach(w => {
    const p1 = getPinKey(w.from.compId, w.from.pinIdx);
    const p2 = getPinKey(w.to.compId, w.to.pinIdx);
    if (pinToNode[p1] !== undefined && pinToNode[p2] !== undefined) {
      union(pinToNode[p1], pinToNode[p2]);
    }
  });

  const uniqueNodes = new Set<number>();
  for (let i = 1; i < nextNodeId; i++) {
    uniqueNodes.add(find(i));
  }
  
  const nodeMap = new Map<number, number>();
  let nodeCount = 0;
  uniqueNodes.forEach(root => {
    nodeMap.set(root, nodeCount++);
  });

  const batteries = components.filter(c => c.type === 'battery' || c.type === 'solar_panel');
  if (batteries.length > 0) {
    const batNegRoot = find(pinToNode[getPinKey(batteries[0].id, 0)]);
    const currentZeroRoot = Array.from(uniqueNodes).find(root => nodeMap.get(root) === 0);
    if (currentZeroRoot !== undefined && batNegRoot !== currentZeroRoot) {
      nodeMap.set(currentZeroRoot, nodeMap.get(batNegRoot)!);
      nodeMap.set(batNegRoot, 0);
    }
  }

  const getMappedNode = (compId: string, pinIdx: number) => {
    const root = find(pinToNode[getPinKey(compId, pinIdx)]);
    return nodeMap.get(root)!;
  };

  const numNodes = nodeCount - 1;
  if (numNodes <= 0) return null;

  let nodeVoltages = Array(numNodes + 1).fill(0);
  let componentCurrents: Record<string, number> = {};
  let componentVoltages: Record<string, number> = {};
  let x: number[] = [];
  
  let diodeStates: Record<string, boolean> = {};
  let zenerStates: Record<string, 'off' | 'fwd' | 'rev'> = {};
  let ledStates: Record<string, boolean> = {};
  let rgbLedStates: Record<string, { r: boolean, g: boolean, b: boolean }> = {};
  let relayStates: Record<string, boolean> = {};
  let transistorStates: Record<string, boolean> = {};
  let logicStates: Record<string, boolean> = {};

  const MAX_ITER = 20;
  let converged = false;

  for (let iter = 0; iter < MAX_ITER; iter++) {
    let vSources: any[] = [];
    components.forEach(c => {
      if (c.type === 'battery') vSources.push({ id: c.id, n1: getMappedNode(c.id, 0), n2: getMappedNode(c.id, 1), v: c.properties.voltage || 9 });
      else if (c.type === 'led' && ledStates[c.id]) vSources.push({ id: `${c.id}_v`, n1: getMappedNode(c.id, 0), n2: getMappedNode(c.id, 1), v: c.properties.forwardVoltage || 2.0 });
      else if (c.type === 'rgb_led') {
        if (rgbLedStates[c.id]?.r) vSources.push({ id: `${c.id}_r_v`, n1: getMappedNode(c.id, 3), n2: getMappedNode(c.id, 0), v: c.properties.vf_r || 2.2 });
        if (rgbLedStates[c.id]?.g) vSources.push({ id: `${c.id}_g_v`, n1: getMappedNode(c.id, 3), n2: getMappedNode(c.id, 1), v: c.properties.vf_g || 3.3 });
        if (rgbLedStates[c.id]?.b) vSources.push({ id: `${c.id}_b_v`, n1: getMappedNode(c.id, 3), n2: getMappedNode(c.id, 2), v: c.properties.vf_b || 3.2 });
      }
      else if (c.type === 'zener_diode' && zenerStates[c.id] === 'rev') vSources.push({ id: `${c.id}_v`, n1: getMappedNode(c.id, 1), n2: getMappedNode(c.id, 0), v: c.properties.breakdown || 5.1 });
      else if (c.type === 'transistor_npn' && transistorStates[c.id]) vSources.push({ id: `${c.id}_v`, n1: getMappedNode(c.id, 2), n2: getMappedNode(c.id, 0), v: 0.65 });
    });

    const transformers = components.filter(c => c.type === 'transformer');
    const numVSources = vSources.length + transformers.length * 2;
    const size = numNodes + numVSources;

    const A: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    const b: number[] = Array(size).fill(0);

    const addAdmittance = (n1: number, n2: number, g: number) => {
      if (n1 > 0) { A[n1 - 1][n1 - 1] += g; if (n2 > 0) A[n1 - 1][n2 - 1] -= g; }
      if (n2 > 0) { A[n2 - 1][n2 - 1] += g; if (n1 > 0) A[n2 - 1][n1 - 1] -= g; }
    };

    components.forEach(c => {
      const n1 = getMappedNode(c.id, 0);
      const n2 = getMappedNode(c.id, 1);
      let g = 0;

      if (c.type === 'resistor') g = 1 / (c.properties.resistance || 100);
      else if (c.type === 'bulb') g = 1 / 240;
      else if (c.type === 'motor') g = 1 / 50;
      else if (c.type === 'buzzer') g = 1 / 100;
      else if (c.type === 'switch') g = c.properties.closed ? 1000 : 1e-12;
      else if (c.type === 'capacitor') g = 1e-12;
      else if (c.type === 'inductor') g = 1 / 0.01;
      else if (c.type === 'voltmeter') g = 1e-12;
      else if (c.type === 'ammeter') g = 1000;
      else if (c.type === 'fuse') g = c.properties.blown ? 1e-12 : 1000;
      else if (c.type === 'diode') g = diodeStates[c.id] ? 2 : 1e-12;
      else if (c.type === 'zener_diode') g = zenerStates[c.id] === 'fwd' ? 2 : 1e-12;
      else if (c.type === 'led') g = ledStates[c.id] ? 1 : (iter === 0 ? 1/60 : 1e-12);
      else if (c.type === 'rgb_led') {
        const n3 = getMappedNode(c.id, 2);
        const n4 = getMappedNode(c.id, 3);
        addAdmittance(n1, n4, rgbLedStates[c.id]?.r ? 1 : (iter === 0 ? 1/60 : 1e-12));
        addAdmittance(n2, n4, rgbLedStates[c.id]?.g ? 1 : (iter === 0 ? 1/60 : 1e-12));
        addAdmittance(n3, n4, rgbLedStates[c.id]?.b ? 1 : (iter === 0 ? 1/60 : 1e-12));
      }
      else if (c.type === 'potentiometer') {
        const n3 = getMappedNode(c.id, 2);
        const rTotal = c.properties.resistance || 1000;
        const w = c.properties.wiper !== undefined ? c.properties.wiper : 0.5;
        addAdmittance(n1, n3, 1 / Math.max(rTotal * w, 0.001));
        addAdmittance(n3, n2, 1 / Math.max(rTotal * (1 - w), 0.001));
      }
      else if (c.type === 'solar_panel') {
        const isc = c.properties.current || 0.5;
        const voc = c.properties.voltage || 6;
        const gInt = isc / voc;
        addAdmittance(n1, n2, gInt);
        if (n2 > 0) b[n2 - 1] += isc;
        if (n1 > 0) b[n1 - 1] -= isc;
      }
      else if (c.type === 'relay') {
        const n3 = getMappedNode(c.id, 2);
        const n4 = getMappedNode(c.id, 3);
        addAdmittance(n1, n2, 1 / (c.properties.coilResistance || 150));
        addAdmittance(n3, n4, relayStates[c.id] ? 1000 : 1e-12);
      }
      else if (c.type === 'transistor_npn') {
        const n3 = getMappedNode(c.id, 2);
        addAdmittance(n1, n3, transistorStates[c.id] ? 1 : 1e-12);
        addAdmittance(n2, n3, transistorStates[c.id] ? (c.properties.gain || 100) : 1e-12);
      }
      else if (c.type === 'logic_gate_and' || c.type === 'logic_gate_or') {
        const n3 = getMappedNode(c.id, 2);
        addAdmittance(n3, 0, logicStates[c.id] ? 1000 : 1e-12);
        if (logicStates[c.id]) {
          if (n3 > 0) b[n3 - 1] += 5 * 1000;
        }
      }

      if (g > 0) addAdmittance(n1, n2, g);
    });

    for (let i = 1; i <= numNodes; i++) addAdmittance(i, 0, 1e-9);

    vSources.forEach((vs, idx) => {
      const vIdx = numNodes + idx;
      if (vs.n2 > 0) A[vIdx][vs.n2 - 1] += 1;
      if (vs.n1 > 0) A[vIdx][vs.n1 - 1] -= 1;
      b[vIdx] = vs.v;
      if (vs.n2 > 0) A[vs.n2 - 1][vIdx] += 1;
      if (vs.n1 > 0) A[vs.n1 - 1][vIdx] -= 1;
    });

    transformers.forEach((c, idx) => {
      const n1 = getMappedNode(c.id, 0);
      const n2 = getMappedNode(c.id, 1);
      const n3 = getMappedNode(c.id, 2);
      const n4 = getMappedNode(c.id, 3);
      const ratio = c.properties.ratio || 0.5;
      
      const vIdx1 = numNodes + vSources.length + idx * 2;
      const vIdx2 = vIdx1 + 1;

      if (n1 > 0) A[vIdx1][n1 - 1] += 1;
      if (n2 > 0) A[vIdx1][n2 - 1] -= 1;
      if (n1 > 0) A[n1 - 1][vIdx1] += 1;
      if (n2 > 0) A[n2 - 1][vIdx1] -= 1;

      if (n3 > 0) A[vIdx2][n3 - 1] += 1;
      if (n4 > 0) A[vIdx2][n4 - 1] -= 1;
      A[vIdx2][vIdx1] -= ratio;
      if (n3 > 0) A[n3 - 1][vIdx2] += 1;
      if (n4 > 0) A[n4 - 1][vIdx2] -= 1;
      A[vIdx1][vIdx2] += ratio;
    });

    for (let i = 0; i < size; i++) {
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < size; k++) {
        if (Math.abs(A[k][i]) > maxEl) { maxEl = Math.abs(A[k][i]); maxRow = k; }
      }
      for (let k = i; k < size; k++) {
        const tmp = A[maxRow][k]; A[maxRow][k] = A[i][k]; A[i][k] = tmp;
      }
      const tmpB = b[maxRow]; b[maxRow] = b[i]; b[i] = tmpB;

      if (Math.abs(A[i][i]) < 1e-10) return { error: 'DIVERGED', message: 'Circuit equations diverged' };

      for (let k = i + 1; k < size; k++) {
        const c = -A[k][i] / A[i][i];
        for (let j = i; j < size; j++) {
          if (i === j) A[k][j] = 0; else A[k][j] += c * A[i][j];
        }
        b[k] += c * b[i];
      }
    }

    x = Array(size).fill(0);
    for (let i = size - 1; i >= 0; i--) {
      x[i] = b[i];
      for (let j = i + 1; j < size; j++) x[i] -= A[i][j] * x[j];
      x[i] /= A[i][i];
    }

    nodeVoltages = [0];
    for (let i = 0; i < numNodes; i++) nodeVoltages.push(x[i]);

    let changed = false;

    components.forEach(c => {
      const v1 = nodeVoltages[getMappedNode(c.id, 0)];
      const v2 = nodeVoltages[getMappedNode(c.id, 1)];
      const vDrop = v1 - v2;

      if (c.type === 'diode') {
        const newState = vDrop > 0.65;
        if (diodeStates[c.id] !== newState) { diodeStates[c.id] = newState; changed = true; }
      } else if (c.type === 'zener_diode') {
        const breakdown = c.properties.breakdown || 5.1;
        let newState: 'off' | 'fwd' | 'rev' = 'off';
        if (vDrop > 0.65) newState = 'fwd';
        else if (vDrop < -breakdown) newState = 'rev';
        if (zenerStates[c.id] !== newState) { zenerStates[c.id] = newState; changed = true; }
      } else if (c.type === 'led') {
        const vf = c.properties.forwardVoltage || 2.0;
        const newState = vDrop > vf;
        if (ledStates[c.id] !== newState) { ledStates[c.id] = newState; changed = true; }
      } else if (c.type === 'rgb_led') {
        const v4 = nodeVoltages[getMappedNode(c.id, 3)];
        const vr = nodeVoltages[getMappedNode(c.id, 0)] - v4;
        const vg = nodeVoltages[getMappedNode(c.id, 1)] - v4;
        const vb = nodeVoltages[getMappedNode(c.id, 2)] - v4;
        const newState = {
          r: vr > (c.properties.vf_r || 2.2),
          g: vg > (c.properties.vf_g || 3.3),
          b: vb > (c.properties.vf_b || 3.2)
        };
        const oldState = rgbLedStates[c.id] || { r: false, g: false, b: false };
        if (newState.r !== oldState.r || newState.g !== oldState.g || newState.b !== oldState.b) {
          rgbLedStates[c.id] = newState; changed = true;
        }
      } else if (c.type === 'relay') {
        const iCoil = vDrop / (c.properties.coilResistance || 150);
        const newState = Math.abs(iCoil) > 0.02;
        if (relayStates[c.id] !== newState) { relayStates[c.id] = newState; changed = true; }
      } else if (c.type === 'transistor_npn') {
        const v3 = nodeVoltages[getMappedNode(c.id, 2)];
        const vbe = v1 - v3;
        const newState = vbe > 0.65;
        if (transistorStates[c.id] !== newState) { transistorStates[c.id] = newState; changed = true; }
      } else if (c.type === 'logic_gate_and') {
        const vInA = nodeVoltages[getMappedNode(c.id, 0)];
        const vInB = nodeVoltages[getMappedNode(c.id, 1)];
        const newState = vInA > 1.5 && vInB > 1.5;
        if (logicStates[c.id] !== newState) { logicStates[c.id] = newState; changed = true; }
      } else if (c.type === 'logic_gate_or') {
        const vInA = nodeVoltages[getMappedNode(c.id, 0)];
        const vInB = nodeVoltages[getMappedNode(c.id, 1)];
        const newState = vInA > 1.5 || vInB > 1.5;
        if (logicStates[c.id] !== newState) { logicStates[c.id] = newState; changed = true; }
      }
    });

    if (!changed) {
      converged = true;
      break;
    }
  }

  let totalPower = 0;
  let totalI = 0;
  let totalV = 0;

  components.forEach(c => {
    const n1 = getMappedNode(c.id, 0);
    const n2 = getMappedNode(c.id, 1);
    const v1 = nodeVoltages[n1];
    const v2 = nodeVoltages[n2];
    const vDrop = v1 - v2;
    componentVoltages[c.id] = Math.abs(vDrop);

    let current = 0;
    if (c.type === 'resistor') current = vDrop / (c.properties.resistance || 100);
    else if (c.type === 'bulb') current = vDrop / 240;
    else if (c.type === 'motor') current = vDrop / 50;
    else if (c.type === 'buzzer') current = vDrop / 100;
    else if (c.type === 'switch') current = vDrop / (c.properties.closed ? 0.001 : 1e12);
    else if (c.type === 'capacitor') current = 0;
    else if (c.type === 'inductor') current = vDrop / 0.01;
    else if (c.type === 'voltmeter') current = 0;
    else if (c.type === 'ammeter') current = vDrop / 0.001;
    else if (c.type === 'fuse') current = vDrop / (c.properties.blown ? 1e12 : 0.001);
    else if (c.type === 'diode') current = diodeStates[c.id] ? vDrop / 0.5 : 0;
    else if (c.type === 'zener_diode') current = zenerStates[c.id] === 'fwd' ? vDrop / 0.5 : (zenerStates[c.id] === 'rev' ? (vDrop + (c.properties.breakdown || 5.1)) / 0.5 : 0);
    else if (c.type === 'led') current = ledStates[c.id] ? (vDrop - (c.properties.forwardVoltage || 2.0)) / 1 : 0;
    else if (c.type === 'rgb_led') {
      const v4 = nodeVoltages[getMappedNode(c.id, 3)];
      const vr = v1 - v4; const vg = v2 - v4; const vb = nodeVoltages[getMappedNode(c.id, 2)] - v4;
      componentVoltages[`${c.id}_r`] = vr; componentVoltages[`${c.id}_g`] = vg; componentVoltages[`${c.id}_b`] = vb;
      componentCurrents[`${c.id}_r`] = rgbLedStates[c.id]?.r ? (vr - (c.properties.vf_r || 2.2)) / 1 : 0;
      componentCurrents[`${c.id}_g`] = rgbLedStates[c.id]?.g ? (vg - (c.properties.vf_g || 3.3)) / 1 : 0;
      componentCurrents[`${c.id}_b`] = rgbLedStates[c.id]?.b ? (vb - (c.properties.vf_b || 3.2)) / 1 : 0;
      current = componentCurrents[`${c.id}_r`] + componentCurrents[`${c.id}_g`] + componentCurrents[`${c.id}_b`];
    }
    else if (c.type === 'potentiometer') {
      const v3 = nodeVoltages[getMappedNode(c.id, 2)];
      const rTotal = c.properties.resistance || 1000;
      const w = c.properties.wiper !== undefined ? c.properties.wiper : 0.5;
      current = (v1 - v3) / Math.max(rTotal * w, 0.001) + (v3 - v2) / Math.max(rTotal * (1 - w), 0.001);
    }
    else if (c.type === 'solar_panel') {
      const isc = c.properties.current || 0.5;
      const voc = c.properties.voltage || 6;
      current = isc - vDrop * (isc / voc);
    }
    else if (c.type === 'relay') {
      current = vDrop / (c.properties.coilResistance || 150);
    }
    else if (c.type === 'transistor_npn') {
      const v3 = nodeVoltages[getMappedNode(c.id, 2)];
      current = transistorStates[c.id] ? (v1 - v3 - 0.65) / 1 + (v2 - v3) * (c.properties.gain || 100) : 0;
    }
    else if (c.type === 'logic_gate_and' || c.type === 'logic_gate_or') {
      current = 0;
    }
    else if (c.type === 'transformer') {
      current = 0;
    }
    else if (c.type === 'battery') {
      let vIdx = -1;
      let count = 0;
      components.forEach(comp => {
        if (comp.type === 'battery') {
          if (comp.id === c.id) vIdx = numNodes + count;
          count++;
        } else if (comp.type === 'led' && ledStates[comp.id]) count++;
        else if (comp.type === 'rgb_led') {
          if (rgbLedStates[comp.id]?.r) count++;
          if (rgbLedStates[comp.id]?.g) count++;
          if (rgbLedStates[comp.id]?.b) count++;
        }
        else if (comp.type === 'zener_diode' && zenerStates[comp.id] === 'rev') count++;
        else if (comp.type === 'transistor_npn' && transistorStates[comp.id]) count++;
      });
      current = x[vIdx];
      totalPower += Math.abs(vDrop * current);
    }
    componentCurrents[c.id] = Math.abs(current);
  });

  const powerSources = components.filter(c => c.type === 'battery' || c.type === 'solar_panel');
  if (powerSources.length > 0) {
    const mainBat = powerSources[0];
    totalV = mainBat.properties.voltage || 9;
    totalI = componentCurrents[mainBat.id] || 0;
  }

  if (totalI > 50) {
    return { 
      error: 'OVERCURRENT', 
      message: 'Short circuit detected',
      nodeVoltages,
      componentCurrents,
      componentVoltages,
      req: totalI > 1e-6 ? totalV / totalI : Infinity,
      totalI,
      totalV,
      totalPower
    };
  }

  for (let i = 1; i <= numNodes; i++) {
    let kclSum = 0;
    components.forEach(c => {
      const n1 = getMappedNode(c.id, 0);
      const n2 = getMappedNode(c.id, 1);
      if (n1 === i) kclSum += componentCurrents[c.id];
      if (n2 === i) kclSum -= componentCurrents[c.id];
    });
    if (Math.abs(kclSum) > 1e-4) {
      console.warn(`[WARN] KCL violation at node ${i}: error = ${kclSum.toFixed(4)} A`);
    }
  }

  return {
    nodeVoltages,
    componentCurrents,
    componentVoltages,
    req: totalI > 1e-6 ? totalV / totalI : Infinity,
    totalI,
    totalV,
    totalPower
  };
}
