<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        vital trends
     </div>
   </div>

  <div class="row q-mt-es">
    <div class="col q-mb-es">
      <div :class="graphClass" :id="id"></div>
    </div>
    <div v-if="isEnabled" class="col-2 q-mt-lg">
      <div class="row q-mt-es">
        <q-input label="HR" label-color="light-green-13" :value="hr" dense></q-input>
      </div>
      <div class="row q-mt-es">
        <q-input label="SpO2" label-color="purple-4" :value="sat_pre" dense></q-input>
      </div>
      <div class="row q-mt-es">
        <q-input label="SpO2" label-color="purple-3" :value="sat_post" dense></q-input>
      </div>
      <div class="row q-mt-es">
        <q-input label="ABP" label-color="red-5" :value="abp" dense></q-input>
      </div>
      <div class="row q-mt-es">
        <q-input label="Resp" :value="resp_rate" dense></q-input>
      </div>
    </div>

  </div>
<q-resize-observer @resize="onResize" />
</q-card>
</template>

<script>
import {
  lightningChart, Themes, EmptyFill, AxisScrollStrategies, AxisTickStrategies, ColorRGBA, SolidFill
} from '@arction/lcjs'

export default {
  data () {
    return {
      id: 'chart',
      graphClass: 'rectangle',
      box: false,
      isEnabled: true,
      showSummary: false,
      chart: null,
      autoScale: false,
      minY: 0,
      maxY: 200,
      xAxisModel: 'time',
      xAxisProp: 'none',
      xAxisModels: [],
      xAxisProps: [],
      scaling: false,
      hires: false,
      rtFrame: 180,
      chartXAxis: null,
      chartYAxis: null,
      chartCh1Lineseries: null,
      chartCh1Data: [],
      chartCh1Model: 'monitor',
      chartCh1Prop: 'heart_rate',
      chartCh1Factor: 1,
      chartCh1Offset: 0,
      chartCh2Lineseries: null,
      chartCh2Data: [],
      chartCh2Model: 'monitor',
      chartCh2Prop: 'saO2_pre',
      chartCh2Factor: 1,
      chartCh2Offset: 0,
      chartCh3Lineseries: null,
      chartCh3Data: [],
      chartCh3Model: 'monitor',
      chartCh3Prop: 'saO2_post',
      chartCh3Factor: 1,
      chartCh3Offset: 0,
      chartCh4Lineseries: null,
      chartCh4Data: [],
      chartCh4Model: 'monitor',
      chartCh4Prop: 'abp_syst',
      chartCh4Factor: 1,
      chartCh4Offset: 0,
      chartCh5Lineseries: null,
      chartCh5Data: [],
      chartCh5Model: 'monitor',
      chartCh5Prop: 'abp_diast',
      chartCh5Factor: 1,
      chartCh5Offset: 0,
      chartCh6Lineseries: null,
      chartCh6Data: [],
      chartCh6Model: 'monitor',
      chartCh6Prop: 'resp_rate',
      chartCh6Factor: 1,
      chartCh6Offset: 0,
      callback: () => {},
      callback_datalogger: this.drawGraph,
      callback_props: this.processProps,
      callback_rt: this.drawRTGraph,
      modelEventListener: null,
      datalogger_data: null,
      rt_data: null,
      snapshot: null,
      properties: null,
      selectedChannel: 1,
      channel1Models: [],
      channel1Props: [],
      channel2Models: [],
      channel2Props: [],
      channel3Models: [],
      channel3Props: [],
      channel4Models: [],
      channel4Props: [],
      channel5Models: [],
      channel5Props: [],
      channel6Models: [],
      channel6Props: [],
      xMin: 0,
      xMax: 0,
      xMean: 0,
      xSD: 0,
      xPerMinute: 0,
      xPerBeat: 0,
      y1Min: 0,
      y1Max: 0,
      y1Mean: 0,
      y1SD: 0,
      y1PerMinute: 0,
      y1PerBeat: 0,
      y2Min: 0,
      y2Max: 0,
      y2Mean: 0,
      y2SD: 0,
      y2PerMinute: 0,
      y2PerBeat: 0,
      y3Min: 0,
      y3Max: 0,
      y3Mean: 0,
      y3SD: 0,
      y3PerMinute: 0,
      y3PerBeat: 0,
      y4Min: 0,
      y4Max: 0,
      y4Mean: 0,
      y4SD: 0,
      y4PerMinute: 0,
      y4PerBeat: 0,
      y5Min: 0,
      y5Max: 0,
      y5Mean: 0,
      y5SD: 0,
      y5PerMinute: 0,
      y5PerBeat: 0,
      y6Min: 0,
      y6Max: 0,
      y6Mean: 0,
      y6SD: 0,
      y6PerMinute: 0,
      y6PerBeat: 0,
      prevTime: 0,
      hr: 0,
      sat_pre: '100%',
      sat_post: '97%',
      abp: '60/40',
      resp_rate: '40',
      etCO2: '-'

    }
  },
  methods: {
    onResize (size) {
      if (this.chart) {
        this.chart.engine.renderFrame(size.width, 350)
      }
    },
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
      if (this.rt_data[0].time - this.prevTime > 1) {
        this.chartCh1Lineseries.clear()
        this.chartCh2Lineseries.clear()
        this.chartCh3Lineseries.clear()
        this.chartCh4Lineseries.clear()
        this.chartCh5Lineseries.clear()
        this.chartCh6Lineseries.clear()

        let samples = parseInt(this.rtFrame / 1)

        if (this.hires) {
          samples = parseInt(this.rtFrame / 1)
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
          this.prevTime = dataline.time
          this.hr = parseInt(dataline.monitor.heart_rate)
          this.abp = `${parseInt(dataline.monitor.abp_syst)}/${parseInt(dataline.monitor.abp_diast)} (${parseInt(dataline.monitor.abp_mean)})`
          this.sat_pre = parseInt(dataline.monitor.saO2_pre)
          this.sat_post = parseInt(dataline.monitor.saO2_post)
          this.resp_rate = parseInt(dataline.monitor.resp_rate)
          this.etCO2 = parseInt(dataline.monitor.etco2)

          let xValue = dataline[this.xAxisModel][this.xAxisProp]
          xValue = dataline[this.xAxisModel]

          this.chartCh1Data.push({
            x: xValue,
            y: dataline[this.chartCh1Model][this.chartCh1Prop] * this.chartCh1Factor + this.chartCh1Offset
          })

          this.chartCh2Data.push({
            x: xValue,
            y: dataline[this.chartCh2Model][this.chartCh2Prop] * this.chartCh2Factor + this.chartCh2Offset
          })

          this.chartCh3Data.push({
            x: xValue,
            y: dataline[this.chartCh3Model][this.chartCh3Prop] * this.chartCh3Factor + this.chartCh3Offset
          })

          this.chartCh4Data.push({
            x: xValue,
            y: dataline[this.chartCh4Model][this.chartCh4Prop] * this.chartCh4Factor + this.chartCh4Offset
          })

          this.chartCh5Data.push({
            x: xValue,
            y: dataline[this.chartCh5Model][this.chartCh5Prop] * this.chartCh5Factor + this.chartCh5Offset
          })

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
      }
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
          this.abp = `${parseInt(dataline.monitor.abp_syst)}/${parseInt(dataline.monitor.abp_diast)} (${parseInt(dataline.monitor.abp_mean)})`
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

        this.chartCh2Data.push({
          x: xValue,
          y: dataline[this.chartCh2Model][this.chartCh2Prop] * this.chartCh2Factor + this.chartCh2Offset
        })

        this.chartCh3Data.push({
          x: xValue,
          y: dataline[this.chartCh3Model][this.chartCh3Prop] * this.chartCh3Factor + this.chartCh3Offset
        })

        this.chartCh4Data.push({
          x: xValue,
          y: dataline[this.chartCh4Model][this.chartCh4Prop] * this.chartCh4Factor + this.chartCh4Offset
        })

        this.chartCh5Data.push({
          x: xValue,
          y: 1 - dataline[this.chartCh5Model][this.chartCh5Prop] * this.chartCh5Factor + this.chartCh5Offset
        })

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
      this.chart = lightningChart().ChartXY({
        container: this.id,
        theme: Themes.dark,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false
      })
      this.chart.setTitle('')
      this.chart.setPadding({ top: 0, bottom: 0, left: 15, right: 5 })
      this.chartXAxis = this.chart.getDefaultAxisX()
      this.chartXAxis.setScrollStrategy(AxisScrollStrategies.fitting)
      this.chartXAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chartXAxis.setTitleFillStyle(EmptyFill)
      this.chartXAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(12))))
      this.chartXAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chartYAxis = this.chart.getDefaultAxisY()
      this.chartYAxis.setScrollStrategy(AxisScrollStrategies.Numeric)
      this.chartYAxis.setInterval(this.minY, this.maxY)
      this.chartYAxis.setTitleFillStyle(EmptyFill)
      this.chartYAxis.setTickStrategy(AxisTickStrategies.Numeric)
      this.chartYAxis.setTickStyle((a) => a.setMajorTickStyle((b) => b.setLabelFont((font) => font.setSize(12))))
      this.chartYAxis.setTickStyle((a) => a.setMinorTickStyle((b) => b.setLabelFont((font) => font.setSize(10))))

      this.chartCh1Lineseries = this.chart.addLineSeries()
      this.chartCh1Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chartCh1Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(0, 200, 0) })))

      this.chartCh2Lineseries = this.chart.addLineSeries()
      this.chartCh2Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chartCh2Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 255) })))

      this.chartCh3Lineseries = this.chart.addLineSeries()
      this.chartCh3Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chartCh3Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(166, 0, 255) })))

      this.chartCh4Lineseries = this.chart.addLineSeries()
      this.chartCh4Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chartCh4Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(255, 0, 0) })))

      this.chartCh5Lineseries = this.chart.addLineSeries()
      this.chartCh5Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chartCh5Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) })))

      this.chartCh6Lineseries = this.chart.addLineSeries()
      this.chartCh6Lineseries.setStrokeStyle((style) => style.setThickness(2))
      this.chartCh6Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(255, 255, 255) })))
    }

  },
  destroyed () {
    delete this.modelEventListener
  },
  beforeMount () {
    this.id = 'test' + Math.floor((Math.random() * 1000) + 1)
  },
  mounted () {
    this.buildGraph()

    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'mes':
          if (message.data.data[0] === 'ready') {
            this.callback()
          }
          break
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.datalogger_data = message.data.data
              this.callback_datalogger()
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
            this.callback_rt()
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
  height: 350px;
  width: 100%;
}
.rectangleHide {
  display: none;
  height: 350px;
  width: 100%;
}
.gutter {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
