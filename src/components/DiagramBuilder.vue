<template>
  <q-card class="q-pb-sm q-pt-es q-ma-sm">
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
     diagram editor
     </div>
   </div>

    <div v-if="isEnabled" class="q-mt-sm">
      <q-separator></q-separator>
      <div class="row q-mt-sm">
          <q-select class="col" label-color="red-10" v-model="selectedModel" :options="models" filled dense square @input="modelChanged" label="select model to add" style="width: 100%" />
       </div>
    </div>

    <div v-if="isEnabled" class="row q-ma-md q-mt-sm">
        <q-btn class="col q-mr-sm" dense color="black"  @click="addToDiagram" >
          <q-icon name="add" class="text-white" style="font-size: 1rem;" />
        </q-btn>
  </div>

  <div v-if="isEnabled" class="q-mt-sm">
      <q-separator></q-separator>
      <div class="row q-mt-sm">
          <q-select class="col" label-color="red-10" v-model="selectedCurrentModel" :options="currentModelsInDiagram" filled dense square @input="modelChanged" label="edit diagram model" style="width: 100%" />
       </div>
    </div>

     <div v-if="isEnabled" class="row q-ma-md q-mt-sm">
        <q-btn class="col q-mr-sm" dense color="black"  @click="removeFromDiagram" >
          <q-icon name="remove" class="text-white" style="font-size: 1rem;" />
        </q-btn>
  </div>

  </q-card>
</template>

<script>
export default {
  data () {
    return {
      isEnabled: true,
      properties: null,
      selectedModel: '',
      models: [],
      selectedCurrentModel: '',
      currentModelsInDiagram: []
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
    // get the current model properties
    this.$model.getProperties(null)
  },
  beforeDestroy () {
    delete this.modelEventListener
  },
  methods: {
    toggleIsEnabled () {
      this.isEnabled = !this.isEnabled
    },
    processModels () {
      this.models.length = 0

      Object.keys(this.properties).forEach(modelName => {
        this.models.push(modelName)
      })
    },
    modelChanged () {
      console.log('model changed')
    },
    removeFromDiagram () {
      this.$root.$emit('remove_from_diagram', this.selectedCurrentModel)
      const index = this.currentModelsInDiagram.findIndex((element) => element === this.selectedCurrentModel)
      if (index > -1) {
        this.currentModelsInDiagram.splice(index, 1)
        this.selectedCurrentModel = ''
      }
    },
    addToDiagram () {
      this.currentModelsInDiagram.push(this.selectedModel)

      const diagramComponent = {
        type: this.properties[this.selectedModel].subtype,
        id: this.selectedModel,
        label: this.selectedModel,
        modelComponents: [this.selectedModel]
      }

      if (diagramComponent.type === 'blood_compartment' | diagramComponent.type === 'pump') {
        this.$root.$emit('add_to_diagram', diagramComponent)
      }

      if (diagramComponent.type === 'blood_connector' | diagramComponent.type === 'valve') {
        diagramComponent.dbcFrom = this.properties[this.selectedModel].comp_from
        diagramComponent.dbcTo = this.properties[this.selectedModel].comp_to
        this.$root.$emit('add_to_diagram', diagramComponent)

        const compFrom = {
          type: this.properties[diagramComponent.dbcFrom].subtype,
          id: diagramComponent.dbcFrom,
          label: diagramComponent.dbcFrom,
          modelComponents: [diagramComponent.dbcFrom]
        }
        this.$root.$emit('add_to_diagram', compFrom)

        const compTo = {
          type: this.properties[diagramComponent.dbcTo].subtype,
          id: diagramComponent.dbcTo,
          label: diagramComponent.dbcTo,
          modelComponents: [diagramComponent.dbcTo]
        }
        this.$root.$emit('add_to_diagram', compTo)
      }

      this.selectedModel = ''
    }
  }

}
</script>

<style>

</style>
