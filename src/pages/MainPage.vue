<template>
  <q-page padding>
    <div class="row justify-center items-start q-ma-es">
        <div class="col-2 text-center">
          <DiagramEditor></DiagramEditor>
          <ModelProps></ModelProps>
          <ECGProps></ECGProps>
          <HeartProps></HeartProps>
          <CirculationProps></CirculationProps>
          <BreathingProps></BreathingProps>
          <LungProps></LungProps>
          <VentilatorProps></VentilatorProps>
          <ANSProps></ANSProps>
          <MetabolismProps></MetabolismProps>
          <KidneyProps></KidneyProps>
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
import ECGProps from 'components/ECGProps'
import HeartProps from 'components/HeartProps'
import CirculationProps from 'components/CirculationProps'
import BreathingProps from 'components/BreathingProps'
import LungProps from 'components/LungProps'
import VentilatorProps from 'components/VentilatorProps'
import ANSProps from 'components/ANSProps'
import MetabolismProps from 'components/MetabolismProps'
import KidneyProps from 'components/KidneyProps'

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
    DiagramEditor,
    ECGProps,
    HeartProps,
    CirculationProps,
    BreathingProps,
    LungProps,
    VentilatorProps,
    ANSProps,
    MetabolismProps,
    KidneyProps
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
