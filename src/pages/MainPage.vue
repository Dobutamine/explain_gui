<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <FileReader></FileReader>
          <Controller></Controller>
          <ModelProps></ModelProps>
          <ScriptEditor></ScriptEditor>
          <ModelLog></ModelLog>
        </div>
        <div class="col text-center">
           <q-scroll-area style="height: 2000px; max-width: 3000px;">
             <LightningChart></LightningChart>
             <ModelDiagram></ModelDiagram>
          </q-scroll-area>
        </div>
        <div class="col-2 text-center">
          <DiagramBuilder></DiagramBuilder>
        </div>
    </div>
  </q-page>
</template>

<script>

import LightningChart from 'components/LightningChart'
import Controller from 'components/Controller'
import ModelLog from 'components/ModelLog'
import FileReader from 'components/FileReader'
import ModelDiagram from 'components/ModelDiagram'
import ScriptEditor from 'components/ScriptEditor'
import DiagramBuilder from 'components/DiagramBuilder'
import ModelProps from 'components/ModelProps'

export default {
  name: 'PageIndex',
  components: {
    LightningChart,
    Controller,
    ModelLog,
    FileReader,
    ModelDiagram,
    DiagramBuilder,
    ScriptEditor,
    ModelProps
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
