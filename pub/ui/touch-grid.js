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

		this.target = null;
		this.focused_index = -1;
		this.col_group = [];
		this.col_width_sum = 0;
		this.list = [];
		this.virtual_scroll = {};

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

			this.target = ax5.dom(cfg.target);

			// 데이터 정리
			//console.log(cfg.col_group[1]);
			this.col_group = this.convert_col_group(cfg.col_group);
			//console.log(cfg.col_group[1]);

			// 프레임 생성
			this.target.html( this.get_frame() );

			// 파트수집
			this.els = {
				"root": this.target.find('[data-touch-grid-els="root"]'),
				"main": this.target.find('[data-touch-grid-els="main"]'),
				"main-header": this.target.find('[data-touch-grid-els="main-header"]'),
				"main-body": this.target.find('[data-touch-grid-els="main-body"]'),
				"main-body-content": this.target.find('[data-touch-grid-els="main-body-content"]')
			};

			if(cfg.control){
				this.els["control"] =  this.target.find('[data-touch-grid-els="control"]');
				this.els["control"].on("click", (function(e){
					this.oncontrol(e||window.event);
				}).bind(this));
			}

			this.set_size_frame();
			this.els["main-header"].html( this.get_header("main-header") );
			this.els["main-body-content"].html( this.get_body("main-body") );
			this.els["main-body-content-tbody"] = this.els["main-body-content"].find('[data-touch-grid-els="main-body-content-tbody"]');

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
				po.push('<div class="touch-grid-body" data-touch-grid-els="body">');
					po.push('<div class="touch-grid-main" data-touch-grid-els="main">');
						po.push('<div class="touch-grid-main-header" data-touch-grid-els="main-header">');
						po.push('</div>');
						po.push('<div class="touch-grid-main-body" data-touch-grid-els="main-body">');
							po.push('<div class="touch-grid-content" data-touch-grid-els="main-body-content"></div>');
						po.push('</div>');
					po.push('</div>');
				po.push('</div>');
			if(cfg.control) {
				po.push('<div class="touch-grid-control" data-touch-grid-els="control" style="width:' + cfg.control.width + 'px;">');
					po.push('<table cellpadding="0" cellspacing="0" style="height:100%;">');
						po.push('<tbody>');
						if(cfg.control.first) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="first">' + cfg.control.first + '</buttton></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						if(cfg.control.prev) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="prev">' + cfg.control.prev + '</buttton></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						if(cfg.control.next) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="next">' + cfg.control.next + '</button></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						if(cfg.control.last) {
							po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper"><button class="ax-btn ' + (cfg.control.klass || "") + '" data-touch-grid-control="last">' + cfg.control.last + '</buttton></div>');
							po.push('</td>');
							po.push('</tr>');
						}
						po.push('</tbody>');
					po.push('</table>');
				po.push('</div>');
			}
			po.push('</div>');
			return po.join('');
		};

		this.set_size_frame = function(){  /* resizable */
			var
				target_height = this.target.height();

			this.els["main"].css({height: target_height});
			this.els["main-header"].css({height: cfg.head_height});
			this.els["main-body"].css({height: target_height - cfg.head_height});
			if(cfg.control) {
				this.els["control"].css({height: target_height});
				var control_item = this.els["control"].find(".ax-item-wraper");
				//console.log(control_item.elements.length);
				control_item.css({height: target_height / control_item.elements.length});
			}
			this.virtual_scroll.size = Math.ceil((target_height - cfg.head_height) / cfg.item_height);
		};

		// col_group의 속성값을 정리하여 줍니다. - width등
		this.convert_col_group = function(col_group){ /* resizable */
			var
				CG = [],
				target_width = this.target.width(),
				free_width = target_width,
				free_width_col_count = 0;

			if(cfg.control) {
				free_width -= cfg.control.width;
			}

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
			if(cfg.control) {
				this.col_width_sum -= cfg.control.width;
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

			this.els["main"].find('[data-touch-grid-table]').css( {width: this.col_width_sum} );
		};

		this.get_header = function(typ){
			var
				po = [];

			po.push('<table data-touch-grid-table="' + typ + '" style="width:' + this.col_width_sum + 'px;height:' + cfg.head_height + 'px;line-height:' + cfg.head_height + 'px;">');
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

		this.get_body = function(typ){
			var
				po = [];
				po.push('<table data-touch-grid-table="' + typ + '" style="width:' + this.col_width_sum + 'px;">');
				po.push( this.get_col_group() );
				po.push('<tbody data-touch-grid-els="main-body-content-tbody"></tbody>');
				po.push('</table>');

			return po.join('');
		};

		this.get_list = function(typ){
			var
				po = [],
				end_index = this.virtual_scroll.end_index;

				for (var r = this.virtual_scroll.start_index, len = ((end_index > this.list.length) ? this.list.length : end_index), item; r < len; r++) {
					item = this.list[r];
					po.push('<tr data-touch-grid-item-row="' + r + '" style="height:' + cfg.item_height + 'px;">');
					for(var i=0, l=this.col_group.length;i<l;i++) {
						po.push('<td style="' + (
								function(C){
									if(!C.align) return '';
									return 'text-align:' + C.align + ';';
								}
							)(this.col_group[i]) + '">' + this.get_col_value(item, this.col_group, r, i) + '</td>');
					}
					po.push('</tr>');
				}

			return po.join('');
		};

		this.get_col_value = function(item, CG, r, ci){
			if(U.is_function(CG[ci].formatter)){
				var that = {
					index: r,
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
			this.focused_index = 0;
			this.content_scroll(0);
		};

		this.append = function(item){
			this.list.push(item);
			this.focused_index = 0;
			this.content_scroll();
			this.focus('last');
		};

		this.update = function(index, json){
			if(typeof index !== "undefined" && this.list[index]){
				for(var k in json){
					this.list[index][k] = json[k];
				}
				this.content_scroll();
				this.focus(index);
			}
			return this;
		};

		this.remove = function(index){
			if(typeof index === "undefined"){
				index = this.list.length-1;
			}
			if(this.list[index]){
				this.list.splice(index, 1);
			}
			else{
				return this;
			}

			if(index == this.focused_index){
				if(index == 0) this.focused_index = 0;
				else if(this.list.length == 1) this.focused_index = 0;
				else {
					this.focused_index -= 1;
				}
			}

			var focused_item_top, body_content_top, body_height, view_position_top;
				focused_item_top = this.focused_index * cfg.item_height,
				body_content_top = this.els["main-body-content"].position().top,
				body_height = this.els["main-body"].height(),
				view_position_top = focused_item_top + body_content_top;

			if( (view_position_top + cfg.item_height) > body_height ) {
				this.content_scroll(-(body_height - (focused_item_top + cfg.item_height)));
			}
			else if( view_position_top < 0 ){
					this.content_scroll( focused_item_top );
			}
			else{
				this.content_scroll();
			}
		};

		this.content_scroll = function(top){
			if(typeof top === "undefined"){
				top = U.number(this.els["main-body-content"].position().top, {abs:true});
			}
			else{
				this.els["main-body-content"].css({top: -top });
			}

			this.virtual_scroll.start_index = Math.floor(top / cfg.item_height);
			this.virtual_scroll.end_index = U.number(this.virtual_scroll.start_index) + U.number(this.virtual_scroll.size);

			this.els["main-body-content"].css({'padding-top': this.virtual_scroll.start_index * cfg.item_height });
			this.els["main-body-content-tbody"].html( this.get_list("main-body") );

			this.els["main-body-content"].find('[data-touch-grid-item-row="'+ this.focused_index +'"]').class_name("add", "focus");

			this.els["main-body-content-tbody"].on("click", (function(e){
				this.onclick(e||window.event);
			}).bind(this));
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
			this.focused_index = index;

			var focused_item_top, body_content_top, body_height, view_position_top;

				focused_item_top = index * cfg.item_height,
				body_content_top = this.els["main-body-content"].position().top,
				body_height = this.els["main-body"].height(),
				view_position_top = focused_item_top + body_content_top;

			if( (view_position_top + cfg.item_height) > body_height ){
				this.content_scroll( -(body_height - (focused_item_top + cfg.item_height)) );
			}
			else if( view_position_top < 0 ){
				this.content_scroll( focused_item_top );
			}
			else{
				this.els["main-body-content"].find('[data-touch-grid-item-row="'+ index +'"]').class_name("add", "focus");
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
					target: this.target.elements[0],
					item_target: target
				};

				this.focus(index);
				if(cfg.body.onclick){
					cfg.body.onclick.call(that);
				}
			}
		};

		this.oncontrol = function(e, target, index, that){
			target = axd.parent(e.target, function(target){
				if(axd.attr(target, "data-touch-grid-control")){
					return true;
				}
			});
			if(target){
				index = axd.attr(target, "data-touch-grid-control");
				that = {
					control: index,
					target: this.target.elements[0],
					item_target: target
				};

				if(index == "first"){
					this.focus(0);
				}
				else if(index == "prev"){
					this.focus(-1, "by");
				}
				else if(index == "next"){
					this.focus(1, "by");
				}
				else if(index == "last"){
					this.focus("last");
				}
				if(cfg.control.onclick){
					cfg.control.onclick.call(that);
				}
			}
		};

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