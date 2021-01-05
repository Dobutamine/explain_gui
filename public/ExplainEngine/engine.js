/* eslint-disable */

// This is a worker instance for the physiological model engine
// Workers run in a separate thread for performance reasons and have no access to the DOM nor the window object
// The scope is defined by self and communication with the main thread by a message channel

// First import all the required model components and submodels
self.importScripts("./components/ecg.js");
self.importScripts("./components/heart.js");
self.importScripts("./components/ans.js");
self.importScripts("./components/breathing.js");
self.importScripts("./components/ventilator.js");
self.importScripts("./components/avinteraction.js");
self.importScripts("./components/birth.js");
self.importScripts("./components/brain.js");
self.importScripts("./components/drugs.js");
self.importScripts("./components/kidneys.js");
self.importScripts("./components/liver.js");
self.importScripts("./components/ecmo.js");
self.importScripts("./components/cvvh.js");
self.importScripts("./components/placenta.js");
self.importScripts("./components/uterus.js");
self.importScripts("./components/acidbase.js");
self.importScripts("./components/oxygenation.js");
self.importScripts("./components/metabolism.js");
self.importScripts("./components/adaptation.js");
self.importScripts("./components/blood_compartment.js");
self.importScripts("./components/blood_connector.js");
self.importScripts("./components/gas_compartment.js");
self.importScripts("./components/gas_connector.js");
self.importScripts("./components/exchanger.js");
self.importScripts("./components/container.js");
self.importScripts("./components/diffusor.js");
self.importScripts("./components/valve.js");
self.importScripts("./helpers/math_functions.js");
self.importScripts("./helpers/datalogger.js");
self.importScripts("./helpers/interventions.js");

// define an object which is going to hold the entire model state and properties
let current_model = {};

// define an object which is going to hold the model definition as defined by a json definition file
let model_definition = {};

// model changes take place through an event called an intervention
// interventions are stored in an object which is defined here
let interventions = {};

// model data is logged by the datalogger, its's placeholder is defined here
let datalogger = {};

// set the model total running time and timestamp arrays to timestamp the data
current_model["model_time_total"] = 0;

// define the main timer for the real-time modeling modes
let main_timer;
let realtime_step = 0.03

// the onmessage function is an event handler handling messages posted to the model engine worker thread.
// e is a MessageEvent object wich contains a data field containing the message

// Explain message structure stored in e.data :
/* {
  type:       <string> stating the type of message (set/get/cmd)
  target:     <string> stating the component of the model for which the message is intended (p.e. 'datalogger'/'interventions')
  action:     <string> stating the action name
  data:       <object> containing data to pass to the action
  return_tag: <string> if data is returned from the above action it is tagged with this string.
}
*/
onmessage = function (e) {
  
  switch (e.data.type) {
    // getting data from the model.
    case "get":
      if (e.data.target === "datalogger") {
        // getting data from the datalogger of the model
        SendMessage("data", e.data.return_tag, null, datalogger[e.data.action](e.data.data))
        SendMessage("mes", null, null, ['ready']);
      }
      if (e.data.target === 'model_definition') {
        SendMessage("data", e.data.return_tag, null, model_definition)
      }

      break;

    case "set": 
      if (e.data.target === "datalogger") {
        // setting data handled by the datalogger of the model
        datalogger[e.data.action](e.data.data)
      }
      
      if (e.data.target === "interventions") {
        // setters data handled by the interventions engine
        interventions[e.data.action](e.data.data)
      }
      break; 

    case "cmd":
      // execute commands in the engine
      switch (e.data.action) {
        case "load":
          loadModel(e.data.data);
          break;
        case "start":
          startModel();
          break;
        case "stop":
          stopModel();
          break;
        case "calculate":
          if (e.data.data === null) {
            // if no duration is supplied calculate 10 seconds
            calculateModel(10);
          } else {
            // calculate a number of seconds of the model
            calculateModel(e.data.data);
          }
          break;
        case "goto":
          fastForwardModel(e.data.data)
          break
        default:
          break;
      }
      break;
    
    default:
      // if the incoming message is nog recognized it is displayed on the console 
      this.console.log(
        "model received unknown command ",
        e.data.type,
        e.data.subtype,
        e.data.target,
        e.data.data
      );
      break;
  }
};

