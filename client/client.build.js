window.JSON||(window.JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)d=rep[c],typeof d=="string"&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var JSON=window.JSON,cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(a,b){"use strict";var c=a.History=a.History||{},d=a.jQuery;if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");c.Adapter={bind:function(a,b,c){d(a).bind(b,c)},trigger:function(a,b,c){d(a).trigger(b,c)},extractEventData:function(a,c,d){var e=c&&c.originalEvent&&c.originalEvent[a]||d&&d[a]||b;return e},onDomLoad:function(a){d(a)}},typeof c.init!="undefined"&&c.init()}(window),function(a,b){"use strict";var c=a.document,d=a.setTimeout||d,e=a.clearTimeout||e,f=a.setInterval||f,g=a.History=a.History||{};if(typeof g.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");g.initHtml4=function(){if(typeof g.initHtml4.initialized!="undefined")return!1;g.initHtml4.initialized=!0,g.enabled=!0,g.savedHashes=[],g.isLastHash=function(a){var b=g.getHashByIndex(),c;return c=a===b,c},g.saveHash=function(a){return g.isLastHash(a)?!1:(g.savedHashes.push(a),!0)},g.getHashByIndex=function(a){var b=null;return typeof a=="undefined"?b=g.savedHashes[g.savedHashes.length-1]:a<0?b=g.savedHashes[g.savedHashes.length+a]:b=g.savedHashes[a],b},g.discardedHashes={},g.discardedStates={},g.discardState=function(a,b,c){var d=g.getHashByState(a),e;return e={discardedState:a,backState:c,forwardState:b},g.discardedStates[d]=e,!0},g.discardHash=function(a,b,c){var d={discardedHash:a,backState:c,forwardState:b};return g.discardedHashes[a]=d,!0},g.discardedState=function(a){var b=g.getHashByState(a),c;return c=g.discardedStates[b]||!1,c},g.discardedHash=function(a){var b=g.discardedHashes[a]||!1;return b},g.recycleState=function(a){var b=g.getHashByState(a);return g.discardedState(a)&&delete g.discardedStates[b],!0},g.emulated.hashChange&&(g.hashChangeInit=function(){g.checkerFunction=null;var b="",d,e,h,i;return g.isInternetExplorer()?(d="historyjs-iframe",e=c.createElement("iframe"),e.setAttribute("id",d),e.style.display="none",c.body.appendChild(e),e.contentWindow.document.open(),e.contentWindow.document.close(),h="",i=!1,g.checkerFunction=function(){if(i)return!1;i=!0;var c=g.getHash()||"",d=g.unescapeHash(e.contentWindow.document.location.hash)||"";return c!==b?(b=c,d!==c&&(h=d=c,e.contentWindow.document.open(),e.contentWindow.document.close(),e.contentWindow.document.location.hash=g.escapeHash(c)),g.Adapter.trigger(a,"hashchange")):d!==h&&(h=d,g.setHash(d,!1)),i=!1,!0}):g.checkerFunction=function(){var c=g.getHash();return c!==b&&(b=c,g.Adapter.trigger(a,"hashchange")),!0},g.intervalList.push(f(g.checkerFunction,g.options.hashChangeInterval)),!0},g.Adapter.onDomLoad(g.hashChangeInit)),g.emulated.pushState&&(g.onHashChange=function(b){var d=b&&b.newURL||c.location.href,e=g.getHashByUrl(d),f=null,h=null,i=null,j;return g.isLastHash(e)?(g.busy(!1),!1):(g.doubleCheckComplete(),g.saveHash(e),e&&g.isTraditionalAnchor(e)?(g.Adapter.trigger(a,"anchorchange"),g.busy(!1),!1):(f=g.extractState(g.getFullUrl(e||c.location.href,!1),!0),g.isLastSavedState(f)?(g.busy(!1),!1):(h=g.getHashByState(f),j=g.discardedState(f),j?(g.getHashByIndex(-2)===g.getHashByState(j.forwardState)?g.back(!1):g.forward(!1),!1):(g.pushState(f.data,f.title,f.url,!1),!0))))},g.Adapter.bind(a,"hashchange",g.onHashChange),g.pushState=function(b,d,e,f){if(g.getHashByUrl(e))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.pushState,args:arguments,queue:f}),!1;g.busy(!0);var h=g.createStateObject(b,d,e),i=g.getHashByState(h),j=g.getState(!1),k=g.getHashByState(j),l=g.getHash();return g.storeState(h),g.expectedStateId=h.id,g.recycleState(h),g.setTitle(h),i===k?(g.busy(!1),!1):i!==l&&i!==g.getShortUrl(c.location.href)?(g.setHash(i,!1),!1):(g.saveState(h),g.Adapter.trigger(a,"statechange"),g.busy(!1),!0)},g.replaceState=function(a,b,c,d){if(g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(d!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.replaceState,args:arguments,queue:d}),!1;g.busy(!0);var e=g.createStateObject(a,b,c),f=g.getState(!1),h=g.getStateByIndex(-2);return g.discardState(f,e,h),g.pushState(e.data,e.title,e.url,!1),!0}),g.emulated.pushState&&g.getHash()&&!g.emulated.hashChange&&g.Adapter.onDomLoad(function(){g.Adapter.trigger(a,"hashchange")})},typeof g.init!="undefined"&&g.init()}(window),function(a,b){"use strict";var c=a.console||b,d=a.document,e=a.navigator,f=a.sessionStorage||!1,g=a.setTimeout,h=a.clearTimeout,i=a.setInterval,j=a.clearInterval,k=a.JSON,l=a.alert,m=a.History=a.History||{},n=a.history;k.stringify=k.stringify||k.encode,k.parse=k.parse||k.decode;if(typeof m.init!="undefined")throw new Error("History.js Core has already been loaded...");m.init=function(){return typeof m.Adapter=="undefined"?!1:(typeof m.initCore!="undefined"&&m.initCore(),typeof m.initHtml4!="undefined"&&m.initHtml4(),!0)},m.initCore=function(){if(typeof m.initCore.initialized!="undefined")return!1;m.initCore.initialized=!0,m.options=m.options||{},m.options.hashChangeInterval=m.options.hashChangeInterval||100,m.options.safariPollInterval=m.options.safariPollInterval||500,m.options.doubleCheckInterval=m.options.doubleCheckInterval||500,m.options.storeInterval=m.options.storeInterval||1e3,m.options.busyDelay=m.options.busyDelay||250,m.options.debug=m.options.debug||!1,m.options.initialTitle=m.options.initialTitle||d.title,m.intervalList=[],m.clearAllIntervals=function(){var a,b=m.intervalList;if(typeof b!="undefined"&&b!==null){for(a=0;a<b.length;a++)j(b[a]);m.intervalList=null}},m.debug=function(){(m.options.debug||!1)&&m.log.apply(m,arguments)},m.log=function(){var a=typeof c!="undefined"&&typeof c.log!="undefined"&&typeof c.log.apply!="undefined",b=d.getElementById("log"),e,f,g,h,i;a?(h=Array.prototype.slice.call(arguments),e=h.shift(),typeof c.debug!="undefined"?c.debug.apply(c,[e,h]):c.log.apply(c,[e,h])):e="\n"+arguments[0]+"\n";for(f=1,g=arguments.length;f<g;++f){i=arguments[f];if(typeof i=="object"&&typeof k!="undefined")try{i=k.stringify(i)}catch(j){}e+="\n"+i+"\n"}return b?(b.value+=e+"\n-----\n",b.scrollTop=b.scrollHeight-b.clientHeight):a||l(e),!0},m.getInternetExplorerMajorVersion=function(){var a=m.getInternetExplorerMajorVersion.cached=typeof m.getInternetExplorerMajorVersion.cached!="undefined"?m.getInternetExplorerMajorVersion.cached:function(){var a=3,b=d.createElement("div"),c=b.getElementsByTagName("i");while((b.innerHTML="<!--[if gt IE "+ ++a+"]><i></i><![endif]-->")&&c[0]);return a>4?a:!1}();return a},m.isInternetExplorer=function(){var a=m.isInternetExplorer.cached=typeof m.isInternetExplorer.cached!="undefined"?m.isInternetExplorer.cached:Boolean(m.getInternetExplorerMajorVersion());return a},m.emulated={pushState:!Boolean(a.history&&a.history.pushState&&a.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)),hashChange:Boolean(!("onhashchange"in a||"onhashchange"in d)||m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8)},m.enabled=!m.emulated.pushState,m.bugs={setHash:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),safariPoll:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),ieDoubleCheck:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<7)},m.isEmptyObject=function(a){for(var b in a)return!1;return!0},m.cloneObject=function(a){var b,c;return a?(b=k.stringify(a),c=k.parse(b)):c={},c},m.getRootUrl=function(){var a=d.location.protocol+"//"+(d.location.hostname||d.location.host);if(d.location.port||!1)a+=":"+d.location.port;return a+="/",a},m.getBaseHref=function(){var a=d.getElementsByTagName("base"),b=null,c="";return a.length===1&&(b=a[0],c=b.href.replace(/[^\/]+$/,"")),c=c.replace(/\/+$/,""),c&&(c+="/"),c},m.getBaseUrl=function(){var a=m.getBaseHref()||m.getBasePageUrl()||m.getRootUrl();return a},m.getPageUrl=function(){var a=m.getState(!1,!1),b=(a||{}).url||d.location.href,c;return c=b.replace(/\/+$/,"").replace(/[^\/]+$/,function(a,b,c){return/\./.test(a)?a:a+"/"}),c},m.getBasePageUrl=function(){var a=d.location.href.replace(/[#\?].*/,"").replace(/[^\/]+$/,function(a,b,c){return/[^\/]$/.test(a)?"":a}).replace(/\/+$/,"")+"/";return a},m.getFullUrl=function(a,b){var c=a,d=a.substring(0,1);return b=typeof b=="undefined"?!0:b,/[a-z]+\:\/\//.test(a)||(d==="/"?c=m.getRootUrl()+a.replace(/^\/+/,""):d==="#"?c=m.getPageUrl().replace(/#.*/,"")+a:d==="?"?c=m.getPageUrl().replace(/[\?#].*/,"")+a:b?c=m.getBaseUrl()+a.replace(/^(\.\/)+/,""):c=m.getBasePageUrl()+a.replace(/^(\.\/)+/,"")),c.replace(/\#$/,"")},m.getShortUrl=function(a){var b=a,c=m.getBaseUrl(),d=m.getRootUrl();return m.emulated.pushState&&(b=b.replace(c,"")),b=b.replace(d,"/"),m.isTraditionalAnchor(b)&&(b="./"+b),b=b.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),b},m.store={},m.idToState=m.idToState||{},m.stateToId=m.stateToId||{},m.urlToId=m.urlToId||{},m.storedStates=m.storedStates||[],m.savedStates=m.savedStates||[],m.normalizeStore=function(){m.store.idToState=m.store.idToState||{},m.store.urlToId=m.store.urlToId||{},m.store.stateToId=m.store.stateToId||{}},m.getState=function(a,b){typeof a=="undefined"&&(a=!0),typeof b=="undefined"&&(b=!0);var c=m.getLastSavedState();return!c&&b&&(c=m.createStateObject()),a&&(c=m.cloneObject(c),c.url=c.cleanUrl||c.url),c},m.getIdByState=function(a){var b=m.extractId(a.url),c;if(!b){c=m.getStateString(a);if(typeof m.stateToId[c]!="undefined")b=m.stateToId[c];else if(typeof m.store.stateToId[c]!="undefined")b=m.store.stateToId[c];else{for(;;){b=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof m.idToState[b]=="undefined"&&typeof m.store.idToState[b]=="undefined")break}m.stateToId[c]=b,m.idToState[b]=a}}return b},m.normalizeState=function(a){var b,c;if(!a||typeof a!="object")a={};if(typeof a.normalized!="undefined")return a;if(!a.data||typeof a.data!="object")a.data={};b={},b.normalized=!0,b.title=a.title||"",b.url=m.getFullUrl(m.unescapeString(a.url||d.location.href)),b.hash=m.getShortUrl(b.url),b.data=m.cloneObject(a.data),b.id=m.getIdByState(b),b.cleanUrl=b.url.replace(/\??\&_suid.*/,""),b.url=b.cleanUrl,c=!m.isEmptyObject(b.data);if(b.title||c)b.hash=m.getShortUrl(b.url).replace(/\??\&_suid.*/,""),/\?/.test(b.hash)||(b.hash+="?"),b.hash+="&_suid="+b.id;return b.hashedUrl=m.getFullUrl(b.hash),(m.emulated.pushState||m.bugs.safariPoll)&&m.hasUrlDuplicate(b)&&(b.url=b.hashedUrl),b},m.createStateObject=function(a,b,c){var d={data:a,title:b,url:c};return d=m.normalizeState(d),d},m.getStateById=function(a){a=String(a);var c=m.idToState[a]||m.store.idToState[a]||b;return c},m.getStateString=function(a){var b,c,d;return b=m.normalizeState(a),c={data:b.data,title:a.title,url:a.url},d=k.stringify(c),d},m.getStateId=function(a){var b,c;return b=m.normalizeState(a),c=b.id,c},m.getHashByState=function(a){var b,c;return b=m.normalizeState(a),c=b.hash,c},m.extractId=function(a){var b,c,d;return c=/(.*)\&_suid=([0-9]+)$/.exec(a),d=c?c[1]||a:a,b=c?String(c[2]||""):"",b||!1},m.isTraditionalAnchor=function(a){var b=!/[\/\?\.]/.test(a);return b},m.extractState=function(a,b){var c=null,d,e;return b=b||!1,d=m.extractId(a),d&&(c=m.getStateById(d)),c||(e=m.getFullUrl(a),d=m.getIdByUrl(e)||!1,d&&(c=m.getStateById(d)),!c&&b&&!m.isTraditionalAnchor(a)&&(c=m.createStateObject(null,null,e))),c},m.getIdByUrl=function(a){var c=m.urlToId[a]||m.store.urlToId[a]||b;return c},m.getLastSavedState=function(){return m.savedStates[m.savedStates.length-1]||b},m.getLastStoredState=function(){return m.storedStates[m.storedStates.length-1]||b},m.hasUrlDuplicate=function(a){var b=!1,c;return c=m.extractState(a.url),b=c&&c.id!==a.id,b},m.storeState=function(a){return m.urlToId[a.url]=a.id,m.storedStates.push(m.cloneObject(a)),a},m.isLastSavedState=function(a){var b=!1,c,d,e;return m.savedStates.length&&(c=a.id,d=m.getLastSavedState(),e=d.id,b=c===e),b},m.saveState=function(a){return m.isLastSavedState(a)?!1:(m.savedStates.push(m.cloneObject(a)),!0)},m.getStateByIndex=function(a){var b=null;return typeof a=="undefined"?b=m.savedStates[m.savedStates.length-1]:a<0?b=m.savedStates[m.savedStates.length+a]:b=m.savedStates[a],b},m.getHash=function(){var a=m.unescapeHash(d.location.hash);return a},m.unescapeString=function(b){var c=b,d;for(;;){d=a.unescape(c);if(d===c)break;c=d}return c},m.unescapeHash=function(a){var b=m.normalizeHash(a);return b=m.unescapeString(b),b},m.normalizeHash=function(a){var b=a.replace(/[^#]*#/,"").replace(/#.*/,"");return b},m.setHash=function(a,b){var c,e,f;return b!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.setHash,args:arguments,queue:b}),!1):(c=m.escapeHash(a),m.busy(!0),e=m.extractState(a,!0),e&&!m.emulated.pushState?m.pushState(e.data,e.title,e.url,!1):d.location.hash!==c&&(m.bugs.setHash?(f=m.getPageUrl(),m.pushState(null,null,f+"#"+c,!1)):d.location.hash=c),m)},m.escapeHash=function(b){var c=m.normalizeHash(b);return c=a.escape(c),m.bugs.hashEscape||(c=c.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),c},m.getHashByUrl=function(a){var b=String(a).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return b=m.unescapeHash(b),b},m.setTitle=function(a){var b=a.title,c;b||(c=m.getStateByIndex(0),c&&c.url===a.url&&(b=c.title||m.options.initialTitle));try{d.getElementsByTagName("title")[0].innerHTML=b.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(e){}return d.title=b,m},m.queues=[],m.busy=function(a){typeof a!="undefined"?m.busy.flag=a:typeof m.busy.flag=="undefined"&&(m.busy.flag=!1);if(!m.busy.flag){h(m.busy.timeout);var b=function(){var a,c,d;if(m.busy.flag)return;for(a=m.queues.length-1;a>=0;--a){c=m.queues[a];if(c.length===0)continue;d=c.shift(),m.fireQueueItem(d),m.busy.timeout=g(b,m.options.busyDelay)}};m.busy.timeout=g(b,m.options.busyDelay)}return m.busy.flag},m.busy.flag=!1,m.fireQueueItem=function(a){return a.callback.apply(a.scope||m,a.args||[])},m.pushQueue=function(a){return m.queues[a.queue||0]=m.queues[a.queue||0]||[],m.queues[a.queue||0].push(a),m},m.queue=function(a,b){return typeof a=="function"&&(a={callback:a}),typeof b!="undefined"&&(a.queue=b),m.busy()?m.pushQueue(a):m.fireQueueItem(a),m},m.clearQueue=function(){return m.busy.flag=!1,m.queues=[],m},m.stateChanged=!1,m.doubleChecker=!1,m.doubleCheckComplete=function(){return m.stateChanged=!0,m.doubleCheckClear(),m},m.doubleCheckClear=function(){return m.doubleChecker&&(h(m.doubleChecker),m.doubleChecker=!1),m},m.doubleCheck=function(a){return m.stateChanged=!1,m.doubleCheckClear(),m.bugs.ieDoubleCheck&&(m.doubleChecker=g(function(){return m.doubleCheckClear(),m.stateChanged||a(),!0},m.options.doubleCheckInterval)),m},m.safariStatePoll=function(){var b=m.extractState(d.location.href),c;if(!m.isLastSavedState(b))c=b;else return;return c||(c=m.createStateObject()),m.Adapter.trigger(a,"popstate"),m},m.back=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.back,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.back(!1)}),n.go(-1),!0)},m.forward=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.forward,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.forward(!1)}),n.go(1),!0)},m.go=function(a,b){var c;if(a>0)for(c=1;c<=a;++c)m.forward(b);else{if(!(a<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(c=-1;c>=a;--c)m.back(b)}return m};if(m.emulated.pushState){var o=function(){};m.pushState=m.pushState||o,m.replaceState=m.replaceState||o}else m.onPopState=function(b,c){var e=!1,f=!1,g,h;return m.doubleCheckComplete(),g=m.getHash(),g?(h=m.extractState(g||d.location.href,!0),h?m.replaceState(h.data,h.title,h.url,!1):(m.Adapter.trigger(a,"anchorchange"),m.busy(!1)),m.expectedStateId=!1,!1):(e=m.Adapter.extractEventData("state",b,c)||!1,e?f=m.getStateById(e):m.expectedStateId?f=m.getStateById(m.expectedStateId):f=m.extractState(d.location.href),f||(f=m.createStateObject(null,null,d.location.href)),m.expectedStateId=!1,m.isLastSavedState(f)?(m.busy(!1),!1):(m.storeState(f),m.saveState(f),m.setTitle(f),m.Adapter.trigger(a,"statechange"),m.busy(!1),!0))},m.Adapter.bind(a,"popstate",m.onPopState),m.pushState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.pushState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.pushState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0},m.replaceState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.replaceState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.replaceState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0};if(f){try{m.store=k.parse(f.getItem("History.store"))||{}}catch(p){m.store={}}m.normalizeStore()}else m.store={},m.normalizeStore();m.Adapter.bind(a,"beforeunload",m.clearAllIntervals),m.Adapter.bind(a,"unload",m.clearAllIntervals),m.saveState(m.storeState(m.extractState(d.location.href,!0))),f&&(m.onUnload=function(){var a,b;try{a=k.parse(f.getItem("History.store"))||{}}catch(c){a={}}a.idToState=a.idToState||{},a.urlToId=a.urlToId||{},a.stateToId=a.stateToId||{};for(b in m.idToState){if(!m.idToState.hasOwnProperty(b))continue;a.idToState[b]=m.idToState[b]}for(b in m.urlToId){if(!m.urlToId.hasOwnProperty(b))continue;a.urlToId[b]=m.urlToId[b]}for(b in m.stateToId){if(!m.stateToId.hasOwnProperty(b))continue;a.stateToId[b]=m.stateToId[b]}m.store=a,m.normalizeStore(),f.setItem("History.store",k.stringify(a))},m.intervalList.push(i(m.onUnload,m.options.storeInterval)),m.Adapter.bind(a,"beforeunload",m.onUnload),m.Adapter.bind(a,"unload",m.onUnload));if(!m.emulated.pushState){m.bugs.safariPoll&&m.intervalList.push(i(m.safariStatePoll,m.options.safariPollInterval));if(e.vendor==="Apple Computer, Inc."||(e.appCodeName||"")==="Mozilla")m.Adapter.bind(a,"hashchange",function(){m.Adapter.trigger(a,"popstate")}),m.getHash()&&m.Adapter.onDomLoad(function(){m.Adapter.trigger(a,"hashchange")})}},m.init()}(window)
/**
 * By using the native call and apply methodology, this class allows
 * the user to have full control over custom event creation and handling.
 *
 * @author Garth Henson garth@guahanweb.com
 * @version 1.0
 */

/** @namespace */
var Events = {};
(function() {
    Events = /** @lends Events */{
        /**
         * Enables event consumption and management on the provided class. This
         * needs to be called from the context of the object in which events are
         * to be enabled.
         * 
         * @public
         * @example
         * var MyObj = function() {
         *     var self = this;
         *     this.init = function() {
         *         Events.enable.call(self);
         *     };
         *     
         *     this.log = function() {
         *         console.log(self);
         *         self.fireEvent('log');
         *     };
         *
         *     this.init();
         * };
         *
         * var o = new MyObj();
         * o.addListener('log', function() { console.log('Event fired!'); });
         * o.log();
         */
        enable : function() {
            var self = this;
            self.listeners = {};
            
            // Fire event
            self.dispatch = function(ev, args) {
                Events.dispatch.call(self, ev, args);
            };
            
            // Add listener
            self.addListener = function(ev, fn) {
                Events.addListener.call(self, ev, fn);
            };
            
            // Remove listener
            self.removeListener = function(ev, fn) {
                Events.removeListener.call(self, ev, fn);
            }
        },
        
        /**
         * Fires the provided <code>ev</code> event and executes all listeners attached
         * to it. If <code>args</code> is provided, they will be passed along to the
         * listeners.
         *
         * @public
         * @param {string} ev The name of the event to fire
         * @param {array} args Optional array of args to pass to the listeners
         */
        dispatch : function(ev, args) {
            if (!!this.listeners[ev]) {
                for (var i = 0; i < this.listeners[ev].length; i++) {
                    var fn = this.listeners[ev][i];
                    fn.apply(window, args);
                }
            }
        },
        
        /**
         * Binds the execution of the provided <code>fn</code> when the <code>ev</code> is fired.
         *
         * @public
         * @param {string} ev The name of the event to bind
         * @param {function} fn A function to bind to the event
         */
        addListener : function(ev, fn) {
            // Verify we have events enabled
            Events.enable.call(this, ev);
            
            if (!this.listeners[ev]) {
                this.listeners[ev] = [];
            }
            
            if (fn instanceof Function) {
                this.listeners[ev].push(fn);
            }
        },
        
        /**
         * Removes the provided <code>fn</code> from the <code>ev</code>. If no function is
         * provided, all listeners for this event are removed.
         *
         * @public
         * @param {string} ev The name of the event to unbind
         * @param {function} fn An optional listener to be removed
         */
        removeListener : function(ev, fn) {
            if (!!this.listeners[ev] && this.listeners[ev].length > 0) {
                // If a function is provided, remove it
                if (!!fn) {
                    var new_fn = [];
                    for (var i = 0; i < this.listeners[ev].length; i++) {
                        if (this.listeners[ev][i] != fn) {
                            new_fn.push(this.listeners[ev][i]);
                        }
                    }
                    this.listeners[ev] = new_fn;
                } else { // Otherwise, remove them all
                    this.listeners[ev] = [];
                }
            }
        }
    };
}());/*
 * jquery.Storage
 * A jQuery plugin to make localStorage easy and managable to use
 *
 * Copyright (c) Brandon Hicks (Tarellel)
 *
 * Version: 1.0.0a (12/6/10)
 * Requires: jQuery 1.4
 *
 *
 */
  // validate if the visiting browser supports localStorage
  var supported = true;
  var keyMeta = 'ls_';

  //var localStorage === window.localStorage
  if (typeof localStorage == 'undefined' || typeof JSON == 'undefined'){
      supported = false;
  }

  // errors produced by localStorage
  this.storageError = function(error){
    switch(error){
      // current browser/device is not supported
      case 'SUPPORTED':
        alert("Your browser does not support localStorage!");
        break;

      // browsers database quota is full
      case 'QUOTA':
        alert("Your storage quota is currently full!");
        console.log("Browser database quote exceeded.");
        break;

      // Any other error that may have occurred
      default:
        alert('An unknown error has occurred!');
        break;
    }
    return true;
  };

  // saves specified item using ("key","value")
  this.saveItem = function(itemKey, itemValue, lifetime){
    if (typeof lifetime == 'undefined'){
       lifetime = 60000;
    }

    if (!supported){
      // set future expiration for cookie
      dt = new Date();
      // 1 = 1day can use days variable
      //dt.setTime(dt.getTime() + (1*24*60*60*1000));
      dt.setTime(dt.getTime() + lifetime);
      expires = "expires= " + dt.toGMTString();

      document.cookie = keyMeta + itemKey.toString() + "=" + itemValue + "; " + expires + "; path=/";
      return true;
    }

    // set specified item
    try{
      localStorage.setItem(keyMeta+itemKey.toString(), JSON.stringify(itemValue));
    } catch (e){
      // if the browsers database is full produce error
      if (e == QUOTA_EXCEEDED_ERR) {
        this.storageError('QUOTA');
        return false;
      }
    }
    return true;
  };

  // load value of a specified database item
  this.loadItem = function(itemKey){
    if(itemKey===null){ return null; }
    if (!supported){
      var cooKey = keyMeta + itemKey.toString() + "=";
      // go through cookies looking for one that matchs the specified key
      var cookArr = document.cookie.split(';');
      for(var i=0, cookCount = cookArr; i < cookCount; i++){
        var current_cookie = cookArr[i];
        while(current_cookie.charAt(0) == ''){
          current_cookie = current_cookie.substring(1, current_cookie.length);
          // if keys match return cookie
          if (current_cookie.indexOf(cooKey) == 0) {
            return current_cookie.substring(cooKey.length, current_cookie.length);
          }
        }
      }
      return null;
    }

    var data = localStorage.getItem(keyMeta+itemKey.toString());
    if (data){
      return JSON.parse(data);
    }else{
      return false;
    }
  };

  // removes specified item
  this.deleteItem = function (itemKey){
    if (!supported){
      document.cookie = keyMeta + itemKey.toString() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return true;
    }

    localStorage.removeItem(keyMeta+itemKey.toString());
    return true;
  };

  // WARNING!!! this clears entire localStorage Database
  this.deleteAll = function(){
    if (!supported){
      // process each and every cookie through a delete funtion
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++){
        this.deleteItem(cookies[i].split("=")[0]);
      }
      return true;
    }

    localStorage.clear();
    return true;
  };

  // jquery namespace for the function set
  jQuery.Storage = this;// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed

  var cache = {};
  var tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
   
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
function fisherYates ( myArray ) {
  var i = myArray.length, j, tempi, tempj;
  if ( i == 0 ) return false;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     tempi = myArray[i];
     tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}


client = {
	id: -1,
	server: window.location.hostname+(window.location.port ? ':'+window.location.port: ''),
	user: null,
	school: true,
};

client.init = function(){

	History.Adapter.bind(window,'statechange', client.onStateChange);

	client.ui.setModal("Laddar", '<div class="loader"></div>', {});


	$.getScript('http://'+client.server+'/socket.io/socket.io.js', function() {
			client.ui.setModal("Ansluter till servern", '<div class="loader"></div>', {});
            client.network.init();
			client.quiz.init();
			client.enableListeners();
     });
};

client.connect = function(){

};

client.connected = function(){
	var username = $.Storage.loadItem('player');

	if(typeof username == 'string' && username.length > 1){
		client.network.join(username);
	}else
	client.ui.showLogin(client.join);
};

client.onStateChange = function(){
	client.ui.hideJoin();
	var State = History.getState(); // Note: We are using History.getState() instead of event.state
     	//History.log(State.data, State.title, State.url);


		var hash = State.cleanUrl.replace('http://' + client.server,'').replace('/?','');
    var bits = hash.split('/');

		$('#lobbyLink').addClass("unactive");

		switch(bits[0]){
			case 'quizes':
				client.quiz.setPageQuizes(bits[1], bits[2]);
			break;
			case 'lobbies':
				client.currentQuizId = bits[1];
				client.quiz.showLobbies(bits[1]);
			break;
			case 'lobby':
				client.quiz.showLobby(bits[1]);
			break;
		}
};

client.enableListeners = function(){
	$(document).keydown(function(event){
		if(event.which == 9){
			client.ui.showConsole();
			$("#console > input").focus();
			event.preventDefault();
		}
	});

	$("#console > input").keypress(function(event){
		if(event.which == 13){
			client.network.sendCommand($("#console > input").val());
			$("#console > input").val('')
			client.ui.hideConsole();
		}
	});

	$('#quizes-link').click(function(){
		History.pushState({}, 'Titel', '/?quizes');
		return false;
	});

	$('#lobbyLink > .bg-overlay a').click(function(){
		var lobbyID = client.quiz.currentLobby.id;
		History.pushState({}, 'Lobby', '/?lobby/' + lobbyID);
		return false;
	});

	$('#logout').click(function(){
		client.quiz.currentLobby = {};
		client.ui.hideLobbyLink();
		$.Storage.deleteItem('player');
		client.ui.showLogin(client.join);
		$('.right-nav').hide();
	});
};

client.setPlayer = function(data){
	client.user = data;
	$.Storage.saveItem('player', client.user.username);
	$('.right-nav').show();
	$("#username").text(data.username);
};

client.join = function(){
	var username = $("#username-input").val();

	if(username.length > 1){
		client.ui.setModal("Loggar in", '<div class="loader"></div>', {});
		client.network.join(username);
	}else{
		alert("Du måste skriva in ett användarnamn i rutan");
		$("#username-input").focus().addClass("blinking");
	}

	return false;
};

client.usernameFocus = function(){
	setTimeout(function(){
		$("#username").removeClass("blinking");
	},	5000);
};
client.network = {
	connected: false,
};

client.network.init = function(){
	client.network.connect();
};

client.network.connect = function(){
	if(!client.network.connected){
		var socket = client.network.socket = io.connect('http://'+client.server+'');
		
		//connection
		socket.on('connect', client.network.listeners.connect);
		socket.on('disconnect', client.network.listeners.disconnect);
		socket.on('retPing', client.network.retPing);
		
		
		//login
		socket.on('joinResponse', client.network.listeners.joinResponse);
		socket.on('playerData', client.network.listeners.playerData);
		
		//lobby
		socket.on('joinLobby', client.network.listeners.joinLobby);
		socket.on('leaveLobby', client.network.listeners.leaveLobby);
		socket.on('lobbyClosed', client.network.listeners.lobbyClosed);
		socket.on('syncPlayers', client.network.listeners.syncPlayers);
		
		socket.on('listQuizes', client.network.listeners.listQuizes);
		socket.on('listLobbies', client.network.listeners.listLobbies);
		
		socket.on('lobbyCreated', client.network.listeners.lobbyCreated);
		socket.on('stopQuiz', client.network.listeners.stopQuiz);
		socket.on('changeHost', client.network.listeners.changeHost);
		
		//quiz
		socket.on('quizInfo', client.network.listeners.quizInfo);
		socket.on('quizQuestion', client.network.listeners.quizQuestion);
		socket.on('quizQuestionTimeLeft', client.ui.setTimeLeft);
		socket.on('quizAnswer', client.network.listeners.quizAnswer);
		socket.on('notifyNextQuestion', client.network.listeners.notifyNextQuestion);
		socket.on('quizEndOfRound', client.network.listeners.quizEndOfRound);
		socket.on('quizReset', client.network.listeners.quizReset);
		
		//player
		socket.on('playerJoin', client.network.listeners.playerJoin);
		socket.on('playerStatus', client.network.listeners.playerStatus);
		socket.on('playerLeave', client.network.listeners.playerLeave);
	}

};

client.network.disconnect = function(){
	client.network.connected = false;
	client.network.socket.disconnect();
};

client.network.pingLoop = function(){
	if(client.network.connected){
		client.network.latancy = null;
		client.network.prevLatancy = null;
		client.network.pingsLeft = 3;
		client.network.ping();
		setTimeout(client.network.pingLoop, 40000);
	}
};

client.network.ping = function(){
	if(client.network.connected){
		client.network.pingTime = Date.now();
		client.network.emit('ping');
	}
};

client.network.retPing = function(){
	var newLatency = (Date.now()-client.network.pingTime)/2;
	var prevLatancy = client.network.latancy || newLatency;
	client.network.latancy = ((client.network.prevLatancy || newLatency) + newLatency)/2;
	client.network.prevLatancy = prevLatancy;
	
	$('#latency').text('Latens: ' + client.network.latancy);
	console.log('Latens: ' + client.network.latancy, 'New: ' + newLatency, 'Prev: ' + prevLatancy);
	
	if(client.network.pingsLeft-- > 0){
		setTimeout(client.network.ping, 500);
	}
};


client.network.join = function(username){
	if(client.network.connected){
		client.network.emit('join', username);
	}else{
		alert("Not connected to server!");
	}
};

client.network.chooseAnswer = function(answer){
	client.network.emit("answer", answer);
};


client.network.sendCommand = function(cmd){
	client.network.emit('cmd', cmd);
};

client.network.emit = function(tag, data){
	if(client.network.connected){
		client.network.socket.emit(tag, data);
	}
};

client.network.listeners = {};

client.network.listeners.connect = function(data){
	client.network.connected = true;
	client.connected();
	client.network.pingLoop();
	//client.dispatch('connected');
};

client.network.listeners.disconnect = function(data){
	client.network.connected = false;
	
	client.ui.setModal('Förlorade kontakten med servern - Återansluter', '<div class="loader"></div>', {});
	
	//client.dispatch('disconnected');
};

/*=================================
			Login
==================================*/

client.network.listeners.joinResponse = function(data){
	if(data == 1){
		client.ui.hideJoin();
		if(client.school){
			History.replaceState({state:1}, 'Lobby', '/?lobby/0');
		}else
		if(History.getState().hash == "/"){
			if(typeof data == "number"){
				History.replaceState({state:1}, 'state', '/?lobby/' + data);
			}else{
				History.replaceState({state:1}, 'state', '/?quizes');
			}
		}else
			client.onStateChange();		
	}else{
		switch(data){
			case 2: 
				alert("Användarnamnet används redan!");
				client.ui.showLogin(client.join);
				break;
			case 3: 
				alert("Du är redan inloggad med ett annat användarnamn!");
			break;
			default:
				alert("Fel på servern!");
		}
	}
};

client.network.listeners.playerData = function(data){
	client.setPlayer(data);
};

client.network.listeners.listQuizes = function(data){
	client.ui.listQuizes(data);
};

client.network.listeners.listLobbies = function(data){
	client.ui.listLobbies(data);
};


/*=================================
			Quiz
==================================*/

client.network.listeners.stopQuiz = function(){
	client.ui.stop();
};

client.network.listeners.quizInfo = function(data){
	client.ui.setQuiz(data);
};

client.network.listeners.quizQuestion = function(data){
	client.quiz.setQuestion(data);
};

client.network.listeners.quizAnswer = function(data){
	client.quiz.correctAnswer(data);
};

client.network.listeners.notifyNextQuestion = function(time){
	client.ui.notifyNextQuestion(time);
};

client.network.listeners.quizEndOfRound = function(data){
	client.quiz.quizEndOfRound(data);
};

client.network.listeners.quizReset = function(){
	client.ui.quizReset();
};

/*=================================
			Lobby
==================================*/

client.network.listeners.syncPlayers = function(data){
	client.quiz.syncPlayers(data);
};

client.network.listeners.joinLobby = function(lobby){
	client.quiz.setLobby(lobby);
};

client.network.listeners.leaveLobby = function(data){
};

client.network.listeners.lobbyClosed = function(data){
	alert("lobbyClosed");
};

client.network.listeners.lobbyCreated = function(id){
	History.pushState({state:1}, 'Lobby', '/?lobby/' + id);
};

client.network.listeners.changeHost = function(data){
	client.quiz.changeHost(data);
};

/*=================================
			Players
==================================*/

client.network.listeners.playerJoin = function(data){
	client.quiz.join(data);
};

client.network.listeners.playerStatus = function(data){
	client.quiz.status(data);
};

client.network.listeners.playerLeave = function(data){
	client.quiz.leave(data);
};
/*********************************************
	Client.Quiz.js
	

**********************************************/

client.quiz = {
	users: [],
	currentQuiz: {},
	currentLobby: {},
	currentQuestion: {},
	timeLeft: 0,
};

client.quiz.init = function(){

};

client.quiz.join = function(player){
	client.ui.addUser(player);
	client.quiz.currentLobby.players.push(player);
};

client.quiz.leave = function(id){
	for(var i in client.quiz.currentLobby.players){
		var player = client.quiz.currentLobby.players[i];
		if(player.id == id)
			client.quiz.currentLobby.players.splice(i, 1);
	}
	client.ui.removeUser(id);
};

client.quiz.changeHost = function(id){
	client.quiz.currentLobby.host = id;
	client.ui.setLobbyPage(client.quiz.currentLobby);
};

client.quiz.syncPlayers = function(players){
	client.ui.syncPlayers(players);
};

client.quiz.chooseAnswer = function(index){
	client.ui.chooseAnswer(index);
	client.network.chooseAnswer(index);
};

client.quiz.setQuestion = function(data){
	client.quiz.currentQuestion = data;
	client.ui.setQuestion(data);
};

client.quiz.createLobby = function(){
	var title = $('#input-lobby-title').val();
	var desc = $('#input-lobby-desc').val();
	
	if(title.length < 1){
		alert("Du måste skriva in en titel!");
	}else{
		client.network.emit("createLobby", {
			id: client.currentQuizId,
			title: title,
			desc: desc,
		});
		client.ui.setModal("Skapar lobby", '<div class="loader"></div>', {});
	}
};

client.quiz.showLobby = function(id){
	if(client.quiz.currentLobby.id == id){
		client.ui.setLobbyPage(client.quiz.currentLobby);
	}else{
		client.network.emit("enterLobby", id);
	}
};

client.quiz.setLobby = function(lobby){
	client.quiz.currentLobby = lobby;
	client.quiz.setQuiz(lobby.quiz);
	client.ui.setLobby(lobby);
	client.quiz.showLobby(lobby.id);
	
	/*
	client.quiz.syncPlayers(lobby.players);
	client.quiz.setQuiz(lobby.quiz);
	client.ui.setLobby(lobby);
	
	client.ui.setStats(lobby.stats);
	*/
};

client.quiz.setQuiz = function(quiz){
	client.quiz.currentQuiz = quiz;
	client.ui.setQuiz(quiz);
};

client.quiz.quizEndOfRound = function(data){
	client.ui.quizEndOfRound(data);
};

client.quiz.status = function(username){

};

client.quiz.update = function(username, status){
	
};

client.quiz.setPageQuizes = function(category, data){
	client.ui.setQuizesPage(category, data);
	client.network.emit('getQuizes', {});
};

client.quiz.showLobbies = function(id){
	client.ui.setModal("Laddar", '<div class="loader"></div>', {});
	client.network.emit('getLobbies', {id:id});
};

client.quiz.correctAnswer = function(data){
	var correct = data.correct,
		players = data.players,
		stats = data.stats;
		
	for(var i in stats){
		if(client.quiz.currentLobby.players[i])
			client.quiz.currentLobby.players[i].points = stats[i];
	}
		
	client.ui.setStats(stats);
	client.ui.displayAnswers(players, correct);
};/*********************************************
	Client.UI.js
	View
	Everything that changes onscreen should be generated here

**********************************************/

client.ui = {};


client.ui.hideJoin = function(){
	$("#modal-overlay").fadeOut();
};

client.ui.showJoin = function(){
	$("#modal-overlay").fadeIn();
};

client.ui.showConsole = function(){
	$('#console').show();
};
client.ui.hideConsole = function(){
	$('#console').hide();
};

client.ui.showLogin = function(loginFunc){
	client.ui.setModal('Ange ett användarnamn', '<input id="username-input" type="text" placeholder="Användarnamn"/>', {
		Ok: loginFunc,
	});
	$("#username-input").focus(client.usernameFocus);
};

client.ui.listLobbies = function(data){
	client.ui.setModal('Lobbies &middot; <input id="create-lobby" type="button" value="Skapa en lobby"/>', '<ul id="list-lobbies" class="lobbies"></ul>', {Ok: function(){
		History.back();
		return true;
	}});
	
	$('#create-lobby').click(function(){
		client.ui.setModal('Skapa lobby', tmpl("create_lobby_tmpl", {}), {Ok: client.quiz.createLobby,
		Avbryt: function(){
			History.back();
			return true;
		}});
	})
	
	
	for(var i in data){
		var html = $(tmpl("lobby_list_tmpl", data[i]).replace(' ',''));
		
		html.click(function(){
			var id = $(this).attr('id').replace('lobby-','');
			History.pushState({state:1}, 'State 3', '/?lobby/'+id);
		});
		
		$('#list-lobbies').append(html);
	}
	
};client.ui.addUser = function(player){
	var pc = 100*player.points/client.quiz.currentQuiz.totalPoints;
	
	var html = '<tr id="player-'+player.id+'" class="player-row">';
		html += '<td>'+player.username+''+(client.quiz.currentLobby.host == player.id ? ' <span class="blue">[Host]</span> ' : '')+'</td>'
		html += '<td class="progress-cell"><div class="progress-bar" style="width:'+(pc||0)+'%;">'+player.points+' Poäng</div></td>';
        html += '<td><span class="points green"></span></td>';
		html += '</tr>';
		
	$("#result-table > tbody > tr:last").after(html);
};

client.ui.removeUser = function(id){
	$('#player-'+id).remove();
};

client.ui.syncPlayers = function(players){
	$(".player-row").fadeOut(function(){
		$(".player-row").remove();
	});
	
	for(var i in players){
		client.ui.addUser(players[i]);
	}
};

client.ui.setLobbyPage = function(lobby){
	$('#lobbyLink').show().removeClass("unactive");
	$('#main-content').removeClass('browse-page').html(tmpl("lobby_tmpl", lobby));
	
	
	if(client.quiz.currentLobby.host == client.user.id){
		$('#host-control').show();
		$('#toggle-button').click(function(){
			client.network.sendCommand('/start');
		});
		$('#stop-button').click(function(){
			client.network.sendCommand('/stop');
		});
	}
};

client.ui.updateLobby = function(){
	
};

client.ui.setLobby = function(data){
	$("#lobby-title").text(data.title || "{no_title}");
};

client.ui.showLobbyLink = function(){
	$("#lobbyLink").show();
};

client.ui.hideLobbyLink = function(){
	$("#lobbyLink").hide();
};

client.ui.setQuiz = function(data){
	$("#quiz-title").text(data.title);
};

client.ui.setTimeLeft = function(timeLeft){
	client.ui.setCountdown(timeLeft/client.quiz.timeLeft, timeLeft);
};

client.ui.chooseAnswer = function(index){
	$("#answer_list > li").removeClass("active").addClass("disabled");
	$('#answer-'+index).removeClass("disabled").addClass('active');
};

client.ui.setQuestion = function(data){
	$('#toggle-button').val("startad").attr('disabled','');
	$("#lobbyLink").addClass("running");
	$("#question-title").text('Fråga ' + (data.num+1) + ' av ' + client.quiz.currentQuiz.questions + ', Ger ' + data.points + ' Poäng');
	$("#question").text(data.question);
	
	$(".answer-box > h2").text("Välj rätt alternativ");
	
	 client.quiz.timeLeft = data.time;
	 
	 client.ui.showCountdown();
	 
	 var timeLeft = Math.round(((data.timeLeft-client.network.latancy) || (data.time*1000-client.network.latancy))/ 1000);
	 client.ui.setCountdown(timeLeft/client.quiz.timeLeft, client.quiz.timeLeft);
	 client.ui.questionCountdown(timeLeft);
	 
	$("#answer_list").empty();
	
	var randArr = [];
	
	for(var i in data.answers){
		randArr.push([i, data.answers[i]]);
	}
	
	fisherYates(randArr);
	
	for(var i in randArr){
		var q = randArr[i];
		var el = $('<li id="answer-' + q[0] + '">' + q[1] + '</li>');
		el.click(function(){
			client.quiz.chooseAnswer(parseInt(this.id.replace('answer-', '')));
		});
		$("#answer_list").append(el);
	}
	
	$('.player-row').removeClass('correct').removeClass('incorrect');
	
};

client.ui.notifyNextQuestion = function(time){
	$('#toggle-button').val("startad").attr('disabled','');
	$("#lobbyLink").removeClass('running').addClass("blinking");
	client.ui.NextQuestionCountdown(Math.round(time/1000));

};

client.ui.NextQuestionCountdown = function(time){
	if(time)
		client.ui.timeLeft = time;
		
	$("#quiz-title").text("Nästa fråga om " + client.ui.timeLeft + " sekunder");

	if(client.ui.timeLeft-- == 0){
		$("#lobbyLink").removeClass("blinking").addClass("running");
		$("#quiz-title").text(client.quiz.currentQuiz.title);
	}else
		client.ui.nqTimeOut = setTimeout(client.ui.NextQuestionCountdown, 1000);
};

client.ui.questionCountdown = function(time){
	if(time)
		client.ui.qTimeLeft = Math.round(time);
	
	if(client.ui.qTimeLeft-- != 0){
		client.ui.setCountdown(client.ui.qTimeLeft/client.quiz.timeLeft, client.ui.qTimeLeft);
		client.ui.qTimeOut = setTimeout(client.ui.questionCountdown, 1000);
	}
};

client.ui.setStats = function(stats){
	client.ui.hideCountdown();
	for(var i in stats){
		var st = stats[i],
			pc = 100*(st/client.quiz.currentQuiz.totalPoints);
			
		$('#player-'+i+' .progress-bar').css('width', pc+'%');
		$('#player-'+i+' .progress-bar').text(st + ' Poäng');
	}
};

client.ui.displayAnswers = function(answers, correct){
	
	$('#answer_list > li').addClass('incorrect');
	for(var i in correct){
		$('#answer-'+correct[i]).removeClass('incorrect').addClass('correct');
	}
	

	for(var i in answers){
		var an = answers[i];
		if(correct.indexOf(an) > -1){
			$('#player-'+i).addClass('correct');
			$('#player-'+i + ' .points').text('+'+ client.quiz.currentQuestion.points +' Poäng').animate({
				opacity: 1.0,
			}, 800, function(){
				$(this).animate({
					opacity: 0,
				}, 3000);
			});
		}else
			$('#player-'+i).addClass('incorrect');
			
	}
	
	$('#lobbyLink a > div').hide();
	$('#display-answer').show();
	
	var chosen = $('#answer_list > li.active').attr('id');
	
	if(chosen && correct.indexOf(parseInt(chosen.replace('answer-',''))) > -1){
		$('#display-answer').addClass('correct').text('Rätt svar!');
		$('#lobbyLink').addClass('green');
	}
	else{
		$('#display-answer').addClass('incorrect').text('Fel svar!');
		$('#lobbyLink').addClass('red');
	}
		
	setTimeout(function(){
		$('#lobbyLink').removeClass('green').removeClass('red');
		$('#display-answer').removeClass('correct').removeClass('incorrect');
		$('#lobbyLink a > div').hide();
		$('#default-msg').show();
	}, 5000);
	
};

client.ui.showCountdown = function(){
	$('#default-msg').hide();
	$('#coundownclock').show();
};

client.ui.hideCountdown = function(){
	$('#coundownclock').hide();
	$('#default-msg').show();
};

client.ui.setCountdown = function(pc, text){
	$('.clock > .display').text(text);
	
	if(pc <= 0.25)
		$('.front.left').css('z-index', 15).css('height', 100+'px');
	else if(pc <= 0.5)
		$('.front.left').css('z-index', 15).css('height', 50+'px');
	else
		$('.front.left').css('z-index', 5);
	
		$('.rotate.left').css('-webkit-transform', 'rotate('+ pc*360 + 'deg)');
		$('.rotate.right').css('-webkit-transform', 'rotate('+ ((pc-0.5)*360) + 'deg)');
		
		$('.rotate.left').css('-moz-transform', 'rotate('+ pc*360 + 'deg)');
		$('.rotate.right').css('-moz-transform', 'rotate('+ ((pc-0.5)*360) + 'deg)');
		
		$('.rotate.left').css('transform', 'rotate('+ pc*360 + 'deg)');
		$('.rotate.right').css('transform', 'rotate('+ ((pc-0.5)*360) + 'deg)');
	
	if(pc >= 0.5){
		$('.rotate.left').css('-webkit-transform', 'rotate('+ 180 + 'deg)');
		$('.rotate.left').css('-moz-transform', 'rotate('+ 180 + 'deg)');
		$('.rotate.left').css('transform', 'rotate('+ 180 + 'deg)');
	}
};

client.ui.stop = function(){
	clearTimeout(client.ui.nqTimeOut)
	clearTimeout(client.ui.qTimeOut)
		
	$('#lobbyLink').removeClass('running blinking');
	$("#quiz-title").text(client.quiz.currentQuiz.title);
	client.ui.hideCountdown();
};

client.ui.quizEndOfRound = function(results){
	$('#toggle-button').val("Starta").removeAttr('disabled');
	$('#lobbyLink').removeClass('running blinking');
	
	var html = '<table cellspacing="0"><tr>';
	 	html += '<th>Plats</th>';
        html += '<th>Namn</th>';
		html += '<th>Poäng</th>';
		html += '<th>Rätt</th>';
		html += '<th>Fel</th>';
		html += '<th>Ej svarat</th>';
		html += '<th>% Rätt</th>';
		html += '</tr>';
		
		var points = 99999,
			place = 0;
		
		for(var i in results){
			var res = results[i],
				rt = Math.round(100 * res.correct / client.quiz.currentQuiz.questions);
			
			if(points > res.points){
				points = res.points;
				place++;
			}
				
			html += '<tr class="'+ (place == 1 ? 'winner' : (place == 2 ? 'second' : (place == 3 ? 'third' : '')))+'"><td>'+ place +'</td>';
			html += '<td>'+ res.username +'</td>';
			html += '<td class="green">'+ res.points +'</td>';
			html += '<td class="green">'+ res.correct +'</td>';
			html += '<td class="red">'+ res.incorrect +'</td>';
			html += '<td>'+ (client.quiz.currentQuiz.questions - res.correct - res.incorrect) +'</td>';
			html += '<td>' + rt + '%</td></tr>';
		}
		
    	html += '</table>';
	
	client.ui.setModal("Resultat", html, {
		Ok: function(){return true;}
	});
	
};

client.ui.quizReset = function(){
	setTimeout(function(){
		$('.player-row .progress-bar').css('width', 0).text('0 Poäng');
		
		$('#answer_list').empty();
		$("#question-title").text('Väntar på nästa fråga');
		$(".answer-box > h2").text('Väntar på nästa fråga');
		$("#question").text('');
	}, 6000);
};
client.ui.setModal = function(title, content, buttons){
	$(".modal-box > h1").html(title);
	$(".modal-box > .content").html(content);
	$(".modal-box > .footer > .right").empty();
	
	for(var i in buttons){
		var btn = $('<input id="join-button" type="button" value="'+i+'"/>');
		var btnClickEvent = buttons[i];
		btn.click(btnClickEvent, function(event){
			if(event.data())
				$("#modal-overlay").fadeOut();		//fade out if click function return true
		});
		$(".modal-box > .footer > .right").append(btn);
	}
	
	$("#modal-overlay").fadeIn();
};

client.ui.hideModal = function(){
	$("#modal-overlay").fadeOut();
};client.ui.setQuizesPage = function(category, quizes){
	$("#main-content").addClass('browse-page');
	$('#main-content').html(tmpl("quizes_tmpl", {}));
};

client.ui.listQuizes = function(data){
	$('#main-content .items').empty();
	
	for(var i in data){
		var html = tmpl("quiz_list_tmpl", data[i]);
		var quiz = $(html.replace(' ',''));
		quiz.click(function(){
			History.pushState({state:1}, 'State 3', '/?lobbies/'+$(this).attr('id').replace('quiz-', ''));
			return false;
		});

		$('#main-content .items').append(quiz);
	}
	
};
var History = window.History;

$(document).ready(function(e) {
	client.init();
});