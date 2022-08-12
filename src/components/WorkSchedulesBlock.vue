<template>
  <div class="work-schedules-block">
    <header class="work-schedules-block__header">
      <div class="work-schedules-block__info">
        <div><span class="fw-bold">Место:</span> {{filialName}}</div>
        <div><span class="fw-bold">Специальность:</span> {{spetialityName}}</div>
      </div>
      <a
        :class="['work-schedules-block__button-show', {'active': show}]"
        @click.prevent="show = !show"
      ><span>></span></a>
    </header>
    <template v-if="show">
      <div class="work-schedules-block__items">
        <WorkSchedule
          v-for="modelSchedule in modelSchedules"
          :modelScheduleId="modelSchedule.id"
          :key="modelSchedule.id || modelSchedule.createdId"
        ></WorkSchedule>
      </div>
      <button
        class="work-schedules-block__button-add"
        @click="addModelSchedule"
      >
        Добавить
      </button>
    </template>
  </div>
</template>

<script>
import WorkSchedule from "@/components/WorkSchedule";
export default {
  name: 'WorkSchedulesBlock',
  components: {
    WorkSchedule,
    dt: String,
  },
  props: {
    workplace: Object,
  },
  data () {
    return {
      show: false,
      countCreatedModelSchedules: 0,
    }
  },
  computed: {
    filialName() {
      return this.$store.getters.getBuildingName(this.workplace.filial);
    },
    spetialityName() {
      return this.$store.getters.getSpetialityName(this.workplace.speciality);
    },
    modelSchedules() {
      return this.$store.getters.getModelSchedulesByWorkplaceId(this.workplace.id);
    },
  },
  methods: {
    addModelSchedule() {
      const modelSchedule = {
        createdId: Date.now() + this.countCreatedModelSchedules++,
        dt: this.dt,
        workplace: this.workplace.id,
        work_start: '08:00',
        work_end: '15:00',
      };
      // this.$store.commit('addModelSchedule', modelSchedule);
    }
  },
}
</script>

<style>
.work-schedules-block {
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #495872;
  color: #42b983;
  border-radius: 4px;
  overflow: hidden;
  user-select: none;
}
.work-schedules-block__header {
  display: flex;
  width: 100%;
  background-color: #2c3e50;
}
.work-schedules-block__info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  gap: 6px;
  padding: 16px 20px;
  text-align: left;
}
.work-schedules-block__button-show {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
}
.work-schedules-block__button-show:hover {
  background-color: #495872;
}
.work-schedules-block__button-show span {
  transform: rotateZ(90deg);
}
.work-schedules-block__button-show.active span {
  transform: rotateZ(-90deg);
}
.work-schedules-block__items {
  padding: 6px 8px;
}
.work-schedules-block__button-add {
  width: 100%;
}
</style>
