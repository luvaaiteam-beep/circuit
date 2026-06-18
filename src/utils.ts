export const getPinOffset = (type: string, pinIdx: number): [number, number, number] => {
  switch (type) {
    case 'battery': return pinIdx === 0 ? [-1.05, 0, 0] : [1.05, 0, 0];
    case 'resistor': return pinIdx === 0 ? [-1.05, 0, 0] : [1.05, 0, 0];
    case 'led': return pinIdx === 0 ? [-0.68, -0.3, 0] : [0.68, -0.3, 0];
    case 'switch': return pinIdx === 0 ? [-0.76, 0, 0] : [0.76, 0, 0];
    case 'capacitor': return pinIdx === 0 ? [-0.52, -0.4, 0] : [0.52, -0.4, 0];
    case 'bulb': return pinIdx === 0 ? [-0.58, -0.2, 0] : [0.58, -0.2, 0];
    case 'diode': return pinIdx === 0 ? [-0.9, 0, 0] : [0.9, 0, 0];
    case 'inductor': return pinIdx === 0 ? [-1.05, 0, 0] : [1.05, 0, 0];
    case 'motor': return pinIdx === 0 ? [-0.4, 0.2, 0] : [-0.4, -0.2, 0];
    case 'buzzer': return pinIdx === 0 ? [-0.4, 0, 0] : [0.4, 0, 0];
    case 'voltmeter': return pinIdx === 0 ? [-0.6, 0.2, 0] : [0.6, 0.2, 0];
    case 'ammeter': return pinIdx === 0 ? [-0.6, 0.2, 0] : [0.6, 0.2, 0];
    case 'potentiometer': return pinIdx === 0 ? [-0.5, 0.1, 0] : pinIdx === 1 ? [0.5, 0.1, 0] : [0, 0.1, 0.5];
    case 'transistor_npn': return pinIdx === 0 ? [-0.3, 0, 0] : pinIdx === 1 ? [0.3, 0, 0] : [0, 0, 0.3];
    case 'transformer': return pinIdx === 0 ? [-0.6, 0.1, -0.2] : pinIdx === 1 ? [-0.6, 0.1, 0.2] : pinIdx === 2 ? [0.6, 0.1, -0.2] : [0.6, 0.1, 0.2];
    case 'fuse': return pinIdx === 0 ? [-0.5, 0.1, 0] : [0.5, 0.1, 0];
    case 'solar_panel': return pinIdx === 0 ? [-0.8, 0.05, 0] : [0.8, 0.05, 0];
    case 'logic_gate_and': return pinIdx === 0 ? [-0.5, 0.1, -0.2] : pinIdx === 1 ? [-0.5, 0.1, 0.2] : [0.5, 0.1, 0];
    case 'logic_gate_or': return pinIdx === 0 ? [-0.5, 0.1, -0.2] : pinIdx === 1 ? [-0.5, 0.1, 0.2] : [0.5, 0.1, 0];
    case 'rgb_led': return pinIdx === 0 ? [-0.4, 0, -0.2] : pinIdx === 1 ? [-0.4, 0, 0] : pinIdx === 2 ? [-0.4, 0, 0.2] : [0.4, 0, 0];
    case 'zener_diode': return pinIdx === 0 ? [-0.5, 0, 0] : [0.5, 0, 0];
    case 'relay': return pinIdx === 0 ? [-0.6, 0.1, -0.2] : pinIdx === 1 ? [-0.6, 0.1, 0.2] : pinIdx === 2 ? [0.6, 0.1, -0.2] : [0.6, 0.1, 0.2];
    default: return [0, 0, 0];
  }
};
