<!-- src/views/Dashboard.vue (繁體中文版) -->
<script setup>
import { ref, computed, watch  } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useRouter } from 'vue-router';

// --- 模擬數據區 (圖表設定中的文字也一併中文化) ---
const router = useRouter();
// 頂部總覽數據
const summaryStats = ref({
  classMood: '😊', // 心情改為班級心情
  avgRewards: 8,
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
// --- ⭐️ 2. 新增：定義班級的弱點知識點ID ---
const weakPoints = ref(new Set([
  'JNS010102010000', // 變因設定
  'JNS020202000000', // 擴散作用與滲透作用
  'JNS040202000000', // 酵素的活性
  'JNS050303010000', // 體循環與肺循環
]));

// --- ⭐️ 3. 新增：歷史派卷紀錄的模擬數據 ---
const assignmentHistory = ref([
  { id: 1, text: '國中 - 自然 - 2025.07.15' },
  { id: 2, text: '國中 - 自然 - 2025.07.10' },
  { id: 3, text: '國中 - 數學 - 2025.07.08' },
  { id: 4, text: '國小 - 自然 - 2025.07.05' },
]);

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
/*
const knowledgeTreeData = ref({
  '國中': {
    '自然': [
      { id: '01', title: '01_緒論', subPoints: [
          { id: 'JNS010101000000', text: '科學方法流程' },
          { id: 'JNS010102010000', text: '變因設定' },
          { id: 'JNS010102020000', text: '實驗組與對照組' },
          { id: 'JNS010201000000', text: '實驗室守則與維護' },
          { id: 'JNS010202000000', text: '實驗室器材' },
      ]},
      { id: '02', title: '02_生命的特性', subPoints: [
          { id: 'JNS020101000000', text: '生命現象' },
          { id: 'JNS020102000000', text: '細胞學說' },
          { id: 'JNS020103010000', text: '人類的細胞型態與功能' },
          { id: 'JNS020103020000', text: '植物的細胞型態與功能' },
          { id: 'JNS020104000000', text: '動、植物細胞構造的比較' },
          { id: 'JNS020105010000', text: '複式顯微鏡' },
          { id: 'JNS020105020000', text: '解剖顯微鏡' },
          { id: 'JNS020201000000', text: '組成細胞的物質' },
          { id: 'JNS020202000000', text: '擴散作用與滲透作用' },
          { id: 'JNS020203000000', text: '物質進出細胞的方式' },
          { id: 'JNS020301000000', text: '單細胞生物與多細胞生物' },
          { id: 'JNS020302010000', text: '植物組成層次' },
          { id: 'JNS020302020000', text: '動物組成層次' },
          { id: 'JNS020303000000', text: '池水中的小生物' },
      ]},
      { id: '03', title: '03_尺度', subPoints: [
          { id: 'JNS030101010000', text: '巨觀尺度與微觀尺度的定義' },
          { id: 'JNS030101020000', text: '不同尺度下的物體特徵' },
          { id: 'JNS030201000000', text: '尺度的表示方式' },
          { id: 'JNS030202000000', text: '尺度的比較、比例尺' },
      ]},
      { id: '04', title: '04_養分', subPoints: [
          { id: 'JNS040101000000', text: '養分與能量' },
          { id: 'JNS040102000000', text: '養分的重要性' },
          { id: 'JNS040103000000', text: '食物中醣類的測定' },
          { id: 'JNS040201010000', text: '代謝作用' },
          { id: 'JNS040201020000', text: '酵素的特性與功能' },
          { id: 'JNS040202000000', text: '酵素的活性' },
          { id: 'JNS040301000000', text: '葉的構造' },
          { id: 'JNS040302010000', text: '光合作用的過程與功能' },
          { id: 'JNS040302020000', text: '光合作用的實驗' },
          { id: 'JNS040401000000', text: '動物攝食的構造' },
          { id: 'JNS040402000000', text: '消化作用的定義' },
          { id: 'JNS040403000000', text: '人體的消化作用' },
      ]},
      { id: '05', title: '05_生物的運輸與防禦', subPoints: [
          { id: 'JNS050101000000', text: '維管束與形成層' },
          { id: 'JNS050102000000', text: '樹皮與年輪' },
          { id: 'JNS050201000000', text: '有機養分的運輸與儲存' },
          { id: 'JNS050202000000', text: '水分的運輸' },
          { id: 'JNS050301000000', text: '動物的循環系統' },
          { id: 'JNS050302010000', text: '心臟' },
          { id: 'JNS050302020000', text: '血管' },
          { id: 'JNS050302030000', text: '血液(血漿與血球)' },
          { id: 'JNS050302040000', text: '心音與脈搏' },
          { id: 'JNS050303010000', text: '體循環與肺循環' },
          { id: 'JNS050303020000', 'text': '養分、氣體運送與交換' },
          { id: 'JNS050304010000', text: '淋巴循環系統的組成與功能' },
          { id: 'JNS050304020000', text: '淋巴循環的途徑' },
          { id: 'JNS050401010000', text: '皮膜屏障' },
          { id: 'JNS050401020000', text: '發炎反應' },
          { id: 'JNS050402010000', text: '人體的專一性防禦' },
          { id: 'JNS050402020000', text: '疫苗' },
      ]},
    ]
  }
});*/

const studentList = ref([
  { id: 'S001', name: '陳冠宇', avatarSeed: 'chen-kuan-yu' },
  { id: 'S002', name: '林佳穎', avatarSeed: 'lin-chia-ying' },
  { id: 'S003', name: '黃子軒', avatarSeed: 'huang-tzu-hsuan' },
  { id: 'S004', name: '張雅婷', avatarSeed: 'chang-ya-ting' },
  { id: 'S005', name: '李俊毅', avatarSeed: 'li-chun-yi' },
  { id: 'S006', name: '王心妤', avatarSeed: 'wang-hsin-yu' },
  { id: 'S007', name: '吳承翰', avatarSeed: 'wu-cheng-han' },
  { id: 'S008', name: '蔡宜臻', avatarSeed: 'tsai-yi-chen' },
  { id: 'S009', name: '許家豪', avatarSeed: 'hsu-chia-hao' },
  { id: 'S010', name: '鄭詩涵', avatarSeed: 'cheng-shih-han' },
]);

// 2. 使用者的篩選器選擇
const filters = ref({
  level: '',
  subject: '',
});

// 3. 顯示的知識點 (根據篩選器計算得出) (修正後)
const displayedChapters = computed(() => {
  // 只有當學制和科目都選了，才顯示所有章節
  if (filters.value.level && filters.value.subject) {
    return knowledgeTreeData.value[filters.value.level]?.[filters.value.subject] || [];
  }
  return [];
});

// 4. 管理展開/收合的狀態 (儲存展開的章節 ID)
const expandedChapters = ref(new Set());
const toggleChapter = (chapterId) => {
  if (expandedChapters.value.has(chapterId)) {
    expandedChapters.value.delete(chapterId);
  } else {
    expandedChapters.value.add(chapterId);
  }
};

// 5. 管理被選取的知識點 (儲存知識點 ID)
const selectedPoints = ref(new Set());
const togglePoint = (pointId) => {
  if (selectedPoints.value.has(pointId)) {
    selectedPoints.value.delete(pointId);
  } else {
    selectedPoints.value.add(pointId);
  }
};

// 5. 新增：計算每個章節內已選中知識點數量的方法
const countSelectedInChapter = (chapter) => {
  let count = 0;
  // 遍歷章節下的所有子知識點
  for (const point of chapter.subPoints) {
    // 如果這個知識點的 ID 在我們的 selectedPoints 集合中，計數器就+1
    if (selectedPoints.value.has(point.id)) {
      count++;
    }
  }
  return count;
};
// 3. 新增：Modal 的顯示狀態
const isConfirmModalVisible = ref(false);

// 4. 修改：提交按鈕的邏輯
const handleGenerateExam = () => {
  if (selectedPoints.value.size === 0) {
    alert('請至少選擇一個知識點！');
    return;
  }
  // 不直接提交，而是打開 Modal
  isConfirmModalVisible.value = true;
};

// 5. 新增：Modal 中的「確認生題」按鈕邏輯
const confirmAndNavigate = () => {
  const submissionData = {
    level: filters.value.level,
    subject: filters.value.subject,
    // 將 Set 轉換為用逗號分隔的字串，方便在 URL 中傳遞
    points: Array.from(selectedPoints.value).join(','),
  };

  console.log('準備跳轉，傳遞的 Query 參數:', submissionData);

  // 關閉 Modal
  isConfirmModalVisible.value = false;

  // 帶上所有參數，跳轉到模板選擇頁面
  router.push({
    name: 'ExamTemplate', // 請確保你的路由名稱正確
    query: submissionData,
  });
};

// 6. 新增：Modal 中的「取消」按鈕邏輯
const cancelGeneration = () => {
  isConfirmModalVisible.value = false;
};

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
        <p class="text-gray-500 text-sm">平均獎勵</p>
        <p class="text-2xl font-bold text-dark-gray">{{ summaryStats.avgRewards }}<span class="text-base font-normal">次</span></p>
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


    <!--  知識點註解  
    <div v-if="false" class="lg:col-span-4 bg-white p-6 rounded-xl shadow-subtle mt-6">
    <h2 class="text-2xl font-bold text-dark-gray mb-6 border-b pb-4">知識樹智慧出題<span class="text-red-600 text-sm">(※紅色表示弱知識點)</span></h2>
    -->
    <!-- 篩選器區域 (已簡化為兩欄) 
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
        <label for="level" class="block text-sm font-medium text-gray-700 mb-1">學制</label>
        <select v-model="filters.level" id="level" class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
            <option value="" disabled>請選擇學制</option>
            <option value="國中">國中</option>
            <option value="國小" disabled>國小 (待開放)</option>
        </select>
        </div>
        <div>
        <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">科目</label>
        <select v-model="filters.subject" id="subject" class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary">
            <option value="" disabled>請選擇科目</option>
            <option value="國語" disabled>國語 (待開放)</option>
            <option value="英語" disabled>英語 (待開放)</option>
            <option value="數學" disabled>數學 (待開放)</option>
            <option value="自然">自然</option>
            <option value="社會" disabled>社會 (待開放)</option>
        </select>
        </div>
    </div>-->

    <!-- 知識樹列表 
    <div class="border-t pt-6">
        <div v-if="displayedChapters.length === 0" class="text-center text-gray-500 py-8">
        請選擇學制與科目以載入知識點。
        </div>
        <div v-else class="space-y-2">-->
        <!-- 遍歷章節 
        <div v-for="chapter in displayedChapters" :key="chapter.id" class="border rounded-lg">
            -->
            <!-- 章節標題 (已加入計數器) 
            <div @click="toggleChapter(chapter.id)" class="p-3 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div class="flex items-center gap-3">
                <h3 class="font-bold text-lg text-dark-gray">{{ chapter.title }}</h3>
                <span v-if="countSelectedInChapter(chapter) > 0" class="text-xs font-mono bg-primary text-white rounded-full px-2 py-0.5">
                已選擇: {{ countSelectedInChapter(chapter) }}
                </span>
            </div>
            <span class="transform transition-transform" :class="{ 'rotate-180': expandedChapters.has(chapter.id) }">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </span>
            </div>
            -->

             <!-- 知識點列表 (展開/收合) 
            <div v-show="expandedChapters.has(chapter.id)" class="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <div 
                v-for="point in chapter.subPoints" 
                :key="point.id"
                @click="togglePoint(point.id)"
                class="p-3 border rounded-md cursor-pointer transition-all duration-150"
                :class="selectedPoints.has(point.id)
                  ? 'bg-primary bg-opacity-10 border-primary ring-2 ring-primary ring-opacity-50'
                  : 'bg-white hover:bg-gray-50'"
              >
                <p 
                  class="font-medium text-gray-800"
                  :class="{ 'text-red-600 font-bold': weakPoints.has(point.id) }"
                >
                  {{ point.text }}
                </p>
                <p class="text-xs text-gray-400 mt-1">{{ point.id }}</p>
              </div>
            </div>
        </div>
        </div>
    </div>
    -->

      <!-- 提交按鈕區域 
      <div class="mt-8 pt-6 border-t flex justify-end items-center gap-4">
        <span class="text-gray-600">已選取 {{ selectedPoints.size }} 個知識點</span>
        <button 
          @click="handleGenerateExam"
          :disabled="selectedPoints.size === 0"
          class="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          開始生題
        </button>
      </div>
      <div class="lg:col-span-4 bg-white p-6 rounded-xl shadow-subtle mt-6">
        <h2 class="text-2xl font-bold text-dark-gray mb-6">歷史派卷紀錄</h2>
        <div class="space-y-3">
          <div v-for="record in assignmentHistory" :key="record.id" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="flex items-center">
              <span class="material-icons text-gray-500 mr-3">history</span>
              <span class="font-semibold text-dark-gray">{{ record.text }}</span>
            </div>
            <button class="text-sm text-primary hover:underline">查看詳情</button>
          </div>
        </div>
      </div>
      -->
      <!-- === ⭐️ 新增：漂亮的確認 Modal === 
      <div v-if="isConfirmModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-4">
          <h3 class="text-2xl font-bold text-dark-gray mb-2 text-center">確認出題範圍</h3>
          <p class="text-center text-gray-500 mb-6">請確認以下資訊是否正確</p>

          <div class="space-y-3 text-lg border-t border-b py-6 mb-6">
            <p><strong>學制：</strong> {{ filters.level }}</p>
            <p><strong>科目：</strong> {{ filters.subject }}</p>
            <p><strong>知識點數量：</strong> <span class="font-bold text-primary">{{ selectedPoints.size }}</span> 個</p>
          </div>
      -->
          <!-- 按鈕區域 
          <div class="flex justify-end gap-4">
            <button @click="cancelGeneration" class="py-2 px-6 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors">
              返回修改
            </button>
            <button @click="confirmAndNavigate" class="py-2 px-6 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors">
              確認並下一步
            </button>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>