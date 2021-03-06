<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
        model properties
      </div>
    </div>

    <div v-if="isEnabled && !newComponentMode" class="q-mt-md">
      <div class="row q-mt-sm">
        <q-select class="col" v-model="selectedComponentName" :value="selectedComponentName" :options="modelList" @input="selectNewModelFromOutside" filled dense square label="selected model" style="width: 100%" />
      </div>
    </div>

   <div v-if="isEnabled && newComponentMode && !propsFound" class="row q-mt-es q-ml-md q-mr-sm q-mb-md">
    <q-select :options="componentCategories" class="col q-mr-sm" v-model="newComponentSelectedCategory" @input="newComponentCategorySelected" label="select component category">
    </q-select>
  </div>

   <div v-if="isEnabled && newComponentMode && !propsFound && !configureComponentMode" class="row q-ma-md q-mt-sm">
        <q-btn class="col q-mr-sm" dense color="negative" @click="returnToStart">
          <q-icon name="cancel" class="text-white" style="font-size: 1rem;" />
        </q-btn>
  </div>

  <div v-if="isEnabled && configureComponentMode && !propsFound" class="row q-ma-es q-mt-sm">

      <div  class="row q-col-gutter-x-md q-ma-sm" >
          <div v-for="(field, index) in newComponentProps" :key='index'>
            <q-input v-if="field.type === 'string'" class="text-caption" :label="field.name" v-model="field.value" @input="changeProperties($event, field.name)"></q-input>
            <q-input v-if="field.type === 'number'" type="number" class="text-caption" :label="field.name" v-model="field.value" @input="changeProperties($event, field.name)" ></q-input>
            <q-toggle v-if="field.type === 'boolean'" class="text-caption q-pt-lg" color="teal-10" size="sm"  :label="field.name" @input="changeProperties($event, field.name)" left-label v-model="field.value"/>
          </div>
      </div>
  </div>

