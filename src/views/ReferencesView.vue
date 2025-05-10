<template>
  <CommonLayout>
    <div class="references-container">
      <el-card class="references-card">
        <template #header>
          <div class="card-header">
            <h2>课程参考资料</h2>
          </div>
        </template>
        
        <div class="references-content">
          <el-tabs v-model="activeCourse" class="course-tabs">
            <el-tab-pane v-for="course in courses" 
                        :key="course.id" 
                        :label="course.title" 
                        :name="course.id.toString()">
              <div class="references-list">
                <el-card v-for="reference in getCourseReferences(course.id)" 
                        :key="reference.id" 
                        class="reference-card"
                        shadow="hover">
                  <div class="reference-header">
                    <h3 class="reference-title">{{ reference.title }}</h3>
                    <el-tag :type="getReferenceTypeTag(reference.type)">{{ reference.type }}</el-tag>
                  </div>
                  <div class="reference-info">
                    <span class="author">作者: {{ reference.author }}</span>
                    <el-button type="primary" size="small" @click="handleReadReference(reference)">
                      <el-icon><Reading /></el-icon>阅读
                    </el-button>
                  </div>
                </el-card>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </CommonLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CommonLayout from '@/components/CommonLayout.vue'
import { Reading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 模拟课程数据
const courses = ref([
  {
    id: 1,
    title: '操作系统',
    description: '深入学习操作系统原理与实践'
  },
  {
    id: 2,
    title: '计算机网络',
    description: '探索网络协议与网络编程'
  },
  {
    id: 3,
    title: '编译原理',
    description: '学习编程语言的编译过程与实现'
  }
])

// 模拟参考资料数据
const references = ref([
  {
    id: 1,
    courseId: 1,
    title: '操作系统概念',
    author: 'Abraham Silberschatz',
    type: '教材',
    content: '操作系统经典教材，详细介绍了操作系统的核心概念和原理。'
  },
  {
    id: 2,
    courseId: 1,
    title: 'Linux内核设计与实现',
    author: 'Robert Love',
    type: '参考书',
    content: '深入讲解Linux内核的实现原理和设计思想。'
  },
  {
    id: 3,
    courseId: 2,
    title: '计算机网络：自顶向下方法',
    author: 'James F. Kurose',
    type: '教材',
    content: '从应用层到物理层，全面介绍计算机网络的工作原理。'
  },
  {
    id: 4,
    courseId: 2,
    title: 'TCP/IP详解',
    author: '中科大郑烇、杨坚',
    type: '视频',
    content: '深入解析TCP/IP协议栈的实现细节。'
  },
  {
    id: 5,
    courseId: 3,
    title: '编译原理',
    author: 'Alfred V. Aho',
    type: '教材',
    content: '编译原理经典教材，涵盖词法分析、语法分析、语义分析等内容。'
  }
])

// 当前选中的课程
const activeCourse = ref('1')

// 获取指定课程的参考资料
const getCourseReferences = (courseId: number) => {
  return references.value.filter(ref => ref.courseId === courseId)
}

// 获取参考资料类型的标签样式
const getReferenceTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    '教材': 'success',
    '参考书': 'warning',
    '论文': 'info',
    '视频': 'primary'
  }
  return typeMap[type] || 'info'
}

// 处理阅读参考资料
const handleReadReference = (reference: any) => {
  ElMessage.success(`正在打开参考资料: ${reference.title}`)
  
  // 如果是视频类型，直接打开视频链接
  if (reference.type === '视频') {
    if (reference.title === 'TCP/IP详解') {
      window.open('https://www.bilibili.com/video/BV1h7411a788/?spm_id_from=333.337.search-card.all.click', '_blank')
      return
    }
    // 可以在这里添加其他视频的处理逻辑
  }
  
  // 对于其他类型，按原来的逻辑处理
  const fileName = encodeURIComponent(`${reference.title}.pdf`)
  const pdfUrl = `http://localhost:9000/ttds/${fileName}`
  
  // 在新标签页中打开PDF
  window.open(pdfUrl, '_blank')
}
</script>

<style scoped>
.references-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.references-card {
  margin-top: 20px;
}

.card-header {
  text-align: center;
}

.references-content {
  padding: 20px;
}

.course-tabs {
  margin-top: 20px;
}

.references-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.reference-card {
  transition: all 0.3s;
}

.reference-card:hover {
  transform: translateY(-5px);
}

.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.reference-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.reference-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.author {
  color: #666;
  font-size: 0.9rem;
}

:deep(.el-tabs__item) {
  font-size: 1.1rem;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--el-color-primary);
}
</style> 