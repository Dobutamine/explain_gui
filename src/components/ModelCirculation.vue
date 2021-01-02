<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        circulation
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="q-gutter-es row gutter">
          <q-input label-color="red-10" v-model="lvo" filled dense square label="lvo" style="width: 80px" />
          <q-input label-color="red-10" v-model="rvo" filled dense square label="rvo" style="width: 80px" />
          <q-input label-color="red-10" v-model="ivc" filled dense square label="ivc" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
         <q-input label-color="red-10" v-model="svc" filled dense square label="svc" style="width: 80px" />
          <q-input label-color="red-10" v-model="pda" filled dense square label="pda" style="width: 80px" />
          <q-input label-color="red-10" v-model="ofo" filled dense square label="ofo" style="width: 80px" />
      </div>
      <div class="q-gutter-es row gutter">
         <q-input label-color="red-10" v-model="vsd" filled dense square label="vsd" style="width: 80px" />
          <q-input label-color="red-10" v-model="kid" filled dense square label="kidneys" style="width: 80px" />
          <q-input label-color="red-10" v-model="liver" filled dense square label="liver" style="width: 80px" />
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
      lvo: 250.53,
      rvo: 250,
      svc: 125,
      ivc: 125,
      pda: 0,
      ofo: 0,
      vsd: 0,
      myo: 50,
      kid: 95,
      liver: 95,
      brain: 110
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
