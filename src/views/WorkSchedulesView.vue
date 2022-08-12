<template>
  <div class="work-schedules">
    <h1>Рабочий график</h1>
    <div class="work-schedules__date">
      <input
        type="month"
        name="work-schedules__date"
        id="work-schedules__date"
        v-model:value="date"
      >
      <button
        class="work-schedules__save"
        @click="saveModelSchedules"
      >Сохранить</button>
    </div>
    <div class="work-schedules__wrap">
      <WorkSchedulesBlock
        v-for="workplace in workplaces"
        :key="workplace.id"
        :workplace="workplace"
        :dt="date"
        class="work-schedules__block"
      >
      </WorkSchedulesBlock>
    </div>
  </div>
</template>

<script>
import WorkSchedulesBlock from '@/components/WorkSchedulesBlock.vue'
export default {
  name: 'WorkSchedules',
  components: {
    WorkSchedulesBlock,
  },
  props: {
    userId: {
      type: Number,
      default: undefined,
    },
  },
  data () {
    return {
      date: '',
    }
  },
  computed: {
    workplaces() {
      return this.$store.state.workplaces || [];
    },
    modelSchedules() {
      return this.$store.state.modelSchedules || [];
    },
  },
  watch: {
    workplaces() {
      this.loadModelSchedules();
    },
    date() {
      this.loadModelSchedules();
    },
  },
  methods: {
    loadModelSchedules() {
      const dt = new Date(this.date).getDateFormat('MM-YYYY');
      const filialIds = this.workplaces.map(workplace => workplace.filial);
      if (filialIds.length > 0)
        this.$store.dispatch('loadModelSchedules', {
          dt,
          doctorId: this.workplaces[0].doctor,
          filialIds,
        });
    },
    saveModelSchedules() {
      this.$store.dispatch('saveModelSchedules');
    }
  },
  created() {
    this.date = new Date().getDateFormat('YYYY-MM');

    if (this.userId !== undefined) {
      this.$store.dispatch('loadWorkplaces', this.userId);
    }
  },
}
</script>

<style>
.work-schedules {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.work-schedules__wrap {
}
.work-schedules__block {
  margin-bottom: 20px;
}
.work-schedules__date {
  margin-bottom: 20px;
}
.work-schedules__save {
  background-color: #42b983;
  color: #2c3e50;
  margin-left: 8px;
}
</style>
