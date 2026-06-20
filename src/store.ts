import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { solveCircuit } from './circuitSolver';

export type ComponentType = 'battery' | 'resistor' | 'led' | 'switch' | 'capacitor' | 'bulb' | 'diode' | 'inductor' | 'motor' | 'buzzer' | 'voltmeter' | 'ammeter' | 'potentiometer' | 'transistor_npn' | 'transformer' | 'fuse' | 'solar_panel' | 'logic_gate_and' | 'logic_gate_or' | 'rgb_led' | 'zener_diode' | 'relay';

export interface LogEntry {
  id: string;
  time: string;
  msg: string;
  type: 'info' | 'cmd' | 'error' | 'success';
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  position: [number, number, number];
  rotation: [number, number, number];
  properties: any;
}

export interface WireData {
  id: string;
  from: { compId: string; pinIdx: number };
  to: { compId: string; pinIdx: number };
}

export type ToolType = 'select' | 'wire' | 'delete' | ComponentType;

interface CircuitState {
  components: ComponentData[];
  wires: WireData[];
  history: Array<{ components: ComponentData[], wires: WireData[] }>;
  historyIndex: number;
  selectedCompId: string | null;
  activeTool: ToolType;
  wirePhase: { compId: string; pinIdx: number } | null;
  simRunning: boolean;
  simStats: { v: number; i: number; r: number; p: number; closed: boolean };
  poweredComps: Record<string, any>;
  componentVoltages: Record<string, number>;
  componentCurrents: Record<string, number>;
  orbitEnabled: boolean;
  isDragging: boolean;
  draggingCompId: string | null;
  snapToGrid: boolean;
  toastMessage: string | null;
  toastType: 'info' | 'cmd' | 'error' | 'success';
  logs: LogEntry[];
  clipboard: ComponentData | null;

  circuitName: string;
  zoomToFitRequested: boolean;

  addLog: (msg: string, type?: 'info' | 'cmd' | 'error' | 'success') => void;
  loadCircuit: (data: string) => void;

  setCircuitName: (name: string) => void;
  zoomToFit: () => void;
  setZoomToFitRequested: (requested: boolean) => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  addComponent: (type: ComponentType, position: [number, number, number]) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>, skipHistory?: boolean) => void;
  removeComponent: (id: string) => void;
  addWire: (from: { compId: string; pinIdx: number }, to: { compId: string; pinIdx: number }) => void;
  removeWire: (id: string) => void;
  setTool: (tool: ToolType) => void;
  selectComponent: (id: string | null) => void;
  setWirePhase: (phase: { compId: string; pinIdx: number } | null) => void;
  runSolve: () => void;
  toggleSimulation: () => void;
  clearAll: () => void;
  autoWire: () => void;
  setOrbitEnabled: (enabled: boolean) => void;
  setIsDragging: (dragging: boolean, compId?: string | null) => void;
  toggleSnap: () => void;
  showToast: (msg: string, type?: 'info' | 'cmd' | 'error' | 'success') => void;
  setClipboard: (comp: ComponentData | null) => void;
  pasteComponent: () => void;
}

const getDefaultProps = (type: ComponentType) => {
  switch (type) {
    case 'battery': return { voltage: 9 };
    case 'resistor': return { resistance: 100 };
    case 'led': return { forwardVoltage: 2.0 };
    case 'switch': return { closed: false };
    case 'capacitor': return { capacitance: 100 };
    case 'bulb': return { wattage: 60 };
    case 'diode': return { forwardVoltage: 0.7 };
    case 'inductor': return { inductance: 10 };
    case 'motor': return { rpm: 1000 };
    case 'buzzer': return { frequency: 440 };
    case 'voltmeter': return { range: 10 };
    case 'ammeter': return { range: 100 };
    case 'potentiometer': return { resistance: 1000, wiper: 0.5 };
    case 'transistor_npn': return { gain: 100 };
    case 'transformer': return { ratio: 0.5 };
    case 'fuse': return { rating: 0.5, blown: false };
    case 'solar_panel': return { voltage: 6, current: 0.5 };
    case 'logic_gate_and': return {};
    case 'logic_gate_or': return {};
    case 'rgb_led': return { vf_r: 2.2, vf_g: 3.3, vf_b: 3.2 };
    case 'zener_diode': return { breakdown: 5.1 };
    case 'relay': return { coilResistance: 150 };
    default: return {};
  }
};

