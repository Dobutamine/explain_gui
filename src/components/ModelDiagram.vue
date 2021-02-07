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

import DiagramBloodCompartment from '../classes/DiagramBloodCompartment'
import DiagramGasCompartment from '../classes/DiagramGasCompartment'
import DiagramBloodConnector from '../classes/DiagramBloodConnector'
import DiagramGasConnector from '../classes/DiagramGasConnector'
import * as PIXI from 'pixi.js'
import DiagramGasExchanger from 'src/classes/DiagramGasExchanger'
import DiagramValve from 'src/classes/DiagramValve'
import DiagramDiffusor from 'src/classes/DiagramDiffusor'
import DiagramContainer from 'src/classes/DiagramContainer'

let canvas = null

export default {
  data () {
    return {
      isEnabled: true,
      isRunning: false,
      modelEventListener: null,
      watchedmodels: [],
      display: 'block',
      pixiApp: null,
      stage: {
        width: 0,
        hieght: 0,
        centerX: 0,
        centerY: 0,
        scaling: 60,
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
            case 'datalogger_output':
              this.rtData = []
              this.rtData.push(message.data.data[message.data.data.length - 1])
              requestAnimationFrame(this.updateDiagram)
              break
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
    this.$root.$on('rt_on', () => { this.isRunning = true })
    this.$root.$on('rt_off', () => { this.isRunning = false })
    this.$root.$on('add_to_diagram', (e) => { this.addToDiagram(e) })
    this.$root.$on('remove_from_diagram', (e) => { this.removeFromDiagram(e) })
    this.$root.$on('update_scale', (e) => this.updateScale(e))
    this.$root.$on('update_speed', (e) => this.updateSpeed(e))
    this.$root.$on('clear_diagram', this.clearDiagram)
    this.$root.$on('get_layout', this.getCoordinates)
    // hide the model diagram at startup
    // this.toggleIsEnabled()
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
        backgroundColor: 0xeeeeee,
        view: canvas,
        sortableChildren: true
      })
      // add the pixi application to the view
      this.$el.appendChild(this.pixiApp.view)
      this.pixiApp.renderer.view.style.display = this.display
      this.pixiApp.renderer.autoResize = true
      this.pixiApp.stage.interactive = true
      this.pixiApp.stage.sortableChildren = true
      this.pixiApp.stage.on('mousemove', this.redrawConnector)
      // attach an event handler to handle resize of the window
      window.addEventListener('resize', this.handleResize)
      // size the canvas
      this.handleResize()
      this.buildDiagram()
      this.callback_rt = this.updateDiagramComponents
    },
    clearDiagram () {
      Object.keys(this.diagramComponents).forEach(id => {
        this.diagramComponents[id].remove()
        delete this.diagramComponents[id]
      })
      Object.keys(this.diagramConnectors).forEach(id => {
        this.diagramConnectors[id].remove()
        delete this.diagramConnectors[id]
      })
      this.watchedmodels = []
    },
    getCoordinates () {
      // getting relative coords
      const layouts = []
      Object.keys(this.diagramComponents).forEach(id => {
        const coordinateObject = {
          name: id,
          xSprite: this.diagramComponents[id].sprite.x / this.stage.width,
          ySprite: this.diagramComponents[id].sprite.y / this.stage.height
        }
        layouts.push(coordinateObject)
      })
      this.$root.$emit('diagram_layout', layouts)
    },
    updateScale (newScale) {
      Object.keys(this.diagramComponents).forEach(id => {
        this.diagramComponents[id].updateScale(newScale)
      })
      requestAnimationFrame(this.updateDiagram)
    },
    updateSpeed (newSpeed) {
      Object.keys(this.diagramConnectors).forEach(id => {
        this.diagramConnectors[id].updateSpeed(newSpeed)
      })
    },
    removeFromDiagram (e) {
      // try to find the model
      const foundInComponents = this.diagramComponents[e]
      if (foundInComponents !== undefined) {
        this.pixiApp.stage.removeChild(this.diagramComponents[e].sprite)
        this.diagramComponents[e].remove()
        delete this.diagramComponents[e]
        const index = this.watchedmodels.findIndex((element) => element === e)
        if (index > -1) {
          this.watchedmodels.splice(index, 1)
          this.$root.$emit('rt_watch_diagram', this.watchedmodels)
        }
      }
      const foundInConnectors = this.diagramConnectors[e]
      if (foundInConnectors !== undefined) {
        this.pixiApp.stage.removeChild(this.diagramConnectors[e].sprite)
        this.diagramConnectors[e].remove()
        delete this.diagramConnectors[e]
        const index = this.watchedmodels.findIndex((element) => element === e)
        if (index > -1) {
          this.watchedmodels.splice(index, 1)
          this.$root.$emit('rt_watch_diagram', this.watchedmodels)
        }
      }
      // remove from watched list
    },
    addToDiagram (e) {
      if (!this.watchedmodels.includes(e.modelComponents[0])) {
        switch (e.type) {
          case 'blood_compartment':
            this.diagramComponents[e.id] = new DiagramBloodCompartment(e.id, e.label, e.modelComponents, this.pixiApp)
            this.diagramComponents[e.id].sprite.x = e.layout.xSprite * this.stage.width
            this.diagramComponents[e.id].sprite.y = e.layout.ySprite * this.stage.height
            this.diagramComponents[e.id].sprite.text.x = e.layout.xSprite * this.stage.width
            this.diagramComponents[e.id].sprite.text.y = e.layout.ySprite * this.stage.height
            break
          case 'gas_compartment':
            this.diagramComponents[e.id] = new DiagramGasCompartment(e.id, e.label, e.modelComponents, this.pixiApp)
            this.diagramComponents[e.id].sprite.x = e.layout.xSprite * this.stage.width
            this.diagramComponents[e.id].sprite.y = e.layout.ySprite * this.stage.height
            this.diagramComponents[e.id].sprite.text.x = e.layout.xSprite * this.stage.width
            this.diagramComponents[e.id].sprite.text.y = e.layout.ySprite * this.stage.height
            break
          case 'pump':
            this.diagramComponents[e.id] = new DiagramBloodCompartment(e.id, e.label, e.modelComponents, this.pixiApp)
            this.diagramComponents[e.id].sprite.x = e.layout.xSprite * this.stage.width
            this.diagramComponents[e.id].sprite.y = e.layout.ySprite * this.stage.height
            this.diagramComponents[e.id].sprite.text.x = e.layout.xSprite * this.stage.width
            this.diagramComponents[e.id].sprite.text.y = e.layout.ySprite * this.stage.height
            break
          case 'blood_connector':
            this.diagramConnectors[e.id] = new DiagramBloodConnector(e.id, e.label, e.dbcFrom, e.dbcTo, e.modelComponents, this.pixiApp)
            break
          case 'valve':
            this.diagramConnectors[e.id] = new DiagramValve(e.id, e.label, e.dbcFrom, e.dbcTo, e.modelComponents, this.pixiApp)
            break
          case 'gas_connector':
            this.diagramConnectors[e.id] = new DiagramGasConnector(e.id, e.label, e.dbcFrom, e.dbcTo, e.modelComponents, this.pixiApp)
            break
          case 'exchanger':
            this.diagramConnectors[e.id] = new DiagramGasExchanger(e.id, e.label, e.dbcFrom, e.dbcTo, e.modelComponents, this.pixiApp)
            break
          case 'diffusor':
            this.diagramConnectors[e.id] = new DiagramDiffusor(e.id, e.label, e.dbcFrom, e.dbcTo, e.modelComponents, this.pixiApp)
            break
        }
        e.modelComponents.forEach(component => {
          this.watchedmodels.push(component)
        })
      }

      if (e.type === 'container') {
        if (!this.watchedmodels.includes(e.id)) {
          this.diagramComponents[e.id] = new DiagramContainer(e.id, e.label, e.modelComponents, this.pixiApp)
          this.diagramComponents[e.id].sprite.x = e.layout.xSprite * this.stage.width
          this.diagramComponents[e.id].sprite.y = e.layout.ySprite * this.stage.height
          this.diagramComponents[e.id].sprite.text.x = e.layout.xSprite * this.stage.width
          this.diagramComponents[e.id].sprite.text.y = e.layout.ySprite * this.stage.height
          this.watchedmodels.push(e.id)
        }
      }
      this.$root.$emit('rt_watch_diagram', this.watchedmodels)
    },
    buildDiagram () {
      // this.watchedmodels = ['LA', 'LV', 'RA', 'RV', 'LA_LV', 'RA_RV']
      // this.diagramComponents.RA = new DiagramBloodCompartment('RA', 'RA', ['RA'], this.pixiApp)
      // this.diagramComponents.RV = new DiagramBloodCompartment('RV', 'RV', ['RV'], this.pixiApp)
      // this.diagramComponents.LA = new DiagramBloodCompartment('LA', 'LA', ['LA'], this.pixiApp)
      // this.diagramComponents.LV = new DiagramBloodCompartment('LV', 'LV', ['LV'], this.pixiApp)

      // this.diagramConnectors.LA_LV = new DiagramBloodConnector('LA_LV', 'LA_LV', 'LA', 'LV', ['LA_LV'], this.pixiApp)
      // this.diagramConnectors.RA_RV = new DiagramBloodConnector('RA_RV', 'RA_RV', 'RA', 'RV', ['RA_RV'], this.pixiApp)
    },
    redrawConnector () {
      if (!this.isRunning) {
        Object.keys(this.diagramConnectors).forEach(id => {
          this.diagramConnectors[id].redrawConnectors(this.diagramComponents, this.rtData)
        })
      }
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
