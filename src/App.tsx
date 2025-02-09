// src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import GameList from './components/GameList';
import TeamManager from './components/TeamManager';
import ManageTeam from './components/ManageTeam';
import NewGamePage from './components/NewGamePage';
import GamePage from './components/GamePage';
import ReportPageWrapper from './components/ReportPageWrapper';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/teams" element={<TeamManager />} />
        <Route path="/teams/:teamName" element={<ManageTeam />} />
        <Route path="/newgame" element={<NewGamePage />} />
        <Route path="/game/:gameName" element={<GamePage />} />
        <Route path="/report/:gameName" element={<ReportPageWrapper />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
