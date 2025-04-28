<template>
  <div class="common-container">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="navbar">
        <div class="brand">{{ brandName }}</div>
        <div class="nav-links">
          <el-menu mode="horizontal" :ellipsis="false" class="menu" :default-active="activeIndex">
            <el-menu-item v-for="link in navLinks" :key="link.id" 
                         :index="link.id.toString()" 
                         :class="{ 'is-active': isActive(link) }" 
                         @click="handleNavClick(link)">
              {{ link.text }}
            </el-menu-item>
          </el-menu>
        </div>
        <div class="user-avatar" @click="handleAvatarClick">
          <el-avatar :size="40" :src="'/avatar.jpg'"></el-avatar>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main>
      <slot></slot>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { useHomeStore } from '@/stores/home'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const homeStore = useHomeStore()
const { navLinks, brandName } = storeToRefs(homeStore)

// 计算当前激活的菜单项
const activeIndex = computed(() => {
  const currentPath = route.path
  const activeLink = navLinks.value.find(link => link.path === currentPath)
  return activeLink ? activeLink.id.toString() : '1' // 默认选中第一个
})

// 判断链接是否激活
const isActive = (link: any) => {
  return link.path === route.path
}

// 处理导航点击
const handleNavClick = (link: any) => {
  if (link.path) {
    router.push(link.path)
  }
}

// 处理头像点击
const handleAvatarClick = () => {
  router.push('/profile')
}
</script>

<style scoped>
.common-container {
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
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

/* 主要内容区样式 */
el-main {
  padding: 0 10%;
}

/* 自定义菜单项激活样式 */
:deep(.el-menu-item.is-active) {
  color: var(--el-color-primary) !important;
  border-bottom: 2px solid var(--el-color-primary) !important;
}
</style> 