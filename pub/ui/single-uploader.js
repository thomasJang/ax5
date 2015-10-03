(function (root, ax_super) {

	/**
	 * @class ax5.ui.single_uploader
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2015-10-03 tom : 시작
	 * @example
	 * ```
	 * var my_single_uploader = new ax5.ui.single_uploader();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function () {
		// 클래스 생성자
		this.main = (function () {
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {

			};
		}).apply(this, arguments);

		this.target = null;
		var _this = this;
		var cfg = this.config;

		this.init = function () {
			this.target = ax5.dom(cfg.target);


		};
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.single_uploader = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_single_uploader", [], function () {
			return ax_class;
		}); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);