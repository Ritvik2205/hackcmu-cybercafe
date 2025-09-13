import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { CyberpunkNeonLights } from './NeonLights';

// 3D Cashier Desk Component
const CashierDesk3D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Desk Base */}
      <Box args={[5, 0.2, 2.5]} position={[0, 0.1, 0]}>
        <meshLambertMaterial color="#8B4513" />
      </Box>
      
      {/* Desk Top */}
      <Box args={[5.2, 0.1, 2.7]} position={[0, 0.25, 0]}>
        <meshLambertMaterial color="#654321" />
      </Box>
      
      {/* Computer Monitor on Desk */}
      <Box args={[1.8, 0.6, 0.1]} position={[0, 0.7, 0]}>
        <meshLambertMaterial color="#333" />
      </Box>
      
      {/* Monitor Screen */}
      <Box args={[1.7, 0.5, 0.05]} position={[0, 0.7, 0.06]}>
        <meshBasicMaterial color="#00ff00" />
      </Box>
      
      {/* Register/Cash Drawer */}
      <Box args={[1.6, 0.4, 0.3]} position={[1, 0.3, 0]}>
        <meshLambertMaterial color="#C0C0C0" />
      </Box>
      
      {/* Name Label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        CASHIER DESK
      </Text>
      
      {/* Interaction Area */}
      <Plane
        args={[5, 2.5]}
        position={[0, 0.3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>
    </group>
  );
};

const getRandomChoice: string =(arr: string[]) =>{
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const colors=["#fcba03","#1a2999", "#37a62b", "#e81405"];

// 3D Computer Station Component
const ComputerStation3D: React.FC<{ 
  position: [number, number, number]; 
  id: number;
  isOccupied: boolean;
  currentUser?: string;
}> = ({ position, id, isOccupied, currentUser }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + id) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Desk */}
      <Box args={[3.2, 0.1, 1.2]} position={[0, 0.05, 0]}>
        <meshLambertMaterial color={isOccupied ? "#4a4a4a" : "#666"} />
      </Box>
      
      {/* Desk Legs */}
      {[-1.5, 1.5].map((x) => 
        [-0.55, 0.55].map((z) => (
          <Box key={`${x}-${z}`} args={[0.05, 1.8, 0.05]} position={[x, -0.4, z]}>
            <meshLambertMaterial color="#333" />
          </Box>
        ))
      )}
      
      {/* Monitor */}
      <Box args={[2.4, 0.7, 0.08]} position={[0, 0.6, 0]}>
        <meshLambertMaterial color="#222" />
      </Box>
      
      {/* Monitor Screen */}
      <Box args={[2.3, 0.6, 0.03]} position={[0, 0.6, 0.05]}>
        <meshLambertMaterial color={isOccupied ? "#00ff00" : "#001100"} />
      </Box>
      
      {/* Monitor Stand */}
      <Box args={[0.5, 0.15, 0.6]} position={[0, 0.3, 0]}>
        <meshLambertMaterial color="#444" />
      </Box>
      
      {/* Keyboard */}
      <Box args={[2.2, 0.05, 0.3]} position={[0, 0.18, 0.3]}>
        <meshLambertMaterial color="#111" />
      </Box>
      
      {/* Mouse */}
      <Box args={[0.3, 0.08, 0.12]} position={[0.5, 0.2, 0.3]}>
        <meshLambertMaterial color="#333" />
      </Box>
      
      {/* Status Indicator */}
      <Box args={[0.3, 0.15, 0.15]} position={[0, 1.0, 0]}>
        <meshLambertMaterial color={isOccupied ? "#ff0000" : "#00ff00"} />
      </Box>
      
      {/* User Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.1}
        color={isOccupied ? "#ffff00" : "#666666"}
        anchorX="center"
        anchorY="middle"
      >
        PC-{id.toString().padStart(2, '0')} {isOccupied ? `\n${currentUser}` : '\nAVAILABLE'}
      </Text>
      
      {/* Interaction Area */}
      <Plane
        args={[3.2, 1.2]}
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Plane>
    </group>
  );
};

