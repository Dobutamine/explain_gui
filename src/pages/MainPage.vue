<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <FileReader></FileReader>
          <ModelProps></ModelProps>
        </div>
        <div class="col text-center">
           <q-scroll-area style="height: 850px; max-width: 3000px;">
            <controller></controller>
            <LightningChart></LightningChart>
          </q-scroll-area>
        </div>
        <div class="col-2 text-center">
          <ModelLog></ModelLog>
        </div>
    </div>
  </q-page>
</template>

<script>

import LightningChart from 'components/LightningChart'
import Controller from 'components/Controller'
import ModelProps from 'components/ModelProps'
import ModelLog from 'components/ModelLog'
import FileReader from 'components/FileReader'

export default {
  name: 'PageIndex',
  components: {
    LightningChart,
    Controller,
    ModelProps,
    ModelLog,
    FileReader
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
