import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ComponentData, useCircuitStore } from '../store';
import * as THREE from 'three';

const Pin = ({ position, color, compId, pinIdx }: { position: [number, number, number], color: string, compId: string, pinIdx: number }) => {
  const { activeTool, wirePhase, setWirePhase, addWire, simRunning } = useCircuitStore();
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (activeTool !== 'wire') return;

    if (!wirePhase) {
      setWirePhase({ compId, pinIdx });
    } else {
      if (wirePhase.compId !== compId) {
        addWire(wirePhase, { compId, pinIdx });
        setWirePhase(null);
      } else {
        useCircuitStore.getState().showToast('Cannot connect a component to itself');
        setWirePhase(null);
      }
    }
  };

  return (
    <mesh 
      position={position} 
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      userData={{ isPin: true, compId, pinIdx }}
    >
      <sphereGeometry args={[0.12, 24, 24]} />
      <meshStandardMaterial 
        color={hovered || (wirePhase?.compId === compId && wirePhase?.pinIdx === pinIdx) ? '#ffffff' : color} 
        emissive={color} 
        emissiveIntensity={hovered || (wirePhase?.compId === compId && wirePhase?.pinIdx === pinIdx) ? 1.5 : 0.5} 
        metalness={0.8}
        roughness={0.2}
        transparent 
        opacity={0.9} 
      />
    </mesh>
  );
};

