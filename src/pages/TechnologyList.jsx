import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyCard from '../components/TechnologyCard';

function TechnologyList() {
  const [technologies, setTechnologies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Загружаем технологии из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  // Функция для обновления статуса
  const updateStatus = (id, newStatus) => {
    const updated = technologies.map(tech =>
      tech.id === id ? { ...tech, status: newStatus } : tech
    );
    setTechnologies(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
  };

  // Функция для обновления заметок
  const updateNotes = (id, newNotes) => {
    const updated = technologies.map(tech =>
      tech.id === id ? { ...tech, notes: newNotes } : tech
    );
    setTechnologies(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
  };

  // Функция для удаления технологии
  const deleteTechnology = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      const updated = technologies.filter(tech => tech.id !== id);
      setTechnologies(updated);
      localStorage.setItem('technologies', JSON.stringify(updated));
    }
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tech.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="technology-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📚 Все технологии</h1>
          <Link to="/add-technology" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
        </div>
        
        <div className="controls-row">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Поиск технологий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Все ({technologies.length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'not-started' ? 'active' : ''}`}
              onClick={() => setFilterStatus('not-started')}
            >
              Не начато ({technologies.filter(t => t.status === 'not-started').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
              onClick={() => setFilterStatus('in-progress')}
            >
              В процессе ({technologies.filter(t => t.status === 'in-progress').length})
            </button>
            <button 
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Завершено ({technologies.filter(t => t.status === 'completed').length})
            </button>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{technologies.length}</span>
          <span className="stat-label">Всего</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{technologies.filter(t => t.status === 'not-started').length}</span>
          <span className="stat-label">Не начато</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{technologies.filter(t => t.status === 'in-progress').length}</span>
          <span className="stat-label">В процессе</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{technologies.filter(t => t.status === 'completed').length}</span>
          <span className="stat-label">Завершено</span>
        </div>
      </div>

      {filteredTechnologies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>Технологии не найдены</h3>
          <p>
            {technologies.length === 0 
              ? 'Вы еще не добавили ни одной технологии. Добавьте первую!'
              : 'Попробуйте изменить поисковый запрос или фильтр'}
          </p>
          <Link to="/add-technology" className="btn btn-primary">
            ➕ Добавить технологию
          </Link>
        </div>
      ) : (
        <>
          <div className="results-info">
            <span className="results-count">
              Найдено: {filteredTechnologies.length} из {technologies.length}
            </span>
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                Очистить поиск
              </button>
            )}
          </div>

          <div className="technologies-grid">
            {filteredTechnologies.map(tech => (
              <div key={tech.id} className="technology-card-wrapper">
                <TechnologyCard
                  id={tech.id}
                  title={tech.title}
                  description={tech.description}
                  status={tech.status}
                  notes={tech.notes}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                />
                <div className="card-actions">
                  <Link to={`/technology/${tech.id}`} className="action-link">
                    👁️ Подробнее
                  </Link>
                  <button 
                    className="action-link delete"
                    onClick={() => deleteTechnology(tech.id)}
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TechnologyList;