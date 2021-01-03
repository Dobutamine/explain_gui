<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        heart
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="laVol" filled dense square label="LA vol" style="width: 80px" />
          <q-input label-color="red-10" v-model="laPres" filled dense square label="LA pres" style="width: 80px" />
          <q-input label-color="red-10" value='' filled dense square label="" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="raVol" filled dense square label="RA vol" style="width: 80px" />
          <q-input label-color="red-10" v-model="raPres" filled dense square label="RA pres" style="width: 80px" />
          <q-input label-color="red-10" value='' filled dense square label="" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="lvVol" filled dense square label="LV vol" style="width: 80px" />
          <q-input label-color="red-10" v-model="lvPres" filled dense square label="LV pres" style="width: 80px" />
          <q-input label-color="red-10" v-model="lvStroke" filled dense square label="LV stroke" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="rvVol" filled dense square label="RV vol" style="width: 80px" />
          <q-input label-color="red-10" v-model="rvPres" filled dense square label="RV pres" style="width: 80px" />
          <q-input label-color="red-10" v-model="rvStroke" filled dense square label="RV stroke" style="width: 80px" />
      </div>
    </div>
  </q-card>
</template>

<script>

import * as Stat from 'simple-statistics'

export default {
  data () {
    return {
      isEnabled: false,
      modelEventListener: null,
      laVol: '10/2',
      laPres: '70/6',
      laStroke: 5,
      lvVol: '10/2',
      lvPres: '70/6',
      lvStroke: 5,
      rvVol: '10/2',
      rvPres: '70/6',
      rvStroke: 5,
      raVol: '10/2',
      raPres: '70/6',
      raStroke: 5,
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
      const laArrayVol = []
      const laArrayPres = []
      const raArrayVol = []
      const raArrayPres = []
      const lvArrayVol = []
      const lvArrayPres = []
      const rvArrayVol = []
      const rvArrayPres = []

      data.forEach(element => {
        if (typeof element.LAV !== 'number') {
          laArrayVol.push(parseFloat(element.LAV))
          lvArrayVol.push(parseFloat(element.LVV))
          raArrayVol.push(parseFloat(element.RAV))
          rvArrayVol.push(parseFloat(element.RVV))

          laArrayPres.push(parseFloat(element.LAP))
          lvArrayPres.push(parseFloat(element.LVP))
          raArrayPres.push(parseFloat(element.RAP))
          rvArrayPres.push(parseFloat(element.RVP))
        }
      })

      const lvVolMax = Stat.max(lvArrayVol) * 1000
      const lvVolMin = Stat.min(lvArrayVol) * 1000
      this.lvStroke = (lvVolMax - lvVolMin).toFixed(1)

      const rvVolMax = Stat.max(rvArrayVol) * 1000
      const rvVolMin = Stat.min(rvArrayVol) * 1000
      this.rvStroke = (rvVolMax - rvVolMin).toFixed(1)

      this.laVol = (Stat.max(laArrayVol) * 1000).toFixed(1) + '/' + (Stat.min(laArrayVol) * 1000).toFixed(1)
      this.lvVol = lvVolMax.toFixed(1) + '/' + lvVolMin.toFixed(1)
      this.raVol = (Stat.max(raArrayVol) * 1000).toFixed(1) + '/' + (Stat.min(raArrayVol) * 1000).toFixed(1)
      this.rvVol = rvVolMax.toFixed(1) + '/' + rvVolMin.toFixed(1)

      this.laPres = (Stat.max(laArrayPres)).toFixed(1) + '/' + (Stat.min(laArrayPres)).toFixed(1)
      this.lvPres = (Stat.max(lvArrayPres)).toFixed(1) + '/' + (Stat.min(lvArrayPres)).toFixed(1)
      this.raPres = (Stat.max(raArrayPres)).toFixed(1) + '/' + (Stat.min(raArrayPres)).toFixed(1)
      this.rvPres = (Stat.max(rvArrayPres)).toFixed(1) + '/' + (Stat.min(rvArrayPres)).toFixed(1)
    }
  }

}
</script>

<style>

</style>
