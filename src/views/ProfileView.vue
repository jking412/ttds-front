<template>
  <div class="profile-page">
    <!-- 自定义头部 -->
    <div class="custom-header">
      <div class="header-content">
        <div class="back-button" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回主页</span>
        </div>
        <div class="header-title">个人信息</div>
        <div class="logout-button" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </div>
      </div>
    </div>

    <div class="profile-container">
      <el-row :gutter="20">
        <!-- 个人信息卡片 -->
        <el-col :span="8">
          <el-card class="info-card">
            <div class="card-header">
              <span>个人信息</span>
              <el-icon class="close-icon"><Close /></el-icon>
            </div>
            <div class="avatar-section">
              <el-avatar :size="120" :src="userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <h2>{{ userInfo.username }}</h2>
              <p class="user-title">{{ userInfo.title || '学生' }}</p>
            </div>
            <div class="info-section">
              <div class="info-item">
                <span class="label">邮箱</span>
                <span class="value">{{ userInfo.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">注册时间</span>
                <span class="value">{{ formatDate(userInfo.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="label">最后登录</span>
                <span class="value">{{ formatDate(userInfo.lastLogin) }}</span>
              </div>
            </div>
            <div class="tags-section">
              <el-tag size="small" effect="plain" type="warning">积极</el-tag>
              <el-tag size="small" effect="plain" type="warning">认真</el-tag>
              <el-tag size="small" effect="plain" type="warning">勤奋</el-tag>
            </div>
          </el-card>
        </el-col>

        <!-- 实验记录卡片 -->
        <el-col :span="8">
          <el-card class="experiment-card">
            <div class="card-header">
              <span>实验记录</span>
              <el-icon class="close-icon"><Close /></el-icon>
            </div>
            <div class="experiment-list">
              <div v-for="(record, index) in experimentRecords" :key="index" class="experiment-item">
                <div class="experiment-content">
                  <div class="experiment-title">
                    <el-icon :class="['status-icon', record.status]"><CircleCheck v-if="record.status === 'success'" /><Warning v-else /></el-icon>
                    <span>{{ record.title }}</span>
                  </div>
                  <div class="experiment-info">
                    <span class="time">{{ formatDate(record.time) }}</span>
                    <el-tag size="small" :type="record.status === 'success' ? 'success' : 'danger'" effect="plain">
                      {{ record.status === 'success' ? '通过' : '未通过' }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 阅读记录卡片 -->
        <el-col :span="8">
          <el-card class="reading-card">
            <div class="card-header">
              <span>阅读记录</span>
              <el-icon class="close-icon"><Close /></el-icon>
            </div>
            <div class="reading-list">
              <div v-for="(book, index) in readingRecords" :key="index" class="reading-item">
                <div class="reading-content">
                  <div class="book-info">
                    <el-icon><Reading /></el-icon>
                    <div class="book-details">
                      <div class="book-title">{{ book.title }}</div>
                      <div class="book-author">{{ book.author }}</div>
                    </div>
                  </div>
                  <div class="reading-progress">
                    <el-progress 
                      :percentage="book.progress" 
                      :color="customColors"
                      :show-text="false"
                      :stroke-width="4"
                    />
                    <span class="progress-text">{{ book.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, Close, CircleCheck, Warning, Reading, SwitchButton } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// 返回主页
const goBack = () => {
  router.push('/')
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    authStore.logout()
    router.push('/login')
  }).catch(() => {
    // 用户取消操作
  })
}

// 用户信息
const userInfo = ref({
  username: 'skynesser',
  email: 'skynesser@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-04-15T10:00:00Z',
  title: '计算机科学专业学生',
  avatar: '/avatar.jpg'
})

// 实验记录数据
const experimentRecords = ref([
  { title: '进程管理实验', time: '2024-04-15T10:00:00Z', status: 'success' },
  { title: '内存管理实验', time: '2024-04-14T15:20:00Z', status: 'failed' },
  { title: '文件系统实验', time: '2024-04-13T11:00:00Z', status: 'success' },
  { title: '设备管理实验', time: '2024-04-12T09:30:00Z', status: 'success' },
  { title: '系统调用实验', time: '2024-04-11T14:00:00Z', status: 'success' }
])

// 阅读记录数据
const readingRecords = ref([
  { title: '操作系统概念', author: 'Abraham Silberschatz', progress: 85 },
  { title: '现代操作系统', author: 'Andrew S. Tanenbaum', progress: 60 },
  { title: 'Linux内核设计与实现', author: 'Robert Love', progress: 45 },
  { title: '深入理解计算机系统', author: 'Randal E. Bryant', progress: 30 },
  { title: 'UNIX环境高级编程', author: 'W. Richard Stevens', progress: 25 }
])

// 进度条颜色
const customColors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
]

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff7e6 0%, #fff1e6 100%);
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

.custom-header {
  background: linear-gradient(135deg, #ff9f43 0%, #ff7e1f 100%);
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 12px 0 rgba(255, 159, 67, 0.2);
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-button, .logout-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.back-button:hover, .logout-button:hover {
  opacity: 0.8;
}

.back-button .el-icon, .logout-button .el-icon {
  margin-right: 5px;
}

.header-title {
  font-size: 1.2rem;
  font-weight: 500;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 20px;
}

.info-card,
.experiment-card,
.reading-card {
  height: calc(100vh - 140px);
  overflow-y: auto;
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px 0 rgba(255, 159, 67, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.info-card:hover,
.experiment-card:hover,
.reading-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px 0 rgba(255, 159, 67, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ffecd9;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff9f43;
  background: rgba(255, 247, 230, 0.5);
  border-radius: 16px 16px 0 0;
  backdrop-filter: blur(10px);
}

.close-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #ffb973;
  transition: color 0.3s;
}

.close-icon:hover {
  color: #ff9f43;
}

/* 实验记录样式 */
.experiment-list {
  padding: 16px;
}

.experiment-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #ffecd9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.experiment-item:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 16px rgba(255, 159, 67, 0.15);
  border-color: #ffb973;
}

.experiment-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.experiment-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
}

.status-icon {
  font-size: 1.1rem;
}

.status-icon.success {
  color: #67c23a;
}

.status-icon.failed {
  color: #f56c6c;
}

.experiment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
  font-size: 0.9rem;
}

/* 阅读记录样式 */
.reading-list {
  padding: 16px;
}

.reading-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #ffecd9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.reading-item:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 16px rgba(255, 159, 67, 0.15);
  border-color: #ffb973;
}

.reading-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.book-info .el-icon {
  font-size: 1.2rem;
  color: #ff9f43;
}

.book-details {
  flex: 1;
}

.book-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.book-author {
  font-size: 0.9rem;
  color: #666;
}

.reading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0 0;
}

:deep(.el-progress-bar__outer) {
  border-radius: 4px;
  background: rgba(255, 159, 67, 0.1);
}

:deep(.el-progress-bar__inner) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #ffecd9;
  transition: background-color 0.3s ease;
}

.info-item:hover {
  background-color: rgba(255, 247, 230, 0.5);
}

.tags-section {
  padding: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tags-section .el-tag {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 6px;
}

.tags-section .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 159, 67, 0.2);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #fff7e6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #ffb973;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #ff9f43;
}

:deep(.el-tag) {
  border-radius: 6px;
}

:deep(.el-card) {
  border: none;
  overflow: hidden;
}

:deep(.el-card__body) {
  padding: 0;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0;
  text-align: center;
}

.avatar-section .el-avatar {
  border: 4px solid rgba(255, 159, 67, 0.1);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.avatar-section .el-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(255, 159, 67, 0.2);
}

.info-section {
  /* 保持不变 */
}
</style>