import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from "@clerk/clerk-react";
import PixelatedCreditModal from '../components/PixelatedCreditModal';
import { useUserCredits } from '../contexts/UserCreditsContext';

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
  type?: "email" | "password" | "text" | "number";
  id?: string;
  style?: React.CSSProperties;
  // Add other standard input attributes as needed
}

const TextField= ({ onChange, value, ...rest }: TextFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
      {...rest} // Spreads other props like placeholder, type, name, etc.
    />
  );
};

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>("");
  const [creditCard, setCreditCard] = useState<string>("");
  const [CVV, setCVV] = useState<string>("");
  const [expDate, setexpDate] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [newCredits, setNewCredits] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const textChange=((newVal:string) => {
    setInputValue(newVal)
  });
  const textChangeCredit=((newVal:string) => {
    setCreditCard(newVal)
  });
  const textChangeCVV=((newVal:string) => {
    setCVV(newVal)
  });
  const textChangeexp=((newVal:string)=>{
    setexpDate(newVal)
  });

  const { getToken } = useAuth();
  const { updateCredits } = useUserCredits();

  const processPayment = async () => {
    if (!inputValue || isNaN(Number(inputValue)) || Number(inputValue) <= 0) {
      alert('Please enter a valid number of credits to purchase.');
      return;
    }

    if (!creditCard || !CVV || !expDate) {
      alert('Please fill in all payment details.');
      return;
    }

    setIsProcessing(true);
    const clerkToken = (await getToken()) || "";
    
    try {
        const response = await fetch('http://localhost:8000/add_credit/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "account": clerkToken, "quantity": inputValue }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        
        // Assuming the API returns the total credits after purchase
        // Try different possible response formats
        let totalCredits;
        if (data.total_credits) {
          totalCredits = data.total_credits;
        } else if (data.credits) {
          totalCredits = data.credits;
        } else if (data.previous_credits) {
          totalCredits = data.previous_credits + parseInt(inputValue);
        } else {
          // Fallback: just use the purchased amount as total (for testing)
          totalCredits = parseInt(inputValue);
        }
        console.log('Setting new credits:', totalCredits);
        setNewCredits(totalCredits);
        console.log('Showing success modal...');
        setShowSuccessModal(true);
        
        // Update global credits state
        updateCredits(totalCredits);
        
        // Reset form
        setInputValue("");
        setCreditCard("");
        setCVV("");
        setexpDate("");
        
      } catch (error) {
        console.error('Error during POST request:', error);
        alert('Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
  };

  const goHome = () => {
    navigate('/cybercafe');
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to cyber café after showing success message
    navigate('/cybercafe');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      // backgroundImage: 'url("/desktop.webp")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'monospace',
      padding: '20px',
    }}>
      {/* Pixelated Payment Form */}
      <div style={{
        backgroundColor: '#000000',
        border: '4px solid #00ff00',
        padding: '30px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 0 20px #00ff00',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{
          color: '#00ff00',
          fontSize: '24px',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          fontWeight: 'bold',
        }}>
          💳 CREDIT PURCHASE 💳
        </div>
        
        <div style={{
          color: '#ffff00',
          fontSize: '16px',
          marginBottom: '30px',
        }}>
          Buy Credits for Cyber Café
        </div>

        {/* Price Display */}
        <div style={{
          backgroundColor: '#001100',
          border: '2px solid #00ff00',
          padding: '15px',
          marginBottom: '25px',
        }}>
          <div style={{ color: '#00ff00', fontSize: '14px', marginBottom: '5px' }}>PRICE PER CREDIT</div>
          <div style={{ color: '#ffff00', fontSize: '20px', fontWeight: 'bold' }}>$1.00</div>
        </div>

        {/* Form Fields */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#00ff00', fontSize: '14px', marginBottom: '8px', textAlign: 'left' }}>
            CREDITS TO BUY:
          </div>
          <TextField
            id='quantity'
            value={inputValue}
            onChange={textChange}
            type='number'
            placeholder='Enter amount'
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000000',
              border: '2px solid #00ff00',
              color: '#00ff00',
              fontSize: '16px',
              fontFamily: 'monospace',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#00ff00', fontSize: '14px', marginBottom: '8px', textAlign: 'left' }}>
            CREDIT CARD NUMBER:
          </div>
          <TextField
            id='credit_card'
            value={creditCard}
            onChange={textChangeCredit}
            type='text'
            placeholder='1234 5678 9012 3456'
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000000',
              border: '2px solid #00ff00',
              color: '#00ff00',
              fontSize: '16px',
              fontFamily: 'monospace',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#00ff00', fontSize: '14px', marginBottom: '8px', textAlign: 'left' }}>
              CVV:
            </div>
            <TextField
              id='cvv'
              value={CVV}
              onChange={textChangeCVV}
              type='text'
              placeholder='123'
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#000000',
                border: '2px solid #00ff00',
                color: '#00ff00',
                fontSize: '16px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ flex: 2 }}>
            <div style={{ color: '#00ff00', fontSize: '14px', marginBottom: '8px', textAlign: 'left' }}>
              EXP DATE:
            </div>
            <TextField
              id='exp_date'
              value={expDate}
              onChange={textChangeexp}
              type='text'
              placeholder='MM/YY'
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#000000',
                border: '2px solid #00ff00',
                color: '#00ff00',
                fontSize: '16px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button 
            type="submit" 
            onClick={processPayment}
            disabled={isProcessing}
            style={{
              flex: 1,
              backgroundColor: isProcessing ? '#444' : '#00ff00',
              color: isProcessing ? '#888' : '#000000',
              border: '2px solid #00ff00',
              padding: '15px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.color = '#00ff00';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) {
                e.currentTarget.style.backgroundColor = '#00ff00';
                e.currentTarget.style.color = '#000000';
              }
            }}
          >
            {isProcessing ? 'Processing...' : 'Buy Credits'}
          </button>
          
          <button 
            type="button" 
            onClick={goHome}
            style={{
              flex: 1,
              backgroundColor: '#000000',
              color: '#ff0000',
              border: '2px solid #ff0000',
              padding: '15px',
              fontSize: '16px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff0000';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#000000';
              e.currentTarget.style.color = '#ff0000';
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Pixelated Credit Success Modal */}
      <PixelatedCreditModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        credits={newCredits}
      />
    </div>
  );
};

export default Payment;