<template>
  <q-card class="q-pb-es q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        vitals
      </div>
    </div>

    <div v-if="isEnabled" class="row q-mt-es">
      <div class="row">
          <q-input class="col" label-color="red-10" v-model="heartrate" filled dense square label="heartrate" />
          <q-input class="col" label-color="red-10" v-model="spo2Pre" filled dense square label="spo2 pre"  />
          <q-input class="col" label-color="red-10" v-model="spo2Post" filled dense square label="spo2 post" />
      </div>
      <div class="row">
          <q-input class="col" label-color="red-10" v-model="abp" filled dense square label="abp" />
          <q-input class="col" label-color="red-10" v-model="pap" filled dense square label="pap"  />
          <q-input class="col" label-color="red-10" v-model="cvp" filled dense square label="cvp"  />
      </div>
      <div class="row ">
          <q-input class="col" label-color="red-10" v-model="resprate" filled dense square label="resp rate"/>
          <q-input class="col" label-color="red-10" v-model="etco2" filled dense square label="etco2" />
          <q-input class="col" label-color="red-10" v-model="temp" filled dense square label="temp"/>
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
      heartrate: 145,
      spo2Pre: '98%',
      spo2Post: '95%',
      abp: '70/40',
      pap: '35/20',
      cvp: '7',
      resprate: 45,
      etco2: 40,
      temp: 36.7,
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
      const abpArray = []
      const papArray = []
      const cvpArray = []

      this.heartrate = data[data.length - 1].heartrate
      this.spo2Pre = data[data.length - 1].spo2Pre * 100
      this.spo2Post = data[data.length - 1].spo2Post * 100
      this.resprate = data[data.length - 1].resprate
      this.etco2 = data[data.length - 1].etco2
      this.temp = data[data.length - 1].temp
      data.forEach(element => {
        if (typeof element.abp !== 'number') {
          abpArray.push(element.abp)
          papArray.push(element.pap)
          cvpArray.push(element.cvp)
        }
      })

      this.abp = parseFloat(Stat.max(abpArray)).toFixed(0) + '/' + parseFloat(Stat.min(abpArray)).toFixed(0)
      this.pap = parseFloat(Stat.max(papArray)).toFixed(0) + '/' + parseFloat(Stat.min(papArray)).toFixed(0)
      this.cvp = parseFloat(Stat.max(cvpArray)).toFixed(0) + '/' + parseFloat(Stat.min(cvpArray)).toFixed(0)
    }
  }

}
</script>

<style>

</style>
