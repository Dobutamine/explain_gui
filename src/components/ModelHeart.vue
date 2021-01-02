<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        heart
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
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
export default {
  data () {
    return {
      isEnabled: false,
      modelEventListener: null,
      lvVol: '10/2',
      lvPres: '70/6',
      lvStroke: 5,
      rvVol: '10/2',
      rvPres: '70/6',
      rvStroke: 5
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
