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