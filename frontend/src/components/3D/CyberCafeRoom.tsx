import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Plane, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { CyberpunkNeonLights } from './NeonLights';
import MasterChiefModel from './MasterChief';
import ComputerModel from './ComputerModel';
import AntiqueDesk from './AntiqueDesk';
import Shelf from './Shelf';
import LeaderboardModel from './LeaderboardModel';
// import CeilingPipes from './CeilingPipes'; // Temporarily disabled

// Camera Boundary Controller
const CameraBoundaryController: React.FC = () => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Define room boundaries (with some margin) - scaled down for smaller room
    const roomMinX = -6;
    const roomMaxX = 6;
    const roomMinZ = -6;
    const roomMaxZ = 6;
    const roomMinY = 0.5;
    const roomMaxY = 5;
    
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

// Simple Text Bubble Component
const PixelatedTextBubble: React.FC<{ 
  position: [number, number, number]; 
  message: string; 
  onComplete: () => void;
}> = ({ position, message, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    console.log('Text bubble created at position:', position, 'with message:', message);
    
    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      console.log('Text bubble hiding');
      setVisible(false);
      setTimeout(onComplete, 500); // Give time for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete, position, message]);

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Simple background bubble */}
      <Plane args={[3, 1.5]} position={[0, 0, 0.1]}>
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.9}
        />
      </Plane>
      
      {/* Simple border */}
      <Box args={[3.1, 0.1, 0.1]} position={[0, 0.75, 0.1]}>
        <meshBasicMaterial color="#00ff00" />
      </Box>
      <Box args={[3.1, 0.1, 0.1]} position={[0, -0.75, 0.1]}>
        <meshBasicMaterial color="#00ff00" />
      </Box>
      <Box args={[0.1, 1.5, 0.1]} position={[1.55, 0, 0.1]}>
        <meshBasicMaterial color="#00ff00" />
      </Box>
      <Box args={[0.1, 1.5, 0.1]} position={[-1.55, 0, 0.1]}>
        <meshBasicMaterial color="#00ff00" />
      </Box>
      
      {/* Text */}
      <Text
        position={[0, 0, 0.15]}
        fontSize={0.2}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
      >
        {message}
      </Text>
    </group>
  );
};

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

