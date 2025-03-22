import { ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchCourses, transformCourseData } from '@/request'
import type { CourseDisplay } from '@/request/types'

export interface FeatureCard {
  id: number
  title: string
  description: string
  icon: string
  isBlue?: boolean
}

export const useHomeStore = defineStore('home', () => {
  // 导航链接
  const navLinks = ref([
    { id: 1, text: '主页', url: '#', active: true },
    { id: 2, text: '参考资料', url: '#', active: false },
    { id: 3, text: '实验记录', url: '#', active: false },
    { id: 4, text: '关于', url: '#', active: false }
  ])

  // 标题和描述
  const mainHeading = ref('计算机系统实验平台')
  const mainDescription = ref('解决你的环境烦恼，愉快的开始你的计算系统学习之旅')
  
  // 特性卡片
  const featureCards = ref<FeatureCard[]>([
    {
      id: 1,
      title: 'Evaluation Time',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: 'Link',
      isBlue: false
    },
    {
      id: 2,
      title: 'Training Courses',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: 'CreditCard',
      isBlue: false
    },
    {
      id: 3,
      title: 'Sales Planning',
      description: 'The gradual accumulation of information about atomic and small-scale behaviour...',
      icon: 'Check',
      isBlue: true
    }
  ])

  // 课程列表
  const courses = ref<CourseDisplay[]>([])
  
  // 获取课程数据
  const getCourses = async () => {
    try {
      const courseData = await fetchCourses()
      courses.value = courseData.map(course => transformCourseData(course))
    } catch (error) {
      console.error('获取课程数据失败:', error)
      // 设置一些默认数据以防请求失败
      courses.value = [
        {
          id: 1,
          title: '操作系统',
          description: '深入学习操作系统原理与实践...',
          icon: 'Link',
          isHighlighted: false
        },
        {
          id: 2,
          title: '计算机网络',
          description: '探索网络协议与网络编程...',
          icon: 'CreditCard',
          isHighlighted: false
        },
        {
          id: 3,
          title: '编译原理',
          description: '学习编程语言的编译过程与实现...',
          icon: 'Check',
          isHighlighted: true
        }
      ]
    }
  }

  // 品牌名称
  const brandName = ref('Study OS')

  return { 
    navLinks, 
    mainHeading, 
    mainDescription, 
    featureCards,
    courses,
    getCourses,
    brandName
  }
})
