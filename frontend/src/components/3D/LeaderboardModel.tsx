import React, { useRef } from 'react';
import { useGLTF, Text, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface LeaderboardModelProps {
  position: [number, number, number];
  onClick?: () => void;
  isActive?: boolean;
}

const LeaderboardModel: React.FC<LeaderboardModelProps> = ({ position, onClick, isActive = false }) => {
  const { scene } = useGLTF('/leaderboard.glb');
  const meshRef = useRef<THREE.Group>(null);

  // Clone the scene to avoid conflicts
  const clonedScene = scene.clone();

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      
      // Subtle rotation animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <group 
      ref={meshRef} 
      position={position}
      scale={[13, 13, 13]} // Make the leaderboard 2x bigger
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (meshRef.current) {
          meshRef.current.scale.setScalar(14); // Slightly bigger on hover
        }
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (meshRef.current) {
          meshRef.current.scale.setScalar(13.0); // Back to 2x size
        }
      }}
    >
      <primitive object={clonedScene} />
      
      {/* Leaderboard Text Overlay - Using Html for better visibility */}
      <Html
        position={[-4, 2, -3]}
        center
        distanceFactor={0.5}
        zIndexRange={[100, 0]}
      >
        <div style={{
          color: '#00ff00',
          fontSize: '24px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px #000000',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: '8px 16px',
          border: '2px solid #00ff00',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
        }}>
          LEADERBOARD
        </div>
      </Html>
      
      {/* Fallback 3D Text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        outlineWidth={0.05}
        outlineColor="#000000"
        rotation={[0, 0, 0]}
      >
        LEADERBOARD
      </Text>
      
      {/* Add a subtle glow effect when active */}
      {isActive && (
        <pointLight 
          position={[0, 2, 0]} 
          intensity={0.5} 
          color="#00ff00" 
          distance={5}
        />
      )}
    </group>
  );
};

export default LeaderboardModel;
