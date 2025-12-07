import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, notes, onStatusChange, onNotesChange }) {
  const handleCardClick = () => {
    if (onStatusChange) {
      const nextStatus = getNextStatus(status);
      onStatusChange(id, nextStatus);
    }
  };

  const handleTextareaChange = (e) => {
    if (onNotesChange) {
      onNotesChange(id, e.target.value);
    }
  };

  const handleTextareaClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`technology-card status-${status.replace('-', '')}`}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <h3>{title}</h3>
        <span className="status-badge">{getStatusText(status)}</span>
      </div>
      
      <p className="description">{description}</p>
      
      <div className="notes-section">
        <h4>Мои заметки:</h4>
        <textarea
          value={notes}
          onChange={handleTextareaChange}
          onClick={handleTextareaClick}
          placeholder="Записывайте сюда важные моменты..."
          rows="3"
        />
        <div className="notes-hint">
          {notes && notes.length > 0 ? `Заметка сохранена (${notes.length} символов)` : 'Добавьте заметку'}
        </div>
      </div>
      
      <div className="card-footer">
        <div className="status-indicator">
          <span className="status-icon">{getStatusIcon(status)}</span>
          <span className="tech-id">ID: {id}</span>
        </div>
      </div>
    </div>
  );
}

function getNextStatus(currentStatus) {
  const statusFlow = {
    'not-started': 'in-progress',
    'in-progress': 'completed',
    'completed': 'not-started'
  };
  return statusFlow[currentStatus] || 'not-started';
}

function getStatusText(status) {
  const statusTexts = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Завершено'
  };
  return statusTexts[status] || status;
}

function getStatusIcon(status) {
  const icons = {
    'not-started': '⭕',
    'in-progress': '🔄',
    'completed': '✅'
  };
  return icons[status] || '❓';
}

export default TechnologyCard;