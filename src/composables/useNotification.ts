import { ref } from 'vue'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const notifications = ref<Notification[]>([])
let notificationId = 0

export const useNotification = () => {
  const add = (notification: Omit<Notification, 'id'>) => {
    const id = notificationId++
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 3000
    }

    notifications.value.push(newNotification)

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }

    return id
  }

  const remove = (id: number) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const success = (title: string, message?: string) => {
    return add({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return add({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    return add({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    return add({ type: 'info', title, message })
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    add,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}
