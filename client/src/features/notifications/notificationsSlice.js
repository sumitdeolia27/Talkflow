import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const exists = state.items.some((item) => item.id === action.payload.id)
      if (!exists) {
        state.items.unshift({
          read: false,
          createdAt: new Date().toISOString(),
          ...action.payload,
        })
      }
    },
    markNotificationRead: (state, action) => {
      const item = state.items.find((notification) => notification.id === action.payload)
      if (item) item.read = true
    },
    markMessageNotificationsRead: (state, action) => {
      state.items = state.items.map((item) => (
        item.type === 'message' && item.fromUserId === action.payload
          ? { ...item, read: true }
          : item
      ))
    },
    markAllNotificationsRead: (state) => {
      state.items = state.items.map((item) => ({ ...item, read: true }))
    },
    clearNotifications: (state) => {
      state.items = []
    },
  }
})

export const {
  addNotification,
  markNotificationRead,
  markMessageNotificationsRead,
  markAllNotificationsRead,
  clearNotifications,
} = notificationsSlice.actions

export default notificationsSlice.reducer
