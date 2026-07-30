import fs from 'fs';
let content = fs.readFileSync('src/circuitSolver.ts', 'utf8');

// 1. Initial pin-to-node setup
const pinSetupOld = `  components.forEach(c => {
    pinToNode[getPinKey(c.id, 0)] = nextNodeId++;
    pinToNode[getPinKey(c.id, 1)] = nextNodeId++;
    if (c.type === 'potentiometer' || c.type === 'transistor_npn') {
      pinToNode[getPinKey(c.id, 2)] = nextNodeId++;
    }
    if (c.type === 'rgb_led' || c.type === 'transformer' || c.type === 'relay') {
      pinToNode[getPinKey(c.id, 2)] = nextNodeId++;
      pinToNode[getPinKey(c.id, 3)] = nextNodeId++;
    }
  });`;

const pinSetupNew = `  components.forEach(c => {
    if (c.type === 'breadboard') {
      for (let i = 0; i < 420; i++) pinToNode[getPinKey(c.id, i)] = nextNodeId++;
    } else if (c.type === 'ground') {
      pinToNode[getPinKey(c.id, 0)] = nextNodeId++;
    } else {
      pinToNode[getPinKey(c.id, 0)] = nextNodeId++;
      pinToNode[getPinKey(c.id, 1)] = nextNodeId++;
      if (['potentiometer', 'transistor_npn', 'transistor_pnp', 'mosfet_n'].includes(c.type)) {
        pinToNode[getPinKey(c.id, 2)] = nextNodeId++;
      }
      if (['rgb_led', 'transformer', 'relay'].includes(c.type)) {
        pinToNode[getPinKey(c.id, 2)] = nextNodeId++;
        pinToNode[getPinKey(c.id, 3)] = nextNodeId++;
      }
      if (['timer_555', 'op_amp'].includes(c.type)) {
        for (let i=2; i<8; i++) pinToNode[getPinKey(c.id, i)] = nextNodeId++;
      }
    }
  });`;
content = content.replace(pinSetupOld, pinSetupNew);

