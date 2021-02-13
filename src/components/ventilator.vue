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
  <div class="row q-mt-es">
    <div :class="graphClass" :id="id2"></div>
  </div>
  <div class="row q-mt-es">
    <div :class="graphClass" :id="id3"></div>
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
      id2: 'chart',
      id3: 'chart',
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
      chart1Ch1Model: 'ventilator',
      chart1Ch1Prop: 'pressure',
      chart1Ch1Factor: 1,
      chart1Ch1Offset: 90,
      chart1AutoScale: true,
      chart1MinY: 0,
      chart1MaxY: 100,

      chart2: null,
      chart2XAxis: null,
      chart2YAxis: null,
      chart2Ch1Lineseries: null,
      chart2Ch1Data: [],
      chart2Ch1Model: 'ventilator',
      chart2Ch1Prop: 'flow',
      chart2Ch1Factor: 1,
      chart2Ch1Offset: 90,
      chart2AutoScale: true,
      chart2MinY: 0,
      chart2MaxY: 100,

      chart3: null,
      chart3XAxis: null,
      chart3YAxis: null,
      chart3Ch1Lineseries: null,
      chart3Ch1Data: [],
      chart3Ch1Model: 'ventilator',
      chart3Ch1Prop: 'volume',
      chart3Ch1Factor: 1,
      chart3Ch1Offset: 90,
      chart3AutoScale: true,
      chart3MinY: 0,
      chart3MaxY: 100,

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
      this.chart2Ch1Lineseries.clear()
      this.chart3Ch1Lineseries.clear()

      let samples = parseInt(this.rtFrame / 0.015)

      if (this.hires) {
        samples = parseInt(this.rtFrame / 0.005)
      }

      const overrunCh1 = this.chartCh1Data.length - samples
      if (overrunCh1 > 0) {
        this.chartCh1Data.splice(0, overrunCh1)
        this.chartCh2Data.splice(0, overrunCh1)
        this.chartCh3Data.splice(0, overrunCh1)
        this.chartCh4Data.splice(0, overrunCh1)
        this.chartCh5Data.splice(0, overrunCh1)
        this.chartCh6Data.splice(0, overrunCh1)
      }

      this.rt_data.forEach(dataline => {
        if (dataline.time - this.prevTime > 1) {
          this.prevTime = dataline.time
          this.hr = parseInt(dataline.monitor.heart_rate)
          this.abp = `${parseInt(dataline.monitor.abp_syst)}/${parseInt(dataline.monitor.abp_diast)}`
          this.sat_pre = parseInt(dataline.monitor.saO2_pre)
          this.sat_post = parseInt(dataline.monitor.saO2_post)
          this.resp_rate = parseInt(dataline.monitor.resp_rate)
          this.etCO2 = parseInt(dataline.monitor.etco2)
        }

        let xValue = dataline[this.xAxisModel][this.xAxisProp]
        xValue = dataline[this.xAxisModel]

        this.chartCh1Data.push({
          x: xValue,
          y: dataline[this.chartCh1Model][this.chartCh1Prop] * this.chartCh1Factor + this.chartCh1Offset
        })

        this.chartCh2Factor = 0.3
        this.chartCh2Offset = 70 - dataline.monitor.abp_diast * this.chartCh2Factor
        this.chartCh2Data.push({
          x: xValue,
          y: dataline[this.chartCh2Model][this.chartCh2Prop] * this.chartCh2Factor + this.chartCh2Offset
        })

        this.chartCh3Factor = 0.3
        this.chartCh3Offset = 54 - dataline.monitor.abp_diast * this.chartCh3Factor
        this.chartCh3Data.push({
          x: xValue,
          y: dataline[this.chartCh3Model][this.chartCh3Prop] * this.chartCh3Factor + this.chartCh3Offset
        })

        this.chartCh4Factor = 0.3
        this.chartCh4Offset = 38 - dataline.monitor.abp_diast * this.chartCh4Factor
        this.chartCh4Data.push({
          x: xValue,
          y: dataline[this.chartCh4Model][this.chartCh4Prop] * this.chartCh4Factor + this.chartCh4Offset
        })

        this.chartCh5Factor = 0.5
        this.chartCh5Offset = 20
        this.chartCh5Data.push({
          x: xValue,
          y: 1 - dataline[this.chartCh5Model][this.chartCh5Prop] * this.chartCh5Factor + this.chartCh5Offset
        })

        this.chartCh6Factor = 0.3
        this.chartCh6Offset = 0
        this.chartCh6Data.push({
          x: xValue,
          y: dataline[this.chartCh6Model][this.chartCh6Prop] * this.chartCh6Factor + this.chartCh6Offset
        })
      })
      // console.log(this.chartCh1Data)
      this.chartCh1Lineseries.add(this.chartCh1Data)
      this.chartCh2Lineseries.add(this.chartCh2Data)
      this.chartCh3Lineseries.add(this.chartCh3Data)
      this.chartCh4Lineseries.add(this.chartCh4Data)
      this.chartCh5Lineseries.add(this.chartCh5Data)
      this.chartCh6Lineseries.add(this.chartCh6Data)
    },
    drawGraph () {
      this.chartCh1Lineseries.clear()
      this.chartCh2Lineseries.clear()
      this.chartCh3Lineseries.clear()
      this.chartCh4Lineseries.clear()
      this.chartCh5Lineseries.clear()
      this.chartCh6Lineseries.clear()

      this.chartCh1Data.length = 0
      this.chartCh2Data.length = 0
      this.chartCh3Data.length = 0
      this.chartCh4Data.length = 0
      this.chartCh5Data.length = 0
      this.chartCh6Data.length = 0

      this.datalogger_data.forEach(dataline => {
        let samples = parseInt(this.rtFrame / 0.015)

        if (this.hires) {
          samples = parseInt(this.rtFrame / 0.005)
        }

        const overrunCh1 = this.chartCh1Data.length - samples
        if (overrunCh1 > 0) {
          this.chartCh1Data.splice(0, overrunCh1)
          this.chartCh2Data.splice(0, overrunCh1)
          this.chartCh3Data.splice(0, overrunCh1)
          this.chartCh4Data.splice(0, overrunCh1)
          this.chartCh5Data.splice(0, overrunCh1)
          this.chartCh6Data.splice(0, overrunCh1)
        }

        if (dataline.time - this.prevTime > 1) {
          this.prevTime = dataline.time
          this.hr = parseInt(dataline.monitor.heart_rate)
          this.abp = `${parseInt(dataline.monitor.abp_syst)}/${parseInt(dataline.monitor.abp_diast)}`
          this.sat_pre = parseInt(dataline.monitor.saO2_pre)
          this.sat_post = parseInt(dataline.monitor.saO2_post)
          this.resp_rate = parseInt(dataline.monitor.resp_rate)
          this.etCO2 = parseInt(dataline.monitor.etco2)
        }

        let xValue = dataline[this.xAxisModel][this.xAxisProp]
        xValue = dataline[this.xAxisModel]

        this.chartCh1Data.push({
          x: xValue,
          y: dataline[this.chartCh1Model][this.chartCh1Prop] * this.chartCh1Factor + this.chartCh1Offset
        })

        this.chartCh2Factor = 0.3
        this.chartCh2Offset = 70 - dataline.monitor.abp_diast * this.chartCh2Factor
        this.chartCh2Data.push({
          x: xValue,
          y: dataline[this.chartCh2Model][this.chartCh2Prop] * this.chartCh2Factor + this.chartCh2Offset
        })

        this.chartCh3Factor = 0.3
        this.chartCh3Offset = 54 - dataline.monitor.abp_diast * this.chartCh3Factor
        this.chartCh3Data.push({
          x: xValue,
          y: dataline[this.chartCh3Model][this.chartCh3Prop] * this.chartCh3Factor + this.chartCh3Offset
        })

        this.chartCh4Factor = 0.3
        this.chartCh4Offset = 38 - dataline.monitor.abp_diast * this.chartCh4Factor
        this.chartCh4Data.push({
          x: xValue,
          y: dataline[this.chartCh4Model][this.chartCh4Prop] * this.chartCh4Factor + this.chartCh4Offset
        })

        this.chartCh5Factor = 0.5
        this.chartCh5Offset = 20
        this.chartCh5Data.push({
          x: xValue,
          y: 1 - dataline[this.chartCh5Model][this.chartCh5Prop] * this.chartCh5Factor + this.chartCh5Offset
        })

        this.chartCh6Factor = 0.3
        this.chartCh6Offset = 0
        this.chartCh6Data.push({
          x: xValue,
          y: dataline[this.chartCh6Model][this.chartCh6Prop] * this.chartCh6Factor + this.chartCh6Offset
        })
      })
      // console.log(this.chartCh1Data)
      this.chartCh1Lineseries.add(this.chartCh1Data)
      this.chartCh2Lineseries.add(this.chartCh2Data)
      this.chartCh3Lineseries.add(this.chartCh3Data)
      this.chartCh4Lineseries.add(this.chartCh4Data)
      this.chartCh5Lineseries.add(this.chartCh5Data)
      this.chartCh6Lineseries.add(this.chartCh6Data)
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
      this.chart1YAxis.setScrollStrategy(AxisScrollStrategies.Numeric)
      this.chart1YAxis.setInterval(this.chart1MinY, this.chart1MaxY)
      this.chart1YAxis.setTitleFillStyle(EmptyFill)
      this.chart1YAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart1YAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart1YAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart1Ch1Lineseries = this.chart1.addLineSeries()
      this.chart1Ch1Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chart1Ch1Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

      this.chart2 = lightningChart().ChartXY({
        container: this.id2,
        theme: Themes.dark,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false
      })
      this.chart2.setTitle('flow').setTitleFont(f => f.setSize(10))
      this.chart2.setPadding({ top: 0, bottom: 0, left: 15, right: 30 })
      this.chart2XAxis = this.chart2.getDefaultAxisX()
      this.chart2XAxis.setScrollStrategy(AxisScrollStrategies.fitting)
      this.chart2XAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart2XAxis.setTitleFillStyle(EmptyFill)
      this.chart2XAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart2XAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart2YAxis = this.chart2.getDefaultAxisY()
      this.chart2YAxis.setScrollStrategy(AxisScrollStrategies.Numeric)
      this.chart2YAxis.setInterval(this.chart2MinY, this.chart2MaxY)
      this.chart2YAxis.setTitleFillStyle(EmptyFill)
      this.chart2YAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart2YAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart2YAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart2Ch1Lineseries = this.chart2.addLineSeries()
      this.chart2Ch1Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chart2Ch1Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

      this.chart3 = lightningChart().ChartXY({
        container: this.id3,
        theme: Themes.dark,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false
      })
      this.chart3.setTitle('volume').setTitleFont(f => f.setSize(10))
      this.chart3.setPadding({ top: 0, bottom: 0, left: 15, right: 30 })
      this.chart3XAxis = this.chart3.getDefaultAxisX()
      this.chart3XAxis.setScrollStrategy(AxisScrollStrategies.fitting)
      this.chart3XAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart3XAxis.setTitleFillStyle(EmptyFill)
      this.chart3XAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart3XAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart3YAxis = this.chart3.getDefaultAxisY()
      this.chart3YAxis.setScrollStrategy(AxisScrollStrategies.Numeric)
      this.chart3YAxis.setInterval(this.chart3MinY, this.chart3MaxY)
      this.chart3YAxis.setTitleFillStyle(EmptyFill)
      this.chart3YAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chart3YAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))
      this.chart3YAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chart3Ch1Lineseries = this.chart3.addLineSeries()
      this.chart3Ch1Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chart3Ch1Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))
    }

  },
  destroyed () {
    delete this.modelEventListener
  },
  beforeMount () {
    this.id1 = 'vent' + Math.floor((Math.random() * 1000) + 1)
    this.id2 = 'vent' + Math.floor((Math.random() * 1000) + 1)
    this.id3 = 'vent' + Math.floor((Math.random() * 1000) + 1)
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
            // this.callback_rt()
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
