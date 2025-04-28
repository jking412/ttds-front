<template>
  <CommonLayout>
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
  </CommonLayout>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { Link, CreditCard, Check } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import CommonLayout from '@/components/CommonLayout.vue'

const router = useRouter()
const homeStore = useHomeStore()
const { mainHeading, mainDescription, courses } = storeToRefs(homeStore)

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
