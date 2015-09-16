/*
 * ax5 - v0.0.1 
 * 2015-09-16 
 * www.axisj.com Javascript UI Library
 * 
 * Copyright 2013, 2015 AXISJ.com and other contributors 
 * Released under the MIT license 
 * www.axisj.com/ax5/license 
 */

// ax5.ui.calendar
(function (root, ax_super)
{
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
	var ax_class = function ()
	{
		var _this = this;
		// 클래스 생성자
		this.main = (function ()
		{
			if (ax_super) ax_super.call( this ); // 부모호출
			this.config = {
				click_event_name: (('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				theme: 'default', mode: 'day', // day|month|year,
				item_width: 50, item_height: 50, item_padding: 2, date_format: 'yyyy-mm-dd', display_date: (new Date())
			};
		}).apply( this, arguments );

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
		this.init = function ()
		{
			// after set_config();
			//console.log(this.config);
			if (!cfg.target)
			{
				U.error( "aui_calendar_400", "[ax5.ui.calendar] config.target is required" );
			}
			this.target = ax5.dom( cfg.target );

			//cfg.item_height = cfg.item_width = cfg.width / 7;
			cfg.display_date = U.date( cfg.display_date );
			this.target.html( this.get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find( '[data-calendar-els="root"]' ),
				"control": this.target.find( '[data-calendar-els="control"]' ),
				"control-display": this.target.find( '[data-calendar-els="control-display"]' ),
				"body": this.target.find( '[data-calendar-els="body"]' ),
			};

			if (cfg.control)
			{
				this.els[ "control" ].find( '[data-calendar-move]' ).on( cfg.click_event_name, (function (e)
				{
					this.move( e || window.event );
				}).bind( this ) );
			}


				if (cfg.mode == "day")
				{
					this.print_day( cfg.display_date );
				}
				else if (cfg.mode == "month")
				{
					this.print_month( cfg.display_date );
				}
				else if (cfg.mode == "year")
				{
					this.print_year( cfg.display_date );
				}

		};

		this.get_frame = function ()
		{
			var po = [];
			po.push( '<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root" style="width:' + cfg.width + 'px;" onselectstart="return false;">' );
			if (cfg.control)
			{
				po.push( '<div class="calendar-control" data-calendar-els="control" style="height:' + cfg.item_height + 'px;line-height:' + cfg.item_height + 'px;">' );
				po.push( '<a class="date-move-left" data-calendar-move="left" style="width:' + cfg.item_width + 'px;">' + cfg.control.left + '</a>' );
				po.push( '<div class="date-display" data-calendar-els="control-display"></div>' );
				po.push( '<a class="date-move-right" data-calendar-move="right" style="width:' + cfg.item_width + 'px;">' + cfg.control.right + '</a>' );
				po.push( '</div>' );
			}
			po.push( '<div class="calendar-body" data-calendar-els="body"></div>' );
			po.push( '</div>' );
			return po.join( '' );
		};

		this.set_display = function ()
		{
			if (cfg.control)
			{
				//this.els["control-display"].html(U.date(cfg.display_date, {return: cfg.control.display}));

				var myDate = U.date( cfg.display_date ), yy = "", mm = "";

				if (cfg.mode == "day")
				{
					if (cfg.control.year_tmpl) yy = cfg.control.year_tmpl.replace( '%s', myDate.getFullYear() );
					if (cfg.control.month_tmpl) mm = cfg.control.month_tmpl.replace( '%s', (myDate.getMonth() + 1) );

					this.els[ "control-display" ].html( '<span data-calendar-display="year">' + yy + '</span>' + '<span data-calendar-display="month">' + mm + '</span>' );
				}
				else if (cfg.mode == "month")
				{
					if (cfg.control.year_tmpl) yy = cfg.control.year_tmpl.replace( '%s', myDate.getFullYear() );

					this.els[ "control-display" ].html( '<span data-calendar-display="year">' + yy + '</span>' );
				}
				else if (cfg.mode == "year")
				{
					var yy1 = cfg.control.year_tmpl.replace( '%s', myDate.getFullYear() - 10 );
					var yy2 = cfg.control.year_tmpl.replace( '%s', Number( myDate.getFullYear() ) + 9 );
					this.els[ "control-display" ].html( yy1 + ' ~ ' + yy2 );
				}

				this.els[ "control-display" ].find( '[data-calendar-display]' ).on( cfg.click_event_name, (function (e)
				{
					target = axd.parent( e.target, function (target)
					{
						if (ax5.dom.attr( target, "data-calendar-display" ))
						{
							return true;
						}
					} );
					if (target)
					{
						var mode = axd.attr( target, "data-calendar-display" );
						this.change_mode( mode );
					}
				}).bind( this ) );
			}
		};

		this.print_day = function (now_date)
		{
			var dot_date = U.date( now_date ), po = [], month_start_date = new Date( dot_date.getFullYear(), dot_date.getMonth(), 1, 12 ), _today = new Date(), table_start_date = (function ()
				{
					var day = month_start_date.getDay();
					if (day == 0) day = 7;
					return U.date( month_start_date, {add: {d: -day}} );
				})(), loop_date, this_month = dot_date.getMonth(), this_date = dot_date.getDate(), item_styles = [ 'width:' + cfg.item_width + 'px', 'height:' + cfg.item_height + 'px', 'line-height:' + (cfg.item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px' ], i, k;

			po.push( '<table data-calendar-table="day" cellpadding="0" cellspacing="0">' );
			po.push( '<thead>' );
			po.push( '<tr>' );
			k = 0;
			while (k < 7)
			{
				po.push( '<td class="calendar-col-' + k + '">' );
				po.push( ax5.info.week_names[ k ].label );
				po.push( '</td>' );
				k++;
			}
			po.push( '</tr>' );
			po.push( '</thead>' );
			po.push( '<tbody>' );
			loop_date = table_start_date;
			i = 0;
			while (i < 6)
			{
				po.push( '<tr>' );
				k = 0;
				while (k < 7)
				{
					po.push( '<td class="calendar-col-' + k + '" style="' + item_styles.join( ';' ) + ';">' );
					po.push( '<a class="calendar-item-date ' + (function ()
						{
							return ( loop_date.getMonth() == this_month ) ? ( U.date( loop_date, {return: "yyyymmdd"} ) == U.date( _today, {return: "yyyymmdd"} ) ) ? "focus" : "live" : "";
						})() + ' ' + (function ()
						{
							return ""; //( U.date(loop_date, {return:"yyyymmdd"}) == U.date(cfg.display_date, {return:"yyyymmdd"}) ) ? "hover" : "";
						})() + '" data-calendar-item-date="' + U.date( loop_date, {return: cfg.date_format} ) + '">' + loop_date.getDate() + '</a>' );
					po.push( '</td>' );
					k++;
					loop_date = U.date( loop_date, {add: {d: 1}} );
				}
				po.push( '</tr>' );
				i++;
			}
			po.push( '</tbody>' );
			po.push( '</table>' );

			this.els[ "body" ].html( po.join( '' ) );
			this.els[ "body" ].find( '[data-calendar-item-date]' ).on( cfg.click_event_name, function (e)
			{
				e = e || window.event;
				_this.onclick( e );

				try {
					if (e.preventDefault) e.preventDefault();
					if (e.stopPropagation) e.stopPropagation();
					e.cancelBubble = true;
				}catch(e){

				}
				return false;
			} );

			this.set_display();
		};

		this.print_month = function (now_date)
		{

			var _item_width = cfg.item_width * 7 / 3, _item_height = cfg.item_height * 6 / 4;

			var dot_date = U.date( now_date ), n_month = dot_date.getMonth(), po = [], item_styles = [ 'width:' + _item_width + 'px', 'height:' + _item_height + 'px', 'line-height:' + (_item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px' ], i, k, m;

			po.push( '<table data-calendar-table="month" cellpadding="0" cellspacing="0">' );
			po.push( '<thead>' );
			po.push( '<tr>' );

			po.push( '<td class="calendar-col-0" colspan="3"> 월을 선택해주세요.' );
			po.push( '</td>' );

			po.push( '</tr>' );
			po.push( '</thead>' );
			po.push( '<tbody>' );

			m = 0;
			i = 0;
			while (i < 4)
			{
				po.push( '<tr>' );
				k = 0;
				while (k < 3)
				{
					po.push( '<td class="calendar-col-' + i + '" style="' + item_styles.join( ';' ) + ';">' );
					po.push( '<a class="calendar-item-month live ' + (function ()
						{
							return ( m == n_month ) ? "hover" : "";
						})() + '" data-calendar-item-month="' + (function ()
						{
							return dot_date.getFullYear() + '-' + U.set_digit( m + 1, 2 ) + '-' + U.set_digit( dot_date.getDate(), 2 );
						})() + '">' + (m + 1) + '월</a>' );
					po.push( '</td>' );
					m++;
					k++;
				}
				po.push( '</tr>' );
				i++;
			}
			po.push( '</tbody>' );
			po.push( '</table>' );

			this.els[ "body" ].html( po.join( '' ) );
			this.els[ "body" ].find( '[data-calendar-item-month]' ).on( cfg.click_event_name, function (e)
			{
				e = e || window.event;
				target = axd.parent( e.target, function (target)
				{
					if (ax5.dom.attr( target, "data-calendar-item-month" ))
					{
						return true;
					}
				} );
				if (target)
				{
					value = axd.attr( target, "data-calendar-item-month" );
					_this.change_mode( "day", value );
					//alert(value);
					try {
						if (e.preventDefault) e.preventDefault();
						if (e.stopPropagation) e.stopPropagation();
						e.cancelBubble = true;
					}catch(e){

					}
					return false;
				}
			} );

			this.set_display();
		};

		this.print_year = function (now_date)
		{
			var _item_width = cfg.item_width * 7 / 4, _item_height = cfg.item_height * 6 / 5;

			var dot_date = U.date( now_date ), n_year = dot_date.getFullYear(), po = [], item_styles = [ 'width:' + _item_width + 'px', 'height:' + _item_height + 'px', 'line-height:' + (_item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px' ], i, k, m;

			po.push( '<table data-calendar-table="year" cellpadding="0" cellspacing="0">' );
			po.push( '<thead>' );
			po.push( '<tr>' );

			po.push( '<td class="calendar-col-0" colspan="5">년도를 선택해주세요' );
			po.push( '</td>' );

			po.push( '</tr>' );
			po.push( '</thead>' );

			po.push( '<tbody>' );

			y = n_year - 10;
			i = 0;
			while (i < 5)
			{
				po.push( '<tr>' );
				k = 0;
				while (k < 4)
				{
					po.push( '<td class="calendar-col-' + i + '" style="' + item_styles.join( ';' ) + ';">' );
					po.push( '<a class="calendar-item-year live ' + (function ()
						{
							return ( y == n_year ) ? "hover" : "";
						})() + '" data-calendar-item-year="' + (function ()
						{
							return y + '-' + U.set_digit( dot_date.getMonth() + 1, 2 ) + '-' + U.set_digit( dot_date.getDate(), 2 );
						})() + '">' + (y) + '년</a>' );
					po.push( '</td>' );
					y++;
					k++;
				}
				po.push( '</tr>' );
				i++;
			}
			po.push( '</tbody>' );
			po.push( '</table>' );

			this.els[ "body" ].html( po.join( '' ) );
			this.els[ "body" ].find( '[data-calendar-item-year]' ).on( cfg.click_event_name, function (e)
			{
				e = (e || window.event);
				target = axd.parent( e.target, function (target)
				{
					if (ax5.dom.attr( target, "data-calendar-item-year" ))
					{
						return true;
					}
				} );
				if (target)
				{
					value = axd.attr( target, "data-calendar-item-year" );
					_this.change_mode( "month", value );

					try {
						if (e.preventDefault) e.preventDefault();
						if (e.stopPropagation) e.stopPropagation();
						e.cancelBubble = true;
					}catch(e){

					}
					return false;
				}
			} );

			this.set_display();
		};

		this.onclick = function (e, target, value)
		{
			target = axd.parent( e.target, function (target)
			{
				if (ax5.dom.attr( target, "data-calendar-item-date" ))
				{
					return true;
				}
			} );
			if (target)
			{
				value = axd.attr( target, "data-calendar-item-date" );

				this.els[ "body" ].find( '[data-calendar-item-date="' + U.date( cfg.display_date, {return: cfg.date_format} ) + '"]' ).class_name( "remove", "hover" );
				axd.class_name( target, "add", "hover" );

				cfg.display_date = value;

				if (this.config.onclick)
				{
					this.config.onclick.call( {
						date: value, target: this.target.elements[ 0 ], item_target: target
					} );
				}
			}
		};

		this.move = function (e, target, value)
		{
			target = axd.parent( e.target, function (target)
			{
				if (ax5.dom.attr( target, "data-calendar-move" ))
				{
					return true;
				}
			} );
			if (target)
			{
				value = axd.attr( target, "data-calendar-move" );

				if (cfg.mode == "day")
				{
					if (value == "left")
					{
						cfg.display_date = U.date( cfg.display_date, {add: {m: -1}} );
					}
					else
					{
						cfg.display_date = U.date( cfg.display_date, {add: {m: 1}} );
					}
					this.print_day( cfg.display_date );
				}
				else if (cfg.mode == "month")
				{
					if (value == "left")
					{
						cfg.display_date = U.date( cfg.display_date, {add: {y: -1}} );
					}
					else
					{
						cfg.display_date = U.date( cfg.display_date, {add: {y: 1}} );
					}
					this.print_month( cfg.display_date );
				}
				else if (cfg.mode == "year")
				{
					if (value == "left")
					{
						cfg.display_date = U.date( cfg.display_date, {add: {y: -10}} );
					}
					else
					{
						cfg.display_date = U.date( cfg.display_date, {add: {y: 10}} );
					}
					this.print_year( cfg.display_date );
				}
			}
		};

		this.change_mode = function (mode, change_date)
		{
			if (typeof change_date != "undefined") cfg.display_date = change_date;
			cfg.mode = mode;

			this.els[ "body" ].class_name( "remove", "fadein" ).class_name( "add", "fadeout" );
			setTimeout( (function ()
			{
				if (cfg.mode == "day")
				{
					this.print_day( cfg.display_date );
				}
				else if (cfg.mode == "month")
				{
					this.print_month( cfg.display_date );
				}
				else if (cfg.mode == "year")
				{
					this.print_year( cfg.display_date );
				}
				this.els[ "body" ].class_name( "remove", "fadeout" ).class_name( "add", "fadein" );
			}).bind( this ), 300 );
		};

		this.set_display_date = function (d)
		{
			cfg.display_date = U.date( d );

			this.els[ "body" ].class_name( "remove", "fadein" ).class_name( "add", "fadeout" );
			setTimeout( (function ()
			{
				if (cfg.mode == "day")
				{
					this.print_day( cfg.display_date );
				}
				else if (cfg.mode == "month")
				{
					this.print_month( cfg.display_date );
				}
				else if (cfg.mode == "year")
				{
					this.print_year( cfg.display_date );
				}
				this.els[ "body" ].class_name( "remove", "fadeout" ).class_name( "add", "fadein" );
			}).bind( this ), 300 );
		};

	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function( ax_super )) ax_class.prototype = new ax_super(); // 상속
	root.calendar = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd)
	{
		define( "_ax5_ui_calendar", [], function ()
		{
			return ax_class;
		} ); // for requireJS
	}
	//== ui class 공통 처리 구문

})( ax5.ui, ax5.ui.root );

// ax5.ui.component_grid
(function(root, ax_super) {
	/**
	 * @class ax5.ui.component_grid
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-23 tom : 시작
	 * @example
	 * ```
	 * var my_component_grid = new ax5.ui.component_grid();
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
				theme: 'default'
			};
		}).apply(this, arguments);

		this.list = [];
		this.page = {};
		this.target = null;
		this.selected_item = null;

		var cfg = this.config;
		/**
		 * Preferences of component_grid UI
		 * @method ax5.ui.component_grid.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.component_grid}
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
		 *      onclick: {Function} [onclick] - 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target){
				U.error("aui_component_grid_400", "[ax5.ui.component_grid] config.target is required");
			}
			this.target = ax5.dom(cfg.target);

			this.target.html( this.get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find('[data-component-grid-els="root"]'),
				"body": this.target.find('[data-component-grid-els="body"]'),
				"control": this.target.find('[data-component-grid-els="control"]')
			};

			// 아이템 이벤트 바인딩
			this.target.find('[data-component-grid-item-index]').on(cfg.click_event_name, (function(e){
				this.onclick(e||window.event);
			}).bind(this));
			
			// 컨트롤 이벤트 바인딩
			this.target.find('[data-component-grid-control]').on(cfg.click_event_name, (function(e){
				this.onmove(e||window.event);
			}).bind(this));


			this.set_size_frame();
			this.bind_window_resize(function(){
				this.set_size_frame();
			});
		};

		this.resize = function(){
			this.set_size_frame();
		};

		this.get_frame = function(){
			var
				po = [], i = 0;
			
			po.push('<div class="ax5-ui-component-grid ' +cfg.theme + '" data-component-grid-els="root">');
				po.push('<div class="component-grid-body" data-component-grid-els="body">');

					po.push('<table cellpadding="0" cellspacing="0">');
						po.push('<tbody>');

						for(var r=0;r<cfg.rows;r++){
							po.push('<tr>');
							for(var c=0;c<cfg.cols;c++) {
								po.push('<td>');
								po.push('<div class="ax-item-wraper ' + (cfg.item.addon? "has-addon":"") + '">');

								po.push('<button class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-item-index="' + i + '"></button>');

								po.push('</div>');
								po.push('</td>');
								i++
							}
							po.push('</tr>');
						}

						po.push('</tbody>');
					po.push('</table>');

				po.push('</div>');

				if(cfg.control) {
					//cfg.control.height = (cfg.col_height * cfg.rows / 2);
					po.push('<div class="component-grid-control" data-component-grid-els="control" style="width:' + cfg.control.width + 'px;">');
					po.push('<table cellpadding="0" cellspacing="0">');
					po.push('<tbody>');
						po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper">');
								po.push('<button class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-control="prev">' + cfg.control.prev + '</buttton>');
							po.push('</div>');
							po.push('</td>');
						po.push('</tr>');
						po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper">');
								po.push('<button class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-control="next">' + cfg.control.next + '</button>');
							po.push('</div>');
							po.push('</td>');
						po.push('</tr>');
					po.push('</tbody>');
					po.push('</table>');
					po.push('</div>');
				}
			po.push('</div>');

			return po.join('');
		};


		this.set_size_frame = function(){  /* resizable */
			var
				target_height = this.target.height();

			this.els["body"].find(".ax-item-wraper").css({height:target_height / cfg.rows});
			this.els["control"].find(".ax-item-wraper").css({height:target_height / 2});

			/*
			this.els["main"].css({height: target_height});
			this.els["main-header"].css({height: cfg.head_height});
			this.els["main-body"].css({height: target_height - cfg.head_height});
			if(cfg.control) {
				this.els["control"].css({height: target_height});
				var control_item = this.els["control"].find(".ax-item-wraper");
				//console.log(control_item.elements.length);
				control_item.css({height: target_height / control_item.elements.length});
			}
			this.virtual_scroll.size = Math.ceil((target_height - cfg.head_height) / cfg.item_height);
			*/
		};
		
		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-component-grid-item-index")){
					return true;
				}
			});
			if(target){

				if(this.selected_item) axd.class_name(this.selected_item, "remove", "selected");
				this.selected_item = target;
				this.selected_item_pgno = this.page.no;
				axd.class_name(target, "add", "selected");

				index = axd.attr(target, "data-component-grid-item-index");
				if(this.config.onclick){

					//console.log(U.number(index) + this.page.no * this.page.size);
					this.config.onclick.call({
						index: index,
						list: this.list,
						item: this.list[ U.number(index) + this.page.no * this.page.size ],
						target: this.target.elements[0],
						item_target: target
					});
				}
			}
		};
		
		this.onmove = function(e, target, dirc){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-component-grid-control")){
					return true;
				}
			});
			if(target){
				dirc = axd.attr(target, "data-component-grid-control");
				if(dirc == "prev"){
					if(this.page.no < 1){

					}
					else{
						this.page.no--;
						this.print_list();
					}
				}
				else{
					if(this.page.no < this.page.count-1){
						this.page.no++;
						this.print_list();
					}
				}
			}
		};

		this.set_list = function(list){
			this.list = list;
			this.page.no = 0;
			this.page.size = cfg.rows * cfg.cols;
			this.page.count = Math.ceil( this.list.length / this.page.size );
			this.print_list();
		};

		this.print_list = function(){
			function formatter(val, format){
				if(U.is_function(format)){
					var that = {
						value: val
					};
					return format.call(that);
				}
				else if(format == "money"){
					return U.number(val, {money:true});
				}
				else{
					return val;
				}
			}

			if(this.selected_item) {
				axd.class_name(this.selected_item, "remove", "selected");
				if(this.selected_item_pgno == this.page.no) {
					axd.class_name(this.selected_item, "add", "selected");
				}
			}

			var item_index = this.page.no * this.page.size;
			for(var i=0;i<this.page.size;i++){
				var
					node = this.els["body"].find('[data-component-grid-item-index="' + i + '"]'),
					item = this.list[item_index];

				if(item) {
					node.html('<div class="label">' + formatter(item[cfg.item.label.key], cfg.item.label.formatter) + '</div>');
					if (cfg.item.addon) {
						node.append('<div class="addon">' + formatter(item[cfg.item.addon.key], cfg.item.addon.formatter) + '</div>');
					}
				}else{
					node.empty();
				}
				item_index++;
			}
		};

		this.click = function(index){
			if(this.list[ U.number(index) + this.page.no * this.page.size ]) {
				var target = this.target.find('[data-component-grid-item-index="' + index + '"]');
				if(this.selected_item) axd.class_name(this.selected_item, "remove", "selected");
				this.selected_item = target;
				this.selected_item_pgno = this.page.no;
				axd.class_name(target, "add", "selected");

				if(this.config.onclick){
					//console.log(U.number(index) + this.page.no * this.page.size);
					this.config.onclick.call({
						index: index,
						list: this.list,
						item: this.list[ U.number(index) + this.page.no * this.page.size ],
						target: this.target.elements[0],
						item_target: target
					});
				}
			}

			return this;
		}
	};
	//== UI Class
	
	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.component_grid = ax_class; // ax5.ui에 연결
	
	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_component_grid", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문
	
})(ax5.ui, ax5.ui.root);

// ax5.ui.dialog
(function(root, ax_super) {

	/**
	 * @class ax5.ui.dialog
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-15 tom : 시작
	 * @example
	 * ```
	 * var my_dialog = new ax5.ui.dialog();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				mask: {
					target: document.body,
					content: ''
				},
				theme: 'default',
				width: 300,
				title: '',
				msg: ''
			};
		}).apply(this, arguments);

		this.active_dialog = null;
		this.mask = new ax5.ui.mask();

		var cfg = this.config;
		/**
		 * Preferences of dialog UI
		 * @method ax5.ui.dialog.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.dialog}
		 * @example
		 * ```
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			cfg.id = 'ax5-dialog-' + ax5.get_guid();

			this.mask.set_config(cfg.mask);
		};

		/**
		 * open the dialog of alert type
		 * @method ax5.ui.dialog.alert
		 * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.dialog}
		 * @example
		 * ```
		 * my_dialog.alert({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
		 * ```
		 */
		this.alert = function(opts, callback) {
			if(U.is_string(opts)){
				opts = {
					title: cfg.title,
					msg: opts
				}
			}
			opts.dialog_type = "alert";
			opts.theme = (opts.theme || cfg.theme || "");
			if(typeof opts.btns === "undefined"){
				opts.btns = {
					ok: {label: 'ok', theme: opts.theme}
				};
			}
			this.open(opts, callback);
			return this;
		};

		/**
		 * open the dialog of confirm type
		 * @method ax5.ui.dialog.confirm
		 * @param {Object|String} [{theme, title, msg, btns}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.dialog}
		 * @example
		 * ```
		 * my_dialog.confirm({
		 *  title: 'app title',
		 *  msg: 'confirm'
		 * }, function(){});
		 * ```
		 */
		this.confirm = function(opts, callback) {
			if(U.is_string(opts)){
				opts = {
					title: cfg.title,
					msg: opts
				}
			}
			opts.dialog_type = "confirm";
			opts.theme = (opts.theme || cfg.theme || "");
			if(typeof opts.btns === "undefined"){
				opts.btns = {
					ok: {label: 'ok', theme: opts.theme},
					cancel: {label: 'cancel'}
				};
			}
			this.open(opts, callback);
			return this;
		};

		/**
		 * open the dialog of prompt type
		 * @method ax5.ui.dialog.prompt
		 * @param {Object|String} [{theme, title, msg, btns, input}|msg] - dialog 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.dialog}
		 * @example
		 * ```
		 * my_dialog.prompt({
		 *  title: 'app title',
		 *  msg: 'alert'
		 * }, function(){});
		 * ```
		 */
		this.prompt = function(opts, callback) {
			if(U.is_string(opts)){
				opts = {
					title: cfg.title,
					msg: opts
				}
			}
			opts.dialog_type = "prompt";
			opts.theme = (opts.theme || cfg.theme || "");

			if(typeof opts.input === "undefined"){
				opts.input = {
					value: {label: (opts.msg || cfg.msg || "")}
				};
			}
			if(typeof opts.btns === "undefined"){
				opts.btns = {
					ok: {label: 'ok', theme: opts.theme},
					cancel: {label: 'cancel'}
				};
			}
			this.open(opts, callback);
			return this;
		};


		this.get_content = function(dialog_id, opts){
			var
				po = [];

			po.push('<div id="' + dialog_id + '" data-ax5-ui="dialog" class="ax5-ui-dialog ' + opts.theme + '">');
				po.push('<div class="ax-dialog-heading">');
				po.push( (opts.title || cfg.title || "") );
				po.push('</div>');
				po.push('<div class="ax-dialog-body">');
					po.push('<div class="ax-dialog-msg">');
					if(opts.input){
						U.each(opts.input, function(k, v) {
							po.push('<div class="ax-dialog-prompt">');
							po.push( this.label.replace(/\n/g, "<br/>") );
							po.push('</div>');
							po.push('<input type="text" class="ax-inp" data-ax-dialog-prompt="' + k + '" style="width:100%;" />');
						});
					}
					else{
						po.push( (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>") );
					}

					po.push('</div>');
					po.push('<div class="ax-dialog-buttons">');
						po.push('<div class="ax-button-wrap">');
						U.each(opts.btns, function(k, v){
							po.push('<button type="button" data-ax-dialog-btn="' + k + '" class="ax-btn ' + this.theme + '">' + this.label + '</button>');
						});
						po.push('</div>');
					po.push('</div>');
				po.push('</div>');
			po.push('</div>');
			return po.join('');
		};

		this.open = function(opts, callback){
			var
				pos = {},
				box = {},
				po;

			opts.id = (opts.id || cfg.id);

			this.mask.open();
			box = {
				width: opts.width || cfg.width
			};
			axd.append(document.body, this.get_content(opts.id, opts));
			this.active_dialog = ax5.dom('#' + opts.id);
			this.active_dialog.css({width: box.width});

			// dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
			box.height = this.active_dialog.height();

			//- position 정렬
			if(typeof opts.position === "undefined" || opts.position === "center"){
				pos.top = ax5.dom.height(document.body) / 2 - box.height/2;
				pos.left = ax5.dom.width(document.body) / 2 - box.width/2;
			}else{
				pos.left = opts.position.left || 0;
				pos.top = opts.position.top || 0;
			}
			this.active_dialog.css(pos);

			// bind button event
			if(opts.dialog_type === "prompt") {
				this.active_dialog.find("[data-ax-dialog-prompt]").elements[0].focus();
			}else{
				this.active_dialog.find("[data-ax-dialog-btn]").elements[0].focus();
			}
			this.active_dialog.find("[data-ax-dialog-btn]").on(cfg.click_event_name, (function(e){
				this.btn_onclick(e||window.event, opts, callback);
			}).bind(this));
			
			// bind key event
			axd(window).on("keydown.ax-dialog", (function(e){
				this.onkeyup(e||window.event, opts, callback);
			}).bind(this));

			if(cfg.onopen){
				cfg.onopen.call(this, this);
			}
			return this;
		};

		this.btn_onclick = function(e, opts, callback, target, k){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-ax-dialog-btn")){
					return true;
				}
			});
			if(target){
				k = axd.attr(target, "data-ax-dialog-btn");

				var that = {
						key: k, value: opts.btns[k],
						dialog_id: opts.id,
						btn_target: target
					};
				if(opts.dialog_type === "prompt") {
					var empty_key = null;
					for (var oi in opts.input) {
						that[oi] = this.active_dialog.find('[data-ax-dialog-prompt=' + oi + ']').val();
						if(that[oi] == "" || that[oi] == null){
							empty_key = oi;
							break;
						}
					}
				}
				if(opts.btns[k].onclick){
					opts.btns[k].onclick.call(that, k);
				}
				else
				if(opts.dialog_type === "alert"){
					if(callback) callback.call(that, k);
					this.close();
				}
				else
				if(opts.dialog_type === "confirm"){
					if(callback) callback.call(that, k);
					this.close();
				}
				else
				if(opts.dialog_type === "prompt"){
					if(k === 'ok') {
						if(empty_key) {
							this.active_dialog.find('[data-ax-dialog-prompt="' + empty_key + '"]').elements[0].focus();
							return false;
						}
					}
					if(callback) callback.call(that, k);
					this.close();
				}
			}
		};
		
		this.onkeyup = function(e, opts, callback, target, k){
			if(e.keyCode == ax5.info.event_keys.ESC){
				this.close();
			}
			if(opts.dialog_type === "prompt") {
				if(e.keyCode == ax5.info.event_keys.RETURN){
					var that = {
						key: k, value: opts.btns[k],
						dialog_id: opts.id,
						btn_target: target
					};
					var empty_key = null;
					for (var oi in opts.input) {
						that[oi] = this.active_dialog.find('[data-ax-dialog-prompt=' + oi + ']').val();
						if(that[oi] == "" || that[oi] == null){
							empty_key = oi;
							break;
						}
					}
					if(empty_key) return false;
					if(callback) callback.call(that, k);
					this.close();
				}
			}
		};

		/**
		 * close the dialog
		 * @method ax5.ui.dialog.close
		 * @returns {ax5.ui.dialog}
		 * @example
		 * ```
		 * my_dialog.close();
		 * ```
		 */
		this.close = function(){
			if(this.active_dialog){
				this.active_dialog.remove();
				this.mask.close();
				this.active_dialog = null;
				axd(window).off("keydown.ax-dialog");
				if(cfg.onclose){
					cfg.onclose.call(this, this);
				}
			}
			return this;
		}
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.dialog = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_dialog", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);


// todo : confirm 기능 구현 alert에 btns만 확장 하면 끄읏
// todo : prompt
// todo : toast

(function(root, ax_super) {

	/**
	 * @class ax5.ui.div_slider
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2015-09-15 tom : 시작
	 * @example
	 * ```
	 * var my_div_slider = new ax5.ui.div_slider();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;
	var e_touch_start, e_touch_move, e_touch_end;
	if ('ontouchstart' in document.documentElement) {
		e_touch_start = "touchstart";
		e_touch_move = "touchmove";
		e_touch_end = "touchend";
	}
	else {
		e_touch_start = "mousedown";
		e_touch_move = "mousemove";
		e_touch_end = "mouseup";
	}

	//== UI Class
	var ax_class = function() {
		// 클래스 생성자
		this.main = (function() {
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				effect: "",
				autoSlide: false,
				slideSpeed: 300,
				touchMove: false,
				targetHeightRatio: 0
			};
		}).apply(this, arguments);

		this.target = null;
		var _this = this;
		var cfg = this.config;
		var touch_start = {}, touch_end = {};
		this.display_index = 0;

		this.get_mouse = function(e) {
			var mouse = {};
			if ('touches' in e && e.touches[0]) {
				mouse.x = Number(e.touches[0].pageX);
				mouse.y = Number(e.touches[0].pageY);
			}
			else {
				mouse.x = Number(e.pageX);
				mouse.y = Number(e.pageY);
			}
			return mouse;
		};

		this.init = function() {
			this.target = ax5.dom(cfg.target);

			// 파트수집
			this.els = {
				holder: this.target.find(".slider-holder"),
				items: this.target.find(".slider-item")
			};

			this._set_size_frame();
			this.bind_window_resize(function() {
				this._set_size_frame();
			});
			/*
			 setTimeout(function(){
			 _this._set_size_frame();
			 }, 500);
			 */

			this.target.on(e_touch_start, function(e) {
				_this._on_touch_start(e||window.event);
			});
		};

		this._set_size_frame = function() {
			this.els.items.css({width: this.target.width(), "float": "left"});
			this.els.holder.css({width: this.target.find(".slider-item").elements.length * this.target.width()});

			this.item_width = this.target.width();
			this.holder_width = this.target.find(".slider-item").elements.length * this.target.width();
		};

		this._on_touch_start = function(e) {
			touch_start = {
				mouse: _this.get_mouse(e),
				time: (new Date()).getTime(),
				position: this.els.holder.position()
			};

			this.els.holder.class_name("remove", "touch-end");

			axd(document.body).on(e_touch_move + ".ax5divslider", function(e) {
				_this._on_touch_move(e||window.event);
			});
			axd(document.body).on(e_touch_end + ".ax5divslider", function(e) {
				_this._on_touch_end(e||window.event);
			});
			axd(document.body).on("mouseout.ax5divslider", function(e) {
				_this._on_touch_end(e||window.event);
			});
			axd(document.body).attr({"onselectstart": "return false;"});

			if(cfg.on_event){
				var that = {
					display_index : this.display_index,
					action: "touch_start"
				};
				cfg.on_event.call(that, that);
			}
		};

		this._on_touch_move = function(e) {
			var mouse = _this.get_mouse(e);
			var new_left = Number(touch_start.position.left) - (touch_start.mouse.x - mouse.x);
			if(new_left > 0) new_left = 0;
			else if(new_left < -(this.holder_width - this.item_width) ){ new_left = -(this.holder_width - this.item_width); }
			this.els.holder.css({left: new_left});

			touch_start.time = (new Date()).getTime();
			touch_start.new_left = new_left;

			// 터치 방향 판단 하여 수평일 때만 이벤트 중지
			if(!touch_start.direction){
				touch_start.direction = (Math.abs((touch_start.mouse.x - mouse.x)) > Math.abs((touch_start.mouse.y - mouse.y))) ? "X" : "Y";
			}
			if(touch_start.direction == "X") {
				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
			}
		};

		this._on_touch_end = function(e) {

			touch_end = {
				mouse: _this.get_mouse(e),
				time: (new Date()).getTime()
			};

			var du_time = touch_end.time - touch_start.time, extra_move = 0, new_left = touch_start.new_left, move_left = 0, display_index;
			if( du_time < 120 && Math.abs((touch_start.mouse.x - touch_end.mouse.x)) > 5 ){
				if((touch_start.mouse.x - touch_end.mouse.x) < 0) {
					if(this.display_index > 0) {
						new_left = -(this.item_width * (this.display_index - 1));
					}
				}
				else{
					if(this.display_index < this.els.items.elements.length-1){
						new_left = -(this.item_width * (this.display_index + 1));
					}
				}
			}

			display_index = U.number(new_left / this.item_width, {round:true, abs:true});

			this.els.holder.css({left: -(this.item_width * display_index) }).class_name("add", "touch-end");
			if(cfg.on_event){
				if(this.display_index != display_index) {
					var that = {
						display_index: display_index,
						action: "status_change"
					};
					cfg.on_event.call(that, that);
				}
				else{
					if(cfg.on_event){
						var that = {
							display_index : this.display_index,
							action: "touch_end"
						};
						cfg.on_event.call(that, that);
					}
				}
			}

			// update display_index
			this.display_index = display_index;

			axd(document.body).off(e_touch_move + ".ax5divslider");
			axd(document.body).off(e_touch_end + ".ax5divslider");
			axd(document.body).off("mouseout.ax5divslider");
			axd(document.body).attr({"onselectstart": null});

			if (e.preventDefault) e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();
			e.cancelBubble = true;
		};

		this.prev = function(){
			if(this.display_index <= 0){
				return this;
			}
			this.display_index--;
			this.els.holder.css({left: -(this.item_width * this.display_index) }).class_name("add", "touch-end");
			if(cfg.on_event){
				var that = {
					display_index : this.display_index,
					action: "status_change"
				};
				cfg.on_event.call(that, that);
			}
		};

		this.next = function(){
			if(this.display_index >= this.els.items.elements.length-1){
				return this;
			}
			this.display_index++;
			this.els.holder.css({left: -(this.item_width * this.display_index) }).class_name("add", "touch-end");
			if(cfg.on_event){
				var that = {
					display_index : this.display_index,
					action: "status_change"
				};
				cfg.on_event.call(that, that);
			}
		};


	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.div_slider = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_div_slider", [], function() { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);

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

// ax5.ui.mask
(function(root, ax_super) {
	/**
	 * @class ax5.ui.mask
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-04-01 tom : 시작
	 * @example
	 * ```
	 * var my_mask = new ax5.ui.mask();
	 * ```
	 */
	var U = ax5.util, axd = ax5.dom;

	var ax_class = function () {
		var self = this;

		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				theme: '',
				target: axd.get(document.body)[0]
			};
			this.mask_content = '';
			this.status = "off";

		}).apply(this, arguments);

		/**
		 * Preferences of Mask UI
		 * @method ax5.ui.mask.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.mask}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // 마스크 처리할 대상
		 *      content : {String}, // 마스크안에 들어가는 내용물
		 *      onchange: function(){} // 마스크 상태변경 시 호출되는 함수 this.type으로 예외처리 가능
		 * }
		 * ```
		 */
		//== class body start
		this.init = function(){
			// after set_config();
			if(this.config.content) this.set_body(this.config.content);
		};

		this.set_body = function(content){
			this.mask_content = content;
		};

		this.get_body = function(){
			return this.mask_content;
		};

		/**
		 * open mask
		 * @method ax5.ui.mask.open
		 * @param {Object} config
		 * @returns {ax5.ui.mask}
		 * @example
		 * ```js
		 * my_mask.open({
		 *     target: document.body,
		 *     content: "<h1>Loading..</h1>",
		 *     onchange: function () {
		 *
		 *     }
		 * });
		 *
		 * my_mask.open({
		 *     target: ax5.dom.get("#mask-target"),
		 *     content: "<h1>Loading..</h1>",
		 *     onchange: function () {
		 *
		 *     }
		 * });
		 * ```
		 */
		this.open = function(config){
			// todo : z-index 옵션으로 지정가능 하도록 변경
			if(this.status === "on") this.close();
			if(config && config.content) this.set_body(config.content);
			self.mask_config = {};
			U.extend(self.mask_config, this.config, true);
			U.extend(self.mask_config, config, true);

			var cfg = self.mask_config,
				target = axd.get(cfg.target)[0],
				po = [], css, mask_id = 'ax-mask-'+ ax5.get_guid(), _mask, css = {},
				that = {};

			po.push('<div class="ax-mask ' + cfg.theme  + '" id="'+ mask_id +'">');
				po.push('<div class="ax-mask-bg"></div>');
				po.push('<div class="ax-mask-content">');
					po.push('<div class="ax-mask-body">');
						po.push(self.get_body());
					po.push('</div>');
				po.push('</div>');
			po.push('</div>');

			if(target == document.body){
				axd.append(target, po.join(''));
			}else{
				axd.append(document.body, po.join(''));
				var box_model = axd.box_model(target);
				css = {
					position:"absolute",
					left: box_model.offset.left,
					top: box_model.offset.top,
				    width: box_model.width,
					height: box_model.height
				};
				axd.class_name(target, "add", "ax-masking");
			}
			this._mask = _mask = axd.get("#"+mask_id);
			this.target = target;
			this.status = "on";
			axd.css(_mask, css);

			if(cfg.onchange) {
				that = {
					type: "open"
				};
				cfg.onchange.call(that, that);
			}
			return this;
		};

		/**
		 * close mask
		 * @method ax5.ui.mask.close
		 * @returns {ax5.ui.mask}
		 * @example
		 * ```
		 * my_mask.close();
		 * ```
		 */
		this.close = function(){
			var cfg = this.mask_config;
			axd.remove(this._mask);
			axd.class_name(this.target, "remove", "ax-masking");
			if(cfg.onchange) {
				that = {
					type: "close"
				};
				cfg.onchange.call(that, that);
			}
			return this;
		};
		//== class body end
	};


	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.mask = ax_class; // ax5.ui에 연결
	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_mask", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);

// ax5.ui.menu
(function(root, ax_super) {
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
	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				keys: {
					value:"value",
					text:"text",
					shortcut:"shortcut",
					data:"data",
					menu:"menu"
				}
			};

		}).apply(this, arguments);

		this.target = null;
		var cfg = this.config;
		/**
		 * Preferences of Menu UI
		 * @method ax5.ui.menu.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.menu}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // 메뉴 UI를 출력할 대상
		 *      keys : { // keys 는 menu ui 내부에서 사용되는 키값을 사용자가 변경 할 수 있는 환경설정값 이다. 개발환경에 맞게 커스트마이징 할 수 있다.
		 *          value: {String} ['value'] 메뉴의 값
		 *          text: {String} ['text'] 메뉴의 텍스트 라벨
		 *          shotcut: {String} ['shotcut'] 메뉴의 단축키
		 *          data: {String} ['data'],
		 *          menu: {String} ['menu'] 메뉴키 - 자식아이템도 이 키 값으로 인식한다.
		 *      },
		 *      menu : {Array} menu item
		 *      onclick: {Function} [onclick] - 메뉴 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target || !cfg.menu){
				U.error("aui_menu_400", "[ax5.ui.menu] config.target, config.menu is required");
			}
			this.target = ax5.dom(cfg.target);
			this.print_list();
		};

		this.print_list = function(){
			var
				po = [],
				get_child_menu_html = function(_po_, _menu_, _depth_){
					_po_.push('<ul class="ax-item-group ax-item-group-depth-' + _depth_ + '">');
					for(var i= 0,l=_menu_.length;i<l;i++){
						_po_.push('<a class="ax-item" data-menu-item-index="'+ i +'">');
						_po_.push(_menu_[i][cfg.keys.text]);
						_po_.push('</a>');
						if(_menu_[i][cfg.keys.menu] && _menu_[i][cfg.keys.menu].length > 0){
							get_child_menu_html(_po_, _menu_[i][cfg.keys.menu], _depth_+1);
						}
					}
					_po_.push('</ul>');
				};

			get_child_menu_html(po, cfg[cfg.keys.menu], 0);

			this.target.html( po.join('') );
			this.target.find('[data-menu-item-index]').on("click", (function(e){
				this.onclick(e||window.event);
			}).bind(this));
		};

		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-menu-item-index")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-menu-item-index");
				if(this.config.onclick){
					this.config.onclick.call({
						menu: this.config[cfg.keys.menu],
						item: this.config[cfg.keys.menu][index],
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
	root.menu = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_menu", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);

// ax5.ui.modal
(function(root, ax_super) {

	/**
	 * @class ax5.ui.modal
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-23 tom : 시작
	 * @example
	 * ```
	 * var my_modal = new ax5.ui.modal();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				mask: {
					target: document.body,
					content: ''
				},
				theme: 'default',
				width: 300,
				height: 400,
				title: '',
				heading: {
					height: 30
				},
				esc_close: true
			};
		}).apply(this, arguments);

		this.active_modal = null;
		this.els = {};
		this.mask = new ax5.ui.mask();

		var cfg = this.config;
		/**
		 * Preferences of modal UI
		 * @method ax5.ui.modal.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.modal}
		 * @example
		 * ```
		 * ```
		 */
			//== class body start
		this.init = function(){
			cfg.id = 'ax5-modal-' + ax5.get_guid();
			this.mask.set_config(cfg.mask);
		};


		this.get_content = function(modal_id, opts){
			var
				po = [];

			po.push('<div id="' + modal_id + '" data-modal-els="root" class="ax5-ui-modal ' + opts.theme + '">');
				po.push('<div class="ax-modal-heading" data-modal-els="heading" style="height:' + cfg.heading.height + 'px;line-height:' + cfg.heading.height + 'px;">');
				po.push( (opts.title || cfg.title || "") );
				po.push('</div>');
				po.push('<div class="ax-modal-body" data-modal-els="body">');
				if(opts.http) {
					po.push('<iframe name="' + modal_id + '-frame" src="" width="100%" height="100%" frameborder="0" data-modal-els="iframe"></iframe>');
					po.push('<form name="' + modal_id + '-form" data-modal-els="iframe-form">');
					po.push('<input type="hidden" name="modal_id" value="' + modal_id + '" />');
					for (var p in opts.http.param) {
						po.push('<input type="hidden" name="' + p + '" value="' + opts.http.param[p] + '" />');
					}
					po.push('</form>');
				}
				po.push('</div>');

			po.push('</div>');
			return po.join('');
		};

		this.open = function(opts){
			var
				pos = {},
				box = {},
				po;

			opts.id = (opts.id || cfg.id);

			this.mask.open();

			box = {
				width: opts.width || cfg.width,
				height: opts.height || cfg.height
			};
			axd.append(document.body, this.get_content(opts.id, opts));

			this.active_modal = ax5.dom('#' + opts.id);
			// 파트수집
			this.els = {
				"root"   : this.active_modal.find('[data-modal-els="root"]'),
				"heading": this.active_modal.find('[data-modal-els="heading"]'),
				"body"   : this.active_modal.find('[data-modal-els="body"]')
			};

			if(opts.http) {
				this.els["iframe"] = this.active_modal.find('[data-modal-els="iframe"]');
				this.els["iframe-form"] =  this.active_modal.find('[data-modal-els="iframe-form"]');
			}

			//- position 정렬
			if(typeof opts.position === "undefined" || opts.position === "center"){
				box.top = ax5.dom.height(document.body) / 2 - box.height/2;
				box.left = ax5.dom.width(document.body) / 2 - box.width/2;
			}else{
				box.left = opts.position.left || 0;
				box.top = opts.position.top || 0;
			}
			this.active_modal.css(box);

			if(opts.http) {
				this.els["iframe"].css({height: box.height - cfg.heading.height});

				// iframe content load
				this.els["iframe-form"].attr({"method": opts.http.method});
				this.els["iframe-form"].attr({"target": opts.id + "-frame"});
				this.els["iframe-form"].attr({"action": opts.http.url});
				this.els["iframe"].on("load", (function () {
					if (opts.onload) opts.onload.call(opts); else if (cfg.onload) cfg.onload.call(opts);
				}).bind(this));
				this.els["iframe-form"].elements[0].submit();
			}
			else{
				var that = {
					id: opts.id,
					theme: opts.theme,
					width: opts.width,
					height: opts.height
				};
				U.extend(that, this.els);
				if (opts.onload) opts.onload.call(that); else if (cfg.onload) cfg.onload.call(that);
			}

			// bind key event
			if(cfg.esc_close) {
				axd(window).on("keydown.ax-modal", (function (e) {
					this.onkeyup(e || window.event, opts);
				}).bind(this));
			}
		};
		
		this.onkeyup = function(e, opts, target, k){
			if(e.keyCode == ax5.info.event_keys.ESC){
				this.close();
				if(opts.onclose) opts.onclose.call(opts);
				else if(cfg.onclose) cfg.onclose.call(opts);
			}
		};

		/**
		 * close the modal
		 * @method ax5.ui.modal.close
		 * @returns {ax5.ui.modal}
		 * @example
		 * ```
		 * my_modal.close();
		 * ```
		 */
		this.close = function(){
			if(this.active_modal){
				this.active_modal.remove();
				this.mask.close();
				this.active_modal = null;
				axd(window).off("keydown.ax-modal");
			}
			return this;
		}
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.modal = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_modal", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);


// todo : confirm 기능 구현 alert에 btns만 확장 하면 끄읏
// todo : prompt
// todo : toast

// ax5.ui.progress
(function(root, ax_super) {
	/**
	 * @class ax5.ui.progress
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-23 tom : 시작
	 * @example
	 * ```
	 * var my_progress = new ax5.ui.progress();
	 * ```
	 */
	var U = ax5.util, axd = ax5.dom;
	
	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: (('ontouchstart' in document.documentElement) ? "touchstart" : "click")
			};
		}).apply(this, arguments);

		this.queue = {};
		var cfg = this.config;
		/**
		 * Preferences of progress UI
		 * @method ax5.ui.progress.start
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.progress}
		 * @example
		 * ```
		 * start({
		 *      target : {Element|AX5 nodelist}, // UI를 출력할 대상
		 * });
		 * ```
		 */
			//== class body start
		this.start = function(opts){
			if(!opts.target || !opts.id){
				U.error("aui_progress_400", "[ax5.ui.progress] target, id is required");
				return;
			}

			var queue_id = opts.id,
			    q, q_cfg;
			this.queue[queue_id] = {id:opts.id, config: opts};
			q = this.queue[queue_id];
			q_cfg = q.config;
			q_cfg.target = ax5.dom(q_cfg.target);
			q_cfg.target.html( this.get_frame(q.config.theme) );

			// 파트수집
			q.els = {
				"root": q_cfg.target.find('[data-progress-els="root"]'),
				"bar": q_cfg.target.find('[data-progress-els="bar"]'),
				"status": q_cfg.target.find('[data-progress-els="status"]')
			};

			return this;
		};

		this.set_progress = function(id, idx, status){
			var q = this.queue[id], _idx = idx,
				percent;
			if(status) _idx + 1;
			q.status = status;
			q.progress_index = idx;

			percent = U.number(_idx/q.config.list.length*100, {round:0});

			q.els["status"].html( percent + '% ' + _idx + '/' + q.config.list.length );
			q.els["bar"].css({width:percent+'%'});

			if(_idx >= q.config.list.length){
				if(q.config.onend) q.config.onend.call({id:id});
			}
			else if(!status && !q.hold){
				if(q.config.onprogress) q.config.onprogress.call({id:id, list:q.config.list, item:q.config.list[idx], idx:idx});
			}
		};

		this.progress = function(opts){
			if(typeof opts.id === "undefined") {
				U.error("id가 필요합니다.");
				return;
			}
			var
				id = opts.id,
				q = this.queue[id];

			q.hold = false;

			if(typeof q.progress_index === "undefined"){
				q.progress_index = 0;
				this.set_progress(id, q.progress_index, false);
			}
			else {
				this.set_progress(id, q.progress_index, true);
				setTimeout((function(){
					this.set_progress(id, q.progress_index+1, false);
				}).bind(this), q.config.progress_time);
			}

		};

		this.hold = function(id){
			if(typeof opts.id === "undefined") {
				U.error("id가 필요합니다.")
				return;
			}
			var
				id = opts.id,
				q = this.queue[id];

			q.hold = true;
		};

		this.clear = function(opts){
			if(typeof opts.id === "undefined") {
				U.error("id가 필요합니다.");
				return;
			}
			var
				id = opts.id,
				q = this.queue[id];
			if(!q) return this;

			q.hold = false;

			q.status = status;
			q.progress_index = 0;

			q.els["status"].html( '0% ' );
			q.els["bar"].css({width:'0%'});

		};
		
		this.get_frame = function(theme){
			var
				po = [], i = 0;
			
			po.push('<div class="ax5-ui-progress ' + (theme||"") + '" data-progress-els="root">');
				po.push('<div class="progress-bar" data-progress-els="bar" style="width:0%;">');
					po.push('<span class="progress-status" data-progress-els="status">0%</span>');
				po.push('</div>');
			po.push('</div>');

			return po.join('');
		};

		// byte load
		this.set_loaded_byte = function(opts){
			if(typeof opts.id === "undefined") {
				U.error("id가 필요합니다.");
				return;
			}
			
			var
				id = opts.id,
				q = this.queue[id],
				percent;

			percent = U.number(opts.byte / q.config.total_byte * 100, {round:0});
			q.els["status"].html( percent + '% ' + U.number(opts.byte, {byte:true}) + '/' + U.number(q.config.total_byte, {byte:true}) );
			q.els["bar"].css( {width:percent+'%'} );
		}

	};
	//== UI Class
	
	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.progress = ax_class; // ax5.ui에 연결
	
	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_progress", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문
	
})(ax5.ui, ax5.ui.root);

// ax5.ui.segment
(function(root, ax_super) {

	/**
	 * @class ax5.ui.segment
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2015-09-11 tom : 시작
	 * @example
	 * ```
	 * var my_segment = new ax5.ui.segment();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function() {
		// 클래스 생성자
		this.main = (function() {
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				theme: 'default'
			};
		}).apply(this, arguments);

		this.target = null;
		var _this = this;
		var cfg = this.config;

		/**
		 * Preferences of segment UI
		 * @method ax5.ui.segment.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.segment}
		 * @example
		 * ```
		 * ```
		 */
			//== class body start
		this.init = function() {
			if (!cfg.target) U.error("aui_segment_400", "[ax5.ui.segment] config.target is required");

			this.target = ax5.dom(cfg.target);

			// 프레임 생성
			this.target.after(this._get_frame(this.target.elt().id));

			// 파트수집
			this.els = {
				"root": axd('[data-segment-origin-id="' + this.target.elt().id + '"]')
			};

			this._set_size_frame();
			this.bind_window_resize(function(){
				this._set_size_frame();
			});
			setTimeout(function(){
				_this._set_size_frame();
			}, 500);

			this.set_value(this.target.val());

			this.target.on("change", function(){
				_this.set_value(_this.target.val());
			});
			this.els["root"].find('[data-segment-item-index]').on("click", function(e){
				_this._onclick(e||window.event);
			});
		};
		
		this._onclick = function(e, target, index, that){
			target = axd.parent(e.target, function(target){
				if(axd.attr(target, "data-segment-item-index")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-segment-item-index");

				var item = cfg.list[index];
				_this.target.val(item.value);
				_this.target.dispatch_event("change");

				that = {
					list: cfg.list,
					index: index,
					target: this.target.elements[0]
				};
				if(cfg.onclick){
					cfg.onclick.call(that);
				}
			}
		};
		
		this._set_size_frame = function(){
			this.els["root"].css({
				top:0, left:0,
				width: this.target.width(),
				height: this.target.height()
			});
		};

		this._get_frame = function(origin_id) {

			ax5.dom('[data-segment-origin-id="' + origin_id + '"]').remove();

			// 그리드 레이아웃 구성
			var po = [];
			po.push('<div class="ax5-ui-segment-group ' + cfg.theme + '" data-segment-els="root" data-segment-origin-id="' + origin_id + '">');

			po.push('<table cellpadding="0" cellspacing="0" style="height:100%;">');
			po.push('<tbody>');

			po.push('<tr>');

			for (var i = 0, l = cfg.list.length, item; i < l; i++) {
				item = cfg.list[i];
				po.push('<td>');
				po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (item.klass || "") + '" data-segment-item-index="' + i + '" ' +
					(function(){
						if(i == 0){
							return 'data-segment-item-first="1"'
						}
						else if(i == cfg.list.length-1){
							return 'data-segment-item-last="1"'
						}
					})() +
				'>' + (item.text || "") + '</buttton></div>');
				po.push('</td>');
			}

			po.push('</tr>');

			po.push('</tbody>');
			po.push('</table>');

			po.push('</div>');

			return po.join('');
		};

		this.set_value = function(val){
			var selected_item, selected_index;

			this.els["root"].find('[data-segment-item-index]').class_name("remove", "on");

			for (var i = 0, l = cfg.list.length, item; i < l; i++) {
				item = cfg.list[i];
				if(item.value == val){
					selected_item = item;
					selected_index = i;
				}
			}
			if(selected_item){
				this.els["root"].find('[data-segment-item-index="'+selected_index+'"]').class_name("add", "on");
			}
		}
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.segment = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_segment", [], function() { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);

// ax5.ui.toast
(function(root, ax_super) {

	/**
	 * @class ax5.ui.toast
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-17 tom : 시작
	 * @example
	 * ```
	 * var my_toast = new ax5.ui.toast();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function(){
		// 클래스 생성자
		this.main = (function(){
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				click_event_name: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				theme: 'default',
				width: 300,
				axicon: '<i class="axi axi-axisj"></i>',
				msg: '',
				display_time: 3000,
				animate_time: 200
			};
		}).apply(this, arguments);

		this.toast_container = null;
		this.queue = [];

		var cfg = this.config;
		/**
		 * Preferences of toast UI
		 * @method ax5.ui.toast.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * ```
		 */
		//== class body start
		this.init = function(){
			// after set_config();
			var container_id = ax5.get_guid();
			axd.append(document.body, '<div class="ax5-ui-toast-container" data-toast-container="' +
				'' + container_id + '"></div>');
			this.toast_container = ax5.dom('[data-toast-container="' + container_id + '"]');
		};

		/**
		 * open the toast of alert type
		 * @method ax5.ui.toast.alert
		 * @param {Object|String} [{theme, axicon, msg, btns}|msg] - toast 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * my_toast.alert({
		 *  title: '<i class="axi axi-axisj"></i>',
		 *  msg: 'alert'
		 * }, function(){});
		 * ```
		 */
		this.push = function(opts, callback) {
			if(U.is_string(opts)){
				opts = {
					title: cfg.title,
					msg: opts
				}
			}
			opts.toast_type = "push";
			opts.theme = (opts.theme || cfg.theme || "");
			this.open(opts, callback);
			return this;
		};

		/**
		 * open the toast of confirm type
		 * @method ax5.ui.toast.confirm
		 * @param {Object|String} [{theme, axicon, msg, btns}|msg] - toast 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * my_toast.confirm({
		 *  axicon: '<i class="axi axi-axisj"></i>',
		 *  msg: 'confirm'
		 * }, function(){});
		 * ```
		 */
		this.confirm = function(opts, callback) {
			if(U.is_string(opts)){
				opts = {
					title: cfg.title,
					msg: opts
				}
			}
			opts.toast_type = "confirm";
			opts.theme = (opts.theme || cfg.theme || "");
			if(typeof opts.btns === "undefined"){
				opts.btns = {
					ok: {label: 'ok', theme: opts.theme}
				};
			}
			this.open(opts, callback);
			return this;
		};

		this.get_content = function(toast_id, opts){
			var po = [];
			po.push('<div id="' + toast_id + '" data-ax5-ui="toast" class="ax5-ui-toast ' + opts.theme + '">');
				po.push('<div class="ax-toast-axicon">');
					po.push( (opts.axicon || cfg.axicon || "") );
				po.push('</div>');
				po.push('<div class="ax-toast-body">');
					po.push( (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>") );
				po.push('</div>');
				if(opts.btns) {
					po.push('<div class="ax-toast-buttons">');
						po.push('<div class="ax-button-wrap">');
							U.each(opts.btns, function (k, v) {
								po.push('<button type="button" data-ax-toast-btn="' + k + '" class="ax-btn ' + this.theme + '">' + this.label + '</button>');
							});
						po.push('</div>');
					po.push('</div>');
				}

				po.push('<div style="clear:both;"></div>');
			po.push('</div>');
			return po.join('');
		};

		this.open = function(opts, callback){
			var
				toast_box,
				box = {},
				po;

			opts.id = 'ax5-toast-' + this.queue.length;
			this.queue.push(opts);
			box = {
				width: opts.width || cfg.width
			};
			this.toast_container.prepend( this.get_content(opts.id, opts) );
			toast_box = ax5.dom('#' + opts.id);
			toast_box.css({width: box.width});

			if(opts.toast_type === "push"){
				// 자동 제거 타이머 시작
				setTimeout((function(){
					this.close(opts, toast_box, callback);
				}).bind(this), cfg.display_time);
			}
			else
			if(opts.toast_type === "confirm"){
				toast_box.find("[data-ax-toast-btn]").on(cfg.click_event_name, (function(e){
					this.btn_onclick(e||window.event, opts, toast_box, callback);
				}).bind(this));
			}
		};

		this.btn_onclick = function(e, opts, toast_box, callback, target, k){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-ax-toast-btn")){
					return true;
				}
			});
			if(target){
				k = axd.attr(target, "data-ax-toast-btn");
				var that = {
						key: k, value: opts.btns[k],
						toast_id: opts.id,
						btn_target: target
					};

				if(opts.btns[k].onclick){
					opts.btns[k].onclick.call(that, k);
				}
				else
				if(opts.toast_type === "confirm"){
					if(callback) callback.call(that, k);
					this.close(opts, toast_box);
				}
			}
		};

		// todo : confirm 타입 토스트일 때 키보드 이벤트 추가 할 수 있음.
		this.onkeyup = function(e, opts, callback, target, k){
			if(e.keyCode == ax5.info.event_keys.ESC){
				this.close();
			}
		};

		/**
		 * close the toast
		 * @method ax5.ui.toast.close
		 * @returns {ax5.ui.toast}
		 * @example
		 * ```
		 * my_toast.close();
		 * ```
		 */
		this.close = function(opts, toast_box, callback){
			if(typeof toast_box === "undefined") {
				opts = U.last(this.queue);
				toast_box = ax5.dom('#' + opts.id);
			}
			var that = {
				toast_id: opts.id
			};

			toast_box.class_name("add", (opts.toast_type == "push") ? "removed" : "destroy");
			this.queue = U.filter(this.queue, function () {
				return opts.id != this.id;
			});
			setTimeout(function () {
				toast_box.remove();
				if(callback) callback.call(that);
			}, cfg.animate_time);
			return this;
		}
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.toast = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_toast", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);


// todo : confirm 기능 구현 alert에 btns만 확장 하면 끄읏
// todo : prompt
// todo : toast

// ax5.ui.touch_grid
(function(root, ax_super) {

	/**
	 * @class ax5.ui.touch_grid
	 * @classdesc
	 * @version v0.0.2
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-17 tom : 시작
	 * 2014-07-04 tom : append, update, remove
	 * @example
	 * ```
	 * var my_touch_grid = new ax5.ui.touch_grid();
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
				head_height: 28,
				item_height: 28,
				col_min_width: 30,
				body: {}
			};
		}).apply(this, arguments);

		this.target = null;
		this.focused_index = -1;
		this.col_group = [];
		this.col_width_sum = 0;
		this.list = [];
		this.virtual_scroll = {};

		var cfg = this.config;

		/**
		 * Preferences of touch-grid UI
		 * @method ax5.ui.touch_grid.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.touch_grid}
		 * @example
		 * ```
		 * ```
		 */
		//== class body start
		this.init = function(){
			if(!cfg.target) U.error("aui_touch_grid_400", "[ax5.ui.touch_grid] config.target is required");

			this.target = ax5.dom(cfg.target);

			// 데이터 정리
			//console.log(cfg.col_group[1]);
			this.col_group = this._convert_col_group(cfg.col_group);
			//console.log(cfg.col_group[1]);

			// 프레임 생성
			this.target.html( this._get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find('[data-touch-grid-els="root"]'),
				"main": this.target.find('[data-touch-grid-els="main"]'),
				"main-header": this.target.find('[data-touch-grid-els="main-header"]'),
				"main-body": this.target.find('[data-touch-grid-els="main-body"]'),
				"main-body-content": this.target.find('[data-touch-grid-els="main-body-content"]')
			};

			if(cfg.control){
				this.els["control"] =  this.target.find('[data-touch-grid-els="control"]');
				this.els["control"].on("click", (function(e){
					this._oncontrol(e||window.event);
				}).bind(this));
			}

			this._set_size_frame();
			this.els["main-header"].html( this._get_header("main-header") );
			this.els["main-body-content"].html( this._get_body("main-body") );
			this.els["main-body-content-tbody"] = this.els["main-body-content"].find('[data-touch-grid-els="main-body-content-tbody"]');

			this.bind_window_resize(function(){
				this.col_group = this._convert_col_group(cfg.col_group);
				this._set_size_frame();
				this._set_size_col_group();
			});
		};

		this._get_frame = function(){
			// 그리드 레이아웃 구성
			var po = [];
			po.push('<div class="ax5-ui-touch-grid ' + cfg.theme + '" data-touch-grid-els="root">');
				po.push('<div class="touch-grid-body" data-touch-grid-els="body">');
					po.push('<div class="touch-grid-main" data-touch-grid-els="main">');
						po.push('<div class="touch-grid-main-header" data-touch-grid-els="main-header">');
						po.push('</div>');
						po.push('<div class="touch-grid-main-body" data-touch-grid-els="main-body">');
							po.push('<div class="touch-grid-content" data-touch-grid-els="main-body-content"></div>');
						po.push('</div>');
					po.push('</div>');
				po.push('</div>');
			if(cfg.control) {
				po.push('<div class="touch-grid-control" data-touch-grid-els="control" style="width:' + cfg.control.width + 'px;">');
					po.push('<table cellpadding="0" cellspacing="0" style="height:100%;">');
						po.push('<tbody>');
						if(cfg.control.first) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="first">' + cfg.control.first + '</buttton></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						if(cfg.control.prev) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="prev">' + cfg.control.prev + '</buttton></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						if(cfg.control.next) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="next">' + cfg.control.next + '</button></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						if(cfg.control.last) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="last">' + cfg.control.last + '</buttton></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						po.push('</tbody>');
					po.push('</table>');
				po.push('</div>');
			}
			po.push('</div>');
			return po.join('');
		};

		this._set_size_frame = function(){  /* resizable */
			var
				target_height = this.target.height();

			this.els["main"].css({height: target_height});
			this.els["main-header"].css({height: cfg.head_height});
			this.els["main-body"].css({height: target_height - cfg.head_height});
			if(cfg.control) {
				this.els["control"].css({height: target_height});
				var control_item = this.els["control"].find(".ax-item-wraper");
				//console.log(control_item.elements.length);
				control_item.css({height: target_height / control_item.elements.length});
			}
			this.virtual_scroll.size = Math.ceil((target_height - cfg.head_height) / cfg.item_height);
		};

		// col_group의 속성값을 정리하여 줍니다. - width등
		this._convert_col_group = function(col_group){ /* resizable */
			var
				CG = [],
				target_width = this.target.width(),
				free_width = target_width,
				free_width_col_count = 0;

			if(cfg.control) {
				free_width -= cfg.control.width;
			}

			for(var i=0, l=col_group.length;i<l;i++) CG.push(U.clone(col_group[i]));
			this.col_width_sum = 0;

			for(var i=0, l=CG.length;i<l;i++){
				if(!U.is_undefined(CG[i].width) && CG[i].width !== "*"){
					this.col_width_sum += U.number(CG[i].width);
					free_width -= U.number(CG[i].width);
				}else{
					free_width_col_count++;
				}
			}
			if(free_width_col_count > 0) {
				for (var i = 0, l = CG.length; i < l; i++) {
					if (U.is_undefined(CG[i].width) || CG[i].width === "*") {
						CG[i].width = free_width / free_width_col_count;
						if(CG[i].width < cfg.col_min_width) CG[i].width = cfg.col_min_width;
						this.col_width_sum += U.number(CG[i].width);
					}
				}
			}
			if(cfg.control) {
				this.col_width_sum -= cfg.control.width;
			}

			return CG;
		};

		this._get_col_group = function(){
			var po = [];
			po.push('<colgroup>');
			for(var i=0, l=this.col_group.length;i<l;i++){
				po.push('<col data-touch-grid-col="' + i + '"  style="width:' + this.col_group[i].width + 'px;" />');
			}
			po.push('</colgroup>');
			return po.join('');
		};

		this._set_size_col_group = function(){
			for(var i=0, l=this.col_group.length;i<l;i++) {
				this.els["main"].find('[data-touch-grid-col="' + i + '"]').css( {"width": this.col_group[i].width} );
			}

			this.els["main"].find('[data-touch-grid-table]').css( {width: this.col_width_sum} );
		};

		this._get_header = function(typ){
			var
				po = [];

			po.push('<table data-touch-grid-table="' + typ + '" style="width:' + this.col_width_sum + 'px;height:' + cfg.head_height + 'px;line-height:' + cfg.head_height + 'px;">');
				po.push( this._get_col_group() );
				po.push('<tbody>');
					po.push('<tr style="' + (
							function(){
								if(!cfg.head_align) return '';
								return 'text-align:' + cfg.head_align + ';';
							}
						)() + '">');
					for(var i=0, l=this.col_group.length;i<l;i++) {
						po.push('<td style="' + (
								function(C){
									if(cfg.head_align || !C.align) return '';
									return 'text-align:' + C.align + ';';
								}
							)(this.col_group[i]) + '">' + this.col_group[i].label + '</td>');
					}
					po.push('</tr>');
				po.push('</tbody>');
			po.push('</table>');
			return po.join('');
		};

		this._get_body = function(typ){
			var
				po = [];
				po.push('<table data-touch-grid-table="' + typ + '" style="width:' + this.col_width_sum + 'px;">');
				po.push( this._get_col_group() );
				po.push('<tbody data-touch-grid-els="main-body-content-tbody"></tbody>');
				po.push('</table>');

			return po.join('');
		};

		this._get_list = function(typ){
			var
				po = [],
				end_index = this.virtual_scroll.end_index;

				for (var r = this.virtual_scroll.start_index, len = ((end_index > this.list.length) ? this.list.length : end_index), item; r < len; r++) {
					item = this.list[r];
					po.push('<tr data-touch-grid-item-row="' + r + '" style="height:' + cfg.item_height + 'px;">');
					for(var i=0, l=this.col_group.length;i<l;i++) {
						po.push('<td style="' + (
								function(C){
									if(!C.align) return '';
									return 'text-align:' + C.align + ';';
								}
							)(this.col_group[i]) + '">' + this._get_col_value(item, this.col_group, r, i) + '</td>');
					}
					po.push('</tr>');
				}

			return po.join('');
		};

		this._get_col_value = function(item, CG, r, ci){
			if(U.is_function(CG[ci].formatter)){
				var that = {
					index: r,
					list: this.list,
					item: item,
					col_group: CG,
					key: CG[ci].key,
					col_index: ci,
					value: item[CG[ci].key]
				};
				return CG[ci].formatter.call(that) || "";
			}
			else if(CG[ci].formatter === "money"){
				return U.number(item[CG[ci].key]||0, {money:true});
			}
			else {
				return item[CG[ci].key]||"";
			}
		};

		this._content_scroll = function(top){
			if(typeof top === "undefined"){
				top = U.number(this.els["main-body-content"].position().top, {abs:true});
			}
			else{
				this.els["main-body-content"].css({top: -top });
			}

			this.virtual_scroll.start_index = Math.floor(top / cfg.item_height);
			this.virtual_scroll.end_index = U.number(this.virtual_scroll.start_index) + U.number(this.virtual_scroll.size);

			this.els["main-body-content"].css({'padding-top': this.virtual_scroll.start_index * cfg.item_height });
			this.els["main-body-content-tbody"].html( this._get_list("main-body") );

			this.els["main-body-content"].find('[data-touch-grid-item-row="'+ this.focused_index +'"]').class_name("add", "focus");

			this.els["main-body-content-tbody"].off("click");
			this.els["main-body-content-tbody"].on("click", (function(e){
				this._onclick(e||window.event);
			}).bind(this));
		};

		this._onclick = function(e, target, index, that){
			target = axd.parent(e.target, function(target){
				if(axd.attr(target, "data-touch-grid-item-row")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-touch-grid-item-row");

				this.focus(index);

				that = {
					list: this.list,
					item: this.list[index],
					index: index,
					target: this.target.elements[0],
					item_target: this.els["main-body-content"].find('[data-touch-grid-item-row="'+ index +'"]')
				};
				if(cfg.body.onclick){
					cfg.body.onclick.call(that);
				}
			}
		};

		this._oncontrol = function(e, target, index, that){
			target = axd.parent(e.target, function(target){
				if(axd.attr(target, "data-touch-grid-control")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-touch-grid-control");
				that = {
					control: index,
					target: this.target.elements[0],
					item_target: target
				};

				if(index == "first"){
					this.focus(0);
				}
				else if(index == "prev"){
					this.focus(-1, "by");
				}
				else if(index == "next"){
					this.focus(1, "by");
				}
				else if(index == "last"){
					this.focus("last");
				}
				if(cfg.control.onclick){
					cfg.control.onclick.call(that);
				}
			}
		};

		/**
		 * 그리드에 아이템을 정의합니다.
		 * @method ax5.ui.touch_grid.set_list
		 * @param {Array} list -
		 * @returns {ax5.ui.touch_grid}
		 * @example
		 * ```js
		 * my_grid.set_list([{no:1, name:'ax5'}]);
		 * ```
		 */
		this.set_list = function(list){
			this.list = list;
			this.focused_index = 0;
			this._content_scroll(0);
			return this;
		};

		/**
		 * 그리드안에 아이템을 모두 제거합니다.
		 */
		this.clear = function(){
			this.list = [];
			this.focused_index = -1;
			this._content_scroll(0);
			return this;
		};

		this.append = function(item){
			this.list.push(item);
			this.focused_index = 0;
			this._content_scroll();
			this.focus('last');
			return this;
		};

		this.update = function(index, json){
			if(typeof index !== "undefined" && this.list[index]){
				for(var k in json){
					this.list[index][k] = json[k];
				}
				this._content_scroll();
				this.focus(index);
			}
			return this;
		};

		this.remove = function(index){
			if(typeof index === "undefined"){
				index = this.list.length-1;
			}
			if(this.list[index]){
				this.list.splice(index, 1);
			}
			else{
				return this;
			}

			if(index == this.focused_index){
				if(index == 0) this.focused_index = 0;
				else if(this.list.length == 1) this.focused_index = 0;
				else {
					this.focused_index -= 1;
				}
			}

			var focused_item_top, body_content_top, body_height, view_position_top;
			focused_item_top = this.focused_index * cfg.item_height,
				body_content_top = this.els["main-body-content"].position().top,
				body_height = this.els["main-body"].height(),
				view_position_top = focused_item_top + body_content_top;

			if( (view_position_top + cfg.item_height) > body_height ) {
				this._content_scroll(-(body_height - (focused_item_top + cfg.item_height)));
			}
			else if( view_position_top < 0 ){
				this._content_scroll( focused_item_top );
			}
			else{
				this._content_scroll();
			}
			return this;
		};

		this.focus = function(index, by){
			if(this.focused_index > -1){
				// remove focus
				this.els["main-body-content"].find('[data-touch-grid-item-row="'+ this.focused_index +'"]').class_name("remove", "focus");
			}

			if(index == "last"){
				index = this.list.length-1;
			}
			else if(typeof by !== "undefined"){
				if(this.focused_index == -1) return;
				index = this.focused_index + index;
			}

			index = U.number(index);
			if(index < 0) index = 0;
			if(index >= this.list.length) index = this.list.length-1;
			this.focused_index = index;

			var focused_item_top, body_content_top, body_height, view_position_top;

			focused_item_top = index * cfg.item_height,
				body_content_top = this.els["main-body-content"].position().top,
				body_height = this.els["main-body"].height(),
				view_position_top = focused_item_top + body_content_top;

			if( (view_position_top + cfg.item_height) > body_height ){
				this._content_scroll( -(body_height - (focused_item_top + cfg.item_height)) );
			}
			else if( view_position_top < 0 ){
				this._content_scroll( focused_item_top );
			}
			else{
				this.els["main-body-content"].find('[data-touch-grid-item-row="'+ index +'"]').class_name("add", "focus");
			}
			return this;
		};

		/**
		 * 전체 리스트나 선택된 아이템을 반환합니다.
		 * @method ax5.ui.touch_grid.get
		 * @param {String} cmd - all|selected
		 * @returns {Array|Object}
		 * @example
		 * ```js
		 * my_grid.get(); // list
		 * my_grid.get("all"); // list
		 * my_grid.get("selected"); // focused item
		 * ```
		 */
		this.get = function(cmd){
			if(typeof cmd == "undefined" || cmd == "all"){
				return this.list;
			}
			else if(cmd == "selected"){
				if(this.focused_index == -1) return {};
				return {index:this.focused_index, item:this.list[this.focused_index]};
			}
		};


	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.touch_grid = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_touch_grid", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);