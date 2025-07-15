<!-- src/App.vue (修正後) -->
<script setup>
</script>

<template>
  <!-- 這是所有頁面共用的最外層容器，負責背景和字體 -->
  <div class="bg-light-gray min-h-screen" style="font-family: 'Inter', sans-serif;">
    
    <!-- 這是所有頁面共用的頁首 -->
    <header class="bg-white w-full border-b border-gray-200">
      <div class="container mx-auto px-6 py-6 flex justify-between items-center">
        <!-- 左欄 -->
        <div class="w-1/3">
          <div class="flex items-center space-x-3">
            <span class="material-icons text-primary text-3xl">hexagon</span>
            <span class="text-xl font-semibold text-dark-gray">康軒文教事業</span>
          </div>
        </div>
        <div class="w-1/3"></div>
        <div class="w-1/3 text-right">
          <router-link to="/" class="text-2xl font-bold text-dark-gray tracking-widest">
            智能題庫
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