import Vue from 'vue'
import Router from 'vue-router'
import AuthorizationView from '@/views/AuthorizationView.vue'
import EmployeesView from "@/views/EmployeesView.vue";
import EmployeeEditView from "@/views/EmployeeEditView";
import WorkSchedulesView from "@/views/WorkSchedulesView";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Employees',
      component: EmployeesView
    },
    {
      path: '/login',
      name: 'Authorization',
      component: AuthorizationView
    },
    {
      path: '/employeeEdit',
      name: 'EmployeeAdd',
      component: EmployeeEditView,
    },
    {
      path: '/employeeEdit/:userId',
      name: 'EmployeeEdit',
      component: EmployeeEditView,
      props: (route) => {
        const userId = +route.params.userId;
        return { ...route.params, userId }
      },
    },
    {
      path: '/workSchedules/:userId',
      name: 'WorkSchedules',
      component: WorkSchedulesView,
      props: (route) => {
        const userId = +route.params.userId;
        return { ...route.params, userId }
      },
    }
  ]
})
