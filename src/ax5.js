/*!
 * AX5 JavaScript UI Library v0.0.1
 * www.axisj.com
 *
 * Copyright 2013, 2015 AXISJ.com and other contributors
 * Released under the MIT license
 * www.axisj.com/ax5/license
 */

/*
argument
 - O : Object 전달받은 오브젝트 인자
 - _fn : 사용자정의 함수 인자
 - msg : 메세지
 _d : dom
 _na : new Array
 */

// 필수 Ployfill 확장 구문
(function(){

	var root = this;

	// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	if (!Object.keys) {
		Object.keys = (function() {
			'use strict';
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'
				],
				dontEnumsLength = dontEnums.length;

			return function(obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError('Object.keys called on non-object');
				}

				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
	// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (fun /*, thisp */) {
			if (this === void 0 || this === null) { throw TypeError(); }

			var t = Object(this);
			var len = t.length >>> 0;
			if (typeof fun !== "function") { throw TypeError(); }

			var thisp = arguments[1], i;
			for (i = 0; i < len; i++) {
				if (i in t) {
					fun.call(thisp, t[i], i, t);
				}
			}
		};
	}

	/*global document */
	/**
	 * define document.querySelector & document.querySelectorAll for IE7
	 *
	 * A not very fast but small hack. The approach is taken from
	 * http://weblogs.asp.net/bleroy/archive/2009/08/31/queryselectorall-on-old-ie-versions-something-that-doesn-t-work.aspx
	 *
	 */
	(function () {
		if (document.querySelectorAll || document.querySelector) {
			return;
		}
		if(!document.createStyleSheet) return;
		var style = document.createStyleSheet(),
			select = function (selector, maxCount) {
				var
					all = document.all,
					l = all.length,
					i,
					resultSet = [];

				style.addRule(selector, "foo:bar");
				for (i = 0; i < l; i += 1) {
					if (all[i].currentStyle.foo === "bar") {
						resultSet.push(all[i]);
						if (resultSet.length > maxCount) {
							break;
						}
					}
				}
				style.removeRule(0);
				return resultSet;
			};

		document.querySelectorAll = function (selector) {
			return select(selector, Infinity);
		};
		document.querySelector = function (selector) {
			return select(selector, 1)[0] || null;
		};
	}());

	if (!String.prototype.trim) {
		(function() {
			// Make sure we trim BOM and NBSP
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			String.prototype.trim = function() {
				return this.replace(rtrim, '');
			};
		})();
	}

	if (!window.JSON) {
		window.JSON = {
			parse: function (sJSON) { return eval("(" + sJSON + ")"); },
			stringify: function (vContent) {
				if (vContent instanceof Object) {
					var sOutput = "";
					if (vContent.constructor === Array) {
						for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
						return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
					}
					if (vContent.toString !== Object.prototype.toString) {
						return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
					}
					for (var sProp in vContent) {
						sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ",";
					}
					return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
				}
				return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
			}
		};
	}

	// Console-polyfill. MIT license. https://github.com/paulmillr/console-polyfill
	// Make it safe to do console.log() always.
	(function(con) {
		'use strict';
		var prop, method;
		var empty = {};
		var dummy = function() {};
		var properties = 'memory'.split(',');
		var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
			'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
			'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
		while (prop = properties.pop()) con[prop] = con[prop] || empty;
		while (method = methods.pop()) con[method] = con[method] || dummy;
	})(root.console = root.console || {}); // Using `this` for web workers.

}.call(this));

