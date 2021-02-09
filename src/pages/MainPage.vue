<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <Controller></Controller>
          <FileReader></FileReader>
          <ModelProps></ModelProps>
          <ScriptEditor></ScriptEditor>
          <ModelLog></ModelLog>
        </div>
        <div class="col text-center">
           <q-scroll-area v-bind:style="{ height: height + 'px'}">
             <LightningChart></LightningChart>
             <ModelDiagram></ModelDiagram>
          </q-scroll-area>
        </div>
        <div class="col-2 text-center">
          <PatientMonitor></PatientMonitor>
          <DiagramBuilder></DiagramBuilder>
        </div>
    </div>
  </q-page>
</template>

<script>

import LightningChart from 'components/LightningChart'
import Controller from 'components/Controller'
import ModelLog from 'components/Log'
import FileReader from 'components/FileReader'
import ModelDiagram from 'components/Diagram'
import ScriptEditor from 'components/ScriptEditor'
import DiagramBuilder from 'components/DiagramBuilder'
import ModelProps from 'components/PropertyEditor'
import PatientMonitor from 'components/PatientMonitor'

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
    ModelProps,
    PatientMonitor
  },
  data () {
    return {
      height: 9000
    }
  },
  mounted () {
    // attach an event handler to the model instance
    this.height = this.$q.screen.height
    this.max_width = this.$q.screen.width
  },
  beforeDestroy () {
    // remove the event handler from memory
    delete this.modelEventListener
  },
  methods: {

  }
}
</script>
