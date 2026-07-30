import fs from 'fs';
let content = fs.readFileSync('src/components/UI.tsx', 'utf8');

const newMenuItems = `
              { type: 'breadboard', category: 'Passive', icon: Grid, color: 'text-zinc-300', border: 'border-zinc-300/30', bg: 'bg-zinc-300/10', label: 'Breadboard', desc: 'Solderless Board' },
              { type: 'ground', category: 'Sources', icon: ArrowRightToLine, color: 'text-green-500', border: 'border-green-500/30', bg: 'bg-green-500/10', label: 'Ground', desc: '0V Reference' },
              { type: 'push_button', category: 'Active', icon: ToggleLeft, color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10', label: 'Push Button', desc: 'Momentary Switch' },
              { type: 'transistor_pnp', category: 'Active', icon: Cpu, color: 'text-gray-400', border: 'border-gray-400/30', bg: 'bg-gray-400/10', label: 'PNP Transistor', desc: 'BJT PNP' },
              { type: 'mosfet_n', category: 'Active', icon: Cpu, color: 'text-gray-400', border: 'border-gray-400/30', bg: 'bg-gray-400/10', label: 'N-MOSFET', desc: 'Enhancement' },
              { type: 'timer_555', category: 'Active', icon: Cpu, color: 'text-indigo-400', border: 'border-indigo-400/30', bg: 'bg-indigo-400/10', label: '555 Timer', desc: 'Oscillator/Timer' },
              { type: 'op_amp', category: 'Active', icon: Cpu, color: 'text-indigo-500', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', label: 'Op-Amp', desc: 'LM358' },
              { type: 'photoresistor', category: 'Passive', icon: Sun, color: 'text-red-400', border: 'border-red-400/30', bg: 'bg-red-400/10', label: 'Photoresistor', desc: 'LDR' },
              { type: 'thermistor', category: 'Passive', icon: Activity, color: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', label: 'Thermistor', desc: 'Temp Sensor' },
              { type: 'power_supply', category: 'Sources', icon: Battery, color: 'text-cyan-500', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', label: 'Power Supply', desc: 'Variable DC' },
`;

// There are two arrays: one around line 500, one around line 914.
// Find the first array
content = content.replace(
  "{ type: 'ammeter', category: 'Meters', icon: Activity, color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'Ammeter', desc: 'Measures Current' },",
  "{ type: 'ammeter', category: 'Meters', icon: Activity, color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'Ammeter', desc: 'Measures Current' },\n" + newMenuItems
);

content = content.replace(
  "{ type: 'ammeter', category: 'Meters', icon: Activity, color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'Ammeter', desc: 'Measure I' },",
  "{ type: 'ammeter', category: 'Meters', icon: Activity, color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/10', label: 'Ammeter', desc: 'Measure I' },\n" + newMenuItems
);

fs.writeFileSync('src/components/UI.tsx', content);
