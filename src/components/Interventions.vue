<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
      <div class="q-ma-es text-overline text-center">
          systemic vascular resistance
      </div>
      <div>
        <q-slider label v-model="svr" dark :min="0" :max="1000" :step="1" color="teal-10" @change="changeSVR"/>
      </div>

      <div class="q-ma-es text-overline text-center" div >
        pulmonary vascular resistance
      </div>
      <div>
        <q-slider label v-model="pvr" dark :min="0" :max="1000" :step="1" color="teal-10" @change="changePVR"/>
      </div>

      <div class="q-ma-es text-overline text-center"  >
        right heart contractility
      </div>
      <div>
        <q-slider label v-model="contractilityRight" dark :min="0" :max="1000" :step="1" color="teal-10" @change="changeContractilityRight"/>
      </div>

      <div class="q-ma-es text-overline text-center"  >
        left heart contractility
      </div>
      <div>
        <q-slider label v-model="contractilityLeft" dark :min="0" :max="1000" :step="1" color="teal-10" @change="changeContractilityLeft"/>
      </div>

      <div class="q-ma-es text-overline text-center"  >
        ductus arteriosus size
      </div>
      <div>
          <q-slider label v-model="pdaSize" dark :min="0" :max="1000" :step="1" color="teal-10" @change="changePDASize"/>
      </div>

      <div class="q-ma-es text-overline text-center"  >
        foramen ovale size
      </div>
      <div>
         <q-slider label v-model="ofoSize" dark :min="0" :max="1000" :step="1" color="teal-10" @change="changeOFOSize"/>
      </div>

  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      svr: 100,
      pvr: 100,
      pdaSize: 100,
      ofoSize: 100,
      contractilityRight: 100,
      contractilityLeft: 100
    }
  },
  methods: {
    changeSVR () {
      if (this.svr <= 0) {
        this.svr = 0.1
      }
      const scaling = this.svr / 100

      this.$model.setPropertyDirect('AD_LB', 'r_for_fac', scaling)
      this.$model.setPropertyDirect('AD_LIVER', 'r_for_fac', scaling)
      this.$model.setPropertyDirect('AD_KIDNEYS', 'r_for_fac', scaling)

      this.$model.setPropertyDirect('AA_UB', 'r_for_fac', scaling)
      this.$model.setPropertyDirect('AA_BRAIN', 'r_for_fac', scaling)
      this.$model.setPropertyDirect('AA_MYO', 'r_for_fac', scaling)

      this.$model.setPropertyDirect('AD_LB', 'r_back_fac', scaling)
      this.$model.setPropertyDirect('AD_LIVER', 'r_back_fac', scaling)
      this.$model.setPropertyDirect('AD_KIDNEYS', 'r_back_fac', scaling)

      this.$model.setPropertyDirect('AA_UB', 'r_back_fac', scaling)
      this.$model.setPropertyDirect('AA_BRAIN', 'r_back_fac', scaling)
      this.$model.setPropertyDirect('AA_MYO', 'r_back_fac', scaling)
    },
    changePVR () {
      if (this.pvr > 0) {
        const scaling = this.pvr / 100

        this.$model.setPropertyDirect('PA_LL', 'r_for_fac', scaling)
        this.$model.setPropertyDirect('PA_LR', 'r_for_fac', scaling)

        this.$model.setPropertyDirect('PA_LR', 'r_back_fac', scaling)
        this.$model.setPropertyDirect('PA_LR', 'r_back_fac', scaling)
      }
    },
    changeContractilityRight () {
      if (this.contractilityRight > 0) {
        const scaling = this.contractilityRight / 100

        this.$model.setPropertyDirect('RA', 'el_max_fac', scaling)
        this.$model.setPropertyDirect('RV', 'el_max_fac', scaling)
      }
    },
    changeContractilityLeft () {
      if (this.contractilityLeft > 0) {
        const scaling = this.contractilityLeft / 100

        this.$model.setPropertyDirect('LA', 'el_max_fac', scaling)
        this.$model.setPropertyDirect('LV', 'el_max_fac', scaling)
      }
    },
    changePDASize () {
      if (this.pdaSize > 0) {
        const scaling = this.pdaSize / 100

        this.$model.setPropertyDirect('PDA', 'r_for_fac', scaling)
        this.$model.setPropertyDirect('PDA', 'r_back_fac', scaling)
      }
    },
    changeOFOSize () {
      if (this.ofoSize > 0) {
        const scaling = this.ofoSize / 100

        this.$model.setPropertyDirect('OFO', 'r_for_fac', scaling)
        this.$model.setPropertyDirect('OFO', 'r_back_fac', scaling)
      }
    }
  }
}
</script>

<style>

</style>
