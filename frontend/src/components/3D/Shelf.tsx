import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// Load the Shelf Model
const Shelf = ({ position }: {
  position: [number, number, number];
}) => {
  const { scene } = useGLTF('/shelf/scene.gltf');
  const groupRef = useRef<Group>(null);
  
  // Create a unique clone of the scene for each instance
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  return (
    <group
      ref={groupRef}
      position={position}
      scale={[0.5, 0.5, 0.5]} // Scale to fit the wall
      rotation={[0, Math.PI / 2, 0]} // Rotate to face the room
    >
      {/* Shelf Model */}
      <primitive object={clonedScene} />
    </group>
  );
};

export default Shelf;
