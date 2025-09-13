import { SignUp, SignedOut, SignedIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect} from 'react';
import axios from 'axios';

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
  
  const textChange=((newVal:string) => {
    setInputValue(newVal)
  })

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
    </div>
    <form action="/create-checkout-session" method="POST">
      <button type="submit">
        Checkout
      </button>
    </form>
  </section>);
};

export default Payment;