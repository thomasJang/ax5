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
			po.push( '<div class="ax5-ui-calendar ' + cfg.theme + '" data-calendar-els="root" style="'+ (function(){
					return (cfg.width) ? 'width:' + cfg.width + 'px;' : '';
				})() + '" onselectstart="return false;">' );
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
			var dot_date = U.date( now_date ), po = [], month_start_date = new Date( dot_date.getFullYear(), dot_date.getMonth(), 1, 12 ),
				//_today = new Date(),
				_today = cfg.display_date,
				table_start_date = (function ()
				{
					var day = month_start_date.getDay();
					if (day == 0) day = 7;
					return U.date( month_start_date, {add: {d: -day}} );
				})(), loop_date, this_month = dot_date.getMonth(), this_date = dot_date.getDate(),
				item_styles = [ 'width:' + cfg.item_width + 'px', 'height:' + cfg.item_height + 'px', 'line-height:' + (cfg.item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px' ],
				i, k;

			po.push( '<table data-calendar-table="day" cellpadding="0" cellspacing="0" style="'+ (function(){
					return (cfg.width) ? 'width:' + cfg.width + 'px;' : 'width:100%;';
				})() + '">' );
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

			var dot_date = U.date( now_date ), n_month = dot_date.getMonth(), po = [],
				item_styles = [ 'width:' + _item_width + 'px', 'height:' + _item_height + 'px', 'line-height:' + (_item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px' ], i, k, m;

			po.push( '<table data-calendar-table="month" cellpadding="0" cellspacing="0" style="'+ (function(){
					return (cfg.width) ? 'width:' + cfg.width + 'px;' : 'width:100%;';
				})() + '">' );
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

			var dot_date = U.date( now_date ), n_year = dot_date.getFullYear(), po = [],
				item_styles = [ 'width:' + _item_width + 'px', 'height:' + _item_height + 'px', 'line-height:' + (_item_height - cfg.item_padding * 2) + 'px', 'padding:' + cfg.item_padding + 'px' ], i, k, m;

			po.push( '<table data-calendar-table="year" cellpadding="0" cellspacing="0" style="'+ (function(){
					return (cfg.width) ? 'width:' + cfg.width + 'px;' : 'width:100%;';
				})() + '">' );
			po.push( '<thead>' );
			po.push( '<tr>' );

			po.push( '<td class="calendar-col-0" colspan="4">년도를 선택해주세요' );
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