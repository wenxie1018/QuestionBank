<!-- src/views/GeneratedExam.vue -->
<script setup>
import { ref, computed, watch} from 'vue';
import QrCode from './QRcode.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 接收從上一頁傳來的設定
const settings = route.query;

const mockExamData = ref([
  { 
    type: 'MultipleChoice', 
    title: '一、太陽系的奧秘', 
    description: '每題5分，共15分', 
    questions: [ 
      {
        answer:'(   )', 
        id: 1, 
        text: '在我們的太陽系中，體積最大的行星是哪一顆？', 
        options: ['地球', '火星', '木星', '土星'] 
      }, 
      { 
        id: 2, 
        text: '哪一顆行星因為擁有非常明顯、美麗的光環而被大家熟知？', 
        options: ['金星', '土星', '海王星', '水星'] 
      },
      { 
        id: 3, 
        text: '地球自轉一圈，會造成什麼我們每天都會經歷的現象？', 
        options: ['四季的變化', '白天和黑夜的交替', '月亮的圓缺', '潮汐的發生'] 
      }
    ] 
  },
  { 
    type: 'MultipleChoice', 
    title: '二、奇妙的植物世界', 
    description: '每題5分，共15分', 
    questions: [ 
      { 
        id: 1, 
        text: '植物進行光合作用，主要是為了製造什麼來讓自己長大？', 
        options: ['水分', '氧氣', '養分（葡萄糖）', '二氧化碳'] 
      }, 
      { 
        id: 2, 
        text: '植物的哪個部分主要負責從土壤中吸收水分和養分？', 
        options: ['莖', '葉', '花', '根'] 
      },
      { 
        id: 3, 
        text: '大多數植物的葉子呈現綠色，是因為葉子裡含有大量的什麼？', 
        options: ['葉黃素', '葉綠素', '花青素', '胡蘿蔔素'] 
      }
    ] 
  },
  { 
    type: 'MultipleChoice', 
    title: '三、物質三態變化', 
    description: '每題5分，共10分', 
    questions: [ 
      { 
        id: 1, 
        text: '水蒸氣遇冷，凝結成小水珠附著在窗戶上，這個過程稱為什麼？', 
        options: ['蒸發', '融化', '結冰', '凝結'] 
      }, 
      { 
        id: 2, 
        text: '放在桌上的冰塊，慢慢變成水，這是屬於哪一種物理現象？', 
        options: ['昇華', '汽化', '融化', '凝固'] 
      } 
    ] 
  },
  { 
    type: 'MultipleChoice', 
    title: '四、人體的消化之旅', 
    description: '每題5分，共10分', 
    questions: [ 
      { 
        id: 1, 
        text: '我們吃下的食物，最主要在哪一個器官進行大部分的消化和吸收？', 
        options: ['胃', '食道', '小腸', '大腸'] 
      }, 
      { 
        id: 2, 
        text: '肝臟會分泌哪一種消化液，來幫助我們分解食物中的脂肪？', 
        options: ['胃液', '膽汁', '胰液', '口水'] 
      }
    ] 
  },
  { 
    type: 'MultipleChoice', 
    title: '五、天氣與生活', 
    description: '每題5分，共10分', 
    questions: [ 
      { 
        id: 1, 
        text: '空氣流動形成了風，我們通常用什麼工具來測量風吹來的方向？', 
        options: ['溫度計', '風向儀', '雨量計', '氣壓計'] 
      }, 
      { 
        id: 2, 
        text: '天上的雲朵，其實是由什麼組成的？', 
        options: ['棉花', '灰塵', '水蒸氣', '許多微小的水滴或冰晶'] 
      } 
    ] 
  }
]);

// --- 用 computed 分割資料到左右兩欄 ---
const columnBlocks = computed(() => {
  const data = mockExamData.value;
  const midpoint = Math.ceil(data.length / 2); // 找到分割點
  const left = data.slice(0, midpoint);  // 前半部分給左欄
  const right = data.slice(midpoint); // 後半部分給右欄
  return { left, right };
});

