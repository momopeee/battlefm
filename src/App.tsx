
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Toaster } from 'sonner';

// Import pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import StartScreen from './pages/StartScreen';
import Battle1Screen from './pages/Battle1Screen';
import Victory1Screen from './pages/Victory1Screen';
import SelectScreen from './pages/SelectScreen';
import Battle2Screen from './pages/Battle2Screen';
import EndingAScreen from './pages/EndingAScreen';
import EndingBScreen from './pages/EndingBScreen';
import EndingCScreen from './pages/EndingCScreen';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/start" element={<StartScreen />} />
          <Route path="/battle1" element={<Battle1Screen />} />
          <Route path="/victory1" element={<Victory1Screen />} />
          <Route path="/select" element={<SelectScreen />} />
          <Route path="/battle2" element={<Battle2Screen />} />
          <Route path="/endingA" element={<EndingAScreen />} />
          <Route path="/endingB" element={<EndingBScreen />} />
          <Route path="/endingC" element={<EndingCScreen />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AppProvider>
  );
}

export default App;
