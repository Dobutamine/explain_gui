<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
      animated model diagram
      </div>
    </div>

    <div class="stage" :style="{display: display}">
      <canvas id="stage" ></canvas>
    </div>
  </q-card>
</template>

<script>

// import explain from '../assets/container.png'
import DiagramBloodCompartment from '../classes/DiagramBloodCompartment'
import DiagramBloodConnector from '../classes/DiagramBloodConnector'
import * as PIXI from 'pixi.js'

let canvas = null

export default {
  data () {
    return {
      isEnabled: true,
      modelEventListener: null,
      watchedmodels: [],
      display: 'block',
      pixiApp: null,
      stage: {
        width: 0,
        hieght: 0,
        centerX: 0,
        centerY: 0,
        scaling: 40,
        aspectRatio: 0.6
      },
      activeDiagramComponent: null,
      activeSprite: null,
      interactionData: null,
      alpha: 1.0,
      dragging: false,
      callback_datalogger: () => {},
      callback_mes: () => {},
      callback_props: () => {},
      callback_rt: () => {},
      callback_state: () => {},
      datalogger: null,
      snapshot: null,
      message: null,
      properties: null,
      rtData: null,
      diagramComponents: {},
      diagramConnectors: {}
    }
  },
  mounted () {
    // initialize the diagram
    this.initDiagram()
    // attach an event handler to handle model messages
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'mes':
          if (message.data.data[0] === 'ready') {
            this.callback_mes()
          }
          break
        case 'data':
          switch (message.data.target) {
            case 'state':
              this.snapshot = message.data.data
              this.callback_state()
              break
            case 'props':
              this.properties = message.data.data
              this.processProperties()
              break
            default:
              break
          }
          break
        case 'rt':
          this.rtData = message.data.data
          if (this.isEnabled) {
            requestAnimationFrame(this.updateDiagram)
          }
          break
      }
    })
    this.$model.getProperties()

    // hide the model diagram at startup
    this.toggleIsEnabled()
  },
  destroyed () {
    // remove eventlistener when destroyed
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
      if (this.isEnabled) {
        this.display = 'block'
        this.pixiApp.renderer.view.style.display = this.display
        // this.$model.setDataloggerWatchedModelsRT(this.watchedmodels)
        this.$root.$emit('rt_watch_diagram', this.watchedmodels)
      } else {
        this.display = 'none'
        this.pixiApp.renderer.view.style.display = this.display
      }
    },
    initDiagram () {
      // get the reference to the canvas
      canvas = document.getElementById('stage')
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        transparent: false,
        antialias: true,
        backgroundColor: 0xffffff,
        view: canvas
      })
      // add the pixi application to the view
      this.$el.appendChild(this.pixiApp.view)
      this.pixiApp.renderer.view.style.display = this.display
      this.pixiApp.renderer.autoResize = true
      this.pixiApp.stage.interactive = true
      // this.pixiApp.stage.on('mousemove', () => { this.redrawConnectors() })
      // attach an event handler to handle resize of the window
      window.addEventListener('resize', this.handleResize)
      // size the canvas
      this.handleResize()
      this.buildDiagram()
      this.callback_rt = this.updateDiagramComponents
    },
    buildDiagram () {
      this.watchedmodels = ['LA', 'LV', 'RA', 'RV', 'LA_LV', 'RA_RV']
      this.diagramComponents.RA = new DiagramBloodCompartment('RA', 'RA', ['RA'], this.pixiApp)
      this.diagramComponents.RV = new DiagramBloodCompartment('RV', 'RV', ['RV'], this.pixiApp)
      this.diagramComponents.LA = new DiagramBloodCompartment('LA', 'LA', ['LA'], this.pixiApp)
      this.diagramComponents.LV = new DiagramBloodCompartment('LV', 'LV', ['LV'], this.pixiApp)

      this.diagramConnectors.LA_LV = new DiagramBloodConnector('LA_LV', 'LA_LV', 'LA', 'LV', ['LA_LV'], this.pixiApp)
      this.diagramConnectors.RA_RV = new DiagramBloodConnector('RA_RV', 'RA_RV', 'RA', 'RV', ['RA_RV'], this.pixiApp)
    },
    updateDiagram () {
      Object.keys(this.diagramConnectors).forEach(id => {
        this.diagramConnectors[id].draw(this.diagramComponents, this.rtData)
      })

      Object.keys(this.diagramComponents).forEach(id => {
        this.diagramComponents[id].draw(this.stage, this.rtData)
      })
    },
    handleResize () {
      // get stage sizes
      this.stage.width = canvas.getBoundingClientRect().width
      this.stage.height = canvas.getBoundingClientRect().width * this.stage.aspectRatio
      // get the center of the stage
      this.stage.centerX = this.stage.width * 0.5
      this.stage.centerY = this.stage.height * 0.5
      // resize the pixi app
      if (this.pixiApp) {
        this.pixiApp.renderer.resize(this.stage.width, this.stage.height)
      }
    },
    processProperties () {
      // console.log(this.properties)
    }
  }
}
</script>

<style>
#stage {
  border-radius: 10px;
  width: 100%;
}
</style>
