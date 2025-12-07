import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import TechnologyResources from '../components/TechnologyResources';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // Загружаем технологию по ID
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
      setEditData(tech || {});
    }
  }, [techId]);

  // Функция для обновления статуса
  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
    }
  };

  // Функция для сохранения изменений
  const saveChanges = () => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, ...editData } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology(editData);
      setIsEditing(false);
    }
  };

  // Функция для удаления технологии
  const deleteTechnology = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту технологию?')) {
      const saved = localStorage.getItem('technologies');
      if (saved) {
        const technologies = JSON.parse(saved);
        const updated = technologies.filter(tech => tech.id !== parseInt(techId));
        localStorage.setItem('technologies', JSON.stringify(updated));
        navigate('/technologies');
      }
    }
  };

  // Если технология не найдена
  if (!technology) {
    return (
      <div className="page not-found">
        <h1>⚠️ Технология не найдена</h1>
        <p>Технология с ID {techId} не существует или была удалена.</p>
        <div className="action-buttons">
          <Link to="/technologies" className="btn btn-primary">
            ← Назад к списку
          </Link>
          <Link to="/" className="btn btn-secondary">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="technology-detail-page">
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/technologies" className="breadcrumb-link">
            ← Все технологии
          </Link>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? '❌ Отменить' : '✏️ Редактировать'}
          </button>
          <button 
            className="btn btn-danger"
            onClick={deleteTechnology}
          >
            🗑️ Удалить
          </button>
        </div>
      </div>

      <div className="detail-content">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Название:</label>
              <input
                type="text"
                value={editData.title || ''}
                onChange={(e) => setEditData({...editData, title: e.target.value})}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label>Описание:</label>
              <textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({...editData, description: e.target.value})}
                className="form-textarea"
                rows="4"
              />
            </div>
            
            <div className="form-group">
              <label>Заметки:</label>
              <textarea
                value={editData.notes || ''}
                onChange={(e) => setEditData({...editData, notes: e.target.value})}
                className="form-textarea"
                rows="6"
                placeholder="Ваши заметки по этой технологии..."
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={saveChanges}
              >
                💾 Сохранить изменения
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditData(technology);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="detail-header">
              <h1>{technology.title}</h1>
              <span className={`status-badge status-${technology.status.replace('-', '')}`}>
                {technology.status === 'not-started' && '⭕ Не начато'}
                {technology.status === 'in-progress' && '🔄 В процессе'}
                {technology.status === 'completed' && '✅ Завершено'}
              </span>
            </div>

            <div className="detail-section">
              <h2>📖 Описание</h2>
              <p>{technology.description}</p>
            </div>

            <div className="detail-section">
              <h2>📊 Статус изучения</h2>
              <div className="status-buttons">
                <button
                  onClick={() => updateStatus('not-started')}
                  className={`status-btn ${technology.status === 'not-started' ? 'active' : ''}`}
                >
                  <span className="status-icon">⭕</span>
                  <span>Не начато</span>
                </button>
                <button
                  onClick={() => updateStatus('in-progress')}
                  className={`status-btn ${technology.status === 'in-progress' ? 'active' : ''}`}
                >
                  <span className="status-icon">🔄</span>
                  <span>В процессе</span>
                </button>
                <button
                  onClick={() => updateStatus('completed')}
                  className={`status-btn ${technology.status === 'completed' ? 'active' : ''}`}
                >
                  <span className="status-icon">✅</span>
                  <span>Завершено</span>
                </button>
              </div>
            </div>

            {technology.notes && (
              <div className="detail-section">
                <h2>📝 Мои заметки</h2>
                <div className="notes-content">
                  <p>{technology.notes}</p>
                  <div className="notes-meta">
                    <span className="notes-length">
                      {technology.notes.length} символов
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Компонент ресурсов технологии - добавляем сюда */}
            <div className="technology-resources-section">
              <TechnologyResources 
                technologyId={technology.id} 
                techTitle={technology.title}
              />
            </div>

            <div className="detail-section">
              <h2>🔗 Дополнительно</h2>
              <div className="additional-info">
                <div className="info-item">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{technology.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Категория:</span>
                  <span className="info-value">{technology.category || 'frontend'}</span>
                </div>
                {technology.source && (
                  <div className="info-item">
                    <span className="info-label">Источник:</span>
                    <span className="info-value source-badge">
                      {technology.source === 'api' && '🌐 API'}
                      {technology.source === 'imported' && '📥 Импорт'}
                      {technology.source === 'local' && '💾 Локально'}
                    </span>
                  </div>
                )}
                {technology.createdAt && (
                  <div className="info-item">
                    <span className="info-label">Добавлено:</span>
                    <span className="info-value">
                      {new Date(technology.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TechnologyDetail;