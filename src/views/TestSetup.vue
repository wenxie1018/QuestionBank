<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

// 使用 ref 來建立響應式數據，綁定表單的值
const selectedOptions = ref({
  student: '',
  grade: '',
  subject: '',
  range: '',
});

const textAreaContent = ref('');

// 左側提交按鈕
const handleSubmitLeft = () => {
  if (!selectedOptions.value.student) {
    alert('請先輸入學籍！');
    return;
  }
  if (!selectedOptions.value.grade) {
    alert('請先輸入年級！');
    return;
  }
  if (!selectedOptions.value.subject) {
    alert('請先輸入科目！');
    return;
  }
  if (!selectedOptions.value.range) {
    alert('請先輸入範圍！');
    return;
  }
  router.push({
    name: 'ExamTemplate', // 跳轉到名為 'Results' 的路由
    query: selectedOptions.value, // 將下拉選單的內容作為 Query 參數傳遞
  });
};

// 右側提交按鈕
const handleSubmitRight = () => {
  if (!textAreaContent.value.trim()) {
    alert('請先輸入內容！');
    return;
  }
  router.push({
    name: 'ExamTemplate',
    query: {
      customText: textAreaContent.value
    }
  });
};

</script>

<template>
  <div class="bg-light-gray min-h-screen" style="font-family: 'Inter', sans-serif;">
    <main class="container mx-auto px-6 py-12">
      <h1 class="text-4xl font-bold text-center text-dark-gray mb-12">出卷範圍</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <!-- Left Panel -->
        <div class="bg-white p-8 rounded-xl shadow-subtle flex flex-col">
          <h2 class="text-2xl font-semibold text-dark-gray mb-6">請選擇課程範圍：</h2>
          <div class="space-y-6 flex-grow">
            <!-- Option 0 -->
            <div class="flex items-center justify-between">
              <label class="text-dark-gray text-xl" for="student">學籍</label>
              <div class="relative">
                <select v-model="selectedOptions.student" class="w-48 appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 text-dark-gray leading-tight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="option0">
                  <option value="" disabled>請選擇</option>
                  <option value="國小">國小</option>
                  <option value="國中">國中</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
                </div>
              </div>
            </div>
            <!-- Option 1 -->
            <div class="flex items-center justify-between">
              <label class="text-dark-gray text-xl" for="grade">年級</label>
              <div class="relative">
                <select v-model="selectedOptions.grade" class="w-48 appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 text-dark-gray leading-tight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="option1">
                  <option value="" disabled>請選擇</option>
                  <option value="一年級">一年級</option>
                  <option value="二年級">二年級</option>
                  <option value="三年級">三年級</option>
                  <option value="四年級">四年級</option>
                  <option value="五年級">五年級</option>
                  <option value="六年級">六年級</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
                </div>
              </div>
            </div>
            <!-- Option 2 -->
            <div class="flex items-center justify-between">
              <label class="text-dark-gray text-xl" for="subject">科目</label>
               <div class="relative">
                <select v-model="selectedOptions.subject" class="w-48 appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 text-dark-gray leading-tight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="option2">
                  <option value="" disabled>請選擇</option>
                  <option value="國語">國語</option>
                  <option value="英語">英語</option>
                  <option value="數學">數學</option>
                  <option value="社會">社會</option>
                  <option value="自然">自然</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
                </div>
              </div>
            </div>
             <!-- Option 3 -->
            <div class="flex items-center justify-between">
              <label class="text-dark-gray text-xl" for="range">範圍</label>
               <div class="relative">
                <select v-model="selectedOptions.range" class="w-48 appearance-none bg-white border border-gray-300 rounded-lg py-2 px-4 text-dark-gray leading-tight focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="option3">
                  <option value="" disabled>請選擇</option>
                  <option value="第一課">第一課</option>
                  <option value="第二課">第二課</option>
                  <option value="第三課">第三課</option>
                  <option value="第四課">第四課</option>
                  <option value="第五課">第五課</option>
                  <option value="第六課">第六課</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path></svg>
                </div>
              </div>
            </div>
          </div>
          <button @click="handleSubmitLeft" class="mt-8 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">下一步</button>
        </div>

        <!-- Right Panel -->
        <div class="bg-white p-8 rounded-xl shadow-subtle flex flex-col">
          <h2 class="text-2xl font-semibold text-dark-gray mb-6">請輸入出題範圍：</h2>
          <div class="flex-grow">
            <textarea v-model="textAreaContent" class="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Enter text here..."></textarea>
          </div>
          <button @click="handleSubmitRight" class="mt-8 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">下一步</button>
        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
</style>