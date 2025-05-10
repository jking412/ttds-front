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

    <!-- 实验详情对话框 -->
    <el-dialog
      v-model="detailsDialogVisible"
      :title="selectedRecord ? `实验详情: ${selectedRecord.sectionTitle}` : '实验详情'"
      width="650px"
    >
      <div v-if="selectedRecord" class="experiment-details">
        <div class="details-header">
          <el-tag :type="getRecordStatusTag(selectedRecord.status)" class="status-tag">
            {{ getStatusText(selectedRecord.status) }}
          </el-tag>
          <div class="experiment-time">
            <div class="time-item">
              <span class="time-label">开始时间:</span>
              <span class="time-value">{{ formatDate(selectedRecord.startTime) }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">结束时间:</span> 
              <span class="time-value">{{ selectedRecord.endTime ? formatDate(selectedRecord.endTime) : '进行中' }}</span>
            </div>
            <div class="time-item">
              <span class="time-label">总耗时:</span>
              <span class="time-value">{{ calculateDuration(selectedRecord.startTime, selectedRecord.endTime) }}</span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="experiment-info">
          <h3>实验内容</h3>
          <p>{{ selectedRecord.sectionDescription }}</p>
        </div>

        <el-divider />

        <div class="experiment-logs">
          <h3>实验日志</h3>
          <div class="log-container">
            <div v-for="(log, index) in experimentLogs" :key="index" class="log-item" :class="log.type">
              <span class="log-time">[{{ log.time }}]</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="experiment-result">
          <h3>检查结果</h3>
          <div class="result-content" :class="selectedRecord.status">
            <el-icon v-if="selectedRecord.status === 'completed'"><SuccessFilled /></el-icon>
            <el-icon v-else-if="selectedRecord.status === 'failed'"><CircleCloseFilled /></el-icon>
            <el-icon v-else><Loading /></el-icon>
            <span>{{ selectedRecord.checkResult || '暂无结果' }}</span>
          </div>
          <div class="user-output" v-if="selectedRecord.userOutput">
            <h4>输出内容:</h4>
            <pre>{{ selectedRecord.userOutput }}</pre>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailsDialogVisible = false">关闭</el-button>
          <el-button type="success" @click="retryExperiment(selectedRecord)">
            <el-icon><Refresh /></el-icon>重新实验
          </el-button>
        </span>
      </template>
    </el-dialog>
  </CommonLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CommonLayout from '@/components/CommonLayout.vue'
import { Timer, Check, View, Refresh, SuccessFilled, CircleCloseFilled, Loading } from '@element-plus/icons-vue'
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

// 实验详情对话框
const detailsDialogVisible = ref(false)
const selectedRecord = ref<any>(null)

// 模拟实验日志数据
const experimentLogs = ref([
  { time: '10:00:15', message: '开始处理实验提交...', type: 'info' },
  { time: '10:00:45', message: '检查实验环境配置...', type: 'info' },
  { time: '10:01:20', message: '环境配置检查通过', type: 'success' },
  { time: '10:01:55', message: '启动容器服务...', type: 'info' },
  { time: '10:02:30', message: '容器服务启动成功', type: 'success' },
  { time: '10:03:05', message: '运行实验检查脚本...', type: 'info' },
  { time: '10:03:40', message: '检查点1: 进程创建测试...', type: 'info' },
  { time: '10:04:15', message: '检查点1通过', type: 'success' },
  { time: '10:04:50', message: '检查点2: 系统调用测试...', type: 'info' },
  { time: '10:05:25', message: '检查点2通过', type: 'success' },
  { time: '10:06:00', message: '生成实验记录...', type: 'info' },
  { time: '10:06:35', message: '所有检查项通过，实验完成！', type: 'success' }
])

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
  selectedRecord.value = record
  detailsDialogVisible.value = true
  
  // 根据记录状态动态生成日志
  if (record.status === 'failed') {
    // 失败状态的日志
    experimentLogs.value = [
      { time: formatTimeOnly(new Date(record.startTime)), message: '开始处理实验提交...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 1), message: '检查实验环境配置...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 2), message: '环境配置检查通过', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 3), message: '启动容器服务...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 4), message: '容器服务启动成功', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 5), message: '运行实验检查脚本...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 6), message: '检查点1: 进程创建测试...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 7), message: '检查点1通过', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 8), message: '检查点2: 系统调用测试...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 9), message: '检查点2失败: 系统调用返回值异常', type: 'error' },
      { time: addMinutes(new Date(record.startTime), 10), message: '生成实验记录...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 11), message: '实验未通过，请检查系统调用实现', type: 'error' }
    ]
  } else if (record.status === 'in_progress') {
    // 进行中状态的日志
    experimentLogs.value = [
      { time: formatTimeOnly(new Date(record.startTime)), message: '开始处理实验提交...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 1), message: '检查实验环境配置...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 2), message: '环境配置检查通过', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 3), message: '启动容器服务...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 4), message: '容器服务启动成功', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 5), message: '运行实验检查脚本...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 6), message: '检查点1: 进程创建测试...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 7), message: '检查中...', type: 'info' }
    ]
  } else {
    // 完成状态的日志
    experimentLogs.value = [
      { time: formatTimeOnly(new Date(record.startTime)), message: '开始处理实验提交...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 1), message: '检查实验环境配置...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 2), message: '环境配置检查通过', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 3), message: '启动容器服务...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 4), message: '容器服务启动成功', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 5), message: '运行实验检查脚本...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 6), message: '检查点1: 进程创建测试...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 7), message: '检查点1通过', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 8), message: '检查点2: 系统调用测试...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 9), message: '检查点2通过', type: 'success' },
      { time: addMinutes(new Date(record.startTime), 10), message: '生成实验记录...', type: 'info' },
      { time: addMinutes(new Date(record.startTime), 11), message: '所有检查项通过，实验完成！', type: 'success' }
    ]
  }
}

