import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { CyberpunkNeonLights } from './NeonLights';
import MasterChiefModel from './MasterChief';
import ComputerModel from './ComputerModel';
import AntiqueDesk from './AntiqueDesk';

// Camera Boundary Controller
const CameraBoundaryController: React.FC = () => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Define room boundaries (with some margin)
    const roomMinX = -9;
    const roomMaxX = 9;
    const roomMinZ = -9;
    const roomMaxZ = 9;
    const roomMinY = 1;
    const roomMaxY = 7;
    
    // Clamp camera position to room boundaries
    camera.position.x = Math.max(roomMinX, Math.min(roomMaxX, camera.position.x));
    camera.position.y = Math.max(roomMinY, Math.min(roomMaxY, camera.position.y));
    camera.position.z = Math.max(roomMinZ, Math.min(roomMaxZ, camera.position.z));
  });
  
  return null;
};

const getRandomChoice =(arr: string[]) =>{
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const colors=["#fcba03","#1a2999", "#37a62b", "#e81405"];

// Camera Controller Component with GSAP
const CameraController: React.FC<{ 
  targetPosition?: [number, number, number], 
  targetLookAt?: [number, number, number],
  duration?: number,
  onAnimationComplete?: () => void
}> = ({ targetPosition, targetLookAt, duration = 2, onAnimationComplete }) => {
  const { camera } = useThree();
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (targetPosition && targetLookAt) {
      // Kill any existing animation
      if (animationRef.current) {
        animationRef.current.kill();
      }


      // Get current look-at target from camera
      const currentLookAtTarget = new THREE.Vector3();
      camera.getWorldDirection(currentLookAtTarget);
      currentLookAtTarget.multiplyScalar(10);
      currentLookAtTarget.add(camera.position);

      // Create GSAP timeline
      const timeline = gsap.timeline({
        onComplete: onAnimationComplete
      });

      // Animate camera position
      timeline.to(camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
        duration: duration,
        ease: "power2.inOut"
      }, 0);

      // Animate look-at target directly
      const targetLookAtVector = new THREE.Vector3(...targetLookAt);
      timeline.to({}, {
        duration: duration,
        ease: "power2.inOut",
        onUpdate: function() {
          const progress = this.progress();
          // Interpolate between current look-at and target look-at
          const interpolatedLookAt = new THREE.Vector3().lerpVectors(
            currentLookAtTarget,
            targetLookAtVector,
            progress
          );
          camera.lookAt(interpolatedLookAt);
        }
      }, 0);

      animationRef.current = timeline;
    }
  }, [targetPosition, targetLookAt, duration, camera, onAnimationComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return null;
};

// CashierDesk3D component removed - replaced with AntiqueDesk and ComputerModel

// ComputerStation3D component removed - replaced with ComputerModel

// Cashier3D component removed - replaced with MasterChiefModel

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

