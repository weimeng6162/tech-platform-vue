/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '../api/types'
import { login as loginApi, logout as logoutApi } from '../api/modules/user'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<UserProfile | null>(null)
  const isLoggedIn = computed(() => !!token.value)

  /**
   * 登录
   */
  async function login(username: string, encryptedPassword: string) {
    try {
      const response = await loginApi({
        username,
        password: encryptedPassword,
        timestamp: Date.now()
      })

      token.value = response.token
      userInfo.value = response.user
      localStorage.setItem('token', response.token)

      return { success: true, message: '登录成功' }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '登录失败，请重试'
      }
    }
  }

  /**
   * 登出
   */
  async function logout() {
    try {
      await logoutApi()
    } catch (error) {
      console.error('登出接口调用失败:', error)
    } finally {
      token.value = null
      userInfo.value = null
      localStorage.removeItem('token')
    }
  }

  function setUserInfo(info: UserProfile) {
    userInfo.value = info
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearUserInfo() {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    login,
    logout,
    setUserInfo,
    setToken,
    clearUserInfo
  }
})
