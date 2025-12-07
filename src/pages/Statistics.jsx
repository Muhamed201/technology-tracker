import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

function Statistics() {
  const [stats, setStats] = useState({
    technologies: [],
    byCategory: {},
    byStatus: {},
    progressOverTime: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      
      // Статистика по категориям
      const byCategory = {};
      technologies.forEach(tech => {
        const category = tech.category || 'other';
        byCategory[category] = (byCategory[category] || 0) + 1;
      });

      // Статистика по статусам
      const byStatus = {
        'not-started': technologies.filter(t => t.status === 'not-started').length,
        'in-progress': technologies.filter(t => t.status === 'in-progress').length,
        'completed': technologies.filter(t => t.status === 'completed').length
      };

      // Расчет прогресса
      const total = technologies.length;
      const completed = byStatus.completed;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Симуляция прогресса за время (в реальном приложении это были бы реальные данные)
      const progressOverTime = [
        { month: 'Янв', progress: 10 },
        { month: 'Фев', progress: 25 },
        { month: 'Мар', progress: 40 },
        { month: 'Апр', progress: 60 },
        { month: 'Май', progress: 75 },
        { month: 'Июн', progress: progress }
      ];

      setStats({
        technologies,
        byCategory,
        byStatus,
        progress,
        total,
        completed,
        progressOverTime
      });
    }
  }, []);

  return (
    <div className="statistics-page">
      <div className="page-header">
        <h1>📈 Статистика и аналитика</h1>
        <p>Детальный анализ вашего прогресса в изучении технологий</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.total || 0}</h3>
            <p>Всего технологий</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed || 0}</h3>
            <p>Завершено</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>{stats.byStatus?.['in-progress'] || 0}</h3>
            <p>В процессе</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.progress || 0}%</h3>
            <p>Общий прогресс</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>📋 Распределение по статусам</h2>
          <div className="chart-content">
            {stats.byStatus && Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">
                    {status === 'not-started' && '⭕ Не начато'}
                    {status === 'in-progress' && '🔄 В процессе'}
                    {status === 'completed' && '✅ Завершено'}
                  </span>
                  <span className="progress-count">{count}</span>
                </div>
                <ProgressBar
                  progress={stats.total ? (count / stats.total) * 100 : 0}
                  height={12}
                  color={
                    status === 'not-started' ? '#ff6b6b' :
                    status === 'in-progress' ? '#4ecdc4' :
                    '#45b7d1'
                  }
                  showPercentage={false}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <h2>🏷️ Распределение по категориям</h2>
          <div className="chart-content">
            {stats.byCategory && Object.entries(stats.byCategory).map(([category, count]) => (
              <div key={category} className="category-item">
                <div className="category-header">
                  <span className="category-label">
                    {category === 'frontend' && '🌐 Frontend'}
                    {category === 'backend' && '⚙️ Backend'}
                    {category === 'database' && '🗄️ Базы данных'}
                    {category === 'devops' && '🔧 DevOps'}
                    {category === 'mobile' && '📱 Мобильная'}
                    {category === 'other' && '📦 Другое'}
                    {!['frontend', 'backend', 'database', 'devops', 'mobile', 'other'].includes(category) && `📁 ${category}`}
                  </span>
                  <span className="category-count">{count}</span>
                </div>
                <ProgressBar
                  progress={stats.total ? (count / stats.total) * 100 : 0}
                  height={12}
                  color="#667eea"
                  showPercentage={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="progress-chart">
        <h2>📅 Прогресс по времени</h2>
        <div className="chart-container">
          <div className="chart-bars">
            {stats.progressOverTime?.map((item, index) => (
              <div key={index} className="bar-container">
                <div className="bar-label">{item.month}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ height: `${item.progress}%` }}
                    title={`${item.progress}%`}
                  ></div>
                </div>
                <div className="bar-value">{item.progress}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recommendations">
        <h2>💡 Рекомендации</h2>
        <div className="recommendations-content">
          {stats.completed === 0 && (
            <div className="recommendation-item">
              <span className="rec-icon">🎯</span>
              <div className="rec-content">
                <h3>Начните с первой технологии!</h3>
                <p>Вы еще не завершили ни одной технологии. Выберите одну и начните изучение!</p>
              </div>
            </div>
          )}
          
          {stats.byStatus?.['in-progress'] > 3 && (
            <div className="recommendation-item">
              <span className="rec-icon">⚠️</span>
              <div className="rec-content">
                <h3>Слишком много технологий в процессе</h3>
                <p>Сосредоточьтесь на завершении одной-двух технологий одновременно.</p>
              </div>
            </div>
          )}
          
          {stats.total > 0 && stats.completed === stats.total && (
            <div className="recommendation-item">
              <span className="rec-icon">🎉</span>
              <div className="rec-content">
                <h3>Отличная работа!</h3>
                <p>Вы завершили все технологии! Добавьте новые или углубите знания по существующим.</p>
              </div>
            </div>
          )}
          
          {(!stats.byCategory?.frontend || stats.byCategory.frontend === 0) && (
            <div className="recommendation-item">
              <span className="rec-icon">🌐</span>
              <div className="rec-content">
                <h3>Попробуйте Frontend технологии</h3>
                <p>Добавьте React, Vue или Angular в свой список для изучения.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;