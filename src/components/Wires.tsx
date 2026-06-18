import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useCircuitStore, WireData } from '../store';
import { getPinOffset } from '../utils';

export const Wire = ({ data }: { data: WireData }) => {
  const { components, simRunning, simStats, activeTool, removeWire } = useCircuitStore();
  
  const compA = components.find(c => c.id === data.from.compId);
  const compB = components.find(c => c.id === data.to.compId);

  if (!compA || !compB) return null;

  const offsetA = getPinOffset(compA.type, data.from.pinIdx);
  const offsetB = getPinOffset(compB.type, data.to.pinIdx);

  // Calculate world positions
  const posA = new THREE.Vector3(...offsetA).applyEuler(new THREE.Euler(...compA.rotation)).add(new THREE.Vector3(...compA.position));
  const posB = new THREE.Vector3(...offsetB).applyEuler(new THREE.Euler(...compB.rotation)).add(new THREE.Vector3(...compB.position));

  const dir = new THREE.Vector3().subVectors(posB, posA);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
  
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      removeWire(data.id);
    }
  };

  const isHighCurrent = simRunning && simStats.i > 0.5;
  const isPowered = simRunning && simStats.i > 0;

  return (
    <mesh position={mid} quaternion={quaternion} onClick={handleClick}>
      <cylinderGeometry args={[0.056, 0.056, len, 12]} />
      <meshStandardMaterial 
        color={isHighCurrent ? "#f97316" : isPowered ? "#22d3ee" : "#3f3f46"} 
        emissive={isHighCurrent ? "#ea580c" : isPowered ? "#06b6d4" : "#27272a"} 
        emissiveIntensity={isPowered ? 1.5 : 0.2} 
        metalness={0.6}
        roughness={0.4}
      />
    </mesh>
  );
};

export const Wires = () => {
  const wires = useCircuitStore(state => state.wires);
  return (
    <group>
      {wires.map(w => <Wire key={w.id} data={w} />)}
    </group>
  );
};
