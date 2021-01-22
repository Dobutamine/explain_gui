import * as PIXI from 'pixi.js'
import explain from '../assets/container.png'

class DiagramContainer {
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
    this.sprite.tint = '0x999999'
    this.sprite.interactive = true
    this.sprite.buttonMode = true
    this.sprite.on('mousedown', this.onDragStart)
    this.sprite.on('mouseupoutside', this.onDragEnd)
    this.sprite.on('mouseup', this.onDragEnd)
    this.sprite.on('mousemove', this.onDragMove)
    this.sprite.zIndex = 0
    this.pixiApp.stage.addChild(this.sprite)

    this.sprite.textStyle = new PIXI.TextStyle({
      fill: 'white',
      fontSize: 12,
      fontFamily: 'Tahoma'
    })
    this.sprite.text = new PIXI.Text(this.sprite.label, this.sprite.textStyle)
    this.sprite.text.anchor = { x: 0.5, y: 0.5 }
    this.sprite.text.x = 50
    this.sprite.text.y = 50
    this.sprite.text.zIndex = 3
    this.pixiApp.stage.addChild(this.sprite.text)
  }

  updateScale (newScale) {
    this.sprite.scalingFactor = newScale
  }

  remove () {
    this.pixiApp.stage.removeChild(this.sprite)
    this.pixiApp.stage.removeChild(this.sprite.text)
  }

  draw (stage, rtData) {
    let volume = 0
    this.sprite.modelComponents.forEach(modelComponent => {
      volume += rtData[0][modelComponent].vol
    })
    this.sprite.volume = this.calculateRadius(volume * 2)
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
}

export default DiagramContainer
