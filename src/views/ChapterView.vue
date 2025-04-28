<template>
  <div class="chapter-container">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="navbar">
        <div class="brand">{{ brandName }}</div>
        <el-menu
          class="menu nav-links"
          mode="horizontal"
          :ellipsis="false"
        >
          <el-menu-item 
            v-for="link in navLinks" 
            :key="link.text" 
            :index="link.id.toString()"
            @click="handleNavClick(link)"
          >
            {{ link.text }}
          </el-menu-item>
        </el-menu>
        <div class="user-avatar">
          <el-avatar :size="40" src="avatar.jpg" />
        </div>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <div class="main-content">
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>

    <!-- 章节步骤区域 -->
    <div class="chapter-steps-container">
      <div class="chapter-steps">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="3" animated />
        </div>
        
        <div v-else-if="selectedCourse">
          <h2 class="course-title">{{ selectedCourse.Title }}</h2>
          <p class="course-description">{{ selectedCourse.Description }}</p>
          
          <div v-if="selectedCourse.Chapters && selectedCourse.Chapters.length > 0">
            <div v-for="(chapter, index) in selectedCourse.Chapters" :key="chapter.ID" class="chapter-item">
              <div class="chapter-header">
                <div class="step-number">{{ index + 1 }}</div>
                <div class="step-content">
                  <h3 class="step-title">{{ chapter.Title }}</h3>
                  <p v-if="chapter.Description" class="step-description">{{ chapter.Description }}</p>
                </div>
              </div>
              
              <div v-if="chapter.Sections && chapter.Sections.length > 0" class="sections-container">
                <el-collapse>
                  <el-collapse-item class="view-content-collapse" name="1">
                    <template #title>
                      <div class="view-content-button">查看学习内容</div>
                    </template>
                    <div v-for="section in chapter.Sections" :key="section.ID" class="section-item">
                      <div class="section-content">
                        <div class="section-title-row">
                          <div class="section-title">{{ section.Title }}</div>
                          <el-tag v-if="isSectionCompleted(section)" type="success" size="small" class="status-tag">已完成</el-tag>
                          <el-tag v-else type="info" size="small" class="status-tag">未完成</el-tag>
                        </div>
                        <div v-if="section.TaskDescription" class="section-description">
                          {{ section.TaskDescription }}
                        </div>
                      </div>
                      <div class="section-actions">
                        <el-dropdown @command="handleLaunchCommand($event, section)">
                          <el-button type="primary" size="small">
                            <el-icon><VideoPlay /></el-icon>启动环境
                            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                          </el-button>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item command="browser">浏览器访问</el-dropdown-item>
                              <el-dropdown-item command="vscode">VS Code 连接</el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                        <el-button type="success" size="small" @click="submitSection(section)">
                          <el-icon><Check /></el-icon>提交
                        </el-button>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              
              <!-- 垂直连接线，最后一个不显示 -->
              <div v-if="index !== selectedCourse.Chapters.length - 1" class="step-connector"></div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <el-empty description="暂无章节内容" />
          </div>
        </div>
        
        <div v-else class="empty-state">
          <el-empty description="未找到课程" />
        </div>
      </div>
    </div>

    <!-- 添加处理框对话框 -->
    <el-dialog
      v-model="processingDialogVisible"
      title="实验提交处理中"
      :close-on-click-modal="false"
      :show-close="false"
      width="600px"
      class="processing-dialog"
    >
      <div class="processing-content">
        <div class="progress-section">
          <el-progress :percentage="processProgress" :status="processStatus" />
        </div>
        <div class="log-container" ref="logContainer">
          <div v-for="(log, index) in processLogs" :key="index" class="log-item" :class="log.type">
            <span class="log-time">[{{ log.time }}]</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeProcessingDialog" :disabled="!isProcessingComplete">关闭</el-button>
          <el-button type="primary" @click="viewResult" :disabled="!isProcessingComplete || processStatus === 'exception'">
            查看结果
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import { fetchCourses } from '@/request'
import type { Course } from '@/request/types'
import { useRoute, useRouter } from 'vue-router'
import { VideoPlay, Check, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 从路由获取课程ID
const route = useRoute()
const router = useRouter()
const courseId = ref<number | null>(null)

// 从home store获取导航和品牌信息
const homeStore = useHomeStore()
const { navLinks, brandName } = storeToRefs(homeStore)

// 页面标题
const pageTitle = ref('学习路径')

// 课程数据
const courses = ref<Course[]>([])
const loading = ref(true)

// 当前选中的课程
const selectedCourse = computed(() => {
  if (!courseId.value || courses.value.length === 0) return null
  return courses.value.find(course => course.ID === courseId.value) || null
})

// 获取所有课程数据
const getCourses = async () => {
  loading.value = true
  try {
    courses.value = await fetchCourses()
  } catch (error) {
    console.error('获取课程数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 处理导航点击事件
const handleNavClick = (link: { id: number, text: string, url: string, active: boolean }) => {
  // 如果是主页按钮，导航到根路径
  if (link.id === 1 && link.text === '主页') {
    router.push('/')
  }
  // 可以在这里添加其他导航项的处理逻辑
}

// 检查小节是否已完成
const isSectionCompleted = (section: any) => {
  if (!section.UserStatus || section.UserStatus.length === 0) {
    return false
  }
  // 检查用户状态中的Completed字段
  return section.UserStatus.some((status: any) => status.Completed)
}

// 处理启动环境的下拉菜单选择
const handleLaunchCommand = async (command: string, section: any) => {
  try {
    // 先调用后端的startContainer接口
    const response = await fetch('http://localhost:8080/startContainer', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // 检查响应状态
    if (response.status === 200) {
      // 如果成功，根据选择的命令启动相应的环境
      if (command === 'browser') {
        // 浏览器启动
        window.open('http://localhost:8000?folder=/root', '_blank')
      } else if (command === 'vscode') {
        // VS Code 启动
        launchVSCode(section)
      }
    } else {
      // 如果失败，显示警告信息
      ElMessage.warning('环境启动失败，请稍后再试')
    }
  } catch (error) {
    console.error('启动环境请求失败:', error)
    ElMessage.error('环境启动请求失败，请检查网络连接')
  }
}

// 启动 VS Code
const launchVSCode = (section: any) => {
  console.log('启动 VS Code:', section.ContainerInfo)
  
  // 直接连接到远程 VS Code Server
  // 这里的连接信息应该根据实际情况修改
  let vscodeRemoteUrl = "vscode://vscode-remote/ssh-remote+skynesser@127.0.0.1:22/root"

  let iframeConnect = document.createElement("iframe")
  iframeConnect.style.display = "none"
  iframeConnect.src = vscodeRemoteUrl
  document.body.appendChild(iframeConnect)

  // 移除 iframe
  setTimeout(() => {
    document.body.removeChild(iframeConnect)
  }, 3000)
}

// 启动环境 - 不再直接调用，通过handleLaunchCommand统一处理
const launchEnvironment = async (section: any) => {
  console.log('启动环境:', section.ContainerInfo)
  await handleLaunchCommand('browser', section)
}

// 模拟日志数据 - 成功情况
const successLogs = [
  { message: '开始处理实验提交...', type: 'info', delay: 0 },
  { message: '检查实验环境配置...', type: 'info', delay: 1000 },
  { message: '环境配置检查通过', type: 'success', delay: 2000 },
  { message: '启动容器服务...', type: 'info', delay: 3000 },
  { message: '容器服务启动成功', type: 'success', delay: 4500 },
  { message: '运行实验检查脚本...', type: 'info', delay: 5000 },
  { message: '检查点1: 进程创建测试...', type: 'info', delay: 6000 },
  { message: '检查点1通过', type: 'success', delay: 7000 },
  { message: '检查点2: 系统调用测试...', type: 'info', delay: 10000 },
  { message: '检查点2通过', type: 'success', delay: 11000 },
  { message: '生成实验记录...', type: 'info', delay: 12000 },
  { message: '所有检查项通过，实验完成！', type: 'success', delay: 14000 }
]

// 模拟日志数据 - 失败情况
const failureLogs = [
  { message: '开始处理实验提交...', type: 'info', delay: 0 },
  { message: '检查实验环境配置...', type: 'info', delay: 1000 },
  { message: '环境配置检查通过', type: 'success', delay: 2000 },
  { message: '启动容器服务...', type: 'info', delay: 3000 },
  { message: '容器服务启动成功', type: 'success', delay: 4500 },
  { message: '运行实验检查脚本...', type: 'info', delay: 5000 },
  { message: '检查点1: 进程创建测试...', type: 'info', delay: 6000 },
  { message: '检查点1通过', type: 'success', delay: 7000 },
  { message: '检查点2: 系统调用测试...', type: 'info', delay: 10000 },
  { message: '检查点2失败: 系统调用参数错误', type: 'error', delay: 11000 },
  { message: '生成实验记录...', type: 'info', delay: 12000 },
  { message: '实验检查未通过，请修复问题后重试', type: 'error', delay: 14000 }
]

// 模拟处理过程
const simulateProcessing = (isSuccess: boolean) => {
  processProgress.value = 0
  processStatus.value = 'active'
  processLogs.value = []
  isProcessingComplete.value = false

  const logs = isSuccess ? successLogs : failureLogs
  const totalSteps = logs.length
  let currentStep = 0

  logs.forEach((log, index) => {
    setTimeout(() => {
      processLogs.value.push({
        time: formatTime(),
        message: log.message,
        type: log.type
      })
      
      currentStep++
      processProgress.value = Math.floor((currentStep / totalSteps) * 100)
      
      if (currentStep === totalSteps) {
        processStatus.value = isSuccess ? 'success' : 'exception'
        isProcessingComplete.value = true
      }
      
      scrollToBottom()
    }, log.delay)
  })
}

// 提交小节
const submitSection = async (section: any) => {
  console.log('提交小节:', section.ID)
  
  // 根据小节ID的奇偶性决定是否成功
  const isSuccess = section.ID % 2 === 1
  
  // 显示处理框并开始模拟处理
  processingDialogVisible.value = true
  simulateProcessing(isSuccess)
  
  try {
    // 发送GET请求到后端的/check接口，带上section_id参数
    const response = await fetch(`http://localhost:8080/check?section_id=${section.ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // 等待模拟处理完成
    await new Promise(resolve => setTimeout(resolve, 15000))
    
    // 根据奇偶性模拟不同的结果
    if (isSuccess) {
      ElMessage.success('实验检查通过！')
      await getCourses() // 更新课程数据
    } else {
      ElMessage.error('实验检查未通过，请检查后重试')
    }
    
  } catch (error) {
    console.error('提交请求失败:', error)
    ElMessage.error('提交请求失败，请检查网络连接')
    processStatus.value = 'exception'
    processLogs.value.push({
      time: formatTime(),
      message: '网络请求失败，请检查网络连接',
      type: 'error'
    })
  }
}

// 处理框相关状态
const processingDialogVisible = ref(false)
const processProgress = ref(0)
const processStatus = ref('')
const processLogs = ref<Array<{time: string, message: string, type: string}>>([])
const isProcessingComplete = ref(false)
const logContainer = ref<HTMLElement | null>(null)

// 格式化时间
const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 滚动到日志底部
const scrollToBottom = async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

// 查看结果
const viewResult = () => {
  // 这里可以添加查看结果的逻辑
  processingDialogVisible.value = false
}

// 关闭处理框
const closeProcessingDialog = () => {
  if (isProcessingComplete.value) {
    processingDialogVisible.value = false
  }
}

const breadcrumbs = computed(() => [
  { id: 1, text: '首页', url: '/', active: false },
  { id: 2, text: '章节', url: '/chapter', active: true }
])

// 提交实验
const handleSubmit = async () => {
  startProcessing()
  // 这里可以添加实际的提交逻辑
}

onMounted(() => {
  // 从URL查询参数获取课程ID
  const id = route.query.courseId
  if (id) {
    courseId.value = Number(id)
  }
  // 获取所有课程数据
  getCourses()
})
</script>

<style scoped>
.chapter-container {
  position: relative;
  background: linear-gradient(135deg, #FFE4D6 70%, #ffffff 70%);
  min-height: 100vh;
  width: 100%;
  font-family: var(--el-font-family);
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

/* 主要内容区样式 */
.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

.page-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
}

/* 章节步骤区域样式 */
.chapter-steps-container {
  padding: 0 10%;
  margin-top: 20px;
}

.chapter-steps {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #333;
}

.course-description {
  color: #666;
  margin-bottom: 30px;
}

.chapter-item {
  position: relative;
  padding-left: 30px;
  margin-bottom: 30px;
}

.chapter-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.step-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: var(--el-color-primary);
  color: white;
  border-radius: 50%;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

.step-content {
  margin-left: 15px;
  flex: 1;
}

.step-title {
  font-size: 1.3rem;
  margin-bottom: 5px;
  color: #333;
}

.step-description {
  color: #666;
  font-size: 0.9rem;
}

.sections-container {
  margin-left: 15px;
  margin-top: 15px;
}

.section-item {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-content {
  flex: 1;
}

.section-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.section-title {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.status-tag {
  margin-left: 8px;
}

.section-description {
  color: #666;
  font-size: 0.9rem;
}

.section-actions {
  display: flex;
  gap: 10px;
}

.view-content-button {
  color: var(--el-color-primary);
  font-weight: bold;
}

.step-connector {
  position: absolute;
  left: 15px;
  top: 30px;
  bottom: -15px;
  width: 2px;
  background-color: #e0e0e0;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.processing-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.processing-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-section {
  padding: 0 20px;
}

.log-container {
  height: 300px;
  overflow-y: auto;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
}

.log-item {
  margin-bottom: 8px;
  color: #fff;
  display: flex;
  gap: 8px;
}

.log-time {
  color: #888;
  white-space: nowrap;
}

.log-message {
  flex: 1;
  word-break: break-all;
}

.log-item.info .log-message {
  color: #fff;
}

.log-item.success .log-message {
  color: #67c23a;
}

.log-item.warning .log-message {
  color: #e6a23c;
}

.log-item.error .log-message {
  color: #f56c6c;
}

/* 自定义滚动条样式 */
.log-container::-webkit-scrollbar {
  width: 6px;
}

.log-container::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 3px;
}

.log-container::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
}

.log-container::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
}
</style>
