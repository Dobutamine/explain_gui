<template>
  <q-card class="q-pb-es q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        ventilation
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="row">
          <q-input class="col" label-color="red-10" v-model="ventFreq" filled dense square label="vent rate" />
          <q-input class="col" label-color="red-10" v-model="tidalVolume" filled dense square label="tidal vol" />
          <q-input class="col" label-color="red-10" v-model="minuteVolume" filled dense square label="minute vol" />
      </div>
      <div class="row">
          <q-input class="col" label-color="red-10" v-model="maxPIP" filled dense square label="peak pres" />
          <q-input class="col" label-color="red-10" v-model="PEEP" filled dense square label="peep" />
          <q-input class="col" label-color="red-10" value="" filled dense square label="" />
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
      ventFreq: 30,
      tidalVolume: 10,
      minuteVolume: 200,
      maxPIP: 10,
      PEEP: 4

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
