import { useState } from 'react';
import Modal from './Modal';

function QuickActions({ onMarkAllCompleted, onResetAll, technologies, onExportData }) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    // Подготовка данных для экспорта
    const data = {
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      completed: technologies.filter(tech => tech.status === 'completed').length,
      inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
      notStarted: technologies.filter(tech => tech.status === 'not-started').length,
      technologies: technologies.map(tech => ({
        id: tech.id,
        title: tech.title,
        status: tech.status,
        notes: tech.notes,
        category: tech.category || 'frontend'
      }))
    };
    
    // Если передана функция для экспорта, вызываем ее
    if (onExportData) {
      onExportData(data);
    } else {
      // Иначе показываем в консоли
      console.log('Данные для экспорта:', JSON.stringify(data, null, 2));
    }
    
    setShowExportModal(true);
  };

  const downloadData = (data) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tech-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    downloadData(data);
    setShowExportModal(false);
  };

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <div className="action-buttons">
        <button onClick={onMarkAllCompleted} className="btn btn-success">
          ☑ Отметить все как выполненные
        </button>
        <button onClick={onResetAll} className="btn btn-warning">
          ↻ Сбросить все статусы
        </button>
        <button onClick={handleExport} className="btn btn-info">
          📤 Экспорт данных
        </button>
      </div>

      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <p>Данные успешно подготовлены для экспорта!</p>
        <p>В файл будет сохранено:</p>
        <ul>
          <li>Всего технологий: {technologies.length}</li>
          <li>Завершено: {technologies.filter(t => t.status === 'completed').length}</li>
          <li>В процессе: {technologies.filter(t => t.status === 'in-progress').length}</li>
          <li>Не начато: {technologies.filter(t => t.status === 'not-started').length}</li>
        </ul>
        <div className="modal-actions">
          <button onClick={handleDownload} className="btn btn-primary">
            ⬇ Скачать JSON файл
          </button>
          <button onClick={() => setShowExportModal(false)} className="btn btn-secondary">
            Закрыть
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default QuickActions;