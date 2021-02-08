<template>
  <div>
      <label class="q-pa-sm"> Model clock at: {{ modelClock }}</label>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelEventListener: null,
      modelClock: 0,
      modelStepsize: 0.0005
    }
  },
  methods: {},
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.modelClock = message.data.data[message.data.data.length - 1].time
              break
            default:
              break
          }
          break
      }
    })
  },
  beforeDestroy () {}

}
</script>

<style>

</style>
