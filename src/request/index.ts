import axios from 'axios'
import type { Course, CourseDisplay, Chapter as BackendChapter, ChapterDisplay } from './types'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加认证信息等
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// API 请求函数
export const fetchCourses = (): Promise<Course[]> => {
  return request.get('/courses')
}

// 获取章节数据
export const fetchChapters = (): Promise<BackendChapter[]> => {
  return request.get('/chapters')
}

// 获取特定课程的详细信息
export const fetchCourseDetails = (courseId: number): Promise<Course> => {
  return request.get(`/courses/${courseId}`)
}

// 将后端课程数据转换为前端展示数据
export const transformCourseData = (course: Course): CourseDisplay => {
  return {
    id: course.ID,
    title: course.Title,
    description: course.Description,
    icon: getRandomIcon(),
    isHighlighted: Math.random() > 0.7
  }
}

// 将后端章节数据转换为前端展示数据
export const transformChapterData = (chapter: BackendChapter): ChapterDisplay => {
  return {
    id: chapter.ID,
    title: chapter.Title,
    description: chapter.Description || '',
    sections: chapter.Sections?.map(section => ({
      id: section.ID,
      title: section.Title,
      taskDescription: section.TaskDescription || '',
      containerInfo: section.ContainerInfo || ''
    })) || []
  }
}

// 随机获取一个图标名称
function getRandomIcon(): string {
  const icons = ['Link', 'CreditCard', 'Check']
  return icons[Math.floor(Math.random() * icons.length)]
}

export default request