// ax5 선언
(function() {
	'use strict';

	// root of function
	var root = this, doc = document, win = window;

	/** @namespace {Object} ax5 */
	var ax5 = {}, info, U, dom, xhr, ui;
	ax5.guid = 1;
	ax5.get_guid = function(){return ax5.guid++;};

	/**
	 * 상수모음
	 * @namespace ax5.info
	 */
	ax5.info = info = {
/**
 * ax5 version
 * @member {String} ax5.info.version
 */
		version: "0.0.1",
		base_url: "",
/**
 * event keyCodes
 * @member {Object} ax5.info.event_keys
 * @example
 ```
 {
	BACKSPACE: 8, TAB: 9,
	RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
	HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
 }
 ```
 */
		event_keys: {
			BACKSPACE: 8, TAB: 9,
			RETURN: 13, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, DELETE: 46,
			HOME: 36, END: 35, PAGEUP: 33, PAGEDOWN: 34, INSERT: 45, SPACE: 32
		},
/**
 * 사용자 브라우저 식별용 오브젝트
 * @member {Object} ax5.info.browser
 * @example
 ```
 console.log( ax5.info.browser );
 //Object {name: "chrome", version: "39.0.2171.71", mobile: false}
 ```
 */
		browser  : (function () {
			var ua = navigator.userAgent.toLowerCase();
			var mobile = (ua.search(/mobile/g) != -1);
			if (ua.search(/iphone/g) != -1) {
				return { name: "iphone", version: 0, mobile: true }
			} else if (ua.search(/ipad/g) != -1) {
				return { name: "ipad", version: 0, mobile: true }
			} else if (ua.search(/android/g) != -1) {
				var match = /(android)[ \/]([\w.]+)/.exec(ua) || [];
				var browserVersion = (match[2] || "0");
				return { name: "android", version: browserVersion, mobile: mobile }
			} else {
				var browserName = "";
				var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
					/(webkit)[ \/]([\w.]+)/.exec(ua) ||
					/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
					/(msie) ([\w.]+)/.exec(ua) ||
					ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
					[];

				var browser = (match[1] || "");
				var browserVersion = (match[2] || "0");

				if (browser == "msie") browser = "ie";
				return {
					name: browser,
					version: browserVersion,
					mobile: mobile
				}
			}
		})(),
/**
 * 브라우저 여부
 * @member {Boolean} ax5.info.is_browser
 */
		is_browser : !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && win.document),
/**
 * 브라우저에 따른 마우스 휠 이벤트이름
 * @member {Object} ax5.info.mousewheelevt
 */
		mousewheelevt: ((/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel")
	};

/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.util
 */
	ax5['util'] = U = (function(){
		var _toString = Object.prototype.toString;
/**
 * Object나 Array의 아이템으로 사용자 함수를 호출합니다.
 * @method ax5.util.each
 * @param {Object|Array} O
 * @param {Function} _fn
 * @example
```js
 var axf = ax5.util;
 axf.each([0,1,2], function(){
	// with this
 });
 axf.each({a:1, b:2}, function(){
	// with this
 });
```
 */
		function each(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.each");
				return O;
			}
			var key, i = 0, length = O.length,
				isObj = length === undefined || typeof O === "function";
			if(isObj){
				for(key in O){
					if(typeof O[key] != "undefined")
					if(_fn.call(O[key], key, O[key]) === false) break;
				}
			}else{
				for( ; i < length; ){
					if( typeof O[ i ] != "undefined" )
					if (_fn.call(O[ i ], i, O[ i++ ]) === false) break;
				}
			}
			return O;
		}
		// In addition to using the http://underscorejs.org : map, reduce, reduce_right, find
/**
 * 원본 아이템들을 이용하여 사용자 함수의 리턴값으로 이루어진 새로운 배열을 만듭니다.
 * @method ax5.util.map
 * @param {Object|Array} O
 * @param {Function} _fn
 * @returns {Array}
 * @example
```js
 var myArray = [0,1,2,3,4];
 var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
    fn: function(abcdd){
        return abcdd;
    }
 };

 var _arr = ax5.util.map( myArray,  function(index, I){
    return index+1;
 });
 console.log(_arr);
 // [1, 2, 3, 4, 5]

 var _arr = ax5.util.map( myObject,  function(k, v){
    return v * 2;
 });
 console.log(_arr);
 // [2, 4, NaN, NaN]
```
 */
		function map(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map");
				return [];
			}
			var key, i = 0, length = O.length, results = [], fn_result;
			if (is_object(O)){
				for (key in O) {
					if(typeof O[key] != "undefined"){
						fn_result = undefined;
						if ( (fn_result = _fn.call(O[key], key, O[key])) === false ) break;
						else results.push( fn_result );
					}
				}
			} else {
				for ( ; i < length; ) {
					if(typeof O[i] != "undefined") {
						fn_result = undefined;
						if ( (fn_result = _fn.call(O[ i ], i, O[ i++ ])) === false ) break;
						else results.push( fn_result );
					}
				}
			}
			return results;
		}
/**
 * 원본 아이템들을 이용하여 사용자 함수의 리턴값이 참인 아이템의 위치를 반환합니다.
 * @method ax5.util.search
 * @param {Object|Array} O
 * @param {Function} _fn
 * @returns {Number|String}
 * @example
 ```js
 var myArray = [0,1,2,3,4,5,6];
 var myObject = {a:"123","b":"123",c:123};

 ax5.util.search(myArray,  function(){
    return this > 3;
 });
 // 4
 ax5.util.search(myObject,  function(k, v){
    return v === 123;
 });
 // "c"
 ```
 */
		function search(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.find");
				return -1;
			}
			var key, i = 0, length = O.length;
			if (is_object(O)){
				for (key in O) {
					if(typeof O[key] != "undefined" && _fn.call(O[key], key, O[key])){
						return key;
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if(typeof O[i] != "undefined" && _fn.call(O[ i ], i, O[ i++ ])) {
						return i-1;
						break;
					}
				}
			}
			return -1;
		}
/**
 * 배열의 왼쪽에서 오른쪽으로 연산을 진행하는데 수행한 결과가 왼쪽 값으로 반영되어 최종 왼쪽 값을 반환합니다.
 * @method ax5.util.reduce
 * @param {Array} O
 * @param {Function} _fn
 * @returns {Alltypes}
 * @example
```js
 var aarray = [5,4,3,2,1];
 result = ax5.util.reduce( aarray, function(p, n){
       return p * n;
    });
 console.log(result, aarray);
 // 120 [5, 4, 3, 2, 1]
```
 */
		function reduce(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map - use Array");
				return [];
			}
			if (!is_array(O)){
				console.error("argument error : ax5.util.map - use Array");
				return []
			}
			var i = 0, length = O.length, token_item = O[i];
			for ( ; i < length-1; ) {
				if(typeof O[i] != "undefined") {
					if ( ( token_item = _fn.call(root, token_item, O[ ++i ]) ) === false ) break;
				}
			}
			return token_item;
		}
/**
 * 배열의 오른쪽에서 왼쪽으로 연산을 진행하는데 수행한 결과가 오른쪽 값으로 반영되어 최종 오른쪽 값을 반환합니다.
 * @method ax5.util.reduce_right
 * @param {Array} O
 * @param {Function} _fn
 * @returns {Alltypes}
 * @example
 ```js
 var aarray = [5,4,3,2,1];
 result = ax5.util.reduce_right( aarray, function(p, n){
    console.log( n );
    return p * n;
 });
 console.log(result, aarray);
 120 [5, 4, 3, 2, 1]
 ```
 */
		function reduce_right(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map - use Array");
				return [];
			}
			if (!is_array(O)){
				console.error("argument error : ax5.util.map - use Array");
				return []
			}
			var i = O.length-1, token_item = O[i];
			for ( ; i > 0; ) {
				if(typeof O[i] != "undefined") {
					if ( ( token_item = _fn.call(root, token_item, O[ --i ]) ) === false ) break;
				}
			}
			return token_item;
		}
/**
 * 배열또는 오브젝트의 각 아이템을 인자로 하는 사용자 함수의 결과가 참인 아이템들의 배열을 반환합니다.
 * @method ax5.util.filter
 * @param {Object|Array} O
 * @param {Function} _fn
 * @returns {Array}
 * @example
```js
 var aarray = [5,4,3,2,1];
 result = ax5.util.filter( aarray, function(){
        return this % 2;
 });
 console.log(result);
 // [5, 3, 1]

 var filObject = {a:1, s:"string", oa:{pickup:true, name:"AXISJ"}, os:{pickup:true, name:"AX5"}};
 result = ax5.util.filter( filObject, function(){
	return this.pickup;
 });
 console.log( ax5.util.to_json(result) );
 // [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
```
 */
		function filter(O, _fn){
			if (O == null || typeof O === "undeinfed"){
				console.error("argument error : ax5.util.map");
				return [];
			}
			var key, i = 0, length = O.length, isObj = length === undefined || typeof O === "function", results = [], fn_result;
			if (isObj){
				for (key in O) {
					if(typeof O[key] != "undefined"){
						if( fn_result = _fn.call(O[key], key, O[key]) ) results.push( O[key] );
					}
				}
			} else {
				for ( ; i < length; ) {
					if(typeof O[i] != "undefined") {
						if ( fn_result = _fn.call(O[ i ], i, O[ i ]) ) results.push( O[ i ] );
						i++;
					}
				}
			}
			return results;
		}
/**
 * 에러를 발생시킵니다.
 * @method ax5.util.error
 * @param {String} msg
 * @example
 ```js
 ax5.util.error( "에러가 발생되었습니다." );
 ```
 */
		function error( msg ){
			throw new Error( msg );
		}
/**
 * Object를 JSONString 으로 반환합니다.
 * @method ax5.util.to_json
 * @param {Object|Array} O
 * @returns {String} JSON
 * @example
```js
 var ax = ax5.util;
 var myObject = {a:1, b:"2", c:{axj:"what", arrs:[0,2,"3"]},
        fn: function(abcdd){
            return abcdd;
        }
    };
 console.log( ax.to_json(myObject) );
```
 */
		function to_json(O){
			var json_string = "";
			if(ax5.util.is_array(O)){
				O.forEach(function(item, index){
					if(index == 0) json_string += "[";
					else json_string += ",";
					json_string += to_json(item);
				});
				json_string += "]";
			}
			else
			if(ax5.util.is_object(O)){
				json_string += "{";
				var json_object_body = [];
				each(O, function(key, value) {
					json_object_body.push( '"' + key + '": ' + to_json(value) );
				});
				json_string += json_object_body.join(", ");
				json_string += "}";
			}
			else
			if(ax5.util.is_string(O)){
				json_string = '"' + O + '"';
			}
			else
			if(ax5.util.is_number(O)){
				json_string = O;
			}
			else
			if(ax5.util.is_undefined(O)){
				json_string = "undefined";
			}
			else
			if(ax5.util.is_function(O)){
				json_string = '"{Function}"';
			}
			return json_string;
		}
/**
 * 타겟 오브젝트의 키를 대상 오브젝트의 키만큼 확장합니다.
 * @method ax5.util.extend
 * @param {Object} O - 타겟 오브젝트
 * @param {Object} _O - 대상 오브젝트
 * @param {Boolean} overwrite - 덮어쓰기 여부
 * @returns {Object} extened Object
 * @example
 ```js
 var axf = ax5.util;
 var obja = {a:1};
 axf.extend(obja, {b:2});
 axf.extend(obja, {a:2});
 axf.extend(obja, {a:2}, true);
 ```
 */
		function extend(O, _O, overwrite) {
			if ( typeof O !== "object" && typeof O !== "function" ) O = {};
			if(typeof _O === "string") O = _O;
			else {
				if(overwrite === true) {
					for(var k in _O) O[k] = _O[k];
				}
				else
				{
					for(var k in _O) if(typeof O[k] === "undefined") O[k] = _O[k];
				}
			}
			return O;
		}
/**
 * 타겟 오브젝트를 복제하여 참조를 다르게 합니다.
 * @method ax5.util.clone
 * @param {Object} O - 타겟 오브젝트
 * @returns {Object} clone Object
 * @example
 ```js
 var axf = ax5.util;
 var obja = {a:1};
 var objb = axf.clone( obja );
 obja.a = 3; // 원본 오브젝트 수정
 console.log(obja, objb);
 // Object {a: 3} Object {a: 1}
 ```
 */
		function clone(O){
			return extend({}, O);
		}
/**
 * 인자의 타입을 반환합니다.
 * @method ax5.util.get_type
 * @param {Object|Array|String|Number|Element|Etc} O
 * @returns {String} element|object|array|function|string|number|undefined|nodelist
 * @example
 ```js
 var axf = ax5.util;
 var a = 11;
 var b = "11";
 console.log( axf.get_type(a) );
 console.log( axf.get_type(b) );
 ```
 */
		function get_type(O){
			var typeName;
			if( !!(O && O.nodeType == 1) ){
				typeName = "element";
			}
			else
			if(typeof O === "undefined") {
				typeName = "undefined";
			}
			else
			if(_toString.call(O) == "[object Object]") {
				typeName = "object";
			}
			else
			if(_toString.call(O) == "[object Array]") {
				typeName = "array";
			}
			else
			if(_toString.call(O) == "[object String]") {
				typeName = "string";
			}
			else
			if(_toString.call(O) == "[object Number]") {
				typeName = "number";
			}
			else
			if(_toString.call(O) == "[object NodeList]") {
				typeName = "nodelist";
			}
			else
			if(typeof O === "function") {
				typeName = "function";
			}
			return typeName;
		}
/**
 * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
 * @method ax5.util.is_element
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_element(O) { return !!(O && O.nodeType == 1); }
/**
 * 오브젝트가 Object인지 판단합니다.
 * @method ax5.util.is_object
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_object(O) { return _toString.call(O) == "[object Object]"; }
/**
 * 오브젝트가 Array인지 판단합니다.
 * @method ax5.util.is_array
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_array(O) { return _toString.call(O) == "[object Array]"; }
/**
 * 오브젝트가 Function인지 판단합니다.
 * @method ax5.util.is_function
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_function(O) { return typeof O === "function"; }
/**
 * 오브젝트가 String인지 판단합니다.
 * @method ax5.util.is_string
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_string(O) { return _toString.call(O) == "[object String]"; }
/**
 * 오브젝트가 Number인지 판단합니다.
 * @method ax5.util.is_number
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_number(O) { return _toString.call(O) == "[object Number]"; }
/**
 * 오브젝트가 NodeList인지 판단합니다.
 * @method ax5.util.is_nodelist
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_nodelist(O) { return _toString.call(O) == "[object NodeList]"; }
/**
 * 오브젝트가 undefined인지 판단합니다.
 * @method ax5.util.is_undefined
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_undefined(O) { return typeof O === "undefined"; }
/**
 * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
 * @method ax5.util.is_nothing
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_nothing(O) { return (typeof O === "undefined" || O === null || O === ""); }




/**
 * 오브젝트의 첫번째 아이템을 반환합니다.
 * @method ax5.util.first
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.first({a:1, b:2});
 // Object {a: 1}
 ```
 */
		function first(O){
			if( is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[0]] = O[keys[0]];
				return item;
			}
			else
			if( is_array(O) ) {
				return O[0];
			}
			else
			{
				console.error("ax5.util.object.first", "argument type error");
				return undefined;
			}
		}
