import * as PIXI from 'pixi.js'
import explain from '../assets/gas_container.png'

class DiagramGasCompartment {
  constructor (id, label, modelComponents, pixiApp) {
    this.id = id
    this.pixiApp = pixiApp
    // eslint-disable-next-line new-cap
    this.sprite = new PIXI.Sprite.from(explain)
    this.sprite.modelComponents = modelComponents
    this.sprite.id = id
    this.sprite.label = label
    this.sprite.volume = 0.05
    this.sprite.co2 = 0
    this.sprite.scalingFactorX = 1
    this.sprite.scalingFactorY = 1
    this.sprite.globalScale = 5
    this.sprite.interactionData = null
    this.sprite.dragging = false
    this.sprite.rotating = false
    this.sprite.morphing = false
    this.sprite.sizing = false
    this.sprite.anchor = { x: 0.5, y: 0.5 }
    this.sprite.x = 50
    this.sprite.y = 50
    this.sprite.prevX = 0
    this.sprite.prevY = 0
    this.sprite.scale.set(0.05, 0.05)
    this.sprite.tint = '0xffffff'
    this.sprite.interactive = true
    this.sprite.buttonMode = true
    this.sprite.on('mousedown', this.onDragStart)
    this.sprite.on('touchstart', this.onDragStart)
    this.sprite.on('mouseupoutside', this.onDragEnd)
    this.sprite.on('touchendoutside', this.onDragEnd)
    this.sprite.on('mouseup', this.onDragEnd)
    this.sprite.on('touchend', this.onDragEnd)
    this.sprite.on('mousemove', this.onDragMove)
    this.sprite.on('touchmove', this.onDragMove)
    this.sprite.zIndex = 2
    this.sprite.firstRun = true
    this.sprite.editMode = this.pixiApp.spriteMode
    this.pixiApp.stage.addChild(this.sprite)

    this.sprite.textStyle = new PIXI.TextStyle({
      fill: 'white',
      fontSize: 9,
      fontFamily: 'Tahoma',
      strokeThickness: 0
    })
    this.sprite.text = new PIXI.Text(this.sprite.label, this.sprite.textStyle)
    this.sprite.text.anchor = { x: 0.5, y: 0.5 }
    this.sprite.text.x = 50
    this.sprite.text.y = 50
    this.sprite.text.zIndex = 2
    this.pixiApp.stage.addChild(this.sprite.text)

    this.setUpGrid(this.pixiApp.gridSize)
  }

  setUpGrid (newSize) {
    this.sprite.x_grid = []
    for (let i = 0; i < this.pixiApp.renderer.width; i = i + newSize) {
      this.sprite.x_grid.push(i)
    }

    this.sprite.y_grid = []
    for (let i = 0; i < this.pixiApp.renderer.height; i = i + newSize) {
      this.sprite.y_grid.push(i)
    }
  }

  updateScale (newScale) {
    this.sprite.globalScale = newScale
  }

  remove () {
    this.pixiApp.stage.removeChild(this.sprite)
    this.pixiApp.stage.removeChild(this.sprite.text)
  }

  draw (stage, rtData) {
    let volume = 0
    if (this.sprite.firstRun) {
      this.sprite.firstRun = false
      volume = 0.05
    }
    let co2 = 0
    if (rtData) {
      this.sprite.modelComponents.forEach(modelComponent => {
        if (!rtData[0][modelComponent].fixed_composition) {
          volume += rtData[0][modelComponent].vol
          // co2 += rtData[0][modelComponent].co2
        } else {
          volume = 0.05
          co2 += rtData[0][modelComponent].co2
        }
      })
    }
    this.sprite.volume = this.calculateRadius(volume)
    this.sprite.co2 = co2
    this.sprite.text.rotation = this.sprite.rotation
    this.sprite.tint = this.CalculateColor(this.sprite.co2 / this.sprite.modelComponents.length)
    this.sprite.scale.set(this.sprite.volume * this.sprite.scalingFactorX * this.sprite.globalScale, this.sprite.volume * this.sprite.scalingFactorY * this.sprite.globalScale)
  }

