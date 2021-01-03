/* eslint-disable */

class Datalogger {
  constructor(_model) {
    // declare a reference to the global model which is injected in this class
    this._model = _model;

    this._datalogger_timer = 0;
    this.update_interval = 0.015
    this.annotations_processed = false;

    this.realtime = false;
    this.realtime_timer = 0
    this.realtime_timer_interval = 0.015

    this.data = []
    this.data_rt = []
    this.watched_models = ["AA","LV","LA","RV","RA"]

    this.monitorObject = [
      {label: 'heartrate', model: 'ecg', prop: 'heart_rate', accuracy: 0},
      {label: 'spo2Pre', model: 'AA', prop: 'so2', accuracy: 2},
      {label: 'spo2Post', model: 'AD', prop: 'so2', accuracy: 2},
      {label: 'resprate', model: 'breathing', prop: 'spont_resp_rate', accuracy: 0},
      {label: 'abp', model: 'AA', prop: 'pres', accuracy: 3},
      {label: 'pap', model: 'PA', prop: 'pres', accuracy: 3},
      {label: 'cvp', model: 'RA', prop: 'pres', accuracy: 3},
      {label: 'etco2', model: 'ventilator', prop: 'etco2_ventilator', accuracy: 0},
      {label: 'temp', model: 'metabolism', prop: 'body_temp', accuracy: 1},
      {label: 'ph', model: 'AA', prop: 'ph', accuracy: 2},
      {label: 'pco2', model: 'AA', prop: 'pco2', accuracy: 0},
      {label: 'po2', model: 'AA', prop: 'po2', accuracy: 0},
      {label: 'hco3', model: 'AA', prop: 'hco3p', accuracy: 1},
      {label: 'be', model: 'AA', prop: 'be', accuracy: 0},
      {label: 'LAP', model: 'LA', prop: 'pres', accuracy: 6},
      {label: 'LVP', model: 'LV', prop: 'pres', accuracy: 6},
      {label: 'RAP', model: 'RA', prop: 'pres', accuracy: 6},
      {label: 'RVP', model: 'RV', prop: 'pres', accuracy: 6},
      {label: 'LAV', model: 'LA', prop: 'vol', accuracy: 6},
      {label: 'LVV', model: 'LV', prop: 'vol', accuracy: 6},
      {label: 'RAV', model: 'RA', prop: 'vol', accuracy: 6},
      {label: 'RVV', model: 'RV', prop: 'vol', accuracy: 6},

    ]

  }

  // routine to send messages to the main thread
  SendMessage = (type, target, action, data, return_tag) => {
    postMessage({
      type,
      target,
      action,
      data,
      return_tag
    });
  };

  setMonitoringObject = (monitorObject) => {

  }
  getMonitoringObject = () => {

  }

  getModels(model_type) {
    return false
  }

  getModelProperty = (model, property) => {

    let model_state = {}

    if (this._model.components[model]) {
      model_state = this._model.components[model][property]
    }

    return model_state;

  }

  getModelProps = (model) => {
    let model_state = {}

    if (!model)
    {
      // iterate over all model components
      Object.keys(this._model.components).forEach((component) => {
        model_state[component] = {};
        Object.keys(this._model.components[component]).forEach((prop) => {
          if ((prop.substring(0,1) !== '_') & (prop !== 'pv') & (prop !== 'flows') & (this._model.components[component][prop] !== null)){
            if (typeof this._model.components[component][prop] === 'object') {
              if (this._model.components[component][prop].length > 0) {
                model_state[component][prop] = this._model.components[component][prop].join(',')
              } 
            } else {
              model_state[component][prop] = this._model.components[component][prop]
            }
          }
        })
      });

      return model_state;
    
    } else {
  
      if (this._model.components[model]) {
        let newObj = {}
        Object.keys(this._model.components[model]).forEach(prop => {
          if (typeof this._model.components[model][prop] !== 'object') {
            newObj[prop] = this._model.components[model][prop]
          }
        })
        
        return newObj
      }     
    }
  }

  removeDuplicates(data) {
    return data.filter((value, index) => data.indexOf(value) === index)
  }

  setWatchedModels = (models_to_watch) => {
    let watched_models = []
    this.watched_models = []
    if (typeof models_to_watch === "string") {
      watched_models.push(models_to_watch)
    } else {
      watched_models = models_to_watch
    }
    watched_models.forEach(modelToWatch => {
      this.watched_models.push(modelToWatch)
    })
    
    this.watched_models = this.removeDuplicates(this.watched_models)

    SendMessage("mes", null, null, [`logger watching ${this.watched_models}`] );
  }

