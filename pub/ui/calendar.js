// ax5.ui.calendar
(function(root, ax_super) {
	/**
	 * @class ax5.ui.calendar
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-21 tom : 시작
	 * @example
	 * ```
	 * var my_pad = new ax5.ui.calendar();
	 * ```
	 */
	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: (('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				theme: 'default',
				mode: 'day', // day|month|year,
				week_names: [
					{ name: "SUN" },
					{ name: "MON" },
					{ name: "TUE" },
					{ name: "WED" },
					{ name: "THU" },
					{ name: "FRI" },
					{ name: "SAT" }
				]
			};
		}).apply(this, arguments);

		this.target = null;
		var cfg = this.config;
		/**
		 * Preferences of calendar UI
		 * @method ax5.ui.calendar.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.calendar}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      mode: {String}, // [day|month|year] - 화면 출력 모드
		 *      onclick: {Function} // [onclick] - 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target){
				U.error("aui_calendar_400", "[ax5.ui.calendar] config.target is required");
			}
			this.target = ax5.dom(cfg.target);

			this.target.html( this.get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find('[data-calendar-els="root"]')
			};

			this.print();
		};

		this.get_frame = function(){
			var po = [];
			po.push('<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root">');
			po.push('</div>');
			return po.join('');
		};

		this.print = function(){
			this.els["root"].html( this.get_page(cfg.mode) );
			this.els["root"].find('[data-calendar-item-index]').on(cfg.click_event_name, (function(e){
				this.onclick(e||window.event);
			}).bind(this));
		};

		this.get_page = function(mode){
			var po = [];
			po.push('<table data-calendar-table="' + typ + '">');
			var i = 0; while (i < 6) {
				po.push('<tr>');
				var k = 0; while (k < 7) {
					po.push('<td>');
					po.push('</td>');
					k++;
				}
				po.push('</tr>');
				i++;
			}
			po.push('</table>');

			return po.join('');
		};

		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-calendar-item-index")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-calendar-item-index");
				if(this.config.onclick){
					this.config.onclick.call({
						keys: this.config.board.keys,
						item: this.config.board.keys[index],
						target: cfg.target.elements[0],
						item_target: target
					});
				}
			}
		};
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.calendar = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_calendar", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);