// 2. Add spatial overlap and internal breadboard union logic
const spatialOverlapCode = `
  wires.forEach(w => {
    const p1 = getPinKey(w.from.compId, w.from.pinIdx);
    const p2 = getPinKey(w.to.compId, w.to.pinIdx);
    if (pinToNode[p1] !== undefined && pinToNode[p2] !== undefined) {
      union(pinToNode[p1], pinToNode[p2]);
    }
  });

  // Handle Breadboard Internal Connections
  components.forEach(c => {
    if (c.type === 'breadboard') {
      for (let row = 0; row < 30; row++) {
        for (let col = 1; col < 5; col++) union(pinToNode[getPinKey(c.id, row * 5)], pinToNode[getPinKey(c.id, row * 5 + col)]);
        for (let col = 1; col < 5; col++) union(pinToNode[getPinKey(c.id, 150 + row * 5)], pinToNode[getPinKey(c.id, 150 + row * 5 + col)]);
      }
      for (let i = 1; i < 30; i++) union(pinToNode[getPinKey(c.id, 300)], pinToNode[getPinKey(c.id, 300 + i)]);
      for (let i = 1; i < 30; i++) union(pinToNode[getPinKey(c.id, 330)], pinToNode[getPinKey(c.id, 330 + i)]);
      for (let i = 1; i < 30; i++) union(pinToNode[getPinKey(c.id, 360)], pinToNode[getPinKey(c.id, 360 + i)]);
      for (let i = 1; i < 30; i++) union(pinToNode[getPinKey(c.id, 390)], pinToNode[getPinKey(c.id, 390 + i)]);
    }
  });

  // Handle Spatial Snapping
  const { getPinOffset } = require('./utils') || await import('./utils.js').catch(() => ({}));
  if (getPinOffset) {
    const getAbsPos = (c, pinIdx) => {
      const offset = getPinOffset(c.type, pinIdx);
      const angle = c.rotation ? c.rotation[1] : 0;
      const rx = offset[0] * Math.cos(angle) - offset[2] * Math.sin(angle);
      const rz = offset[0] * Math.sin(angle) + offset[2] * Math.cos(angle);
      return { x: c.position[0] + rx, z: c.position[2] + rz };
    };

    const pinAbsPositions = [];
    components.forEach(c => {
      let numPins = 2;
      if (c.type === 'breadboard') numPins = 420;
      else if (c.type === 'ground') numPins = 1;
      else if (['potentiometer', 'transistor_npn', 'transistor_pnp', 'mosfet_n'].includes(c.type)) numPins = 3;
      else if (['rgb_led', 'transformer', 'relay'].includes(c.type)) numPins = 4;
      else if (['timer_555', 'op_amp'].includes(c.type)) numPins = 8;
      
      for (let i = 0; i < numPins; i++) {
        pinAbsPositions.push({ compId: c.id, pinIdx: i, pos: getAbsPos(c, i) });
      }
    });

    for (let i = 0; i < pinAbsPositions.length; i++) {
      for (let j = i + 1; j < pinAbsPositions.length; j++) {
        const p1 = pinAbsPositions[i];
        const p2 = pinAbsPositions[j];
        if (p1.compId === p2.compId) continue;
        const dx = p1.pos.x - p2.pos.x;
        const dz = p1.pos.z - p2.pos.z;
        if (Math.abs(dx) < 0.25 && Math.abs(dz) < 0.25) {
          union(pinToNode[getPinKey(p1.compId, p1.pinIdx)], pinToNode[getPinKey(p2.compId, p2.pinIdx)]);
        }
      }
    }
  }

  // Handle Ground
  components.forEach(c => {
    if (c.type === 'ground') {
      const root = find(pinToNode[getPinKey(c.id, 0)]);
      // Force this node to be mapped to 0 (Ground) later by ensuring it's selected as currentZeroRoot
      c.isGroundNode = root;
    }
  });
`;

content = content.replace(`  wires.forEach(w => {
    const p1 = getPinKey(w.from.compId, w.from.pinIdx);
    const p2 = getPinKey(w.to.compId, w.to.pinIdx);
    if (pinToNode[p1] !== undefined && pinToNode[p2] !== undefined) {
      union(pinToNode[p1], pinToNode[p2]);
    }
  });`, spatialOverlapCode);

// 3. Force ground to be node 0
content = content.replace(`  const batteries = components.filter(c => c.type === 'battery' || c.type === 'solar_panel');
  if (batteries.length > 0) {
    const batNegRoot = find(pinToNode[getPinKey(batteries[0].id, 0)]);
    const currentZeroRoot = Array.from(uniqueNodes).find(root => nodeMap.get(root) === 0);
    if (currentZeroRoot !== undefined && batNegRoot !== currentZeroRoot) {
      nodeMap.set(currentZeroRoot, nodeMap.get(batNegRoot)!);
      nodeMap.set(batNegRoot, 0);
    }
  }`, `  const batteries = components.filter(c => c.type === 'battery' || c.type === 'power_supply' || c.type === 'solar_panel');
  const grounds = components.filter(c => c.type === 'ground');
  let zeroRootToUse = null;
  
  if (grounds.length > 0) {
    zeroRootToUse = find(pinToNode[getPinKey(grounds[0].id, 0)]);
  } else if (batteries.length > 0) {
    zeroRootToUse = find(pinToNode[getPinKey(batteries[0].id, 0)]);
  }

  if (zeroRootToUse !== null) {
    const currentZeroRoot = Array.from(uniqueNodes).find(root => nodeMap.get(root) === 0);
    if (currentZeroRoot !== undefined && zeroRootToUse !== currentZeroRoot) {
      nodeMap.set(currentZeroRoot, nodeMap.get(zeroRootToUse)!);
      nodeMap.set(zeroRootToUse, 0);
    }
  }`);

fs.writeFileSync('src/circuitSolver.ts', content);
