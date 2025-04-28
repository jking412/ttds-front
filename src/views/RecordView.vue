<template>
  <CommonLayout>
    <div class="record-container">
      <el-card class="record-card">
        <template #header>
          <div class="card-header">
            <h2>实验记录</h2>
          </div>
        </template>
        
        <div class="record-content">
          <el-tabs v-model="activeCourse" class="course-tabs">
            <el-tab-pane v-for="course in courses" 
                        :key="course.id" 
                        :label="course.title" 
                        :name="course.id.toString()">
              <div class="record-list">
                <el-timeline>
                  <el-timeline-item
                    v-for="record in getCourseRecords(course.id)"
                    :key="record.id"
                    :type="getRecordStatusType(record.status)"
                    :timestamp="formatDate(record.startTime)"
                    placement="top"
                  >
                    <el-card class="record-item">
                      <div class="record-header">
                        <h3 class="record-title">{{ record.sectionTitle }}</h3>
                        <el-tag :type="getRecordStatusTag(record.status)">
                          {{ getStatusText(record.status) }}
                        </el-tag>
                      </div>
                      <div class="record-info">
                        <p class="record-description">{{ record.sectionDescription }}</p>
                        <div class="record-details">
                          <span class="time-info">
                            <el-icon><Timer /></el-icon>
                            耗时: {{ calculateDuration(record.startTime, record.endTime) }}
                          </span>
                          <span class="check-result" v-if="record.checkResult">
                            <el-icon><Check /></el-icon>
                            检查结果: {{ record.checkResult }}
                          </span>
                        </div>
                      </div>
                      <div class="record-actions">
                        <el-button type="primary" size="small" @click="viewDetails(record)">
                          <el-icon><View /></el-icon>查看详情
                        </el-button>
                        <el-button type="success" size="small" @click="retryExperiment(record)">
                          <el-icon><Refresh /></el-icon>重新实验
                        </el-button>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
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
import { Timer, Check, View, Refresh } from '@element-plus/icons-vue'
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

// 模拟实验记录数据
const records = ref([
  {
    id: 1,
    courseId: 1,
    sectionId: 1,
    sectionTitle: '进程管理实验',
    sectionDescription: '学习进程的创建、调度和通信机制',
    startTime: '2024-03-20T10:00:00Z',
    endTime: '2024-03-20T11:30:00Z',
    status: 'completed',
    checkResult: '通过',
    userOutput: '实验完成，所有测试用例通过'
  },
  {
    id: 2,
    courseId: 1,
    sectionId: 2,
    sectionTitle: '内存管理实验',
    sectionDescription: '实现基本的内存分配和回收机制',
    startTime: '2024-03-21T14:00:00Z',
    endTime: '2024-03-21T15:45:00Z',
    status: 'completed',
    checkResult: '通过',
    userOutput: '成功实现了内存分配算法'
  },
  {
    id: 3,
    courseId: 2,
    sectionId: 3,
    sectionTitle: 'TCP协议实验',
    sectionDescription: '实现基本的TCP连接建立和断开过程',
    startTime: '2024-03-22T09:00:00Z',
    endTime: '2024-03-22T10:30:00Z',
    status: 'failed',
    checkResult: '未通过',
    userOutput: '连接建立过程存在问题'
  },
  {
    id: 4,
    courseId: 2,
    sectionId: 4,
    sectionTitle: 'HTTP服务器实验',
    sectionDescription: '实现一个简单的HTTP服务器',
    startTime: '2024-03-23T13:00:00Z',
    endTime: '2024-03-23T14:20:00Z',
    status: 'completed',
    checkResult: '通过',
    userOutput: '服务器功能完整，性能良好'
  },
  {
    id: 5,
    courseId: 3,
    sectionId: 5,
    sectionTitle: '词法分析器实验',
    sectionDescription: '实现一个简单的词法分析器',
    startTime: '2024-03-24T10:00:00Z',
    endTime: '2024-03-24T11:15:00Z',
    status: 'in_progress',
    checkResult: null,
    userOutput: '正在实现中...'
  }
])

// 当前选中的课程
const activeCourse = ref('1')

// 获取指定课程的实验记录
const getCourseRecords = (courseId: number) => {
  return records.value.filter(record => record.courseId === courseId)
}

// 获取记录状态对应的标签类型
const getRecordStatusTag = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': 'success',
    'failed': 'danger',
    'in_progress': 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取记录状态对应的时间线类型
const getRecordStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': 'success',
    'failed': 'danger',
    'in_progress': 'warning'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': '已完成',
    'failed': '失败',
    'in_progress': '进行中'
  }
  return statusMap[status] || '未知'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 计算实验耗时
const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime)
  const end = new Date(endTime)
  const duration = end.getTime() - start.getTime()
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}小时${minutes}分钟`
}

// 查看实验详情
const viewDetails = (record: any) => {
  ElMessage.success(`正在查看实验记录: ${record.sectionTitle}`)
  // TODO: 实现查看详情的具体逻辑
}

// 重新进行实验
const retryExperiment = (record: any) => {
  ElMessage.success(`正在重新开始实验: ${record.sectionTitle}`)
  // TODO: 实现重新实验的具体逻辑
}
</script>

<style scoped>
.record-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.record-card {
  margin-top: 20px;
}

.card-header {
  text-align: center;
}

.record-content {
  padding: 20px;
}

.course-tabs {
  margin-top: 20px;
}

.record-list {
  margin-top: 20px;
  padding: 0 20px;
}

.record-item {
  margin-bottom: 20px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.record-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.record-info {
  margin: 15px 0;
}

.record-description {
  color: #666;
  margin-bottom: 10px;
}

.record-details {
  display: flex;
  gap: 20px;
  color: #666;
  font-size: 0.9rem;
}

.time-info, .check-result {
  display: flex;
  align-items: center;
  gap: 5px;
}

.record-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

:deep(.el-timeline-item__node) {
  background-color: var(--el-color-primary);
}

:deep(.el-timeline-item__tail) {
  border-left: 2px solid var(--el-color-primary);
}

:deep(.el-tabs__item) {
  font-size: 1.1rem;
}

:deep(.el-tabs__active-bar) {
  background-color: var(--el-color-primary);
}
</style> 