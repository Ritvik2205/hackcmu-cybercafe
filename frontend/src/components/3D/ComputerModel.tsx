import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { Box } from '@react-three/drei';

// Load the Computer Model
const ComputerModel = ({ position, onClick, isOccupied, rotation }: {
  position: [number, number, number];
  onClick: () => void;
  isOccupied: boolean;
  rotation?: [number, number, number];
}) => {
  const { scene } = useGLTF('/computer-model/scene.gltf');
  const groupRef = useRef<Group>(null);
  
  // Create a unique clone of the scene for each instance
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);
  

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      scale={[0.015, 0.015, 0.015]} // Better scaling for GLTF model
      rotation={rotation || [0, -Math.PI / 2, 0]} // Rotate to face the correct direction
    >
      {/* GLTF Computer Model - using cloned scene */}
      <primitive object={clonedScene} />
      
      {/* Fallback box in case GLTF doesn't load properly */}
      <Box args={[0.5, 0.5, 0.5]} position={[0, 0.25, 0]} visible={false}>
        <meshLambertMaterial color={isOccupied ? "#00ff00" : "#666"} />
      </Box>
      
      {/* Add a subtle glow effect when occupied */}
      {isOccupied && (
        <pointLight 
          position={[0, 1, 0]} 
          intensity={1.5} 
          color="#00ff00" 
          distance={3}
        />
      )}
    </group>
  );
};

// Note: Preloading removed since we're cloning scenes for each instance

export default ComputerModel;
