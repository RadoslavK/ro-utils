import React from 'react';
import { Navigation } from '../features/navigation/components/Navigation';
import { Routes } from '../features/navigation/components/Routes';
import {  BrowserRouter as Router } from 'react-router-dom'
import { Copyright } from './Copyright';

export const App: React.FC = () => {
  return (
    <Router>
      <Copyright />
      <Navigation />
      <Routes />
    </Router>
  );
};