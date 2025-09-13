import { useRef } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { Group } from 'three';
import { useNavigate } from 'react-router-dom';
// import { ClerkProvider } from '@clerk/clerk-react'

// const pubKey='pk_test_c2F2ZWQtaWd1YW5hLTkuY2xlcmsuYWNjb3VudHMuZGV2JA';

// const [loginActive, setLoginActive] = useState(false);

// const TextElem = ({position, onClick, isActive}:{
//   position: [number, number, number];
//   onClick: () => void;
//   isActive: boolean;
// }) => {
//   const groupRef = useRef<Group>(null);

//   return (
//     <group
//       ref={groupRef}
//       position={position}
//       onClick={onClick}
//       scale={[1,1,1]}
//       rotation={[0,Math.PI/4,0]}
//       >
//         <Text
//         position={[-1, 2.5, -1]}
//         fontSize={0.4}
//         color="#d6d91e"
//         anchorX="center"
//         anchorY="middle"
//         rotation={[0,-Math.PI/2, 0]}
//       >
//         Login
//       </Text>
//         {/* {isActive && <Text
//         position={[-1, 3.5, -1]}
//         fontSize={0.4}
//         color="#d6d91e"
//         anchorX="center"
//         anchorY="middle"
//         rotation={[0,-Math.PI/2, 0]}
//       >
//         Holaaaa
//       </Text>} */}
//       </group>
//   )
// }

// const LoginClick=() =>{

// }

// Load the Master Chief model
const MasterChiefModel = ({ position, onClick, isActive }: {
  position: [number, number, number];
  onClick: () => void;
  isActive: boolean;
}) => {
  const { scene } = useGLTF('/master-chief/source/steve.gltf');
  const groupRef = useRef<Group>(null);
  const navigate = useNavigate();

  const handleLoginClick = (e: any) => {
    e.stopPropagation(); // Prevent the parent onClick from firing
    navigate('/login');
  };

  const handleAddCreditsClick = (e: any) => {
    e.stopPropagation(); // Prevent the parent onClick from firing
    navigate('/'); // Redirect to main cyber cafe where user can interact with cashier
  };

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

      {isActive && (
        <group onClick={handleLoginClick}>
          <Text
            position={[-1, 2.5, -1]}
            fontSize={0.4}
            color="#d6d91e"
            anchorX="center"
            anchorY="middle"
            rotation={[0,-Math.PI/2, 0]}
          >
            LOGIN
          </Text>
        </group>
      )}

      {isActive && (
        <group onClick={handleAddCreditsClick}>
          <Text
            position={[1, 2.5, 1]}
            fontSize={0.4}
            color="#d6d91e"
            anchorX="center"
            anchorY="middle"
            rotation={[0,-Math.PI/2, 0]}
          >
            ADD CREDITS
          </Text>
        </group>
      )}
    </group>
  );
};

// Preload the model
useGLTF.preload('/master-chief/source/steve.gltf');

export default MasterChiefModel;
