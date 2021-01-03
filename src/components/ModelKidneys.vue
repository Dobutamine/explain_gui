<template>
  <q-card class="q-pb-es q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        kidneys
      </div>
    </div>
    <div v-if="isEnabled" class="row q-mt-es">
      <div class="row">
          <q-input class="col" label-color="red-10" v-model="kidneyFlow" filled dense square label="flow" />
          <q-input class="col" label-color="red-10" v-model="filtrationRate" filled dense square label="filtration" />
          <q-input class="col" label-color="red-10" v-model="urineProduction" filled dense square label="urine output" />
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
      kidneyFlow: 7.40,
      filtrationRate: 45,
      urineProduction: 70
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
