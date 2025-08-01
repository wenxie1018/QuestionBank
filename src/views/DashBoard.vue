<!-- src/views/Dashboard.vue (繁體中文版) -->
<script setup>
import { ref, computed, watch  } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useRouter } from 'vue-router';
import {curriculumData as rawCurriculumData} from '../data/science.js';
import {studentList as student} from '../data/student.js';

import imgLifePhenomenon from '../assets/imgs/生命現象.JPG';
import imgCell from '../assets/imgs/細胞.JPG';
import imgSubstances from '../assets/imgs/細胞所需的物質.JPG';
import imgCellToIndividual from '../assets/imgs/從細胞到個體.JPG';

//導入數據
const curriculumData = ref(rawCurriculumData);
const studentList = ref(student);

// --- 模擬數據區 (圖表設定中的文字也一併中文化) ---
const router = useRouter();
// 頂部總覽數據
const summaryStats = ref({
  classMood: '😊', 
  avgCompletion: '85%',
  avgScore: '88分',
  totalProblems: 1250,
});

// 學習領域雷達圖數據
const radarChart = ref({
  series: [
  {
    name: '知識點平均',
    data: [75, 88, 80, 75, 70],
  }],
  options: {
    chart: { 
      toolbar: { show: false },
      height: 300,
    },
    xaxis: { 
      categories: [
        '擴散作用與滲透作用', '生命現象', '細胞學說', '動物組成層次', '解剖顯微鏡'
      ],
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false // 同時也關閉 Y 軸刻度，讓圖表最大化
    },
    colors: ['#4A90E2', '#A0AEC0'],
    stroke: { width: 2 },
    fill: { opacity: 0.1 },
    markers: { size: 4 },
    legend: { fontFamily: 'inherit' }, // 繼承父層字體
  },
});

const customLabelPositions = computed(() => {
  // 這些百分比是針對五邊形雷達圖精心微調的，您可以根據需要調整
  return [
    { top: '2%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },       // Top
    { top: '38%', right: '-5%', textAlign: 'left' },     // Top-Right
    { bottom: '5%', right: '10%', textAlign: 'right' },    // Bottom-Right
    { bottom: '5%', left: '10%', textAlign: 'left' },     // Bottom-Left
    { top: '38%', left: '-5%', textAlign: 'right' },      // Top-Left
  ];
});

const topErrorsChart = ref({
  series: [{
    name: '答錯率',
    data: [85, 76, 68, 55, 42] // 答錯率 %
  }],
  options: {
    chart: { type: 'bar', height: 280, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true, // 設置為水平
        borderRadius: 4,
        barHeight: '50%',
      }
    },
    xaxis: {
      categories: ['擴散作用與滲透作用', '生命現象', '細胞學說', '動物組成層次', '解剖顯微鏡'],
      labels: {
        formatter: (val) => `${val}%` // X軸加上百分比符號
      }
    },
    colors: ['#bc6c25'], // 使用紅色系強調錯誤
    tooltip: {
      y: {
        formatter: (val) => `${val}% 的學生答錯`
      }
    },
    dataLabels: { enabled: true, formatter: (val) => `${val}%`, style: { colors: ['#fff'] } },
  },
});

// 學習情緒分析圓餅圖數據
const donutChart = ref({
  series: [50, 25, 10, 5, 10],
  options: {
    chart: { type: 'donut', height: 250 },
    labels: ['池水中的小生物', '植物組成層次', '複式顯微鏡', '人類的細胞型態與功能', '組成細胞的物質'],
    colors: ['#4A90E2', '#81C784', '#FFD54F', '#FF8A65'],
    legend: { position: 'bottom', fontFamily: 'inherit' },
    dataLabels: { enabled: false },
  },
});

// 本週平均成績環狀進度條數據
const radialBarChart = ref({
  series: [80],
  options: {
    chart: { type: 'radialBar', height: 250 },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: '70%' },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: '30px',
            show: true,
            formatter: (val) => `${val} 分`,
          },
        },
      },
    },
    fill: { colors: ['#4A90E2'] },
    stroke: { lineCap: 'round' },
    labels: ['平均成績'],
  },
});

