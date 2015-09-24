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

			// 파트수집
			this.els = {
				holder: this.target.find(".slider-holder"),
				items: this.target.find(".slider-item"),
				dots: []
			};

			if (this.els.items.elements.length > 1 && this.els.dots.length == 0) {
				var po = [];
				po.push('<div class="slider-status">');
				po.push('<div class="dot-group">');
				for (var i = 0, l = this.els.items.elements.length; i < l; i++) {
					po.push('<div class="dot" data-item-dot="' + i + '"></div>');
				}
				po.push('<div class="on_dot" data-item-dot-on="on"></div>');
				po.push('</div>');
				po.push('</div>');
				this.target.append(po.join(''));

				for (var i = 0, l = this.target.find('[data-item-dot]').elements.length; i < l; i++) {
					this.els.dots.push(axd(this.target.find('[data-item-dot]').elements[i]));
				}
				this.els.dot_on = this.target.find('[data-item-dot-on]');
			}

			//this._set_size_frame();
			this.bind_window_resize(function () {
				this._set_size_frame();
			});

			setTimeout(function () {
				_this._set_size_frame();
			}, 300);

			if (this.els.items.elements.length > 1) {
				this.target.on(e_touch_start, function (e) {
					_this._on_touch_start(e || window.event);
				});
			}
			this.target.on("click", function (e) {
				if (cfg.on_event) {
					var that = {
						display_index: 0,
						action: "click"
					};
					cfg.on_event.call(that, that);
				}
			});
		};

		this._set_size_frame = function () {
			this.els.items.css({width: this.target.width(), "float": "left"});
			this.els.holder.css({width: this.target.find(".slider-item").elements.length * this.target.width()});

			if (this.els.items.elements.length > 1) {
				this.item_width = this.target.width();
				this.holder_width = this.target.find(".slider-item").elements.length * this.target.width();

				this.els.holder.css({left: -(this.item_width * this.display_index)});
				this._update_dot();
			}
		};

		this._update_dot = function () {
			var bx = ax5.dom.box_model(this.els.dots[this.display_index]);
			this.els.dot_on.css({left: bx.position.left + bx.margin[3]});
		};

		this._on_touch_start = function (e) {
			touch_start = {
				mouse: _this.get_mouse(e),
				time: (new Date()).getTime(),
				position: this.els.holder.position()
			};

			this.els.holder.class_name("remove", "touch-end");

			axd(document.body).on(e_touch_move + ".ax5divslider", function (e) {
				_this._on_touch_move(e || window.event);
			});
			axd(document.body).on(e_touch_end + ".ax5divslider", function (e) {
				_this._on_touch_end(e || window.event);
			});
			axd(document.body).on("mouseout.ax5divslider", function (e) {
				_this._on_touch_end(e || window.event);
			});
			axd(document.body).attr({"onselectstart": "return false;"});

			if (cfg.on_event) {
				var that = {
					display_index: this.display_index,
					action: "touch_start"
				};
				cfg.on_event.call(that, that);
			}
		};

		this._on_touch_move = function (e) {
			var mouse = _this.get_mouse(e);
			if (!touch_start.direction) {
				touch_start.direction = (Math.abs((touch_start.mouse.x - mouse.x)) > Math.abs((touch_start.mouse.y - mouse.y))) ? "X" : "Y";
			}

			// 터치 방향 판단 하여 수평일 때만
			if (touch_start.direction == "X") {
				var new_left = Number(touch_start.position.left) - (touch_start.mouse.x - mouse.x);
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
			}
		};

		this._on_touch_end = function (e) {

			touch_end = {
				mouse: _this.get_mouse(e),
				time: (new Date()).getTime()
			};

			var du_time = touch_end.time - touch_start.time, extra_move = 0, new_left = touch_start.new_left, move_left = 0, display_index;

			if (du_time < 120 && Math.abs((touch_start.mouse.x - touch_end.mouse.x)) > 5) {
				if ((touch_start.mouse.x - touch_end.mouse.x) < 0) {
					if (this.display_index > 0) {
						new_left = -(this.item_width * (this.display_index - 1));
					}
				}
				else {
					if (this.display_index < this.els.items.elements.length - 1) {
						new_left = -(this.item_width * (this.display_index + 1));
					}
				}
			}


			if (typeof new_left != "undefined") {

				display_index = U.number(new_left / this.item_width, {round: true, abs: true});
				this.els.holder.css({left: -(this.item_width * display_index)}).class_name("add", "touch-end");

				if (cfg.on_event) {
					if (this.display_index != display_index) {
						var that = {
							display_index: display_index,
							action: "status_change"
						};
						cfg.on_event.call(that, that);
					}
					else {
						if (cfg.on_event) {
							var that = {
								display_index: this.display_index,
								action: "touch_end"
							};
							cfg.on_event.call(that, that);
						}
					}
				}

				// update display_index
				this.display_index = display_index;
				this._update_dot();

				axd(document.body).off(e_touch_move + ".ax5divslider");
				axd(document.body).off(e_touch_end + ".ax5divslider");
				axd(document.body).off("mouseout.ax5divslider");
				axd(document.body).attr({"onselectstart": null});

				if (e.preventDefault) e.preventDefault();
				if (e.stopPropagation) e.stopPropagation();
				e.cancelBubble = true;
			}

		};

		this.prev = function () {
			if (this.display_index <= 0) {
				return this;
			}
			this.display_index--;
			this.els.holder.css({left: -(this.item_width * this.display_index)}).class_name("add", "touch-end");
			this._update_dot();
			if (cfg.on_event) {
				var that = {
					display_index: this.display_index,
					action: "status_change"
				};
				cfg.on_event.call(that, that);
			}
		};

		this.next = function () {
			if (this.display_index >= this.els.items.elements.length - 1) {
				return this;
			}
			this.display_index++;
			this.els.holder.css({left: -(this.item_width * this.display_index)}).class_name("add", "touch-end");
			this._update_dot();
			if (cfg.on_event) {
				var that = {
					display_index: this.display_index,
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
		define("_ax5_ui_div_slider", [], function () {
			return ax_class;
		}); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);