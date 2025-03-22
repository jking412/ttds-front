// 基础时间字段接口
interface BaseTimeFields {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
}

// 章节部分接口
export interface Section extends BaseTimeFields {
  ChapterID: number
  Title: string
  TaskDescription: string
  ContainerInfo: string
  UserStatus: any[]
}

// 章节接口
export interface Chapter extends BaseTimeFields {
  CourseID: number
  Title: string
  Description?: string
  Sections: Section[]
}

// 参考书籍接口
export interface ReferenceBook extends BaseTimeFields {
  CourseID: number
  Title: string
  Author: string
  Publisher: string
  PublishYear: number
  ISBN: string
}

// 课程接口
export interface Course extends BaseTimeFields {
  Title: string
  Description: string
  Chapters: Chapter[]
  ReferenceBooks: ReferenceBook[]
  Icon?: string
  IsHighlighted?: boolean
}

// 前端展示用的课程接口
export interface CourseDisplay {
  id: number
  title: string
  description: string
  icon: string
  isHighlighted: boolean
}

// 前端展示用的章节部分接口
export interface SectionDisplay {
  id: number
  title: string
  taskDescription: string
  containerInfo: string
}

// 前端展示用的章节接口
export interface ChapterDisplay {
  id: number
  title: string
  description: string
  sections: SectionDisplay[]
  image?: string
  imageTitle?: string
}
