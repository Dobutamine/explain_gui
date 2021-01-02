<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <ModelProps></ModelProps>
          <Modellog></Modellog>
        </div>
        <div class="col text-center">
           <q-scroll-area style="height: 850px; max-width: 3000px;">
            <LightningChart></LightningChart>
            <controller></controller>
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
import ModelProps from 'components/ModelProps'
import Modellog from 'components/Modellog'

export default {
  name: 'PageIndex',
  components: {
    LightningChart,
    Controller,
    ModelProps,
    Modellog
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