// 3D Cashier Character
const Cashier3D: React.FC<{ position: [number, number, number]; name: string }> = ({ position, name }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Cashier Body */}
      <Box args={[0.4, 1.2, 0.3]} position={[0, 0.6, 0]}>
        <meshLambertMaterial color="#4169E1" />
      </Box>
      
      {/* Head */}
      <Box args={[0.3, 0.3, 0.25]} position={[0, 1.5, 0]}>
        <meshLambertMaterial color="#FDBCB4" />
      </Box>
      
      {/* Eyes */}
      <Box args={[0.05, 0.05, 0.02]} position={[-0.08, 1.55, 0.12]}>
        <meshLambertMaterial color="#000" />
      </Box>
      <Box args={[0.05, 0.05, 0.02]} position={[0.08, 1.55, 0.12]}>
        <meshLambertMaterial color="#000" />
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
      
      {/* Name Label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      {/* Title Label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.1}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
      >
        CASHIER
      </Text>
    </group>
  );
};

const User3D: React.FC<{ position: [number, number, number]; name: string, color: string }> = ({ position, name, color }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Cashier Body */}
      <Box args={[0.4, 1.2, 0.3]} position={[0, 0.6, 0]}>
        <meshLambertMaterial color={color} />
      </Box>
      
      {/* Head */}
      <Box args={[0.3, 0.3, 0.25]} position={[0, 1.5, 0]}>
        <meshLambertMaterial color="#FDBCB4" />
      </Box>
      
      {/* Eyes */}
      <Box args={[0.05, 0.05, 0.02]} position={[-0.08, 1.55, 0.12]}>
        <meshLambertMaterial color="#000" />
      </Box>
      <Box args={[0.05, 0.05, 0.02]} position={[0.08, 1.55, 0.12]}>
        <meshLambertMaterial color="#000" />
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
      
      {/* Name Label */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      {/* Title Label */}
      {/* <Text
        position={[0, 2, 0]}
        fontSize={0.1}
        color="#ffff00"
        anchorX="center"
        anchorY="middle"
      >
        CASHIER
      </Text> */}
    </group>
  );
};

// Room Environment
const Room: React.FC = () => {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#2a2a2a" />
      </Plane>
      
      {/* Walls */}
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
      
      {/* Neon Strip Lights */}
      <Box args={[18, 0.1, 0.1]} position={[0, 7.9, 0]}>
        <meshBasicMaterial color="#00ffff" />
      </Box>
      <Box args={[0.1, 0.1, 18]} position={[0, 7.9, 0]}>
        <meshBasicMaterial color="#00ffff" />
      </Box>
    </>
  );
};

