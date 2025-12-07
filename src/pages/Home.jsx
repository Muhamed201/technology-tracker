import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
// ИСПРАВЛЕННЫЕ ИМПОРТЫ - только то, что действительно нужно
import ProgressBar from '../components/ProgressBar';
import DogMotivation from '../components/DogMotivation';
// Убираем пока TechnologySearch и RoadmapImporter
// import TechnologySearch from '../components/TechnologySearch';
// import RoadmapImporter from '../components/RoadmapImporter';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    progress: 0
  });

  const { technologies, loading, error, refetch } = useTechnologiesApi();

  useEffect(() => {
    if (technologies && technologies.length > 0) {
      const total = technologies.length;
      const completed = technologies.filter(t => t.status === 'completed').length;
      const inProgress = technologies.filter(t => t.status === 'in-progress').length;
      const notStarted = technologies.filter(t => t.status === 'not-started').length;
      const progress = Math.round((completed / total) * 100) || 0;

      setStats({ total, completed, inProgress, notStarted, progress });
    }
  }, [technologies]);

  return (
    <div className="home-page">
      {/* Герой-секция */}
      <div className="hero-section">
        <h1>🚀 Добро пожаловать в Трекер Технологий</h1>
        <p className="subtitle">
          Управляйте своим прогрессом в изучении современных технологий
        </p>
        
        {/* Поиск технологий - временно убираем */}
        {/* <div className="search-section">
          <TechnologySearch onSelectTech={handleTechSelect} />
        </div> */}
        
        {/* Быстрая статистика */}
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Всего технологий</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completed}</h3>
              <p>Завершено</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>В процессе</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <div className="stat-content">
              <h3>{loading ? '...' : 'API'}</h3>
              <p>Внешние данные</p>
            </div>
          </div>
        </div>
      </div>

      {/* Секция прогресса */}
      <div className="progress-section">
        <h2>Ваш общий прогресс</h2>
        {/* Временная замена ProgressBar пока его нет */}
        <div className="progress-bar-simple">
          <div 
            className="progress-fill-simple" 
            style={{ width: `${stats.progress}%` }}
          ></div>
        </div>
        <div className="progress-details">
          <span className="progress-text">{stats.completed}/{stats.total} завершено</span>
          <span className="progress-percent">{stats.progress}%</span>
        </div>
      </div>

      {/* Мотивация от Dog API */}
      <div className="motivation-section">
        <DogMotivation />
      </div>

      {/* Возможности API */}
      <div className="api-features">
        <h2>🌐 Возможности работы с API</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Поиск технологий</h3>
            <p>Ищите технологии в локальной базе</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Ресурсы для изучения</h3>
            <p>Материалы для каждой технологии</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Импорт дорожных карт</h3>
            <p>Загружайте готовые дорожные карты</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Реальное время</h3>
            <p>Обновление данных в реальном времени</p>
          </div>
        </div>
      </div>

      {/* Быстрые ссылки */}
      <div className="quick-links">
        <h2>Быстрый доступ</h2>
        <div className="link-grid">
          <Link to="/technologies" className="link-card">
            <div className="link-icon">📚</div>
            <h3>Все технологии</h3>
            <p>Просмотр и управление всеми технологиями</p>
          </Link>
          
          <Link to="/add-technology" className="link-card">
            <div className="link-icon">➕</div>
            <h3>Добавить технологию</h3>
            <p>Добавьте новую технологию для изучения</p>
          </Link>
          
          <Link to="/statistics" className="link-card">
            <div className="link-icon">📈</div>
            <h3>Статистика</h3>
            <p>Статистика использования технологий</p>
          </Link>
          
          <Link to="/settings" className="link-card">
            <div className="link-icon">⚙️</div>
            <h3>Настройки</h3>
            <p>Настройки приложения</p>
          </Link>
        </div>
      </div>

      {/* Ошибки API */}
      {error && (
        <div className="api-error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <div>
              <h4>Ошибка подключения к API</h4>
              <p>{error}</p>
            </div>
            <button onClick={refetch} className="retry-btn">
              🔄 Повторить
            </button>
          </div>
        </div>
      )}

      {/* Недавно добавленные технологии */}
      <div className="recent-tech">
        <h2>Недавно добавленные технологии</h2>
        <div className="tech-preview">
          {loading ? (
            <div className="loading-techs">
              <div className="spinner"></div>
              <p>Загрузка технологий...</p>
            </div>
          ) : technologies && technologies.length > 0 ? (
            <div className="tech-slider">
              {technologies.slice(0, 5).map(tech => (
                <div key={tech.id} className="tech-slide">
                  <div className="tech-slide-header">
                    <h4>{tech.title}</h4>
                    {tech.source && (
                      <span className="source-label">
                        {tech.source === 'api' && '🌐 API'}
                        {tech.source === 'local' && '💾 Локально'}
                      </span>
                    )}
                  </div>
                  <p className="tech-description">
                    {tech.description && tech.description.length > 80 
                      ? `${tech.description.substring(0, 80)}...` 
                      : tech.description}
                  </p>
                  <div className="tech-slide-footer">
                    <span className={`tech-status status-${tech.status}`}>
                      {tech.status === 'not-started' && '⭕ Не начато'}
                      {tech.status === 'in-progress' && '🔄 В процессе'}
                      {tech.status === 'completed' && '✅ Завершено'}
                    </span>
                    <Link to={`/technology/${tech.id}`} className="tech-link">
                      Подробнее →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-techs">
              <p>Технологий пока нет. Начните с добавления первой!</p>
              <Link to="/add-technology" className="btn btn-primary">
                ➕ Добавить технологию
              </Link>
            </div>
          )}
          
          {technologies && technologies.length > 0 && (
            <div className="tech-preview-actions">
              <Link to="/technologies" className="btn btn-primary">
                Перейти ко всем технологиям →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;