// --- 建立「學生答案」的儲存庫 ---
// 使用一個物件來儲存答案，key 是唯一的題目ID，value 是選擇的選項索引(0, 1, 2, 3...)
const studentAnswers = ref({});
// 方便答案卡顯示的選項標籤
const optionLabels = ['A', 'B', 'C', 'D'];

// 為了確保每個題目有獨一無二的ID，建立一個輔助函式
const getQuestionUniqueId = (block, question) => `${block.title}-${question.id}`;

// --- 建立統一的作答函式 ---
const selectAnswer = (questionUniqueId, optionIndex) => {
  // 如果再次點擊已選中的答案，則取消選擇
  if (studentAnswers.value[questionUniqueId] === optionIndex) {
    delete studentAnswers.value[questionUniqueId];
  } else {
    // 否則，記錄新的答案
    studentAnswers.value[questionUniqueId] = optionIndex;
  }
};

// 1. 控制側邊欄顯示的狀態
const isAnswerSheetVisible = ref(false);

// 2. 建立模板引用，用來獲取側邊欄和浮動按鈕的 DOM 元素
const examPaperEl = ref(null); 
const answerSheetEl = ref(null);
const fabEl = ref(null);

// 3. 關閉側邊欄的專用函式
const closeAnswerSheet = () => {
  isAnswerSheetVisible.value = false;
};

// 4. 打開側邊欄的專用函式
const openAnswerSheet = () => {
  isAnswerSheetVisible.value = true;
};

// 5. 處理外部點擊的核心函式
const handleClickOutside = (event) => {
  // 定義所有的「安全點擊區域」
  const isClickInsideSheet = answerSheetEl.value && answerSheetEl.value.contains(event.target);
  const isClickOnFab = fabEl.value && fabEl.value.contains(event.target);
  const isClickOnExamPaper = examPaperEl.value && examPaperEl.value.contains(event.target); // 新增的判斷

  // 如果點擊的地方，不是在側邊欄、不是在浮動按鈕、也不是在考卷上，才關閉側邊欄
  if (!isClickInsideSheet && !isClickOnFab && !isClickOnExamPaper) {
    closeAnswerSheet();
  }
};

// 6. 使用 watch 監聽側邊欄狀態，來智慧地掛載和卸載事件監聽器
watch(isAnswerSheetVisible, (newValue) => {
  if (newValue) {
    // 當側邊欄打開時，在 document 上註冊點擊事件
    document.addEventListener('click', handleClickOutside);
  } else {
    // 當側邊欄關閉時，務必移除事件監聽器，避免效能問題
    document.removeEventListener('click', handleClickOutside);
  }
});

// 1. 計算總題數
const totalQuestions = computed(() => {
  // 使用 reduce 將每個大題的題目數量加總起來
  return mockExamData.value.reduce((total, block) => total + block.questions.length, 0);
});

// 2. 計算已答題數
const answeredQuestions = computed(() => {
  // studentAnswers 是一個物件，我們只需要計算它有多少個 key 即可
  return Object.keys(studentAnswers.value).length;
});

// 3. 判斷是否所有題目都已作答
const isAllAnswered = computed(() => {
  return totalQuestions.value > 0 && answeredQuestions.value === totalQuestions.value;
});

const examUniqueId = ref(`exam_${Date.now()}`);
// 3. 控制放大 QR Code Modal 的顯示狀態
const isQrModalVisible = ref(false);
const showQrModal = () => { isQrModalVisible.value = true; };
const hideQrModal = () => { isQrModalVisible.value = false; };

// 批改
// 1. 控制 Modal 和 Loading 的狀態
const isConfirmModalVisible = ref(false);
const isSubmitting = ref(false);

// 2. 提交按鈕點擊時，只負責打開 Modal
const handleSubmitExam = () => {
  /*if (!isAllAnswered.value) {
    alert('還有題目未完成作答，請檢查！');
    return;
  }*/
  isConfirmModalVisible.value = true;
};

// 3. Modal 中的「確認」按鈕的邏輯
const confirmAndSubmit = () => {
  isConfirmModalVisible.value = false;
  isSubmitting.value = true;
  
  const finalSubmission = {
    examSettings: settings,
    answers: studentAnswers.value,
  };
  console.log('準備發送到後端的數據:', JSON.stringify(finalSubmission, null, 2));

  setTimeout(() => {
    isSubmitting.value = false;
    //alert('試卷已批改完成！');
    router.push({ name: 'Dashboard' });
  }, 500);
};