  onDragStart (e) {
    // sprite is here the owner, as this function is called by the sprite class
    switch (this.editMode.mode) {
      case 1: // moving
        this.dragging = true
        this.rotating = false
        this.morphing = false
        this.sizing = false
        break
      case 2: // rotating
        this.dragging = false
        this.rotating = true
        this.morphing = false
        this.sizing = false
        break
      case 3: // morphing
        this.dragging = false
        this.rotating = false
        this.morphing = true
        this.sizing = false
        break
      case 4: // sizing
        this.dragging = false
        this.rotating = false
        this.morphing = false
        this.sizing = true
        break
    }

    this.interactionData = e.data
    this.alpha = 0.5
  }

  onDragEnd (e) {
    // sprite is here the owner, as this function is called by the sprite class
    const closestX = this.x_grid.reduce((a, b) => {
      return Math.abs(b - this.interactionData.global.x) < Math.abs(a - this.interactionData.global.x) ? b : a
    })
    const closestY = this.y_grid.reduce((a, b) => {
      return Math.abs(b - this.interactionData.global.y) < Math.abs(a - this.interactionData.global.y) ? b : a
    })
    switch (this.editMode.mode) {
      case 1: // moving
        this.x = closestX
        this.y = closestY
        this.text.x = closestX
        this.text.y = closestY
        this.dragging = false
        break
      case 2: // rotating
        this.rotating = false
        break
      case 3: // morphing
        this.morphing = false
        break
      case 4: // sizing
        this.sizing = false
        break
    }
    this.interactionData = null
    this.alpha = 1
  }

  onDragMove (e) {
    // sprite is here the owner (this = sprite), as this function is called by the sprite class
    switch (this.editMode.mode) {
      case 1: // moving
        if (this.dragging) {
          this.x = this.interactionData.global.x
          this.y = this.interactionData.global.y
          this.text.x = this.interactionData.global.x
          this.text.y = this.interactionData.global.y
        }
        break
      case 2: // rotating
        if (this.rotating) {
          if (this.interactionData.global.x > this.prevX) {
            this.rotation += 0.05
            this.text.rotation += 0.05
          } else {
            this.rotation -= 0.05
            this.text.rotation -= 0.05
          }
          this.prevX = this.interactionData.global.x
        }
        break
      case 3: // morphing
        if (this.morphing) {
          if (this.interactionData.global.x > this.prevX) {
            this.scalingFactorX += 0.01
            this.scalingFactorY -= 0.01
          } else {
            this.scalingFactorX -= 0.01
            this.scalingFactorY += 0.01
          }
          this.scale.set(this.volume * this.scalingFactorX * this.globalScale, this.volume * this.scalingFactorY * this.globalScale)
          this.prevX = this.interactionData.global.x
        }
        break
      case 4: // sizing
        if (this.sizing) {
          if (this.interactionData.global.x > this.prevX) {
            this.scalingFactorX += 0.01
            this.scalingFactorY += 0.01
          } else {
            this.scalingFactorX -= 0.01
            this.scalingFactorY -= 0.01
          }
          this.scale.set(this.volume * this.scalingFactorX * this.globalScale, this.volume * this.scalingFactorY * this.globalScale)
          this.prevX = this.interactionData.global.x
        }
        break
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

  Remap (value, from1, to1, from2, co2) {
    return ((value - from1) / (to1 - from1)) * (co2 - from2) + from2
  }

  CalculateColor (co2) {
    if (co2 > 8.4) { co2 = 8.4 }
    let remap = this.Remap(co2, 0, 8.4, -10, 1)
    if (remap < 0) remap = 0
    const red = (remap * 210).toFixed(0)
    const green = (remap * 80).toFixed(0)
    const blue = (80 + remap * 75).toFixed(0)
    const color = '0x' + this.fullColorHex(red, green, blue)
    return color
  }
}

export default DiagramGasCompartment
