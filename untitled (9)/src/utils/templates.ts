export const getTemplate = (type: string) => {
  let components: any[] = [];
  let wires: any[] = [];

  const w = (c1: string, p1: number, c2: string, p2: number, id?: string) => ({
    id: id || `w_${Math.random()}`,
    from: { compId: c1, pinIdx: p1 },
    to: { compId: c2, pinIdx: p2 }
  });

  switch (type) {
    case 'basic_led':
      components = [
        { id: 'bat1', type: 'battery', position: [-4, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 0], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'res1', type: 'resistor', position: [2, 0, 0], rotation: [0, 0, 0], properties: { resistance: 330 } },
        { id: 'led1', type: 'led', position: [5, 0, 0], rotation: [0, Math.PI / 2, 0], properties: { color: '#ff0000' } }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0),
        w('sw1', 1, 'res1', 0),
        w('res1', 1, 'led1', 0),
        w('led1', 1, 'bat1', 0)
      ];
      break;

    case 'voltage_divider':
      components = [
        { id: 'bat1', type: 'battery', position: [-5, 0, 0], rotation: [0, 0, 0], properties: { voltage: 12 } },
        { id: 'res1', type: 'resistor', position: [0, 0, 2], rotation: [0, 0, 0], properties: { resistance: 1000 } },
        { id: 'res2', type: 'resistor', position: [0, 0, -2], rotation: [0, 0, 0], properties: { resistance: 1000 } },
        { id: 'vm1', type: 'voltmeter', position: [4, 0, -2], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'res1', 0),
        w('res1', 1, 'res2', 0),
        w('res2', 1, 'bat1', 0),
        w('res1', 1, 'vm1', 0),
        w('res2', 1, 'vm1', 1)
      ];
      break;

    case 'h_bridge': // using 4 switches
      components = [
        { id: 'bat1', type: 'battery', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-2, 0, 3], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw2', type: 'switch', position: [2, 0, 3], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw3', type: 'switch', position: [-2, 0, -3], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw4', type: 'switch', position: [2, 0, -3], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'mot1', type: 'motor', position: [0, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('bat1', 1, 'sw2', 0),
        w('sw1', 1, 'mot1', 0), w('sw2', 1, 'mot1', 1),
        w('sw3', 0, 'mot1', 0), w('sw4', 0, 'mot1', 1),
        w('bat1', 0, 'sw3', 1), w('bat1', 0, 'sw4', 1)
      ];
      break;

    case 'transistor_switch':
      components = [
        { id: 'bat1', type: 'battery', position: [-5, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'res1', type: 'resistor', position: [2, 0, 2], rotation: [0, 0, 0], properties: { resistance: 1000 } },
        { id: 'led1', type: 'led', position: [2, 0, -2], rotation: [0, Math.PI / 2, 0], properties: { color: '#00ff00' } },
        { id: 'trn1', type: 'transistor_npn', position: [5, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('sw1', 1, 'res1', 0), w('res1', 1, 'trn1', 1), // Base
        w('bat1', 1, 'led1', 0), w('led1', 1, 'trn1', 0), // Collector
        w('trn1', 2, 'bat1', 0) // Emitter
      ];
      break;

    case 'logic_and':
      components = [
        { id: 'bat1', type: 'battery', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-3, 0, 2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw2', type: 'switch', position: [-3, 0, -2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'and1', type: 'logic_gate_and', position: [1, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'led1', type: 'led', position: [5, 0, 0], rotation: [0, Math.PI / 2, 0], properties: { color: '#00ff00' } }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('bat1', 1, 'sw2', 0),
        w('sw1', 1, 'and1', 0), w('sw2', 1, 'and1', 1),
        w('and1', 2, 'led1', 0), w('led1', 1, 'bat1', 0)
      ];
      break;

    case 'logic_or':
      components = [
        { id: 'bat1', type: 'battery', position: [-6, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-3, 0, 2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw2', type: 'switch', position: [-3, 0, -2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'or1', type: 'logic_gate_or', position: [1, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'led1', type: 'led', position: [5, 0, 0], rotation: [0, Math.PI / 2, 0], properties: { color: '#ff0000' } }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('bat1', 1, 'sw2', 0),
        w('sw1', 1, 'or1', 0), w('sw2', 1, 'or1', 1),
        w('or1', 2, 'led1', 0), w('led1', 1, 'bat1', 0)
      ];
      break;
      
    case 'rc_circuit':
      components = [
        { id: 'bat1', type: 'battery', position: [-5, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 0], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'res1', type: 'resistor', position: [2, 0, 0], rotation: [0, 0, 0], properties: { resistance: 1000 } },
        { id: 'cap1', type: 'capacitor', position: [5, 0, 0], rotation: [0, 0, 0], properties: { capacitance: 0.001 } }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('sw1', 1, 'res1', 0),
        w('res1', 1, 'cap1', 0), w('cap1', 1, 'bat1', 0)
      ];
      break;

    case 'rl_circuit':
      components = [
        { id: 'bat1', type: 'battery', position: [-5, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 0], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'res1', type: 'resistor', position: [2, 0, 0], rotation: [0, 0, 0], properties: { resistance: 330 } },
        { id: 'ind1', type: 'inductor', position: [5, 0, 0], rotation: [0, 0, 0], properties: { inductance: 0.1 } }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('sw1', 1, 'res1', 0),
        w('res1', 1, 'ind1', 0), w('ind1', 1, 'bat1', 0)
      ];
      break;

    case 'relay_latch':
      components = [
        { id: 'bat1', type: 'battery', position: [-5, 0, 0], rotation: [0, 0, 0], properties: { voltage: 12 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'rel1', type: 'relay', position: [2, 0, 0], rotation: [0, 0, 0], properties: {} },
        { id: 'mot1', type: 'motor', position: [2, 0, -3], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('sw1', 1, 'rel1', 0), w('rel1', 1, 'bat1', 0),
        w('bat1', 1, 'rel1', 2), w('rel1', 3, 'mot1', 0), w('mot1', 1, 'bat1', 0)
      ];
      break;

    case 'motor_driver':
      components = [
        { id: 'bat1', type: 'battery', position: [-4, 0, 0], rotation: [0, 0, 0], properties: { voltage: 9 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 0], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'pot1', type: 'potentiometer', position: [2, 0, 0], rotation: [0, 0, 0], properties: { value: 0.5, maxResistance: 1000 } },
        { id: 'mot1', type: 'motor', position: [5, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('sw1', 1, 'pot1', 0),
        w('pot1', 1, 'mot1', 0), w('mot1', 1, 'bat1', 0)
      ];
      break;
      
    case 'rgb_mixer':
      components = [
        { id: 'bat1', type: 'battery', position: [-5, 0, 0], rotation: [0, 0, 0], properties: { voltage: 5 } },
        { id: 'sw1', type: 'switch', position: [-1, 0, 2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw2', type: 'switch', position: [-1, 0, 0], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'sw3', type: 'switch', position: [-1, 0, -2], rotation: [0, 0, 0], properties: { closed: false } },
        { id: 'rgb1', type: 'rgb_led', position: [3, 0, 0], rotation: [0, 0, 0], properties: {} }
      ];
      wires = [
        w('bat1', 1, 'sw1', 0), w('bat1', 1, 'sw2', 0), w('bat1', 1, 'sw3', 0),
        w('sw1', 1, 'rgb1', 0), w('sw2', 1, 'rgb1', 1), w('sw3', 1, 'rgb1', 2),
        w('rgb1', 3, 'bat1', 0)
      ];
      break;
  }

  return { components, wires };
};