  setUpdateInterval = (update_interval) => {
    this.update_interval = update_interval;
    SendMessage("mes", null, null, [`logger interval is ${update_interval} s.`] );
  }

  setModelState(new_state) {

    this._model.name = new_state.name
    this._model.description = new_state.description
    this._model.weight = new_state.weight
    this._model.model_time_total = new_state.model_time_total
    this._model.modeling_stepsize = new_state.modeling_stepsize
  
    Object.keys(new_state).forEach( (key) => {
      if (typeof new_state[key] === 'object') {
        Object.keys(new_state[key]).forEach( (prop) => {
          this._model.components[key][prop] = new_state[key][prop]
        })
      }
    })

    SendMessage("mes",null,null,['new state processed'])
    SendMessage("mes",null,null,['ready'])

  }
  
  getModelStateFull() {
    let model_state = {
      name: this._model.name,
      description: this._model.description,
      weight: this._model.weight,
      model_time_total: this._model.model_time_total,
      modeling_stepsize: this._model.modeling_stepsize,
      ncc_ventricular: this._model.ecg.ncc_ventricular
    }

    Object.keys(this._model.components).forEach((key) => {

      // shallow copy the component
      let newObj = Object.assign({}, this._model.components[key]);

      // delete the associated referenced model (creates a circular copy) and other objects
      delete newObj._model;
      delete newObj.model;
      delete newObj.comp1;
      delete newObj.comp2;


      // store the copy into the model_state
      model_state[newObj.name] = newObj;
    });
    SendMessage("mes", null, null, [`datalogger took a snapshot of the current model state`]);

    return model_state
  }

  getModelStateWatched = (_current_model_time, watched_models, annotation = "") => {
    let model_state = {
      time: _current_model_time,
      ncc_ventricular: this._model.components.ecg.ncc_ventricular,
    }

    this.monitorObject.forEach(mon => {
      model_state[mon.label] = (this._model.components[mon.model][mon.prop]).toFixed(mon.accuracy)
    })

    model_state["annotation"] = annotation;

    // iterate over all components
    watched_models.forEach((key) => {

      // shallow copy the component
      let newObj = Object.assign({}, this._model.components[key]);

      // delete the associated referenced model (creates a circular copy) and other objects
      delete newObj._model;
      delete newObj.model;
      delete newObj.comp1;
      delete newObj.comp2;


      // store the copy into the model_state
      model_state[newObj.name] = newObj;
    });


    return model_state;
  }

  sendModelState = (_current_model_time, annotations) => {
        this.SendMessage(
          "data",
          "state",
          null,
          this.getModelStateWatched(_current_model_time, annotations)
        );
       
  };

  resetData() {
    this.data = [];
  }

  sendData() {
    // send the data to the main thread
    this.SendMessage(
        "data",
        "datalogger_output",
        null,
        this.data
    )

    // remove the data from memory
    this.data = null;

  }

  modelStepRealtime = (_current_model_time, annotations) => {

    // has the datalogger time interval elapsed? then get a model snapshot
    if (this._datalogger_timer >= this.update_interval) {
      if (this.data_rt === null) {
        this.data_rt = []
      }
      if (this.data === null) {
        this.data = []
      }
      this._datalogger_timer = 0;

      // save the modeldata to the data object

      let current_data_frame = this.getModelStateWatched(_current_model_time, this.watched_models, annotations)
      this.data_rt.push(current_data_frame);
      this.data.push(current_data_frame)
      
      // signal that the annotations have been processed
      this.annotations_processed = true;
    }


    if (this.realtime_timer >= this.realtime_timer_interval) {
      this.SendMessage(
        "rt",
        null,
        null,
        this.data_rt
      )
      this.realtime_timer = 0
      this.data_rt = null
    }

    // increase the datalogger timer with the modeling_stepsize
    this._datalogger_timer += this._model.modeling_stepsize;

    this.realtime_timer += this._model.modeling_stepsize;
  };

  modelStep = (_current_model_time, annotations) => {

    // has the datalogger time interval elapsed? then get a model snapshot
    if (this._datalogger_timer >= this.update_interval) {
      if (this.data === null) {
        this.data = []
      }
      this._datalogger_timer = 0;

      // save the modeldata to the data object
      this.data.push(this.getModelStateWatched(_current_model_time, this.watched_models, annotations));
      
      // signal that the annotations have been processed
      this.annotations_processed = true;
    }

    // increase the datalogger timer with the modeling_stepsize
    this._datalogger_timer += this._model.modeling_stepsize;
  };
}
