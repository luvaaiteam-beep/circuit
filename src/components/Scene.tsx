import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Html } from '@react-three/drei';
import { useCircuitStore, ComponentType } from '../store';
import { Battery, Resistor, LED, SwitchComp, Capacitor, Bulb, Diode, Inductor, Motor, Buzzer, Voltmeter, Ammeter, Potentiometer, TransistorNPN, Transformer, Fuse, SolarPanel, LogicGateAnd, LogicGateOr, RGBLED, ZenerDiode, Relay } from './Components3D';
import { Wires } from './Wires';
import * as THREE from 'three';

import { getPinOffset } from '../utils';

const getSelectionBox = (type: string): [number, number, number] => {
  switch (type) {
    case 'battery': return [2.6, 0.9, 0.9];
    case 'resistor': return [2.4, 0.6, 0.6];
    case 'led': return [1.8, 1.2, 0.8];
    case 'bulb': return [1.4, 1.6, 1.4];
    case 'capacitor': return [1.2, 1.8, 1.2];
    case 'switch': return [2.0, 1.0, 1.0];
    default: return [2.2, 1.2, 1.2];
  }
};

const ComponentWrapper = ({ data }: { data: any }) => {
  const { selectComponent, selectedCompId, updateComponent, removeComponent, setOrbitEnabled, setIsDragging, simRunning, componentVoltages, componentCurrents } = useCircuitStore();
  const isSelected = selectedCompId === data.id;
  const { camera, raycaster, pointer, scene } = useThree();
  const [dragOffset, setDragOffset] = useState<THREE.Vector3 | null>(null);

  const voltage = componentVoltages[data.id];
  const current = componentCurrents[data.id];

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { activeTool, isDragging } = useCircuitStore.getState();
    if (activeTool === 'select' && !isDragging) {
      selectComponent(data.id);
    } else if (activeTool === 'delete') {
      removeComponent(data.id);
    }
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const { activeTool } = useCircuitStore.getState();
    if (activeTool === 'select') {
      selectComponent(data.id);
      
      // Calculate drag offset
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const groundHit = intersects.find(i => i.object.userData.isGround);
      
      if (groundHit) {
        const offset = new THREE.Vector3().copy(groundHit.point).sub(new THREE.Vector3(...data.position));
        setDragOffset(offset);
        setIsDragging(true, data.id);
        setOrbitEnabled(false);
        document.body.style.cursor = 'grabbing';
      }
    }
  };

  useFrame(() => {
    const { isDragging, draggingCompId, snapToGrid } = useCircuitStore.getState();
    if (isDragging && draggingCompId === data.id && dragOffset) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const groundHit = intersects.find(i => i.object.userData.isGround);
      
      if (groundHit) {
        const newPos = new THREE.Vector3().copy(groundHit.point).sub(dragOffset);
        let x = newPos.x;
        let z = newPos.z;
        if (snapToGrid) {
          x = Math.round(x * 2) / 2;
          z = Math.round(z * 2) / 2;
        }
        updateComponent(data.id, { position: [x, 0, z] });
      }
    }
  });

  return (
    <group 
      onClick={handleClick} 
      onPointerDown={handlePointerDown}
    >
      {simRunning && (voltage !== undefined || current !== undefined) && (
        <Html position={[data.position[0], (data.position[1] || 0) + 1.5, data.position[2]]} center style={{ opacity: 0.9, pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-zinc-950/80 border border-zinc-800 rounded text-[10px] font-mono text-cyan-400 whitespace-nowrap backdrop-blur-sm pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {voltage !== undefined && `${Math.abs(voltage).toFixed(2)}V`}
            {voltage !== undefined && current !== undefined && ' | '}
            {current !== undefined && `${(Math.abs(current) * 1000).toFixed(1)}mA`}
          </div>
        </Html>
      )}
      {!simRunning && (
        <Html position={[data.position[0], (data.position[1] || 0) + 1.5, data.position[2]]} center style={{ opacity: 0.6, pointerEvents: 'none' }}>
           <div className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded font-mono text-[9px] text-zinc-500 whitespace-nowrap shadow-xl uppercase">
             {data.type}_{data.id.substring(0,4)}
           </div>
        </Html>
      )}
      {isSelected && (
        <mesh position={data.position} rotation={data.rotation}>
          <boxGeometry args={getSelectionBox(data.type)} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.15} />
        </mesh>
      )}
      {data.type === 'battery' && <Battery data={data} />}
      {data.type === 'resistor' && <Resistor data={data} />}
      {data.type === 'led' && <LED data={data} />}
      {data.type === 'switch' && <SwitchComp data={data} />}
      {data.type === 'capacitor' && <Capacitor data={data} />}
      {data.type === 'bulb' && <Bulb data={data} />}
      {data.type === 'diode' && <Diode data={data} />}
      {data.type === 'inductor' && <Inductor data={data} />}
      {data.type === 'motor' && <Motor data={data} />}
      {data.type === 'buzzer' && <Buzzer data={data} />}
      {data.type === 'voltmeter' && <Voltmeter data={data} />}
      {data.type === 'ammeter' && <Ammeter data={data} />}
      {data.type === 'potentiometer' && <Potentiometer data={data} />}
      {data.type === 'transistor_npn' && <TransistorNPN data={data} />}
      {data.type === 'transformer' && <Transformer data={data} />}
      {data.type === 'fuse' && <Fuse data={data} />}
      {data.type === 'solar_panel' && <SolarPanel data={data} />}
      {data.type === 'logic_gate_and' && <LogicGateAnd data={data} />}
      {data.type === 'logic_gate_or' && <LogicGateOr data={data} />}
      {data.type === 'rgb_led' && <RGBLED data={data} />}
      {data.type === 'zener_diode' && <ZenerDiode data={data} />}
      {data.type === 'relay' && <Relay data={data} />}
    </group>
  );
};

