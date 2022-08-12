<template>
  <div class="employee">
    <h1>Редактирование сотрудника</h1>
    <div class="employee__wrap">
      <div class="workplaces">

        <header class="workplaces__header workplaces-header">
          <h2 class="workplaces__title">Рабочие места</h2>
          <div class="workplaces-header__wrap">
            <a
              class="workplaces-header__button"
              @click="addWorkplace"
            >Добавить</a>
            <a
              class="workplaces-header__link"
              @click="editWorkSchedule"
            >График работы</a>
          </div>
        </header>

        <div class="workplaces__wrap">
          <EmployeeWorkplace
            v-for="workplace in workplaces"
            :_workplace="workplace"
            :key="workplace.id || workplace.createdId + Date.now()"
            @modifiedWorkplace="modifiedWorkplace"
          ></EmployeeWorkplace>
        </div>

      </div>
      <form class="form" name="employeeEdit" enctype="multipart/form-data">

        <div>
          <label class="label-block" for="authorization_surname">Фамилия</label>
          <input
            id="authorization_surname"
            type="text"
            name="surname"
            v-model:value="user.surname"
          >
        </div>
        <div>
          <label class="label-block" for="authorization_firstname">Имя</label>
          <input
            id="authorization_firstname"
            type="text"
            name="firstname"
            v-model:value="user.firstname"
          >
        </div>
        <div>
          <label class="label-block" for="authorization_secondname">Отчество</label>
          <input
            id="authorization_secondname"
            type="text"
            name="secondname"
            v-model:value="user.secondname"
          >
        </div>

        <div>
          <input type="radio" id="male" value="MALE" v-model="user.gender">
          <label for="male">Мужчина</label>
          <input type="radio" id="female" value="FEMALE" v-model="user.gender">
          <label for="female">Женщина</label>
        </div>


        <input
          type="submit"
          class="employee__buttonSave"
          value="Сохранить"
          @click.prevent="saveEmployee(isNewUser ? 'POST' : 'PATCH')"
        >
        <input
          type="submit"
          class="employee__buttonRemove"
          value="Удалить"
          @click.prevent="deleteEmployee()"
        >
        <a
          class="employee__close"
          @click.prevent="$router.push('/')"
        >Отмена</a>
      </form>
    </div>
  </div>
</template>

<script>

