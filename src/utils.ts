export const getPinOffset = (type: string, pinIdx: number): [number, number, number] => {
  if (type === 'breadboard') {
    let x = 0, z = 0;
    if (pinIdx < 150) {
      x = -7.25 + Math.floor(pinIdx / 5) * 0.5;
      z = -2.25 + (pinIdx % 5) * 0.5;
    } else if (pinIdx < 300) {
      x = -7.25 + Math.floor((pinIdx - 150) / 5) * 0.5;
      z = 0.25 + ((pinIdx - 150) % 5) * 0.5;
    } else if (pinIdx < 330) {
      x = -7.25 + (pinIdx - 300) * 0.5;
      z = -3.5;
    } else if (pinIdx < 360) {
      x = -7.25 + (pinIdx - 330) * 0.5;
      z = -3.0;
    } else if (pinIdx < 390) {
      x = -7.25 + (pinIdx - 360) * 0.5;
      z = 3.0;
    } else if (pinIdx < 420) {
      x = -7.25 + (pinIdx - 390) * 0.5;
      z = 3.5;
    }
    return [x, 0, z];
  }

  switch (type) {
    case 'ground': return [0, 0, 0];
    case 'push_button': return pinIdx === 0 ? [-0.5, 0, 0] : [0.5, 0, 0];
    case 'transistor_pnp': return pinIdx === 0 ? [-0.3, 0, 0] : pinIdx === 1 ? [0.3, 0, 0] : [0, 0, 0.3];
    case 'mosfet_n': return pinIdx === 0 ? [-0.3, 0, 0] : pinIdx === 1 ? [0.3, 0, 0] : [0, 0, 0.3];
    case 'timer_555': 
    case 'op_amp':
      // 8-pin DIP package
      // Pins 1-4 on bottom (Z=0.5), Pins 5-8 on top (Z=-0.5)
      // Pin 1: bottom-left, Pin 4: bottom-right, Pin 5: top-right, Pin 8: top-left
      if (pinIdx < 4) return [-0.75 + pinIdx * 0.5, 0, 0.5];
      else return [0.75 - (pinIdx - 4) * 0.5, 0, -0.5];
    case 'photoresistor': return pinIdx === 0 ? [-0.5, 0, 0] : [0.5, 0, 0];
    case 'thermistor': return pinIdx === 0 ? [-0.5, 0, 0] : [0.5, 0, 0];
    case 'power_supply': return pinIdx === 0 ? [-1.0, 0, 0] : [1.0, 0, 0];
    
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
