import React from 'react';
import { Navigation } from '../_nav/components/Navigation';
import { Routes } from '../_nav/components/Routes';
import {  BrowserRouter as Router } from 'react-router-dom'

export const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes />
    </Router>
  );
};