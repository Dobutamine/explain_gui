<template>
<q-card class="q-pb-sm q-pt-es q-ma-sm" bordered>
   <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="toggleIsEnabled">
     script editor
     </div>
   </div>

   <div v-if="isEnabled && !newScriptEnabled" class="row q-mt-es q-ml-sm q-mr-sm q-mb-sm">
    <q-select :options="scriptNames" class="col q-mr-sm" v-model="selectedScript" @input="selectScript" label="select existing script">
    </q-select>
  </div>

  <div v-if="isEnabled && !scriptLoaded && !newScriptEnabled" class="row q-ma-md">
        <q-btn dense color="teal-7" style="width: 100%" @click="buildNewScript">NEW SCRIPT</q-btn>
  </div>

 <div v-if="isEnabled && newScriptEnabled" class="row q-ma-sm">
        <q-input type="text" label="new script name" v-model='scriptName' class="col q-mr-sm" dense color="teal-7" ></q-input>
  </div>

  <div v-if="isEnabled && scriptLoaded" class="row q-mt-sm bg-grey-2">
      <q-list class="q-ma-sm" style="width: 100%" highlight separator>
        <q-item v-for="(field, index) in interventionsList" :key='index' dense v-ripple clickable @click="selectIntervention(field, index)">
          <q-item-label class="text-caption q-pt-sm" style="width: 100%">
            {{ field.atTime }}s. -> {{ field.model }}.{{ field.prop }} to {{ field.newValue }} in {{ field.inTime }} s.
          </q-item-label>
        </q-item>
      </q-list>
  </div>

    <div v-if="isEnabled && addEnabled" class="q-mt-sm">
      <q-separator></q-separator>
      <div class="row q-mt-sm">
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

  <div v-if="isEnabled && addEnabled" class="row q-ma-md q-mt-sm">
        <q-btn class="col q-mr-sm" dense color="black"  @click="addIntervention" >
          <q-icon name="add" class="text-white" style="font-size: 1rem;" />
        </q-btn>
        <q-btn class="col q-mr-sm" dense color="black"   @click="replaceIntervention" >
          <q-icon name="refresh" class="text-white" style="font-size: 1rem;" />
        </q-btn>
        <q-btn class="col" dense color="black"   @click="deleteIntervention" >
           <q-icon name="remove" class="text-white" style="font-size: 1rem;" />
        </q-btn>
  </div>

  <div v-if="isEnabled && scriptLoaded" class="row q-ma-md">
    <q-separator></q-separator>
    <q-btn class="q-mt-sm q-mr-sm col" dense color="teal-7" @click="commmitScriptToModel" style="width: 100%" >
      <q-icon name="add_to_queue" class="text-white" style="font-size: 1rem;" />
    </q-btn>
    <q-btn class="q-mt-sm q-mr-sm col" dense color="teal-7" @click="cancelScript" style="width: 100%" >
      <q-icon name="cancel" class="text-white" style="font-size: 1rem;" />
    </q-btn>
    <q-btn class="q-mt-sm q-mr-sm col" dense color="teal-7" @click="storeCurrentScript" style="width: 100%" >
      <q-icon name="save_alt" class="text-white" style="font-size: 1rem;" />
    </q-btn>
    <q-btn class="q-mt-sm col" dense color="negative" @click="deleteScript" style="width: 100%" >
        <q-icon name="delete_forever" class="text-white" style="font-size: 1rem;" />
    </q-btn>
  </div>
  <q-separator class="q-ma-sm"></q-separator>

    <div class="row q-mt-es">
      <div class="q-gutter-es q-mt-es row gutter text-overline" @click="scriptIOEnabled = !scriptIOEnabled">
        script i/o
      </div>
    </div>
    <div v-if="scriptIOEnabled" class="row q-ml-md q-mr-md">
          <q-input type="text" label="new script list name" v-model='exportFileName' class="col q-mr-sm" dense color="teal-7" ></q-input>
    </div>
    <div v-if="scriptIOEnabled" class="row q-ma-md">
        <q-btn dense color="teal-7" style="width: 100%" @click="exportScriptList">export scripts</q-btn>
    </div>
    <div v-if="scriptIOEnabled" class="row q-ma-md">
    <q-file
      v-model="fileToBeImported"
      dense
      label="load script list from disk"
      filled
      @input="importScriptList"
    >
      <q-icon name="save" class="text-grey" style="font-size: 1rem;" />
    </q-file>
    </div>

</q-card>
</template>

<script>

