import fs from 'fs';
let content = fs.readFileSync('src/components/UI.tsx', 'utf8');

const newUItems = `
                { id: 'breadboard_led', name: 'Breadboard LED', desc: 'LED on a Breadboard' },
                { id: 'push_button_led', name: 'Push Button LED', desc: 'Momentary Switch Demo' },
                { id: 'timer_blinker', name: '555 Timer Blinker', desc: 'Astable Multivibrator' },
                { id: 'ldr_night_light', name: 'LDR Night Light', desc: 'Photoresistor + Transistor' },
                { id: 'thermistor_divider', name: 'Thermistor Sensor', desc: 'Temperature Voltage Divider' },
                { id: 'opamp_comparator', name: 'Op-Amp Comparator', desc: 'LM358 Comparator Circuit' },
                { id: 'mosfet_switch', name: 'MOSFET Motor Switch', desc: 'N-Channel MOSFET Demo' },
                { id: 'pnp_switch', name: 'PNP Transistor Switch', desc: 'High-side switching' },
                { id: 'bench_supply_demo', name: 'Bench Power Supply', desc: 'Variable Voltage Source' },
`;

content = content.replace(
  "{ id: 'basic_led', name: 'Basic LED Circuit', desc: 'Battery, Switch, Resistor, LED' },",
  "{ id: 'basic_led', name: 'Basic LED Circuit', desc: 'Battery, Switch, Resistor, LED' },\n" + newUItems
);

fs.writeFileSync('src/components/UI.tsx', content);
