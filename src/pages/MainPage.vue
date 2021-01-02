<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <DiagramEditor></DiagramEditor>
          <ModelProps></ModelProps>
        </div>
        <div class="col text-center">
           <q-scroll-area style="height: 850px; max-width: 3000px;">
             <controller></controller>
             <ModelDiagram></ModelDiagram>
            <LightningChart></LightningChart>
          </q-scroll-area>
        </div>
        <div class="col-2 text-center">
          <ModelVitals></ModelVitals>
          <ModelLabs></ModelLabs>
          <ModelHeart></ModelHeart>
          <ModelCirculation></ModelCirculation>
          <ModelVentilation></ModelVentilation>
          <ModelLungs></ModelLungs>
          <ModelKidneys></ModelKidneys>
          <Modellog></Modellog>
        </div>
    </div>
  </q-page>
</template>

<script>

import LightningChart from 'components/LightningChart'
import Controller from 'components/Controller'
import ModelProps from 'components/ModelProps'
import Modellog from 'components/Modellog'
import ModelDiagram from 'components/ModelDiagram'
import ModelVitals from 'components/ModelVitals'
import ModelLabs from 'components/ModelLabs'
import ModelCirculation from 'components/ModelCirculation'
import ModelVentilation from 'components/ModelVentilation'
import ModelHeart from 'components/ModelHeart'
import ModelLungs from 'components/ModelLungs'
import ModelKidneys from 'components/ModelKidneys'
import DiagramEditor from 'components/DiagramEditor'

export default {
  name: 'PageIndex',
  components: {
    LightningChart,
    Controller,
    ModelProps,
    Modellog,
    ModelDiagram,
    ModelVitals,
    ModelLabs,
    ModelCirculation,
    ModelVentilation,
    ModelHeart,
    ModelLungs,
    ModelKidneys,
    DiagramEditor
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
