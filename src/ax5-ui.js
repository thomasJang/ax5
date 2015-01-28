/**
 * Refer to this by {@link ax5}.
 * @namespace ax5.ui
 */
ax5.ui = (function () {
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
	function ax_ui() {
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
		this.set_config = function (cfg, call_init) {
			U.extend(this.config, cfg, true);
			if (typeof call_init == "undefined" || call_init === true) {
				this.init();
			}
			return this;
		};
		this.init = function () {
			console.log(this.config);
		};
	}

	return {
		ax_ui: ax_ui
	}
})();