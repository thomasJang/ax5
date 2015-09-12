// ax5.ui.keypad
(function(root, ax_super) {
	/**
	 * @class ax5.ui.keypad
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-06 tom : 시작
	 * @example
	 * ```
	 * var my_pad = new ax5.ui.keypad();
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
				keys: {
					label: 'label',
					value: 'value',
					width: 'width',
					rowspan: 'rowspan',
					colspan: 'colspan',
					klass: 'klass'
				}
			};
		}).apply(this, arguments);

		this.target = null;
		var cfg = this.config;
		/**
		 * Preferences of Keypad UI
		 * @method ax5.ui.keypad.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.keypad}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      keys : { // keys 는 ui 내부에서 사용되는 키값을 사용자가 변경 할 수 있는 환경설정값 이다. 개발환경에 맞게 커스트마이징 할 수 있다.
		 *          value: {String} ['value'] 키의 값
		 *          label: {String} ['label'] 키의 텍스트 라벨
		 *          rowspan: {String} ['rowspan']
		 *          colspan: {String} ['colspan']
		 *          klass: {String} ['klass'] 키에 추가할 CSS Class
		 *      },
		 *		board: {
		 *			keys: [
		 *				{label:"7", value:7} ...
		 *			],
		 *			col_width: 100,
		 *			col_height: 100,
		 *			col_paddings: "5px"
		 *		},
		 *      onclick: {Function} [onclick] - 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target || !cfg.board){
				U.error("aui_keypad_400", "[ax5.ui.keypad] config.target, config.board is required");
			}
			this.target = ax5.dom(cfg.target);
			this.set_layout();
		};

		this.set_layout = function(){
			var
				keys = cfg.keys,
				po = [],
				col_width = (cfg.board.col_width||"10px"),
				col_height = (cfg.board.col_height||"10px");

			po.push('<div class="ax5-ui-keypad ' +cfg.theme + '">');
			po.push('<table cellpadding="0" cellspacing="0">');
			po.push('<tbody>');
				po.push('<tr>');
			for(var i=0, ll=cfg.board.keys.length, item;i<ll;i++){
				item = cfg.board.keys[i];

				if(item.newline){
					po.push('</tr><tr>');
				}else {
					po.push('<td rowspan="' + (item[keys.rowspan] || 1) + '" colspan="' + (item[keys.colspan] || 1) + '" ' +
						'style="' + (function(css){
							css = [];
							if((item[keys.colspan] || 1) == 1){
								css.push("width:" + (item[keys.width] ? item[keys.width] : col_width) );
							}
							return css.join(';');
						})() + '">');
					po.push('<div class="ax-btn-wraper" style="' + (function(css){
							css = [];
							if((item[keys.rowspan] || 1) == 1){
								css.push("height:" + col_height);
							}
							else{
								var unit = (col_height.replace(/\d+/g, '') || "px");
								css.push("height:" + ( U.number(col_height) * item[keys.rowspan]) + unit);
							}
							return css.join(';');
						})() + '">');
					po.push('<button class="ax-btn ' + (item[keys.klass]||"") + '" data-keypad-item-index="' + i + '">' + item[keys.label] + '</button>');
					po.push('</div>');
					po.push('</td>');
				}
			}
			po.push('</tbody>');
			po.push('</table>');
			po.push('</div>');

			this.target.html( po.join('') );
			this.target.find('[data-keypad-item-index]').on(cfg.click_event_name, (function(e){
				this.onclick(e||window.event);
			}).bind(this));
		};

		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-keypad-item-index")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-keypad-item-index");
				if(this.config.onclick){
					this.config.onclick.call({
						keys: this.config.board.keys,
						item: this.config.board.keys[index],
						target: this.target.elements[0],
						item_target: target
					});
				}
			}
		};
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.keypad = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_keypad", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);