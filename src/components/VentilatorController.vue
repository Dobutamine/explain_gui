<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
     ventilator
     </div>
   </div>

  <div class="row q-mt-es">
    <div :class="graphClass" :id="id1"></div>
  </div>

  <div class="row justify-center q-ma-sm">
    <q-btn-toggle
      color="grey-10"
      toggle-color="teal-10"
      size="sm"
      v-model="graphSelector"
      @input="sourceSelector"
      :options="[
        { label: 'pressure', value: 'pressure' },
        { label: 'flow', value: 'flow' },
        { label: 'volume', value: 'volume' }]"
      />
      <q-checkbox v-model="hires" dense label="hi-res" @input="hiresToggle" style="font-size: 12px" class="q-ml-md"/>
  </div>

   <div class="q-gutter-xs row q-mb-sm justify-center">
      <q-card v-if="!hfov && !volumeGaranteed" class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">Pinsp</div>
        <q-knob :min="0" :max="40" v-model="vent_set_pip" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5"  @input="changePIP"/>
        <div class="q-mt-sm" style="font-size: 8px">cmH2o</div>
      </q-card>
      <q-card v-if="!hfov && volumeGaranteed" class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">Pmax</div>
        <q-knob :min="0" :max="40" v-model="vent_set_max_pip" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5"  @input="changeMaxPIP"/>
        <div class="q-mt-sm" style="font-size: 8px">cmH2o</div>
      </q-card>
      <q-card v-if="!hfov" class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">PEEP</div>
        <q-knob :min="0" :max="20" v-model="vent_set_peep" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" @input="changePEEP"/>
        <div class="q-mt-sm" style="font-size: 8px">cmH2o</div>
      </q-card>
      <q-card v-if="!hfov && volumeGaranteed " class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">TV</div>
        <q-knob :min="0" :max="50" v-model="vent_set_target_tv" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" @input="changeTV"/>
        <div class="q-mt-sm" style="font-size: 8px">ml</div>
      </q-card>
      <q-card class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">{{labelFreq}}</div>
        <q-knob :min="0" :max="70" v-model="vent_set_freq" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" @input="changeFrequency"/>
        <div class="q-mt-sm" style="font-size: 8px">/min</div>
      </q-card>
      <q-card v-if="!hfov" class="q-pa-sm q-ma-sm" bordered >
        <div class="q-mb-sm" style="font-size: 12px">I-time</div>
        <q-knob :min="0.1" :max="1" v-model="vent_set_tin" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" :step="0.05" @input="changeFrequency"/>
        <div class="q-mt-sm" style="font-size: 8px">sec</div>
      </q-card>
      <q-card v-if="!hfov" class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">I-flow</div>
        <q-knob :min="0" :max="20" v-model="vent_set_insp_flow" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" @input="changeInspFlow"/>
        <div class="q-mt-sm" style="font-size: 8px">l/min</div>
      </q-card>
      <q-card class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">FiO2</div>
        <q-knob :min="21" :max="120" v-model="vent_set_fio2" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" @input="changeFiO2"/>
        <div class="q-mt-sm" style="font-size: 8px">%</div>
      </q-card>
      <q-card class="q-pa-sm q-ma-sm" bordered>
        <div class="q-mb-sm" style="font-size: 12px">Trigger</div>
        <q-knob :min="0.1" :max="10" v-model="vent_set_trigger_volume" :step="0.05" show-value size="lg" :thickness="0.22" color="teal-10" track-color="grey-5" @input="changerTrigger"/>
        <div class="q-mt-sm" style="font-size: 8px">ml</div>
      </q-card>
    </div>

    <div class="row justify-center q-ma-sm">
      <q-btn-toggle
      color="grey-10"
      toggle-color="red-10"
      size="sm"
      v-model="ventModeSelector"
      @input="changeVentilatorMode"
      :options="fabianOptions"
      />
      <q-toggle class="q-mt-es text-overline" v-model="volumeGaranteed" size="sm" color="red-10" @input="changeVolumeGaranteed">volume garanteed</q-toggle>
    </div>

        <div class="row q-mt-lg">
            <q-input class="col" v-model="vent_plateau_pressure" filled dense square label="peak pressure (cmH2O)" style="font-size: 14px"  />
            <q-input class="col" v-model="vent_mean" filled dense square label="mean pressure (cmH2O)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_peep" filled dense square label="peep (cmH2O)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_minute_volume" filled dense square label="minute volume (l/min)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_tidal_volume" filled dense square label="tidal volume (l)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_freq" filled dense square label="frequency (/min)" style="font-size: 14px" />
        </div>
        <div class="row">
          <q-input class="col" v-model="vent_fio2" filled dense square label="fio2 (%)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_leak" filled dense square label="leak (%)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_ie_ratio" filled dense square label="I:E" style="font-size: 14px" />
            <q-input class="col" v-model="vent_exp_time" filled dense square label="exp time (s)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_insp_flow" filled dense square label="insp flow (l/min)" style="font-size: 14px" />
            <q-input class="col" v-model="vent_tin" filled dense square label="i-time" style="font-size: 14px" />
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
      id1: 'chart',
      style: { width: '200px', height: '200px' },
      graphClass: 'rectangle',
      componentKey: 0,
      box: false,
      isEnabled: true,
      rtFrame: 3,
      hires: false,
      autoScale: false,
      graphSelector: 'pressure',
      ventModeSelector: 'simv',
      hfov: false,
      volumeGaranteed: false,
      timeCyclingSelector: 'time',
      xAxisModel: 'time',
      xAxisProp: 'none',
      xAxisModels: [],
      xAxisProps: [],
      labelFreq: 'Fbackup',
      fabianOptions: [
        { label: 'SIPPV', value: 'sippv' },
        { label: 'SIMV', value: 'simv' },
        { label: 'SIMV+PSV', value: 'simv_psv' },
        { label: 'PSV', value: 'psv' },
        { label: 'HFOV', value: 'hfov' }],
      chart1: null,
      chart1XAxis: null,
      chart1YAxis: null,
      chart1Ch1Lineseries: null,
      chart1Ch1Data: [],
      chart1Ch1Model: 'monitor',
      chart1Ch1Prop: 'vent_pressure_signal',
      chart1Ch1Factor: 1.35951,
      chart1Ch1Offset: 0,
      chart1AutoScale: true,
      chart1MinY: 0,
      chart1MaxY: 100,

      vent_set_max_pip: 20,
      vent_set_pip: 20,
      vent_set_peep: 5,
      vent_set_tin: 0.4,
      vent_set_freq: 50,
      vent_set_target_tv: 15,
      vent_set_insp_flow: 8,
      vent_set_fio2: 21,
      vent_set_trigger_volume: 1.2,

      vent_fio2: 21,
      vent_ie_ratio: '1:3',
      vent_peak_presssure: 0,
      vent_plateau_pressure: 0,
      vent_compliance: 0,
      vent_resistance: 0,
      vent_peep: 0,
      vent_freq: 0,
      vent_minute_volume: 0,
      vent_tidal_volume: 0,
      vent_insp_flow: 0,
      vent_exp_flow: 0,
      vent_insp_time: 0,
      vent_exp_time: 0,
      vent_tin: 0.4,
      vent_tex: 1.0,
      vent_mean: 0.0,
      vent_leak: 0,
      etco2: 0,

      modelEventListener: null,
      datalogger_data: null,
      rt_data: null,
      properties: null,
      selectedChannel: 1,

      prevTime: 0
    }
  },
  methods: {
    onResize (size) {
      if (this.chart1) {
        this.chart1.engine.renderFrame(size.width, 250)
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
    hiresToggle () {
      if (this.hires) {
        this.$model.setDataloggerInterval(0.005)
        this.$root.$emit('hires_on')
      } else {
        this.$model.setDataloggerInterval(0.015)
        this.$root.$emit('hires_off')
      }
    },
    sourceSelector () {
      switch (this.graphSelector) {
        case 'pressure':
          this.xAxisModel = 'time'
          this.xAxisProp = 'none'
          this.chart1Ch1Model = 'monitor'
          this.chart1Ch1Prop = 'vent_pressure_signal'
          this.chart1YAxis.setScrollStrategy(AxisScrollStrategies.Numeric)
          this.chart1YAxis.setInterval(this.chart1MinY, this.chart1MaxY)
          break
        case 'flow':
          this.xAxisModel = 'time'
          this.xAxisProp = 'none'
          this.chart1Ch1Model = 'monitor'
          this.chart1Ch1Prop = 'vent_flow_signal'
          this.chart1YAxis.setScrollStrategy(AxisScrollStrategies.fitting)
          break
        case 'volume':
          this.xAxisModel = 'time'
          this.xAxisProp = 'none'
          this.chart1Ch1Model = 'monitor'
          this.chart1Ch1Prop = 'vent_volume_signal'
          this.chart1YAxis.setScrollStrategy(AxisScrollStrategies.fitting)
          break
      }
    },
    changeTV () {
      if (this.ventModeSelector !== 'hfov') {
        this.$model.setPropertyDirect('ventilator', 'target_tidal_volume', this.vent_set_target_tv / 1000)
        this.$model.setPropertyDirect('ventilator', 'max_pip', this.vent_set_max_pip / 1.35951)
      }
    },
    changeVolumeGaranteed () {
      if (this.ventModeSelector !== 'hfov') {
        if (this.volumeGaranteed) {
          this.$model.setPropertyDirect('ventilator', 'target_tidal_volume', this.vent_set_target_tv / 1000)
          this.$model.setPropertyDirect('ventilator', 'max_pip', this.vent_set_max_pip / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'volume_garanteed', this.volumeGaranteed)
        } else {
          this.$model.setPropertyDirect('ventilator', 'volume_garanteed', this.volumeGaranteed)
          this.$model.setPropertyDirect('ventilator', 'pip', this.vent_set_pip / 1.35951)
        }
      }
    },
    changerTrigger () {
      this.$model.setPropertyDirect('ventilator', 'trigger_volume', this.vent_set_trigger_volume / 1000)
    },
    changeFiO2 () {
      this.$model.setPropertyByFunction('ventilator', 'setFiO2', this.vent_set_fio2 / 100)
    },
    changeVentilatorMode () {
      switch (this.ventModeSelector) {
        case 'sippv':
          this.hfov = false
          this.$model.setPropertyDirect('ventilator', 'max_pip', this.vent_set_max_pip / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'pip', this.vent_set_pip / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'peep', this.vent_set_peep / 1.35951)
          this.$model.setPropertyDirect('ventilator', 't_in', this.vent_set_tin)
          this.$model.setPropertyDirect('ventilator', 't_ex', (60 / this.vent_set_freq) - this.vent_set_tin)
          this.$model.setPropertyDirect('ventilator', 'target_tidal_volume', this.vent_set_target_tv / 1000)
          this.$model.setPropertyDirect('ventilator', 'cycling_mode', 'time')
          this.$model.setPropertyDirect('ventilator', 'ventilator_mode', 'pressure')
          this.$model.setPropertyDirect('ventilator', 'mandatory_mode', false)
          this.labelFreq = 'Fbackup'

          break
        case 'simv':
          this.hfov = false
          this.$model.setPropertyDirect('ventilator', 'max_pip', this.vent_set_max_pip / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'pip', this.vent_set_pip / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'peep', this.vent_set_peep / 1.35951)
          this.$model.setPropertyDirect('ventilator', 't_in', this.vent_set_tin)
          this.$model.setPropertyDirect('ventilator', 't_ex', (60 / this.vent_set_freq) - this.vent_set_tin)
          this.$model.setPropertyDirect('ventilator', 'target_tidal_volume', this.vent_set_target_tv / 1000)
          this.$model.setPropertyDirect('ventilator', 'cycling_mode', 'time')
          this.$model.setPropertyDirect('ventilator', 'ventilator_mode', 'pressure')
          this.$model.setPropertyDirect('ventilator', 'mandatory_mode', true)
          this.labelFreq = 'Freq'
          break
        case 'psv':
          this.$model.setPropertyDirect('ventilator', 'pip', this.vent_set_pip / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'peep', this.vent_set_peep / 1.35951)
          this.$model.setPropertyDirect('ventilator', 'cycling_mode', 'flow')
          this.$model.setPropertyDirect('ventilator', 'ventilator_mode', 'pressure')
          this.$model.setPropertyDirect('ventilator', 'target_tidal_volume', this.vent_set_target_tv / 1000)
          this.$model.setPropertyDirect('ventilator', 'mandatory_mode', false)
          this.hfov = false
          break
        case 'hfov':
          this.hfov = true
      }
    },
    changeFrequency () {
      if (this.ventModeSelector !== 'hfov') {
        // first calculate the expiration time from the inspiration time
        const newTex = (60 / this.vent_set_freq) - this.vent_set_tin

        this.$model.setPropertyDirect('ventilator', 't_in', this.vent_set_tin)
        this.$model.setPropertyDirect('ventilator', 't_ex', newTex)
      }
    },
    changeMaxPIP () {
      if (this.ventModeSelector !== 'hfov') {
        if (this.vent_set_max_pip > this.vent_set_peep + 2) {
          this.$model.setPropertyDirect('ventilator', 'max_pip', this.vent_set_pip / 1.35951)
        }
      }
    },
    changePIP () {
      if (this.ventModeSelector !== 'hfov') {
        if (this.vent_set_pip > this.vent_set_peep + 2) {
          this.$model.setPropertyDirect('ventilator', 'pip', this.vent_set_pip / 1.35951)
        }
      }
    },
    changePEEP () {
      if (this.ventModeSelector !== 'hfov') {
        this.$model.setPropertyDirect('ventilator', 'peep', this.vent_set_peep / 1.35951)
      }
    },
    changeInspFlow () {
      if (this.ventModeSelector !== 'hfov') {
        this.$model.setPropertyDirect('ventilator', 'insp_flow', this.vent_set_insp_flow)
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
        let xValue = dataline[this.xAxisModel][this.xAxisProp]
        xValue = dataline[this.xAxisModel]

        this.chart1Ch1Data.push({
          x: xValue,
          y: dataline[this.chart1Ch1Model][this.chart1Ch1Prop] * this.chart1Ch1Factor + this.chart1Ch1Offset
        })
      })
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

        let xValue = dataline[this.xAxisModel][this.xAxisProp]
        xValue = dataline[this.xAxisModel]

        this.chart1Ch1Data.push({
          x: xValue,
          y: dataline[this.chart1Ch1Model][this.chart1Ch1Prop] * this.chart1Ch1Factor + this.chart1Ch1Offset
        })
      })
      this.chart1Ch1Lineseries.add(this.chart1Ch1Data)
    },
    updateMonitorRealtime (data) {
      if (data.time - this.prevTime > 1) {
        this.prevTime = data.time
        this.vent_peak_presssure = ((data.monitor.vent_peak_presssure) * 1.35951).toFixed(1)

        if (this.graphSelector === 'pressure') {
          const newY = parseInt(this.vent_peak_presssure) + 0.25 * parseInt(this.vent_peak_presssure)
          this.chart1MaxY = newY
          this.chart1YAxis.setInterval(this.chart1MinY, newY)
        }
        this.vent_plateau_pressure = ((data.monitor.vent_plateau_pressure) * 1.35951).toFixed(1)
        this.vent_compliance = (data.monitor.vent_compliance).toFixed(3)
        this.vent_resistance = (data.monitor.vent_resistance).toFixed(3)
        this.vent_peep = ((data.monitor.vent_peep) * 1.35951).toFixed(1)
        this.vent_freq = (data.monitor.vent_freq).toFixed(0)
        this.vent_minute_volume = (data.monitor.vent_minute_volume).toFixed(1)
        this.vent_tidal_volume = ((data.monitor.vent_tidal_volume) * 1000).toFixed(1)
        this.vent_insp_flow = (data.monitor.vent_insp_flow).toFixed(1)
        this.vent_exp_flow = (data.monitor.vent_exp_flow).toFixed(1)
        this.vent_insp_time = (data.monitor.vent_insp_time).toFixed(1)
        this.vent_exp_time = (data.monitor.vent_exp_time).toFixed(1)
        this.vent_mean = (((this.vent_insp_time * this.vent_freq) / 60) * ((data.monitor.vent_peak_presssure * 1.35951) - (data.monitor.vent_peep * 1.35951)) + (data.monitor.vent_peep * 1.35951)).toFixed(1)
        this.vent_leak = ((1 - data.monitor.vent_tidal_volume / data.monitor.vent_tidal_volume_insp) * 100).toFixed(1)
        this.vent_ie_ratio = `1: ${(data.monitor.vent_exp_time / data.monitor.vent_insp_time).toFixed(1)}`
        this.vent_fio2 = Math.ceil(data.monitor.vent_fio2 * 100)
        this.vent_tin = (data.monitor.vent_insp_time).toFixed(1)
      }
    },
    buildGraph () {
      this.chart1 = lightningChart().ChartXY({
        container: this.id1,
        theme: Themes.dark,
        disableAnimations: false,
        responsive: true,
        maintainAspectRatio: false
      })
      console.log(this.chart1.engine.scale)
      this.chart1.setTitle('').setTitleFont(f => f.setSize(10))
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
      this.chart1Ch1Lineseries.setStrokeStyle((style) => style.setFillStyle(new SolidFill({ color: ColorRGBA(200, 0, 0) })))
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
          }
          break
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.datalogger_data = message.data.data
              this.updateMonitorRealtime(message.data.data[message.data.data.length - 1])
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
            this.updateMonitorRealtime(message.data.data[message.data.data.length - 1])
          }
          break
      }
    })

    this.$root.$on('hires_on', () => { this.hires = true })
    this.$root.$on('hires_off', () => { this.hires = false })

    window.addEventListener('onload', console.log('loading'))

    this.changeVentilatorMode()
  }
}
</script>

<style scoped>
.rectangle {
  display: flex;
  height: 250px;
  width: 100%;
}
.rectangleHide {
  display: none;
  height: 250px;
  width: 100%;
}
.gutter {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>
