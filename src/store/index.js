import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import router from '@/router';

const store = new Vuex.Store({
  state: {
    buildings: [],
    specialities: [],
    users: [],
    workplaces: [],
    modelSchedules: [],

    count: 1,
  },
  getters: {
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id);
    },
    getBuildingName: (state) => (id) => {
      const building = state.buildings.find(
        building => building.id === id);
      if (building === undefined) return '';
      return building.name;
    },
    getSpetialityName: (state) => (id) => {
      const speciality = state.specialities.find(
        speciality => speciality.id === id);
      if (speciality === undefined) return '';
      return speciality.name;
    },
    getWorkplaceById: (state) => (id) => {
      return state.workplaces.find(workplace => workplace.id === id);
    },
    getModelSchedulesByWorkplaceId: (state) => (id) => {
      return state.modelSchedules.filter(modelSchedule => modelSchedule.workplace === id);
    },
    getModelScheduleById: (state) => (id) => {
      return state.modelSchedules.find(modelSchedule => modelSchedule.id === id);
    },
  },
  mutations: {
    setBuildings(state, buildings) {
      state.buildings = buildings;
    },
    setSpecialities(state, specialities) {
      state.specialities = specialities;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setWorkplaces(state, workplaces) {
      state.workplaces = workplaces;
    },
    setModelSchedules(state, modelSchedules) {
      state.modelSchedules = modelSchedules;
    },
    addModelSchedule(state, modelSchedule) {
      state.modelSchedules.push(modelSchedule);
    },
  },
  actions: {
    loadSpecialities({commit}) {
      window.fetchRequest('/building/')
        .then(response => {
          if (response.ok)
            return response.json();
          window.fetchError(response);
        }).then(result => {
        commit('setBuildings', result);
      });
    },

    loadBuildings({commit}) {
      window.fetchRequest('/get_list_specialities/')
        .then(response => {
          if (response.ok)
            return response.json();
          window.fetchError(response);
        }).then(result => {
        commit('setSpecialities', result);
      });
    },

    loadUsers({commit}) {
      window.fetchRequest('/staff/')
        .then(response => {
          if (response.ok)
            return response.json();
          router.push('/login');
        }).then(result => {
        commit('setUsers', result);
      });
    },

    loadWorkplaces({commit}, doctorId) {
      window.fetchRequest('/workplace/')
      .then(response => {
        if (response.ok)
          return response.json();
        window.fetchError(response);
      }).then(result => {
        const workplaces = result.filter(workplace => workplace.doctor === doctorId);
        commit('setWorkplaces', workplaces);
      });
    },

    loadModelSchedules({commit}, {dt, doctorId, filialIds}) {
      filialIds = [...new Set(filialIds)];

      const reqs = filialIds.map(filialId => {
        const hook = `/model_schedule/?dt=${dt}&doctor_id=${doctorId}&filial_id=${filialId}`;
        return window.fetchRequest(hook);
      });

      Promise.all(reqs).then(responses => {
        for (let response of responses) {
          if (!response.ok)
            window.fetchError(response);
        }

        const results = responses.map(response => response.json());
        Promise.all(results).then(results => {
          let modelSchedules = [];
          results.forEach(result => { modelSchedules.push(...result); });
          commit('setModelSchedules', modelSchedules);
        });
      });
    },
    saveModelSchedules({state}) {
      let reqs = [];
      state.modelSchedules.forEach(modelSchedule => {
        if (modelSchedule.workplace === undefined
          || modelSchedule.dt === undefined
          || modelSchedule.work_start === undefined
          || modelSchedule.work_end === undefined) {
          return;
        }

        let hook = '/model_schedule/';
        let body = JSON.stringify({
          workplace: modelSchedule.workplace,   // - id рабочего места
          dt: modelSchedule.dt,                 // - день в формате YYYY-MM-DD
          work_start: modelSchedule.work_start, // - время начала работы в формате hh:mm
          work_end: modelSchedule.work_end,     // - время конца работы в формате hh:mm
        });

        if (modelSchedule.id === undefined)
          return window.fetchRequest(hook, {
            method: 'POST',
            body,
            headers: {
              'Content-Type': 'application/json'
            }
          });

        hook += `${modelSchedule.id}/`;
        if (modelSchedule.delete)
          return window.fetchRequest(hook, { method: 'DELETE' });
        else
          return window.fetchRequest(hook, {
            method: 'PUT',
            body,
            headers: {
              'Content-Type': 'application/json'
            }
          });


      });

      Promise.all(reqs).then(responses => {

        for (let response of responses) {
          if (!response.ok)
            window.fetchError(response);
        }
        router.go(-1);
        // const results = responses.map(response => response.json());
        // Promise.all(results).then(results => {
        //   let modelSchedules = [];
        //   results.forEach(result => { modelSchedules.push(...result); });
        //   commit('setModelSchedules', modelSchedules);
        // });
      });
    },
  },
  modules: {
  }
});

export default store;

// console.log(store.state.count);
// console.log(store.state.a.count);
//
// store.commit('increment');
// console.log(store.state.count);
// console.log(store.state.a.count);
//
// store.registerModule('b', moduleA);
// store.commit('a/incrementBy', 5);
// store.dispatch('incrementBy', 5);
// console.log(store.state.count);
// console.log(store.state.a.count);
// console.log(store.state.b.count);
//
// console.log(store.getters['a/doubleCount']);
// console.log(store.getters['a/nCount'](4));

