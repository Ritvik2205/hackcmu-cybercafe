import React from 'react';

interface PixelatedCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
}

const PixelatedCreditModal: React.FC<PixelatedCreditModalProps> = ({ isOpen, onClose, credits }) => {
  console.log('PixelatedCreditModal render:', { isOpen, credits });
  if (!isOpen) return null;

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    fontFamily: 'monospace',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    border: '4px solid #00ff00',
    borderRadius: '0px',
    padding: '20px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 0 20px #00ff00',
    position: 'relative',
    animation: 'pixelateGlow 2s ease-in-out infinite alternate',
  };

  const titleStyle: React.CSSProperties = {
    color: '#00ff00',
    fontSize: '18px',
    marginBottom: '15px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: 'bold',
  };

  const creditsStyle: React.CSSProperties = {
    color: '#ffff00',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: 'bold',
    textShadow: '2px 2px 0px #ff0000',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#00ff00',
    color: '#000000',
    border: '2px solid #00ff00',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  };

  const buttonHoverStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    color: '#00ff00',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>🎉 CONGRATULATIONS! 🎉</div>
        <div style={creditsStyle}>
          You now have {credits.toLocaleString()} credits
        </div>
        <button 
          style={buttonStyle}
          onClick={onClose}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, buttonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
        >
          Continue
        </button>
      </div>
      
      <style>{`
        @keyframes pixelateGlow {
          0% {
            box-shadow: 0 0 20px #00ff00;
          }
          100% {
            box-shadow: 0 0 30px #00ff00, 0 0 40px #00ff00;
          }
        }
      `}</style>
    </div>
  );
};

export default PixelatedCreditModal;
