// src/router/index.js
import { createRouter, createWebHashHistory  } from 'vue-router';
import TestSetup from '../views/TestSetup.vue';
import ExamTemplate from '../views/ExamTemplate.vue';
import GeneratedExam from '../views/GeneratedExam.vue';
import Dashboard from '../views/DashBoard.vue';
import StudentDashboard from '../views/StudentDashboard.vue';

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
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/student/:id', 
    name: 'StudentDashboard',
    component: StudentDashboard,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' };
  },
});

export default router;