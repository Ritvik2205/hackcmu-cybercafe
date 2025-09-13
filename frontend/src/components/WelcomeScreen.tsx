import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomeScreen: React.FC = () => {
  const [doorOpen, setDoorOpen] = useState(false);
  const navigate = useNavigate();

  const handleDoorClick = () => {
    console.log('WelcomeScreen: Door clicked');
    setDoorOpen(true);
    
    // After door animation completes, redirect to cyber café
    setTimeout(() => {
      console.log('Redirecting to cyber café');
      navigate('/cybercafe');
    }, 1200); // Give time for door animation to complete
  };

  console.log('WelcomeScreen render:', { doorOpen });

  return (
    <div 
      className="welcome-background" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'url("/cybercafe_with_black_door_1.png") no-repeat center center',
        backgroundSize: '100% 85%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        perspective: '900px',
        transform: doorOpen ? 'translate(-20%, -50%) scale(20)' : 'scale(1.2)',
        transition: '1s ease',
        overflow: 'hidden'
      }}
    >
      <div
        className={`welcome-door ${doorOpen ? "welcome-open" : ""}`}
        onClick={handleDoorClick}
        style={{
          width: '16%',
          height: '80%',
          background: 'url("/door.png")',
          backgroundSize: '100% 100%',
          position: 'absolute',
          backgroundRepeat: 'no-repeat',
          top: '29.5%',
          left: '46%',
          transform: doorOpen ? 'translate(-50%, -10%) scale(0.35) rotateY(90deg)' : 'translate(-50%, -10%) scale(0.35)',
          transformOrigin: 'right center',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
          cursor: 'pointer',
          zIndex: 2,
          transition: 'transform 1s ease, opacity 0.6s ease 0.2s',
          opacity: doorOpen ? 0 : 1
        }}
      >
      </div>
    </div>
  );
}


export default WelcomeScreen;