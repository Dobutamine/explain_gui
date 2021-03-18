<template>
  <q-card class="q-ma-sm q-pa-sm" bordered>

        <div class="col text-green-13">
          heartrate (bpm)
        </div>
        <div class="col text-h2 text-green-13">
          {{ heartrate }}
        </div>
        <div class="col text-cyan-13">
          sat pre/post (%)
        </div>
         <div class="col text-h2 text-cyan-13">
          {{ sao2_pre }}/{{ sao2_post }}
        </div>
         <div class="col text-red-13">
          abp (mmHg)
        </div>
         <div class="col text-h3 text-red-13">
          {{ abp }}
        </div>
        <div class="col">
          resp rate
        </div>
        <div class="col text-h2">
          {{ resp_rate }}
        </div>
        <div class="col text-yellow-13">
          etco2
        </div>
         <div class="col text-h2 text-yellow-13">
          {{ etco2 }}
        </div>
        <div class="col text-green-13">
          temp
        </div>
         <div class="col text-h2 text-green-13">
          {{ temp }}
        </div>
        <div class="col text-green-13">
          svo2 (svc / ivc)
        </div>
         <div class="col text-h2 text-green-13">
          {{ svo2_svc }} / {{ svo2_ivc }}
        </div>

  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      bloodgasEnabled: true,
      hemodynamicEnabled: true,
      respiratoryEnabled: false,
      modelEventListener: null,
      heartrate: '-',
      abp: '-/-',
      pap: '-/-',
      cvp: '-',
      sao2_pre: '-',
      sao2_post: '-',
      svo2_ivc: '-',
      svo2_svc: '-',
      resp_rate: '-',
      etco2: '-',
      temp: '-',
      ivc_flow: 0,
      svc_flow: 0,
      myo_flow: 0,
      pda_flow: 0,
      ofo_flow: 0,
      vsd_flow: 0,
      ecmo_flow: 0,
      kidney_flow: 0,
      liver_flow: 0,
      brain_flow: 0,
      lungshunt_flow: 0,
      lvo: 0,
      rvo: 0,
      lv_stroke: 0,
      rv_stroke: 0,
      ph: 0,
      po2: 0,
      pco2: 0,
      tidal_volume: 0,
      minute_volume: 0,
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
      datalogger_data: null,
      rtUpdateFreq: 1,
      prevTime: 0
    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'mes':
          if (message.data.data[0] === 'ready') {
          }
          break
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.updateMonitorRealtime(message.data.data[message.data.data.length - 1])
              break
            default:
              break
          }
          break
        case 'rt':
          this.rt_data = message.data.data
          if (this.isEnabled | this.bloodgasEnabled | this.hemodynamicEnabled | this.respiratoryEnabled) {
            this.updateMonitorRealtime(message.data.data[0])
          }
          break
      }
    })
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    updateMonitorDatalogger () {

    },
    checkIsNaN (numberToCheck, rounding) {
      if (typeof numberToCheck !== 'undefined') {
        if (Number.isNaN(numberToCheck)) {
          return '-'
        } else {
          return numberToCheck.toFixed(rounding)
        }
      } else {
        return '-'
      }
    },
    updateMonitorRealtime (data) {
      if (data.time - this.prevTime > 1) {
        this.prevTime = data.time
        if (this.isEnabled) {
          this.heartrate = parseInt(data.monitor.heart_rate)
          if (parseInt(data.monitor.abp_syst) !== -1000) {
            this.abp = `${this.checkIsNaN(parseInt(data.monitor.abp_syst), 0)}/${this.checkIsNaN(parseInt(data.monitor.abp_diast), 0)} (${parseInt(data.monitor.abp_mean)})`
          } else {
            this.abp = '-'
          }
          if (parseInt(data.monitor.pap_syst) !== -1000) {
            this.pap = `${this.checkIsNaN(parseInt(data.monitor.pap_syst), 0)}/${this.checkIsNaN(parseInt(data.monitor.pap_diast), 0)} (${parseInt(data.monitor.pap_mean)})`
          } else {
            this.pap = '-'
          }
          this.sao2_pre = this.checkIsNaN(parseInt(data.monitor.saO2_pre), 0)
          this.sao2_post = this.checkIsNaN(parseInt(data.monitor.saO2_post), 0)
          this.resp_rate = this.checkIsNaN(parseInt(data.monitor.resp_rate), 0)
          this.etco2 = this.checkIsNaN(parseInt(data.monitor.etco2), 0)
          this.temp = this.checkIsNaN((data.monitor.temperature), 1)
          this.cvp = this.checkIsNaN((data.monitor.cvp), 1)
          this.svo2_ivc = this.checkIsNaN((data.monitor.svO2), 0)
          this.svo2_svc = this.checkIsNaN((data.monitor.svO2_svc), 0)
        }

        if (this.bloodgasEnabled) {
          this.ph = this.checkIsNaN((data.monitor.ph), 2)
          this.po2 = this.checkIsNaN((data.monitor.pao2), 0)
          this.pco2 = this.checkIsNaN((data.monitor.paco2), 0)
        }

        if (this.hemodynamicEnabled) {
          this.ivc_flow = this.checkIsNaN((data.monitor.ivc_flow), 4)
          this.svc_flow = this.checkIsNaN((data.monitor.svc_flow), 4)
          this.myo_flow = this.checkIsNaN((data.monitor.myo_flow), 4)

          this.pda_flow = this.checkIsNaN((data.monitor.pda_flow), 4)
          this.ofo_flow = this.checkIsNaN((data.monitor.ofo_flow), 4)
          this.vsd_flow = this.checkIsNaN((data.monitor.vsd_flow), 4)
          this.lungshunt_flow = this.checkIsNaN((data.monitor.lungshunt_flow), 4)
          this.ecmo_flow = this.checkIsNaN((data.monitor.ecmo_flow), 4)

          this.kidney_flow = this.checkIsNaN((data.monitor.kidney_flow), 4)
          this.liver_flow = this.checkIsNaN((data.monitor.liver_flow), 4)
          this.brain_flow = this.checkIsNaN((data.monitor.brain_flow), 4)

          this.lvo = this.checkIsNaN((data.monitor.lvo), 4)
          this.lv_stroke = this.checkIsNaN((data.monitor.lv_stroke), 4)
          this.rvo = this.checkIsNaN((data.monitor.rvo), 4)
          this.rv_stroke = this.checkIsNaN((data.monitor.rv_stroke), 4)
        }

        if (this.respiratoryEnabled) {
          this.tidal_volume = this.checkIsNaN((data.monitor.tidal_volume), 4)
          this.minute_volume = this.checkIsNaN((data.monitor.minute_volume), 4)
        }
      }
    }
  }

}
</script>

<style>

</style>
