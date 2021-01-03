<template>
  <q-card class="q-pb-es q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        circulation
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="row">
          <q-input class="col" label-color="red-10" v-model="lvo" filled dense square label="lvo" />
          <q-input class="col" label-color="red-10" v-model="rvo" filled dense square label="rvo" />
          <q-input class="col" label-color="red-10" v-model="ivc" filled dense square label="ivc" />
      </div>
      <div class="row">
         <q-input class="col" label-color="red-10" v-model="svc" filled dense square label="svc" />
          <q-input class="col" label-color="red-10" v-model="pda" filled dense square label="pda" />
          <q-input class="col" label-color="red-10" v-model="ofo" filled dense square label="ofo" />
      </div>
      <div class="row">
         <q-input class="col" label-color="red-10" v-model="vsd" filled dense square label="vsd" />
          <q-input class="col" label-color="red-10" v-model="kid" filled dense square label="kidneys" />
          <q-input class="col" label-color="red-10" v-model="liver" filled dense square label="liver" />
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
