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