/* eslint-disable */
class Heart {
  constructor(_model) {
    this._model = _model;
  }

  modelStep() {
    if (this.is_enabled) {
      this.modelCycle();
    }
  }

  // the model step function is called during every step of the model
  modelCycle() {
    const t = this._model["modeling_stepsize"];
    // varying elastance activation function of the atria

    let aaf_left = 0;
    let aaf_right = 0;

    if (this._model.components.ecg["ncc_atrial"] >= 0 && this._model.components.ecg["ncc_atrial"] < this._model.components.ecg["pq_time"] / t) {
      aaf_left = Math.pow(Math.sin(Math.PI * (this._model.components.ecg["ncc_atrial"] / this._model.components.ecg["pq_time"]) * t), 2);
    } else {
      aaf_left = 0;
    }

    if (this._model.components.ecg["ncc_atrial"] >= 0 && this._model.components.ecg["ncc_atrial"] < this._model.components.ecg["pq_time"] / t) {
      aaf_right = Math.pow(Math.sin(Math.PI * (this._model.components.ecg["ncc_atrial"] / this._model.components.ecg["pq_time"]) * t), 2);
    } else {
      aaf_right = 0;
    }

    // varying elastance activation function of the ventricles
    let vaf_left = 0;
    let vaf_right = 0;

    if (this._model.components.ecg["ncc_ventricular"] >= 0 && this._model.components.ecg["ncc_ventricular"] < this._model.components.ecg["cqt_time"] / t) {
      vaf_left = Math.pow(Math.sin(Math.PI * (this._model.components.ecg["ncc_ventricular"] / this._model.components.ecg["cqt_time"]) * t), 2);
    } else {
      vaf_left = 0;
    }
    if (this._model.components.ecg["ncc_ventricular"] >= 0 && this._model.components.ecg["ncc_ventricular"] < this._model.components.ecg["cqt_time"] / t) {
      vaf_right = Math.pow(Math.sin(Math.PI * (this._model.components.ecg["ncc_ventricular"] / this._model.components.ecg["cqt_time"]) * t), 2);
    } else {
      vaf_right = 0;
    }

    // increase the atrial and ventricular activation function timers
    this._model.components.ecg["ncc_atrial"] += 1;
    this._model.components.ecg["ncc_ventricular"] += 1;

    // transfer the activation function to the heart compartments
    this._model.components["RA"].el_act = aaf_right;
    this._model.components["RV"].el_act = vaf_right;
    this._model.components["LA"].el_act = aaf_left;
    this._model.components["LV"].el_act = vaf_left;
  }
}
