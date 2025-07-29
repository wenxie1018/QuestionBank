<script setup>
import { ref, onMounted, computed, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import CourseNode from './CourseNode.vue';

const route = useRoute();
const router = useRouter();

// 1. 從路由參數中獲取學生 ID
const studentId = route.params.id; // 這就是 :id 對應的值

// 2. 模擬的學生資料庫 (在真實應用中，這會是一個 API 請求)
const allStudentsData = {
  'S001': { name: '陳冠宇', avatarSeed: 'chen-kuan-yu', avgScore: 92, weakConcept: '分數的除法' },
  'S002': { name: '林佳穎', avatarSeed: 'lin-chia-ying', avgScore: 88, weakConcept: '大氣壓力' },
  'S003': { name: '黃子軒', avatarSeed: 'huang-tzu-hsuan', avgScore: 95, weakConcept: '光合作用' },
  'S004': { name: '張雅婷', avatarSeed: 'chang-ya-ting', avgScore: 95, weakConcept: '光合作用' },
  'S005': { name: '李俊毅', avatarSeed: 'li-chun-yi', avgScore: 95, weakConcept: '光合作用' },
  'S006': { name: '王心妤', avatarSeed: 'wang-hsin-yu', avgScore: 95, weakConcept: '光合作用' },
  'S007': { name: '吳承翰', avatarSeed: 'wu-cheng-han', avgScore: 95, weakConcept: '光合作用' },
  'S008': { name: '蔡宜臻', avatarSeed: 'tsai-yi-chen', avgScore: 95, weakConcept: '光合作用' },
  'S009': { name: '許家豪', avatarSeed: 'hsu-chia-hao', avgScore: 95, weakConcept: '光合作用' },
  'S010': { name: '鄭詩涵', avatarSeed: 'cheng-shih-han', avgScore: 85, weakConcept: '台灣史前文化' },
};

// 2. 模擬的課程大綱/知識樹數據
const courseOutline = ref([
  {
    title: '國中自然', // 主標題
    children: [
      {
        title: '01_緒論',
        button: false, // 章節層級沒有按鈕
        children: [
          { title: '科學方法流程 (JNS010101000000)', children: [] },
          { title: '變因設定 (JNS010102010000)', children: [] },
          { title: '實驗組與對照組 (JNS010102020000)', children: [] },
          { title: '實驗室守則與維護 (JNS010201000000)', children: [] },
          { title: '實驗室器材 (JNS010202000000)', children: [] },
        ]
      },
      {
        title: '02_生命的特性',
        button: false,
        children: [
          { title: '生命現象 (JNS020101000000)', children: [] },
          { title: '細胞學說 (JNS020102000000)', children: [] },
          { title: '人類的細胞型態與功能 (JNS020103010000)', children: [] },
          { title: '植物的細胞型態與功能 (JNS020103020000)', children: [] },
          { title: '動、植物細胞構造的比較 (JNS020104000000)', children: [] },
          { title: '複式顯微鏡 (JNS020105010000)', children: [] },
          { title: '解剖顯微鏡 (JNS020105020000)', children: [] },
          { title: '組成細胞的物質 (JNS020201000000)', children: [] },
          { title: '擴散作用與滲透作用 (JNS020202000000)', children: [] },
          { title: '物質進出細胞的方式 (JNS020203000000)', children: [] },
          { title: '單細胞生物與多細胞生物 (JNS020301000000)', children: [] },
          { title: '植物組成層次 (JNS020302010000)', children: [] },
          { title: '動物組成層次 (JNS020302020000)', children: [] },
          { title: '池水中的小生物 (JNS020303000000)', children: [] },
        ]
      },
      {
        title: '03_尺度',
        button: false,
        children: [
          { title: '巨觀尺度與微觀尺度的定義 (JNS030101010000)', children: [] },
          { title: '不同尺度下的物體特徵 (JNS030101020000)', children: [] },
          { title: '尺度的表示方式 (JNS030201000000)', children: [] },
          { title: '尺度的比較、比例尺 (JNS030202000000)', children: [] },
        ]
      },
      {
        title: '04_養分',
        button: false,
        children: [
          { title: '養分與能量 (JNS040101000000)', children: [] },
          { title: '養分的重要性 (JNS040102000000)', children: [] },
          { title: '食物中醣類的測定 (JNS040103000000)', children: [] },
          { title: '代謝作用 (JNS040201010000)', children: [] },
          { title: '酵素的特性與功能 (JNS040201020000)', children: [] },
          { title: '酵素的活性 (JNS040202000000)', children: [] },
          { title: '葉的構造 (JNS040301000000)', children: [] },
          { title: '光合作用的過程與功能 (JNS040302010000)', children: [] },
          { title: '光合作用的實驗 (JNS040302020000)', children: [] },
          { title: '動物攝食的構造 (JNS040401000000)', children: [] },
          { title: '消化作用的定義 (JNS040402000000)', children: [] },
          { title: '人體的消化作用 (JNS040403000000)', children: [] },
        ]
      },
      {
        title: '05_生物的運輸與防禦',
        button: false,
        children: [
          { title: '維管束與形成層 (JNS050101000000)', children: [] },
          { title: '樹皮與年輪 (JNS050102000000)', children: [] },
          { title: '有機養分的運輸與儲存 (JNS050201000000)', children: [] },
          { title: '水分的運輸 (JNS050202000000)', children: [] },
          { title: '動物的循環系統 (JNS050301000000)', children: [] },
          { title: '心臟 (JNS050302010000)', children: [] },
          { title: '血管 (JNS050302020000)', children: [] },
          { title: '血液(血漿與血球) (JNS050302030000)', children: [] },
          { title: '心音與脈搏 (JNS050302040000)', children: [] },
          { title: '體循環與肺循環 (JNS050303010000)', children: [] },
          { title: '養分、氣體運送與交換 (JNS050303020000)', children: [] },
          { title: '淋巴循環系統的組成與功能 (JNS050304010000)', children: [] },
          { title: '淋巴循環的途徑 (JNS050304020000)', children: [] },
          { title: '皮膜屏障 (JNS050401010000)', children: [] },
          { title: '發炎反應 (JNS050401020000)', children: [] },
          { title: '人體的專一性防禦 (JNS050402010000)', children: [] },
          { title: '疫苗 (JNS050402020000)', children: [] },
        ]
      },
    ]
  }
]);

const lecturenote = ref([
  {
    title: '國中自然', // 主標題
    children: [
      {
        title: '01_緒論',
        children: [
          { title: '變因設定 (JNS010102010000)', children: [
                {
                  "name": "變因設定",
                  "summary_content": "實驗中可能影響結果的因素稱為「變因」。為了確定因果關係，實驗設計時需嚴謹控制變因：\n1. **操縱變因：** 實驗中刻意改變的單一變因，以觀察其對結果的影響。\n2. **控制變因：** 實驗中保持不變的變因，確保只有操縱變因在起作用。\n3. **應變變因：** 隨操縱變因改變而產生的結果，即實驗後觀察的項目。",
                  "source_page": "P.4 (步驟1 變因設定)"
                },
                {
                  "name": "變因設定",
                  "summary_content": "以「水量對米飯軟硬度的影響」為例：\n- **操縱變因：** 水量。\n- **控制變因：** 電鍋規格、加熱時間、米的品質與重量。\n- **應變變因：** 米飯的軟硬度。",
                  "source_page": "P.5 (表1)"
                }
          ] },
        ]
      },
      {
        title: '02_生命的特性',
        children: [
          { title: '細胞學說 (JNS020102000000)', children: [
                {
                  "name": "細胞學說",
                  "summary_content": "早在300多年前，英國科學家虎克（Robert Hooke）使用自製顯微鏡觀察軟木塞切片，發現其中有許多蜂窩狀小格子，他將這些小格子命名為「細胞」。",
                  "source_page": "P.14"
                },
                {
                  "name": "細胞學說",
                  "summary_content": "19世紀，德國植物學家許來登（Matthias J. Schleiden）和動物學家許旺（Theodor Schwann）分別提出植物體和動物體皆由細胞組成，形成了細胞學說的雛形。細胞學說歸納出：細胞是組成生物體構造與功能的基本單位。",
                  "source_page": "P.15"
                }
          ] },
          { title: '擴散作用與滲透作用 (JNS020202000000)', children: [
                {
                  "name": "擴散作用與滲透作用",
                  "summary_content": "擴散作用是指物質由高濃度區域向低濃度區域移動，最終均勻分佈的現象。當細胞膜內外物質濃度不同時，會發生擴散作用，使物質進出細胞。",
                  "source_page": "P.30"
                },
                {
                  "name": "擴散作用與滲透作用",
                  "summary_content": "滲透作用是水分子透過半透膜（如細胞膜）進行擴散的特殊形式。其運輸方向隨溶液濃度而異。1. 紅血球置於濃食鹽水：細胞內的水向外滲透，導致細胞萎縮。2. 紅血球置於清水：外界的水滲透入細胞，導致細胞膨脹甚至破裂。3. 紅血球置於生理食鹽水：水進出細胞速率大致相同，細胞維持正常形態。4. 植物細胞置於清水：細胞會膨脹但不會破裂，因為細胞壁有支持作用。",
                  "source_page": "P.32"
                }
          ] },
        ]
      },
    ]
  }
]);

const dataTemplates = [
  // 模板 1 (學霸型)
  {
    radarData: [92, 85, 95, 78, 88],
    radarCategories: ['植物組成層次', '細胞學說', '生命現象', '變因設定', '複式顯微鏡'],
    barData: [100, 95, 90, 85, 80],
    barCategories: ['池水中的小生物', '植物組成層次', '實驗室器材', '細胞學說', '生命現象'],
    proficiencyDb: {
      '變因設定 (JNS010102010000)': 'medium',
      '擴散作用與滲透作用 (JNS020202000000)': 'medium',
      '細胞學說 (JNS020102000000)': 'low',
      '複式顯微鏡 (JNS020105010000)': 'high',
    }
  },
  // 模板 2 (努力型)
  {
    radarData: [75, 90, 82, 88, 79],
    radarCategories: ['酵素的活性', '光合作用', '消化作用', '循環系統', '防禦作用'],
    barData: [90, 80, 85, 70, 75],
    barCategories: ['酵素的活性', '光合作用', '消化作用', '循環系統', '防禦作用'],
    proficiencyDb: {
      '動物組成層次 (JNS020302020000)': 'high',
      '擴散作用與滲透作用 (JNS020202000000)': 'low',
      '細胞學說 (JNS020102000000)': 'medium',
      '生命現象 (JNS020101000000)':'high',
    }
  },
  // 模板 3 (偏科型)
  {
    radarData: [95, 70, 75, 98, 65],
    radarCategories: ['科學方法', '顯微鏡操作', '細胞構造', '物質運輸', '能量轉換'],
    barData: [100, 60, 70, 100, 50],
    barCategories: ['科學方法', '顯微鏡操作', '細胞構造', '物質運輸', '能量轉換'],
    proficiencyDb: {
      '擴散作用與滲透作用 (JNS020202000000)': 'low',
      '解剖顯微鏡 (JNS020105020000)': 'high',
      '細胞學說 (JNS020102000000)': 'low',
      '複式顯微鏡 (JNS020105010000)': 'high',
      '生命現象 (JNS020101000000)':'high',
    }
  }
];

// --- ⭐️ 2. 創建一個函式來根據學生 ID 生成數據 ⭐️ ---
const getStudentPersonalizedData = (sId) => {
  if (!sId) return dataTemplates[0]; // 如果 ID 無效，返回一個預設模板
  const numericId = parseInt(sId.replace('S', ''), 10);
  const templateIndex = (numericId - 1) % dataTemplates.length;
  return dataTemplates[templateIndex];
};

// a. 先定義空的 ref
const studentRadarChart = ref({ series: [], options: {} });
const studentBarChart = ref({ series: [], options: {} });
const proficiencyDatabase = ref({});
const currentStudent = ref(null);

// b. 在 onMounted 中填充數據
onMounted(() => {
  currentStudent.value = allStudentsData[studentId] || null;

  if (currentStudent.value) {
    // 獲取該學生的個人化數據模板
    const personalizedData = getStudentPersonalizedData(studentId);

    // 更新雷達圖數據
    studentRadarChart.value = {
      series: [{ name: '個人表現', data: personalizedData.radarData }],
      options: {
        chart: { toolbar: { show: false }, height: 300 },
        xaxis: { categories: personalizedData.radarCategories, labels: { show: false } },
        yaxis: { show: false },
        colors: ['#4A90E2'],
        markers: { size: 4 },
      }
    };

    // 更新長條圖數據
    studentBarChart.value = {
      series: [{ name: '訂正完成率', data: personalizedData.barData }],
      options: {
        chart: { type: 'bar', height: 200, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        xaxis: { categories: personalizedData.barCategories },
        colors: ['#81C784'],
      }
    };
    /*
    // 更新熟練度資料庫
    const baseProficiency = {
      '科學方法流程 (JNS010101000000)': 'high',
      '實驗室器材 (JNS010202000000)': 'high',
      '疫苗 (JNS050402020000)': 'high',
    };*/
    proficiencyDatabase.value = { /*...baseProficiency,*/ ...personalizedData.proficiencyDb };
  }

  // 預設展開的邏輯 (保持不變)
  expandedNodes.value.add('國中自然');
  expandedNodes.value.add('02_生命的特性');
});


// 1. 新增：建立一個 Set 來儲存被勾選的節點標題
const selectedLectureNodes = ref(new Set());

// 2. 新增：處理勾選/取消勾選的函式
const toggleLectureNodeSelection = (nodeTitle) => {
  if (selectedLectureNodes.value.has(nodeTitle)) {
    selectedLectureNodes.value.delete(nodeTitle);
  } else {
    selectedLectureNodes.value.add(nodeTitle);
  }
};

// 3. 新增：一個 computed 屬性，根據勾選的節點動態篩選講義內容
const filteredLectureNote = computed(() => {
  // 如果沒有勾選任何節點，則返回空陣列，Modal 中不顯示任何內容
  if (selectedLectureNodes.value.size === 0) {
    return [];
  }

  const result = [];
  // 遍歷原始講義資料來進行篩選
  lecturenote.value.forEach(subject => {
    const newSubject = { ...subject, children: [] };
    subject.children.forEach(chapter => {
      const newChapter = { ...chapter, children: [] };
      chapter.children.forEach(node => {
        // 如果這個節點的標題在我們的勾選集合中，就把它加入結果
        if (selectedLectureNodes.value.has(node.title)) {
          newChapter.children.push(node);
        }
      });
      // 如果這個章節下有被選中的節點，才把這個章節加入結果
      if (newChapter.children.length > 0) {
        newSubject.children.push(newChapter);
      }
    });
    if (newSubject.children.length > 0) {
      result.push(newSubject);
    }
  });
  
  return result;
});
/*
// 3. 模擬的學生個人圖表數據
const studentRadarChart = ref({
  series: [{ name: '個人表現', data: [92, 85, 95, 78, 88] }],
  options: {
    chart: { 
      toolbar: { show: false },
      height: 300,
   },
    xaxis: { 
      categories: 
      ['植物組成層次', '細胞學說', '生命現象', '變因設定', '複式顯微鏡'],
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false // 同時也關閉 Y 軸刻度，讓圖表最大化
    },
    colors: ['#4A90E2'],
    markers: { size: 4 },
  },
});*/
const customLabelPositions = computed(() => {
  // 這些百分比是針對五邊形雷達圖精心微調的，您可以根據需要調整
  return [
    { top: '5%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },       // Top
    { top: '40%', right: '10%', textAlign: 'left' },     // Top-Right
    { bottom: '0%', right: '25%', textAlign: 'right' },    // Bottom-Right
    { bottom: '0%', left: '25%', textAlign: 'left' },     // Bottom-Left
    { top: '40%', left: '5%', textAlign: 'right' },      // Top-Left
  ];
});

/*
const studentBarChart = ref({
  series: [{ name: '訂正完成率', data: [80, 95, 75, 100, 90] }],
  options: {
    chart: { type: 'bar', height: 200, toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    xaxis: { categories: ['池水中的小生物', '植物組成層次', '實驗室器材', '細胞學說', '生命現象'] },
    colors: ['#81C784'],
  },
});
*/

// 定義顏色和熟悉度等級
const proficiencyLevels = {
  high: { label: '精熟 (80-90%)', colorClass: 'bg-green-200 text-green-800 border-green-300' },
  medium: { label: '待加強 (60-80%)', colorClass: 'bg-yellow-300 text-yellow-800 border-yellow-300' },
  low: { label: '需補救 (0-60%)', colorClass: 'bg-rose-500 text-red-800 border-red-400' },
};

/*
const proficiencyDatabase = ref({
  '科學方法流程 (JNS010101000000)': 'high',
  '變因設定 (JNS010102010000)': 'low',    // 指定為 low (紅色)
  '實驗室器材 (JNS010202000000)': 'high',
  '細胞學說 (JNS020102000000)': 'medium', // 指定為 medium (黃色)
  '複式顯微鏡 (JNS020105010000)': 'high',
  '擴散作用與滲透作用 (JNS020202000000)': 'low',  
});
*/


// --- ⭐️ 2. 修改賦值邏輯，從「隨機」變為「查找」 ⭐️ ---
const assignProficiency = (nodes) => {
  return nodes.map(node => {
    const newNode = { ...node };
    // 只有最底層的葉節點才需要熟悉度
    if (!newNode.children || newNode.children.length === 0) {
      // 從我們的資料庫中，根據標題查找對應的熟悉度等級
      const proficiency = proficiencyDatabase.value[node.title];
      if (proficiency) {
        newNode.proficiency = proficiency; // 如果找到了，就賦值
      }
      // 如果在資料庫中找不到，這個知識點就不會有 proficiency 屬性，也就不會有顏色
    }
    // 遞迴處理子節點
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = assignProficiency(newNode.children);
    }
    return newNode;
  });
};

// 使用 computed 來確保每次頁面刷新時，隨機顏色是固定的
const courseOutlineWithProficiency = computed(() => {
  return assignProficiency(courseOutline.value);
});

// 1. 新增：控制載入動畫的顯示狀態
const isLoading = ref(false);
const loadingMessage = ref('');

// 2. 修改：「開始出題」按鈕的邏輯
const startExamGeneration = () => {
  closeLectureNote();
  // a. 顯示載入動畫
  isLoading.value = true;
  
  // b. 使用 setTimeout 模擬後端處理時間 (例如 1.5 秒)
  setTimeout(() => {
    // c. 隱藏載入動畫
    isLoading.value = false;

    // d. 彈出提示並執行頁面跳轉
    //alert('已根據學生學習狀況，智慧生成題目！');
    router.push({ 
      name: 'GeneratedExam', // 直接跳轉到試卷頁
      query: { 
        // 帶上所有需要的參數
        student: currentStudent.value?.name,
        grade: '國中', // 這裡可以根據學生的資料動態生成
        subject: '自然',
        range: '個人化複習'
      }
    });
  }, 1000); // 延遲 1500 毫秒
};

/*
// 3. 根據 ID 找到當前學生的資料
const currentStudent = ref(null);

onMounted(() => {
  // 1. 查找學生資料 (原有邏輯)
  currentStudent.value = allStudentsData[studentId] || null;
  expandedNodes.value.add('國中自然');
  expandedNodes.value.add('02_生命的特性');
});
*/

// 返回教師儀表板的函式
const goBackToDashboard = () => {
  router.push({ name: 'Dashboard' });
};

// --- 管理所有節點的展開/收合狀態 ---
const expandedNodes = ref(new Set());

const toggleNode = (nodeTitle) => {
  if (expandedNodes.value.has(nodeTitle)) {
    expandedNodes.value.delete(nodeTitle);
  } else {
    expandedNodes.value.add(nodeTitle);
  }
};

const isLectureNoteVisible = ref(false); // 控制 Modal 本身的顯示
const lectureNoteModalEl = ref(null);

// 1. 新增：專門控制講義內容載入動畫的狀態
const openLectureNote = () => {
  // a. 顯示全頁面的載入動畫，並設定專屬訊息
  loadingMessage.value = `正在為 ${currentStudent.value?.name} 智慧生成補強講義...`;
  isLoading.value = true;

  // b. 使用 setTimeout 模擬後端內容生成的時間
  setTimeout(() => {
    // c. 時間到後，隱藏載入動畫
    isLoading.value = false;
    
    // d. 接著，才打開 Modal 視窗
    isLectureNoteVisible.value = true;
  }, 500); // 延遲 1200 毫秒
};


const closeLectureNote = () => {
  isLectureNoteVisible.value = false;
};

// 點擊外部關閉 Modal 的函式
const handleLectureNoteClickOutside = (event) => {
  if (lectureNoteModalEl.value && !lectureNoteModalEl.value.contains(event.target)) {
    closeLectureNote();
  }
};

// 監聽 Modal 狀態來掛載/卸載事件
watch(isLectureNoteVisible, (newValue) => {
  if (newValue) {
    // 當 Modal 打開時
    document.addEventListener('mousedown', handleLectureNoteClickOutside);
    // ⭐️ 新增：為 <body> 加上 overflow-hidden class，禁止背景滾動
    document.body.classList.add('overflow-hidden');
  } else {
    // 當 Modal 關閉時
    document.removeEventListener('mousedown', handleLectureNoteClickOutside);
    // ⭐️ 新增：從 <body> 移除 overflow-hidden class，恢復背景滾動
    document.body.classList.remove('overflow-hidden');
  }
});

</script>

<template>
  <div class="p-6 md:p-8">
    <button @click="goBackToDashboard" class="mb-6 text-primary hover:underline flex items-center">
      <span class="material-icons mr-1">arrow_back</span>
      返回教師儀表板
    </button>
    
    <!-- 學生個人資訊總覽 -->
    <div v-if="currentStudent" class="bg-white p-6 rounded-xl shadow-subtle flex items-center justify-between">
      <div class="flex items-center gap-6 mb-4">
        <img 
          :src="`https://api.dicebear.com/8.x/micah/svg?seed=${currentStudent.avatarSeed}`" 
          alt="學生頭像" 
          class="w-24 h-24 rounded-full bg-gray-200"
        >
        <div>
          <h1 class="text-4xl font-bold text-dark-gray">{{ currentStudent.name }}</h1>
          <p class="text-lg text-gray-500">個人學習儀表板</p>
        </div>
      </div>
      <div class="flex gap-6">
        <button @click="openLectureNote" class=" bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-500 transition-colors tracking-widest text-xl">
          補強講義
        </button>
        <button @click="startExamGeneration" class="bg-amber-500 text-white font-bold py-3 px-6 rounded-lg tracking-widest hover:bg-orange-500 transition-colors text-xl">
          智慧出卷
        </button>
      </div>  
    </div>
    
    <!-- 主內容區 -->
    <div v-if="currentStudent" class="mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左側：課程學習進度 -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-subtle">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-dark-gray">個人化知識弱點</h2>
            <div class="flex gap-4 text-sm">
              <div v-for="(level, key) in proficiencyLevels" :key="key" class="flex items-center">
                <span :class="level.colorClass.split(' ')[0]" class="w-4 h-4 rounded-full mr-2"></span>
                <span>{{ level.label }}</span>
              </div>
            </div>
          </div>
          
          <!-- 使用遞迴元件渲染，確保版面正確 -->
          <div class="space-y-2">
            <CourseNode 
              v-for="node in courseOutlineWithProficiency" 
              :key="node.title" 
              :node="node"
              :expandedNodes="expandedNodes"
              :selectedLectureNodes="selectedLectureNodes"
              @toggle="toggleNode" 
              @toggleSelection="toggleLectureNodeSelection"
            />
          </div>

          <!--<div class="mt-8 pt-6 border-t text-center">
            <button @click="startExamGeneration" class="bg-primary text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-600 transition-colors">
              開始出題
            </button>
          </div>-->
        </div>

        <!-- 右側：個人圖表 -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-subtle">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-bold text-dark-gray">個人學科能力</h2>
            </div>
            <div class="relative w-full h-[250px]">
              <div class="absolute inset-0">
                <VueApexCharts 
                  type="radar" 
                  height="100%" 
                  width="100%" 
                  :options="studentRadarChart.options" 
                  :series="studentRadarChart.series" 
                />
              </div>
              <div 
                v-for="(label, index) in studentRadarChart.options.xaxis.categories" 
                :key="label"
                class="absolute text-sm text-gray-600 font-semibold max-w-[90px] leading-tight p-0"
                :style="{ ...customLabelPositions[index] }"
              >
                {{ label }}
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-subtle">
            <h2 class="text-xl font-bold text-dark-gray mb-4">弱點訂正率</h2>
            <VueApexCharts type="bar" height="200" :options="studentBarChart.options" :series="studentBarChart.series" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-red-600">找不到學生資料</h2>
      <p class="text-gray-500 mt-2">請確認學生 ID ({{ studentId }}) 是否正確。</p>
    </div>
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      <svg class="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-4 text-xl font-semibold text-dark-gray">{{ loadingMessage }}</p>
    </div>
    <!-- === ⭐️ 新增：個人化學習講義 Modal === -->
    <div v-if="isLectureNoteVisible" class="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <!-- Modal 面板，使用 ref 綁定，並阻止事件冒泡 -->
      <div ref="lectureNoteModalEl" @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        
        <!-- Modal 標頭 -->
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-2xl font-bold text-dark-gray">補強講義</h2>
          <div class="flex items-center gap-4">
            <button 
              @click="startExamGeneration" 
              class="bg-amber-500 text-white font-bold py-3 px-4 rounded-lg tracking-widest hover:bg-orange-500 transition-colors text-xl"
            >
              智慧出卷
            </button>
            <button @click="closeLectureNote" class="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>

        <!-- Modal 內容 (可滾動) -->
        <div class="flex-grow p-8 overflow-y-auto">
          <!-- 使用 v-for 巢狀渲染講義內容 -->
          <div v-for="subject in lecturenote" :key="subject.title" class="space-y-8">
            <div v-for="chapter in subject.children" :key="chapter.title">
              <h3 class="text-2xl font-bold text-primary mb-4 border-l-4 border-primary pl-3">{{ chapter.title }}</h3>
              <div v-for="node in chapter.children" :key="node.title" class="space-y-6">
                <h4 class="text-xl font-semibold text-dark-gray">{{ node.title }}</h4>
                <div v-for="(content, index) in node.children" :key="index" class="ml-4 pl-4 border-l-2 border-gray-200">
                  <p class="text-gray-700 leading-relaxed">{{ content.summary_content }}</p>
                  <p class="text-sm text-gray-400 mt-2 text-right">來源: {{ content.source_page }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>