// 2. 將扁平數據轉換為更深層的巢狀結構：單元 -> 課名 -> 教學重點
const knowledgeTree = computed(() => {
  return curriculumData.value.map(item => ({
    id: `${item.單元代碼}-${item.節次代碼}`,
    unit: item.單元代碼,
    name: item.課名,
    points: item.教學重點,
  }));
});

const materialImageMap = {
  '生命現象': imgLifePhenomenon,
  '細胞': imgCell,
  '細胞所需的物質': imgSubstances,
  '從細胞到個體': imgCellToIndividual,
};

// 3. 狀態管理 (更新)
const isGeneratorModalVisible = ref(false);
const selectedChapters = ref(new Set());     // ⭐️ 修改：現在勾選的是「課名」
const customPrompt = ref('');
const isGenerating = ref(false);
const generatedContent = ref([]);
const currentPage = ref(1);
const isPanelCollapsed = ref(false);
const expandedChapters = ref(new Set());      // ⭐️ 新增：控制單元的展開/收合
const leftpanel = ref(false);

// 4. 勾選邏輯 (修改為勾選課名)
const toggleChapterSelection = (chapterName) => {
  if (selectedChapters.value.has(chapterName)) {
    selectedChapters.value.delete(chapterName);
  } else {
    selectedChapters.value.add(chapterName);
  }
};

// 5. 展開/收合單元邏輯
const toggleChapterExpansion = (chapterId) => {
  if (expandedChapters.value.has(chapterId)) {
    expandedChapters.value.delete(chapterId);
  } else {
    expandedChapters.value.add(chapterId);
  }
};

// 6. 生成教材的函式 (更新)
const generateMaterial = () => {
  if (selectedChapters.value.size === 0 && !customPrompt.value.trim()) {
    alert('請至少選擇一個課名或輸入生成指令！');
    return;
  }
  
  leftpanel.value = false;
  isPanelCollapsed.value = true;
  isGenerating.value = true;
  generatedContent.value = [];

  setTimeout(() => {
    // a. 從勾選的課名中，去對照表查找對應的圖片
    const newContent = Array.from(selectedChapters.value).map(chapterName => {
      const imageSrc = materialImageMap[chapterName];
      return {
        title: chapterName,
        // b. 如果找到圖片，就存入 imgSrc；如果沒找到，就生成預設文字
        imgSrc: imageSrc,
        text: imageSrc ? null : `這是一段關於「${chapterName}」的詳細教學內容。這裡會包含定義、範例、圖表以及相關練習題，幫助學生深入理解這個概念。`,
      };
    });
    
    // ... customPrompt 邏輯保持不變 ...
    if (customPrompt.value.trim()) {
      newContent.push({
        title: `根據指令「${customPrompt.value}」生成的內容`,
        text: `這是一段特別根據您的指令客製化的教學內容，整合了多個知識點的核心概念。`,
        imgSrc: null,
      });
    }

    generatedContent.value = newContent;
    currentPage.value = 1;
    isGenerating.value = false;
  }, 1500);
};

const openGeneratorModal = () => {
  // 重置所有狀態
  selectedChapters.value.clear();
  customPrompt.value = '';
  isGenerating.value = false;
  generatedContent.value = [];
  currentPage.value = 1;
  isPanelCollapsed.value = false;
  isGeneratorModalVisible.value = true;
  leftpanel.value = true;
};
const closeGeneratorModal = () => isGeneratorModalVisible.value = false;


// 7. 分頁邏輯
const totalPages = computed(() => generatedContent.value.length);
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

// 9. ⭐️ 新增：重新開啟左側面板的函式
const reopenPanel = () => {
  isPanelCollapsed.value = false;
  leftpanel.value = true;
};

// 2. 使用者的篩選器選擇
const filters = ref({
  level: '',
  subject: '',
});

