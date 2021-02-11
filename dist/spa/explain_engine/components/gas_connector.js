class GasConnector{constructor(s){this._model=s,this.comp1=null,this.comp2=null,this.res=0,this.flow=0,this.real_flow=0,this.prev_flow=0,this.average_flow=0,this.r_for_fac=1,this.r_back_fac=1,this.r_k1_fac=1,this.r_k2_fac=1}calcResistance(){let s=this.r_k1*this.r_k1_fac*this.flow,t=this.r_k2*this.r_k2_fac*Math.pow(this.flow,2);return this.comp1.pres>this.comp2.pres?this.r_for*this.r_for_fac+s+t:this.r_back*this.r_back_fac+s+t}modelStep(){this.is_enabled&&!this.no_flow?(this.comp1=this._model.components[this.comp_from],this.comp2=this._model.components[this.comp_to],this.res=this.calcResistance(),this.comp1.pres>this.comp2.pres?(this.flow=(this.comp1.pres-this.comp2.pres)/this.res,this.comp1.volOut(this.flow*this._model["modeling_stepsize"]),this.comp2.volIn(this.flow*this._model["modeling_stepsize"],this.comp1),this.real_flow=this.flow):this.no_backflow?(this.flow=0,this.real_flow=0):(this.flow=(this.comp2.pres-this.comp1.pres)/this.res,this.comp1.volIn(this.flow*this._model["modeling_stepsize"],this.comp2),this.comp2.volOut(this.flow*this._model["modeling_stepsize"]),this.real_flow=-this.flow),this.average_flow=this.average_flow+this._alpha*(60*this.real_flow-this.average_flow)):(this.flow=0,this.real_flow=0,this.average_flow=0)}}