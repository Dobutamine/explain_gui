(function(e){function t(t){for(var n,r,i=t[0],l=t[1],d=t[2],u=0,c=[];u<i.length;u++)r=i[u],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&c.push(o[r][0]),o[r]=0;for(n in l)Object.prototype.hasOwnProperty.call(l,n)&&(e[n]=l[n]);g&&g(t);while(c.length)c.shift()();return s.push.apply(s,d||[]),a()}function a(){for(var e,t=0;t<s.length;t++){for(var a=s[t],n=!0,r=1;r<a.length;r++){var i=a[r];0!==o[i]&&(n=!1)}n&&(s.splice(t--,1),e=l(l.s=a[0]))}return e}var n={},r={1:0},o={1:0},s=[];function i(e){return l.p+"js/"+({}[e]||e)+"."+{2:"3a391f19",3:"b63187c3",4:"74771008",5:"70328162"}[e]+".js"}function l(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,l),a.l=!0,a.exports}l.e=function(e){var t=[],a={2:1};r[e]?t.push(r[e]):0!==r[e]&&a[e]&&t.push(r[e]=new Promise((function(t,a){for(var n="css/"+({}[e]||e)+"."+{2:"cff485fa",3:"31d6cfe0",4:"31d6cfe0",5:"31d6cfe0"}[e]+".css",o=l.p+n,s=document.getElementsByTagName("link"),i=0;i<s.length;i++){var d=s[i],u=d.getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(u===n||u===o))return t()}var c=document.getElementsByTagName("style");for(i=0;i<c.length;i++){d=c[i],u=d.getAttribute("data-href");if(u===n||u===o)return t()}var g=document.createElement("link");g.rel="stylesheet",g.type="text/css",g.onload=t,g.onerror=function(t){var n=t&&t.target&&t.target.src||o,s=new Error("Loading CSS chunk "+e+" failed.\n("+n+")");s.code="CSS_CHUNK_LOAD_FAILED",s.request=n,delete r[e],g.parentNode.removeChild(g),a(s)},g.href=o;var p=document.getElementsByTagName("head")[0];p.appendChild(g)})).then((function(){r[e]=0})));var n=o[e];if(0!==n)if(n)t.push(n[2]);else{var s=new Promise((function(t,a){n=o[e]=[t,a]}));t.push(n[2]=s);var d,u=document.createElement("script");u.charset="utf-8",u.timeout=120,l.nc&&u.setAttribute("nonce",l.nc),u.src=i(e);var c=new Error;d=function(t){u.onerror=u.onload=null,clearTimeout(g);var a=o[e];if(0!==a){if(a){var n=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;c.message="Loading chunk "+e+" failed.\n("+n+": "+r+")",c.name="ChunkLoadError",c.type=n,c.request=r,a[1](c)}o[e]=void 0}};var g=setTimeout((function(){d({type:"timeout",target:u})}),12e4);u.onerror=u.onload=d,document.head.appendChild(u)}return Promise.all(t)},l.m=e,l.c=n,l.d=function(e,t,a){l.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},l.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.t=function(e,t){if(1&t&&(e=l(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(l.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)l.d(a,n,function(t){return e[t]}.bind(null,n));return a},l.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return l.d(t,"a",t),t},l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},l.p="",l.oe=function(e){throw console.error(e),e};var d=window["webpackJsonp"]=window["webpackJsonp"]||[],u=d.push.bind(d);d.push=t,d=d.slice();for(var c=0;c<d.length;c++)t(d[c]);var g=u;s.push([0,0]),a()})({0:function(e,t,a){e.exports=a("2f39")},"2f39":function(e,t,a){"use strict";a.r(t);a("e6cf"),a("5319"),a("35fc"),a("573e"),a("7d6e"),a("e54f"),a("0ca9"),a("5b0d");var n=a("2b0e"),r=a("1f91"),o=a("42d2"),s=a("b05d");n["a"].use(s["a"],{config:{},lang:r["a"],iconSet:o["a"]});var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"q-app"}},[a("router-view")],1)},l=[],d={name:"App"},u=d,c=a("2877"),g=Object(c["a"])(u,i,l,!1,null,null,null),p=g.exports,h=a("8c4f");const f=[{path:"/",component:()=>Promise.all([a.e(0),a.e(3)]).then(a.bind(null,"713b")),children:[{path:"",component:()=>Promise.all([a.e(0),a.e(2)]).then(a.bind(null,"6ccf"))},{path:"settings",component:()=>Promise.all([a.e(0),a.e(5)]).then(a.bind(null,"b4e3"))}]},{path:"*",component:()=>Promise.all([a.e(0),a.e(4)]).then(a.bind(null,"e51e"))}];var m=f;n["a"].use(h["a"]);var y=function(){const e=new h["a"]({scrollBehavior:()=>({x:0,y:0}),routes:m,mode:"hash",base:""});return e},v=async function(){const e="function"===typeof y?await y({Vue:n["a"]}):y,t={router:e,render:e=>e(p),el:"#q-app"};return{app:t,router:e}},M=a("9523"),b=a.n(M);const _={APPEND:"append",REFRESH:"refresh"};class w{constructor(e){b()(this,"definition",{}),b()(this,"engine",{}),b()(this,"data",[]),b()(this,"properties",{}),b()(this,"loadedModelName",""),b()(this,"dataMode",_.REFRESH),b()(this,"loadModelDefinition",(e=>{e="./explain_engine/definitions/"+e+".json";let t=new XMLHttpRequest;t.overrideMimeType("application/json"),t.open("GET",e,!0),t.onreadystatechange=()=>{4==t.readyState&&"200"==t.status&&(this.definition=JSON.parse(t.responseText),this.engine&&this.engine.postMessage({type:"cmd",target:null,action:"load",data:this.definition,return_tag:null}))},t.send(null)})),b()(this,"getCurrentLoadedModelName",(()=>this.loadedModelName)),b()(this,"setDataloggerInterval",(e=>{this.engine.postMessage({type:"set",target:"datalogger",action:"setUpdateInterval",data:e,return_tag:null})})),b()(this,"setDataloggerWatchedModels",(e=>{this.engine.postMessage({type:"set",target:"datalogger",action:"setWatchedModels",data:e,return_tag:null})})),b()(this,"setDataloggerWatchedModelsRT",(e=>{this.engine.postMessage({type:"set",target:"datalogger",action:"setWatchedModelsRT",data:e,return_tag:null})})),b()(this,"setModelState",(e=>{this.engine.postMessage({type:"set",target:"datalogger",action:"setModelState",data:e,return_tag:null})})),b()(this,"setPropertyDirect",((e,t,a)=>{this.engine.postMessage({type:"set_direct",target:e,action:t,data:a})})),b()(this,"setPropertyByFunction",((e,t,a)=>{this.engine.postMessage({type:"set",target:e,action:t,data:a})})),b()(this,"setProperty",((e,t,a,n=0,r=0,o="abs")=>{this.engine.postMessage({type:"set",target:"interventions",action:"addPropertyChange",data:{model:e,property:t,target:a,in_time:n,at_time:r,mode:o,label:e+t+" change"},return_tag:null})})),b()(this,"getModelJSON",(()=>{this.engine.postMessage({type:"get",target:"datalogger",action:"getModelJSON",data:null,return_tag:"json"})})),b()(this,"getModelState",(()=>{this.engine.postMessage({type:"get",target:"datalogger",action:"getModelStateFull",data:null,return_tag:"state"})})),b()(this,"getModelDefinition",(e=>{this.engine.postMessage({type:"get",target:"model_definition",action:"null",data:null,return_tag:"model_definition"})})),b()(this,"getProperties",(e=>{this.engine.postMessage({type:"get",target:"datalogger",action:"getModelProps",data:e,return_tag:"props"})})),b()(this,"startModel",(()=>{this.clearData(),this.engine.postMessage({type:"cmd",target:null,action:"start",data:null,return_tag:null})})),b()(this,"stopModel",(()=>{this.engine.postMessage({type:"cmd",target:null,action:"stop",data:null,return_tag:null})})),b()(this,"fastForwardModel",(e=>{this.engine.postMessage({type:"cmd",target:null,action:"goto",data:e,return_tag:null})})),b()(this,"calculateModel",(e=>{this.dataMode!==_.APPEND&&this.clearData(),this.engine.postMessage({type:"cmd",target:null,action:"calculate",data:e,return_tag:null})})),b()(this,"clearData",(()=>{this.data=[]})),b()(this,"_receiveMessageFromModel",(e=>{switch(e.type){case"mes":break;case"data":switch(e.target){case"datalogger_output":this.data=e.data;break;case"state":this.snapshot=e.data;break;case"props":this.properties=e.data;default:break}break;case"rt":break;default:break}})),e||(e="normal_neonate"),this.loadedModelName=e,this.engine=new Worker("./explain_engine/engine.js"),this.loadModelDefinition(e),this.engine.addEventListener("message",(e=>{this._receiveMessageFromModel(e.data)}))}}let P=new w;var S=({Vue:e})=>{e.prototype.$model=P};const E="";async function j(){const{app:e,router:t}=await v();let a=!1;const r=e=>{a=!0;const n=Object(e)===e?t.resolve(e).route.fullPath:e;window.location.href=n},o=window.location.href.replace(window.location.origin,""),s=[S];for(let l=0;!1===a&&l<s.length;l++)if("function"===typeof s[l])try{await s[l]({app:e,router:t,Vue:n["a"],ssrContext:null,redirect:r,urlPath:o,publicPath:E})}catch(i){return i&&i.url?void(window.location.href=i.url):void console.error("[Quasar] boot error:",i)}!0!==a&&new n["a"](e)}j()},"5b0d":function(e,t,a){}});