const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

export const useCircuitStore = create<CircuitState>((set, get) => ({
  components: [],
  wires: [],
  history: [],
  historyIndex: -1,
  selectedCompId: null,
  activeTool: 'select',
  wirePhase: null,
  simRunning: false,
  simStats: { v: 0, i: 0, r: 0, p: 0, closed: false },
  poweredComps: {},
  componentVoltages: {},
  componentCurrents: {},
  orbitEnabled: true,
  isDragging: false,
  draggingCompId: null,
  snapToGrid: true,
  toastMessage: null,
  toastType: 'info',
  logs: [{ id: uuidv4(), time: new Date().toLocaleTimeString(), msg: 'System initialized. Ready for input.', type: 'info' }],
  circuitName: 'Untitled Circuit',
  zoomToFitRequested: false,

  setCircuitName: (name) => set({ circuitName: name }),
  zoomToFit: () => set({ zoomToFitRequested: true }),
  setZoomToFitRequested: (requested) => set({ zoomToFitRequested: requested }),

  addLog: (msg, type = 'info') => set((state) => ({
    logs: [...state.logs, { id: uuidv4(), time: new Date().toLocaleTimeString(), msg, type }].slice(-100)
  })),

  loadCircuit: (data) => {
    try {
      const parsed = JSON.parse(data);
      set({ 
        components: parsed.components || [], 
        wires: parsed.wires || [], 
        selectedCompId: null, 
        simRunning: false,
        ...(parsed.circuitName ? { circuitName: parsed.circuitName } : {})
      });
      get().addLog('Circuit loaded successfully.', 'success');
    } catch (e) {
      get().addLog('Failed to load circuit. Invalid JSON.', 'error');
    }
  },

  pushHistory: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ components: deepClone(state.components), wires: deepClone(state.wires) });
    if (newHistory.length > 50) newHistory.shift();
    return { history: newHistory, historyIndex: newHistory.length - 1 };
  }),

  undo: () => set((state) => {
    if (state.historyIndex <= 0) {
      state.showToast('Nothing to undo', 'info');
      return state;
    }
    const newIndex = state.historyIndex - 1;
    const restored = state.history[newIndex];
    state.addLog('[INFO] Undo successful', 'info');
    return { components: deepClone(restored.components), wires: deepClone(restored.wires), historyIndex: newIndex, simRunning: false };
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) {
      state.showToast('Nothing to redo', 'info');
      return state;
    }
    const newIndex = state.historyIndex + 1;
    const restored = state.history[newIndex];
    state.addLog('[INFO] Redo successful', 'info');
    return { components: deepClone(restored.components), wires: deepClone(restored.wires), historyIndex: newIndex, simRunning: false };
  }),

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  addComponent: (type, position) => {
    get().pushHistory();
    set((state) => {
      state.showToast(`${type.toUpperCase()} placed!`);
      return {
        components: [...state.components, {
          id: uuidv4(),
          type,
          position,
          rotation: [0, 0, 0],
          properties: getDefaultProps(type)
        }]
      };
    });
  },

  updateComponent: (id, updates, skipHistory = false) => {
    if (!skipHistory) {
      get().pushHistory();
    }
    set((state) => ({
      components: state.components.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
    if (get().simRunning) {
      get().runSolve();
    }
  },

  removeComponent: (id) => {
    get().pushHistory();
    set((state) => {
      state.showToast('Component deleted');
      return {
        components: state.components.filter(c => c.id !== id),
        wires: state.wires.filter(w => w.from.compId !== id && w.to.compId !== id),
        selectedCompId: state.selectedCompId === id ? null : state.selectedCompId
      };
    });
    if (get().simRunning) {
      get().runSolve();
    }
  },

  addWire: (from, to) => {
    const state = get();
    const exists = state.wires.some(w => 
      (w.from.compId === from.compId && w.from.pinIdx === from.pinIdx && w.to.compId === to.compId && w.to.pinIdx === to.pinIdx) ||
      (w.from.compId === to.compId && w.from.pinIdx === to.pinIdx && w.to.compId === from.compId && w.to.pinIdx === from.pinIdx)
    );
    if (exists) return;
    
    get().pushHistory();
    set((state) => {
      state.showToast('Wire connected!');
      return {
        wires: [...state.wires, { id: uuidv4(), from, to }]
      };
    });
    if (get().simRunning) {
      get().runSolve();
    }
  },

  removeWire: (id) => {
    get().pushHistory();
    set((state) => {
      state.showToast('Wire deleted');
      return {
        wires: state.wires.filter(w => w.id !== id)
      };
    });
    if (get().simRunning) {
      get().runSolve();
    }
  },

  setTool: (tool) => set({ activeTool: tool, wirePhase: null }),
  
  selectComponent: (id) => set({ selectedCompId: id }),
  
  setWirePhase: (phase) => set((state) => {
    if (phase) state.showToast('Pin selected → click another pin');
    return { wirePhase: phase };
  }),

  runSolve: () => set((state) => {
    const { components, wires } = state;
    const bats = components.filter(c => c.type === 'battery' || c.type === 'solar_panel');

    if (bats.length === 0) {
      return { 
        simStats: { v: 0, i: 0, r: 0, p: 0, closed: false }, 
        poweredComps: {}, 
        componentVoltages: {}, 
        componentCurrents: {} 
      };
    }

    const adj: Record<string, string[]> = {};
    components.forEach(c => adj[c.id] = []);
    wires.forEach(w => {
      if (adj[w.from.compId] && adj[w.to.compId]) {
        adj[w.from.compId].push(w.to.compId);
        adj[w.to.compId].push(w.from.compId);
      }
    });

    const visited = new Set<string>();
    const q = [bats[0].id];
    visited.add(bats[0].id);
    while (q.length > 0) {
      const curr = q.shift()!;
      for (const neighbor of adj[curr]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          q.push(neighbor);
        }
      }
    }

    if (adj[bats[0].id].length < 2) {
      return { 
        simStats: { v: 0, i: 0, r: 0, p: 0, closed: false }, 
        poweredComps: {}, 
        componentVoltages: {}, 
        componentCurrents: {} 
      };
    }

    const activeComps = components.filter(c => visited.has(c.id));
    const activeWires = wires.filter(w => visited.has(w.from.compId) && visited.has(w.to.compId));

    const solution = solveCircuit(activeComps, activeWires);
    
    if (!solution) {
      return state;
    }

    if (solution.error) {
      setTimeout(() => get().showToast(`⚠️ ${solution.message}`, 'error'), 0);
      if (solution.error === 'DIVERGED') return state;
    }

    let { req: R, totalI: I, totalV: V, totalPower: P, componentCurrents, componentVoltages } = solution;
    
    const poweredComps: Record<string, any> = {};
    activeComps.forEach(c => {
      const vDrop = componentVoltages[c.id] || 0;
      const current = componentCurrents[c.id] || 0;
      
      if (c.type === 'led' && vDrop >= (c.properties.forwardVoltage || 2) && current > 0.001) poweredComps[c.id] = true;
      if (c.type === 'bulb' && current > 0.005) poweredComps[c.id] = true;
      if (c.type === 'motor' && current > 0.01) poweredComps[c.id] = true;
      if (c.type === 'buzzer' && current > 0.005) poweredComps[c.id] = true;
      if (c.type === 'rgb_led') {
        poweredComps[c.id] = {
          r: (componentVoltages[`${c.id}_r`] || 0) >= (c.properties.vf_r || 2.2) && (componentCurrents[`${c.id}_r`] || 0) > 0.001,
          g: (componentVoltages[`${c.id}_g`] || 0) >= (c.properties.vf_g || 3.3) && (componentCurrents[`${c.id}_g`] || 0) > 0.001,
          b: (componentVoltages[`${c.id}_b`] || 0) >= (c.properties.vf_b || 3.2) && (componentCurrents[`${c.id}_b`] || 0) > 0.001,
        };
      }
      if (c.type === 'relay') {
        poweredComps[c.id] = Math.abs(current) > 0.02;
      }
    });

    return {
      simStats: { v: V, i: I, r: R, p: P, closed: true },
      poweredComps,
      componentVoltages,
      componentCurrents
    };
  }),

  toggleSimulation: () => {
    const state = get();
    if (state.simRunning) {
      state.showToast('Simulation stopped');
      set({ simRunning: false, simStats: { v: 0, i: 0, r: 0, p: 0, closed: false }, poweredComps: {}, componentVoltages: {}, componentCurrents: {}, orbitEnabled: true, isDragging: false, draggingCompId: null });
      return;
    }

    const { components, wires } = state;
    const bats = components.filter(c => c.type === 'battery' || c.type === 'solar_panel');

    if (bats.length === 0) {
      state.showToast('No power source in circuit!', 'error');
      return;
    }

    const adj: Record<string, string[]> = {};
    components.forEach(c => adj[c.id] = []);
    wires.forEach(w => {
      if (adj[w.from.compId] && adj[w.to.compId]) {
        adj[w.from.compId].push(w.to.compId);
        adj[w.to.compId].push(w.from.compId);
      }
    });

    if (!adj[bats[0].id] || adj[bats[0].id].length < 2) {
      state.showToast('Power source is not connected in a closed loop.', 'error');
      return;
    }

    set({ simRunning: true });
    get().runSolve();
    
    // Check if the latest state successfully solved
    const finalState = get();
    if (finalState.simStats && finalState.simStats.closed) {
      state.showToast(`✓ Circuit running! ${(finalState.simStats.i * 1000).toFixed(1)}mA @ ${finalState.simStats.v.toFixed(1)}V`, 'success');
    }
  },

  clearAll: () => {
    get().pushHistory();
    set((state) => {
      state.showToast('Canvas cleared');
      return {
        components: [],
        wires: [],
        selectedCompId: null,
        wirePhase: null,
        simRunning: false,
        simStats: { v: 0, i: 0, r: 0, p: 0, closed: false },
        poweredComps: {},
        componentVoltages: {},
        componentCurrents: {},
        orbitEnabled: true,
        isDragging: false,
        draggingCompId: null
      };
    });
  },

  autoWire: () => {
    get().pushHistory();
    set((state) => {
      if (state.components.length < 2) {
        state.showToast('Need at least 2 components to auto-wire!');
        return state;
      }
      const newWires: WireData[] = [];
      for (let i = 0; i < state.components.length - 1; i++) {
        newWires.push({
          id: uuidv4(),
          from: { compId: state.components[i].id, pinIdx: 1 },
          to: { compId: state.components[i+1].id, pinIdx: 0 }
        });
      }
      newWires.push({
        id: uuidv4(),
        from: { compId: state.components[state.components.length - 1].id, pinIdx: 1 },
        to: { compId: state.components[0].id, pinIdx: 0 }
      });
      state.showToast('Auto-wired! Press SPACE to simulate.');
      return { wires: newWires, wirePhase: null };
    });
  },

  setOrbitEnabled: (enabled) => set({ orbitEnabled: enabled }),
  setIsDragging: (dragging, compId = null) => set({ isDragging: dragging, draggingCompId: compId }),
  toggleSnap: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  
  showToast: (msg, type = 'info') => {
    get().addLog(msg, type);
    set({ toastMessage: msg, toastType: type });
    setTimeout(() => {
      set((state) => state.toastMessage === msg ? { toastMessage: null } : state);
    }, 2800);
  },
  
  clipboard: null,
  setClipboard: (comp) => set({ clipboard: comp }),
  pasteComponent: () => {
    const { clipboard, pushHistory } = get();
    if (clipboard) {
      pushHistory();
      set((state) => {
        const offsetPos: [number, number, number] = [
          clipboard.position[0] + 1,
          clipboard.position[1],
          clipboard.position[2] + 1
        ];
        const newId = uuidv4();
        state.showToast(`Pasted ${clipboard.type.toUpperCase()}`);
        return {
          components: [...state.components, {
            ...clipboard,
            id: newId,
            position: offsetPos
          }],
          selectedCompId: newId,
          clipboard: { ...clipboard, position: offsetPos }
        };
      });
    }
  }
}));