// 格式化时间（只显示时分秒）
const formatTimeOnly = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 添加分钟并返回格式化后的时间
const addMinutes = (date: Date, minutes: number): string => {
  const newDate = new Date(date.getTime() + minutes * 60000)
  return formatTimeOnly(newDate)
}

// 重新进行实验
const retryExperiment = (record: any) => {
  ElMessage.success(`正在重新开始实验: ${record.sectionTitle}`)
  
  // 模拟调用后端接口启动容器
  setTimeout(() => {
    try {
      // 打开实验页面，与ChapterView中相同的URL
      window.open('http://localhost:8000?folder=/root', '_blank')
      
      // 关闭详情对话框（如果打开的话）
      if (detailsDialogVisible.value) {
        detailsDialogVisible.value = false
      }
    } catch (error) {
      console.error('启动实验环境失败:', error)
      ElMessage.error('启动实验环境失败，请稍后再试')
    }
  }, 1000)
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

.experiment-details {
  padding: 10px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.status-tag {
  font-size: 14px;
  padding: 5px 10px;
}

.experiment-time {
  text-align: right;
}

.time-item {
  margin-bottom: 5px;
  font-size: 14px;
}

.time-label {
  font-weight: bold;
  margin-right: 5px;
  color: #606266;
}

.experiment-info h3,
.experiment-logs h3,
.experiment-result h3 {
  font-size: 16px;
  margin-bottom: 10px;
  color: #303133;
}

.log-container {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
}

.log-item {
  margin-bottom: 5px;
  font-size: 13px;
  line-height: 1.5;
}

.log-time {
  color: #909399;
  margin-right: 8px;
}

.log-item.info .log-message {
  color: #409eff;
}

.log-item.success .log-message {
  color: #67c23a;
}

.log-item.error .log-message {
  color: #f56c6c;
}

.result-content {
  display: flex;
  align-items: center;
  font-size: 15px;
  margin: 10px 0;
}

.result-content.completed {
  color: #67c23a;
}

.result-content.failed {
  color: #f56c6c;
}

.result-content.in_progress {
  color: #e6a23c;
}

.result-content .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

.user-output {
  margin-top: 15px;
}

.user-output h4 {
  font-size: 14px;
  margin-bottom: 5px;
  color: #606266;
}

.user-output pre {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 10px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow-y: auto;
}
</style>