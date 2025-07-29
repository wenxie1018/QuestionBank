<!-- src/components/QrCode.vue -->
<script setup>
import { ref, onMounted, watch } from 'vue';
import QRCode from 'qrcode';

const props = defineProps({
  // 要編碼成 QR Code 的文字內容
  value: {
    type: String,
    required: true,
  },
  // QR Code 圖片的大小 (像素)
  size: {
    type: Number,
    default: 128,
  },
});

const canvasRef = ref(null);

// 產生 QR Code 的函式
const generateQRCode = () => {
  if (canvasRef.value) {
    QRCode.toCanvas(canvasRef.value, props.value, {
      width: props.size,
      margin: 1,
      color: {
        dark: '#000000', // 黑色
        light: '#FFFFFF', // 白色
      },
    }, (error) => {
      if (error) console.error('QR Code generation error:', error);
    });
  }
};

// 元件掛載後立即生成一次
onMounted(generateQRCode);

// 當傳入的 value 或 size 改變時，重新生成
watch(() => [props.value, props.size], generateQRCode);
</script>

<template>
  <!-- 我們使用 <canvas> 元素來繪製 QR Code -->
  <canvas ref="canvasRef"></canvas>
</template>