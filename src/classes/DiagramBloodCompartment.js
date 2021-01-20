import * as PIXI from 'pixi.js'
import explain from '../assets/container.png'

class DiagramBloodCompartment {
  constructor (id, label, modelComponents, pixiApp) {
    this.id = id
    this.pixiApp = pixiApp
    // eslint-disable-next-line new-cap
    this.sprite = new PIXI.Sprite.from(explain)
    this.sprite.modelComponents = modelComponents
    this.sprite.id = id
    this.sprite.label = label
    this.sprite.volume = 0
    this.sprite.to2 = 0
    this.sprite.scalingFactor = 4
    this.sprite.interactionData = null
    this.sprite.dragging = false
    this.sprite.anchor = { x: 0.5, y: 0.5 }
    this.sprite.x = 50
    this.sprite.y = 50
    this.sprite.scale.set(0.5, 0.5)
    this.sprite.tint = '0xffffff'
    this.sprite.interactive = true
    this.sprite.buttonMode = true
    this.sprite.on('mousedown', this.onDragStart)
    this.sprite.on('mouseupoutside', this.onDragEnd)
    this.sprite.on('mouseup', this.onDragEnd)
    this.sprite.on('mousemove', this.onDragMove)
    this.pixiApp.stage.addChild(this.sprite)

    this.sprite.textStyle = new PIXI.TextStyle({
      fill: 'white',
      fontSize: 16,
      fontFamily: 'Tahoma'
    })
    this.sprite.text = new PIXI.Text(this.sprite.label, this.sprite.textStyle)
    this.sprite.text.anchor = { x: 0.5, y: 0.5 }
    this.sprite.text.x = 50
    this.sprite.text.y = 50
    this.pixiApp.stage.addChild(this.sprite.text)
  }

  draw (stage, rtData) {
    let volume = 0
    let to2 = 0
    this.sprite.modelComponents.forEach(modelComponent => {
      volume += rtData[0][modelComponent].vol
      to2 += rtData[0][modelComponent].to2
    })
    this.sprite.volume = this.calculateRadius(volume)
    this.sprite.to2 = to2
    this.sprite.tint = this.CalculateColor(this.sprite.to2 / this.sprite.modelComponents.length)
    this.sprite.scale.set(this.sprite.volume * this.sprite.scalingFactor, this.sprite.volume * this.sprite.scalingFactor)
  }

  onDragStart (e) {
    // sprite is here the owner, as this function is called by the sprite class
    this.interactionData = e.data
    this.dragging = true
    this.alpha = 0.5
  }

  onDragEnd () {
    // sprite is here the owner, as this function is called by the sprite class
    this.interactionData = null
    this.alpha = 1
    this.dragging = false
  }

  onDragMove (e) {
    // sprite is here the owner (this = sprite), as this function is called by the sprite class
    if (this.dragging) {
      this.x = this.interactionData.global.x
      this.y = this.interactionData.global.y
      this.text.x = this.interactionData.global.x
      this.text.y = this.interactionData.global.y
    }
  }

  calculateRadius (volume) {
    const _cubicRadius = volume / ((4.0 / 3.0) * Math.PI)
    const _radius = Math.pow(_cubicRadius, 1.0 / 3.0)
    return _radius
  }

  rgbToHex (rgb) {
    let hex = Number(rgb).toString(16)
    if (hex.length < 2) {
      hex = '0' + hex
    }
    return hex
  }

  fullColorHex (r, g, b) {
    const red = this.rgbToHex(r)
    const green = this.rgbToHex(g)
    const blue = this.rgbToHex(b)
    return red + green + blue
  }

  Remap (value, from1, to1, from2, to2) {
    return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2
  }

  CalculateColor (to2) {
    if (to2 > 8.4) { to2 = 8.4 }
    let remap = this.Remap(to2, 0, 8.4, -10, 1)
    if (remap < 0) remap = 0
    const red = (remap * 210).toFixed(0)
    const green = (remap * 80).toFixed(0)
    const blue = (80 + remap * 75).toFixed(0)
    const color = '0x' + this.fullColorHex(red, green, blue)
    return color
  }
}

export default DiagramBloodCompartment

// bc.sprite.interactive = true
// bc.sprite.buttonMode = true
// bc.sprite.on('mousedown', this.onDragStart)
// bc.sprite.on('touchstart', this.onDragStart)
// bc.sprite.on('mouseup', this.onDragEnd)
// bc.sprite.on('mouseupoutside', this.onDragEnd)
// bc.sprite.on('touchend', this.onDragEnd)
// bc.sprite.on('touchendoutside', this.onDragEnd)
// bc.sprite.on('mousemove', this.onDragMove)
// bc.sprite.on('touchmove', this.onDragMove)
// bc.textStyle = new PIXI.TextStyle({ fill: 'white', fontSize: 16, fontFamily: 'Tahoma' })
// bc.text = new PIXI.Text(name, bc.textStyle)
// bc.text.x = this.stage.centerX
// bc.text.y = this.stage.centerY

// this.pixiApp.stage.addChild(bc.sprite)
// this.pixiApp.stage.addChild(bc.text)
// return bc