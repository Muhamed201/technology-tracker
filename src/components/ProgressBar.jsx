import './ProgressBar.css';

// Универсальный компонент прогресс-бара
function ProgressBar({
  progress,    // Текущее значение прогресса (от 0 до 100)
  label = '',    // Подпись к прогресс-бару
  color = '#4CAF50', // Цвет заполнения
  height = 20,    // Высота прогресс-бара
  showPercentage = true, // Показывать ли процент
  animated = false    // Анимировать ли заполнение
}) {
  // Обеспечиваем, чтобы прогресс был в пределах 0-100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-bar-container">
      {/* Заголовок с лейблом и процентом */}
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && (
            <span className="progress-percentage">{normalizedProgress}%</span>
          )}
        </div>
      )}

      {/* Внешняя оболочка прогресс-бара */}
      <div
        className="progress-bar-outer"
        style={{
          height: `${height}px`,
        }}
      >
        {/* Заполняемая часть прогресс-бара */}
        <div
          className={`progress-bar-inner ${animated ? 'animated' : ''}`}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;