/**
 * 오브젝트의 마지막 아이템을 반환합니다.
 * @method ax5.util.last
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.last({a:1, b:2});
 // Object {b: 2}
 ```
 */
		function last(O){
			if( is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[keys.length-1]] = O[keys[keys.length-1]];
				return item;
			}
			else
			if( is_array(O) ) {
				return O[O.length-1];
			}
			else
			{
				console.error("ax5.util.object.last", "argument type error");
				return undefined;
			}
		}
/**
 * 쿠키를 설정합니다.
 * @method ax5.util.set_cookie
 * @param {String} cname - 쿠키이름
 * @param {String} cvalue - 쿠키값
 * @param {Number} [exdays] - 쿠키 유지일수
 * @example
```js
 ax5.util.set_cookie("jslib", "AX5");
 ax5.util.set_cookie("jslib", "AX5", 3);
```
 */
		function set_cookie(cname, cvalue, exdays){
			doc.cookie = cname + "=" + escape(cvalue) + "; path=/;" + (function(){
				if(typeof exdays != "undefined"){
					var d = new Date();
					d.setTime(d.getTime() + (exdays*24*60*60*1000));
					return "expires=" + d.toUTCString();
				}else{
					return "";
				}
			})();
		}
/**
 * 쿠키를 가져옵니다.
 * @method ax5.util.get_cookie
 * @param {String} cname
 * @returns {String} cookie value
 * @example
```js
 ax5.util.get_cookie("jslib");
```
 */
		function get_cookie(cname){
			var name = cname + "=";
			var ca = doc.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) != -1) return unescape(c.substring(name.length, c.length));
			}
			return "";
		}
