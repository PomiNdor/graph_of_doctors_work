<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  computed: {
    authorized() {
      return localStorage.actorToken
        && Date.now() - localStorage.actorTokenTime < 60 * 60 * 1000;
    }
  },
  created() {
    if (this.$router.currentRoute.path !== '/login') {
      if (this.authorized) {
        this.$store.dispatch('loadBuildings');
        this.$store.dispatch('loadSpecialities');
        this.$store.dispatch('loadUsers');
      }
      else this.$router.push('/login');
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   console.log('bbbb');
  //   if (to.path !== '/login') {
  //     this.$store.dispatch('loadBuildings');
  //     this.$store.dispatch('loadSpecialities');
  //     this.$store.dispatch('loadUsers');
  //   }
  //   next();
  // }
}
</script>

<style>
* {
  box-sizing: border-box;
}
a {
  cursor: pointer;
}
button {
  border: none;
  cursor: pointer;
}
img {
  max-width: 100%;
  max-height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 20px 20px 20px;

  background-color: #2c3e50;
  border-radius: 4px;
}
input, select {
  padding: 8px 16px;
}
label {
  text-align: left;
  color: #42b983;
  font-weight: 600;
}
input[type="submit"], button {
  background-color: #42b983;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  font-size: 1rem;
}
label {
  color: #42b983;
  font-weight: 600;
}
.label-block {
  display: block;
  margin-bottom: 6px;
  margin-left: 12px;
  text-align: left;
}
.fw-bold {
  font-weight: bold;
}
</style>
