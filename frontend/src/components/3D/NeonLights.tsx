import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

// Animated Neon Light Component
const AnimatedNeonLight: React.FC<{
  position: [number, number, number];
  color: string;
  size: [number, number, number];
  rotation?: [number, number, number];
  speed?: number;
}> = ({ position, color, size, rotation = [0, 0, 0], speed = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * speed * 2) * 0.3 + 0.7;
      meshRef.current.material.opacity = pulse;
      
      // Slight glow effect
      const glow = Math.sin(state.clock.elapsedTime * speed) * 0.1 + 1;
      meshRef.current.scale.setScalar(glow);
    }
  });

  return (
    <Box ref={meshRef} args={size} position={position} rotation={rotation}>
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </Box>
  );
};

// Cyberpunk Neon Lighting System
export const CyberpunkNeonLights: React.FC<{ computers: any[] }> = ({ computers }) => {
  return (
    <group>
      {/* Main Ceiling Neon Cross */}
      <AnimatedNeonLight
        position={[0, 7.95, 0]}
        color="#00ffff"
        size={[18, 0.05, 0.1]}
        speed={1.2}
      />
      <AnimatedNeonLight
        position={[0, 7.95, 0]}
        color="#ff00ff"
        size={[0.1, 0.05, 18]}
        speed={1.5}
      />
      
      {/* Corner Neon Lights with different speeds */}
      <AnimatedNeonLight
        position={[-9.5, 7.95, -9.5]}
        color="#ffff00"
        size={[0.1, 0.05, 0.1]}
        speed={2.0}
      />
      <AnimatedNeonLight
        position={[9.5, 7.95, -9.5]}
        color="#ff6600"
        size={[0.1, 0.05, 0.1]}
        speed={1.8}
      />
      <AnimatedNeonLight
        position={[-9.5, 7.95, 9.5]}
        color="#ff0066"
        size={[0.1, 0.05, 0.1]}
        speed={2.2}
      />
      <AnimatedNeonLight
        position={[9.5, 7.95, 9.5]}
        color="#00ff66"
        size={[0.1, 0.05, 0.1]}
        speed={1.6}
      />
      
      {/* Wall Neon Strips */}
      {/* Back Wall */}
      <AnimatedNeonLight
        position={[0, 6, -9.95]}
        color="#00ffff"
        size={[18, 0.05, 0.1]}
        speed={1.3}
      />
      <AnimatedNeonLight
        position={[0, 2, -9.95]}
        color="#ff00ff"
        size={[18, 0.05, 0.1]}
        speed={1.7}
      />
      
      {/* Side Walls */}
      <AnimatedNeonLight
        position={[-9.95, 6, 0]}
        color="#ffff00"
        size={[0.1, 0.05, 18]}
        speed={1.4}
      />
      <AnimatedNeonLight
        position={[-9.95, 2, 0]}
        color="#ff6600"
        size={[0.1, 0.05, 18]}
        speed={1.9}
      />
      
      <AnimatedNeonLight
        position={[9.95, 6, 0]}
        color="#ff0066"
        size={[0.1, 0.05, 18]}
        speed={1.6}
      />
      <AnimatedNeonLight
        position={[9.95, 2, 0]}
        color="#00ff66"
        size={[0.1, 0.05, 18]}
        speed={2.1}
      />
      
      {/* Floor Neon Grid */}
      <AnimatedNeonLight
        position={[0, 0.01, 0]}
        color="#00ffff"
        size={[18, 0.02, 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
        speed={1.1}
      />
      <AnimatedNeonLight
        position={[0, 0.01, 0]}
        color="#ff00ff"
        size={[0.05, 0.02, 18]}
        rotation={[-Math.PI / 2, 0, 0]}
        speed={1.8}
      />
      
      {/* Computer Station Neon Accents */}
      {computers.map((computer) => (
        <group key={`neon-${computer.id}`} position={computer.position}>
          <AnimatedNeonLight
            position={[0, 0.01, 0]}
            color={computer.isOccupied ? "#ff0000" : "#00ff00"}
            size={[1.4, 0.02, 0.05]}
            rotation={[-Math.PI / 2, 0, 0]}
            speed={computer.isOccupied ? 3.0 : 1.5}
          />
          <AnimatedNeonLight
            position={[0, 0.01, 0]}
            color={computer.isOccupied ? "#ff0000" : "#00ff00"}
            size={[0.05, 0.02, 1.0]}
            rotation={[-Math.PI / 2, 0, 0]}
            speed={computer.isOccupied ? 3.0 : 1.5}
          />
        </group>
      ))}
      
      {/* Cashier Desk Neon */}
      <AnimatedNeonLight
        position={[0, 0.01, 8]}
        color="#ffff00"
        size={[3.4, 0.02, 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
        speed={1.2}
      />
      <AnimatedNeonLight
        position={[0, 0.01, 8]}
        color="#ffff00"
        size={[0.05, 0.02, 1.9]}
        rotation={[-Math.PI / 2, 0, 0]}
        speed={1.2}
      />
    </group>
  );
};

export default CyberpunkNeonLights;
