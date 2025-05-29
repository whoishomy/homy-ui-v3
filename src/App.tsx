import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import AgentDashboard from './pages/agent-dashboard';
import { initializeTrademarkSystem } from './utils/applyTrademarkToAll';
import { getTrademarkName } from './utils/trademark';

function App() {
  useEffect(() => {
    initializeTrademarkSystem();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<AgentDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
