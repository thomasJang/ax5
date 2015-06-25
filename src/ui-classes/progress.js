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
				click_event_name: (('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
				theme: 'default'
			};
		}).apply(this, arguments);

		this.target = null;
		var cfg = this.config;
		/**
		 * Preferences of progress UI
		 * @method ax5.ui.progress.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.progress}
		 * @example
		 * ```
		 * set_config({
		 *      target : {Element|AX5 nodelist}, // UI를 출력할 대상
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target){
				U.error("aui_progress_400", "[ax5.ui.progress] config.target is required");
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
								po.push('<td style="width:' + cfg.col_width + '">');
								po.push('<div class="ax-item-wraper ' + (cfg.item.addon? "has-addon":"") + '" style="height:' + cfg.col_height + 'px;">');

								po.push('<div class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-item-index="' + i + '"></div>');

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
					cfg.control.height = (cfg.col_height * cfg.rows / 2);
					po.push('<div class="component-grid-control" data-component-grid-els="control" style="width:' + cfg.control.width + 'px;">');
					po.push('<table cellpadding="0" cellspacing="0">');
					po.push('<tbody>');
						po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper" style="height:' + cfg.control.height + 'px;">');
								po.push('<button class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-control="prev">' + cfg.control.prev + '</buttton>');
							po.push('</div>');
							po.push('</td>');
						po.push('</tr>');
						po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper" style="height:' + cfg.control.height + 'px;">');
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
		
		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-component-grid-item-index")){
					return true;
				}
			});
			if(target){
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