// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import TestSetup from '../views/TestSetup.vue';
import ExamTemplate from '../views/ExamTemplate.vue';
import GeneratedExam from '../views/GeneratedExam.vue'

const routes = [
  {
    path: '/', 
    name: 'TestSetup',
    component: TestSetup,
  },
  {
    path: '/ExamTemplate',
    name: 'ExamTemplate',
    component: ExamTemplate,
  },
  {
    path: '/generated-exam',
    name: 'GeneratedExam',
    component: GeneratedExam,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;