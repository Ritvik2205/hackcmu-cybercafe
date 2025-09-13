import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// Load the Master Chief model
const MasterChiefModel = ({ position, onClick, isActive }: {
  position: [number, number, number];
  onClick: () => void;
  isActive: boolean;
}) => {
  const { scene } = useGLTF('/master-chief/source/steve.gltf');
  const groupRef = useRef<Group>(null);

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      scale={[1, 1, 1]} // Scale down the model to fit the scene
      rotation={[0, Math.PI / 4, 0]} // Rotate to face the correct direction
    >
      <primitive object={scene} />
      {/* Add a subtle glow effect when active */}
      {isActive && (
        <pointLight 
          position={[0, 2, 0]} 
          intensity={2} 
          color="#00ff00" 
          distance={5}
        />
      )}
    </group>
  );
};

// Preload the model
useGLTF.preload('/master-chief/source/steve.gltf');

export default MasterChiefModel;
