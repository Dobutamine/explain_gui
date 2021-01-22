import * as PIXI from 'pixi.js'
import explain from '../assets/container.png'

class DiagramGasConnector {
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
    this.sprite.tint = '0x000000'
    this.sprite.zIndex = 1
    this.pos = 0
    this.sprite.scale.set(0.2, 0.2)
    this.pixiApp.stage.addChild(this.sprite)
  }

  remove () {
    this.pixiApp.stage.removeChild(this.sprite)
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

    this.graphics.beginFill(0xFF3300)
    this.graphics.lineStyle(3, 0x666666, 1)
    this.graphics.moveTo(x1, y1)
    this.graphics.lineTo(x2, y2)
    this.graphics.endFill()

    const remapT = this.Remap(this.position, 0, 1, 0, 1)
    const t = remapT / 1
    this.sprite.x = (1 - t) * x1 + t * x2
    this.sprite.y = (1 - t) * y1 + t * y2

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

    this.graphics.beginFill(0xFF3300)
    this.graphics.lineStyle(3, 0x666666, 1)
    this.graphics.moveTo(x1, y1)
    this.graphics.lineTo(x2, y2)
    this.graphics.endFill()

    const remapT = this.Remap(this.position, 0, 1, 0, 1)
    const t = remapT / 1
    this.sprite.x = (1 - t) * x1 + t * x2
    this.sprite.y = (1 - t) * y1 + t * y2

    if (remapT > 1) { this.position = 0 }
    if (remapT < 0) { this.position = 1 }

    let flow = 0
    if (rtData) {
      this.connectors.forEach(connector => {
        flow += rtData[0][connector].real_flow * this.speed
      })
    }
    this.sprite.tint = tint1
    if (flow < 0) {
      this.sprite.tint = tint2
    }
    this.position += flow / this.connectors.length
    this.pixiApp.stage.addChild(this.graphics)
    // this.pixiApp.stage.addChild(this.sprite)
  }

  Remap (value, from1, to1, from2, to2) {
    return ((value - from1) / (to1 - from1)) * (to2 - from2) + from2
  }
}

export default DiagramGasConnector
