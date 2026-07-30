import fs from 'fs';
let content = fs.readFileSync('src/circuitSolver.ts', 'utf8');

// Update vSources creation
content = content.replace(
  `      if (c.type === 'battery') vSources.push({ id: c.id, n1: getMappedNode(c.id, 0), n2: getMappedNode(c.id, 1), v: c.properties.voltage || 9 });`,
  `      if (c.type === 'battery') vSources.push({ id: c.id, n1: getMappedNode(c.id, 0), n2: getMappedNode(c.id, 1), v: c.properties.voltage || 9 });\n      else if (c.type === 'power_supply') vSources.push({ id: c.id, n1: getMappedNode(c.id, 0), n2: getMappedNode(c.id, 1), v: c.properties.voltage || 5.0 });`
);

content = content.replace(
  `      else if (c.type === 'transistor_npn' && transistorStates[c.id]) vSources.push({ id: \`\${c.id}_v\`, n1: getMappedNode(c.id, 2), n2: getMappedNode(c.id, 0), v: 0.65 });`,
  `      else if (c.type === 'transistor_npn' && transistorStates[c.id]) vSources.push({ id: \`\${c.id}_v\`, n1: getMappedNode(c.id, 2), n2: getMappedNode(c.id, 0), v: 0.65 });\n      else if (c.type === 'transistor_pnp' && transistorStates[c.id]) vSources.push({ id: \`\${c.id}_v\`, n1: getMappedNode(c.id, 0), n2: getMappedNode(c.id, 2), v: 0.65 });`
);

// Update admittance matrix filling
const oldAdmittanceSwitch = `      if (c.type === 'resistor') g = 1 / (c.properties.resistance || 100);`;
const newAdmittanceSwitch = `      if (c.type === 'resistor') g = 1 / (c.properties.resistance || 100);
      else if (c.type === 'photoresistor') {
        const light = c.properties.lightLevel ?? 50; // 0 to 100
        const r = 10000 - (light * 90); // 10k dark, 1k bright
        g = 1 / Math.max(r, 100);
      }
      else if (c.type === 'thermistor') {
        const temp = c.properties.temperature ?? 25;
        const r = 10000 * Math.exp(-0.04 * (temp - 25)); // NTC behavior
        g = 1 / Math.max(r, 10);
      }
      else if (c.type === 'push_button') g = c.properties.closed ? 1000 : 1e-12;`;
content = content.replace(oldAdmittanceSwitch, newAdmittanceSwitch);

const oldTransistorNPN = `      else if (c.type === 'transistor_npn') {
        const n3 = getMappedNode(c.id, 2);
        addAdmittance(n1, n3, transistorStates[c.id] ? 1 : 1e-12);
        addAdmittance(n2, n3, transistorStates[c.id] ? (c.properties.gain || 100) : 1e-12);
      }`;
