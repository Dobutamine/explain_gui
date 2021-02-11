<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        controller
      </div>
   </div>
    <div v-if="isEnabled" class="row q-ml-md q-mr-md q-mb-md q-mt-es">
        <q-btn v-on:click="startModel" dense :color="colorRT" class="q-mt-sm q-mr-sm col" style="width: 40px">
           <q-icon name="play_arrow" class="text-white" style="font-size: 1rem;" />
        </q-btn>
        <q-btn v-on:click="fastForwardModel" dense :color="colorGOTO" class="q-mt-sm q-mr-sm col" style="width: 40px">
           <q-icon name="fast_forward" class="text-white" style="font-size: 1rem;" />
        </q-btn>
        <q-btn v-on:click="calculateModel" dense :color="color" class="q-mt-sm q-mr-sm col" style="width: 40px">
           <q-icon name="calculate" class="text-white" style="font-size: 1rem;" />
        </q-btn>
        <q-input v-model.number="timeToCalculate" type="number" label="for sec." filled dense style="width: 70px" class="q-mt-sm q-mr-sm col-2"/>
    </div>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      timeToCalculate: 10,
      watchedModelsDiagram: [],
      watchedModelsChart: [],
      caption: 'CALCULATE',
      color: 'teal-10',
      captionRT: 'REALTIME',
      colorRT: 'teal-10',
      rtRunning: false,
      captionGOTO: 'FORWARD',
      colorGOTO: 'teal-10',
      gotoTarget: 60
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      if (this.isEnabled) {
        switch (message.data.type) {
          case 'mes':
            if (message.data.data[0] === 'ready') {
              this.caption = 'CALCULATE'
              this.color = 'teal-10'
              this.rtRunning = false
              this.captionRT = 'REALTIME'
              this.colorRT = 'teal-10'
              this.captionGOTO = 'FORWARD'
              this.colorGOTO = 'teal-10'
            }
            break
        }
      }
    })
    this.$root.$on('rt_watch_diagram', (e) => { this.updateWatchedModelsDiagram(e) })
    this.$root.$on('rt_watch_chart', (e) => { this.updateWatchedModelsChart(e) })
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    updateWatchedModelsDiagram (modelsToWatch) {
      this.watchedModelsDiagram = modelsToWatch
      this.updateModelsToWatchRT()
    },
    updateWatchedModelsChart (modelsToWatch) {
      this.watchedModelsChart = modelsToWatch
      this.updateModelsToWatchRT()
    },
    updateModelsToWatchRT () {
      const rtModels = this.watchedModelsChart.concat(this.watchedModelsDiagram)
      this.$model.setDataloggerWatchedModelsRT(rtModels)
      this.$model.setDataloggerWatchedModels(rtModels)
    },
    startModel () {
      if (this.rtRunning) {
        this.rtRunning = false
        this.$model.stopModel()
        this.captionRT = 'REALTIME'
        this.colorRT = 'teal-10'
        this.$root.$emit('rt_off')
      } else {
        this.rtRunning = true
        this.$model.startModel()
        this.captionRT = 'REALTIME'
        this.colorRT = 'negative'
        this.$root.$emit('rt_on')
      }
    },
    calculateModel () {
      this.$model.calculateModel(this.timeToCalculate)
      this.caption = 'CALCULATING'
      this.color = 'negative'
    },
    fastForwardModel () {
      this.$model.fastForwardModel(this.timeToCalculate)
      this.captionGOTO = 'WAIT'
      this.colorGOTO = 'negative'
    }
  }

}
</script>

<style>
.gutter {
  display: flex;
        width: 100%;
        justify-content: center;
}
</style>
