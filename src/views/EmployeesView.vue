<template>
  <div class="employees">
    <h1>Cписок сотрудников</h1>
    <a
      class="employees__add"
      @click="employeeAdd()"
    >Добавить сотрудника</a>
    <ol class="employees__list">
      <li
        v-for="user in users"
        class="employees__item"
        title="Редактировать"
        :key="user.id"
        @click="employeeEdit(user)"
      >{{ `${user.surname} ${user.firstname} ${user.secondname}`}}</li>
    </ol>
  </div>
</template>

<script>

export default {
  name: 'Employees',
  data () {
    return {
    }
  },
  computed: {
    users() {
      return this.$store.state.users;
    }
  },
  methods: {
    employeeAdd() {
      this.$router.push({ name: 'EmployeeAdd' });
    },
    employeeEdit(user) {
      this.$router.push({
        name: 'EmployeeEdit',
        params: {
          userId: user.id,
        },
      });
    },
  },
}
</script>


<style>
.employees {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.employees__list {
  margin-top: 20px;
  min-width: 300px;
}
.employees__item {
  cursor: pointer;
  text-align: left;
  margin-bottom: 10px;
}
.employees__item:hover {
  color: #42b983;
}
.employees__add {
  cursor: pointer;
}
.employees__add:hover {
  color: #42b983;
}
</style>
