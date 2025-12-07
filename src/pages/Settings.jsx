import { useState, useEffect } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    username: 'Пользователь',
    theme: 'light',
    language: 'ru',
    notifications: true,
    autoSave: true
  });

  // Загружаем настройки из localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Сохраняем настройки в localStorage
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const exportData = () => {
    const technologies = localStorage.getItem('technologies');
    const appSettings = localStorage.getItem('appSettings');
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      data: {
        technologies: technologies ? JSON.parse(technologies) : [],
        settings: appSettings ? JSON.parse(appSettings) : settings
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (confirm('Вы уверены? Это перезапишет все текущие данные.')) {
          if (data.data?.technologies) {
            localStorage.setItem('technologies', JSON.stringify(data.data.technologies));
          }
          if (data.data?.settings) {
            localStorage.setItem('appSettings', JSON.stringify(data.data.settings));
            setSettings(data.data.settings);
          }
          alert('Данные успешно импортированы!');
          window.location.reload();
        }
      } catch (error) {
        alert('Ошибка при импорте данных: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  const resetData = () => {
    if (confirm('ВНИМАНИЕ! Это удалит ВСЕ ваши технологии и заметки. Продолжить?')) {
      localStorage.removeItem('technologies');
      localStorage.removeItem('appSettings');
      alert('Все данные сброшены. Страница будет перезагружена.');
      window.location.reload();
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>⚙️ Настройки приложения</h1>
        <p>Настройте внешний вид и поведение трекера технологий</p>
      </div>

      <div className="settings-sections">
        <div className="settings-section">
          <h2>👤 Профиль пользователя</h2>
          
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              name="username"
              type="text"
              value={settings.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Введите ваше имя"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>🎨 Внешний вид</h2>
          
          <div className="form-group">
            <label htmlFor="theme">Тема оформления</label>
            <select
              id="theme"
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="form-select"
            >
              <option value="light">🌞 Светлая</option>
              <option value="dark">🌙 Тёмная</option>
              <option value="auto">🔄 Авто</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="language">Язык интерфейса</label>
            <select
              id="language"
              name="language"
              value={settings.language}
              onChange={handleChange}
              className="form-select"
            >
              <option value="ru">🇷🇺 Русский</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>🔔 Уведомления</h2>
          
          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              <span className="checkbox-label">Включить уведомления</span>
            </label>
            <div className="checkbox-hint">
              Получать напоминания о незавершенных технологиях
            </div>
          </div>

          <div className="form-checkbox">
            <label>
              <input
                type="checkbox"
                name="autoSave"
                checked={settings.autoSave}
                onChange={handleChange}
              />
              <span className="checkbox-label">Автосохранение</span>
            </label>
            <div className="checkbox-hint">
              Автоматически сохранять изменения без подтверждения
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>💾 Управление данными</h2>
          
          <div className="data-actions">
            <button onClick={exportData} className="btn btn-primary">
              📥 Экспорт всех данных
            </button>
            
            <div className="import-container">
              <label htmlFor="import-file" className="btn btn-secondary">
                📤 Импорт данных
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={importData}
                style={{ display: 'none' }}
              />
            </div>

            <button onClick={resetData} className="btn btn-danger">
              🗑️ Сбросить все данные
            </button>
          </div>

          <div className="data-info">
            <h3>Информация о хранилище</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Технологий:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('technologies') || '[]').length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Заметок:</span>
                <span className="info-value">
                  {JSON.parse(localStorage.getItem('technologies') || '[]')
                    .filter(t => t.notes && t.notes.length > 0).length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Размер данных:</span>
                <span className="info-value">
                  {Math.round((localStorage.getItem('technologies')?.length || 0) / 1024)} KB
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>ℹ️ О приложении</h2>
          
          <div className="about-content">
            <p><strong>Трекер технологий v1.0</strong></p>
            <p>Приложение для отслеживания прогресса в изучении технологий</p>
            <p>Все данные хранятся локально в вашем браузере</p>
            <p className="version">Версия: 1.0.0</p>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button 
          className="btn btn-success"
          onClick={() => alert('Настройки сохранены!')}
        >
          💾 Сохранить все настройки
        </button>
      </div>
    </div>
  );
}

export default Settings;