<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm">
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
      model loader
     </div>
   </div>
    <div v-if="isEnabled" class="q-pa-md">
    <q-file
      v-model="file"
      dense
      label="load model from disk"
      filled
      style="max-width: 300px"
      @input="loadTextFromFile"
    >
      <q-icon name="save" class="text-grey" style="font-size: 1rem;" />
    </q-file>
  </div>
</q-card>
</template>

<script>
export default {
  data () {
    return {
      file: null,
      isEnabled: false
    }
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    loadTextFromFile () {
      const reader = new FileReader()

      reader.onload = (e) => {
        const definition = JSON.parse(e.target.result)
        this.$model.engine.postMessage({
          type: 'cmd',
          target: null,
          action: 'load',
          data: definition,
          return_tag: null
        })
        this.$model.getProperties(null)
      }
      reader.readAsText(this.file)
    }
  }
}
</script>
