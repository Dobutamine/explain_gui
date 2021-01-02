<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
      model controller
      </div>
   </div>
    <div v-if="isEnabled" class="q-gutter-lg row gutter q-mt-es q-mb-sm">
        <q-btn v-on:click="calculateModel" dense :color="color" class="q-pl-sm q-pr-sm" style="width: 150px">{{ caption }}</q-btn>
        <q-input v-model.number="timeToCalculate" type="number" label="for seconds" filled dense style="width: 85px" class="q-ml-xs"/>
         <q-btn v-on:click="startModel" dense :color="colorRT" class="q-pl-sm q-pr-sm" style="width: 75px">{{ captionGOTO }}</q-btn>
         <q-input v-model.number="gotoTarget" type="number" label="to seconds" filled dense style="width: 85px" class="q-ml-xs"/>
         <q-btn v-on:click="startModel" dense :color="colorRT" class="q-pl-sm q-pr-sm" style="width: 150px">{{ captionRT }}</q-btn>
    </div>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      timeToCalculate: 10,
      caption: 'CALCULATE',
      color: 'secondary',
      captionRT: 'REALTIME',
      colorRT: 'secondary',
      rtRunning: false,
      captionGOTO: 'GOTO',
      colorGOTO: 'secondary',
      gotoTarget: 60
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      if (this.isEnabled) {
        switch (message.data.type) {
          case 'data':
            switch (message.data.target) {
              case 'datalogger_output':
                this.caption = 'CALCULATE'
                this.color = 'secondary'
                this.rtRunning = false
                this.captionRT = 'REALTIME'
                this.colorRT = 'secondary'
                this.captionGOTO = 'GOTO'
                this.colorGOTO = 'secondary'
                break
              default:
                break
            }
            break
        }
      }
    })
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    startModel () {
      if (this.rtRunning) {
        this.rtRunning = false
        this.$model.stopModel()
        this.captionRT = 'REALTIME'
        this.colorRT = 'secondary'
      } else {
        this.rtRunning = true
        this.$model.startModel()
        this.captionRT = 'REALTIME'
        this.colorRT = 'negative'
      }
    },

    calculateModel () {
      this.$model.calculateModel(this.timeToCalculate)
      this.caption = 'CALCULATING'
      this.color = 'negative'
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
