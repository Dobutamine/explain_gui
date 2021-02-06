<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        lungs
      </div>
    </div>
    <div v-if="isEnabled" class="row q-ml-md q-mr-md q-mb-md q-mt-es">
      <q-badge color="teal-7">
        PVR {{ value }}x
      </q-badge>
      <q-slider v-model="standard" @change="translateSlider" :min="-50" :max="50" color="teal-7"/>
    </div>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: false,
      modelEventListener: null,
      properties: null,
      standard: 0,
      value: 0
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      if (this.isEnabled) {
        switch (message.data.type) {
          case 'data':
            switch (message.data.target) {
              case 'props':
                this.properties = message.data.data
                console.log(this.properties)
                break
              default:
                break
            }
            break
        }
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
    translateSlider () {
      this.value = this.standard * 100
    },
    testMe () {
      this.$model.setPropertyDirect('LV_AA', 'is_enabled', false)
    }
  }

}
</script>

<style>

</style>
