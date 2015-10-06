// ax5.ui.segment
(function(root, ax_super) {

	/**
	 * @class ax5.ui.segment
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2015-09-11 tom : 시작
	 * @example
	 * ```
	 * var my_segment = new ax5.ui.segment();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function() {
		// 클래스 생성자
		this.main = (function() {
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				theme: 'default'
			};
		}).apply(this, arguments);

		this.target = null;
		var _this = this;
		var cfg = this.config;

		/**
		 * Preferences of segment UI
		 * @method ax5.ui.segment.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.segment}
		 * @example
		 * ```
		 * ```
		 */
			//== class body start
		this.init = function() {
			if (!cfg.target) U.error("aui_segment_400", "[ax5.ui.segment] config.target is required");

			this.target = ax5.dom(cfg.target);

			// 프레임 생성
			this.target.after(this._get_frame(this.target.elt().id));

			// 파트수집
			this.els = {
				"root": axd('[data-segment-origin-id="' + this.target.elt().id + '"]')
			};

			this._set_size_frame();
			this.bind_window_resize(function(){
				this._set_size_frame();
			});
			setTimeout(function(){
				_this._set_size_frame();
			}, 500);

			this.set_value(this.target.val());

			this.target.on("change", function(){
				_this.set_value(_this.target.val());
			});
			this.els["root"].find('[data-segment-item-index]').on("click", function(e){
				_this._onclick(e||window.event);
			});
		};
		
		this._onclick = function(e, target, index, that){
			target = axd.parent(e.target, function(target){
				if(axd.attr(target, "data-segment-item-index")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-segment-item-index");

				var item = cfg.list[index];
				_this.target.val(item.value);
				_this.target.dispatch_event("change");

				that = {
					list: cfg.list,
					index: index,
					target: this.target.elements[0]
				};
				if(cfg.onclick){
					cfg.onclick.call(that);
				}
			}
		};
		
		this._set_size_frame = this.align = function(){
			var ct_width = this.target.width();
			if(ct_width > 0) {
				this.els["root"].css({
					top: 0, left: 0,
					width: this.target.width(),
					height: this.target.height()
				});
			}
		};



		this._get_frame = function(origin_id) {

			ax5.dom('[data-segment-origin-id="' + origin_id + '"]').remove();

			// 그리드 레이아웃 구성
			var po = [];
			po.push('<div class="ax5-ui-segment-group ' + cfg.theme + '" data-segment-els="root" data-segment-origin-id="' + origin_id + '">');

			po.push('<table cellpadding="0" cellspacing="0" style="height:100%;">');
			po.push('<tbody>');

			po.push('<tr>');

			for (var i = 0, l = cfg.list.length, item; i < l; i++) {
				item = cfg.list[i];
				po.push('<td>');
				po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (item.klass || "") + '" data-segment-item-index="' + i + '" ' +
					(function(){
						if(i == 0){
							return 'data-segment-item-first="1"'
						}
						else if(i == cfg.list.length-1){
							return 'data-segment-item-last="1"'
						}
					})() +
				'>' + (item.text || "") + '</buttton></div>');
				po.push('</td>');
			}

			po.push('</tr>');

			po.push('</tbody>');
			po.push('</table>');

			po.push('</div>');

			return po.join('');
		};

		this.set_value = function(val){
			var selected_item, selected_index;

			this.els["root"].find('[data-segment-item-index]').class_name("remove", "on");

			for (var i = 0, l = cfg.list.length, item; i < l; i++) {
				item = cfg.list[i];
				if(item.value == val){
					selected_item = item;
					selected_index = i;
				}
			}
			if(selected_item){
				this.els["root"].find('[data-segment-item-index="'+selected_index+'"]').class_name("add", "on");
			}
		}
	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.segment = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_segment", [], function() { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);