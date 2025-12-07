import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
    category: 'frontend',
    status: 'not-started'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверяем заполненность обязательных полей
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название технологии');
      return;
    }

    // Получаем существующие технологии
    const saved = localStorage.getItem('technologies');
    const existingTechs = saved ? JSON.parse(saved) : [];
    
    // Генерируем новый ID
    const newId = existingTechs.length > 0 
      ? Math.max(...existingTechs.map(t => t.id)) + 1 
      : 1;
    
    // Создаем новую технологию
    const newTechnology = {
      id: newId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      notes: formData.notes.trim(),
      category: formData.category,
      status: formData.status,
      createdAt: new Date().toISOString()
    };

    // Добавляем к существующим
    const updatedTechs = [...existingTechs, newTechnology];
    
    // Сохраняем
    localStorage.setItem('technologies', JSON.stringify(updatedTechs));
    
    // Показываем сообщение и перенаправляем
    alert(`Технология "${formData.title}" успешно добавлена!`);
    navigate('/technologies');
  };

  return (
    <div className="add-technology-page">
      <div className="page-header">
        <h1>➕ Добавить новую технологию</h1>
        <p>Заполните форму, чтобы добавить технологию для изучения</p>
      </div>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-section">
          <h2>Основная информация</h2>
          
          <div className="form-group">
            <label htmlFor="title" className="required">
              Название технологии
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: React Hooks"
              className="form-input"
              required
            />
            <div className="form-hint">
              Краткое и понятное название технологии
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="required">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Опишите, что это за технология и что вы планируете изучить..."
              className="form-textarea"
              rows="4"
              required
            />
            <div className="form-hint">
              Подробное описание поможет лучше понять суть технологии
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Дополнительные настройки</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Базы данных</option>
                <option value="devops">DevOps</option>
                <option value="mobile">Мобильная разработка</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Начальный статус</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="not-started">⭕ Не начато</option>
                <option value="in-progress">🔄 В процессе</option>
                <option value="completed">✅ Завершено</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Первоначальные заметки</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Добавьте заметки, цели или планы по изучению..."
              className="form-textarea"
              rows="6"
            />
            <div className="form-hint">
              Эти заметки можно будет изменить позже
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            💾 Сохранить технологию
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/technologies')}
          >
            ❌ Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;