// Main 3D Cyber Café Room Component
const CyberCafeRoom3D: React.FC = () => {
  const [computers] = useState([
    // Vertical Column 1 (Back to Front) - Right side
    { id: 1, position: [0, 0, -4] as [number, number, number], isOccupied: false },
    { id: 2, position: [0, 0, -2] as [number, number, number], isOccupied: true, currentUser: 'gamer_123' },
    { id: 3, position: [0, 0, 0] as [number, number, number], isOccupied: false },
    { id: 4, position: [0, 0, 2] as [number, number, number], isOccupied: true, currentUser: 'retro_player' },
    { id: 5, position: [0, 0, 4] as [number, number, number], isOccupied: false },
    
    // Vertical Column 2 (Back to Front) - Right side
    { id: 6, position: [4, 0, -4] as [number, number, number], isOccupied: true, currentUser: 'cyber_ninja' },
    { id: 7, position: [4, 0, -2] as [number, number, number], isOccupied: false },
    { id: 8, position: [4, 0, 0] as [number, number, number], isOccupied: false },
    { id: 9, position: [4, 0, 2] as [number, number, number], isOccupied: false },
    { id: 10, position: [4, 0, 4] as [number, number, number], isOccupied: true, currentUser: 'pro_gamer' },
    
    // Vertical Column 3 (Back to Front) - Right side
    { id: 11, position: [8, 0, -4] as [number, number, number], isOccupied: false },
    { id: 12, position: [8, 0, -2] as [number, number, number], isOccupied: false },
    { id: 13, position: [8, 0, 0] as [number, number, number], isOccupied: true, currentUser: 'streamer_x' },
    { id: 14, position: [8, 0, 2] as [number, number, number], isOccupied: false },
    { id: 15, position: [8, 0, 4] as [number, number, number], isOccupied: false },
  ]);

  return (
    <group>
      {/* Room Environment */}
      <Room />
      
      {/* Cashier Desk - Left side near entrance */}
      <CashierDesk3D position={[-6, 0, 4]} />
      
      {/* Cashier - Behind the cashier desk */}
      <Cashier3D position={[-6, 0, 3.5]} name="Alex Chen" />
      
      {/* Computer users */}
      {computers.filter(computers => computers.isOccupied).map((computer) => (
        <User3D
          position={[computer.position[0], computer.position[1], computer.position[2]-0.7]}
          name=""
          color={getRandomChoice(colors)}
        />
      ))}

      {/* Computer Stations */}
      {computers.map((computer) => (
        <ComputerStation3D
          key={computer.id}
          position={computer.position}
          id={computer.id}
          isOccupied={computer.isOccupied}
          currentUser={computer.currentUser}
        />
      ))}
      
      {/* Cyberpunk Neon Lighting System */}
      <CyberpunkNeonLights computers={computers} />
      
      <pointLight position={[0, 2, 0]} intensity={100} color="#ff00ff" distance={20} decay={0.5} />
      
      {/* Enhanced Atmospheric Lighting */}
      <ambientLight intensity={0.15} color="#1a0a2e" />
      <pointLight position={[3, 6, 0]} intensity={1.2} color="#00ffff" distance={20} decay={1.5} />
      <pointLight position={[6, 6, 0]} intensity={1.2} color="#ff00ff" distance={20} decay={1.5} />
      <pointLight position={[9, 6, 0]} intensity={1.2} color="#ffff00" distance={20} decay={1.5} />
      <pointLight position={[-6, 6, 4]} intensity={1.0} color="#ff6600" distance={15} decay={1.5} />
      <pointLight position={[0, 6, -5]} intensity={0.8} color="#00ff66" distance={15} decay={1.5} />
      
      {/* Additional accent lights */}
      <pointLight position={[3, 3, 0]} intensity={0.6} color="#ff0080" distance={10} decay={2} />
      <pointLight position={[6, 3, 0]} intensity={0.6} color="#8000ff" distance={10} decay={2} />
      <pointLight position={[9, 3, 0]} intensity={0.6} color="#00ff80" distance={10} decay={2} />
      
      {/* Spot Lights for Computer Stations */}
      <spotLight 
        position={[3, 8, 0]} 
        target-position={[3, 0, 0]}
        intensity={0.7} 
        color="#00ffff" 
        angle={Math.PI / 2.5}
        penumbra={0.3}
        distance={20}
      />
      <spotLight 
        position={[6, 8, 0]} 
        target-position={[6, 0, 0]}
        intensity={0.7} 
        color="#ff00ff" 
        angle={Math.PI / 2.5}
        penumbra={0.3}
        distance={20}
      />
      <spotLight 
        position={[9, 8, 0]} 
        target-position={[9, 0, 0]}
        intensity={0.7} 
        color="#ffff00" 
        angle={Math.PI / 2.5}
        penumbra={0.3}
        distance={20}
      />
      
      {/* Cashier Area Spot Light */}
      <spotLight 
        position={[-6, 8, 6]} 
        target-position={[-6, 0, 6]}
        intensity={0.8} 
        color="#ffff00" 
        angle={Math.PI / 4}
        penumbra={0.3}
        distance={12}
      />
    </group>
  );
};

// Main 3D Cyber Café Component
const CyberCafe3D: React.FC = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [-2, 3, 10], fov: 80 }}>
        <fog attach="fog" args={['#0a0a1a', 5, 25]} />
        <CyberCafeRoom3D />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 border border-cyan-400 rounded-lg p-4 text-white font-mono">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">CYBER CAFÉ 3D</h2>
        <p className="text-sm text-gray-300 mb-2">
          • Use mouse to rotate view<br/>
          • Scroll to zoom in/out<br/>
          • Click and drag to pan<br/>
          • Hover over objects for interaction
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
        <div>⌨️ WASD: Move Camera</div>
      </div>
    </div>
  );
};

export default CyberCafe3D;
