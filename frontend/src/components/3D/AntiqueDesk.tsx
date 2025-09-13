import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// Load the Antique Desk Model
const AntiqueDesk = ({ position, rotation }: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) => {
  const { scene } = useGLTF('/antique_desk/scene.gltf');
  const groupRef = useRef<Group>(null);
  
  // Create a unique clone of the scene for each instance
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  return (
    <group
      ref={groupRef}
      position={position}
      scale={[1, 1, 1]} // Scale to fit under computers
      rotation={rotation || [0, 0, 0]} // No rotation needed for desks
    >
      {/* Antique Desk Model */}
      <primitive object={clonedScene} />
    </group>
  );
};

export default AntiqueDesk;
