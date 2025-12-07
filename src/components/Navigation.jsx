import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [techCount, setTechCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechCount(JSON.parse(saved).length);
    }
  }, []);

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">🚀</span>
            <h2>Трекер Технологий</h2>
          </Link>
        </div>

        <ul className="nav-menu">
          <li>
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">🏠</span>
              Главная
            </Link>
          </li>
          <li>
            <Link
              to="/technologies"
              className={`nav-link ${location.pathname.startsWith('/technologies') ? 'active' : ''}`}
            >
              <span className="nav-icon">📚</span>
              Все технологии
              {techCount > 0 && (
                <span className="nav-badge">{techCount}</span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/add-technology"
              className={`nav-link ${location.pathname === '/add-technology' ? 'active' : ''}`}
            >
              <span className="nav-icon">➕</span>
              Добавить
            </Link>
          </li>
          <li>
            <Link
              to="/statistics"
              className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
            >
              <span className="nav-icon">📈</span>
              Статистика
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              Настройки
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <button 
            className="quick-action"
            onClick={() => navigate('/add-technology')}
            title="Добавить технологию"
          >
            ➕
          </button>
          <div className="nav-info">
            <span className="current-page">
              {location.pathname === '/' && 'Главная'}
              {location.pathname === '/technologies' && 'Все технологии'}
              {location.pathname.startsWith('/technology/') && 'Детали технологии'}
              {location.pathname === '/add-technology' && 'Добавление'}
              {location.pathname === '/statistics' && 'Статистика'}
              {location.pathname === '/settings' && 'Настройки'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;