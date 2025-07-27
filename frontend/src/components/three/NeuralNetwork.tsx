import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface NeuralNetworkProps {
  count?: number;
}

const NeuralPoints: React.FC<{ count: number }> = ({ count }) => {
  const ref = useRef<THREE.Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create neural network-like distribution
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Color gradient from purple to cyan
      const t = Math.random();
      colors[i * 3] = 0.6 + t * 0.4;     // R
      colors[i * 3 + 1] = 0.3 + t * 0.7; // G
      colors[i * 3 + 2] = 0.9;           // B
    }
    
    return [positions, colors];
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const NeuralConnections: React.FC = () => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {/* Simplified connections using spheres instead of lines */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          ]}
        >
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ count = 1000 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        className="threejs-canvas"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <NeuralPoints count={count} />
        <NeuralConnections />
      </Canvas>
    </div>
  );
};

export default NeuralNetwork;