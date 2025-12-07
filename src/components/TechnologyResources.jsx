import { useState, useEffect } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function TechnologyResources({ technologyId, techTitle }) {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  
  const { fetchTechResources } = useTechnologiesApi();

  const loadResources = async () => {
    if (!expanded || resources) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchTechResources(technologyId);
      setResources(data);
    } catch (err) {
      setError('Не удалось загрузить ресурсы');
      console.error('Error loading resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded && !resources) {
      loadResources();
    }
  }, [expanded]);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const resourceTypes = [
    { key: 'documentation', title: '📚 Документация', icon: '📚' },
    { key: 'tutorials', title: '🎓 Обучающие материалы', icon: '🎓' },
    { key: 'community', title: '👥 Сообщество', icon: '👥' },
    { key: 'tools', title: '🛠️ Инструменты', icon: '🛠️' },
    { key: 'books', title: '📖 Книги', icon: '📖' },
    { key: 'courses', title: '🎯 Курсы', icon: '🎯' }
  ];

  return (
    <div className="technology-resources">
      <div className="resources-header" onClick={handleToggle}>
        <h3>
          <span className="resources-icon">📚</span>
          Ресурсы для изучения
          <span className="toggle-arrow">{expanded ? '▲' : '▼'}</span>
        </h3>
        <p className="resources-subtitle">
          Полезные материалы для изучения {techTitle}
        </p>
      </div>

      {expanded && (
        <div className="resources-content">
          {loading ? (
            <div className="resources-loading">
              <div className="spinner"></div>
              <p>Загрузка ресурсов...</p>
            </div>
          ) : error ? (
            <div className="resources-error">
              <p>{error}</p>
              <button onClick={loadResources} className="retry-button">
                Повторить попытку
              </button>
            </div>
          ) : resources ? (
            <div className="resources-grid">
              {resourceTypes.map((type) => {
                const typeResources = resources[type.key] || [
                  { title: 'Документация', url: 'https://example.com/docs' },
                  { title: 'Руководство', url: 'https://example.com/guide' },
                  { title: 'Официальный сайт', url: 'https://example.com' }
                ];

                return (
                  <div key={type.key} className="resource-category">
                    <h4>
                      <span className="category-icon">{type.icon}</span>
                      {type.title}
                    </h4>
                    <ul className="resource-list">
                      {typeResources.slice(0, 3).map((resource, index) => (
                        <li key={index} className="resource-item">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link"
                          >
                            {resource.title}
                            <span className="external-icon">↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    {typeResources.length > 3 && (
                      <div className="more-resources">
                        <span>+ ещё {typeResources.length - 3}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-resources">
              <p>Ресурсы не найдены</p>
              <button onClick={loadResources} className="load-button">
                Попробовать загрузить
              </button>
            </div>
          )}

          <div className="resources-actions">
            <button className="suggest-resource">
              ✨ Предложить ресурс
            </button>
            <button className="refresh-resources" onClick={loadResources}>
              🔄 Обновить
            </button>
          </div>

          <div className="resources-info">
            <p className="info-note">
              💡 <strong>Совет:</strong> Сочетайте разные типы ресурсов для эффективного изучения
            </p>
            <div className="info-tips">
              <span className="tip">📚 Читайте документацию</span>
              <span className="tip">🎓 Проходите курсы</span>
              <span className="tip">👥 Общайтесь в сообществе</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechnologyResources;