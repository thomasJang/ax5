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
				item_width: 50, item_height: 50,
				item_padding: 2,
				date_format: 'yyyy-mm-dd',
				display_date: (new Date())
			};
		}).apply(this, arguments);

		this.target = null;
		var cfg = this.config;
		var a_day = 1000 * 60 * 60 * 24;

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

			//cfg.item_height = cfg.item_width = cfg.width / 7;
			cfg.display_date = U.date(cfg.display_date);
			this.target.html( this.get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find('[data-calendar-els="root"]'),
				"control": this.target.find('[data-calendar-els="control"]'),
				"control-display": this.target.find('[data-calendar-els="control-display"]'),
				"body": this.target.find('[data-calendar-els="body"]'),
			};

			if(cfg.control) {
				this.els["control"].find('[data-calendar-move]').on(cfg.click_event_name, (function (e) {
					this.move(e || window.event);
				}).bind(this));
			}

			if(cfg.mode == "day") {
				this.print_day(cfg.display_date);
			}
			else if(cfg.mode == "month"){

			}
			else if(cfg.mode == "year"){

			}
		};

		this.get_frame = function(){
			var po = [];
			po.push('<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root" style="width:' + cfg.width + 'px;" onselectstart="return false;">');
			if(cfg.control){
				po.push('<div class="calendar-control" data-calendar-els="control" style="height:' + cfg.item_height + 'px;line-height:' + cfg.item_height + 'px;">');
					po.push('<a class="date-move-left" data-calendar-move="left" style="width:' + cfg.item_width + 'px;">' + cfg.control.left + '</a>');
					po.push('<div class="date-display" data-calendar-els="control-display"></div>');
					po.push('<a class="date-move-right" data-calendar-move="right" style="width:' + cfg.item_width + 'px;">' + cfg.control.right + '</a>');
				po.push('</div>');
			}
			po.push('<div class="calendar-body" data-calendar-els="body"></div>');
			po.push('</div>');
			return po.join('');
		};

		this.set_display = function(){
			if(cfg.control) {
				this.els["control-display"].html(U.date(cfg.display_date, {return: cfg.control.display}));
			}
		};

		this.print_day = function(now_date){
			var
				dot_date = U.date(now_date),
				po = [],
				month_start_date = new Date(dot_date.getFullYear(), dot_date.getMonth(), 1, 12),
				table_start_date = (function(){
					var day = month_start_date.getDay();
					if (day == 0) day = 7;
					return U.date(month_start_date, {add:{d:-day}});
				})(),
				loop_date,
				this_month = dot_date.getMonth(),
				this_date = dot_date.getDate(),
				item_styles = [
					'width:' + cfg.item_width + 'px',
					'height:' + cfg.item_height + 'px', 'line-height:' + (cfg.item_height-cfg.item_padding*2) + 'px',
					'padding:' + cfg.item_padding + 'px'
				],
				i, k;

			po.push('<table data-calendar-table="day" cellpadding="0" cellspacing="0">');
			po.push('<thead>');
				po.push('<tr>');
				k = 0; while (k < 7) {
					po.push('<td class="calendar-col-' + k + '">');
					po.push( ax5.info.week_names[k].label );
					po.push('</td>');
					k++;
				}
				po.push('</tr>');
			po.push('</thead>');
			po.push('<tbody>');
				loop_date = table_start_date;
				i = 0; while (i < 6) {
					po.push('<tr>');
					k = 0; while (k < 7) {
						po.push('<td class="calendar-col-' + k + '" style="' + item_styles.join(';') + ';">');
							po.push('<a class="calendar-item-date ' + (function(){
								return ( loop_date.getMonth() == this_month ) ? ( loop_date.getDate() == this_date ) ? "focus" : "live" : "";
							})() + '" data-calendar-item-date="' + U.date(loop_date, {return:cfg.date_format}) + '">' +
							loop_date.getDate() + '</a>');
						po.push('</td>');
						k++;
						loop_date = U.date(loop_date, {add:{d:1}});
					}
					po.push('</tr>');
					i++;
				}
			po.push('</tbody>');
			po.push('</table>');

			this.els["body"].html( po.join('') );
			this.els["body"].find('[data-calendar-item-date]').on(cfg.click_event_name, (function(e){
				this.onclick(e||window.event);
			}).bind(this));

			this.set_display();
		};

		this.onclick = function(e, target, value){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-calendar-item-date")){
					return true;
				}
			});
			if(target){
				value = axd.attr(target, "data-calendar-item-date");

				if(this.config.onclick){
					this.config.onclick.call({
						date: value,
						target: this.target.elements[0],
						item_target: target
					});
				}
			}
		};

		this.move = function(e, target, value){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-calendar-move")){
					return true;
				}
			});
			if(target){
				value = axd.attr(target, "data-calendar-move");

				if(cfg.mode == "day") {
					if(value == "left") {
						cfg.display_date = U.date(cfg.display_date, {add: {m:-1}});
					}
					else{
						cfg.display_date = U.date(cfg.display_date, {add: {m:1}});
					}
					this.print_day(cfg.display_date);
				}
			}
		};

		this.set_display_date = function(d){
			cfg.display_date = U.date(d);
			if(cfg.mode == "day") {
				this.print_day(cfg.display_date);
			}
			else if(cfg.mode == "month"){

			}
			else if(cfg.mode == "year"){

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