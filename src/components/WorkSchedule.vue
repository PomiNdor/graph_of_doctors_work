<template>
  <div :class="['work-schedule', {'delete': isDelete}]">
    <input
      type="date"
      name="date"
      id="date"
      v-model:value="modelSchedule.dt"
      :min="dateMin"
      :max="dateMax"
    >
    <input
      type="time"
      name="work_start"
      id="work_start"
      v-model:value="modelSchedule.work_start"
    >
    <input
      type="time"
      name="work_end"
      id="work_end"
      v-model:value="modelSchedule.work_end"
    >
    <button
      class="work-schedule__button-delete"
      @click.prevent="deleteModelSchedule"
    >
      <img src="../assets/trash-can.png" alt="">
    </button>
  </div>
</template>

<script>

export default {
  name: 'WorkSchedule',
  props: {
    modelScheduleId: Number,
  },
  data () {
    return {
      isDelete: false,
    }
  },
  computed: {
    modelSchedule() {
      return this.$store.getters.getModelScheduleById(this.modelScheduleId);
    },
    // day() {
    //   return new Date(this.modelSchedule.dt).getDateFormat('DD');
    // },
    dateMin() {
      const date = new Date(this.modelSchedule.dt);
      return new Date(date.getFullYear(), date.getMonth(), 1)
        .getDateFormat('YYYY-MM-DD');
    },
    dateMax() {
      const date = new Date(this.modelSchedule.dt);
      return new Date(date.getFullYear(), date.getMonth() + 1, 0)
        .getDateFormat('YYYY-MM-DD');
    },
  },
  methods: {
    deleteModelSchedule() {
      this.modelSchedule.delete = !this.modelSchedule.delete || false;
      this.isDelete = this.modelSchedule.delete;
    },
  },
}
</script>

<style>
.work-schedule {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  padding: 5px;
}
.work-schedule.delete {
  opacity: .5;
}
.work-schedule input {
  padding: 2px;
}
.work-schedule__button-delete {
  height: 26px;
  padding: 4px;
  background-color: #fd2929;
  border-radius: 2px;
}
</style>
