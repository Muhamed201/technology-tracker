import useLocalStorage from './useLocalStorage';

// Начальные данные для технологий
const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов React',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 2,
    title: 'JSX Syntax',
    description: 'Освоение синтаксиса JSX и его особенностей',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 3,
    title: 'State Management',
    description: 'Работа с состоянием компонентов через useState и Context',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 4,
    title: 'React Router',
    description: 'Настройка маршрутизации в React-приложении',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 5,
    title: 'API Integration',
    description: 'Работа с внешними API и обработка данных',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Функция для обновления статуса технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Функция для обновления заметок
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Функция для расчета общего прогресса
  const calculateProgress = () => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  };

  // Функция для отметки всех как выполненных
  const markAllAsCompleted = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Функция для сброса всех статусов
  const resetAllStatuses = () => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  return {
    technologies,
    updateStatus,
    updateNotes,
    markAllAsCompleted,
    resetAllStatuses,
    progress: calculateProgress(),
    total: technologies.length,
    completed: technologies.filter(tech => tech.status === 'completed').length,
    inProgress: technologies.filter(tech => tech.status === 'in-progress').length,
    notStarted: technologies.filter(tech => tech.status === 'not-started').length,
  };
}

export default useTechnologies;