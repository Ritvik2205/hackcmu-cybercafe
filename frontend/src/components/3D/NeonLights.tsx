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
}> = ({ position, color, size, rotation = [0, 0, 0] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      
      // Slight glow effect
      const glow = Math.sin(state.clock.elapsedTime) * 0.1 + 1;
      meshRef.current.scale.setScalar(glow);
    }
  });

  return (
    <Box ref={meshRef} args={size} position={position} rotation={rotation}>
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </Box>
  );
};

// Warm Ambient Lighting System
export const CyberpunkNeonLights: React.FC<{ computers: any[] }> = () => {
  return (
    <group>
      {/* Main Ceiling Warm Light Cross */}
      <AnimatedNeonLight
        position={[0, 5.95, 0]}
        color="#FFD700"
        size={[12, 0.05, 0.1]}
      />
      
      {/* Corner Warm Lights */}
      <AnimatedNeonLight
        position={[-6.5, 5.95, -6.5]}
        color="#FFA500"
        size={[0.1, 0.05, 0.1]}
      />
      <AnimatedNeonLight
        position={[6.5, 5.95, -6.5]}
        color="#FFD700"
        size={[0.1, 0.05, 0.1]}
      />
      <AnimatedNeonLight
        position={[-6.5, 5.95, 6.5]}
        color="#FFA500"
        size={[0.1, 0.05, 0.1]}
      />
      <AnimatedNeonLight
        position={[6.5, 5.95, 6.5]}
        color="#FFD700"
        size={[0.1, 0.05, 0.1]}
      />
      
      {/* Wall Warm Light Strips */}
      {/* Back Wall */}
      <AnimatedNeonLight
        position={[0, 4, -6.95]}
        color="#FFD700"
        size={[12, 0.05, 0.1]}
      />
      <AnimatedNeonLight
        position={[0, 2, -6.95]}
        color="#FFA500"
        size={[12, 0.05, 0.1]}
      />
      
      {/* Side Walls */}
      <AnimatedNeonLight
        position={[-6.95, 4, 0]}
        color="#FFA500"
        size={[0.1, 0.05, 12]}
      />
      <AnimatedNeonLight
        position={[-6.95, 2, 0]}
        color="#FFD700"
        size={[0.1, 0.05, 12]}
      />
      
      <AnimatedNeonLight
        position={[6.95, 4, 0]}
        color="#FFD700"
        size={[0.1, 0.05, 12]}
      />
      <AnimatedNeonLight
        position={[6.95, 2, 0]}
        color="#FFA500"
        size={[0.1, 0.05, 12]}
      />
      
      {/* Floor Warm Light Grid */}
      <AnimatedNeonLight
        position={[0, 0.01, 0]}
        color="#FFD700"
        size={[12, 0.02, 0.05]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      
    </group>
  );
};

export default CyberpunkNeonLights;
