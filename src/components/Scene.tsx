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

let globalDragOffset: THREE.Vector3 | null = null;
let dragOccurred = false;

const DragController = () => {
  const { camera, pointer, raycaster, scene } = useThree();
  useFrame(() => {
    const { isDragging, draggingCompId, snapToGrid, updateComponent } = useCircuitStore.getState();
    if (!isDragging || !draggingCompId || !globalDragOffset) return;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    const groundHit = intersects.find(i => i.object.userData.isGround);
    
    if (groundHit) {
      const newPos = new THREE.Vector3().copy(groundHit.point).sub(globalDragOffset);
      let x = newPos.x;
      let z = newPos.z;
      if (snapToGrid) {
        x = Math.round(x * 2) / 2;
        z = Math.round(z * 2) / 2;
      }
      updateComponent(draggingCompId, { position: [x, 0, z] }, true);
      dragOccurred = true;
    }
  });
  return null;
};

const ComponentWrapper = React.memo(({ data }: { data: any }) => {
  const isSelected = useCircuitStore(state => state.selectedCompId === data.id);
  const simRunning = useCircuitStore(state => state.simRunning);
  const totalComps = useCircuitStore(state => state.components.length);
  const voltage = useCircuitStore(state => state.componentVoltages[data.id]);
  const current = useCircuitStore(state => state.componentCurrents[data.id]);
  
  const { camera, raycaster, pointer, scene } = useThree();

  const prevV = useRef<number | undefined>(undefined);
  const prevI = useRef<number | undefined>(undefined);
  const displayV = useRef<number | undefined>(undefined);
  const displayI = useRef<number | undefined>(undefined);

  if (voltage !== undefined && (prevV.current === undefined || Math.abs(voltage - (prevV.current || 0)) > 0.01)) {
    displayV.current = voltage;
    prevV.current = voltage;
  } else if (voltage !== undefined && displayV.current === undefined) {
    displayV.current = voltage;
    prevV.current = voltage;
  }
  
  if (current !== undefined && (prevI.current === undefined || Math.abs(current - (prevI.current || 0)) > 0.001)) {
    displayI.current = current;
    prevI.current = current;
  } else if (current !== undefined && displayI.current === undefined) {
    displayI.current = current;
    prevI.current = current;
  }
  
  if (!simRunning) {
    displayV.current = undefined;
    displayI.current = undefined;
    prevV.current = undefined;
    prevI.current = undefined;
  }

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { activeTool, isDragging, selectComponent, removeComponent } = useCircuitStore.getState();
    if (activeTool === 'select' && !isDragging && !dragOccurred) {
      selectComponent(data.id);
    } else if (activeTool === 'delete') {
      removeComponent(data.id);
    }
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const { activeTool, selectComponent, setIsDragging, setOrbitEnabled } = useCircuitStore.getState();
    if (activeTool === 'select') {
      selectComponent(data.id);
      dragOccurred = false;
      
      // Calculate drag offset
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const groundHit = intersects.find(i => i.object.userData.isGround);
      
      if (groundHit) {
        globalDragOffset = new THREE.Vector3().copy(groundHit.point).sub(new THREE.Vector3(...data.position));
        setIsDragging(true, data.id);
        setOrbitEnabled(false);
        document.body.style.cursor = 'grabbing';
      }
    }
  };

  return (
    <group 
      onClick={handleClick} 
      onPointerDown={handlePointerDown}
    >
      {simRunning && (displayV.current !== undefined || displayI.current !== undefined) && (
        <Html position={[data.position[0], (data.position[1] || 0) + 1.5, data.position[2]]} center style={{ opacity: 0.9, pointerEvents: 'none' }}>
          <div className="px-2 py-1 bg-zinc-950/80 border border-zinc-800 rounded text-[10px] font-mono text-cyan-400 whitespace-nowrap backdrop-blur-sm pointer-events-none shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {displayV.current !== undefined && `${Math.abs(displayV.current).toFixed(2)}V`}
            {displayV.current !== undefined && displayI.current !== undefined && ' | '}
            {displayI.current !== undefined && `${(Math.abs(displayI.current) * 1000).toFixed(1)}mA`}
          </div>
        </Html>
      )}
      {!simRunning && (isSelected || totalComps <= 5) && (
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
}, (prev, next) => {
  return prev.data.id === next.data.id &&
         prev.data.position[0] === next.data.position[0] &&
         prev.data.position[1] === next.data.position[1] &&
         prev.data.position[2] === next.data.position[2] &&
         prev.data.rotation[0] === next.data.rotation[0] &&
         prev.data.rotation[1] === next.data.rotation[1] &&
         prev.data.rotation[2] === next.data.rotation[2] &&
         prev.data.type === next.data.type &&
         JSON.stringify(prev.data.properties) === JSON.stringify(next.data.properties);
});

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

const CameraController = () => {
  const { camera } = useThree();
  const { zoomToFitRequested, setZoomToFitRequested, components } = useCircuitStore();

  React.useEffect(() => {
    if (zoomToFitRequested && components.length > 0) {
      const box = new THREE.Box3();
      components.forEach(c => {
        box.expandByPoint(new THREE.Vector3(c.position[0], c.position[1], c.position[2]));
      });
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.z, 8);
      const fov = (camera as any).fov || 55;
      const dist = maxDim / (2 * Math.tan((Math.PI * fov) / 360));
      
      // We do a discrete jump for simplicity instead of lerp to avoid frame-counting logic
      // But we can just set position directly
      camera.position.set(center.x, dist, center.z + dist * 0.5);
      camera.lookAt(center);
      setZoomToFitRequested(false);
    } else if (zoomToFitRequested) {
      camera.position.set(0, 15, 22);
      camera.lookAt(0, 0, 0);
      setZoomToFitRequested(false);
    }
  }, [zoomToFitRequested, components, camera, setZoomToFitRequested]);

  return null;
};

export const Scene = () => {
  const components = useCircuitStore(state => state.components);
  const orbitEnabled = useCircuitStore(state => state.orbitEnabled);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    const handlePointerUp = () => {
      const state = useCircuitStore.getState();
      if (state.isDragging) {
        state.pushHistory();
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
        shadows={false}
        camera={{ position: [0, 15, 22], fov: 55 }}
        onCreated={() => setIsLoaded(true)}
        gl={{ preserveDrawingBuffer: true, antialias: window.devicePixelRatio < 2 }}
        dpr={[1, 2]}
        id="circuit-canvas"
        style={{ touchAction: 'none' }}
        onPointerMissed={() => useCircuitStore.getState().selectComponent(null)}
      >
        <DragController />
        <CameraController />
        <color attach="background" args={['#09090b']} />
        <fogExp2 attach="fog" args={['#09090b', 0.015]} />
        
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[15, 25, 10]} intensity={1.2} color="#ffffff" />
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
