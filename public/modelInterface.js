/* eslint-disable */

const mode = {
  APPEND: 'append',
  REFRESH: 'refresh'
}
export class ModelInterface {

  // declare a model engine object containing the new model
  definition = {}
  engine = {}
  data = []
  properties = {}

  loadedModelName = ''

  dataMode = mode.REFRESH

  constructor(default_model_definition) {

    // if no model definition is provided then we load the de fault normal neonate
    if (!default_model_definition) {
      default_model_definition = 'cdh'
    }

    this.loadedModelName = default_model_definition

    // initialize the model engine
    this.engine = new Worker("./explain_engine/engine.js");

    // load the model definition file into the modelengine
    this.loadModelDefinition(default_model_definition)

    // attach an event handler to receive messages from the model engine 
    this.engine.addEventListener("message", (message) => {
      this._receiveMessageFromModel(message.data)
    });

  }

  loadModelDefinition = (filename) => {
    filename = './explain_engine/definitions/' + filename + '.json'
    // now load the model definition file from the server
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", filename, true);
    xobj.onreadystatechange = () => {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        // load the model
        this.definition = JSON.parse(xobj.responseText)
        if (this.engine) {
            this.engine.postMessage({
            type: "cmd",
            target: null,
            action: "load",
            data: this.definition,
            return_tag: null
          });
        }
      }
    };
    xobj.send(null);

  }

  getCurrentLoadedModelName = () => {
    return this.loadedModelName
  }
  
  setDataloggerInterval = (update_interval) => {    
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setUpdateInterval",
      data: update_interval,
      return_tag: null
    });
  }

  setDataloggerWatchedModels = (models_to_watch) => {
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setWatchedModels",
      data: models_to_watch,
      return_tag: null
    });
  }

  setDataloggerWatchedModelsRT = (models_to_watch) => {
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setWatchedModelsRT",
      data: models_to_watch,
      return_tag: null
    });
  }

  setModelState = (snapshot) => {
    this.engine.postMessage({
      type: "set",
      target: "datalogger",
      action: "setModelState",
      data: snapshot,
      return_tag: null
    });
  }

  setPropertyDirect = (model, property, new_value) => {
    this.engine.postMessage({
      type: "set_direct",
      target: model,
      action: property,
      data: new_value
    })
  }

  setPropertyByFunction = (model, func, new_value) => {
    this.engine.postMessage({
      type: "set",
      target: model,
      action: func,
      data: new_value
    })
  }

  setProperty = (model, property, new_value, in_time = 0, at_time = 0, mode = "abs") => {
    this.engine.postMessage({
      type: "set",
      target: "interventions",
      action: "addPropertyChange",
      data: {
        model: model,
        property: property,
        target: new_value,
        in_time: in_time,
        at_time: at_time,
        mode: mode,
        label: model + property + " change",
      },
      return_tag: null
    });
  }
  getModelJSON = () => {
    this.engine.postMessage({
      type:"get",
      target:"datalogger",
      action:"getModelJSON",
      data: null,
      return_tag: "json"
    })
  }
  getModelState = () => {
    // if model is not specified this gets all the properties of the model engine
    this.engine.postMessage({
      type: "get",
      target: "datalogger",
      action: "getModelStateFull",
      data: null,
      return_tag: "state"
    });
  }
  getModelDefinition = (model) => {
    this.engine.postMessage({
      type: "get",
      target: "model_definition",
      action: "null",
      data: null,
      return_tag: "model_definition"
    });
  }
  getProperties = (model) => {
      // if model is not specified this gets all the properties of the model engine
      this.engine.postMessage({
        type: "get",
        target: "datalogger",
        action: "getModelProps",
        data: model,
        return_tag: "props"
      });
  }

  startModel = () => {
    // clear the current data object
    this.clearData();

    // start the realtime model
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "start",
      data: null,
      return_tag: null
    });
  }

  stopModel = () => {

    // stop the realtime model
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "stop",
      data: null,
      return_tag: null
    });

  }
  fastForwardModel = (time_to_calculate) => {
    // calculate the model 
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "goto",
      data: time_to_calculate,
      return_tag: null
    });
  }

  calculateModel = (time_to_calculate) => {
    // clear the current data object
    if (this.dataMode !== mode.APPEND){
      this.clearData()
    }
    
    // calculate the model 
    this.engine.postMessage({
      type: "cmd",
      target: null,
      action: "calculate",
      data: time_to_calculate,
      return_tag: null
    });

  }

  clearData = () => {
    // clear the data object
    // console.log(`%cMODEL: reset all model output data`, "color:red;")
    this.data = []
  }

  _receiveMessageFromModel = (message) => {
    switch (message.type) {
      // receive status messages
      case "mes":
        // console.log(`%cENGINE: ${message.data[0]}`, "color:green;");
        break;
      // receive data messages
      case "data":
        switch (message.target)
        {
          case "datalogger_output":
            // console.log(`%cENGINE: datalog stored in 'data'`, "color:green;");
            this.data = message.data
            break;
          case "state":
            // console.log(`%cENGINE: snapshot stored in 'snapshot'`, "color:green;");
            this.snapshot = message.data
            break;
          case "props":
            // console.log(`%cMODEL: properties stored in 'properties`, "color:red;")
            this.properties = message.data
          default:
            break;
        }
        break;
      // receive realtime messages
      case "rt": 
        // process realtime data messages
        break;
      // message type not recognized
      default:
        // console.log(message)
        break;
    }
    

  }

}