const newTransistorNPN = `      else if (c.type === 'transistor_npn') {
        const n3 = getMappedNode(c.id, 2);
        addAdmittance(n1, n3, transistorStates[c.id] ? 1 : 1e-12);
        addAdmittance(n2, n3, transistorStates[c.id] ? (c.properties.gain || 100) : 1e-12);
      }
      else if (c.type === 'transistor_pnp') {
        const n3 = getMappedNode(c.id, 2);
        addAdmittance(n3, n1, transistorStates[c.id] ? 1 : 1e-12);
        addAdmittance(n3, n2, transistorStates[c.id] ? (c.properties.gain || 100) : 1e-12);
      }
      else if (c.type === 'mosfet_n') {
        const n3 = getMappedNode(c.id, 2); // gate
        const vGate = nodeVoltages[n3] || 0;
        const vSource = nodeVoltages[n1] || 0;
        const vgs = vGate - vSource;
        const th = c.properties.thresholdVoltage || 2.0;
        const isOn = vgs > th;
        addAdmittance(n2, n1, isOn ? 1000 : 1e-12); // drain to source
        addAdmittance(n3, n1, 1e-12); // gate to source
      }
      else if (c.type === 'op_amp') {
        // Simple comparator/follower model
        const vInP = nodeVoltages[getMappedNode(c.id, 2)] || 0; // pin 3 is non-inv
        const vInN = nodeVoltages[getMappedNode(c.id, 1)] || 0; // pin 2 is inv
        const vVcc = nodeVoltages[getMappedNode(c.id, 7)] || 0; // pin 8 is vcc
        const vGnd = nodeVoltages[getMappedNode(c.id, 3)] || 0; // pin 4 is gnd
        const diff = vInP - vInN;
        const outNode = getMappedNode(c.id, 0); // pin 1 is out
        
        let outV = vGnd;
        if (diff > 0.01) outV = vVcc - 1.5; // High (with some drop)
        else if (diff < -0.01) outV = vGnd + 0.1; // Low
        else outV = (vVcc - vGnd) / 2; // linear region loosely

        // Inject output voltage as current source or high admittance
        // We'll use a Norton equivalent for simplicity (source V, series R 100 ohm)
        addAdmittance(outNode, 0, 1/100);
        if (outNode > 0) b[outNode - 1] += outV / 100;
      }
      else if (c.type === 'timer_555') {
        // Extremely simplified 555 model (just blink if configured as astable)
        // Check if TRIG/THRES are connected to something
        const outNode = getMappedNode(c.id, 2); // pin 3 is OUT
        const vVcc = nodeVoltages[getMappedNode(c.id, 7)] || 0; // pin 8 VCC
        
        // Use a simple oscillating state based on iteration or global time if possible
        // But MNA is static. So just set output HIGH to prove it does something.
        // Or blink based on internal component state. Let's make it a constant HIGH for now, 
        // to avoid complex simulation.
        addAdmittance(outNode, 0, 1/100);
        if (outNode > 0) b[outNode - 1] += (vVcc - 1.5) / 100;
      }`;
content = content.replace(oldTransistorNPN, newTransistorNPN);

// Update component states check at end of iter
const oldTransistorNPNState = `      } else if (c.type === 'transistor_npn') {
        const v3 = nodeVoltages[getMappedNode(c.id, 2)];
        const vbe = v1 - v3;
        const newState = vbe > 0.65;
        if (transistorStates[c.id] !== newState) { transistorStates[c.id] = newState; changed = true; }
      }`;
const newTransistorNPNState = `      } else if (c.type === 'transistor_npn') {
        const v3 = nodeVoltages[getMappedNode(c.id, 2)];
        const vbe = v1 - v3;
        const newState = vbe > 0.65;
        if (transistorStates[c.id] !== newState) { transistorStates[c.id] = newState; changed = true; }
      } else if (c.type === 'transistor_pnp') {
        const v3 = nodeVoltages[getMappedNode(c.id, 2)];
        const veb = v1 - v3;
        const newState = veb > 0.65;
        if (transistorStates[c.id] !== newState) { transistorStates[c.id] = newState; changed = true; }
      }`;
content = content.replace(oldTransistorNPNState, newTransistorNPNState);

// Update current calculation
const oldCurrent = `    else if (c.type === 'resistor') current = vDrop / (c.properties.resistance || 100);`;
const newCurrent = `    else if (c.type === 'resistor') current = vDrop / (c.properties.resistance || 100);
    else if (c.type === 'push_button') current = vDrop / (c.properties.closed ? 0.001 : 1e12);
    else if (c.type === 'photoresistor') current = vDrop / Math.max(10000 - ((c.properties.lightLevel ?? 50) * 90), 100);
    else if (c.type === 'thermistor') current = vDrop / Math.max(10000 * Math.exp(-0.04 * ((c.properties.temperature ?? 25) - 25)), 10);
`;
content = content.replace(oldCurrent, newCurrent);

const oldBatteryCurrent = `    else if (c.type === 'battery') {`;
const newBatteryCurrent = `    else if (c.type === 'battery' || c.type === 'power_supply') {`;
content = content.replace(oldBatteryCurrent, newBatteryCurrent);

fs.writeFileSync('src/circuitSolver.ts', content);
