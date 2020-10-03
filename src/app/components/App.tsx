import React from 'react';
import { Navigation } from '../features/navigation/components/Navigation';
import { Routes } from '../features/navigation/components/Routes';
import {  BrowserRouter as Router } from 'react-router-dom'

export const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes />
    </Router>
  );
};