// 4. Modal 中的「取消」按鈕的邏輯
const cancelSubmit = () => {
  isConfirmModalVisible.value = false;
};
</script>

<template>
<div class="relative min-h-screen">
  <!-- 白色背景和邊框 -->
  <div ref="examPaperEl" class="bg-white p-8 md:p-12 max-w-4xl mx-auto my-8 border border-gray-300 shadow-lg font-serif">
    
    <!-- 試卷標頭 -->
    <header class="text-center mb-8">
        <div class="relative">
          <div class="absolute top-[-40px] right-[-40px] cursor-pointer" @click="showQrModal">
            <QrCode :value="examUniqueId" :size="80" />
          </div>
          <h1 class="text-2xl font-bold tracking-widest"><span>{{settings.student}}</span>{{settings.subject}}領域 測驗卷</h1>
        </div>
        <!-- 資訊欄 -->
        <div class="grid grid-cols-3 text-lg mt-4 border-t border-b py-2">
            <div>範圍：{{ settings.range }}</div>
            <div>{{ settings.grade }}年_______班</div>
            <div>姓名：____________</div>
        </div>
    </header>

    <!-- 試卷主體 (左右欄) -->
      <div class="relative grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t-2 border-black pt-4">
        <div class="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-400"></div>
        
        <!-- 左欄 -->
        <div class="space-y-6">
          <div v-for="block in columnBlocks.left" :key="block.title">
            <h2 class="text-xl font-bold mb-2">{{ block.title }}<span class="text-base font-normal">{{ block.description }}</span></h2>
            <ol class="list-none space-y-4 text-lg">
              <li v-for="(question, qIndex) in block.questions" :key="question.id" class="flex items-start">
                <span class="text-xl font-bold mr-2">
                  (
                    <span class="inline-block w-6 text-center text-primary">
                      {{ 
                        studentAnswers[getQuestionUniqueId(block, question)] !== undefined 
                        ? optionLabels[studentAnswers[getQuestionUniqueId(block, question)]] 
                        : '' 
                      }}
                    </span>
                  )
                </span>
                <span class="mr-2">{{ qIndex + 1 }}.</span>
                <div class="flex-1">
                  <p>{{ question.text }}</p>
                  <div class="flex flex-wrap gap-x-4 mt-1">
                    <!-- 讓題目選項可以點擊會亮 -->
                    <span 
                      v-for="(option, optIndex) in question.options" 
                      :key="optIndex"
                      @click="selectAnswer(getQuestionUniqueId(block, question), optIndex)"
                      class="cursor-pointer p-1 transition-colors rounded-md"
                      :class="{ 
                        'bg-yellow-200 ring-2 ring-yellow-400': studentAnswers[getQuestionUniqueId(block, question)] === optIndex 
                      }"
                    >
                      ( {{ optionLabels[optIndex] }} ) {{ option }}
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <!-- 右欄 -->
        <div class="space-y-6">
          <div v-for="block in columnBlocks.right" :key="block.title">
            <h2 class="text-xl font-bold mb-2">{{ block.title }} <span class="text-base font-normal">{{ block.description }}</span></h2>
            <ol class="list-none space-y-4 text-lg">
              <li v-for="(question, qIndex) in block.questions" :key="question.id" class="flex items-start">
                <span class="text-xl font-bold mr-2">
                  (
                    <span class="inline-block w-6 text-center text-primary">
                      {{ 
                        studentAnswers[getQuestionUniqueId(block, question)] !== undefined 
                        ? optionLabels[studentAnswers[getQuestionUniqueId(block, question)]] 
                        : '' 
                      }}
                    </span>
                  )
                </span>
                <span class="mr-2">{{ qIndex + 1 }}</span>
                <div class="flex-1">
                  <p>{{ question.text }}</p>
                  <div class="flex flex-wrap gap-x-4 mt-1">
                    <span 
                      v-for="(option, optIndex) in question.options" 
                      :key="optIndex"
                      @click="selectAnswer(getQuestionUniqueId(block, question), optIndex)"
                      class="cursor-pointer p-1 transition-colors rounded-md"
                      :class="{ 
                        'bg-yellow-200 ring-2 ring-yellow-400': studentAnswers[getQuestionUniqueId(block, question)] === optIndex 
                      }"
                    >
                      ( {{ optionLabels[optIndex] }} ) {{ option }}
                    </span>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- 答案卡側邊欄 -->
    <div 
      ref="answerSheetEl"
      class="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50"
      :class="{ 'translate-x-0': isAnswerSheetVisible, 'translate-x-full': !isAnswerSheetVisible }"
    >
      <div class="p-4 h-full flex flex-col">
        <!-- 側邊欄標頭，包含標題和關閉按鈕 -->
        <div class="flex items-center mb-4 border-b pb-2">
            <div class="w-8">
            </div>
            <h2 class="flex-grow text-2xl font-bold text-center">答案卡</h2>
            <button @click="closeAnswerSheet" class="p-1 rounded-full hover:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>

        <div class="overflow-y-auto flex-grow">
          <div v-for="block in mockExamData" :key="block.title" class="mb-4">
            <h3 class="font-semibold text-gray-700">{{ block.title }}</h3>
            <div v-for="(question, qIndex) in block.questions" :key="question.id" class="flex items-center py-2 border-b">
              <span class="font-bold mr-[5%]">{{ qIndex + 1 }}.</span>
              <div class="flex gap-1">
                <div 
                  v-for="(option, optIndex) in question.options" :key="optIndex"
                  @click="selectAnswer(getQuestionUniqueId(block, question), optIndex)"
                  class="w-8 h-8 flex items-center justify-center border-2 border-gray-400 rounded-full cursor-pointer transition-all"
                  :class="{ 
                    'bg-gray-800 text-white border-gray-800 font-bold': studentAnswers[getQuestionUniqueId(block, question)] === optIndex 
                  }"
                >
                  {{ optionLabels[optIndex] }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 提交按鈕區域 -->
        <div class="mt-4 pt-4 border-t">
        <!-- 進度顯示 -->
        <div class="text-center text-gray-600 mb-2">
            作答進度：{{ answeredQuestions }} / {{ totalQuestions }}
        </div>
        <!-- 提交按鈕 -->
        <button 
            @click="handleSubmitExam"
            class="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
            :class="{
            'bg-primary hover:bg-blue-600 cursor-pointer': isAllAnswered,
            'bg-primary cursor-allowed': !isAllAnswered
            }"
        >
            提交試卷
        </button>
        </div>
      </div>
    </div>
    
    <!-- 浮動按鈕  -->
    <button 
      ref="fabEl"
      @click="openAnswerSheet" 
      class="fixed bottom-8 right-8 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    </button>
    <div v-show="isQrModalVisible" @click="hideQrModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 cursor-pointer">
      <div class="bg-white p-4 rounded-lg">
        <QrCode :value="examUniqueId" :size="300" />
      </div>
    </div>
    <div v-if="isConfirmModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4 text-center">
      <h3 class="text-2xl font-bold text-dark-gray mb-4">提交試卷</h3>
      <p class="text-gray-600 mb-8">您已完成所有題目，共 {{ totalQuestions }} 題。<br>確定要提交試卷進行批改嗎？</p>
      
      <div class="flex justify-center gap-4">
        <button @click="cancelSubmit" class="py-2 px-8 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
          再檢查一下
        </button>
        <button @click="confirmAndSubmit" class="py-2 px-8 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors">
          確認提交
        </button>
      </div>
    </div>
  </div>

  <!-- === ⭐️ 新增：批改中 Loading Modal === -->
  <div v-if="isSubmitting" class="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
    <svg class="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p class="mt-4 text-xl font-semibold text-dark-gray">正在為您批改，請稍候...</p>
  </div>
</div>
</template>

<style scoped>
.font-serif {
  font-family: 'Kaiti', 'STKaiti', 'KaiTi', 'BiauKai', 'DFKai-SB', serif;
}
</style>