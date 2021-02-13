<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
     Ventilator
     </div>
   </div>

  <div class="row q-mt-es">
    <div :class="graphClass" :id="id1"></div>
  </div>

</q-card>
</template>

<script>
import {
  lightningChart, Themes, EmptyFill, AxisScrollStrategies, AxisTickStrategies, ColorRGBA, SolidFill
} from '@arction/lcjs'

export default {
  data () {
    return {
      id1: 'chart',
      graphClass: 'rectangle',
      box: false,
      isEnabled: true,
      rtFrame: 3,
      hires: false,
      autoScale: false,

      xAxisModel: 'time',
      xAxisProp: 'none',
      xAxisModels: [],
      xAxisProps: [],

      chart1: null,
      chart1XAxis: null,
      chart1YAxis: null,
      chart1Ch1Lineseries: null,
      chart1Ch1Data: [],
      chart1Ch1Model: 'monitor',
      chart1Ch1Prop: 'vent_pressure_signal',
      chart1Ch1Factor: 1,
      chart1Ch1Offset: 0,
      chart1AutoScale: true,
      chart1MinY: 0,
      chart1MaxY: 100,

      modelEventListener: null,
      datalogger_data: null,
      rt_data: null,
      properties: null,
      selectedChannel: 1,

      prevTime: 0
    }
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
      if (this.isEnabled) {
        this.graphClass = 'rectangle'
        this.showSummary = true
      } else {
        this.graphClass = 'rectangleHide'
        this.showSummary = false
      }
    },
    drawRTGraph () {
      this.chart1Ch1Lineseries.clear()

      let samples = parseInt(this.rtFrame / 0.015)

      if (this.hires) {
        samples = parseInt(this.rtFrame / 0.005)
      }

      const overrunCh1 = this.chart1Ch1Data.length - samples
      if (overrunCh1 > 0) {
        this.chart1Ch1Data.splice(0, overrunCh1)
      }

      this.rt_data.forEach(dataline => {
        if (dataline.time - this.prevTime > 1) {
          this.prevTime = dataline.time
          // this.hr = parseInt(dataline.monitor.heart_rate)
          // this.abp = `${parseInt(dataline.monitor.abp_syst)}/${parseInt(dataline.monitor.abp_diast)}`
          // this.sat_pre = parseInt(dataline.monitor.saO2_pre)
          // this.sat_post = parseInt(dataline.monitor.saO2_post)
          // this.resp_rate = parseInt(dataline.monitor.resp_rate)
          // this.etCO2 = parseInt(dataline.monitor.etco2)
        }

        let xValue = dataline[this.xAxisModel][this.xAxisProp]
        xValue = dataline[this.xAxisModel]

        this.chart1Ch1Data.push({
          x: xValue,
          y: dataline[this.chart1Ch1Model][this.chart1Ch1Prop] * this.chart1Ch1Factor + this.chart1Ch1Offset
        })
      })
      // console.log(this.chartCh1Data)
      this.chart1Ch1Lineseries.add(this.chart1Ch1Data)
    },
    drawGraph () {
      this.chart1Ch1Lineseries.clear()
      this.chart1Ch1Data.length = 0

      this.datalogger_data.forEach(dataline => {
        let samples = parseInt(this.rtFrame / 0.015)

        if (this.hires) {
          samples = parseInt(this.rtFrame / 0.005)
        }

        const overrunCh1 = this.chart1Ch1Data.length - samples
        if (overrunCh1 > 0) {
          this.chart1Ch1Data.splice(0, overrunCh1)
        }

        if (dataline.time - this.prevTime > 1) {
          this.prevTime = dataline.time
          // this.hr = parseInt(dataline.monitor.heart_rate)
          // this.abp = `${parseInt(dataline.monitor.abp_syst)}/${parseInt(dataline.monitor.abp_diast)}`
          // this.sat_pre = parseInt(dataline.monitor.saO2_pre)
          // this.sat_post = parseInt(dataline.monitor.saO2_post)
          // this.resp_rate = parseInt(dataline.monitor.resp_rate)
          // this.etCO2 = parseInt(dataline.monitor.etco2)
        }

        let xValue = dataline[this.xAxisModel][this.xAxisProp]
        xValue = dataline[this.xAxisModel]

        this.chart1Ch1Data.push({
          x: xValue,
          y: dataline[this.chart1Ch1Model][this.chart1Ch1Prop] * this.chart1Ch1Factor + this.chart1Ch1Offset
        })
      })
      // console.log(this.chartCh1Data)
      this.chart1Ch1Lineseries.add(this.chart1Ch1Data)
    },
    buildGraph () {
      this.chart1 = lightningChart().ChartXY({
        container: this.id1,
        theme: Themes.dark,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false
      })
      this.chart1.setTitle('pressure').setTitleFont(f => f.setSize(10))
      this.chart1.setPadding({ top: 0, bottom: 0, left: 15, right: 30 })
      this.chart1XAxis = this.chart1.getDefaultAxisX()
      this.chart1XAxis.setScrollStrategy(AxisScrollStrategies.fitting)
      this.chart1XAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart1XAxis.setTitleFillStyle(EmptyFill)
      this.chart1XAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart1XAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart1YAxis = this.chart1.getDefaultAxisY()
      this.chart1YAxis.setScrollStrategy(AxisScrollStrategies.fitting)
      this.chart1YAxis.setInterval(this.chart1MinY, this.chart1MaxY)
      this.chart1YAxis.setTitleFillStyle(EmptyFill)
      this.chart1YAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart1YAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart1YAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart1Ch1Lineseries = this.chart1.addLineSeries()
      this.chart1Ch1Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chart1Ch1Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))
    }

  },
  destroyed () {
    delete this.modelEventListener
  },
  beforeMount () {
    this.id1 = 'vent' + Math.floor((Math.random() * 1000) + 1)
  },
  mounted () {
    this.buildGraph()

    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'mes':
          if (message.data.data[0] === 'ready') {
            // this.callback()
          }
          break
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.datalogger_data = message.data.data
              // this.callback_datalogger()
              break
            case 'state':
              this.snapshot = message.data.data
              break
            default:
              break
          }
          break
        case 'rt':
          this.rt_data = message.data.data
          if (this.isEnabled) {
            this.drawRTGraph()
          }
          break
      }
    })

    this.$root.$on('hires_on', () => { this.hires = true })
    this.$root.$on('hires_off', () => { this.hires = false })
  }
}
</script>

<style scoped>
.rectangle {
  display: flex;
  height: 150px;
  width: 100%;
}
.rectangleHide {
  display: none;
  height: 100px;
  width: 100%;
}
.gutter {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