// 7. 簡化 watch 監聽器
watch(() => filters.value.level, (newLevel, oldLevel) => {
  if (newLevel !== oldLevel) {
    // 當學制改變時，只重置科目
    filters.value.subject = '';
  }
});
</script>

<template>
  <div class="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6 tracking-wider" style="font-family: 'Inter', 'Noto Sans TC', sans-serif;">
    <!-- ⭐️ 1. 頂部總覽區 (修改為教師視角) -->
    <div class="lg:col-span-4 bg-white p-6 rounded-xl shadow-subtle flex items-center justify-around flex-wrap gap-4">
      <div class="flex items-center gap-4">
        <img src="https://api.dicebear.com/8.x/lorelei/svg?seed=teacher-wang" alt="教師頭像" class="w-16 h-16 rounded-full">
        <div>
          <p class="text-xl font-bold text-dark-gray">卡老師</p>
          <p class="text-gray-500">四年甲班</p>
        </div>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-sm">班級心情</p>
        <p class="text-4xl">{{ summaryStats.classMood }}</p>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-sm">學習完成率</p>
        <p class="text-2xl font-bold text-dark-gray">{{ summaryStats.avgCompletion }}</p>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-sm">平均分數</p>
        <p class="text-2xl font-bold text-dark-gray">{{ summaryStats.avgScore }}</p>
      </div>
      <div class="text-center">
        <p class="text-gray-500 text-sm">總出題數</p>
        <p class="text-2xl font-bold text-dark-gray">{{ summaryStats.totalProblems }}</p>
      </div>
      <button @click="openGeneratorModal" class="bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-500 transition-colors tracking-widest text-xl">
        教材生成
      </button>
    </div>

    <!-- 綜合評語 & 學習領域 (雷達圖) -->
    <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-subtle">
      <h2 class="text-2xl font-bold text-dark-gray mb-6">綜合評語與學習領域</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
              <h3 class="font-semibold text-lg mb-2">綜合評語</h3>
              <p class="text-gray-600 text-base mb-4">班級成績優秀，對新概念的理解能力高。目前五大領域的學習進度均衡，請繼續教授新知識。</p>
              <div class="border-dashed border-2 border-gray-300 rounded-lg p-4 h-36 text-center text-gray-500 flex items-center justify-center">
                  <span class="material-icons mr-2">add_comment</span>
                  <span class="text-base">老師評語區</span>
              </div>
          </div>
          <div>
              <h3 class="font-semibold text-lg mb-2 text-center md:text-left">領域學習平均</h3>
              <div class="relative w-full h-[300px]">
                <!-- 圖表本身，佔滿整個容器 -->
                <div class="absolute inset-0">
                  <VueApexCharts type="radar" height="100%" width="100%" :options="radarChart.options" :series="radarChart.series"></VueApexCharts>
                </div>

                <!-- 渲染自訂標籤 -->
                <div 
                  v-for="(label, index) in radarChart.options.xaxis.categories" 
                  :key="label"
                  class="absolute text-gray-600 font-semibold max-w-[90px] leading-tight text-xs p-0"
                  :style="{ ...customLabelPositions[index] }"
                >
                  {{ label }}
                </div>
              </div>
          </div>
      </div>
    </div>

    <!-- 本週易錯題分析  -->
    <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-subtle">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-dark-gray">本週易錯題分析 (全班 Top 5)</h2>
      </div>
      <VueApexCharts type="bar" height="280" :options="topErrorsChart.options" :series="topErrorsChart.series"></VueApexCharts>
    </div>

    <!-- 本週平均成績 (環狀進度條) -->
    <div class="bg-white p-6 rounded-xl shadow-subtle text-center">
      <h2 class="text-xl font-bold text-dark-gray mb-4">本週平均成績</h2>
      <p class="text-gray-500 text-sm mb-2">表現優異，繼續保持！</p>
      <VueApexCharts type="radialBar" height="230" :options="radialBarChart.options" :series="radialBarChart.series"></VueApexCharts>
    </div>

    <!-- 學習情緒分析 (圓餅圖) -->
    <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-subtle">
      <h2 class="text-xl font-bold text-dark-gray mb-4">本週學習領域</h2>
      <VueApexCharts type="donut" height="280" :options="donutChart.options" :series="donutChart.series"></VueApexCharts>
    </div>

    <!-- 弱點概念卡片 -->
    <div class="bg-white p-6 rounded-xl shadow-subtle">
      <h2 class="text-xl font-bold text-dark-gray mb-4">待加強概念</h2>
      <div class="space-y-4">
        <div class="bg-primary bg-opacity-10 p-4 rounded-lg text-primary font-bold hover:bg-opacity-20 transition cursor-pointer">擴散作用與滲透作用</div>
        <div class="bg-purple-100 p-4 rounded-lg text-purple-800 font-bold hover:bg-purple-200 transition cursor-pointer">生命現象</div>
        <div class="bg-green-100 p-4 rounded-lg text-green-800 font-bold hover:bg-green-200 transition cursor-pointer">細胞學說</div>
      </div>
    </div>
    <!-- === 班級學生名單卡片 === -->
    <div class="lg:col-span-4 bg-white p-6 rounded-xl shadow-subtle">
      <h2 class="text-2xl font-bold text-dark-gray mb-4">班級學生名單</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        
        <!-- 使用 v-for 循環渲染學生列表 -->
        <div v-for="student in studentList" :key="student.id" class="text-center">
          <!-- 
            使用 <router-link> 實現點擊跳轉
            :to 屬性動態綁定了學生的個人儀表板路徑
            例如，第一個學生會跳轉到 /student/S001
          -->
          <router-link :to="`/student/${student.id}`" class="group flex flex-col items-center">
            <img 
              :src="`https://api.dicebear.com/8.x/micah/svg?seed=${student.avatarSeed}`" 
              alt="學生頭像" 
              class="w-20 h-20 rounded-full bg-gray-200 mb-2 border-2 border-transparent group-hover:border-primary transition-all duration-200"
            >
            <span class="font-semibold text-dark-gray group-hover:text-primary transition-colors">
              {{ student.name }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <div v-if="isGeneratorModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <!-- ⭐️ 修改：外層容器現在是相對定位，方便面板疊加 -->
    <div class="bg-gray-100 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex overflow-hidden relative">
       <!-- ⭐️ 左側面板 (樣式與結構重構) ⭐️ -->
      <div
        v-if="leftpanel"
        class="bg-white h-full flex flex-col transition-transform duration-500 ease-in-out flex-shrink-0 absolute lg:relative z-20"
        
      >
        <div class="p-6 border-b flex-shrink-0">
          <h3 class="text-3xl font-bold text-dark-gray">選擇教材範圍</h3>
        </div>
        <!-- 可滾動的知識樹 -->
        <div class="flex-grow p-4 overflow-y-auto">
          <h2 class="font-bold text-2xl text-gray-700">生命的特性</h2>
          <!-- ⭐️ 1. 簡化知識樹結構 ⭐️ -->
          <div v-for="chapter in knowledgeTree" :key="chapter.id" class="relative pl-7">
            <!-- 階層線條 -->
            <div class="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>      
            <!-- 課名標題 (可展開/收合/勾選) -->
            <div class="flex items-center justify-between relative">
              <!-- 階層線條的橫線 -->
              <div class="absolute -left-4 top-1/2 w-4 h-px bg-gray-200"></div>
              <div class="flex items-center gap-2 flex-grow cursor-pointer text-xl" @click="toggleChapterExpansion(chapter.id)">
                <span class="material-icons transition-transform text-gray-500" :class="{'rotate-90': expandedChapters.has(chapter.id)}">chevron_right</span>
                <span class="font-semibold text-gray-800">{{ chapter.name }}</span>
              </div>
              <div 
                 @click="toggleChapterSelection(chapter.name)" 
                class="w-5 h-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all cursor-pointer" 
                :class="selectedChapters.has(chapter.name) ? 'bg-primary border-primary' : 'border-gray-400'"
              >
                  <svg v-if="selectedChapters.has(chapter.name)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>

            <!-- 教學重點列表 (展開後顯示) -->
            <div v-if="expandedChapters.has(chapter.id)" class="pl-7 mt-2 space-y-2 text-base text-gray-600">
              <p v-for="point in chapter.points" :key="point" class="relative">
                <span class="absolute -left-5 top-2.5 w-1 h-1 bg-gray-300 rounded-full"></span>
                {{ point }}
              </p>
            </div>
          </div>
        </div>
        <!-- ⭐️ 2. 優化輸入框和按鈕樣式 ⭐️ -->
        <div class="p-6 border-t bg-gray-50 flex-shrink-0">
          <textarea v-model="customPrompt" class="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-primary focus:ring-primary transition" rows="3" placeholder="或是在這裡輸入您的特殊指令..."></textarea>
            <button @click="generateMaterial" class="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg">
              生成教材
            </button>
        </div>
      </div>
      <!-- 右側內容顯示區 -->
      <div class="w-full flex-grow flex flex-col p-6">
        <div class="flex justify-between items-center mb-4">
          <!-- ⭐️ 新增：重新開啟面板的按鈕 ⭐️ -->
          <button v-if="isPanelCollapsed" @click="reopenPanel" class="flex items-center gap-2 text-primary hover:underline">
            <span class="material-icons">edit</span>
            返回編輯範圍
          </button>
          <!-- 佔位符，確保關閉按鈕永遠在右邊 -->
          <div v-else></div> 
          <button @click="closeGeneratorModal" class="absolute top-0 right-0 p-2 z-10 hover:bg-gray-200">
            <span class="material-icons text-3xl">close</span>
          </button>
        </div>
        <!-- 預留位置 / 動畫 / 內容 -->
        <div class="flex-grow bg-white rounded-lg flex items-center justify-center relative overflow-hidden">
          <!-- 初始提示 -->
          <div v-if="!isGenerating && generatedContent.length === 0" class="text-center text-gray-400">
            <span class="material-icons text-6xl">auto_stories</span>
            <p class="mt-2 text-xl font-semibold">請從左側選擇教材範圍並生成</p>
          </div>
          <!-- 生成動畫 -->
          <div v-if="isGenerating" class="text-center text-primary">
            <svg class="animate-spin h-12 w-12 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <p class="mt-4 text-lg font-semibold">AI 智慧生成中...</p>
          </div>
          <!-- 生成內容 -->
          <div v-if="!isGenerating && generatedContent.length > 0" class="w-full h-full p-2 sm:p-4 md:p-8 overflow-y-auto">
            <!-- ⭐️ 核心修改：使用 v-if / v-else 來判斷顯示圖片還是文字 ⭐️ -->
            <div class="w-full h-full">
              <!-- a. 如果當前頁面有 imgSrc，就顯示圖片 -->
              <div v-if="generatedContent[currentPage - 1].imgSrc" class="w-full h-full flex items-center justify-center">
                <img 
                  :src="generatedContent[currentPage - 1].imgSrc" 
                  :alt="generatedContent[currentPage - 1].title"
                  class="max-w-full max-h-full object-contain"
                >
              </div>
              <!-- b. 否則，就顯示文字 (prose 樣式) -->
              <div v-else class="prose max-w-none">
                <h1>{{ generatedContent[currentPage - 1].title }}</h1>
                <p>{{ generatedContent[currentPage - 1].text }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 翻頁按鈕 -->
        <div v-if="totalPages > 0" class="flex justify-center items-center gap-4 mt-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 rounded-md bg-gray-200 disabled:opacity-50">上一頁</button>
          <span>第 {{ currentPage }} / {{ totalPages }} 頁</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 rounded-md bg-gray-200 disabled:opacity-50">下一頁</button>
        </div>
      </div>
    </div>
  </div>
</template>