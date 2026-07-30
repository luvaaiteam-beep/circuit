import fs from 'fs';
let content = fs.readFileSync('src/utils/templates.ts', 'utf8');

const newTemplates = `
    case 'breadboard_led':
      components = [
        { id: 'bat1', type: 'battery', position: [-8, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'bb1', type: 'breadboard', position: [0, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'res1', type: 'resistor', position: [-3, 0.2, 0], rotation: [0, 0, 0], properties: { resistance: 330 } },
        { id: 'led1', type: 'led', position: [1, 0.2, 0], rotation: [0, 0, 0], properties: { color: '#ff0000' } }
      ];
      wires = [
        w('bat1', 1, 'bb1', 300), // V+ to rail +
        w('bat1', 0, 'bb1', 330), // V- to rail -
        w('bb1', 302, 'res1', 0), // rail + to resistor
        w('res1', 1, 'bb1', 50),  // resistor to row 10
        w('bb1', 51, 'led1', 0),  // row 10 to led anode
        w('led1', 1, 'bb1', 55),  // led cathode to row 11
        w('bb1', 56, 'bb1', 332)  // row 11 to rail -
      ];
      break;
    case 'push_button_led':
      components = [
        { id: 'bat1', type: 'battery', position: [-8, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'pb1', type: 'push_button', position: [-3, 0, 0], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'res1', type: 'resistor', position: [0, 0, 0], rotation: [0, 0, 0], properties: { resistance: 330 } },
        { id: 'led1', type: 'led', position: [3, 0, 0], rotation: [0, 0, 0], properties: { color: '#00ff00' } }
      ];
      wires = [
        w('bat1', 1, 'pb1', 0),
        w('pb1', 1, 'res1', 0),
        w('res1', 1, 'led1', 0),
        w('led1', 1, 'bat1', 0)
      ];
      break;
    case 'timer_blinker':
      components = [
        { id: 'bat1', type: 'battery', position: [-8, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'tim1', type: 'timer_555', position: [0, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'led1', type: 'led', position: [4, 0, -2], rotation: [0, 0, 0], properties: { color: '#ff0000' } }
      ];
      wires = [
        w('bat1', 1, 'tim1', 7), // VCC
        w('bat1', 0, 'tim1', 0), // GND
        w('tim1', 2, 'led1', 0), // OUT to LED
        w('led1', 1, 'bat1', 0)
      ];
      break;
    case 'ldr_night_light':
      components = [
        { id: 'bat1', type: 'battery', position: [-8, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'ldr1', type: 'photoresistor', position: [-3, 0, 2], rotation: [0, 0, 0], properties: { lightLevel: 20 } },
        { id: 'res1', type: 'resistor', position: [-3, 0, -2], rotation: [0, 0, 0], properties: { resistance: 10000 } },
        { id: 'trn1', type: 'transistor_npn', position: [0, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'led1', type: 'led', position: [3, 0, 2], rotation: [0, 0, 0], properties: { color: '#0000ff' } }
      ];
      wires = [
        w('bat1', 1, 'res1', 0),
        w('res1', 1, 'ldr1', 0), w('res1', 1, 'trn1', 1), // Divider to base
        w('ldr1', 1, 'bat1', 0),
        w('bat1', 1, 'led1', 0),
        w('led1', 1, 'trn1', 0), // Collector
        w('trn1', 2, 'bat1', 0) // Emitter
      ];
      break;
    case 'thermistor_divider':
      components = [
        { id: 'bat1', type: 'battery', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 5 } },
        { id: 'th1', type: 'thermistor', position: [-2, 0, 2], rotation: [0, 0, 0], properties: { temperature: 25 } },
        { id: 'res1', type: 'resistor', position: [-2, 0, -2], rotation: [0, 0, 0], properties: { resistance: 10000 } },
        { id: 'vm1', type: 'voltmeter', position: [2, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'th1', 0),
        w('th1', 1, 'res1', 0),
        w('res1', 1, 'bat1', 0),
        w('th1', 1, 'vm1', 0),
        w('bat1', 0, 'vm1', 1)
      ];
      break;
    case 'opamp_comparator':
      components = [
        { id: 'bat1', type: 'battery', position: [-8, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'op1', type: 'op_amp', position: [0, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'pot1', type: 'potentiometer', position: [-4, 0, 3], rotation: [0, 0, 0], properties: { value: 0.5, maxResistance: 10000 } },
        { id: 'res1', type: 'resistor', position: [-4, 0, -3], rotation: [0, 0, 0], properties: { resistance: 10000 } },
        { id: 'led1', type: 'led', position: [4, 0, 0], rotation: [0, 0, 0], properties: { color: '#ff00ff' } }
      ];
      wires = [
        w('bat1', 1, 'op1', 7), w('bat1', 0, 'op1', 3), // Power
        w('bat1', 1, 'pot1', 0), w('bat1', 0, 'pot1', 2), w('pot1', 1, 'op1', 2), // Non-inv
        w('bat1', 1, 'res1', 0), w('res1', 1, 'op1', 1), // Inv
        w('op1', 0, 'led1', 0), w('led1', 1, 'bat1', 0) // Out
      ];
      break;
    case 'mosfet_switch':
      components = [
        { id: 'bat1', type: 'battery', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 12 } },
        { id: 'sw1', type: 'switch', position: [-2, 0, 3], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'mot1', type: 'motor', position: [2, 0, -3], rotation: [0, 0, 0], properties: {} },
        { id: 'mos1', type: 'mosfet_n', position: [2, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('sw1', 1, 'mos1', 2), // Gate
        w('bat1', 1, 'mot1', 0), w('mot1', 1, 'mos1', 0), // Drain
        w('mos1', 1, 'bat1', 0) // Source
      ];
      break;
    case 'pnp_switch':
      components = [
        { id: 'bat1', type: 'battery', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-2, 0, 2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'res1', type: 'resistor', position: [0, 0, 2], rotation: [0, 0, 0], properties: { resistance: 1000 } },
        { id: 'led1', type: 'led', position: [2, 0, -2], rotation: [0, 0, 0], properties: { color: '#00ffff' } },
        { id: 'pnp1', type: 'transistor_pnp', position: [2, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'pnp1', 2), // Emitter to V+
        w('pnp1', 1, 'res1', 0), w('res1', 1, 'sw1', 0), w('sw1', 1, 'bat1', 0), // Base to switch to Gnd
        w('pnp1', 0, 'led1', 0), w('led1', 1, 'bat1', 0) // Collector to LED to Gnd
      ];
      break;
    case 'bench_supply_demo':
      components = [
        { id: 'ps1', type: 'power_supply', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 5.0 } },
        { id: 'vm1', type: 'voltmeter', position: [2, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('ps1', 1, 'vm1', 0),
        w('ps1', 0, 'vm1', 1)
      ];
      break;
`;

content = content.replace("case 'rgb_mixer':", newTemplates + "\n    case 'rgb_mixer':");

fs.writeFileSync('src/utils/templates.ts', content);
