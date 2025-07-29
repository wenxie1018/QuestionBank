<script setup>
import Logo from './assets/imgs/logo.png';

</script>

<template>
  <!-- 這是所有頁面共用的最外層容器，負責背景和字體 -->
  <div class="bg-light-gray min-h-screen" style="font-family: 'Inter', sans-serif;">
    
    <!-- 這是所有頁面共用的頁首 -->
    <header class="bg-white w-full border-b border-gray-200">
      <div class="container mx-auto px-6 py-6 flex justify-between items-center">
        <div class="">
          <!-- 使用 router-link 讓 Logo 和公司名稱可以點擊返回首頁 -->
          <router-link to="/">
            <img 
              :src="Logo" 
              alt="康軒智慧評測系統 Logo" 
              class="h-10 w-auto"
            >
          </router-link>
        </div>
      </div>
    </header>

    <!-- 頁面主要內容區域，會根據路由變化 -->
    <!-- router-view 會在這裡渲染 FormPage.vue 或 ResultsPage.vue -->
    <main class="container mx-auto">
      <router-view/>
    </main>
    
  </div>
</template>

<style>
/* 全局樣式，例如 body 字體，可以放在這裡或 main.css */
body {
  font-family: "Inter", "Helvetica Neue", "Helvetica", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", "Arial", sans-serif;
}
</style>