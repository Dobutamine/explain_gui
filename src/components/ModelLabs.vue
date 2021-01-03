<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        labs
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="ph" filled dense square label="pH" style="width: 80px" />
          <q-input label-color="red-10" v-model="po2" filled dense square label="pO2" style="width: 80px" />
          <q-input label-color="red-10" v-model="pco2" filled dense square label="pCO2" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="hco3" filled dense square label="HCO3" style="width: 80px" />
          <q-input label-color="red-10" v-model="be" filled dense square label="BE" style="width: 80px" />
          <q-input label-color="red-10" v-model="lactate" filled dense square label="lactate" style="width: 80px" />
      </div>

    </div>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: false,
      modelEventListener: null,
      ph: 7.40,
      pco2: 45,
      po2: 70,
      hco3: 25.5,
      be: -4,
      lactate: '-',
      interval: 2.0,
      intervalCounter: 0,
      rtDataStore: [],
      prevTime: 0
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.processData(message.data.data)
              break
          }
          break
        case 'rt':
          if (this.isEnabled) {
            this.storeRTData(message.data.data)
          }
          break
      }
    })
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    storeRTData (data) {
      if ((data[0].time - this.prevTime) > this.interval) {
        this.prevTime = data[0].time
        this.processData(this.rtDataStore)
        this.rtDataStore = []
      } else {
        this.rtDataStore.push(data[0])
      }
    },
    processData (data) {
      this.ph = data[data.length - 1].ph
      this.pco2 = data[data.length - 1].pco2
      this.po2 = data[data.length - 1].po2
      this.hco3 = data[data.length - 1].hco3
      this.be = data[data.length - 1].be
      this.lactate = '-'
    }
  }

}
</script>

<style>

</style>
