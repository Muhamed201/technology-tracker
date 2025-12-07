import { useState, useCallback } from 'react';
import useApi from './useApi';

// Базовый URL для API (в реальном приложении замените на ваш API)
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const TECHNOLOGIES_API_URL = `${API_BASE_URL}/posts`; // Используем posts как пример

function useTechnologiesApi() {
  // Используем базовый хук useApi
  const { data: apiData, loading, error, refetch: refetchApi, execute } = useApi(TECHNOLOGIES_API_URL);
  
  const [localTechnologies, setLocalTechnologies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Преобразуем данные из API в формат наших технологий
  const transformApiData = useCallback((apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.slice(0, 10).map((item, index) => ({
      id: item.id || Date.now() + index,
      title: item.title || `Технология ${index + 1}`,
      description: item.body || 'Описание технологии',
      category: index % 3 === 0 ? 'frontend' : index % 3 === 1 ? 'backend' : 'other',
      status: 'not-started',
      notes: '',
      source: 'api',
      createdAt: new Date().toISOString()
    }));
  }, []);

  // Загрузка технологий из API
  const fetchTechnologies = useCallback(async () => {
    const result = await refetchApi();
    if (result) {
      const transformed = transformApiData(result);
      setLocalTechnologies(transformed);
      return transformed;
    }
    return [];
  }, [refetchApi, transformApiData]);

  // Поиск технологий с использованием внешнего API
  const searchTechnologies = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setSearchLoading(true);
    try {
      // Используем внешний API для поиска технологий
      // В данном случае используем JSONPlaceholder как пример
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Ошибка поиска');
      
      const data = await response.json();
      const results = data.slice(0, 5).map((item, index) => ({
        id: `search-${item.id}-${index}`,
        title: item.title || `Результат поиска ${index + 1}`,
        description: item.body || 'Описание найденной технологии',
        category: 'search',
        status: 'not-started',
        source: 'external-api'
      }));
      
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Получение дополнительных ресурсов для технологии
  const fetchTechResources = useCallback(async (techId) => {
    try {
      // Используем внешний API для получения ресурсов
      // В реальном приложении здесь будет запрос к вашему API
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${techId}`);
      if (!response.ok) throw new Error('Ошибка загрузки ресурсов');
      
      const data = await response.json();
      
      // Преобразуем данные в формат ресурсов
      return {
        documentation: [
          { title: 'Официальная документация', url: 'https://example.com/docs' },
          { title: 'Руководство для начинающих', url: 'https://example.com/guide' }
        ],
        tutorials: [
          { title: 'Видео курс', url: 'https://example.com/video' },
          { title: 'Интерактивные уроки', url: 'https://example.com/interactive' }
        ],
        community: [
          { title: 'Форум', url: 'https://example.com/forum' },
          { title: 'Discord сообщество', url: 'https://example.com/discord' }
        ]
      };
    } catch (error) {
      console.error('Error fetching resources:', error);
      return {
        documentation: [],
        tutorials: [],
        community: []
      };
    }
  }, []);

  // Импорт технологии из внешнего источника
  const importTechnology = useCallback(async (techData) => {
    try {
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTech = {
        id: Date.now(),
        ...techData,
        status: 'not-started',
        notes: '',
        importedAt: new Date().toISOString(),
        source: 'imported'
      };
      
      setLocalTechnologies(prev => [...prev, newTech]);
      
      // Сохраняем в localStorage
      const saved = localStorage.getItem('technologies');
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem('technologies', JSON.stringify([...existing, newTech]));
      
      return newTech;
    } catch (error) {
      throw new Error('Не удалось импортировать технологию');
    }
  }, []);

  // Загрузка дорожной карты из API
  const fetchRoadmap = useCallback(async (roadmapType = 'frontend') => {
    try {
      // Используем мок данные, так как реального API для roadmaps у нас нет
      const mockRoadmaps = {
        frontend: [
          {
            title: 'HTML & CSS',
            description: 'Основы веб-разработки',
            category: 'frontend',
            difficulty: 'beginner'
          },
          {
            title: 'JavaScript',
            description: 'Язык программирования для веба',
            category: 'frontend',
            difficulty: 'beginner'
          },
          {
            title: 'React',
            description: 'Библиотека для создания пользовательских интерфейсов',
            category: 'frontend',
            difficulty: 'intermediate'
          },
          {
            title: 'TypeScript',
            description: 'Типизированное надмножество JavaScript',
            category: 'frontend',
            difficulty: 'intermediate'
          },
          {
            title: 'Next.js',
            description: 'Фреймворк для React',
            category: 'frontend',
            difficulty: 'advanced'
          }
        ],
        backend: [
          {
            title: 'Node.js',
            description: 'Среда выполнения JavaScript',
            category: 'backend',
            difficulty: 'intermediate'
          },
          {
            title: 'Express.js',
            description: 'Фреймворк для Node.js',
            category: 'backend',
            difficulty: 'intermediate'
          },
          {
            title: 'MongoDB',
            description: 'NoSQL база данных',
            category: 'database',
            difficulty: 'intermediate'
          },
          {
            title: 'PostgreSQL',
            description: 'Реляционная база данных',
            category: 'database',
            difficulty: 'intermediate'
          },
          {
            title: 'Docker',
            description: 'Платформа для контейнеризации',
            category: 'devops',
            difficulty: 'advanced'
          }
        ]
      };

      return mockRoadmaps[roadmapType] || mockRoadmaps.frontend;
    } catch (error) {
      throw new Error('Не удалось загрузить дорожную карту');
    }
  }, []);

  // Импорт дорожной карты
  const importRoadmap = useCallback(async (roadmapType) => {
    try {
      const roadmap = await fetchRoadmap(roadmapType);
      
      const importedTechs = [];
      for (const tech of roadmap) {
        const newTech = await importTechnology(tech);
        importedTechs.push(newTech);
      }
      
      return importedTechs;
    } catch (error) {
      throw new Error('Не удалось импортировать дорожную карту');
    }
  }, [fetchRoadmap, importTechnology]);

  return {
    // Данные и состояния
    technologies: localTechnologies.length > 0 ? localTechnologies : transformApiData(apiData),
    searchResults,
    loading,
    searchLoading,
    error,
    
    // Методы
    fetchTechnologies,
    searchTechnologies,
    fetchTechResources,
    importTechnology,
    importRoadmap,
    fetchRoadmap,
    refetch: fetchTechnologies
  };
}

export default useTechnologiesApi;