export const Battery = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.33, 0.33, 1.75, 24]} />
        <meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pos Cap */}
      <mesh position={[0.99, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.24, 16]} />
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Neg Cap */}
      <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Rings */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.35, 0.038, 8, 24]} />
          <meshStandardMaterial color="#27272a" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      <Pin position={[-1.05, 0, 0]} color="#22d3ee" compId={data.id} pinIdx={0} />
      <Pin position={[1.05, 0, 0]} color="#22d3ee" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Resistor = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.17, 0.17, 0.9, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* Bands */}
      {['#ef4444', '#78350f', '#000000', '#fbbf24'].map((c, i) => (
        <mesh key={i} position={[-0.28 + i * 0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.09, 16]} />
          <meshStandardMaterial color={c} roughness={0.9} />
        </mesh>
      ))}
      {/* Leads */}
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <Pin position={[-1.05, 0, 0]} color="#fb923c" compId={data.id} pinIdx={0} />
      <Pin position={[1.05, 0, 0]} color="#fb923c" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const LED = ({ data }: { data: ComponentData }) => {
  const { poweredComps, simRunning } = useCircuitStore();
  const isPowered = simRunning && poweredComps[data.id];
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (isPowered && lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 11) * 0.3;
    } else if (lightRef.current) {
      lightRef.current.intensity = 0;
    }
  });

  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.28, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        <meshPhysicalMaterial 
          color={isPowered ? "#f472b6" : "#be185d"} 
          emissive={isPowered ? "#ec4899" : "#4c0519"} 
          emissiveIntensity={isPowered ? 2.5 : 0}
          transparent opacity={0.85} roughness={0.1} transmission={0.9} thickness={0.5}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.24, 0.24, 0.17, 24]} />
        <meshStandardMaterial color="#18181b" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Leads */}
      {[-0.13, 0.13].map((x, i) => (
        <mesh key={i} position={[x, -0.42, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.55, 8]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <pointLight ref={lightRef} color="#ec4899" distance={6} intensity={0} position={[0, 0.6, 0]} />
      <Pin position={[-0.68, -0.3, 0]} color="#f472b6" compId={data.id} pinIdx={0} />
      <Pin position={[0.68, -0.3, 0]} color="#f472b6" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const SwitchComp = ({ data }: { data: ComponentData }) => {
  const { updateComponent, activeTool } = useCircuitStore();
  const closed = data.properties.closed;

  const handleToggle = (e: any) => {
    e.stopPropagation();
    if (activeTool !== 'delete') {
      updateComponent(data.id, { properties: { ...data.properties, closed: !closed } });
    }
  };

  return (
    <group position={data.position} rotation={data.rotation} onClick={handleToggle}>
      <mesh>
        <boxGeometry args={[1.35, 0.24, 0.68]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[closed ? 0.25 : -0.25, 0.38, 0]}>
        <boxGeometry args={[0.3, 0.5, 0.44]} />
        <meshStandardMaterial color={closed ? "#e4e4e7" : "#34d399"} emissive={closed ? "#3f3f46" : "#059669"} emissiveIntensity={0.5} roughness={0.4} />
      </mesh>
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.15, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.2, 8]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <Pin position={[-0.76, 0, 0]} color="#34d399" compId={data.id} pinIdx={0} />
      <Pin position={[0.76, 0, 0]} color="#34d399" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Capacitor = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh>
        <cylinderGeometry args={[0.27, 0.27, 0.8, 24]} />
        <meshStandardMaterial color="#1e1b4b" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.43, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.07, 24]} />
        <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.4, 24, 1, true, 0, Math.PI]} />
        <meshStandardMaterial color="#e4e4e7" side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      {/* Leads */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={i} position={[x, -0.58, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.38, 8]} />
          <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <Pin position={[-0.52, -0.4, 0]} color="#c084fc" compId={data.id} pinIdx={0} />
      <Pin position={[0.52, -0.4, 0]} color="#c084fc" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Bulb = ({ data }: { data: ComponentData }) => {
  const { poweredComps, simRunning } = useCircuitStore();
  const isPowered = simRunning && poweredComps[data.id];
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (isPowered && lightRef.current) {
      lightRef.current.intensity = 2.8 + Math.sin(clock.elapsedTime * 15) * 0.2;
    } else if (lightRef.current) {
      lightRef.current.intensity = 0;
    }
  });

  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshPhysicalMaterial 
          color="#fef08a" 
          emissive={isPowered ? "#fbbf24" : "#451a03"} 
          emissiveIntensity={isPowered ? 2.0 : 0}
          transparent opacity={0.6} roughness={0.1} transmission={0.9} thickness={0.5}
        />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.32, 24]} />
        <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <mesh key={i} position={[0, 0.18 + i * 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.016, 8, 24]} />
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={isPowered ? 3 : 0} />
        </mesh>
      ))}
      <pointLight ref={lightRef} color="#fcd34d" distance={8} intensity={0} position={[0, 0.6, 0]} />
      <Pin position={[-0.58, -0.2, 0]} color="#facc15" compId={data.id} pinIdx={0} />
      <Pin position={[0.58, -0.2, 0]} color="#facc15" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Diode = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.18, 0.18, 0.8, 24]} />
      <meshStandardMaterial color="#18181b" roughness={0.7} />
    </mesh>
    <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.185, 0.185, 0.15, 24]} />
      <meshStandardMaterial color="#e4e4e7" metalness={0.8} />
    </mesh>
    {[-0.6, 0.6].map((x, i) => (
      <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
    <Pin position={[-0.9, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[0.9, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
  </group>
);

export const Inductor = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
      <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <meshStandardMaterial color="#b45309" metalness={0.6} roughness={0.4} />
      </mesh>
    ))}
    {[-0.65, 0.65].map((x, i) => (
      <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#a1a1aa" metalness={0.8} roughness={0.2} />
      </mesh>
    ))}
    <Pin position={[-1.05, 0, 0]} color="#b45309" compId={data.id} pinIdx={0} />
    <Pin position={[1.05, 0, 0]} color="#b45309" compId={data.id} pinIdx={1} />
  </group>
);

export const Motor = ({ data }: { data: ComponentData }) => {
  const { poweredComps, simRunning } = useCircuitStore();
  const isPowered = simRunning && poweredComps[data.id];
  const shaftRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (isPowered && shaftRef.current) {
      shaftRef.current.rotation.x += delta * (data.properties.rpm / 60) * Math.PI * 2;
    }
  });
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.8, 24]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh ref={shaftRef} position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.4} />
      </mesh>
      <Pin position={[-0.4, 0.2, 0]} color="#ef4444" compId={data.id} pinIdx={0} />
      <Pin position={[-0.4, -0.2, 0]} color="#3b82f6" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Buzzer = ({ data }: { data: ComponentData }) => {
  const { poweredComps, simRunning } = useCircuitStore();
  const isPowered = simRunning && poweredComps[data.id];
  const topRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (isPowered && topRef.current) {
      // Use frequency property, default to 440Hz if not set. Scale down for visual effect.
      const freq = data.properties.frequency || 440;
      topRef.current.position.y = 0.15 + Math.sin(clock.elapsedTime * freq * 0.1) * 0.02;
    } else if (topRef.current) {
      topRef.current.position.y = 0.15;
    }
  });
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.2, 24]} />
        <meshStandardMaterial color="#18181b" roughness={0.8} />
      </mesh>
      <mesh ref={topRef} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.21, 24]} />
        <meshStandardMaterial color="#27272a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.01, 12]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <Pin position={[-0.4, 0, 0]} color="#ef4444" compId={data.id} pinIdx={0} />
      <Pin position={[0.4, 0, 0]} color="#3b82f6" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Voltmeter = ({ data }: { data: ComponentData }) => {
  const { componentVoltages, simRunning } = useCircuitStore();
  const voltage = simRunning ? (componentVoltages[data.id] || 0) : 0;
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#374151" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <Pin position={[-0.6, 0.2, 0]} color="#ef4444" compId={data.id} pinIdx={0} />
      <Pin position={[0.6, 0.2, 0]} color="#3b82f6" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Ammeter = ({ data }: { data: ComponentData }) => {
  const { componentCurrents, simRunning } = useCircuitStore();
  const current = simRunning ? (componentCurrents[data.id] || 0) : 0;
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
        <meshStandardMaterial color="#4b5563" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshBasicMaterial color="#000" />
      </mesh>
      <Pin position={[-0.6, 0.2, 0]} color="#ef4444" compId={data.id} pinIdx={0} />
      <Pin position={[0.6, 0.2, 0]} color="#3b82f6" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Potentiometer = ({ data }: { data: ComponentData }) => {
  const { updateComponent, activeTool } = useCircuitStore();
  const wiper = data.properties.wiper ?? 0.5;
  
  const handleWiper = (e: any) => {
    e.stopPropagation();
    if (activeTool !== 'delete') {
      const newWiper = (wiper + 0.1) % 1.1;
      updateComponent(data.id, { properties: { ...data.properties, wiper: newWiper } });
    }
  };

  return (
    <group position={data.position} rotation={data.rotation} onClick={handleWiper}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.4, 24]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[0, wiper * Math.PI, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <Pin position={[-0.5, 0.1, 0]} color="#fb923c" compId={data.id} pinIdx={0} />
      <Pin position={[0.5, 0.1, 0]} color="#fb923c" compId={data.id} pinIdx={1} />
      <Pin position={[0, 0.1, 0.5]} color="#fb923c" compId={data.id} pinIdx={2} />
    </group>
  );
};

export const TransistorNPN = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 3, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <Pin position={[-0.3, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} /> {/* Collector */}
      <Pin position={[0, 0, 0.3]} color="#a1a1aa" compId={data.id} pinIdx={2} /> {/* Base */}
      <Pin position={[0.3, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} /> {/* Emitter */}
    </group>
  );
};

export const Transformer = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1, 0.6, 0.8]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <Pin position={[-0.6, 0.1, -0.2]} color="#ef4444" compId={data.id} pinIdx={0} />
      <Pin position={[-0.6, 0.1, 0.2]} color="#ef4444" compId={data.id} pinIdx={1} />
      <Pin position={[0.6, 0.1, -0.2]} color="#3b82f6" compId={data.id} pinIdx={2} />
      <Pin position={[0.6, 0.1, 0.2]} color="#3b82f6" compId={data.id} pinIdx={3} />
    </group>
  );
};

