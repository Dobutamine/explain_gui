<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        model log
      </div>
   </div>
  <div v-if="isEnabled" class="row q-mt-es">
      <q-virtual-scroll
      clas="col"
        style="max-height: 500px;"
        :items="log"
        >
      <template v-slot="{ item, index }">
      <q-item
        :key="index"
        dense
      >
        <q-item-section class="q-ma-es bg-grey-9">
          <q-item-label class="text-overline bg-grey-9" style="width: 100%" >
            {{ item.message }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-virtual-scroll>
  </div>
  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      modelEventListener: null,
      log: [],
      prevMessage: ''
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'mes':
          if (message.data.data[0] !== 'ready') {
            console.log('log updated')
            this.updateLog({ message: message.data.data[0] })
          }
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
    updateLog (message) {
      if (message.message !== this.prevMessage.message) {
        this.log.unshift(message)
        if (this.log.length > 100) {
          this.log.pop()
        }
        this.prevMessage = message
      }
    }
  }

}
</script>

<style>

</style>
