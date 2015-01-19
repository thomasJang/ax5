/*!
 * AX5 JavaScript UI Library v0.0.1
 * https://axisj.com
 *
 * Copyright 2013, 2015 AXISJ.com and other contributors
 * Released under the MIT license
 * https://axisj.com/license
 */


(function(root, ax_super) {

	var ax_class = function () {
		var self = this;
		if (ax_super) ax_super.call(this); // 부모호출

		this.name = "서우";
		this.lastname = "장";

		this.getName = function () {
			return this.name + " " + this.lastname + "(" + (this.name + " " + this.lastname).substr(0, 2) + ")";
		};
		this.setName = function (aa) {
			this.name = aa;
			return this;
		};
		this.getAge = function(){
			return this.age;
		}
		this.setAge = function (aa) {
			this.age = aa;
			return this;
		};
	};
	// define ether to super object
	if (ax_super) ax_class.prototype = new ax_super();

	if (typeof root.module === "object" && root.module && typeof root.module.exports === "object") {
		root.module.exports = ax_class; // commonJS
	} else {
		root.ax5_class_sample = ax_class; // global object
		if (typeof define === "function" && define.amd) {
			/*global define */
			define("_ax5_class_sample", [], function () { return ax_class; }); // requireJS
		}
	}

})(window);
