// ax5.ui.touch_grid
(function(root, ax_super) {

	/**
	 * @class ax5.ui.touch_grid
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-17 tom : 시작
	 * @example
	 * ```
	 * var my_touch_grid = new ax5.ui.touch_grid();
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
				head_height: 28,
				item_height: 28,
				col_min_width: 30,
				body: {}
			};
		}).apply(this, arguments);

		this.focused_index = -1;
		this.col_group = [];
		this.col_width_sum = 0;
		this.list = [];

		var cfg = this.config;

		/**
		 * Preferences of touch-grid UI
		 * @method ax5.ui.touch_grid.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.touch_grid}
		 * @example
		 * ```
		 * ```
		 */
		//== class body start
		this.init = function(){
			if(!cfg.target) U.error("aui_touch_grid_400", "[ax5.ui.touch_grid] config.target is required");
			cfg.target = ax5.dom(cfg.target);

			// 데이터 정리
			//console.log(cfg.col_group[1]);
			this.col_group = this.convert_col_group(cfg.col_group);
			//console.log(cfg.col_group[1]);

			// 프레임 생성
			cfg.target.append( this.get_frame() );

			// 파트수집
			this.els = {
				"root": cfg.target.find('[data-touch-grid-els="root"]'),
				"main": cfg.target.find('[data-touch-grid-els="main"]'),
				"main-header": cfg.target.find('[data-touch-grid-els="main-header"]'),
				"main-body": cfg.target.find('[data-touch-grid-els="main-body"]'),
				"main-body-content": cfg.target.find('[data-touch-grid-els="main-body-content"]')
			};
			this.set_size_frame();
			this.els["main-header"].html( this.get_header("main-header") );

			this.bind_window_resize(function(){
				this.col_group = this.convert_col_group(cfg.col_group);
				this.set_size_frame();
				this.set_size_col_group();
			});
		};

		this.get_frame = function(){
			// 그리드 레이아웃 구성
			var po = [];
			po.push('<div class="ax5-ui-touch-grid ' + cfg.theme + '" data-touch-grid-els="root">');
				po.push('<div class="touch-grid-main" data-touch-grid-els="main">');
					po.push('<div class="touch-grid-main-header" data-touch-grid-els="main-header">');
					po.push('</div>');
					po.push('<div class="touch-grid-main-body" data-touch-grid-els="main-body">');
						po.push('<div class="touch-grid-content" data-touch-grid-els="main-body-content"></div>');
					po.push('</div>');
				po.push('</div>');
			po.push('</div>');
			return po.join('');
		};

		this.set_size_frame = function(){  /* resizable */
			var
				target_height = cfg.target.height();

			this.els["main"].css({height: target_height});
			this.els["main-header"].css({height: cfg.head_height});
			this.els["main-body"].css({height: target_height - cfg.head_height});
		};

		// col_group의 속성값을 정리하여 줍니다. - width등
		this.convert_col_group = function(col_group){ /* resizable */
			var
				CG = [],
				target_width = cfg.target.width(),
				free_width = target_width,
				free_width_col_count = 0;

			for(var i=0, l=col_group.length;i<l;i++) CG.push(U.clone(col_group[i]));
			this.col_width_sum = 0;

			for(var i=0, l=CG.length;i<l;i++){
				if(!U.is_undefined(CG[i].width) && CG[i].width !== "*"){
					this.col_width_sum += U.number(CG[i].width);
					free_width -= U.number(CG[i].width);
				}else{
					free_width_col_count++;
				}
			}
			if(free_width_col_count > 0) {
				for (var i = 0, l = CG.length; i < l; i++) {
					if (U.is_undefined(CG[i].width) || CG[i].width === "*") {
						CG[i].width = free_width / free_width_col_count;
						if(CG[i].width < cfg.col_min_width) CG[i].width = cfg.col_min_width;
						this.col_width_sum += U.number(CG[i].width);
					}
				}
			}

			return CG;
		};

		this.get_col_group = function(){
			var po = [];
			po.push('<colgroup>');
			for(var i=0, l=this.col_group.length;i<l;i++){
				po.push('<col data-touch-grid-col="' + i + '"  style="width:' + this.col_group[i].width + 'px;" />');
			}
			po.push('</colgroup>');
			return po.join('');
		};

		this.set_size_col_group = function(){
			for(var i=0, l=this.col_group.length;i<l;i++) {
				this.els["main"].find('[data-touch-grid-col="' + i + '"]').css( {"width": this.col_group[i].width} );
			}
			//this.els["main"].find('[data-touch-grid-table]').css( {width: this.col_width_sum} );
		};

		this.get_header = function(typ){
			var
				po = [];

			po.push('<table data-touch-grid-table="' + typ + '" style="width:' + this.col_width_sum + 'px;height:' + cfg.head_height + 'px;">');
				po.push( this.get_col_group() );
				po.push('<tbody>');
					po.push('<tr style="' + (
							function(){
								if(!cfg.head_align) return '';
								return 'text-align:' + cfg.head_align + ';';
							}
						)() + '">');
					for(var i=0, l=this.col_group.length;i<l;i++) {
						po.push('<td style="' + (
								function(C){
									if(cfg.head_align || !C.align) return '';
									return 'text-align:' + C.align + ';';
								}
							)(this.col_group[i]) + '">' + this.col_group[i].label + '</td>');
					}
					po.push('</tr>');
				po.push('</tbody>');
			po.push('</table>');
			return po.join('');
		};

		this.get_list = function(typ){
			var
				po = [];

			if(this.list.length > 0) {
				po.push('<table data-touch-grid-table="' + typ + '" style="width:' + this.col_width_sum + 'px;">');
					po.push( this.get_col_group() );
					po.push('<tbody>');
					for (var r = 0, len = this.list.length, item; r < len; r++) {
						item = this.list[r];
						po.push('<tr data-touch-grid-item-row="' + r + '" style="height:' + cfg.item_height + 'px;">');
						for(var i=0, l=this.col_group.length;i<l;i++) {
							po.push('<td style="' + (
									function(C){
										if(!C.align) return '';
										return 'text-align:' + C.align + ';';
									}
								)(this.col_group[i]) + '">' + this.get_col_value(item, this.col_group, i) + '</td>');
						}
						po.push('</tr>');
					}
					po.push('</tbody>');
				po.push('</table>');
			}
			return po.join('');
		};

		this.get_col_value = function(item, CG, ci){
			if(U.is_function(CG[ci].formatter)){
				var that = {
					list: this.list,
					item: item,
					col_group: CG,
					key: CG[ci].key,
					col_index: ci,
					value: item[CG[ci].key]
				};
				return CG[ci].formatter.call(that) || "";
			}
			else if(CG[ci].formatter === "money"){
				return U.number(item[CG[ci].key]||0, {money:true});
			}
			else {
				return item[CG[ci].key]||"";
			}
		};

		this.set_list = function(list){
			this.list = list;
			this.focused_index = -1;
			this.els["main-body-content"].html( this.get_list("main-body") );
			this.els["main-body-content"].on("click", (function(e){
				this.onclick(e||window.event);
			}).bind(this));
			this.focus(0);
		};

		this.focus = function(index, by){
			if(this.focused_index > -1){
				// remove focus
				this.els["main-body-content"].find('[data-touch-grid-item-row="'+ this.focused_index +'"]').class_name("remove", "focus");
			}

			if(index == "last"){
				index = this.list.length-1;
			}
			else if(typeof by !== "undefined"){
				if(this.focused_index == -1) return;
				index = this.focused_index + index;
			}

			index = U.number(index);
			if(index < 0) index = 0;
			if(index >= this.list.length) index = this.list.length-1;

			// add focus
			var focused_item, focused_item_height, focused_item_top, body_content_top, body_height, view_position_top;
				focused_item = this.els["main-body-content"].find('[data-touch-grid-item-row="'+ index +'"]');
				if(focused_item.length == 0) return; // find 실
				focused_item_height = focused_item.height(),
				focused_item_top = focused_item.position().top,
				body_content_top = this.els["main-body-content"].position().top,
				body_height = this.els["main-body"].height(),
				view_position_top = focused_item_top + body_content_top;

			focused_item.class_name("add", "focus");
			this.focused_index = index;

			// console.log((view_position_top + focused_item_height), body_height, view_position_top);
			// content scroll
			if( (view_position_top + focused_item_height) > body_height ){
				this.els["main-body-content"].css({top: body_height - (focused_item_top + focused_item_height) });
			}
			else if( view_position_top < 0 ){
				this.els["main-body-content"].css({top: - (focused_item_top) });
			}
		};

		this.onclick = function(e, target, index, that){
			target = axd.parent(e.target, function(target){
				if(axd.attr(target, "data-touch-grid-item-row")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-touch-grid-item-row");
				that = {
					list: this.list,
					item: this.list[index],
					target: cfg.target.elements[0],
					item_target: target
				};

				this.focus(index);
				if(cfg.body.onclick){
					cfg.body.onclick.call(that);
				}
			}
		}

	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.touch_grid = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_touch_grid", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);