<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm">
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
     model properties
     </div>
   </div>

    <div v-if="isEnabled">
      <div class="row">
          <q-select class="col" label-color="red-10" v-model="model1" :options="models" filled dense square @input="modelChanged" label="model" style="width: 100%" />
          <q-select class="col" label-color="red-10" v-model="prop1" :options="props" filled dense square @input="propChanged" label="property" style="width: 100%" />
      </div>
      <div v-if="isNumber" class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="propValue1" filled dense square label="current value" />
          <q-input class="col" type="number" label-color="red-10" v-model="propValue1New" filled dense square label="new value" />
      </div>
      <div v-if="!isNumber" class="bg-grey-2 row">
          <q-toggle class="col text-caption" style="width: 100%" label-color="red-10" left-label v-model="propValue1"  label="current state"/>
          <q-toggle class="col text-caption" style="width: 100%" label-color="red-10" left-label v-model="propValue1New" label="new state" />
      </div>

      <div class="row">
          <q-input class="col" type="number" label-color="red-10" v-model="propValue1In" filled dense square label="change in (s)" />
          <q-input class="col" type="number" label-color="red-10" v-model="propValue1At" filled dense square label="change at (s)" />
      </div>

    </div>

  <div v-if="isEnabled" class="row q-ma-md">
        <q-btn dense color="teal-7" style="width: 100%"  @click="updateProps" >QUE MODEL CHANGE</q-btn>
  </div>

  <div v-if="isEnabled" class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline bg-grey-2">
     change list
     </div>
   </div>

  <div v-if="isEnabled" class="row q-mt-es">
      <q-list class="q-ma-sm" highlight separator>
        <q-item v-for="(field, index) in interventionsList" :key='index' dense clickable @click="selectInterventions(field, index)">
          <q-item-label class="text-caption" style="width: 100%">
            at {{ field.atTime }}s. {{ field.model }}.{{ field.prop }} to {{ field.newValue }} in {{ field.inTime }} s.
          </q-item-label>
        </q-item>
      </q-list>
  </div>

  <div v-if="isEnabled" class="row q-ma-md">
    <q-btn dense color="teal-7" @click="executeIntervention" style="width: 100%" >COMMIT</q-btn>
  </div>

</q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      isNumber: true,
      timeToCalculate: 10,
      interventionsList: [],
      modelEventListener: null,
      set1Enabled: true,
      model1: '',
      prop1: '',
      propValue1: 0,
      propValue1New: 0,
      propValue1Bool: false,
      propValue1In: 5,
      propValue1At: 0,
      models: [],
      props: []
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
                this.processModels()
                break
              default:
                break
            }
            break
        }
      }
    })
    this.$model.getProperties(null)
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    selectInterventions (field, index) {
      const found = this.interventionsList.findIndex(element => element === field)
      if (found > -1) {
        this.interventionsList.splice(found, 1)
      }
    },
    executeIntervention () {
      this.interventionsList.forEach(intervention => {
        this.$model.setProperty(intervention.model, intervention.prop, intervention.newValue, intervention.inTime, intervention.atTime, 'abs')
      })
      // this.$model.calculateModel(20)
      this.interventionsList = []
      this.model1 = ''
      this.prop1 = ''
      this.propValue1 = ''
      this.propValue1New = ''
      this.propValue1In = 5
      this.propValue1At = 0
    },
    updateProps () {
      const intervention = {
        model: this.model1,
        prop: this.prop1,
        currentValue: this.propValue1,
        newValue: this.propValue1New,
        inTime: this.propValue1In,
        atTime: this.propValue1At
      }
      this.interventionsList.push(intervention)
    },
    propChanged () {
      if (this.set1Enabled & this.properties[this.model1][this.prop1] !== undefined) {
        if (typeof this.properties[this.model1][this.prop1] === 'number') {
          this.isNumber = true
          this.propValue1 = (this.properties[this.model1][this.prop1]).toFixed(4)
        } else {
          this.isNumber = false
          this.propValue1 = (this.properties[this.model1][this.prop1])
        }
      }
    },
    modelChanged () {
      // the selected model changed so we have to update the property list
      this.prop1 = ''
      this.props.length = 0

      if (this.model1 !== '') {
        Object.keys(this.properties[this.model1]).forEach(propName => {
          if (typeof this.properties[this.model1][propName] === 'number') {
            this.props.push(propName)
            if (this.properties[this.model1][this.prop1] !== undefined) {
              this.isNumber = true
              this.propValue1 = this.properties[this.model1][this.prop1].toFixed(4)
            }
          }

          if (typeof this.properties[this.model1][propName] === 'boolean') {
            this.props.push(propName)
            if (this.properties[this.model1][this.prop1] !== undefined) {
              this.isNumber = false
              this.propValue1 = this.properties[this.model1][this.prop1]
            }
          }
        })
      }
    },
    processModels () {
      this.models.length = 0

      Object.keys(this.properties).forEach(modelName => {
        this.models.push(modelName)
      })
    }
  }

}
</script>

<style>

</style>
