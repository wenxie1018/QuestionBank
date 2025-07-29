<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import Q1 from '../assets/imgs/Q_truefalse.png';
import Q2 from '../assets/imgs/Q_option.png';
import Q3 from '../assets/imgs/Q_truefalseoption.png';

const route = useRoute();
const router = useRouter();

const previousPageData = route.query;

// 定義模板數據，使用 v-for 來渲染
const templates = ref([
  { id: 'A', title: '是非題', imgSrc: Q1 },
  { id: 'B', title: '選擇題', imgSrc: Q2 },
  { id: 'C', title: '是非題+選擇題', imgSrc: Q3 },
]);

const selectedTemplate = ref(''); 

// 點擊卡片時觸發的函式
const selectTemplate = (templateId) => {
  selectedTemplate.value = templateId;
};

// 定義 Modal 的顯示狀態
const isModalVisible = ref(false); 

// --- ⭐️ 新增：控制載入動畫的顯示狀態 ---
const isLoading = ref(false);

// 定義 computed 屬性，用來找到完整的模板物件
const fullSelectedTemplate = computed(() => {
  return templates.value.find(t => t.id === selectedTemplate.value);
});

// 提交按鈕邏輯
const handleShowConfirmation = () => {
  // 修正 3 (續)：使用正確的變數名稱 selectedTemplate
  if (!selectedTemplate.value) { 
    alert('請先選擇一個模板！');
    return;
  }
  isModalVisible.value = true;
};

// Modal 中的確認按鈕邏輯
const handleConfirmGeneration = () => {
  // 1. 關閉確認 Modal
  isModalVisible.value = false;
  
  // 2. 顯示載入動畫
  isLoading.value = true;

  // 3. 組合需要提交的數據
  const submissionData = {
    ...previousPageData,
    // 傳遞模板ID，而不是整個物件，讓 URL 更乾淨
    templateId: fullSelectedTemplate.value.id 
  };
  
  // 4. 使用 setTimeout 模擬後端處理時間 (例如 1.5 秒)
  setTimeout(() => {
    // 5. 隱藏載入動畫
    isLoading.value = false;
    
    // 6. 執行頁面跳轉
    router.push({
      name: 'GeneratedExam',
      query: submissionData
    });
  }, 500); // 延遲 1500 毫秒
};

// 取消按鈕
const handleCancel = () => {
  isModalVisible.value = false;
};

</script>

<template>
<div>
  <div class="container mx-auto px-6 py-12 tracking-widest">
    <h1 class="text-4xl font-bold text-center text-dark-gray mb-12">選擇出題模板</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <!-- 使用 v-for 循環渲染所有模板卡片 -->
      <div 
        v-for="template in templates" 
        :key="template.id"
        @click="selectTemplate(template.id)"
        class="bg-white p-6 rounded-xl shadow-subtle flex flex-col items-center cursor-pointer transition-all duration-200 ease-in-out"
        :class="{
          'ring-4 ring-primary ring-offset-2': selectedTemplate === template.id,
          'hover:scale-105 hover:shadow-lg': selectedTemplate !== template.id,
        }"
      >
        <div class="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img :src="template.imgSrc" :alt="template.title" class="w-full h-full object-cover border-2 border-gray-400">
        </div>
        <h2 class="text-xl font-semibold text-dark-gray py-2 ">{{ template.title }}</h2>
      </div>

    </div>

    <!-- Submit 按鈕 -->
    <div class="text-center mt-12">
      <button 
        @click="handleShowConfirmation" 
        class="bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        :class="{
          'opacity-50 cursor-not-allowed': !selectedTemplate
        }"
        :disabled="!selectedTemplate"
      >
        下一步
      </button>
    </div>
  </div>
  <!-- === 確認 Modal (彈出視窗) === -->
  <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mx-4">
      <h3 class="text-2xl font-bold text-dark-gray mb-6 text-center">請確認您的選擇</h3>

      <div class="space-y-3 text-lg border-t border-b py-6 mb-6">
        <!-- 使用 v-if 判斷，有值才顯示 -->
        <p v-if="previousPageData.student"><strong>學籍：</strong> {{ previousPageData.student }}</p>
        <p v-if="previousPageData.grade"><strong>年級：</strong> {{ previousPageData.grade }}</p>
        <p v-if="previousPageData.subject"><strong>科目：</strong> {{ previousPageData.subject }}</p>
        <p v-if="previousPageData.range"><strong>範圍：</strong> {{ previousPageData.range }}</p>
        <p v-if="previousPageData.customText"><strong>自訂內容：</strong> <span class="block mt-1 p-2 bg-gray-100 rounded text-base whitespace-pre-wrap">{{ previousPageData.customText }}</span></p>
        <p v-if="previousPageData.points"><strong>知識點數量：</strong> {{ previousPageData.points.split(',').length }} 個知識點</p>
        <!-- 這是當前頁面選擇的，一定會有值 -->
        <p v-if="fullSelectedTemplate"><strong>選擇模板：</strong> <span class="font-bold text-primary">{{ fullSelectedTemplate.title }}</span></p>
      </div>

      <!-- 按鈕區域 -->
      <div class="flex justify-end gap-4">
        <button @click="handleCancel" class="py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
          取消
        </button>
        <button @click="handleConfirmGeneration" class="py-2 px-6 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors">
          確認生成
        </button>
      </div>
    </div>
  </div>
  <!-- === ⭐️ 新增：載入動畫 Modal (Loading Overlay) === -->
  <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
    <!-- 旋轉的 SVG 圖示 -->
    <svg class="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <!-- 提示文字 -->
    <p class="mt-4 text-xl font-semibold text-dark-gray">正在生成試卷，請稍候...</p>
  </div>
</div>
</template>

<style scoped>
</style>