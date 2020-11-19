import React, { useEffect, useRef, useState } from 'react';
import { Navigation } from '../features/navigation/components/Navigation';
import { Routes } from '../features/navigation/components/Routes';
import {  BrowserRouter as Router } from 'react-router-dom'
import { Copyright } from './Copyright';

export const App: React.FC = () => {
  const [pass, setPass] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  if (!isLogged) {
    return (
      <input
        ref={inputRef}
        value={pass}
        onChange={e => setPass(e.currentTarget.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && pass === 'Speedas11') {
            setIsLogged(true);
          }
        }}
      />
    )
  }

  return (
    <Router>
      <Copyright />
      <Navigation />
      <Routes />
    </Router>
  );
};