<div v-if="isEnabled && configureComponentMode && !propsFound" class="row q-ma-md q-mt-sm">
        <q-btn class="col q-mr-sm" dense color="negative" @click="returnToStart">
          <q-icon name="cancel" class="text-white" style="font-size: 1rem;" />
        </q-btn>
        <q-btn class="col q-mr-sm" dense color="teal-10">
          <q-icon name="add_to_queue" class="text-white" style="font-size: 1rem;" />
        </q-btn>
  </div>

   <!-- <div v-if="isEnabled && !propsFound && !newComponentMode" class="row q-ma-md">
        <q-btn dense color="teal-10" style="width: 100%" @click="buildNewComponent">build new component</q-btn>
  </div> -->
    <div v-if="isEnabled && propsFound" class="row q-ma-es q-mt-sm">
        <div class="row q-col-gutter-x-md q-ma-sm" >
          <div v-for="(field, index) in selectedComponentPropertyList" :key='index'>
            <q-input v-if="field.type === 'string'" class="text-caption" :label="field.name" v-model="field.value" @input="changeProperties($event, field.name)"></q-input>
            <q-input v-if="field.type === 'number'" type="number" class="text-caption" :label="field.name" v-model="field.value" @input="changeProperties($event, field.name)"></q-input>
            <q-toggle v-if="field.type === 'boolean'" class="text-caption q-pt-lg" color="teal-10" size="sm" label-color="red-10" :label="field.name" left-label v-model="field.value" @input="changeProperties($event, field.name)"/>
          </div>
        </div>
    </div>

    <div v-if="isEnabled && propsFound" class="row q-ma-md q-mt-sm">
        <q-btn class="col q-mr-sm" dense color="negative" @click="returnToStart">
          <q-icon name="cancel" class="text-white" style="font-size: 1rem;" />
        </q-btn>
         <q-btn class="col q-mr-sm" dense color="teal-7" @click="submitChange">
          <q-icon name="done" class="text-white" style="font-size: 1rem;" />
        </q-btn>
  </div>

  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      newComponentMode: false,
      configureComponentMode: false,
      newComponentSelectedCategory: '',
      componentCategories: ['blood_compartment', 'blood_connector', 'gas_compartment', 'gas_connector', 'valve', 'container', 'diffusor', 'exchanger'],
      newComponentProps: [],
      modelEventListener: null,
      properties: null,
      standard: 0,
      value: 0,
      propsFound: false,
      model_definition: null,
      selectedComponentName: '',
      selectedComponentPropertyList: [],
      modelList: []

    }
  },
  mounted () {
    this.modelEventListener = this.$model.engine.addEventListener('message', (message) => {
      switch (message.data.type) {
        case 'data':
          switch (message.data.target) {
            case 'datalogger_output':
              this.$model.getProperties(null)
              break
            case 'props':
              this.properties = message.data.data
              this.createModelList()
              break
            case 'model_definition':
              this.model_definition = message.data.data
              break
          }
          break
      }
    })

    this.$root.$on('add_to_graph1', (e) => { this.selectNewModelFromOutside(e) })
    this.$root.$on('show_selected_comp', (e) => { this.selectNewModelFromOutside(e) })
    this.getModelDefinition()
    this.$model.getProperties(null)
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
      if (this.isEnabled) {
        this.$model.getProperties(null)
      }
    },
    submitChange () {
      this.selectedComponentPropertyList.forEach(prop => {
        if (prop.changed) {
          this.$model.setPropertyDirect(this.selectedComponentName, prop.name, prop.value)
        }
      })
      this.$model.getProperties(null)
    },
    changeProperties (event, name) {
      this.selectedComponentPropertyList.forEach(prop => {
        if (prop.name === name) {
          prop.changed = true
        }
      })
    },
    returnToStart () {
      this.propsFound = false
      this.newComponentMode = false
      this.configureComponentMode = false
      this.selectedComponentName = ''
      this.$model.getProperties(null)
      this.getModelDefinition()
    },
    buildNewComponent () {
      this.newComponentMode = true
    },
    newComponentCategorySelected () {
      // find the properties of the selected type
      this.newComponentProps = []
      switch (this.newComponentSelectedCategory) {
        case 'blood_compartment':
          Object.keys(this.model_definition.blood_compartment_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.blood_compartment_definitions[0][property], type: typeof this.model_definition.blood_compartment_definitions[0][property], changed: false }
            )
          })
          break
        case 'blood_connector':
          Object.keys(this.model_definition.blood_connector_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.blood_connector_definitions[0][property], type: typeof this.model_definition.blood_connector_definitions[0][property], changed: false }
            )
          })
          break
        case 'valve':
          Object.keys(this.model_definition.valve_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.valve_definitions[0][property], type: typeof this.model_definition.valve_definitions[0][property], changed: false }
            )
          })
          break
        case 'pump':
          Object.keys(this.model_definition.blood_compartment_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.blood_compartment_definitions[0][property], type: typeof this.model_definition.blood_compartment_definitions[0][property], changed: false }
            )
          })
          break
        case 'gas_compartment':
          Object.keys(this.model_definition.gas_compartment_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.gas_compartment_definitions[0][property], type: typeof this.model_definition.gas_compartment_definitions[0][property], changed: false }
            )
          })
          break
        case 'gas_connector':
          Object.keys(this.model_definition.gas_connector_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.gas_connector_definitions[0][property], type: typeof this.model_definition.gas_connector_definitions[0][property], changed: false }
            )
          })
          break
        case 'container':
          Object.keys(this.model_definition.container_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.container_definitions[0][property], type: typeof this.model_definition.container_definitions[0][property], changed: false }
            )
          })
          break
        case 'diffusor':
          Object.keys(this.model_definition.diffusor_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.diffusor_definitions[0][property], type: typeof this.model_definition.diffusor_definitions[0][property], changed: false }
            )
          })
          break
        case 'exchanger':
          Object.keys(this.model_definition.exchanger_definitions[0]).forEach(property => {
            this.newComponentProps.push(
              { name: property, value: this.model_definition.exchanger_definitions[0][property], type: typeof this.model_definition.exchanger_definitions[0][property], changed: false }
            )
          })
          break
      }
      this.configureComponentMode = true
    },
    getModelDefinition () {
      this.$model.getModelDefinition(null)
    },
    createModelList () {
      this.modelList = []
      Object.keys(this.properties).forEach(property => {
        this.modelList.push(property)
      })
    },
    selectNewModelFromOutside (model) {
      this.selectedComponentName = model
      this.selectedComponentPropertyList = []
      if (this.properties[model].subtype === '') {
        // find the property names stored in the model definition file
        Object.keys(this.model_definition).forEach(compartment => {
          if (this.model_definition[compartment].name === model) {
            Object.keys(this.model_definition[compartment]).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'blood_compartment' | this.properties[model].subtype === 'pump') {
        // find the property names stored in the model definition file
        this.model_definition.blood_compartment_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'blood_connector') {
        // find the property names stored in the model definition file
        this.model_definition.blood_connector_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'valve') {
        // find the property names stored in the model definition file
        this.model_definition.valve_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'gas_compartment') {
        // find the property names stored in the model definition file
        this.model_definition.gas_compartment_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'gas_connector') {
        // find the property names stored in the model definition file
        this.model_definition.gas_connector_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'container') {
        // find the property names stored in the model definition file
        this.model_definition.container_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

      if (this.properties[model].subtype === 'exchanger') {
        // find the property names stored in the model definition file
        this.model_definition.exchanger_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }
      if (this.properties[model].subtype === 'diffusor') {
        // find the property names stored in the model definition file
        this.model_definition.diffusor_definitions.forEach(compartment => {
          if (compartment.name === model) {
            Object.keys(compartment).forEach(propName => {
              // now we have the name of de model in model and the name of the property in propName
              // combine this with the actual current value
              if (propName !== 'name') {
                const prop = {
                  name: propName,
                  value: this.properties[model][propName],
                  type: typeof this.properties[model][propName]
                }
                this.selectedComponentPropertyList.push(prop)
              }
            })
          }
        })
      }

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
