import { useRef, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// Load the Ceiling Pipes Model
const CeilingPipes = ({ position }: {
  position: [number, number, number];
}) => {
  const { scene } = useGLTF('/ceiling_pipes/scene.gltf');
  const groupRef = useRef<Group>(null);
  
  // Debug: Log when model loads
  console.log('CeilingPipes loaded at position:', position);
  
  // Create a unique clone of the scene for each instance
  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);
  
  return (
    <group
      ref={groupRef}
      position={position}
      scale={[0.02, 0.02, 0.02]} // Increased scale to make pipes more visible
      rotation={[0, Math.PI , 0]} // No rotation needed
    >
      {/* Ceiling Pipes Model */}
      <primitive object={clonedScene} />
    </group>
  );
};

export default CeilingPipes;
