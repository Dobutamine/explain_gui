<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        mechanical ventilator
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <q-toggle v-model="ventilatorState" @input="switchVentilator"></q-toggle>
    </div>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      ventilatorState: false,
      modelEventListener: null
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
    },
    switchVentilator () {
      this.$model.setProperty('ventilator', 'is_enabled', this.ventilatorState, 0, 0, 'abs')
      this.$model.setProperty('breathing', 'is_enabled', !this.ventilatorState, 0, 0, 'abs')
      console.log('switch')
    }
  }

}
</script>

<style>

</style>
