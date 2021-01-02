<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
      model diagram
      </div>
    </div>

    <div class="stage" :style="{display: display}">
      <canvas id="stage" ></canvas>
    </div>
  </q-card>
</template>

<script>

import explain from '../assets/container.png'

import * as PIXI from 'pixi.js'

let canvas = null

export default {
  data () {
    return {
      isEnabled: true,
      modelEventListener: null,
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
      containers: [],
      connectors: [],
      componentTypes: ['blood compartment', 'blood connector'],
      componentType: 'blood compartment'
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
            this.callback_rt()
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
      // attach an event handler to handle resize of the window
      window.addEventListener('resize', this.handleResize)
      // size the canvas
      this.handleResize()
      this.buildDiagram()
      this.callback_rt = this.updateContainers
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
    },
    updateContainers () {
      this.containers.forEach(container => {
        let cumVolume = 0
        let cumTO2 = 0
        container.components.forEach(comp => {
          cumVolume += this.rtData[0][comp].vol
          cumTO2 += this.rtData[0][comp].to2
        })
        cumTO2 = cumTO2 / container.components.length
        container.sprite.tint = this.CalculateColor(cumTO2)
        container.sprite.scale.set(cumVolume * this.stage.scaling, cumVolume * this.stage.scaling)
      })
    },
    rgbToHex (rgb) {
      let hex = Number(rgb).toString(16)
      if (hex.length < 2) {
        hex = '0' + hex
      }
      return hex
    },
    fullColorHex  (r, g, b) {
      const red = this.rgbToHex(r)
      const green = this.rgbToHex(g)
      const blue = this.rgbToHex(b)
      return red + green + blue
    },
    Remap (value, from1, to1, from2, to2) {
      return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2
    },
    CalculateColor (to2) {
      if (to2 > 8.4) {
        to2 = 8.4
      }

      let remap = this.Remap(to2, 0, 8.4, -10, 1)

      if (remap < 0) remap = 0

      const red = (remap * 210).toFixed(0)
      const green = (remap * 80).toFixed(0)
      const blue = (80 + remap * 75).toFixed(0)

      const color = '0x' + this.fullColorHex(red, green, blue)

      return color
    },
    containerClicked (e) {
      // console.log(e.target)
    },
    configureContainer (name, components) {
      const container = {
        sprite: null,
        text: null
      }
      // eslint-disable-next-line new-cap
      container.sprite = new PIXI.Sprite.from(explain)
      container.textStyle = new PIXI.TextStyle({
        fill: 'white',
        fontSize: 16,
        fontFamily: 'Tahoma'
      })
      container.text = new PIXI.Text(name, container.textStyle)
      container.name = name
      container.components = components
      container.sprite.anchor.x = 0.5
      container.sprite.anchor.y = 0.5
      container.text.anchor.x = 0.5
      container.text.anchor.y = 0.5
      container.sprite.x = this.stage.centerX
      container.sprite.y = this.stage.centerY
      container.text.x = this.stage.centerX
      container.text.y = this.stage.centerY
      container.sprite.tint = '0xffffff'
      container.sprite.interactive = true
      container.sprite.on('mousedown', this.containerClicked)
      this.pixiApp.stage.addChild(container.sprite)
      this.pixiApp.stage.addChild(container.text)
      return container
    },
    buildDiagram () {
      this.containers.push(this.configureContainer('AA', ['AA']))
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
