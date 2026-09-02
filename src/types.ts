export interface TaskItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  progress: number;
  attachments?: number;
  comments?: number;
  dueDate?: string;
}

export interface NotificationItem {
  id: string;
  type: 'event' | 'message';
  title: string;
  subtitle: string;
  date?: string;
  timeRange?: string;
  message?: string;
  active?: boolean;
}

export interface ScheduleEvent {
  id: string;
  timeSlot: string;
  title: string;
  time: string;
  category: string;
  iconType: 'people' | 'mug';
}

export interface CalendarDay {
  day: string;
  date: number;
  isActive?: boolean;
}