const User3D: React.FC<{ position: [number, number, number]; name: string, color: string }> = ({ position, color }) => {
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
      <Plane args={[14, 14]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#4A4A2A" />
      </Plane>
      
      {/* Walls with Windows */}
      {/* Back Wall with Windows */}
      <Plane args={[14, 6]} position={[0, 3, -7]}>
        <meshLambertMaterial color="#4A4A2A" />
      </Plane>
      {/* Back Wall Windows */}
      <Plane args={[3, 2]} position={[-4, 3, -6.99]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} position={[0, 3, -6.99]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} position={[4, 3, -6.99]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      
      {/* Shelves on Back Wall */}
      <Shelf position={[-3, 0.2, -6]} />
      <Shelf position={[1, 0.2, -6]} />
      <Shelf position={[4, 0.2, -6]} />
      <Shelf position={[5.5, 0.2, -6]} />
      
      {/* Left Wall with Windows */}
      <Plane args={[14, 6]} rotation={[0, Math.PI / 2, 0]} position={[-7, 3, 0]}>
        <meshLambertMaterial color="#4A4A2A" />
      </Plane>
      {/* Left Wall Windows */}
      <Plane args={[3, 2]} rotation={[0, Math.PI / 2, 0]} position={[-6.99, 3, -4]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} rotation={[0, Math.PI / 2, 0]} position={[-6.99, 3, 0]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} rotation={[0, Math.PI / 2, 0]} position={[-6.99, 3, 4]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      
      {/* Right Wall with Windows */}
      <Plane args={[14, 6]} rotation={[0, -Math.PI / 2, 0]} position={[7, 3, 0]}>
        <meshLambertMaterial color="#4A4A2A" />
      </Plane>
      {/* Right Wall Windows */}
      <Plane args={[3, 2]} rotation={[0, -Math.PI / 2, 0]} position={[6.99, 3, -4]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} rotation={[0, -Math.PI / 2, 0]} position={[6.99, 3, 0]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[3, 2]} rotation={[0, -Math.PI / 2, 0]} position={[6.99, 3, 4]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      
      {/* Front Wall (with entrance) - partial wall */}
      <Plane args={[6, 6]} position={[-4, 3, 7]}>
        <meshLambertMaterial color="#4A4A2A" />
      </Plane>
      <Plane args={[6, 6]} position={[4, 3, 7]}>
        <meshLambertMaterial color="#4A4A2A" />
      </Plane>
      {/* Front Wall Windows */}
      <Plane args={[2, 2]} position={[-2, 3, 6.99]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      <Plane args={[2, 2]} position={[2, 3, 6.99]}>
        <meshBasicMaterial color="#04C4D9" transparent opacity={0.6} />
      </Plane>
      
      {/* Ceiling */}
      <Plane args={[14, 14]} rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <meshLambertMaterial color="#2F2F1A" />
      </Plane>
      
      {/* Warm Strip Lights */}
      <Box args={[12, 0.1, 0.1]} position={[0, 5.9, 0]}>
        <meshBasicMaterial color="#FFD700" />
      </Box>
      <Box args={[0.1, 0.1, 12]} position={[0, 5.9, 0]}>
        <meshBasicMaterial color="#FFD700" />
      </Box>
      
      {/* Ceiling Pipes - Multiple instances across the ceiling */}
      {/* <CeilingPipes position={[6, 0.5, -6]} /> */}
    </>
  );
};

// Main 3D Cyber Café Room Component
const CyberCafeRoom3D: React.FC<{
  onCameraTargetChange: (target: { position: [number, number, number]; lookAt: [number, number, number] } | null) => void;
}> = ({ onCameraTargetChange }) => {
  const [cashierActive, setCashierActive] = useState(false);
  const [textBubbles, setTextBubbles] = useState<Array<{
    id: string;
    position: [number, number, number];
    message: string;
  }>>([]);
  const navigate = useNavigate();

  // Random messages for occupied computers
  const occupiedMessages = [
    "Hey, I'm working here!",
    "Sorry, I'm a bit occupied",
    "I got here first!",
    "This seat is taken!",
    "Busy gaming right now",
    "Please find another computer",
    "Occupied, thanks!",
    "I'm in the middle of something"
  ];
  
  const [computers] = useState([
    // Vertical Column 1 (Back to Front) - Center
    { id: 1, position: [0, 0.7, -4.5] as [number, number, number], isOccupied: false },
    { id: 2, position: [0, 0.7, -2.5] as [number, number, number], isOccupied: true, currentUser: 'gamer_123' },
    { id: 3, position: [0, 0.7, -0.5] as [number, number, number], isOccupied: false },
    { id: 4, position: [0, 0.7, 1.5] as [number, number, number], isOccupied: true, currentUser: 'retro_player' },
    { id: 5, position: [0, 0.7, 3.5] as [number, number, number], isOccupied: false },
    
    // Vertical Column 2 (Back to Front) - Right side
    { id: 6, position: [3, 0.7, -4] as [number, number, number], isOccupied: true, currentUser: 'cyber_ninja' },
    { id: 7, position: [3, 0.7, -2] as [number, number, number], isOccupied: false },
    { id: 8, position: [3, 0.7, 0] as [number, number, number], isOccupied: false },
    { id: 9, position: [3, 0.7, 2] as [number, number, number], isOccupied: false },
    { id: 10, position: [3, 0.7, 4] as [number, number, number], isOccupied: true, currentUser: 'pro_gamer' },
    
    // Vertical Column 3 (Back to Front) - Far right side
    { id: 11, position: [5.5, 0.7, -4] as [number, number, number], isOccupied: false },
    { id: 12, position: [5.5, 0.7, -2] as [number, number, number], isOccupied: false },
    { id: 13, position: [5.5, 0.7, 0] as [number, number, number], isOccupied: true, currentUser: 'streamer_x' },
    { id: 14, position: [5.5, 0.7, 2] as [number, number, number], isOccupied: false },
    { id: 15, position: [5.5, 0.7, 4] as [number, number, number], isOccupied: false },
  ]);

  const handleCashierDeskClick = () => {
    setCashierActive(true);
    // Cashier desk is positioned at [-4, 0, 3]
    // Flipped perspective: approach from the opposite side
    onCameraTargetChange({
      position: [-5.5, 1.5, 5.5],
      lookAt: [0, 0.7, 1.5]
    });
  };

  const handleCashierClick = () => {
    // setCashierActive(!cashierActive);
    setCashierActive(true);
    // Cashier is positioned at [-4, 0, 2.5]
    onCameraTargetChange({
      position: [-5.5, 1.5, 5.5],
      lookAt: [0, 0.7, 1.5]
    });
  };

  const handleLeaderboardClick = () => {
    // Navigate to leaderboard page
    navigate('/leaderboard');
  };

  const handleComputerClick = (computerId: number) => {
    const computer = computers.find(c => c.id === computerId);
    
    if (computer) {
      if (computer.isOccupied) {
        // Show text bubble for occupied computers
        const randomMessage = getRandomChoice(occupiedMessages);
        const bubbleId = `bubble-${computerId}-${Date.now()}`;
        
        setTextBubbles(prev => [...prev, {
          id: bubbleId,
          position: [computer.position[0], computer.position[1] + 2, computer.position[2]] as [number, number, number],
          message: randomMessage
        }]);
        
        // Remove bubble after animation completes
        setTimeout(() => {
          setTextBubbles(prev => prev.filter(bubble => bubble.id !== bubbleId));
        }, 3500); // 3 seconds display + 0.5 second buffer
      } else {
        // Zoom in and redirect for unoccupied computers
        onCameraTargetChange({
          position: [computer.position[0] - 3, 2, computer.position[2] + 2],
          lookAt: [computer.position[0], 1, computer.position[2]]
        });
        
        setTimeout(() => {
          navigate('/desktop');
        }, 2000);
      }
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
          position={[-4, 0.7, 3]}
        />
        
        {/* Computer on the cashier desk */}
        <ComputerModel
          position={[-4, 0.7, 3]}
          onClick={handleCashierDeskClick}
          isOccupied={cashierActive}
          rotation={[0, 0, 0]}
        />
        
        {/* Master Chief - Behind the cashier desk */}
        <MasterChiefModel 
          position={[-4, 0, 2]} 
          onClick={handleCashierClick}
          isActive={cashierActive}
        />
      </group>
      
      {/* Leaderboard - Back left corner */}
      <LeaderboardModel 
        position={[-5, 1, -4]}
        onClick={handleLeaderboardClick}
        isActive={false}
      />
      
      {/* Computer users */}
      {computers.filter(computers => computers.isOccupied).map((computer) => (
        <User3D
          key={`user-${computer.id}`}
          position={[computer.position[0], computer.position[1], computer.position[2]-0.9]}
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
      
      {/* Text Bubbles for Occupied Computers */}
      {textBubbles.map((bubble) => (
        <PixelatedTextBubble
          key={bubble.id}
          position={bubble.position}
          message={bubble.message}
          onComplete={() => {
            setTextBubbles(prev => prev.filter(b => b.id !== bubble.id));
          }}
        />
      ))}

      {/* Cyberpunk Neon Lighting System */}
      <CyberpunkNeonLights computers={computers} />
      
      {/* Main Central Warm Light */}
      <pointLight position={[0, 5, 0]} intensity={2} color="#D96704" distance={20} decay={0.5} />
      
      {/* Corner Point Lights */}
      <pointLight position={[-6, 4, -6]} intensity={8} color="#D96704" distance={12} decay={0.5} />
      <pointLight position={[6, 4, -6]} intensity={8} color="#D96704" distance={12} decay={0.5} />
      <pointLight position={[-6, 4, 6]} intensity={8} color="#D96704" distance={12} decay={0.5} />
      <pointLight position={[6, 4, 6]} intensity={8} color="#D96704" distance={12} decay={0.5} />
      
      {/* Natural Warm Sky Lighting */}
      <directionalLight 
        position={[0, 10, 0]} 
        intensity={0.6} 
        color="#FFF8DC" 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Window Light Sources - Warm */}
      <directionalLight position={[-10, 5, 0]} intensity={0.3} color="#FFFACD" />
      <directionalLight position={[10, 5, 0]} intensity={0.3} color="#FFFACD" />
      <directionalLight position={[0, 5, -10]} intensity={0.3} color="#FFFACD" />
      
      {/* Outdoor Light Source - Warm evening light */}
      <pointLight 
        position={[0, 5, 15]} 
        intensity={1.5} 
        color="#FFE4B5" 
        distance={25}
        decay={1.5}
        castShadow
      />
      
      {/* Additional outdoor ambient lighting */}
      <pointLight 
        position={[-5, 6, 12]} 
        intensity={1.0} 
        color="#FFFACD" 
        distance={20}
        decay={2}
      />
      <pointLight 
        position={[5, 6, 12]} 
        intensity={1.0} 
        color="#FFFACD" 
        distance={20}
        decay={2}
      />
      
      {/* Warm Ambient Lighting */}
      <ambientLight intensity={0.4} color="#FFF8DC" />
      
      {/* Warm ceiling lights */}
      <pointLight position={[2, 5.5, 0]} intensity={0.8} color="#FFD700" distance={12} decay={1.5} />
      <pointLight position={[4, 5.5, 0]} intensity={0.8} color="#FFA500" distance={12} decay={1.5} />
      <pointLight position={[6, 5.5, 0]} intensity={0.8} color="#FFD700" distance={12} decay={1.5} />
      
      {/* Warm accent lights */}
      <pointLight position={[-3, 5, 2]} intensity={0.6} color="#FFA500" distance={10} decay={2} />
      <pointLight position={[0, 5, -3]} intensity={0.6} color="#FFD700" distance={10} decay={2} />
      <pointLight position={[3, 5, 3]} intensity={0.6} color="#FFA500" distance={10} decay={2} />
      
      {/* Warm Spot Lights for Computer Stations */}
      <spotLight 
        position={[3, 6, 0]} 
        target-position={[3, 0, 0]}
        intensity={0.5} 
        color="#FFD700" 
        angle={Math.PI / 2.5}
        penumbra={0.3}
        distance={15}
      />
      <spotLight 
        position={[6, 6, 0]} 
        target-position={[6, 0, 0]}
        intensity={0.5} 
        color="#FFA500" 
        angle={Math.PI / 2.5}
        penumbra={0.3}
        distance={15}
      />
      <spotLight 
        position={[5.5, 6, 0]} 
        target-position={[5.5, 0, 0]}
        intensity={0.5} 
        color="#FFD700" 
        angle={Math.PI / 2.5}
        penumbra={0.3}
        distance={15}
      />
      
      {/* Cashier Area Spot Light */}
      <spotLight 
        position={[-4, 6, 4]} 
        target-position={[-4, 0, 4]}
        intensity={0.6} 
        color="#FFD700" 
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

  const handleAnimationComplete = () => {
    // Animation complete - camera stays unlocked for user control
  };

  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [-1.5, 4, 6], fov: 90 }}>
        <fog attach="fog" args={['#2F1B14', 8, 15]} />
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
          minDistance={1}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
          // Restrict camera to stay within room boundaries
          minAzimuthAngle={-Math.PI / 2} // Prevent going too far left
          maxAzimuthAngle={Math.PI / 2}  // Prevent going too far right
          // Target position for orbit controls (center of room)
          target={[0, 0, 0]}
        />
      </Canvas>
      
    </div>
  );
};

export default CyberCafe3D;
