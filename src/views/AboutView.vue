<template>
  <CommonLayout>
    <div class="about-container">
      <el-card class="about-card">
        <template #header>
          <div class="card-header">
            <h2>关于 StudyOS</h2>
          </div>
        </template>
        
        <div class="about-content">
          <section class="about-section">
            <h3>项目背景</h3>
            <p>StudyOS 诞生于对计算机系统教学现状的深入思考。在传统的计算机系统课程教学中，学生往往难以直观地理解抽象的系统概念和原理。我们意识到，通过构建一个交互式的实验学习平台，可以帮助学生更好地掌握计算机系统的核心知识。</p>
            <p>本项目由一群热爱计算机系统教学的教育工作者和开发者共同打造，旨在为学生提供一个直观、互动、高效的学习环境。</p>
          </section>

          <section class="about-section">
            <h3>项目作用</h3>
            <p>StudyOS 致力于解决计算机系统教学中的以下问题：</p>
            <ul>
              <li>提供直观的实验环境，帮助学生理解抽象的系统概念</li>
              <li>通过交互式学习方式，增强学生的学习兴趣和参与度</li>
              <li>实时反馈机制，帮助学生及时了解学习效果</li>
              <li>系统化的知识体系，帮助学生建立完整的计算机系统知识框架</li>
              <li>灵活的学习进度管理，适应不同学生的学习节奏</li>
            </ul>
          </section>
        </div>
      </el-card>
    </div>
  </CommonLayout>
</template>

<script setup lang="ts">
import CommonLayout from '@/components/CommonLayout.vue'
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.about-card {
  margin-top: 20px;
}

.card-header {
  text-align: center;
}

.about-content {
  padding: 20px;
}

.about-section {
  margin-bottom: 30px;
}

.about-section h3 {
  color: #409EFF;
  margin-bottom: 15px;
}

.about-section p {
  line-height: 1.6;
  margin-bottom: 15px;
  text-align: justify;
}

.about-section ul {
  padding-left: 20px;
}

.about-section li {
  line-height: 1.6;
  margin-bottom: 10px;
}
</style> 