import EmployeeWorkplace from "@/components/EmployeeWorkplace";
export default {
  name: 'EmployeeEdit',
  components: {
    EmployeeWorkplace,
  },
  props: {
    userId: {
      type: Number,
      default: undefined,
    },
  },
  data () {
    return {
      createdCount: 0,
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUserById(this.userId)
        || { surname: '', firstname: '', secondname: '', gender: 'MALE',};
    },
    workplaces() {
      return this.$store.state.workplaces || [];
    },

    hook() {
      let result = '/staff/';
      if (this.userId !== undefined)
        result += this.userId+'/';
      return result;
    },
    isNewUser() {
      return this.user.id === undefined;
    },
    workplacesModified() {
      return this.workplaces.filter(workplace => {
        return workplace.editStatus && workplace.editStatus !== ''
      });
    },
  },
  watch: {
    user(user) {
      if (user.id !== undefined)
        this.$store.dispatch('loadWorkplaces', this.userId);
    }
  },
  methods: {
    editWorkSchedule() {
      if (this.$router.currentRoute.name === 'EmployeeAdd') {
        alert('Для редактирования графика работы необходимо создать профиль');
        return;
      }
      this.$router.push({
        name: 'WorkSchedules',
        params: {
          userId: this.userId,
        },
      });
    },

    validateForm() {
      return this.user.surname !== ''
        && this.user.firstname !== ''
        && this.user.secondname !== ''
        && this.user.gender !== '';
    },
    async saveEmployee(method) {
      if (!this.validateForm()) {
        alert('Не все поля заполнены!');
        return;
      }
      var formData = new FormData(document.forms['employeeEdit']);
      formData.append('gender', this.user.gender);

      window.fetchRequest(this.hook, {
        method,
        body: formData
      }).then(response => {
        if (response.ok)
          return response.json();
        window.fetchError(response);
      }).then(result => {
        this.user.id = result.id;
        this.$store.dispatch('loadUsers');
        this.saveWorkplaces();
      });
    },
    async deleteEmployee() {
      window.fetchRequest(this.hook, {
        method: 'DELETE',
      }).then(response => {
        if (!response.ok)
          window.fetchError(response);
        else {
          this.$store.dispatch('loadUsers');
          this.$router.push('/');
        }
      });
    },

    saveWorkplaces() {
      // запросы на рабочие места
      let workplacesRequest = [];
      for (let workplaceModified of this.workplacesModified) {
        if (this.isCreatedWorkplace(workplaceModified)  // Если рабочее место новое
          && workplaceModified.editStatus === 'DELETED') {  // И его удаляют
          continue; // не нужно удалять не созданный запрос
        }
        if (!this.validateFormWorkplace(workplaceModified)) {
          alert('Рабочее место не будет сохранено, потому что не все поля заполнены!');
          continue;
        }
        workplacesRequest.push(this.createWorkplaceRequest(workplaceModified));
      }

      Promise.all(workplacesRequest).then(responses => {
        for (let response of responses)
          if (!response.ok)
            window.fetchError(response);

        this.$router.push('/');
      });
    },
    createWorkplaceRequest(workplace) {
      let method = 'POST';
      let hook = '/workplace/';

      if (!this.isCreatedWorkplace(workplace)) {
        if (workplace.editStatus === 'DELETED') {
          method = 'DELETE';
          hook += workplace.id+'/';
        }
        else if (workplace.editStatus === 'MODIFIED') {
          method = 'PUT';
          hook += workplace.id+'/';
        }
      }

      const body = JSON.stringify({
        doctor: this.user.id,
        filial: workplace.filial,
        speciality: workplace.speciality,
      });

      return window.fetchRequest(hook, {
        method,
        body,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    },

    isCreatedWorkplace(workplace) {
      return workplace.createdId !== undefined;
    },
    validateFormWorkplace(workplace) {
      return workplace.doctor !== null && workplace.filial !== null && workplace.speciality !== null;
    },

    addWorkplace() {
      this.workplaces.push({
        filial: null,
        speciality: null,
        editStatus: 'MODIFIED',
        createdId: this.createdCount++
      });
    },
    modifiedWorkplace({modifiedWorkplace, status}) {
      let workplace = [];
      if (this.isCreatedWorkplace(modifiedWorkplace))  // 'CREATED'
        workplace = this.workplaces.find(workplace => workplace.createdId == modifiedWorkplace.createdId);
      else  // MODIFIED / DELETE / ''
        workplace = this.workplaces.find(workplace => workplace.id === modifiedWorkplace.id);

      Object.assign(workplace, modifiedWorkplace);
      workplace.editStatus = status;
    },

  },
  created() {
    if (this.userId !== undefined)
      this.$store.dispatch('loadWorkplaces', this.userId);
  },
}
</script>


<style>
.employee {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.employee__wrap {
  display: flex;
  flex-direction: row;
  background-color: #2c3e50;
  border-radius: 4px;
  max-height: 450px;
  overflow: hidden;
}
.employee__close {
  color: #42b983;
}
.employee__buttonRemove {
  background-color: #fd2929 !important;
}

.workplaces {
  text-align: left;
  color: #42b983;
  width: 400px;
}
.workplaces__wrap {
  max-height: Calc(100% - 94px);
  height: 100%;
  overflow: auto;

  padding: 20px 20px 0 20px;
  border-radius: 0 4px 0 0;
  background-color: #495872;
}
.workplaces__wrap::-webkit-scrollbar {
  width: 12px;
}
.workplaces__wrap::-webkit-scrollbar-track {
  background: transparent;
}
.workplaces__wrap::-webkit-scrollbar-thumb {
  background-color: #2c3e50;
  border-radius: 8px;
  border: 2px solid #42b983;
}

.workplaces__title {
  margin: 0;
  padding: 16px;
  text-align: center;
}

.workplaces-header__wrap {
  display: flex;
  justify-content: center;
}
.workplaces-header__link,
.workplaces-header__button {
  text-align: center;
  flex-grow: 1;
  padding: 8px;
  background-color: #2c3e50;
}
.workplaces-header__link:hover,
.workplaces-header__button:hover {
  background-color: #495872;
}
.workplaces-header__link {
}
.workplaces-header__button {
}

</style>
