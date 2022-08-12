<template>
  <div :class="['workplace', {'deleted': isDelete}]">
    <button
      class="workplace__button-delete"
      @click.prevent="modifiedWorkplace('DELETED')"
    >
      <img src="../assets/trash-can.png" alt="">
    </button>
    <div class="workplace__item">
      <span>Филиал</span>
      <select
        v-model="workplace.filial"
        @change="modifiedWorkplace('MODIFIED')"
      >
        <option disabled value="null">Выберите один из вариантов</option>
        <option
          v-for="building in buildings"
          :key="building.id"
          :value="building.id"
        >{{ building.name }}</option>
      </select>
    </div>
    <div class="workplace__item">
      <span>Специальность</span>
      <select
        v-model="workplace.speciality"
        @change="modifiedWorkplace('MODIFIED')"
      >
        <option disabled value="null">Выберите один из вариантов</option>
        <option
          v-for="speciality in specialities"
          :key="speciality.id"
          :value="speciality.id"
        >{{ speciality.name }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Employees',
  props: {
    _workplace: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      workplace: {
        id: null,
        filial: null,
        speciality: null,
      },
      status: '',
    }
  },
  computed: {
    buildings() {
      return this.$store.state.buildings;
    },
    specialities() {
      return this.$store.state.specialities;
    },
    isDelete() {
      return this.status === 'DELETED';
    },
  },
  watch: {
    status() {
      // console.log(this.isDelete);
    }
  },
  methods: {
    modifiedWorkplace(status) {
      if (this.isDelete)
        status = 'MODIFIED';

      this.status = status;
      this.$emit('modifiedWorkplace', {
        modifiedWorkplace: this.workplace,
        status,
      });
    },
  },
  created() {
    if (this._workplace)
      this.workplace = { ...this._workplace };
  },
}
</script>


<style>
.workplace {
  position: relative;
  background-color: #2c3e50;
  padding: 10px 18px 8px 18px;
  border-radius: 4px;
  margin-bottom: 20px;
  overflow: hidden;
}
.workplace.deleted {
  opacity: 0.5;
}
.workplace__button-delete {
  position: absolute;
  top: 0; right: 0;
  height: 24px;
  padding: 4px;
  background-color: #fd2929;
  border-radius: 0 0 0 4px;
}
.workplace__item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  border-radius: 4px;
}
.workplace__item span {
  padding: 6px 12px;
}
.workplace__item select {
  padding: 4px 6px;
}
</style>
