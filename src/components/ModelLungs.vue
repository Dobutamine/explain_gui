<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        lungs
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="llVol" filled dense square label="LL vol" style="width: 80px" />
          <q-input label-color="red-10" v-model="llPres" filled dense square label="LL pres" style="width: 80px" />
          <q-input label-color="red-10" v-model="llTidal" filled dense square label="LL tidal" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="rlVol" filled dense square label="RL vol" style="width: 80px" />
          <q-input label-color="red-10" v-model="rlPres" filled dense square label="RL pres" style="width: 80px" />
          <q-input label-color="red-10" v-model="rlTidal" filled dense square label="RL tidal" style="width: 80px" />
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
      llVol: '80/40',
      llPres: '770/70',
      llTidal: 40,
      rlVol: '80/40',
      rlPres: '770/70',
      rlTidal: 40
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
