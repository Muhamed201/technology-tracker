import { useState } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function RoadmapImporter() {
  const [selectedRoadmap, setSelectedRoadmap] = useState('frontend');
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const { fetchRoadmap, importRoadmap } = useTechnologiesApi();

  const roadmapTypes = [
    { id: 'frontend', name: '🌐 Frontend разработка', description: 'HTML, CSS, JavaScript, React, Vue и другие фронтенд технологии' },
    { id: 'backend', name: '⚙️ Backend разработка', description: 'Node.js, Python, Java, базы данных, API' },
    { id: 'fullstack', name: '🚀 Fullstack разработка', description: 'Полный стек разработки от фронтенда до бэкенда' },
    { id: 'mobile', name: '📱 Мобильная разработка', description: 'React Native, Flutter, Kotlin, Swift' },
    { id: 'devops', name: '🔧 DevOps', description: 'Docker, Kubernetes, CI/CD, облачные технологии' },
    { id: 'data-science', name: '📊 Data Science', description: 'Python, машинное обучение, анализ данных' }
  ];

  const handlePreview = async () => {
    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!selectedRoadmap) return;
    
    setImporting(true);
    try {
      const importedTechs = await importRoadmap(selectedRoadmap);
      setImportedCount(importedTechs.length);
      
      // Показываем уведомление об успехе
      alert(`✅ Успешно импортировано ${importedTechs.length} технологий из дорожной карты!`);
      
      // Через 3 секунды сбрасываем счетчик
      setTimeout(() => {
        setImportedCount(0);
        setShowPreview(false);
      }, 3000);
      
    } catch (error) {
      alert(`❌ Ошибка при импорте: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const [previewData, setPreviewData] = useState([]);

  const loadPreviewData = async (roadmapType) => {
    try {
      const data = await fetchRoadmap(roadmapType);
      setPreviewData(data);
    } catch (error) {
      setPreviewData([]);
    }
  };

  return (
    <div className="roadmap-importer">
      <div className="importer-header">
        <h2>
          <span className="header-icon">🗺️</span>
          Импорт дорожной карты
        </h2>
        <p className="subtitle">
          Загрузите готовую дорожную карту для быстрого старта изучения
        </p>
      </div>

      <div className="importer-controls">
        <div className="roadmap-selector">
          <label htmlFor="roadmap-select">Выберите дорожную карту:</label>
          <div className="selector-wrapper">
            <select
              id="roadmap-select"
              value={selectedRoadmap}
              onChange={(e) => {
                setSelectedRoadmap(e.target.value);
                loadPreviewData(e.target.value);
              }}
              className="roadmap-select"
              disabled={importing}
            >
              {roadmapTypes.map((roadmap) => (
                <option key={roadmap.id} value={roadmap.id}>
                  {roadmap.name}
                </option>
              ))}
            </select>
            <div className="selector-arrow">▼</div>
          </div>
        </div>

        <div className="roadmap-info">
          <h4>
            {roadmapTypes.find(r => r.id === selectedRoadmap)?.name}
          </h4>
          <p>
            {roadmapTypes.find(r => r.id === selectedRoadmap)?.description}
          </p>
        </div>

        <div className="importer-actions">
          <button
            onClick={handlePreview}
            disabled={importing}
            className="btn btn-secondary"
          >
            👁️ Предварительный просмотр
          </button>
          
          <button
            onClick={handleImport}
            disabled={importing}
            className={`btn btn-primary ${importing ? 'loading' : ''}`}
          >
            {importing ? (
              <>
                <span className="spinner-small"></span>
                Импорт...
              </>
            ) : (
              <>
                📥 Импортировать дорожную карту
                {importedCount > 0 && (
                  <span className="import-count">+{importedCount}</span>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="roadmap-preview">
          <div className="preview-header">
            <h3>Предварительный просмотр</h3>
            <button 
              onClick={() => setShowPreview(false)}
              className="close-preview"
            >
              ✕
            </button>
          </div>
          
          <div className="preview-content">
            {previewData.length > 0 ? (
              <div className="preview-grid">
                {previewData.map((tech, index) => (
                  <div key={index} className="preview-card">
                    <div className="preview-card-header">
                      <h4>{tech.title}</h4>
                      <span className={`difficulty-badge difficulty-${tech.difficulty || 'beginner'}`}>
                        {tech.difficulty === 'beginner' && '👶 Начинающий'}
                        {tech.difficulty === 'intermediate' && '🚀 Средний'}
                        {tech.difficulty === 'advanced' && '🔥 Продвинутый'}
                        {!tech.difficulty && '👶 Начинающий'}
                      </span>
                    </div>
                    <p className="preview-description">{tech.description}</p>
                    <div className="preview-meta">
                      <span className={`category-tag category-${tech.category || 'other'}`}>
                        {tech.category || 'Другое'}
                      </span>
                      <span className="preview-estimate">⏱️ ~2-4 недели</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="preview-loading">
                <p>Загрузка предварительного просмотра...</p>
              </div>
            )}
          </div>
          
          <div className="preview-footer">
            <p className="preview-note">
              💡 После импорта вы сможете редактировать, удалять и добавлять заметки к каждой технологии
            </p>
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn btn-primary"
            >
              {importing ? 'Импорт...' : '✅ Импортировать эту дорожную карту'}
            </button>
          </div>
        </div>
      )}

      <div className="importer-features">
        <h3>Преимущества импорта дорожной карты</h3>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h4>Быстрый старт</h4>
            <p>Не тратьте время на создание списка технологий с нуля</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h4>Проверенный путь</h4>
            <p>Следуйте проверенной последовательности изучения</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📈</div>
            <h4>Прогресс обучения</h4>
            <p>Отслеживайте прогресс по каждой технологии</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔄</div>
            <h4>Гибкая настройка</h4>
            <p>Добавляйте, удаляйте и редактируйте технологии под себя</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoadmapImporter;