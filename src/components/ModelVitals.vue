<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        vitals
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="heartrate" filled dense square label="heartrate" style="width: 80px" />
          <q-input label-color="red-10" v-model="spo2Pre" filled dense square label="spo2 pre" style="width: 80px" />
          <q-input label-color="red-10" v-model="spo2Post" filled dense square label="spo2 post" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="abp" filled dense square label="abp" style="width: 80px" />
          <q-input label-color="red-10" v-model="pap" filled dense square label="pap" style="width: 80px" />
          <q-input label-color="red-10" v-model="cvp" filled dense square label="cvp" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="resprate" filled dense square label="resp rate" style="width: 80px" />
          <q-input label-color="red-10" v-model="etco2" filled dense square label="etco2" style="width: 80px" />
          <q-input label-color="red-10" v-model="temp" filled dense square label="temp" style="width: 80px" />
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
      heartrate: 145,
      spo2Pre: '98%',
      spo2Post: '95%',
      abp: '70/40',
      pap: '35/20',
      cvp: '7',
      resprate: 45,
      etco2: 40,
      temp: 36.7
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'mes':
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
    }
  }

}
</script>

<style>

</style>