/**
 * jsonString 으로 alert 합니다.
 * @method ax5.util.alert
 * @param {Object|Array|String|Number} O
 * @returns {Object|Array|String|Number} O
 * @example
```js
 ax5.util.alert({a:1,b:2});
 ax5.util.alert("정말?");
```
 */
		function alert(O){
			win.alert( to_json(O) );
			return O;
		}
/**
 * 현재 페이지의 Url 정보를 리턴합니다.
 * @method ax5.util.url_util
 * @returns {Object}
 * @example
```js

 console.log( ax5.util.to_json( ax5.util.url_util() ) );
 {
    "base_url": "http://ax5:2018",
    "href": "http://ax5:2018/samples/index.html?a=1&b=1#abc",
    "param": "a=1&b=1",
    "referrer": "",
    "pathname": "/samples/index.html",
    "hostname": "ax5",
    "port": "2018",
    "url": "http://ax5:2018/samples/index.html",
    "hashdata": "abc"
 }
```
 */
		function url_util() {
			var url = {
				href: win.location.href,
				param: win.location.search,
				referrer: doc.referrer,
				pathname: win.location.pathname,
				hostname: win.location.hostname,
				port: win.location.port
			}, urls = url.href.split(/[\?#]/);
			url.param = url.param.replace("?", "");
			url.url = urls[0];
			if(url.href.search("#") > -1){
				url.hashdata = last(urls);
			}
			urls = null;
			url.base_url = left(url.href, "?").replace(url.pathname, "");
			return url;
		}
/**
 * CSS Selector를 이용하여 HTML Elements를 찾습니다.
 * @method ax5.util.get_elements
 * @param {String|Element} query - CSS Selector | Element
 * @param {String} sub_query - CSS Selector
 * @returns {Array} elements
 * @example
```js
 ax5.util.get_elements("#element01");
 ax5.util.get_elements("input[type='text']");
```
 */
		function get_elements(query, sub_query){
			var elements, return_elements = [], parent_element;

			//console.log(query.toString());

			if(is_element(query))
			{
				return_elements.push( query );
			}
			else
			if(is_array(query) || is_nodelist(query)){
				for(var i=0;i<query.length;i++) {
					if(is_element(query[i])) return_elements.push( query[i] );
				}
			}
			else
			if(is_string(query) && query.substr(0,1) === "#")
			{
				return_elements.push( doc.getElementById(query.substr(1)) );
			}
			else
			{
				elements = doc.querySelectorAll(query);
				for(var i=0;i<elements.length;i++){
					return_elements.push( elements[i] );
				}
			}

			if(typeof sub_query != "undefined") {
				parent_element = (info.browser.name == "ie" && info.browser.version < 8) ? doc : return_elements[0];
				return_elements = [];
				elements = parent_element.querySelectorAll(sub_query);
				for(var i=0;i<elements.length;i++){
					return_elements.push( elements[i] );
				}
			}

			return return_elements;
		}
/**
 * CSS Selector를 이용하여 HTML Element를 찾습니다.
 * @method ax5.util.get_element
 * @param {String|Element} query - CSS Selector | Element
 * @param {String} sub_query - CSS Selector
 * @returns {Element} element
 * @example
 ```js
 ax5.util.get_element("#element01");
 ax5.util.get_element("input[type='text']");
```
 */
		function get_element(query, sub_query){
			return get_elements(query, sub_query)[0];
		}
/**
 * createElement 구문을 효과적으로 수행합니다.
 * @method ax5.util.create_elements
 * @param {String} node_nm - 엘리먼트 이름
 * @param {Object} attr - 엘리먼트 속성정보
 * @returns {Element}
 * @example
```js
 ax5.util.create_elements("script", {type:"text/javascript", src:"../ax5.js"});
```
 */
		function create_elements(node_nm, attr, val){
			/*
			HTML - Use http://www.w3.org/1999/xhtml
			SVG - Use http://www.w3.org/2000/svg
			XBL - Use http://www.mozilla.org/xbl
			XUL - Use http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul
			document.createElementNS("http://www.w3.org/1999/xhtml","div");
			document.createElement("div")
			document.createTextNode(text)
			*/

			var element = doc.createElement(node_nm);
			each(attr, function(k, v){
				element[k] = v;
			});
			return element;
		}

/**
 * ax5 require
 * @method ax5.util.require
 * @param {Array} mods - load modules
 * @param {Function} callBack - 로드 성공시 호출함수
 * @param {Function} [errorBack] - 로드 실패시 호출함수
 * @example
```js
 ax5.info.base_url = "../src/";
 ax5.util.require(["ax5_class_sample.js"], function(){
	alert("ok");
 });
```
 */
		// RequireJS 2.1.15 소스코드 참고
		function require(mods, callBack, errorBack){
			var
			head = doc.head || doc.getElementsByTagName("head")[0],
			readyRegExp = info.is_browser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/,
			loadCount = mods.length, loadErrors = [], onloadTimer, onerrorTimer, returned = false,
			scripts = get_elements("script[src]"), styles = get_elements("style[href]"),
			onload = function(){
				if(loadCount < 1 && loadErrors.length == 0 && !returned){
					if(callBack) callBack({});
					returned = true;
				}
			},
			onerror = function(){
				if(loadCount < 1 && loadErrors.length > 0 && !returned){
					console.error(loadErrors);
					if(errorBack) errorBack({
						type:"loadFail",
						list:loadErrors
					});
					returned = true;
				}
			};

			// 로드해야 할 모듈들을 doc.head에 삽입하고 로드가 성공여부를 리턴합니다.
			for(var i=0;i<mods.length;i++){
				var src = mods[i], type = right(src, "."), hasPlugin = false,
					plugin, plugin_src = info.base_url + src, attr_nm = (type === "js") ? "src" : "href";
					for (var s = 0; s < scripts.length; s++) {
						if (scripts[s].getAttribute(attr_nm) === plugin_src) {
							hasPlugin = true;
							break;
						}
					}

				//info.base_url + src
				if(hasPlugin) {
					loadCount--;
					onload();
				} else {

					plugin = (type === "js") ?
						create_elements("script", {type:"text/javascript", src:plugin_src}) :
						create_elements("link", {rel:"stylesheet", type:"text/css", href:plugin_src});

					var
						plugin_onload = function(e){
							if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
								loadCount--;
								if(onloadTimer) clearTimeout(onloadTimer);
								onloadTimer = setTimeout(onload, 1);
							}
						},
						plugin_onerror = function(e){
							loadCount--;
							loadErrors.push({
								src : info.base_url + src
							});
							if(onerrorTimer) clearTimeout(onerrorTimer);
							onerrorTimer = setTimeout(onerror, 1);
						};

					if (plugin.addEventListener){
						plugin.addEventListener('load', plugin_onload, false);
						plugin.addEventListener('error', plugin_onerror, false);
						head.appendChild(plugin);
					}else{
						var oReq = new XMLHttpRequest();
						oReq.open("GET", plugin_src, false);
						oReq.onreadystatechange = function(){
							if (oReq.readyState == 4 /* complete */) {
								if (oReq.status == 200 || oReq.status == 304) {
									head.appendChild(plugin);
									plugin_onload({type:"load"});
								}
								else {
									// error occurred
									plugin_onerror();
								}
							}
						};
						oReq.send();
					}

					/*
					if (plugin.attachEvent && !(plugin.attachEvent.toString && plugin.attachEvent.toString().indexOf('[native code') < 0))
					{

					} else {

					}
*/
				}
			}
		}
/**
 * 문자열의 특정 문자열까지 잘라주거나 원하는 포지션까지 잘라줍니다.
 * @method ax5.util.left
 * @param {String} str - 문자열
 * @param {String|Number} pos - 찾을 문자열 또는 포지션
 * @returns {String}
 * @example
```js
 ax5.util.left("abcd.efd", 3);
 // abc
 ax5.util.left("abcd.efd", ".");
 // abcd
```
 */
		function left(str, pos){
			if(typeof str === "undefined" || typeof pos === "undefined") return "";
			if(is_string(pos)){
				return (str.indexOf(pos) > -1) ? str.substr(0, str.indexOf(pos)) : str ;
			}else if(is_number(pos)){
				return str.substr(0, pos);
			}else{
				return "";
			}
		}
/**
 * 문자열의 특정 문자열까지 잘라주거나 원하는 포지션까지 잘라줍니다.
 * @method ax5.util.right
 * @param {String} str - 문자열
 * @param {String|Number} pos - 찾을 문자열 또는 포지션
 * @returns {String}
 * @example
 ```js
 ax5.util.right("abcd.efd", 3);
 // efd
 ax5.util.right("abcd.efd", ".");
 // efd
 ```
 */
		function right(str, pos){
			if(typeof str === "undefined" || typeof pos === "undefined") return "";
			if(is_string(pos)){
				return (str.lastIndexOf(pos) > -1) ? str.substr(str.lastIndexOf(pos)+1) : str ;
			}else if(is_number(pos)){
				return str.substr(str.length-pos);
			}else{
				return "";
			}
		}
/**
 * 타겟엘리먼트의 부모 엘리멘트 트리에서 원하는 조건의 엘리먼트를 얻습니다.
 * @method ax5.util.get_event_target
 * @param {Element} target - target element
 * @param {Object} cond - 원하는 element를 찾을 조건
 * @returns {Element}
 * @example
 ```js
 // cond 속성정의
 var cond = {
    tagname: {String} - 태그명 (ex. a, div, span..),
    clazz: {String} - 클래스명
    [, 그 외 찾고 싶은 attribute명들]
 };
 console.log(
    ax5.util.get_event_target(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
 );
 ```
 */
		function get_event_target(target, cond){
			var _target = target;
			if (_target) {
				while ((function(){
					var result = true;
					for(var k in cond){
						if(k === "tagname"){
							if(_target.tagName.lcase() != cond[k]) {
								result = false;
								break;
							}
						}
						else
						if(k === "clazz"){
							var klasss = _target.className.split(/ /g);
							var hasClass = false;
							for(var a=0;a<klasss.length;a++){
								if(klasss[a] == cond[k]){
									hasClass = true;
									break;
								}
							}
							result = hasClass;
						}
						else
						{ // 그외 속성값들.
							if(_target.getAttribute(k) != cond[k]) {
								result = false;
								break;
							}
						}
					}
					return !result;
				})()) {
					if (_target.parentNode) {
						_target = _target.parentNode;
					} else {
						_target = false; break;
					}
				}
			}
			return _target;
		}
/**
 * Elements에 CSS속성을 읽고 씁니다.
 * @method 
 * @param {Array} elements - 대상의 엘리먼트 리스트 혹은 엘리먼트
 * @param {Object|Array|String} CSS
 * @returns {String|Object|true}
 * @example
```js
 ax5.util.set_css(ax5.util.get_elements("#abcd"), {"color":"#ff3300"});
```
 */
		function set_css(elements, O){
			if(!is_array(elements) && !is_nodelist(elements)) elements = [elements];
			if( is_string(O) ) {
				return elements[0].style[O];
			}
			else
			if( is_array(O)  ) {
				var css = {};
				for(var i=0;i<O.length;i++){
					css[O[i]] = elements[0].style[O[i]];
				}
				return css;
			}
			else
			{
				for(var di=0;di<elements.length;di++) {
					for (var k in O) {
						elements[di].style[k] = O[k];
					}
				}
			}
			return true;
		}

		return {
			each            : each,
			map             : map,
			search          : search,
			reduce          : reduce,
			reduce_right    : reduce_right,
			filter          : filter,
			error           : error,
			to_json         : to_json,
			extend          : extend,
			clone           : clone,
			get_type        : get_type,
			is_element      : is_element,
			is_object       : is_object,
			is_array        : is_array,
			is_function     : is_function,
			is_string       : is_string,
			is_number       : is_number,
			is_nodelist     : is_nodelist,
			is_undefined    : is_undefined,
			is_nothing      : is_nothing,
			first           : first,
			last            : last,
			set_cookie      : set_cookie,
			get_cookie      : get_cookie,
			alert           : alert,
			url_util        : url_util,
			get_elements    : get_elements,
			get_element     : get_element,
			create_elements : create_elements,
			require         : require,
			left            : left,
			right           : right,
			get_event_target: get_event_target,
			set_css         : set_css
		}
	})();

	/**
	 * Refer to this by {@link ax5}.
	 * @namespace ax5.dom
	 */
	// todo : querySelectAll 을 활용한 dom 구현
	ax5.dom = function(query){
		function eventBind(elem, type, eventHandle){
			type = U.left(type, ".");
			if ( elem.addEventListener ) {
				elem.addEventListener( type, eventHandle, false );
			} else if ( elem.attachEvent ) {
				elem.attachEvent( "on" + type, eventHandle );
			}
		}
		function eventUnBind(elem, type, eventHandle){
			type = U.left(type, ".");
			if ( elem.removeEventListener ) {
				if(eventHandle) elem.removeEventListener( type, eventHandle );
				else{
					elem.removeEventListener( type );
				}
			} else if ( elem.detachEvent ) {
				if(eventHandle) elem.detachEvent( "on" + type, eventHandle );
				else elem.detachEvent( "on" + type );
			}
		}

		var axdom = (function(){
			function ax(query){
/**
 * query selected elements
 * @member {Array} ax5.dom.elements
 */
				this.elements = U.get_elements(query);
/**
 * query selected elements length
 * @member {Number} ax5.dom.length
 */
				this.length = this.elements.length;
/**
 * elements에 css 값을 적용또는 반환합니다.
 * @method ax5.dom.css
 * @param {Object|Array|String} O
 * @returns {ax5.dom|String|Object}
 * @example
```js
 ax5.dom("[data-ax-grid]").css({"color":"#ff3300", border:"1px solid #000"});
 console.log( ax5.dom("[data-ax-grid]").css("color") );
 // rgb(255, 51, 0)
 console.log( ax5.dom("[data-ax-grid]").css(["border","color"]) );
 // {border: "1px solid rgb(0, 0, 0)", color: "rgb(255, 51, 0)"}
```
 */
				this.css = function(O){
					var rs = U.set_css(this.elements, O);
					return (rs === true) ? this : rs;
				};
				// todo : clazz, on, off, attr > util로 이전
/**
 * elements에 className 를 추가, 제거, 확인, 토글합니다.
 * @method ax5.dom.clazz
 * @param {String} [command=has] - add,remove,toggle,has
 * @param {String} O - 클래스명
 * @returns {ax5.dom|String} return - ax5.dom 또는 클래스이름
 * @example
```js
 console.log(
	 ax5.dom("[data-ax-grid=A]").clazz("A"),
	 ax5.dom("[data-ax-grid='A']").clazz("has","A")
 );
 ax5.dom("[data-ax-grid=A]").clazz("add", "adclass").class("remove", "adclass").class("remove", "A");

 ax5.dom("[data-ax-grid=A]").clazz("toggle", "red");
 ax5.dom("[data-ax-grid=\"9B\"]").clazz("toggle", "red");
```
 */
				this.clazz = function(command, O){
					var classNames;
					if(command === "add" || command === "remove" || command === "toggle") {
						for(var di=0;di<this.elements.length;di++) {
							classNames = this.elements[di]["className"].split(/ /g);
							if(command === "add"){
								if(U.search(classNames, function(){
									return O.trim() == this;
								}) == -1) {
									classNames.push(O.trim());
								}
							}else if(command === "remove"){
								classNames = U.filter(classNames, function(){
									return O.trim() != this;
								});
							}else if(command === "toggle"){
								var class_count = classNames.length;
								classNames = U.filter(classNames, function(){
									return O.trim() != this;
								});
								if(class_count === classNames.length) classNames.push(O.trim());
							}
							this.elements[di]["className"] = classNames.join(" ");
						}
					}
					else
					{ // has
						if(typeof O === "undefined") O = command;
						classNames = this.elements[0]["className"].trim().split(/ /g);
						//if(U.is_string(classNames)) classNames = [classNames];
						if (U.is_string(O)) { // hasClass
							// get Class Name
							return (U.search(classNames, function () { return this.trim() === O }) > -1);
						}else{
							console.error("")
						}
					}
					return this;
				};
/**
 * elements에 이벤트를 바인드 합니다.
 * @method ax5.dom.on
 * @param {String} type - 이벤트 타입
 * @param {Function} _fn - 이벤트 콜백함수
 * @returns {ax5.dom}
 * @example
```js
 var axd = ax5.dom;
 var mydom = axd("[data-event-test=text-box]"),
	 remove_dom = axd("[data-event-test=remove]");

	 mydom.on("click", window.fna);
	 mydom.on("click", window.fnb);
	 mydom.on("click", window.fnc);

 remove_dom.on("click", function(){
    mydom.off("click", window.fna);
    remove_dom.off("click");
    alert("이벤트 제거");
 });

 // 핸들방식
 axd("[data-event-test=text-box]").on("click.fna", window.fna);
 axd("[data-event-test=text-box]").on("click.fnb", window.fnb);
 axd("[data-event-test=text-box]").on("click.fnc", window.fnc);
```
 */
				// todo: event type 모두 체크
				this.on = function(typ, _fn) {
					for(var i=0;i<this.elements.length;i++) {
						var __fn, _d = this.elements[i];
						if(!_d.e_hd) _d.e_hd = {};
						if(typeof _d.e_hd[typ] === "undefined"){
							__fn = _d.e_hd[typ] = _fn;
						}else{
							if(!U.is_array( _d.e_hd[typ])) _d.e_hd[typ] = [_d.e_hd[typ]];
							_d.e_hd[typ].push(_fn);
							__fn = _d.e_hd[typ][_d.e_hd[typ].length-1];
						}
						eventBind(_d, typ, __fn);
					}
					return this;
				};
/**
 * elements에 이벤트를 언바인드 합니다.
 * @method ax5.dom.off
 * @param {String} type - 이벤트 타입
 * @param {Function} [_fn] - 이벤트 콜백함수
 * @returns {ax5.dom}
 * @example
 ```js
 var axd = ax5.dom;
 axd("[data-event-test=text-box]").off("click");
 axd("[data-event-test=text-box]").off("click.fnb").off("click.fnc");
 ```
 */
				// todo : 이벤트 제거시 .하위 까지 제거해주기
				this.off = function(typ, _fn) {
					for(var i=0;i<this.elements.length;i++) {
						var _d = this.elements[i];
						if (U.is_array(_d.e_hd[typ])) {
							var _na = [];
							for (var i = 0; i < _d.e_hd[typ].length; i++) {
								if(_d.e_hd[typ][i] == _fn || typeof _fn === "undefined") eventUnBind(_d, typ, _d.e_hd[typ][i]);
								else _na.push(_d.e_hd[typ][i]);
							}
							_d.e_hd[typ] = _na;
						} else {
							if(_d.e_hd[typ] == _fn || typeof _fn === "undefined") {
								eventUnBind(_d, typ, _d.e_hd[typ]);
								delete _d.e_hd[typ]; // 함수 제거
							}
						}
					}
					return this;
				};
				// todo : setAttributeNS, setAttribute 차이 찾아보기
/**
 * element의 attribute를 추가 삭제 가져오기 합니다.
 * @method ax5.dom.attr
 * @param {String|Object} [command=get] - 명령어
 * @param {Object|String} O - json타입또는 문자열
 * @returns {ax5.dom|String}
 * @example
```js
 ax5.dom("[data-ax-grid=A]").attr("set", {"data-ax-spt":"ABCD"}); // set attribute
 ax5.dom("[data-ax-grid=A]").attr({"data-ax-spt":"9999", "data-next":"next"}); // set attribute

 console.log( ax5.dom("[data-ax-grid=A]").attr("data-ax-spt") ); // get or read
 console.log( ax5.dom("[data-ax-grid=A]").attr("get", "data-next") ); // get or read

 ax5.dom("[data-ax-grid=A]").attr("remove", "data-next");
 ax5.dom("[data-ax-grid=A]").attr("remove", "data-next2");
```
 */
				this.attr = function(command, O){
					if( command === "set" || (typeof O === "undefined" && U.is_object(command)) ){
						if(typeof O === "undefined") O = command;
						for(var di=0;di<this.elements.length;di++) {
							for (var k in O) {
								this.elements[di].setAttribute(k, O[k]);
							}
						}
					}
					else
					if( command === "get" || command === "read" || (typeof O === "undefined" && U.is_string(command)) ){
						if(typeof O === "undefined") O = command;
						if(!U.is_string(O)) return this;
						return this.elements[0].getAttribute(O);
					}
					else
					if( command === "remove" ){
						if(U.is_string(O)) {
							for (var di = 0; di < this.elements.length; di++) {
								this.elements[di].removeAttribute(O);
							}
						}else{
							for (var di = 0; di < this.elements.length; di++) {
								var _this = this;
								U.each(O,  function(){
									_this.elements[di].removeAttribute(this);
								});
							}
						}
					}
					return this;
				};
/**
 * element의 attribute를 추가 삭제 가져오기 합니다.
 * @method ax5.dom.find
 * @param {String} query - selector query
 * @returns {ax5.dom}
 * @example
 ```js

 ```
 */
				this.find = function(query){
					this.elements = U.get_elements(this.elements[0], query);
					return this;
				}
			}
			return ax;
		})();
		return new axdom(query);
	};

	(function(){
		// jQuery.ready.promise jquery 1.10.2
/**
 * document 로드 완료를 체크 합니다.
 * @method ax5.dom.ready
 * @param {Function} _fn - 로드완료시 호출함수
 * @example
```js
 var a = 1;
 setTimeout(function(){
    ax5.dom.ready(function(){
        console.log("test" + a);
        console.log(ax5.util.left("axisj-ax5", "-"));
    });
 }, 1000);
```
 */
		function ready( _fn ){
			if(ax5.dom.is_ready || ax5.dom.is_reading) return;
			ax5.dom.is_reading = true;
			promise(function(){
				if(ax5.dom.is_ready) return;
				ax5.dom.is_ready = true;
				_fn();
			});
		}
		function promise(_fn){
			if ( doc.readyState === "complete" ) {
				setTimeout( _fn );
			} else if ( doc.addEventListener ) {
				doc.addEventListener( "DOMContentLoaded", _fn, false );
				win.addEventListener( "load", _fn, false );
			} else {
				doc.attachEvent( "onreadystatechange", _fn );
				win.attachEvent( "onload", _fn );

				// If IE and not a frame
				var top = false;
				try {
					top = win.frameElement == null && doc.documentElement;
				} catch(e) {}

				if ( top && top.doScroll ) {
					(function doScrollCheck() {
						if ( !ax5.dom.is_ready  ) {
							try {
								// Use the trick by Diego Perini
								// http://javascript.nwbox.com/IEContentLoaded/
								top.doScroll("left");
							} catch(e) {
								return setTimeout( doScrollCheck, 50 );
							}
							// and execute any waiting functions
							_fn();
						}
					})();
				}
			}
		}

		U.extend(ax5.dom, {
			ready: ready
		});
	})();


