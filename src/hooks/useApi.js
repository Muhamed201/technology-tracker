import { useState, useEffect, useCallback, useRef } from 'react';

// Кастомный хук для работы с API
function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Функция для выполнения запроса
  const fetchData = useCallback(async (customUrl = url, customOptions = options) => {
    try {
      setLoading(true);
      setError(null);

      // Отменяем предыдущий запрос, если он существует
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Создаем новый AbortController для текущего запроса
      abortControllerRef.current = new AbortController();

      const response = await fetch(customUrl, {
        ...customOptions,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;

    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err.name !== 'AbortError') {
        setError(err.message || 'Произошла ошибка при загрузке данных');
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Выполняем запрос при изменении URL
  useEffect(() => {
    if (url) {
      fetchData();
    }

    // Функция очистки - отменяем запрос при размонтировании
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Функция для повторного выполнения запроса
  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Функция для выполнения произвольного запроса
  const execute = useCallback(async (customUrl, customOptions = {}) => {
    return await fetchData(customUrl, customOptions);
  }, [fetchData]);

  return { data, loading, error, refetch, execute };
}

export default useApi;