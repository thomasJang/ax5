(function (root, ax_super) {

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
	var ax_class = function () {
		// 클래스 생성자
		this.main = (function () {
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

		this.get_mouse = function (e) {
			var mouse = {};
			if ('changedTouches' in e) {
				mouse.x = Number(e.changedTouches[0].pageX);
				mouse.y = Number(e.changedTouches[0].pageY);
			}
			else if ('touches' in e && e.touches[0]) {
				mouse.x = Number(e.touches[0].pageX);
				mouse.y = Number(e.touches[0].pageY);
			}
			else {
				mouse.x = Number(e.pageX);
				mouse.y = Number(e.pageY);
			}
			return mouse;
		};

		this.init = function () {
			this.target = ax5.dom(cfg.target);
			this.target.css({position:"relative"});

			// 파트수집
			this.els = {
				holder: this.target.find('[data-horizontal-scroller-content]')
			};

			//this._set_size_frame();
			this.bind_window_resize(function () {
				this._set_size_frame();
			});

			setTimeout(function () {
				_this._set_size_frame();
			}, 300);

			this.target.on(e_touch_start, function (e) {
				_this._on_touch_start(e || window.event);
			});
		};

		this._set_size_frame = this.align = function () {
			var ct_width = this.target.width();
			if(ct_width > 0) {
				this.item_width = ct_width;
				this.holder_width = this.els["holder"].width();
			}
		};

		this._on_touch_start = function (e) {
			touch_start = {
				mouse: _this.get_mouse(e),
				time: (new Date()).getTime(),
				position: this.els.holder.position()
			};

			this.els.holder.class_name("remove", "touch-end");

			axd(document.body).on(e_touch_move + ".ax5hrozontalscroller", function (e) {
				_this._on_touch_move(e || window.event);
			});
			axd(document.body).on(e_touch_end + ".ax5hrozontalscroller", function (e) {
				_this._on_touch_end(e || window.event);
			});
			/*
			axd(document.body).on("mouseout.ax5hrozontalscroller", function (e) {
				_this._on_touch_end(e || window.event);
			});
			*/
			axd(document.body).attr({"onselectstart": "return false;"});

			if (cfg.on_event) {
				var that = {
					action: "touch_start"
				};
				cfg.on_event.call(that, that);
			}
		};

		this._on_touch_move = function (e) {
			var mouse = _this.get_mouse(e);
			if (!touch_start.direction) {
				var dx = Math.abs(touch_start.mouse.x - mouse.x), dy = Math.abs(touch_start.mouse.y - mouse.y) * 2;
				console.log(dx);
				touch_start.direction = (dx > 0) ? "X" : "Y";
			}

			// 터치 방향 판단 하여 수평일 때만
			if (touch_start.direction == "X") {
				//console.log(touch_start.position.left, (touch_start.mouse.x - mouse.x));
				
				var new_left = Number(touch_start.position.left) - (touch_start.mouse.x - mouse.x);
				//console.log(new_left, (this.holder_width - this.item_width));
				
				if (new_left > 0) new_left = 0;
				else if (new_left < -(this.holder_width - this.item_width)) {
					new_left = -(this.holder_width - this.item_width);
				}

				this.els.holder.css({left: new_left});

				touch_start.time = (new Date()).getTime();
				touch_start.new_left = new_left;

				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
			}else{
				axd(document.body).off(e_touch_move + ".ax5hrozontalscroller");
				axd(document.body).off(e_touch_end + ".ax5hrozontalscroller");
				//axd(document.body).off("mouseout.ax5hrozontalscroller");
				axd(document.body).attr({"onselectstart": null});
			}
		};

		this._on_touch_end = function (e) {

			touch_end = {
				mouse: _this.get_mouse(e),
				time: (new Date()).getTime()
			};

			if(touch_start.direction == "X"){
				axd(document.body).off(e_touch_move + ".ax5hrozontalscroller");
				axd(document.body).off(e_touch_end + ".ax5hrozontalscroller");
				//axd(document.body).off("mouseout.ax5hrozontalscroller");
				axd(document.body).attr({"onselectstart": null});
			}
		};

	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.horizontal_scroller = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_horizontal_scroller", [], function () {
			return ax_class;
		}); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);