<template>
  <div class="authorization">
    <h1>Авторизация</h1>
    <form
      method="POST"
      @submit.prevent="authorize"
      class="form authorization__form"
    >
      <div class="authorization__input">
        <label class="label-block" for="authorization_username">Логин</label>
        <input
          id="authorization_username"
          type="text"
          name="username"
          placeholder="Введите логин"
          v-model:value="username"
        >
      </div>
      <div class="authorization__input">
        <label class="label-block" for="authorization_password">Пароль</label>
        <input
          id="authorization_password"
          type="password"
          name="password"
          placeholder="Введите пароль"
          v-model:value="password"
        >
      </div>
      <input
        type="submit"
        class="authorization__button"
        value="Авторизоваться"
      >
    </form>
  </div>
</template>

<script>

export default {
  name: 'Authorization',
  data () {
    return {
      username: 'Groznyi',
      password: 'WfS0K2Fk',
      hook: "/token_actor_user/",
    }
  },
  methods: {
    async authorize(event) {
      var formData = new FormData(event.target)

      window.fetchRequest(this.hook, {
        method: 'POST',
        body: formData,
      }).then(response => {
        if (response.ok)
          return response.json();
        window.fetchError(response);
      }).then(result => {
        this.saveActorToken(result.token);
        this.$router.push('/');
      })
    },
    saveActorToken(actorToken) {
      localStorage.actorToken = actorToken;
      localStorage.actorTokenTime = Date.now();
    },
  },
}
</script>

<style>
.authorization {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
