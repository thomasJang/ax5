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
				click_event_name: (('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				mask: {
					target: document.body,
					content: ''
				},
				theme: 'default',
				width: 300,
				title: '',
				msg: '',
				btns: {
					ok: {
						label: 'ok'
					}
				}
			};
		}).apply(this, arguments);

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
			this.mask = new ax5.ui.mask();
			this.mask.set_config(cfg.mask);
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
				po.push( (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>") );
				po.push('</div>');
				po.push('<div class="ax-dialog-buttons">');
					U.each(opts.btns, function(k, v){
						po.push('<button type="button" data-ax-dialog-btn="' + k + '" class="ax-btn ' + opts.theme + '">' + this.label + '</button>')
					});
				po.push('</div>');
			po.push('</div>');
			po.push('</div>');
			return po.join('');
		};

		this.alert = function(opts, callback){
			var
				pos = {},
				box = {},
				po,
				dialog_target;

			opts.id = (opts.id || cfg.id);
			opts.dialog_type = "alert";
			opts.theme = (opts.theme || cfg.theme || "");
			if(typeof opts.btns === "undefined"){
				opts.btns = U.clone(cfg.btns);
			}

			this.mask.open();
			box = {
				width: opts.width || cfg.width
			};
			axd.append(document.body, this.get_content(opts.id, opts));
			dialog_target = ax5.dom('#' + opts.id);
			dialog_target.css({width: box.width});

			// dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
			box.height = dialog_target.height();
			//- position 정렬
			if(typeof opts.position === "undefined" || opts.position === "center"){
				pos.top = ax5.dom.height(document.body) / 2 - box.height/2;
				pos.left = ax5.dom.width(document.body) / 2 - box.width/2;
			}else{
				pos.left = opts.position.left || 0;
				pos.top = opts.position.top || 0;
			}
			dialog_target.css(pos);

			// bind button event
			dialog_target.find("[data-ax-dialog-btn]").elements[0].focus();
			dialog_target.find("[data-ax-dialog-btn]").on(cfg.click_event_name, (function(e){
				this.btn_onclick(e||window.event, dialog_target, opts, callback);
			}).bind(this));
			
			// bind key event
			axd(window).on("keydown", (function(e){
				this.onkeyup(e||window.event, dialog_target, opts, callback);
			}).bind(this))
		};

		this.btn_onclick = function(e, dialog_target, opts, callback, target, k){
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

				if(opts.btns[k].onclick){
					opts.btns[k].onclick.call(that);
				}
				else
				if(k === "ok"){
					if(callback) callback.call(that);
				}
				if(opts.dialog_type === "alert"){
					dialog_target.remove();
					this.mask.close();
				}
			}
		};
		
		this.onkeyup = function(e, dialog_target, opts, callback, target, k){
			if(e.keyCode == ax5.info.event_keys.ESC){
				dialog_target.remove();
				this.mask.close();
			}
			/*
			else
			if(e.keyCode == ax5.info.event_keys.SPACE || e.keyCode == ax5.info.event_keys.RETURN){

				var that = {
					key: "ok", value: "",
					dialog_id: opts.id,
					item_target: target
				};

				if(callback) callback.call(that);
				dialog_target.remove();
				this.mask.close();
			}
			*/
		};

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