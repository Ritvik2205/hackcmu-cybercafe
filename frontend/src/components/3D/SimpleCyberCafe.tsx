import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { CyberpunkNeonLights } from './NeonLights';

// Simple 3D Cashier Desk
const SimpleCashierDesk: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Desk Base */}
      <Box args={[3, 0.2, 1.5]} position={[0, 0.1, 0]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      
      {/* Desk Top */}
      <Box args={[3.2, 0.1, 1.7]} position={[0, 0.25, 0]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      
      {/* Computer Monitor */}
      <Box args={[0.8, 0.6, 0.1]} position={[0, 0.7, 0]}>
        <meshLambertMaterial color="#333" />
      </Box>
      
      {/* Monitor Screen */}
      <Box args={[0.7, 0.5, 0.05]} position={[0, 0.7, 0.06]}>
        <meshLambertMaterial color="#00ff00" />
      </Box>
      
      {/* Cash Register */}
      <Box args={[0.6, 0.4, 0.3]} position={[1, 0.3, 0]}>
        <meshLambertMaterial color="#C0C0C0" />
      </Box>
      
      {/* Label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        CASHIER DESK
      </Text>
    </group>
  );
};

// Simple 3D Computer Station
const SimpleComputerStation: React.FC<{ 
  position: [number, number, number]; 
  id: number;
  isOccupied: boolean;
}> = ({ position, id, isOccupied }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + id) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Desk */}
      <Box args={[1.2, 0.1, 0.8]} position={[0, 0.05, 0]}>
        <meshLambertMaterial color={isOccupied ? "#4a4a4a" : "#666"} />
      </Box>
      
      {/* Monitor */}
      <Box args={[0.6, 0.45, 0.05]} position={[0, 0.5, 0]}>
        <meshLambertMaterial color="#222" />
      </Box>
      
      {/* Monitor Screen */}
      <Box args={[0.55, 0.4, 0.02]} position={[0, 0.5, 0.03]}>
        <meshLambertMaterial color={isOccupied ? "#00ff00" : "#001100"} />
      </Box>
      
      {/* Monitor Stand */}
      <Box args={[0.3, 0.1, 0.2]} position={[0, 0.25, 0]}>
        <meshLambertMaterial color="#444" />
      </Box>
      
      {/* Keyboard */}
      <Box args={[0.5, 0.03, 0.2]} position={[0, 0.15, 0.2]}>
        <meshLambertMaterial color="#111" />
      </Box>
      
      {/* Mouse */}
      <Box args={[0.12, 0.05, 0.08]} position={[0.3, 0.16, 0.2]}>
        <meshLambertMaterial color="#333" />
      </Box>
      
      {/* Status Light */}
      <Box args={[0.1, 0.1, 0.1]} position={[0, 0.8, 0]}>
        <meshLambertMaterial color={isOccupied ? "#ff0000" : "#00ff00"} />
      </Box>
      
      {/* Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.1}
        color={isOccupied ? "#ffff00" : "#666666"}
        anchorX="center"
        anchorY="middle"
      >
        PC-{id.toString().padStart(2, '0')}
      </Text>
    </group>
  );
};

// Simple 3D Cashier Character
const SimpleCashier: React.FC<{ position: [number, number, number]; name: string }> = ({ position, name }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Body */}
      <Box args={[0.4, 1.2, 0.3]} position={[0, 0.6, 0]}>
        <meshLambertMaterial color="#4169E1" />
      </Box>
      
      {/* Head */}
      <Box args={[0.3, 0.3, 0.25]} position={[0, 1.5, 0]}>
        <meshLambertMaterial color="#FDBCB4" />
      </Box>
      
      {/* Arms */}
      <Box args={[0.15, 0.6, 0.15]} position={[-0.4, 0.7, 0]}>
        <meshLambertMaterial color="#FDBCB4" />
      </Box>
      <Box args={[0.15, 0.6, 0.15]} position={[0.4, 0.7, 0]}>
        <meshLambertMaterial color="#FDBCB4" />
      </Box>
      
      {/* Legs */}
      <Box args={[0.15, 0.8, 0.15]} position={[-0.1, -0.4, 0]}>
        <meshLambertMaterial color="#000080" />
      </Box>
      <Box args={[0.15, 0.8, 0.15]} position={[0.1, -0.4, 0]}>
        <meshLambertMaterial color="#000080" />
      </Box>
      
      {/* Name */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

// Simple Room
const SimpleRoom: React.FC = () => {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#2a2a2a" />
      </Plane>
      
      {/* Back Wall */}
      <Plane args={[20, 8]} position={[0, 4, -10]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      
      {/* Left Wall */}
      <Plane args={[20, 8]} rotation={[0, Math.PI / 2, 0]} position={[-10, 4, 0]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      
      {/* Right Wall */}
      <Plane args={[20, 8]} rotation={[0, -Math.PI / 2, 0]} position={[10, 4, 0]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      
      {/* Ceiling */}
      <Plane args={[20, 20]} rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <meshLambertMaterial color="#0a0a0a" />
      </Plane>
    </>
  );
};

// Main Simple 3D Cyber Café
const SimpleCyberCafe3D: React.FC = () => {
  const computers = [
    { id: 1, position: [-6, 0, -6] as [number, number, number], isOccupied: false },
    { id: 2, position: [-3, 0, -6] as [number, number, number], isOccupied: true },
    { id: 3, position: [0, 0, -6] as [number, number, number], isOccupied: false },
    { id: 4, position: [3, 0, -6] as [number, number, number], isOccupied: true },
    { id: 5, position: [6, 0, -6] as [number, number, number], isOccupied: false },
    { id: 6, position: [-6, 0, -3] as [number, number, number], isOccupied: true },
    { id: 7, position: [-3, 0, -3] as [number, number, number], isOccupied: false },
    { id: 8, position: [0, 0, -3] as [number, number, number], isOccupied: false },
    { id: 9, position: [3, 0, -3] as [number, number, number], isOccupied: false },
    { id: 10, position: [6, 0, -3] as [number, number, number], isOccupied: false },
  ];

  return (
    <div className="w-full h-screen bg-black">
      <Canvas 
        camera={{ position: [0, 5, 10], fov: 60 }}
        // fog={{ color: '#0a0a1a', near: 5, far: 25 }}
      >
        {/* Room */}
        <SimpleRoom />
        
        {/* Cashier Desk */}
        <SimpleCashierDesk position={[0, 0, 8]} />
        
        {/* Cashier */}
        <SimpleCashier position={[0, 0, 7]} name="Alex Chen" />
        
        {/* Computer Stations */}
        {computers.map((computer) => (
          <SimpleComputerStation
            key={computer.id}
            position={computer.position}
            id={computer.id}
            isOccupied={computer.isOccupied}
          />
        ))}
        
        {/* Cyberpunk Neon Lighting System */}
        <CyberpunkNeonLights computers={computers} />
        
        {/* Main Ambient Light - Dim purple/blue cyberpunk atmosphere */}
        <ambientLight intensity={0.15} color="#1a0a2e" />
        
        {/* Atmospheric Point Lights with cyberpunk colors */}
        <pointLight position={[0, 6, 0]} intensity={1.2} color="#00ffff" distance={20} decay={1.5} />
        <pointLight position={[-8, 6, -8]} intensity={0.8} color="#ff00ff" distance={15} decay={1.5} />
        <pointLight position={[8, 6, -8]} intensity={0.8} color="#ffff00" distance={15} decay={1.5} />
        <pointLight position={[-8, 6, 8]} intensity={0.8} color="#ff6600" distance={15} decay={1.5} />
        <pointLight position={[8, 6, 8]} intensity={0.8} color="#00ff66" distance={15} decay={1.5} />
        
        {/* Additional accent lights */}
        <pointLight position={[0, 3, -5]} intensity={0.6} color="#ff0080" distance={10} decay={2} />
        <pointLight position={[0, 3, 5]} intensity={0.6} color="#8000ff" distance={10} decay={2} />
        
        {/* Spot Lights for Computer Stations */}
        <spotLight 
          position={[0, 8, -6]} 
          target-position={[0, 0, -6]}
          intensity={0.4} 
          color="#00ffff" 
          angle={Math.PI / 4}
          penumbra={0.5}
          distance={10}
        />
        <spotLight 
          position={[0, 8, -3]} 
          target-position={[0, 0, -3]}
          intensity={0.4} 
          color="#ff00ff" 
          angle={Math.PI / 4}
          penumbra={0.5}
          distance={10}
        />
        
        {/* Cashier Area Spot Light */}
        <spotLight 
          position={[0, 8, 8]} 
          target-position={[0, 0, 8]}
          intensity={0.6} 
          color="#ffff00" 
          angle={Math.PI / 6}
          penumbra={0.3}
          distance={12}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 border border-cyan-400 rounded-lg p-4 text-white font-mono">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">CYBER CAFÉ 3D</h2>
        <p className="text-sm text-gray-300 mb-2">
          • Use mouse to rotate view<br/>
          • Scroll to zoom in/out<br/>
          • Click and drag to pan
        </p>
        <div className="text-green-400 text-sm">
          STATUS: ACTIVE | TIME: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Controls Info */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 border border-purple-400 rounded-lg p-4 text-white font-mono text-sm">
        <div className="text-purple-400 font-bold mb-2">3D CONTROLS</div>
        <div>🖱️ Left Click + Drag: Rotate</div>
        <div>🖱️ Right Click + Drag: Pan</div>
        <div>🖱️ Scroll: Zoom</div>
      </div>
    </div>
  );
};

export default SimpleCyberCafe3D;
