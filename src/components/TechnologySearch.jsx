import { useState, useEffect, useRef, useCallback } from 'react';
import useTechnologiesApi from '../hooks/useTechnologiesApi';

function TechnologySearch({ onSelectTech }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const { searchResults, searchLoading, searchTechnologies } = useTechnologiesApi();
  
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Поиск в локальных данных
  const searchLocally = useCallback((query) => {
    if (!query.trim()) {
      setLocalResults([]);
      return;
    }

    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const results = technologies.filter(tech =>
        tech.title.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase()) ||
        (tech.category && tech.category.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      
      setLocalResults(results);
    }
  }, []);

  // Обработчик изменения поискового запроса с debounce
  const handleSearchChange = useCallback(async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(true);

    // Очищаем предыдущий таймер
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Поиск в локальных данных сразу
    searchLocally(value);

    // Устанавливаем новый таймер для поиска в API (debounce 500ms)
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        searchTechnologies(value);
      }
    }, 500);
  }, [searchLocally, searchTechnologies]);

  // Обработчик выбора технологии
  const handleSelectTech = useCallback((tech) => {
    setSearchTerm('');
    setShowResults(false);
    if (onSelectTech) {
      onSelectTech(tech);
    }
  }, [onSelectTech]);

  // Закрытие результатов при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const allResults = [...localResults, ...searchResults].slice(0, 10);

  return (
    <div className="technology-search" ref={searchContainerRef}>
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="🔍 Поиск технологий по названию, описанию или категории..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            onFocus={() => setShowResults(true)}
          />
          {searchLoading && (
            <div className="search-spinner">
              <div className="spinner"></div>
            </div>
          )}
        </div>

        {showResults && (searchTerm.trim() || allResults.length > 0) && (
          <div className="search-results-dropdown">
            {searchTerm.trim() ? (
              <>
                <div className="search-results-header">
                  <h4>Результаты поиска</h4>
                  <span className="results-count">
                    {allResults.length} найдено
                  </span>
                </div>

                {allResults.length > 0 ? (
                  <div className="search-results-list">
                    {allResults.map((tech) => (
                      <div
                        key={tech.id}
                        className="search-result-item"
                        onClick={() => handleSelectTech(tech)}
                      >
                        <div className="result-content">
                          <h5>{tech.title}</h5>
                          <p className="result-description">
                            {tech.description.length > 100 
                              ? `${tech.description.substring(0, 100)}...` 
                              : tech.description}
                          </p>
                          <div className="result-meta">
                            <span className={`category-badge category-${tech.category || 'other'}`}>
                              {tech.category || 'Другое'}
                            </span>
                            {tech.source && (
                              <span className="source-badge">
                                {tech.source === 'api' && '🌐 API'}
                                {tech.source === 'external-api' && '🔍 Поиск'}
                                {tech.source === 'imported' && '📥 Импорт'}
                                {tech.source === 'local' && '💾 Локально'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="result-action">
                          <span className="action-icon">+</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>Ничего не найдено</p>
                    <small>Попробуйте изменить поисковый запрос</small>
                  </div>
                )}
              </>
            ) : (
              <div className="recent-searches">
                <h4>Недавно искали</h4>
                <p className="search-hint">
                  Начните вводить название технологии для поиска
                </p>
              </div>
            )}

            <div className="search-footer">
              <small>
                🔍 Поиск выполняется в локальных данных и через внешние API
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechnologySearch;