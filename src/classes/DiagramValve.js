import * as PIXI from 'pixi.js'
import explain from '../assets/blood.png'
import valveOpen from '../assets/valveOpen.png'
import valveClosed from '../assets/valveClosed.png'

class DiagramValve {
  constructor (id, label, dbcFrom, dbcTo, connectors, pixiApp) {
    this.id = id
    this.position = 0
    this.connectors = connectors
    this.speed = 1
    this.pixiApp = pixiApp
    this.graphics = new PIXI.Graphics()
    this.graphics.dbcFrom = dbcFrom
    this.graphics.dbcTo = dbcTo
    this.graphics.id = id
    this.graphics.label = label
    this.pixiApp.stage.addChild(this.graphics)

    // eslint-disable-next-line new-cap
    this.sprite = new PIXI.Sprite.from(explain)
    this.sprite.anchor = { x: 0.5, y: 0.5 }
    this.sprite.x = 50
    this.sprite.y = 50
    this.sprite.interactive = true
    this.sprite.buttonMode = true
    this.sprite.tint = '0x000000'
    this.sprite.zIndex = 1
    this.pos = 0
    this.sprite.scale.set(0.04, 0.04)
    this.pixiApp.stage.addChild(this.sprite)

    // eslint-disable-next-line new-cap
    this.spriteValveOpen = new PIXI.Sprite.from(valveOpen)
    this.spriteValveOpen.anchor = { x: 0.5, y: 0.5 }
    this.spriteValveOpen.x = 50
    this.spriteValveOpen.y = 50
    this.spriteValveOpen.tint = '0xffffff'
    this.spriteValveOpen.zIndex = 1
    this.spriteValveOpen.scale.set(0.05, 0.10)
    this.pixiApp.stage.addChild(this.spriteValveOpen)

    // eslint-disable-next-line new-cap
    this.spriteValveClosed = new PIXI.Sprite.from(valveClosed)
    this.spriteValveClosed.anchor = { x: 0.5, y: 0.5 }
    this.spriteValveClosed.x = 50
    this.spriteValveClosed.y = 50
    this.spriteValveClosed.tint = '0xffffff'
    this.spriteValveClosed.zIndex = 1
    this.spriteValveClosed.scale.set(0.05, 0.10)
    this.pixiApp.stage.addChild(this.spriteValveClosed)
  }

  remove () {
    this.pixiApp.stage.removeChild(this.sprite)
    this.pixiApp.stage.removeChild(this.spriteValveClosed)
    this.pixiApp.stage.removeChild(this.spriteValveOpen)
    this.graphics.clear()
  }

  updateSpeed (newSpeed) {
    this.speed = newSpeed
  }

  redrawConnectors (diagramCompartments, rtData) {
    this.graphics.clear()

    const x1 = diagramCompartments[this.graphics.dbcFrom].sprite.x
    const y1 = diagramCompartments[this.graphics.dbcFrom].sprite.y

    const x2 = diagramCompartments[this.graphics.dbcTo].sprite.x
    const y2 = diagramCompartments[this.graphics.dbcTo].sprite.y

    const angle = Math.atan2((y2 - y1), x2 - x1) - 0.785 * 2

    const tOpen = 0.5
    this.spriteValveOpen.x = (1 - tOpen) * x1 + tOpen * x2
    this.spriteValveOpen.y = (1 - tOpen) * y1 + tOpen * y2

    const tClosed = 0.5
    this.spriteValveClosed.x = (1 - tClosed) * x1 + tClosed * x2
    this.spriteValveClosed.y = (1 - tClosed) * y1 + tClosed * y2

    this.spriteValveClosed.visible = true
    this.spriteValveOpen.visible = false
    this.spriteValveClosed.rotation = angle

    this.graphics.beginFill(0xFF3300)
    this.graphics.lineStyle(1, 0xaaaaaa, 1)
    this.graphics.moveTo(x1, y1)
    this.graphics.lineTo(x2, y2)
    this.graphics.endFill()

    const remapT = this.Remap(this.position, 0, 1, 0, 1)
    const t = remapT / 1
    this.sprite.x = (1 - t) * x1 + t * x2
    this.sprite.y = (1 - t) * y1 + t * y2
    const angleSprite = Math.atan2((y1 - y2), x1 - x2) - 0.785 * 2
    this.sprite.rotation = angleSprite

    if (remapT > 1) { this.position = 0 }
    if (remapT < 0) { this.position = 1 }

    this.pixiApp.stage.addChild(this.graphics)
  }

  draw (diagramCompartments, rtData) {
    this.graphics.clear()
    // this.pixiApp.stage.removeChild(this.sprite)

    const x1 = diagramCompartments[this.graphics.dbcFrom].sprite.x
    const y1 = diagramCompartments[this.graphics.dbcFrom].sprite.y

    const tint1 = diagramCompartments[this.graphics.dbcFrom].sprite.tint

    const x2 = diagramCompartments[this.graphics.dbcTo].sprite.x
    const y2 = diagramCompartments[this.graphics.dbcTo].sprite.y

    const tint2 = diagramCompartments[this.graphics.dbcTo].sprite.tint

    // const angle = 1 / (Math.tan((y2 - y1) / (x2 - x1)))
    const angle = Math.atan2((y2 - y1), x2 - x1) - 0.785 * 2

    // const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI

    this.graphics.beginFill(0xFF3300)
    this.graphics.lineStyle(1, 0xaaaaaa, 1)
    this.graphics.moveTo(x1, y1)
    this.graphics.lineTo(x2, y2)
    this.graphics.endFill()

    const remapT = this.Remap(this.position, 0, 1, 0, 1)
    const t = remapT / 1
    this.sprite.x = (1 - t) * x1 + t * x2
    this.sprite.y = (1 - t) * y1 + t * y2
    this.sprite.tint = tint1

    const tOpen = 0.5
    this.spriteValveOpen.x = (1 - tOpen) * x1 + tOpen * x2
    this.spriteValveOpen.y = (1 - tOpen) * y1 + tOpen * y2

    const tClosed = 0.5
    this.spriteValveClosed.x = (1 - tClosed) * x1 + tClosed * x2
    this.spriteValveClosed.y = (1 - tClosed) * y1 + tClosed * y2

    if (remapT > 1) { this.position = 0 }
    if (remapT < 0) { this.position = 1 }

    let flow = 0
    let angleSprite = Math.atan2((y2 - y1), x2 - x1) - 0.785 * 2
    if (rtData) {
      this.connectors.forEach(connector => {
        flow += rtData[0][connector].real_flow * this.speed
      })
    }
    this.sprite.tint = tint1
    if (flow <= 0) {
      this.spriteValveClosed.visible = true
      this.spriteValveOpen.visible = false
      this.spriteValveClosed.rotation = angle
      this.sprite.tint = tint2
      angleSprite = Math.atan2((y1 - y2), x1 - x2) - 0.785 * 2
    } else {
      this.spriteValveClosed.visible = false
      this.spriteValveOpen.visible = true
      this.spriteValveOpen.rotation = angle
    }
    this.sprite.rotation = angleSprite
    this.position += flow / this.connectors.length
    this.pixiApp.stage.addChild(this.graphics)
    // this.pixiApp.stage.addChild(this.sprite)
  }

  Remap (value, from1, to1, from2, to2) {
    return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2
  }
}

export default DiagramValve