const Ground = () => {
  const { addComponent, updateComponent, setWirePhase } = useCircuitStore();
  
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const { activeTool, snapToGrid } = useCircuitStore.getState();
    if (['battery', 'resistor', 'led', 'switch', 'capacitor', 'bulb', 'diode', 'inductor', 'motor', 'buzzer', 'voltmeter', 'ammeter', 'potentiometer', 'transistor_npn', 'transformer', 'fuse', 'solar_panel', 'logic_gate_and', 'logic_gate_or', 'rgb_led', 'zener_diode', 'relay'].includes(activeTool)) {
      const point = e.point;
      let x = point.x;
      let z = point.z;
      if (snapToGrid) {
        x = Math.round(x * 2) / 2;
        z = Math.round(z * 2) / 2;
      }
      addComponent(activeTool as ComponentType, [x, 0, z]);
    } else if (activeTool === 'select') {
      useCircuitStore.getState().selectComponent(null);
    } else if (activeTool === 'wire') {
      const { wirePhase } = useCircuitStore.getState();
      if (wirePhase) {
        setWirePhase(null);
      }
    }
  };

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]} 
      onPointerDown={handlePointerDown}
      userData={{ isGround: true }}
    >
      <planeGeometry args={[300, 300]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
};

const PreviewWire = () => {
  const { wirePhase, components } = useCircuitStore();
  const { camera, pointer, raycaster, scene } = useThree();
  const [endPos, setEndPos] = useState<THREE.Vector3 | null>(null);

  useFrame(() => {
    if (!wirePhase) return;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const groundHit = intersects.find(i => i.object.userData.isGround === true);
    if (groundHit) {
      setEndPos(groundHit.point);
    }
  });

  if (!wirePhase || !endPos) return null;

  const compA = components.find(c => c.id === wirePhase.compId);
  if (!compA) return null;

  const offsetA = getPinOffset(compA.type, wirePhase.pinIdx);
  const posA = new THREE.Vector3(...offsetA).applyEuler(new THREE.Euler(...compA.rotation)).add(new THREE.Vector3(...compA.position));
  
  const dir = new THREE.Vector3().subVectors(endPos, posA);
  const len = dir.length();
  if (len < 0.02) return null;
  const mid = new THREE.Vector3().addVectors(posA, endPos).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

  return (
    <mesh position={mid} quaternion={quaternion}>
      <cylinderGeometry args={[0.056, 0.056, len, 12]} />
      <meshStandardMaterial color="#22d3ee" transparent opacity={0.6} metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

export const Scene = () => {
  const components = useCircuitStore(state => state.components);
  const orbitEnabled = useCircuitStore(state => state.orbitEnabled);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const handlePointerUp = () => {
      const state = useCircuitStore.getState();
      if (state.isDragging) {
        state.setIsDragging(false, null);
        state.setOrbitEnabled(true);
        document.body.style.cursor = 'auto';
      }
    };
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b] text-cyan-400">
          <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
          <div className="font-mono text-sm tracking-widest font-semibold animate-pulse">
            INITIALIZING 3D ENGINE
          </div>
        </div>
      )}
      <Canvas 
        shadows 
        camera={{ position: [0, 15, 22], fov: 55 }}
        onCreated={() => setIsLoaded(true)}
        gl={{ preserveDrawingBuffer: true }}
        id="circuit-canvas"
      >
        <color attach="background" args={['#09090b']} />
        <fogExp2 attach="fog" args={['#09090b', 0.015]} />
        
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[15, 25, 10]} intensity={1.2} color="#ffffff" castShadow />
        <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#a1a1aa" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#00e5ff" distance={40} />

        <Grid infiniteGrid fadeDistance={100} sectionColor="#27272a" cellColor="#18181b" sectionThickness={1.5} cellThickness={1} />
        <Ground />

        {components.map(c => <ComponentWrapper key={c.id} data={c} />)}
        <Wires />
        <PreviewWire />

        <OrbitControls makeDefault minDistance={3} maxDistance={70} maxPolarAngle={Math.PI / 2 - 0.05} enabled={orbitEnabled} />
      </Canvas>
    </>
  );
};