// Room Environment with Windows and Natural Lighting
const Room: React.FC = () => {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#2a2a2a" />
      </Plane>
      
      {/* Walls with Windows */}
      {/* Back Wall with Windows */}
      <Plane args={[20, 8]} position={[0, 4, -10]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      {/* Back Wall Windows */}
      <Plane args={[4, 3]} position={[-6, 4, -9.99]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[4, 3]} position={[0, 4, -9.99]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[4, 3]} position={[6, 4, -9.99]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      
      {/* Left Wall with Windows */}
      <Plane args={[20, 8]} rotation={[0, Math.PI / 2, 0]} position={[-10, 4, 0]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      {/* Left Wall Windows */}
      <Plane args={[4, 3]} rotation={[0, Math.PI / 2, 0]} position={[-9.99, 4, -6]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[4, 3]} rotation={[0, Math.PI / 2, 0]} position={[-9.99, 4, 0]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[4, 3]} rotation={[0, Math.PI / 2, 0]} position={[-9.99, 4, 6]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      
      {/* Right Wall with Windows */}
      <Plane args={[20, 8]} rotation={[0, -Math.PI / 2, 0]} position={[10, 4, 0]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      {/* Right Wall Windows */}
      <Plane args={[4, 3]} rotation={[0, -Math.PI / 2, 0]} position={[9.99, 4, -6]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[4, 3]} rotation={[0, -Math.PI / 2, 0]} position={[9.99, 4, 0]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[4, 3]} rotation={[0, -Math.PI / 2, 0]} position={[9.99, 4, 6]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      
      {/* Front Wall (with entrance) - partial wall */}
      <Plane args={[8, 8]} position={[-6, 4, 10]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      <Plane args={[8, 8]} position={[6, 4, 10]}>
        <meshLambertMaterial color="#1a1a1a" />
      </Plane>
      {/* Front Wall Windows */}
      <Plane args={[3, 3]} position={[-3, 4, 9.99]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
      </Plane>
      <Plane args={[3, 3]} position={[3, 4, 9.99]}>
        <meshBasicMaterial color="#87CEEB" transparent opacity={0.7} />
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
const CyberCafeRoom3D: React.FC<{
  onCameraTargetChange: (target: { position: [number, number, number]; lookAt: [number, number, number] } | null) => void;
}> = ({ onCameraTargetChange }) => {
  const [cashierActive, setCashierActive] = useState(false);
  
  const [computers] = useState([
    // Vertical Column 1 (Back to Front) - Right side
    { id: 1, position: [0, 1, -4.5] as [number, number, number], isOccupied: false },
    { id: 2, position: [0, 1, -2.5] as [number, number, number], isOccupied: true, currentUser: 'gamer_123' },
    { id: 3, position: [0, 1, -0.5] as [number, number, number], isOccupied: false },
    { id: 4, position: [0, 1, 1.5] as [number, number, number], isOccupied: true, currentUser: 'retro_player' },
    { id: 5, position: [0, 1, 3.5] as [number, number, number], isOccupied: false },
    
    // Vertical Column 2 (Back to Front) - Right side
    { id: 6, position: [4, 1, -4] as [number, number, number], isOccupied: true, currentUser: 'cyber_ninja' },
    { id: 7, position: [4, 1, -2] as [number, number, number], isOccupied: false },
    { id: 8, position: [4, 1, 0] as [number, number, number], isOccupied: false },
    { id: 9, position: [4, 1, 2] as [number, number, number], isOccupied: false },
    { id: 10, position: [4, 1, 4] as [number, number, number], isOccupied: true, currentUser: 'pro_gamer' },
    
    // Vertical Column 3 (Back to Front) - Right side
    { id: 11, position: [8, 1, -4] as [number, number, number], isOccupied: false },
    { id: 12, position: [8, 1, -2] as [number, number, number], isOccupied: false },
    { id: 13, position: [8, 1, 0] as [number, number, number], isOccupied: true, currentUser: 'streamer_x' },
    { id: 14, position: [8, 1, 2] as [number, number, number], isOccupied: false },
    { id: 15, position: [8, 1, 4] as [number, number, number], isOccupied: false },
  ]);

  const handleCashierDeskClick = () => {
    setCashierActive(true);
    // Cashier desk is positioned at [-6, 0, 4]
    // Flipped perspective: approach from the opposite side
    onCameraTargetChange({
      position: [-8, 2, 8],
      lookAt: [0, 1, 2]
    });
  };

  const handleCashierClick = () => {
    setCashierActive(!cashierActive);
    // Cashier is positioned at [-6, 0, 3.5]
    onCameraTargetChange({
      position: [-8, 2, 8],
      lookAt: [0, 1, 2]
    });
  };

  const handleComputerClick = (computerId: number) => {
    const computer = computers.find(c => c.id === computerId);
    if (computer) {
      onCameraTargetChange({
        position: [computer.position[0] - 3, 2, computer.position[2] + 2],
        lookAt: [computer.position[0], 1, computer.position[2]]
      });
    }
  };

  return (
    <group>
      {/* Room Environment */}
      <Room />
      
      {/* Cashier Station - Left side near entrance */}
      <group>
        {/* Antique Desk for cashier */}
        <AntiqueDesk 
          position={[-5, 1, 4]}
        />
        
        {/* Computer on the cashier desk */}
        <ComputerModel
          position={[-5, 1, 4]}
          onClick={handleCashierDeskClick}
          isOccupied={cashierActive}
          rotation={[0, 0, 0]}
        />
        
        {/* Master Chief - Behind the cashier desk */}
        <MasterChiefModel 
          position={[-5, 0, 2]} 
          onClick={handleCashierClick}
          isActive={cashierActive}
        />
      </group>
      
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
        <group key={computer.id}>
          {/* Computer Model */}
          <ComputerModel
            position={computer.position}
            onClick={() => handleComputerClick(computer.id)}
            isOccupied={computer.isOccupied}
          />
          {/* Antique Desk under the computer */}
          <AntiqueDesk
            position={[computer.position[0], computer.position[1], computer.position[2]]}
          />
        </group>
      ))}
      
      {/* Cyberpunk Neon Lighting System */}
      <CyberpunkNeonLights computers={computers} />
      
      <pointLight position={[0, 2, 0]} intensity={50} color="#ff00ff" distance={20} decay={0.5} />
      
      {/* Natural Sky Lighting */}
      <directionalLight 
        position={[0, 10, 0]} 
        intensity={0.8} 
        color="#87CEEB" 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Window Light Sources */}
      <directionalLight position={[-10, 5, 0]} intensity={0.4} color="#87CEEB" />
      <directionalLight position={[10, 5, 0]} intensity={0.4} color="#87CEEB" />
      <directionalLight position={[0, 5, -10]} intensity={0.4} color="#87CEEB" />
      
      {/* Enhanced Atmospheric Lighting */}
      <ambientLight intensity={0.25} color="#87CEEB" />
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
  const [cameraTarget, setCameraTarget] = useState<{
    position: [number, number, number];
    lookAt: [number, number, number];
  } | null>(null);


  const resetCamera = () => {
    setCameraTarget(null);
  };

  const handleAnimationComplete = () => {
    // Animation complete - camera stays unlocked for user control
  };

  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [-2, 3, 10], fov: 80 }}>
        <fog attach="fog" args={['#0a0a1a', 5, 25]} />
        <CameraBoundaryController />
        <CyberCafeRoom3D onCameraTargetChange={setCameraTarget} />
        <CameraController 
          targetPosition={cameraTarget?.position}
          targetLookAt={cameraTarget?.lookAt}
          onAnimationComplete={handleAnimationComplete}
        />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          // Restrict camera to stay within room boundaries
          minAzimuthAngle={-Math.PI / 2} // Prevent going too far left
          maxAzimuthAngle={Math.PI / 2}  // Prevent going too far right
          // Target position for orbit controls (center of room)
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 border border-cyan-400 rounded-lg p-4 text-white font-mono">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">CYBER CAFÉ 3D</h2>
        <p className="text-sm text-gray-300 mb-2">
          • Click on cashier desk or Master Chief to interact<br/>
          • Click on computer screens to view them<br/>
          • Use mouse to rotate view (camera stays in room)<br/>
          • Scroll to zoom in/out<br/>
          • Natural lighting from windows<br/>
          • Hover over objects for interaction
        </p>
        <div className="text-green-400 text-sm mb-3">
          STATUS: ACTIVE | TIME: {new Date().toLocaleTimeString()}
        </div>
        <button 
          onClick={resetCamera}
          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
        >
          🔄 RESET CAMERA
        </button>
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