export default {
  data () {
    return {
      isEnabled: false,
      addEnabled: false,
      newScriptEnabled: false,
      scriptIOEnabled: false,
      scriptLoaded: false,
      scriptReadyForExecution: false,
      isNumber: true,
      timeToCalculate: 10,
      interventionsList: [],
      selectedScript: '',
      selectedIntervention: -1,
      scriptName: '',
      scriptNames: [],
      scriptList: [],
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
      props: [],
      exportFileName: '',
      fileToBeImported: null
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
    // get the stored scripts from the browser

    if (localStorage.explain_scripts) {
      this.scriptList = JSON.parse(localStorage.explain_scripts)
    }
    // get the stored list
    this.loadScriptsFromLocalStorage()
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
    selectIntervention (field, index) {
      this.addEnabled = true
      const found = this.interventionsList.findIndex(element => element === field)
      this.model1 = this.interventionsList[found].model
      this.prop1 = this.interventionsList[found].prop
      this.propValue1 = this.interventionsList[found].currentValue
      this.propValue1New = this.interventionsList[found].newValue
      this.propValue1In = this.interventionsList[found].inTime
      this.propValue1At = this.interventionsList[found].atTime

      this.selectedIntervention = found
    },
    cancelScript () {
      this.interventionsList = []
      this.model1 = ''
      this.prop1 = ''
      this.propValue1 = ''
      this.propValue1New = ''
      this.propValue1In = 5
      this.propValue1At = 0
      this.selectedIntervention = ''
      this.selectedScript = ''
      this.scriptLoaded = false
      this.addEnabled = false
      this.newScriptEnabled = false
      this.loadScriptsFromLocalStorage()
    },
    commmitScriptToModel () {
      // commit the intervention
      this.interventionsList.forEach(intervention => {
        this.$model.setProperty(intervention.model, intervention.prop, intervention.newValue, intervention.inTime, intervention.atTime, 'abs')
      })
      // clear the interventions list
      this.interventionsList = []
      // clear all properties
      this.model1 = ''
      this.prop1 = ''
      this.propValue1 = ''
      this.propValue1New = ''
      this.propValue1In = 5
      this.propValue1At = 0
      // clear the selected intervention
      this.selectedIntervention = ''
      // clear the selected script
      this.selectedScript = ''
      this.scriptLoaded = false
      this.addEnabled = false
      this.newScriptEnabled = false
      this.loadScriptsFromLocalStorage()
    },
    addIntervention () {
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
    importScriptList () {
      const reader = new FileReader()

      reader.onload = (e) => {
        this.scriptList = JSON.parse(e.target.result)
        this.updateLocalStorageScriptList()
        this.loadScriptsFromLocalStorage()
      }
      reader.readAsText(this.fileToBeImported)
    },
    exportScriptList () {
      // download to local disk
      const data = JSON.stringify(this.scriptList)
      const blob = new Blob([data], { type: 'text/json' })
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      if (this.exportFileName.includes('.json')) {
        a.download = this.exportFileName
      } else {
        a.download = this.exportFileName + '.json'
      }
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    },
    deleteIntervention () {
      this.interventionsList.splice(this.selectedIntervention, 1)
      this.addEnabled = false
    },
    replaceIntervention () {
      const intervention = {
        model: this.model1,
        prop: this.prop1,
        currentValue: this.propValue1,
        newValue: this.propValue1New,
        inTime: this.propValue1In,
        atTime: this.propValue1At
      }
      this.interventionsList.splice(this.selectedIntervention, 1, intervention)
      this.addEnabled = false
    },
    updateLocalStorageScriptList () {
      localStorage.explain_scripts = JSON.stringify(this.scriptList)
      this.updateScriptListNames()
      console.log('local storage script list updated')
    },
    clearScriptList () {
      this.scriptList = []
      this.scriptNames = []
      this.updateLocalStorageScriptList()
      console.log('current script list cleared')
    },
    selectScript () {
      // find selected script in scriptlist
      const found = this.scriptList.find(element => element.name === this.selectedScript)
      this.interventionsList = found.interventions
      this.scriptLoaded = true
    },
    deleteScript () {
      const found = this.scriptList.findIndex(element => element.name === this.selectedScript)
      if (found > -1) {
        // it is a new one
        this.scriptList.splice(found, 1)
      }
      this.updateLocalStorageScriptList()
      this.loadScriptsFromLocalStorage()
      this.cancelScript()
    },
    storeCurrentScript () {
      const script = {
        name: this.scriptName,
        interventions: this.interventionsList
      }
      let found = this.scriptList.find(element => element.name === this.selectedScript)
      if (found === undefined) {
        // it is a new one
        this.scriptList.push(script)
      } else {
        // it is an existing one
        found = script
      }
      this.updateLocalStorageScriptList()
      this.loadScriptsFromLocalStorage()
    },
    buildNewScript () {
      this.newScriptEnabled = true
      this.addEnabled = true
      this.scriptLoaded = true
    },
    loadScriptsFromLocalStorage () {
      // clear the scriptlist
      this.scriptList = []
      // fill the scriptlist with an array of scripts
      if (localStorage.explain_scripts) {
        this.scriptList = JSON.parse(localStorage.explain_scripts)
      }
      // update the scriptlist names array
      this.updateScriptListNames()
    },
    updateScriptListNames () {
      this.scriptNames = []
      this.selectedScript = ''
      this.scriptList.forEach(script => {
        this.scriptNames.push(script.name)
      })
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
