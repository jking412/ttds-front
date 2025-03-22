<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="navbar">
        <div class="brand">{{ brandName }}</div>
        <div class="nav-links">
          <el-menu mode="horizontal" :ellipsis="false" class="menu">
            <el-menu-item v-for="link in navLinks" :key="link.id" :index="link.id.toString()" :class="{ 'is-active': link.active }">
              {{ link.text }}
            </el-menu-item>
          </el-menu>
        </div>
        <div class="user-avatar">
          <el-avatar :size="40" :src="'/avatar.jpg'"></el-avatar>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main>
      <div class="main-content">
        <h1 class="main-heading">{{ mainHeading }}</h1>
        <p class="main-description">{{ mainDescription }}</p>
      </div>

      <!-- 课程卡片区域 -->
      <div class="course-grid">
        <el-card v-for="course in courses" :key="course.id" 
                :class="['course-card', { 'blue-card': course.isHighlighted }]"
                :body-style="{ padding: '30px' }"
                shadow="hover"
                @click="navigateToCourse(course.id)">
          <div class="course-header">
            <div class="icon-container">
              <el-icon v-if="course.icon === 'Link'" class="feature-icon"><Link /></el-icon>
              <el-icon v-else-if="course.icon === 'CreditCard'" class="feature-icon"><CreditCard /></el-icon>
              <el-icon v-else-if="course.icon === 'Check'" class="feature-icon"><Check /></el-icon>
            </div>
            <h3 class="feature-title">{{ course.title }}</h3>
          </div>
          <div class="underline"></div>
          <p class="feature-description">{{ course.description }}</p>
        </el-card>
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { ArrowRight, Link, CreditCard, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const homeStore = useHomeStore()
const { navLinks, mainHeading, mainDescription, courses, brandName } = storeToRefs(homeStore)

// 导航到课程章节页面
const navigateToCourse = (courseId: number) => {
  router.push({ 
    path: '/chapter', 
    query: { courseId }
  })
}

onMounted(() => {
  homeStore.getCourses()
})
</script>

<style scoped>
.home-container {
  position: relative;
  background: linear-gradient(135deg, #FFE4D6 70%, #ffffff 70%);
  min-height: 100vh;
  width: 100%;
}

/* 导航栏样式 */
.header {
  padding: 0 10%;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.brand {
  font-weight: bold;
  font-size: 1.5rem;
  color: #333;
}

.menu {
  border-bottom: none;
  background-color: transparent;
}

.nav-links {
  flex: 1;
  display: flex;
  justify-content: center;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-link {
  color: var(--el-color-primary);
}

.join-button {
  display: flex;
  align-items: center;
}

/* 主要内容区样式 */
el-main {
  padding: 0 10%;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 60px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

.join-us-small {
  margin-bottom: 20px;
  font-size: 1rem;
}

.main-heading {
  font-size: 3rem;
  color: #333;
  margin-bottom: 20px;
}

.main-description {
  color: #666;
  margin-bottom: 30px;
  max-width: 500px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
}

/* 课程卡片区域样式 */
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 40px;
  padding: 0 10%;
}

.course-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  border-radius: 10px;
}

.course-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
}

.blue-card {
  background-color: var(--el-color-primary);
  color: white;
}

.icon-container {
  margin-right: 15px;
  width: 50px;
  height: 50px;
  background-color: var(--el-color-primary);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.blue-card .icon-container {
  background-color: white;
}

.feature-icon {
  font-size: 1.5rem;
  color: white;
}

.blue-card .feature-icon {
  color: var(--el-color-primary);
}

.feature-title {
  margin: 0;
  font-size: 1.2rem;
}

.underline {
  width: 40px;
  height: 2px;
  background-color: var(--el-color-primary);
  margin: 10px 0 15px;
}

.blue-card .underline {
  background-color: white;
}

.feature-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.blue-card .feature-description {
  color: rgba(255, 255, 255, 0.8);
}
</style>