export const Fuse = ({ data }: { data: ComponentData }) => {
  const blown = data.properties.blown;
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#e5e7eb" transparent opacity={0.5} />
      </mesh>
      {!blown && (
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#9ca3af" />
        </mesh>
      )}
      <Pin position={[-0.5, 0.1, 0]} color="#9ca3af" compId={data.id} pinIdx={0} />
      <Pin position={[0.5, 0.1, 0]} color="#9ca3af" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const SolarPanel = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      <Pin position={[-0.8, 0.05, 0]} color="#ef4444" compId={data.id} pinIdx={0} />
      <Pin position={[0.8, 0.05, 0]} color="#3b82f6" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const LogicGateAnd = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <Pin position={[-0.5, 0.1, -0.2]} color="#10b981" compId={data.id} pinIdx={0} />
      <Pin position={[-0.5, 0.1, 0.2]} color="#10b981" compId={data.id} pinIdx={1} />
      <Pin position={[0.5, 0.1, 0]} color="#10b981" compId={data.id} pinIdx={2} />
    </group>
  );
};

export const LogicGateOr = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <Pin position={[-0.5, 0.1, -0.2]} color="#3b82f6" compId={data.id} pinIdx={0} />
      <Pin position={[-0.5, 0.1, 0.2]} color="#3b82f6" compId={data.id} pinIdx={1} />
      <Pin position={[0.5, 0.1, 0]} color="#3b82f6" compId={data.id} pinIdx={2} />
    </group>
  );
};

export const RGBLED = ({ data }: { data: ComponentData }) => {
  const { poweredComps, simRunning } = useCircuitStore();
  const state = simRunning ? poweredComps[data.id] || { r: false, g: false, b: false } : { r: false, g: false, b: false };
  const r = state.r ? 255 : 0;
  const g = state.g ? 255 : 0;
  const b = state.b ? 255 : 0;
  const color = `rgb(${r},${g},${b})`;
  const isPowered = state.r || state.g || state.b;

  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshPhysicalMaterial color={isPowered ? color : "#ffffff"} emissive={isPowered ? color : "#000000"} emissiveIntensity={isPowered ? 2 : 0} transparent opacity={0.8} />
      </mesh>
      <Pin position={[-0.4, 0, -0.2]} color="#ef4444" compId={data.id} pinIdx={0} /> {/* R */}
      <Pin position={[-0.4, 0, 0]} color="#10b981" compId={data.id} pinIdx={1} /> {/* G */}
      <Pin position={[-0.4, 0, 0.2]} color="#3b82f6" compId={data.id} pinIdx={2} /> {/* B */}
      <Pin position={[0.4, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={3} /> {/* Common */}
    </group>
  );
};

export const ZenerDiode = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <Pin position={[-0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
      <Pin position={[0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
    </group>
  );
};

export const Relay = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1, 0.4, 0.8]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <Pin position={[-0.6, 0.1, -0.2]} color="#f59e0b" compId={data.id} pinIdx={0} /> {/* Coil 1 */}
      <Pin position={[-0.6, 0.1, 0.2]} color="#f59e0b" compId={data.id} pinIdx={1} /> {/* Coil 2 */}
      <Pin position={[0.6, 0.1, -0.2]} color="#10b981" compId={data.id} pinIdx={2} /> {/* Switch 1 */}
      <Pin position={[0.6, 0.1, 0.2]} color="#10b981" compId={data.id} pinIdx={3} /> {/* Switch 2 */}
    </group>
  );
};
