<template>
  <q-card class="q-pb-es q-pt-es q-ma-sm" bordered>

    <div class="q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="isEnabled = !isEnabled">
        configuration file editor
      </div>
    </div>

    <div v-if="isEnabled" class="q-mt-es">
      <div class="q-ma-sm row">
        <!-- <q-input class="q-ma-sm col" type="text" stack-label label="current json file on display" v-model='currentDisplayedJsonName' dense color="teal-7" ></q-input> -->
        <q-file class="q-ma-xs col text-caption" v-model="file" dense stack-label label="load file from disk" filled @input="loadTextFromFile">
          <q-icon name="upload" class="text-grey" style="font-size: 1rem;" />
        </q-file>
        <q-btn class="q-ma-xs q-pa-xs col" size="sm" dense color="teal-7" @click="gettingTheJSON">GET CURRENT CONFIG</q-btn>
         <q-input class="col q-ma-xs text-caption" type="text" stack-label label="save file to disk" v-model='currentDisplayedJsonName' dense color="teal-7">
          <q-icon name="save" class="text-grey" style="font-size: 1rem;" />
        </q-input>
        <q-btn class="q-ma-xs q-pa-xs col" size="sm" dense color="red-10" @click="savingTheJSON">SAVE CONFIG</q-btn>
        <q-btn class="q-ma-xs q-pa-xs col" size="sm" dense color="red-10" @click="useCurrentJSON">RUN CONFIG</q-btn>
      </div>
    </div>

    <div style="width: 100%">
          <div class="bg-white">
            <VJsoneditor v-model="jsonText"></VJsoneditor>
          </div>
    </div>
  </q-card>
</template>

<script>

import VJsoneditor from 'v-jsoneditor'

export default {
  components: {
    VJsoneditor
  },
  data () {
    return {
      newFileName: '',
      currentRunningJsonName: '',
      currentDisplayedJsonName: '',
      file: null,
      isEnabled: true,
      jsonText: {},
      json_filename: 'test',
      modelEventListener: null,
      container: null,
      options: {}
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'data':
          switch (message.data.target) {
            case 'json':
              this.file = ''
              this.currentDisplayedJsonName = message.data.data.name
              this.currentRunningJsonName = message.data.data.name
              this.jsonText = message.data.data
              break
            case 'datalogger_output':
              break
            case 'props':
              this.properties = message.data.data
              break
            case 'model_definition':
              this.model_definition = message.data.data
              break
          }
          break
      }
    })
    this.$model.getModelJSON()
  },
  methods: {
    gettingTheJSON () {
      this.$model.getModelJSON()
    },
    savingTheJSON () {
      this.downloadJSON()
    },
    loadingTheJSON () {
      this.loadTextFromFile()
    },
    useCurrentJSON () {
      this.currentRunningJsonName = this.jsonText.name
      this.$model.engine.postMessage({
        type: 'cmd',
        target: null,
        action: 'load',
        data: this.jsonText,
        return_tag: null
      })
      this.$model.getProperties(null)
    },
    downloadJSON () {
      this.file = ''
      this.jsonText.name = this.currentDisplayedJsonName
      const data = JSON.stringify(this.jsonText)
      const blob = new Blob([data], { type: 'text/json' })
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      if (this.currentDisplayedJsonName.includes('.json')) {
        a.download = this.currentDisplayedJsonName
      } else {
        a.download = this.currentDisplayedJsonName + '.json'
      }
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    loadTextFromFile () {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.jsonText = JSON.parse(e.target.result)
        this.currentDisplayedJsonName = this.jsonText.name
      }

      reader.readAsText(this.file)
    }
  }
}
</script>

<style>

</style>