/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.xhr
 */
	ax5.xhr = xhr = (function(){

	})();

/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */
	ax5.ui = (function(){
/**
 * @class ax5.ui.ax_ui
 * @classdesc ax5 ui class 코어 클래스 모든 클래스의 공통 함수를 가지고 있습니다.
 * @version v0.0.1
 * @author tom@axisj.com
 * @logs
 * 2014-12-12 tom : 시작
 * @example
 ```
 var myui = new ax5.ui.ax_ui();
 ```
 */
		function ax_ui(){
			this.config = {};
			this.name = "ax_ui";
/**
 * 클래스의 속성 정의 메소드 속성 확장후에 내부에 init 함수를 호출합니다.
 * @method ax5.ui.ax_ui.set_config
 * @param {Object} config - 클래스 속성값
 * @param {Boolean} [call_init=true] - init 함수 호출 여부
 * @returns {ax5.ui.ax_ui}
 * @example
```js
 var myui = new ax5.ui.ax_ui();
 myui.set_config({
    id:"abcd"
 });
```
 */
			this.set_config = function(cfg, call_init){
				U.extend(this.config, cfg, true);
				if(typeof call_init == "undefined" || call_init === true){
					this.init();
				}
				return this;
			};
			this.init = function(){
				console.log(this.config);
			};
		}
		return {
			ax_ui: ax_ui
		}
	})();

	if ( typeof module === "object" && module && typeof module.exports === "object" ){
		module.exports = ax5; // commonJS
	}else{
		root.ax5 = ax5;
		if ( typeof define === "function" && define.amd ) define("_ax5", [], function () { return ax5; }); // requireJS
	}

}.call(this));