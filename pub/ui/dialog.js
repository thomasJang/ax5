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
			this.mask = new ax5.ui.mask();
			this.mask.set_config(cfg.mask);
		};

		this.get_content = function(dialog_id, opts){
			var
				po = [],
				btns = opts.btns || cfg.btns;

			po.push('<div id="' + dialog_id + '" data-ax5-ui="dialog" class="ax5-ui-dialog ' + (opts.theme || cfg.theme || "") + '">');
			po.push('<div class="ax-dialog-heading">');
			po.push( (opts.title || cfg.title || "") );
			po.push('</div>');
			po.push('<div class="ax-dialog-body">');
				po.push('<div class="ax-dialog-msg">');
				po.push( (opts.msg || cfg.msg || "") );
				po.push('</div>');
				po.push('<div class="ax-dialog-buttons">');
					U.each(btns, function(){
						po.push('<button type="button" class="ax-btn">' + this.label + '</button>')
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
				dialog_id = opts.id || 'ax5-dialog-' + ax5.get_guid(),
				dialog_target;

			this.mask.open();
			box = {
				width: opts.width || cfg.width
			};
			axd.append(document.body, this.get_content(dialog_id, opts));
			dialog_target = ax5.dom('#' + dialog_id);
			dialog_target.css({width: box.width});

			// dialog 높이 구하기
			//- position 정렬
			if(typeof opts.position === "undefined" || opts.position === "center"){

			}

			//todo : 정렬처리
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