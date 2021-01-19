<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <FileReader></FileReader>
          <Controller></Controller>
          <ScriptEditor></ScriptEditor>
          <ModelLog></ModelLog>
        </div>
        <div class="col text-center">
           <q-scroll-area style="height: 850px; max-width: 3000px;">
             <ModelDiagram></ModelDiagram>
            <LightningChart></LightningChart>
          </q-scroll-area>
        </div>
        <div class="col-2 text-center">
        </div>
    </div>
  </q-page>
</template>

<script>

import LightningChart from 'components/LightningChart'
import Controller from 'components/Controller'
import ScriptEditor from 'components/ScriptEditor'
import ModelLog from 'components/ModelLog'
import FileReader from 'components/FileReader'
import ModelDiagram from 'components/ModelDiagram'

export default {
  name: 'PageIndex',
  components: {
    LightningChart,
    Controller,
    ScriptEditor,
    ModelLog,
    FileReader,
    ModelDiagram
  },
  data () {
    return {
    }
  },
  mounted () {
    // attach an event handler to the model instance
  },
  beforeDestroy () {
    // remove the event handler from memory
    delete this.modelEventListener
  },
  methods: {

  }
}
</script>
