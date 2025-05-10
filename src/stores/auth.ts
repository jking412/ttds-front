import { ref } from 'vue'
import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
  avatar?: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterCredentials {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref('')

  // 模拟用户数据库
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      avatar: '/avatar.jpg'
    },
    {
      id: 2,
      username: 'test',
      email: 'test@example.com',
      password: 'test123',
      avatar: '/avatar.jpg'
    }
  ]

  // 模拟登录
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = ''
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      const foundUser = mockUsers.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      )
      
      if (foundUser) {
        // 登录成功
        const { password, ...userWithoutPassword } = foundUser
        user.value = userWithoutPassword
        isAuthenticated.value = true
        return { success: true }
      } else {
        // 登录失败
        error.value = '用户名或密码错误'
        return { success: false, message: error.value }
      }
    } catch (err) {
      error.value = '登录过程中发生错误'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 模拟注册
  const register = async (credentials: RegisterCredentials) => {
    loading.value = true
    error.value = ''
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    try {
      // 检查密码是否匹配
      if (credentials.password !== credentials.confirmPassword) {
        error.value = '两次输入的密码不匹配'
        return { success: false, message: error.value }
      }
      
      // 检查用户名是否已存在
      if (mockUsers.some(u => u.username === credentials.username)) {
        error.value = '用户名已被使用'
        return { success: false, message: error.value }
      }
      
      // 检查邮箱是否已存在
      if (mockUsers.some(u => u.email === credentials.email)) {
        error.value = '邮箱已被注册'
        return { success: false, message: error.value }
      }
      
      // 模拟创建新用户
      const newUser = {
        id: mockUsers.length + 1,
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
        avatar: '/avatar.jpg'
      }
      
      // 在实际应用中，这里会调用API将用户保存到数据库
      mockUsers.push(newUser)
      
      // 自动登录新注册用户
      const { password, ...userWithoutPassword } = newUser
      user.value = userWithoutPassword
      isAuthenticated.value = true
      
      return { success: true }
    } catch (err) {
      error.value = '注册过程中发生错误'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout
  }
})
