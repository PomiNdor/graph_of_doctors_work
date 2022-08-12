// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const baseURL = 'https://medsystem-test04.medlock.ru';
window.fetchRequest = function(hook, init = {}) {
  let options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer a59JS3xzpTwCYtwHmcDsC4pgb2KRFm',
      ActorToken: localStorage.getItem('actorToken') || '',
    },
  };

  for (let key in init) {
    if (key === 'headers') {
      options[key] = { ...options[key], ...init[key] };
      continue;
    }
    options[key] = init[key];
  }
  const url = baseURL + hook;
  return fetch(url, options);
};

window.fetchError = function(response) {
  new Promise(async function(resolve, reject) {
    let result = await response.json();
    reject(result.error);
  }).catch(error => {
    alert(error);
  });
};

Date.prototype.getDateFormat = function(format) {
  let result = format
    .replace('DD', (this.getDate()+'').padStart(2, '0'))
    .replace('MM', (this.getMonth()+1+'').padStart(2, '0'))
    .replace('YYYY', this.getFullYear());
  return result;
}



new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

