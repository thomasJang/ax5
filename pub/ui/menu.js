/**
 * @class ax5.ui.menu
 * @classdesc
 * @version v0.0.1
 * @author tom@axisj.com
 * @logs
 * 2014-04-21 tom : 시작
 * @example
 * ```
 * var my_menu = new ax5.ui.menu();
 * ```
 */

(function(root, ax_super) {

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		if (ax_super) ax_super.call(this); // 부모호출
		this.config = {

		};
	}
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.menu = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_menu", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);