<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        component properties
      </div>
    </div>

    <div v-if="isEnabled" class="q-mt-sm">
      <div class="row q-mt-sm">
        <q-input class="col" label-color="red-10" :value="selectedComponentName" filled dense square label="selected model" style="width: 100%" />
      </div>
    </div>

    <div v-if="isEnabled && propsFound" class="row q-ma-es q-mt-sm">
      <div class="row q-col-gutter-x-md q-ma-sm" >
        <div v-for="(field, index) in selectedComponentPropertyList" :key='index'>
          <q-input v-if="field.type === 'string'" class="text-caption q-pt-sm" :label="field.name" v-model="field.value"></q-input>
          <q-input v-if="field.type === 'number'" type="number" class="text-caption q-pt-sm" :label="field.name" v-model="field.value" ></q-input>
          <q-toggle v-if="field.type === 'boolean'" class="text-caption q-pt-sm" color="teal-7" size="sm" label-color="red-10" :label="field.name" left-label v-model="field.value"/>
        </div>
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
      properties: null,
      standard: 0,
      value: 0,
      propsFound: false,
      model_definition: null,
      selectedComponentName: '',
      selectedComponentPropertyList: []

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
              case 'model_definition':
                this.model_definition = message.data.data
                console.log(message.data.data)
                break
            }
            break
        }
      }
    })

    this.$root.$on('add_to_graph1', (e) => { this.selectNewModelFromOutside(e) })
    this.getModelDefinition()
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
      this.$model.getProperties(null)
    },
    getModelDefinition () {
      this.$model.getModelDefinition(null)
    },
    selectNewModelFromOutside (model) {
      this.selectedComponentName = model
      this.selectedComponentPropertyList = []

      if (this.properties[model].subtype === 'blood_compartment' | this.properties[model].subtype === 'pump') {
        // find the property names stored in the model definition file
        this.model_definition.blood_compartment_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              const prop = {
                name: propName,
                value: this.properties[model][propName],
                type: typeof this.properties[model][propName]
              }
              this.selectedComponentPropertyList.push(prop)
            })
          }
        })
      }
      console.log(this.selectedComponentPropertyList)
      this.propsFound = true
    },

    testMe () {
      this.$model.setPropertyDirect('LV_AA', 'is_enabled', false)
    }
  }

}
</script>

<style>

</style>
