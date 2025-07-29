<script setup>
import { computed } from 'vue';

// 這個元件會接收一個 node 物件作為 prop
const props = defineProps({
  node: Object,
  expandedNodes: Set, 
  selectedLectureNodes: Set,
});
// 定義一個 emit 事件，用來通知父元件執行 toggleNode
const emit = defineEmits(['toggle', 'toggleSelection']);

const proficiencyLevels = {
  high: { label: '精熟 (80-90%)', colorClass: 'bg-green-100 text-black border-green-300 font-bold' },
  medium: { label: '待加強 (60-80%)', colorClass: 'bg-yellow-200 text-black border-yellow-300 font-bold' },
  low: { label: '需補救 (0-60%)', colorClass: 'bg-rose-500 text-white border-red-400 font-bold' },
};

// 輔助用的 computed 屬性
const isLeaf = computed(() => !props.node.children || props.node.children.length === 0);
const isExpandable = computed(() => !isLeaf.value);
const isExpanded = computed(() => props.expandedNodes.has(props.node.title));

const isChapter = computed(() => {
  // 如果它不是葉節點，並且它的第一個子節點是葉節點，
  // 那我們就認定它是一個「章節」。
  return isExpandable.value && (!props.node.children[0]?.children || props.node.children[0].children.length === 0);
});

// 3. 修改 computed 屬性，讓它使用元件內部的 proficiencyLevels
const proficiencyColorClass = computed(() => {
  if (isLeaf.value && props.node.proficiency) {
    // 現在直接從元件內部的 proficiencyLevels 查找
    return proficiencyLevels[props.node.proficiency]?.colorClass || '';
  }
  return '';
});

// 3. 新增：判斷當前節點是否被勾選的 computed 屬性
const isSelected = computed(() => {
  // 使用可選鏈 ?. 確保在 props 未完全傳遞時不會報錯
  return props.selectedLectureNodes?.has(props.node.title);
});

// 4. 新增：處理 checkbox 點擊的函式，並阻止事件冒泡
const handleCheckboxClick = (event) => {
  event.stopPropagation(); // 關鍵！阻止點擊事件傳遞到外層 div，避免觸發展開/收合
  emit('toggleSelection', props.node.title);
};

</script>

<template>
  <div>
    <!-- 節點容器 -->
    <div 
      class="flex items-center p-2 rounded-md transition-colors"
      :class="[
        proficiencyColorClass, 
        isExpandable ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'
      ]"
      @click="isExpandable && emit('toggle', node.title)"
    >
      <!-- 折疊圖示 -->
      <span v-if="isExpandable" class="material-icons text-gray-500 mr-2 transition-transform" :class="{ 'rotate-90': isExpanded }">chevron_right</span>
      <span v-else class="w-6 mr-2"></span>

      <!-- 節點標題 -->
      <span 
        class="font-medium flex-grow"
        :class="{
          'text-gray-800': proficiencyColorClass, 
          'text-gray-400': !proficiencyColorClass && isLeaf, 
          'text-gray-800': !proficiencyColorClass && !isLeaf,
        }"
      >
        {{ node.title }}
      </span>
      <div v-if="isChapter" @click="handleCheckboxClick" class="p-1 cursor-pointer ml-2">
        <div 
          class="w-5 h-5 border-2 rounded flex items-center justify-center transition-all"
          :class="isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-400'"
        >
          <svg v-if="isSelected" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
    
    <!-- 子節點遞迴渲染 -->
    <div v-if="isExpanded" v-show="isExpanded" class="pl-6 border-l-2 ml-3 space-y-2">
      <CourseNode 
        v-for="childNode in node.children" 
        :key="childNode.title" 
        :node="childNode" 
        :expandedNodes="props.expandedNodes"
        :selectedLectureNodes="props.selectedLectureNodes"
        @toggle="$emit('toggle', $event)"
        @toggleSelection="$emit('toggleSelection', $event)"
      />
    </div>
  </div>
</template>