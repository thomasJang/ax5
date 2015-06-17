/*
 * ax5 - v0.0.1 
 * 2015-06-17 
 * www.axisj.com Javascript UI Library
 * 
 * Copyright 2013, 2015 AXISJ.com and other contributors 
 * Released under the MIT license 
 * www.axisj.com/ax5/license 
 */

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
			U.each(opts.btns, function(k, v){
				po.push('<button type="button" data-ax-dialog-btn="' + k + '" class="ax-btn ' + this.theme + '">' + this.label + '</button>');
			});
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
			}).bind(this))
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
						item_target: target
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
						item_target: target
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
			cfg.target = ax5.dom(cfg.target);
			this.set_layout();
		};

		this.set_layout = function(){
			var cfg = this.config,
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

			cfg.target.html( po.join('') );
			cfg.target.find('[data-keypad-item-index]').on(cfg.click_event_name, (function(e){
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

			po.push('<div class="ax-mask" id="'+ mask_id +'">');
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
			cfg.target = ax5.dom(cfg.target);
			this.print_list();
		};

		this.print_list = function(){
			var cfg = this.config,
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

			cfg.target.html( po.join('') );
			cfg.target.find('[data-menu-item-index]').on("click", (function(e){
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
	root.menu = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_menu", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);