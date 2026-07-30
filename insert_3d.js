import fs from 'fs';
const content = fs.readFileSync('src/components/Components3D.tsx', 'utf8');

const newComps = `
export const Breadboard = ({ data }: { data: ComponentData }) => {
  return (
    <group position={data.position} rotation={data.rotation}>
      <mesh position={[0.25, -0.1, 1.75]}>
        <boxGeometry args={[16.5, 0.2, 8.5]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      {/* Center notch */}
      <mesh position={[0.25, 0, 1.75]}>
        <boxGeometry args={[16.5, 0.1, 0.3]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      {/* Power lines red/blue visually */}
      <mesh position={[0.25, 0.01, -3.25]}><boxGeometry args={[16.5, 0.05, 0.05]} /><meshBasicMaterial color="#ef4444" /></mesh>
      <mesh position={[0.25, 0.01, -2.75]}><boxGeometry args={[16.5, 0.05, 0.05]} /><meshBasicMaterial color="#3b82f6" /></mesh>
      <mesh position={[0.25, 0.01, 4.25]}><boxGeometry args={[16.5, 0.05, 0.05]} /><meshBasicMaterial color="#ef4444" /></mesh>
      <mesh position={[0.25, 0.01, 4.75]}><boxGeometry args={[16.5, 0.05, 0.05]} /><meshBasicMaterial color="#3b82f6" /></mesh>
      {/* We don't render 420 pins visually to save GPU, but we could render a texture for holes */}
      <mesh position={[0.25, 0.01, 1.75]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[16.0, 7.5]} />
        <meshBasicMaterial color="#f9fafb" />
      </mesh>
    </group>
  );
};

export const Ground = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
    <Pin position={[0, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
  </group>
);

export const PushButton = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.15, 0]}>
      <boxGeometry args={[0.6, 0.3, 0.6]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.1, 16]} />
      <meshStandardMaterial color={data.properties.closed ? "#ef4444" : "#fca5a5"} />
    </mesh>
    <Pin position={[-0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
  </group>
);

export const TransistorPNP = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.4, 3, 1, false, 0, Math.PI]} />
      <meshStandardMaterial color="#4b5563" />
    </mesh>
    <Pin position={[-0.3, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[0.3, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
    <Pin position={[0, 0, 0.3]} color="#a1a1aa" compId={data.id} pinIdx={2} />
  </group>
);

export const MosfetN = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[0.5, 0.4, 0.2]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
    <mesh position={[0, 0.2, 0.15]}>
      <boxGeometry args={[0.5, 0.5, 0.05]} />
      <meshStandardMaterial color="#9ca3af" />
    </mesh>
    <Pin position={[-0.3, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[0.3, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
    <Pin position={[0, 0, 0.3]} color="#a1a1aa" compId={data.id} pinIdx={2} />
  </group>
);

export const Timer555 = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.15, 0]}>
      <boxGeometry args={[1.5, 0.3, 0.8]} />
      <meshStandardMaterial color="#111827" />
    </mesh>
    {/* notch */}
    <mesh position={[-0.75, 0.3, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    {[0,1,2,3].map(i => <Pin key={i} position={[-0.75 + i*0.5, 0, 0.5]} color="#a1a1aa" compId={data.id} pinIdx={i} />)}
    {[4,5,6,7].map(i => <Pin key={i} position={[0.75 - (i-4)*0.5, 0, -0.5]} color="#a1a1aa" compId={data.id} pinIdx={i} />)}
  </group>
);

export const OpAmp = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.15, 0]}>
      <boxGeometry args={[1.5, 0.3, 0.8]} />
      <meshStandardMaterial color="#1f2937" />
    </mesh>
    <mesh position={[-0.75, 0.3, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
      <meshStandardMaterial color="#374151" />
    </mesh>
    {[0,1,2,3].map(i => <Pin key={i} position={[-0.75 + i*0.5, 0, 0.5]} color="#a1a1aa" compId={data.id} pinIdx={i} />)}
    {[4,5,6,7].map(i => <Pin key={i} position={[0.75 - (i-4)*0.5, 0, -0.5]} color="#a1a1aa" compId={data.id} pinIdx={i} />)}
  </group>
);

export const Photoresistor = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.1, 0]}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial color="#ef4444" />
    </mesh>
    {/* zig zag line */}
    <mesh position={[0, 0.16, 0]} rotation={[Math.PI/2, 0, 0]}>
      <planeGeometry args={[0.4, 0.4]} />
      <meshBasicMaterial color="#fca5a5" />
    </mesh>
    <Pin position={[-0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
  </group>
);

export const Thermistor = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.2, 0]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#10b981" />
    </mesh>
    <Pin position={[-0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[0.5, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
  </group>
);

export const PowerSupply = ({ data }: { data: ComponentData }) => (
  <group position={data.position} rotation={data.rotation}>
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[2.5, 1.0, 1.5]} />
      <meshStandardMaterial color="#d1d5db" />
    </mesh>
    <mesh position={[0, 0.5, 0.76]}>
      <planeGeometry args={[2.0, 0.8]} />
      <meshBasicMaterial color="#111827" />
    </mesh>
    <Html position={[0, 0.5, 0.77]} center transform>
      <div className="text-red-500 font-mono text-xl bg-black px-2 border border-zinc-800">
        {data.properties.voltage?.toFixed(1) || '5.0'}V
      </div>
    </Html>
    <Pin position={[-1.0, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={0} />
    <Pin position={[1.0, 0, 0]} color="#a1a1aa" compId={data.id} pinIdx={1} />
  </group>
);
`;

fs.writeFileSync('src/components/Components3D.tsx', content + newComps);
