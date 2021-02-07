<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        component properties
      </div>
    </div>

    <div v-if="isEnabled" class="q-mt-sm">
      <div class="row q-mt-sm">
        <q-input class="col" label-color="red-10" :value="currentModel" filled dense square label="selected model" style="width: 100%" />
      </div>
    </div>

    <div v-if="isEnabled && blood_compartment" class="ow q-ma-es q-mt-sm">
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="is_enabled"  label="enabled"/>
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="elMin" filled dense square label="el min" />
          <q-input class="col" type="number" label-color="red-10" v-model="elMax" filled dense square label="el max" />
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="elK1" filled dense square label="elK1" />
          <q-input class="col" type="number" label-color="red-10" v-model="elK2" filled dense square label="elK2" />
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="volU" filled dense square label="unstressed vol" />
          <q-input class="col" type="number" label-color="red-10" v-model="fvatp" filled dense square label="fvatp" />
      </div>
    </div>

    <div v-if="isEnabled && gas_compartment" class="ow q-ma-es q-mt-sm">
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="is_enabled"  label="enabled"/>
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="elMin" filled dense square label="el min" />
          <q-input class="col" type="number" label-color="red-10" v-model="elMax" filled dense square label="el max" />
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="elK1" filled dense square label="elK1" />
          <q-input class="col" type="number" label-color="red-10" v-model="elK2" filled dense square label="elK2" />
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="volU" filled dense square label="unstressed vol" />
          <q-input class="col" type="number" label-color="red-10" v-model="fh2o" filled dense square label="fh2o" />
      </div>
    </div>

    <div v-if="isEnabled && blood_connector" class="ow q-ma-es q-mt-sm">
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="is_enabled"  label="enabled"/>
      </div>
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="no_flow"  label="no flow"/>
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="no_backflow"  label="no backflow"/>
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="rFor" filled dense square label="res forward" />
          <q-input class="col" type="number" label-color="red-10" v-model="rBack" filled dense square label="res backward" />
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="rK1" filled dense square label="res K1" />
          <q-input class="col" type="number" label-color="red-10" v-model="rK2" filled dense square label="res K2" />
      </div>
    </div>

    <div v-if="isEnabled && gas_connector" class="ow q-ma-es q-mt-sm">
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="is_enabled"  label="enabled"/>
      </div>
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="no_flow"  label="no flow"/>
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="no_backflow"  label="no backflow"/>
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="rFor" filled dense square label="res forward" />
          <q-input class="col" type="number" label-color="red-10" v-model="rBack" filled dense square label="res backward" />
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="rK1" filled dense square label="res K1" />
          <q-input class="col" type="number" label-color="red-10" v-model="rK2" filled dense square label="res K2" />
      </div>
    </div>

    <div v-if="isEnabled && diffusor" class="ow q-ma-es q-mt-sm">
      <div class="bg-grey-2 row">
          <q-toggle class="col text-caption" color="teal-7" size="sm" style="width: 100%" label-color="red-10"  v-model="is_enabled"  label="enabled"/>
      </div>
      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="dif_o2" filled dense square label="dif_o2" />
          <q-input class="col" type="number" label-color="red-10" v-model="dif_co2" filled dense square label="dif_co2" />
      </div>
    </div>

  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      modelEventListener: null,
      currentModel: '',
      properties: null,
      standard: 0,
      value: 0,
      blood_compartment: false,
      blood_connector: false,
      gas_compartment: false,
      gas_connector: false,
      diffusor: false,
      is_enabled: false,
      elMin: 0,
      elMax: 0,
      elK1: 0,
      elK2: 0,
      vol: 0,
      volU: 0,
      fvatp: 0,
      rFor: 0,
      rBack: 0,
      rK1: 0,
      rK2: 0,
      fh2o: 0,
      dif_o2: 0.01,
      dif_co2: 0.01,
      no_flow: false,
      no_backflow: false,
      compIsEnabled: false

    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      if (this.isEnabled) {
        switch (message.data.type) {
          case 'data':
            switch (message.data.target) {
              case 'datalogger_output':
                this.$model.getProperties(null)
                break
              case 'props':
                this.properties = message.data.data
                break
              default:
                break
            }
            break
        }
      }
    })

    this.$root.$on('add_to_graph1', (e) => { this.selectNewModelFromOutside(e) })
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
      this.$model.getProperties(null)
    },
    selectNewModelFromOutside (model) {
      this.currentModel = model
      if (this.properties[this.currentModel].subtype === 'blood_compartment' | this.properties[this.currentModel].subtype === 'pump') {
        this.elMin = this.properties[this.currentModel].el_min
        this.elMax = this.properties[this.currentModel].el_max
        this.elK1 = this.properties[this.currentModel].el_k1
        this.elK2 = this.properties[this.currentModel].el_k2
        this.vol = this.properties[this.currentModel].vol
        this.volU = this.properties[this.currentModel].vol_u
        this.fvatp = this.properties[this.currentModel].fvatp
        this.is_enabled = this.properties[this.currentModel].is_enabled
        this.blood_compartment = true
        this.blood_connector = false
        this.gas_compartment = false
        this.gas_connector = false
        this.diffusor = false
      }
      if (this.properties[this.currentModel].subtype === 'gas_compartment') {
        this.elMin = this.properties[this.currentModel].el_min
        this.elMax = this.properties[this.currentModel].el_max
        this.elK1 = this.properties[this.currentModel].el_k1
        this.elK2 = this.properties[this.currentModel].el_k2
        this.vol = this.properties[this.currentModel].vol
        this.volU = this.properties[this.currentModel].vol_u
        this.fh2o = this.properties[this.currentModel].fh2o
        this.is_enabled = this.properties[this.currentModel].is_enabled
        this.blood_compartment = false
        this.blood_connector = false
        this.gas_compartment = true
        this.gas_connector = false
        this.diffusor = false
      }
      if (this.properties[this.currentModel].subtype === 'blood_connector' | this.properties[this.currentModel].subtype === 'valve') {
        this.rFor = this.properties[this.currentModel].r_for
        this.rBack = this.properties[this.currentModel].r_back
        this.rK1 = this.properties[this.currentModel].r_k1
        this.rK2 = this.properties[this.currentModel].r_k2
        this.is_enabled = this.properties[this.currentModel].is_enabled
        this.no_flow = this.properties[this.currentModel].no_flow
        this.no_backflow = this.properties[this.currentModel].no_backflow
        this.blood_compartment = false
        this.blood_connector = true
        this.gas_compartment = false
        this.gas_connector = false
        this.diffusor = false
      }
      if (this.properties[this.currentModel].subtype === 'gas_connector') {
        this.rFor = this.properties[this.currentModel].r_for
        this.rBack = this.properties[this.currentModel].r_back
        this.rK1 = this.properties[this.currentModel].r_k1
        this.rK2 = this.properties[this.currentModel].r_k2
        this.is_enabled = this.properties[this.currentModel].is_enabled
        this.no_flow = this.properties[this.currentModel].no_flow
        this.no_backflow = this.properties[this.currentModel].no_backflow
        this.blood_compartment = false
        this.blood_connector = false
        this.gas_compartment = false
        this.gas_connector = true
        this.diffusor = false
      }
      if (this.properties[this.currentModel].subtype === 'container') {
        this.elMin = this.properties[this.currentModel].el_min
        this.elMax = this.properties[this.currentModel].el_max
        this.elK1 = this.properties[this.currentModel].el_k1
        this.elK2 = this.properties[this.currentModel].el_k2
        this.vol = this.properties[this.currentModel].vol
        this.volU = this.properties[this.currentModel].vol_u
        this.is_enabled = this.properties[this.currentModel].is_enabled
        this.fvatp = '-'
        this.blood_compartment = true
        this.blood_connector = false
        this.gas_compartment = false
        this.gas_connector = false
        this.diffusor = false
      }
      if (this.properties[this.currentModel].subtype === 'exchanger' | this.properties[this.currentModel].subtype === 'diffusor') {
        this.dif_o2 = this.properties[this.currentModel].dif_o2
        this.dif_co2 = this.properties[this.currentModel].dif_co2
        this.is_enabled = this.properties[this.currentModel].is_enabled
        this.blood_compartment = false
        this.blood_connector = false
        this.gas_compartment = false
        this.gas_connector = false
        this.diffusor = true
      }
    },

    testMe () {
      this.$model.setPropertyDirect('LV_AA', 'is_enabled', false)
    }
  }

}
</script>

<style>

</style>
