import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/technology/:techId" element={<TechnologyDetail />} />
            <Route path="/add-technology" element={<AddTechnology />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <p>🚀 Трекер технологий • Все данные сохраняются локально</p>
            <div className="footer-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
              <span className="divider">•</span>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.reload();
              }}>Очистить данные</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;