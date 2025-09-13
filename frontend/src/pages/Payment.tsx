import { SignUp, SignedOut, SignedIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect} from 'react';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";

interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  name?: string;
  type?: "email" | "password" | "text" | "number";
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
  const [inputValue, setInputValue] = useState<string>("");
  const [creditCard, setCreditCard] = useState<string>("");
  const [CVV, setCVV] = useState<string>("");
  const [expDate, setexpDate] = useState<string>("");
  
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

  const processPayment=(async () =>{
    const clerkToken = (await getToken()) || "";
    try {
        const response = await fetch('http://localhost:8000/add_credit/', {
          method: 'POST',
          // mode: "no-cors",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "account": clerkToken, "quantity": inputValue }), // Data to send
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);
        // Handle successful response (e.g., update state, show message)
      } catch (error) {
        console.error('Error during POST request:', error);
        // Handle error (e.g., show error message)
      }
  });

  return (<section>
    <div className="product">
      <h2>Add credit to your account</h2>
      <div className="description">
      <h3>Credits for the cyber cafe</h3>
      <h5>$1.00</h5>
      </div>
      <TextField
      id='quantity'
      value={inputValue}
      onChange={textChange}
      type='text'/>
      <TextField
      id='credit_card'
      value={creditCard}
      onChange={textChangeCredit}
      type='text'/>
      <TextField
      id='cvv'
      value={CVV}
      onChange={textChangeCVV}
      type='text'/>
      <TextField
      id='exp_date'
      value={expDate}
      onChange={textChangeexp}
      type='text'/>
    </div>
    <button type="submit" onClick={processPayment}>
    </button>
    <button type="back"></button>
  </section>);
};

export default Payment;