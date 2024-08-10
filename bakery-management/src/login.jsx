import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './logo'; // Ensure you have a Logo component
import { auth, signInWithEmailAndPassword } from './firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Access Denied');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#faddaf' }}>
      <div style={{ marginBottom: '2rem', marginLeft: '-20px' }}>
        <Logo />
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '8px', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          style={{ margin: '8px', padding: '12px', width: '100%', maxWidth: '400px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={{ margin: '8px', padding: '12px', width: '100%', maxWidth: '400px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black' }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
       
        <button type="submit" style={{ margin: '8px', padding: '12px', width: '50%', maxWidth: '400px', backgroundColor: '#fc9423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Login</button>
        {message && <p style={{ marginTop: '1rem', color: 'red' }}>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
