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
				title: '',
				msg: ''
			};
		}).apply(this, arguments);

		this.active_modal = null;
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
			// after set_config();
			cfg.id = 'ax5-modal-' + ax5.get_guid();

			this.mask.set_config(cfg.mask);
		};

		/**
		 * open the modal of alert type
		 * @method ax5.ui.modal.alert
		 * @param {Object|String} [{theme, title, msg, btns}|msg] - modal 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.modal}
		 * @example
		 * ```
		 * my_modal.alert({
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
			opts.modal_type = "alert";
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
		 * open the modal of confirm type
		 * @method ax5.ui.modal.confirm
		 * @param {Object|String} [{theme, title, msg, btns}|msg] - modal 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.modal}
		 * @example
		 * ```
		 * my_modal.confirm({
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
			opts.modal_type = "confirm";
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
		 * open the modal of prompt type
		 * @method ax5.ui.modal.prompt
		 * @param {Object|String} [{theme, title, msg, btns, input}|msg] - modal 속성을 json으로 정의하거나 msg만 전달
		 * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
		 * @returns {ax5.ui.modal}
		 * @example
		 * ```
		 * my_modal.prompt({
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
			opts.modal_type = "prompt";
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


		this.get_content = function(modal_id, opts){
			var
				po = [];

			po.push('<div id="' + modal_id + '" data-ax5-ui="modal" class="ax5-ui-modal ' + opts.theme + '">');
				po.push('<div class="ax-modal-heading">');
				po.push( (opts.title || cfg.title || "") );
				po.push('</div>');
				po.push('<div class="ax-modal-body">');
					po.push('<div class="ax-modal-msg">');
					if(opts.input){
						U.each(opts.input, function(k, v) {
							po.push('<div class="ax-modal-prompt">');
							po.push( this.label.replace(/\n/g, "<br/>") );
							po.push('</div>');
							po.push('<input type="text" class="ax-inp" data-ax-modal-prompt="' + k + '" style="width:100%;" />');
						});
					}
					else{
						po.push( (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>") );
					}

					po.push('</div>');
					po.push('<div class="ax-modal-buttons">');
						po.push('<div class="ax-button-wrap">');
						U.each(opts.btns, function(k, v){
							po.push('<button type="button" data-ax-modal-btn="' + k + '" class="ax-btn ' + this.theme + '">' + this.label + '</button>');
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
			this.active_modal = ax5.dom('#' + opts.id);
			this.active_modal.css({width: box.width});

			// modal 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
			box.height = this.active_modal.height();
			//- position 정렬
			if(typeof opts.position === "undefined" || opts.position === "center"){
				pos.top = ax5.dom.height(document.body) / 2 - box.height/2;
				pos.left = ax5.dom.width(document.body) / 2 - box.width/2;
			}else{
				pos.left = opts.position.left || 0;
				pos.top = opts.position.top || 0;
			}
			this.active_modal.css(pos);

			// bind button event
			if(opts.modal_type === "prompt") {
				this.active_modal.find("[data-ax-modal-prompt]").elements[0].focus();
			}else{
				this.active_modal.find("[data-ax-modal-btn]").elements[0].focus();
			}
			this.active_modal.find("[data-ax-modal-btn]").on(cfg.click_event_name, (function(e){
				this.btn_onclick(e||window.event, opts, callback);
			}).bind(this));
			
			// bind key event
			axd(window).on("keydown.ax-modal", (function(e){
				this.onkeyup(e||window.event, opts, callback);
			}).bind(this))
		};

		this.btn_onclick = function(e, opts, callback, target, k){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-ax-modal-btn")){
					return true;
				}
			});
			if(target){
				k = axd.attr(target, "data-ax-modal-btn");

				var that = {
						key: k, value: opts.btns[k],
						modal_id: opts.id,
						btn_target: target
					};
				if(opts.modal_type === "prompt") {
					var empty_key = null;
					for (var oi in opts.input) {
						that[oi] = this.active_modal.find('[data-ax-modal-prompt=' + oi + ']').val();
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
				if(opts.modal_type === "alert"){
					if(callback) callback.call(that, k);
					this.close();
				}
				else
				if(opts.modal_type === "confirm"){
					if(callback) callback.call(that, k);
					this.close();
				}
				else
				if(opts.modal_type === "prompt"){
					if(k === 'ok') {
						if(empty_key) {
							this.active_modal.find('[data-ax-modal-prompt="' + empty_key + '"]').elements[0].focus();
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
			if(opts.modal_type === "prompt") {
				if(e.keyCode == ax5.info.event_keys.RETURN){
					var that = {
						key: k, value: opts.btns[k],
						modal_id: opts.id,
						btn_target: target
					};
					var empty_key = null;
					for (var oi in opts.input) {
						that[oi] = this.active_modal.find('[data-ax-modal-prompt=' + oi + ']').val();
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