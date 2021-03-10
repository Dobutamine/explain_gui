class Container{constructor(s){this._model=s,this.pres=0,this.pres_recoil=0,this.pres_ext=0,this.pres_cont=0,this.el=0,this.el_max_fac=1,this.el_min_fac=1,this.vol_u_fac=1,this.el_k1_fac=1,this.el_k2_fac=1,this.el_act=0}calcVolume(){let s=0;return this.comps.forEach((t=>{s+=this._model.components[t].vol})),s}calcElastance(){let s=this.el_min*this.el_min_fac,t=this.el_k1*this.el_k1_fac*(this.vol-this.vol_u),e=this.el_k2*this.el_k2_fac*Math.pow(this.vol-this.vol_u,2),i=this.el_max*this.el_max_fac*this.el_act;return s+t+e+i}changeVolume(s){this.vol+=s,this.vol<0&&(this.vol=0)}calcPressure(){return this.el=this.calcElastance(),this.pres_recoil=(this.vol-this.vol_u*this.vol_u_fac)*this.el,this.pres_recoil+this.pres_ext+this.pres_cont}modelStep(){this.is_enabled&&(this.vol=this.calcVolume(),this.pres=this.calcPressure(),this.comps.forEach((s=>{this._model.components[s].pres_cont=this.pres})))}}