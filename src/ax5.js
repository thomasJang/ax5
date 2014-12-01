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
 */


(function(root, ax_super) {
	'use strict';

	// Ployfill -- start
	(function(){
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

		// Console-polyfill. MIT license.
		// https://github.com/paulmillr/console-polyfill
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
	})(window);
	// Polyfill -- end

/**
 * @namespace {Object} ax5
 */
	var ax5 = (function(){
/**
 * Object나 Array의 아이템으로 사용자 함수를 호출합니다.
 * @method ax5.each
 * @param {Object|Array} O
 * @param {Function} _fn
 * @example
```js
axf.each([0,1,2], function(){
	// with this
});
axf.each({a:1, b:2}, function(){
	// with this
});
```
 */
		function each(O, _fn){
			if(O){
				var name, i = 0, length = O.length,
					isObj = length === undefined || typeof O === "function";
				if ( isObj ) {
					for ( name in O ) {
						if( typeof O[ name ] != "undefined" ) {
							if (_fn.call(O[ name ], name, O[ name ]) === false) {
								break;
							}
						}
					}
				} else {
					for ( ; i < length; ) {
						if( typeof O[ i ] != "undefined" ) {
							if (_fn.call(O[ i ], i, O[ i++ ]) === false) {
								break;
							}
						}
					}
				}
			}
		};
/**
 * 에러를 발생시킵니다.
 * @method ax5.error
 * @param {String} msg
 * @example
```js
ax5.error( "에러가 발생되었습니다." );
```
 */
		function error( msg ){
			throw new Error( msg );
		}

		function to_json(){

		}

		return {
			each   : each,
			error  : error,
			to_json: to_json
		}
	})();

/**
 * 유틸리티
 * @member {Object} ax5.util
 */

/**
 * Object관련 유틸리티
 * @member {Object} ax5.util.object
 */
	var util = {};
	util.object = (function(){
		var _toString = Object.prototype.toString;
/**
 * 타겟 오브젝트의 키를 대상 오브젝트의 키만큼 확장합니다.
 * @method ax5.util.object.extend
 * @param {Object} O - 타겟 오브젝트
 * @param {Object} _O - 대상 오브젝트
 * @param {Boolean} overwrite - 덮어쓰기 여부
 * @returns {Object} extened Object
 * @example
```js
 var object = ax5.util.object;
 var obja = {a:1};
 object.extend(obja, {b:2});
 object.extend(obja, {a:2});
 object.extend(obja, {a:2}, true);
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
 * @method ax5.util.object.clone
 * @param {Object} O - 타겟 오브젝트
 * @returns {Object} clone Object
 * @example
```js
 var object = ax5.util.object;
 var obja = {a:1};
 var objb = object.clone( obja );
 obja.a = 3; // 원본 오브젝트 수정
 console.log(obja, objb);
 // Object {a: 3} Object {a: 2}
```
 */
		function clone(O){
			return extend({}, O);
		}
/**
 * 인자의 타입을 반환합니다.
 * @method ax5.util.object.get_type
 * @param {Object|Array|String|Number|Element|Etc} O
 * @returns {String} element|object|array|function|string|number|undefined
 * @example
```js

```
 */
		function get_type(O){
			var typeName;
			if( !!(O && O.nodeType == 1) ){
				typeName = "element";
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
			if(typeof O === "function") {
				typeName = "function";
			}
			else
			if(typeof O === "undefined") {
				typeName = "undefined";
			}
			return typeName;
		}
/**
 * 오브젝트가 HTML 엘리먼트여부인지 판단합니다.
 * @method ax5.util.object.is_element
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_element(O) { return !!(O && O.nodeType == 1); }
/**
 * 오브젝트가 Object인지 판단합니다.
 * @method ax5.util.object.is_object
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_object(O) { return _toString.call(O) == "[object Object]"; }
/**
 * 오브젝트가 Array인지 판단합니다.
 * @method ax5.util.object.is_array
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_array(O) { return _toString.call(O) == "[object Array]"; }
/**
 * 오브젝트가 Function인지 판단합니다.
 * @method ax5.util.object.is_function
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_function(O) { return typeof O === "function"; }
/**
 * 오브젝트가 String인지 판단합니다.
 * @method ax5.util.object.is_string
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_string(O) { return _toString.call(O) == "[object String]"; }
/**
 * 오브젝트가 Number인지 판단합니다.
 * @method ax5.util.object.is_number
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_number(O) { return _toString.call(O) == "[object Number]"; }
/**
 * 오브젝트가 undefined인지 판단합니다.
 * @method ax5.util.object.is_undefined
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_undefined(O) { return typeof O === "undefined"; }
/**
 * 오브젝트가 undefined이거나 null이거나 빈값인지 판단합니다.
 * @method ax5.util.object.is_nothing
 * @param {Object} O
 * @returns {Boolean}
 */
		function is_nothing(O) { return (typeof O === "undefined" || O === null || O === ""); }
/**
 * 오브젝트의 첫번째 아이템을 반환합니다.
 * @method ax5.util.object.first
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.object.first({a:1, b:2});
 // Object {a: 1}
 ```
 */
		function first(O){
			if( util.object.is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[0]] = O[keys[0]];
				return item;
			}
			else
			if( util.object.is_array(O) ) {
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
 * @method ax5.util.object.last
 * @param {Object|Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.object.last({a:1, b:2});
 // Object {b: 2}
 ```
 */
		function last(O){
			if( util.object.is_object(O) ) {
				var keys = Object.keys(O);
				var item = {}; item[keys[keys.length-1]] = O[keys[keys.length-1]];
				return item;
			}
			else
			if( util.object.is_array(O) ) {
				return O[O.length-1];
			}
			else
			{
				console.error("ax5.util.object.last", "argument type error");
				return undefined;
			}
		}
/**
 * Object의 아이템을 모두 제거합니다.
 * @method ax5.util.object.clear
 * @param {Object|Array} O
 * @returns {Object|Array}
 * @example
 ```js
 var object = ax5.util.object;

 var myObject = {a:1, b:2};
 myObject = object.clear( myObject );
 console.log( myObject );

 var myArray = [0,1,2,3,4];
 myArray = object.clear( myArray );
 console.log( myArray );
 ```
 */
		function clear(O){
			if( util.object.is_array(O) ) {
				return (O = []);
			}
			else
			if( util.object.is_object(O) ) {
				return (O = {});
			}
			else
			{
				console.error("ax5.util.array.clear", "argument type error");
				return undefined;
			}
		}

		return {
			extend    : extend,
			clone     : clone,
			get_type  : get_type,
			is_element: is_element, is_object: is_object, is_array: is_array, is_function: is_function,
			is_string : is_string, is_number: is_number, is_undefined: is_undefined, is_nothing: is_nothing,
			first     : first, last: last, clear: clear
		};
	})();
/**
 * Array관련 유틸리티
 * @member {Object} ax5.util.array
 */
	util.array = (function(){

/**
 * 오브젝트의 첫번째 아이템을 반환합니다.
 * @method ax5.util.array.first
 * @param {Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.array.first([0,1,2]);
 // 0
 ```
 */
		function first(O){
			if( util.object.is_array(O) ) {
				return O[0];
			}
			else
			{
				console.error("ax5.util.array.first", "argument type error");
				return undefined;
			}
		}
/**
 * 오브젝트의 마지막 아이템을 반환합니다.
 * @method ax5.util.array.last
 * @param {Array} O
 * @returns {Object}
 * @example
 ```js
 ax5.util.array.last([0,1,2]);
 // 2
 ```
 */
		function last(){
			if( util.object.is_array(O) ) {
				return O[O.length-1];
			}
			else
			{
				console.error("ax5.util.array.last", "argument type error");
				return undefined;
			}
		}
/**
 * Array의 아이템을 모두 제거합니다.
 * @method ax5.util.array.clear
 * @param {Array} O
 * @returns {Array}
 * @example
```js
 var array = ax5.util.array;

 var myArray = [0,1,2,3,4];
 myArray = array.clear( myArray );
 console.log( myArray );
```
 */
		function clear(O){
			if( util.object.is_array(O) ) {
				return (O = []);
			}
			else
			{
				console.error("ax5.util.array.clear", "argument type error");
				return undefined;
			}
		}
		function remove(){

		}
		function append(){

		}
		function sort_by(){

		}

		return {
			first  : first,
			last   : last,
			clear  : clear,
			remove : remove,
			append : append,
			sort_by: sort_by
		}
	})();

	ax5.util = util;

	if ( typeof module === "object" && module && typeof module.exports === "object" ){
		module.exports = ax5; // commonJS
	}else{
		root.ax5 = ax5;
		if ( typeof define === "function" && define.amd ) define("_ax5", [], function () { return ax5; }); // requireJS
	}

})(window);