// routine to send messages to the main thread
const SendMessage = function (type, target, action, data, return_tag) {
  postMessage({
    type,
    target,
    action,
    data,
    return_tag
  });
};

// initialize the model from the JSON model_definition file
const initModel = function (model_definition) {
  if (model_definition) {
    // set the general properties as weight and name from the definition file
    current_model["weight"] = model_definition["weight"];
    current_model["name"] = model_definition["name"];
    current_model["description"] = model_definition["description"];

    // set the modeling stepsize of the model in seconds
    current_model["modeling_stepsize"] = model_definition["modeling_stepsize"];

    // define the dictionary holding all model components in the current model instance
    current_model["components"] = {};

    // inject the acidbase and oxygenation models which are not classes
    current_model["acidbase"] = calcAcidbaseFromTCO2;
    current_model["oxygenation"] = calcOxygenationFromTO2;

    // initialize all the components

    // initialize the blood compartments
    model_definition.blood_compartment_definitions.forEach((element) => {
      let newComp = new BloodCompartment(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize the blood connectors
    model_definition.blood_connector_definitions.forEach((element) => {
      let newComp = new BloodConnector(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initializes the valves
    model_definition.valve_definitions.forEach((element) => {
      let newComp = new Valve(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize the gas compartments
    model_definition.gas_compartment_definitions.forEach((element) => {
      let newComp = new GasCompartment(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize the gas connectors
    model_definition.gas_connector_definitions.forEach((element) => {
      let newComp = new GasConnector(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize the containers
    model_definition.container_definitions.forEach((element) => {
      let newComp = new Container(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize the diffusors
    model_definition.diffusor_definitions.forEach((element) => {
      let newComp = new Diffusor(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize the exchangers
    model_definition.exchanger_definitions.forEach((element) => {
      let newComp = new Exchanger(current_model);
      Object.keys(element).forEach(function (key) {
        newComp[key] = element[key];
      });
      current_model.components[newComp.name] = newComp;
    });

    // initialize all the models with the parameters from the JSON file

    // initialize the metabolism model
    current_model.components["metabolism"] = new Metabolism(current_model);
    Object.keys(model_definition.metabolism).forEach(function (key) {
      current_model.components.metabolism[key] = model_definition.metabolism[key];
    });

    // initialize the ecg model
    current_model.components["ecg"] = new ECG(current_model);
    Object.keys(model_definition.ecg).forEach(function (key) {
      current_model.components.ecg[key] = model_definition.ecg[key];
    });

    // initialize the heart model
    current_model.components["heart"] = new Heart(current_model);
    Object.keys(model_definition.heart).forEach(function (key) {
      current_model.components.heart[key] = model_definition.heart[key];
    });

    // initialize the breathing model
    current_model.components["breathing"] = new Breathing(current_model);
    Object.keys(model_definition.breathing).forEach(function (key) {
      current_model.components.breathing[key] = model_definition.breathing[key];
    });

    // initialize the ventilator model
    current_model.components["ventilator"] = new Ventilator(current_model);
    Object.keys(model_definition.ventilator).forEach(function (key) {
      current_model.components.ventilator[key] = model_definition.ventilator[key];
    });

    // initialize the autonomic nervous system model
    current_model.components["ans"] = new ANS(current_model);
    Object.keys(model_definition.ans).forEach(function (key) {
      current_model.components.ans[key] = model_definition.ans[key];
    });

    // initialize the atrial, atrial-ventricular and ventricular interaction models
    current_model.components["avinteraction"] = new AvInteraction(current_model);
    Object.keys(model_definition.avinteraction).forEach(function (key) {
      current_model.components.avinteraction[key] =
        model_definition.avinteraction[key];
    });

    // initialize the brain model
    current_model.components["brain"] = new Brain(current_model);
    Object.keys(model_definition.brain).forEach(function (key) {
      current_model.components.brain[key] = model_definition.brain[key];
    });

    // initialize the drug model
    current_model.components["drugs"] = new Drugs(current_model);
    Object.keys(model_definition.drugs).forEach(function (key) {
      current_model.components.drugs[key] = model_definition.drugs[key];
    });

    // initialize the kidney model
    current_model.components["kidneys"] = new Kidneys(current_model);
    Object.keys(model_definition.kidneys).forEach(function (key) {
      current_model.components.kidneys[key] = model_definition.kidneys[key];
    });

    // initialize the liver model
    current_model.components["liver"] = new Liver(current_model);
    Object.keys(model_definition.liver).forEach(function (key) {
      current_model.components.liver[key] = model_definition.liver[key];
    });

    // initialize the placenta model
    current_model.components["placenta"] = new Placenta(current_model);
    Object.keys(model_definition.placenta).forEach(function (key) {
      current_model.components.placenta[key] = model_definition.placenta[key];
    });

    // initialize the placenta model
    current_model.components["uterus"] = new Uterus(current_model);
    Object.keys(model_definition.uterus).forEach(function (key) {
      current_model.components.uterus[key] = model_definition.uterus[key];
    });

    // initialize the birth model
    current_model.components["birth"] = new Birth(current_model);
    Object.keys(model_definition.birth).forEach(function (key) {
      current_model.components.birth[key] = model_definition.birth[key];
    });

    // initialize the ecmo model
    current_model.components["ecmo"] = new ECMO(current_model);
    Object.keys(model_definition.ecmo).forEach(function (key) {
      current_model.components.ecmo[key] = model_definition.ecmo[key];
    });

    // initialize the cvvh model
    current_model.components["cvvh"] = new CVVH(current_model);
    Object.keys(model_definition.cvvh).forEach(function (key) {
      current_model.components.cvvh[key] = model_definition.cvvh[key];
    });

    // initialize the adaptation model
    current_model.components["adaptation"] = new Adaptation(current_model);
    Object.keys(model_definition.adaptation).forEach(function (key) {
      current_model.components.adaptation[key] = model_definition.adaptation[key];
    });

    // initialize the datalogger
    datalogger = new Datalogger(current_model);

    // initialize the interventions engine
    interventions = new Interventions(current_model);

    SendMessage("mes", null, null, ["ready"]);
  }
};

// calculate a number of seconds of the model
const calculateModel = function (time_to_calculate) {

  // first switch off datalogger realtime mode
  datalogger.realtime = false;

  // calculate the number of steps needed for the time_to_calculate
  let no_needed_steps = parseInt(time_to_calculate / current_model.modeling_stepsize);

  // send starting messages for this model run
  SendMessage("mes", null, null, ['calculating']);
  SendMessage("mes", null, null, [`model clock at ${Math.round(current_model.model_time_total)} sec.`]);
  SendMessage("mes", null, null, [`calculating ${time_to_calculate} sec. in ${no_needed_steps} steps.`]);

  // reset the datalogger
  let total_step_execution_time = 0;
  if (model_definition) {
    for (let step = 0; step < no_needed_steps; step++) {
      // do the model step and increase the execution time as the modelstep returns the execution time
      total_step_execution_time += modelStep();
    }

    // calculate the performance metrics
    let average_model_step_time = (total_step_execution_time / no_needed_steps) * 1000;

    // send messages containing the performance metrics
    SendMessage("mes", null, null, [`ready in ${total_step_execution_time.toFixed(3)} sec.`]);
    SendMessage("mes", null, null, [`avg model step in ${average_model_step_time.toFixed(3)} ms.`]);
  }
  
  // stop the model which clears all timers 
  stopModel()
};

const fastForwardModel = function (time_to_calculate) {

  // calculate the number of steps needed for the time_to_calculate
  let no_needed_steps = parseInt(time_to_calculate / current_model.modeling_stepsize);

  // send starting messages for this model run
  SendMessage("mes", null, null, ['fast forwarding']);
  SendMessage("mes", null, null, [`calculating ${time_to_calculate} sec. in ${no_needed_steps} steps.`]);


  if (model_definition) {
    for (let step = 0; step < no_needed_steps; step++) {
      // do the model step and increase the execution time as the modelstep returns the execution time
      modelStepFastForward();
    }

    // send messages containing the performance metrics
    SendMessage("mes", null, null, ['fast forward ready']);
    SendMessage("mes", null, null, [`model clock at ${Math.round(current_model.model_time_total)} sec.`]);
  }
  
  // signal model is ready
  SendMessage("mes", null, null, ['ready']);
};

// start the realtime model
const startModel = function () {
  if (model_definition) {
    // first switch on datalogger realtime mode
     datalogger.realtime = true;

    // reset the main timer if it's already running
    if (main_timer) {
      clearInterval(main_timer)
      clearTimeout(main_timer)
    }

    // set the main timer to the modeling interval which is stored in the JSON model definition
    main_timer = setInterval(modelStepRealtime, realtime_step * 1000);

    // notify main that the model is started
    SendMessage("mes", null, null, ["started"]);
  } 
};

// stop the realtime model
const stopModel = function () {
  if (model_definition) {
    // stop the main timer
    if (main_timer) {
      clearInterval(main_timer);
      clearTimeout(main_timer)
    }
    main_timer = null
    // notify UI that the model has stopped
    SendMessage("mes", null, null, [`stopped at ${Math.round(current_model.model_time_total)} seconds.`]);
    // send the data object
    datalogger.sendData();
    // signal model is ready
    SendMessage("mes", null, null, ['ready']);
  } 
};

// dispose of the current model
const disposeModel = function () {
  // stop the main timer
  if (main_timer) {
    clearInterval(main_timer);
    clearTimeout(main_timer)
  }
  main_timer = null

  // erase the current model object
  current_model = {};

  SendMessage("mes", null, null, ["model disposed"]);
  SendMessage("mes", null, null, ['ready']);
};

// load and initialize a new model from a json model definition object
const loadModel = function (json_model_definition) {
  model_definition = json_model_definition;

  // notify that the model is loaded
  SendMessage("mes", null, null, [`model engine loaded with '${json_model_definition.name}' definition.`]);
 
  // initialize the model with the just loaded model definition
  initModel(model_definition);
};

const modelStepRealtime = function () {
   // model performance calculation start point
   let t0 = performance.now();

   // number of loops
   let no_loops = parseInt(realtime_step / current_model.modeling_stepsize);


   for (let i=0; i<no_loops; i++) {
     
     // iterate over all components and do the modelstep. The actual modeling is done in this loop
      for (const key in current_model.components) {
        current_model.components[key].modelStep();
      }
    
      // update the intervention engine
      interventions.modelStep(current_model.model_time_total);
    
       // update the datalogger and inject the annotations from the interventions object
       datalogger.modelStepRealtime(current_model.model_time_total, interventions.getAnnotations());
       
      // process the annotations in the datalogger
      if (datalogger.annotations_processed) {
        // if all annotations are processed by the datalogger clear them from the interventions object
        datalogger.annotations_processed = false;
        interventions.clearAnnotations();
      }
      // increase the current modeltime
      current_model.model_time_total += current_model.modeling_stepsize;     
   }


   // calculate the model performance -> meaning how long did this model step take in ms
   return (performance.now() - t0) / 1000;

}

const modelStepFastForward = function () {

   // iterate over all components and do the modelstep. The actual modeling is done in this loop
   for (const key in current_model.components) {
     current_model.components[key].modelStep();
   }
 
   // increase the current modeltime
   current_model.model_time_total += current_model.modeling_stepsize;
 

}

// model cycle loop which is called every x ms defined by the modeling stepsize in the model definition
const modelStep = function () {

  // model performance calculation start point
  let t0 = performance.now();

  // iterate over all components and do the modelstep. The actual modeling is done in this loop
  for (const key in current_model.components) {
    current_model.components[key].modelStep();
  }

  // update the intervention engine
  interventions.modelStep(current_model.model_time_total);

  // update the datalogger and inject the annotations from the interventions object
  datalogger.modelStep(current_model.model_time_total, interventions.getAnnotations());

  // process the annotations in the datalogger
  if (datalogger.annotations_processed) {
    // if all annotations are processed by the datalogger clear them from the interventions object
    datalogger.annotations_processed = false;
    interventions.clearAnnotations();
  }

  // increase the current modeltime
  current_model.model_time_total += current_model.modeling_stepsize;

  // calculate the model performance -> meaning how long did this model step take in ms
  return (performance.now() - t0) / 1000;

};
