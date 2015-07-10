// ax5.ui.component_grid
(function(root, ax_super) {
	/**
	 * @class ax5.ui.component_grid
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2014-06-23 tom : 시작
	 * @example
	 * ```
	 * var my_component_grid = new ax5.ui.component_grid();
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

		this.list = [];
		this.page = {};
		this.target = null;
		this.selected_item = null;

		var cfg = this.config;
		/**
		 * Preferences of component_grid UI
		 * @method ax5.ui.component_grid.set_config
		 * @param {Object} config - 클래스 속성값
		 * @returns {ax5.ui.component_grid}
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
		 *      onclick: {Function} [onclick] - 아이템 클릭이벤트 처리자
		 * });
		 * ```
		 */
			//== class body start
		this.init = function(){
			// after set_config();
			//console.log(this.config);
			if(!cfg.target){
				U.error("aui_component_grid_400", "[ax5.ui.component_grid] config.target is required");
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


			this.set_size_frame();
			this.bind_window_resize(function(){
				this.set_size_frame();
			});
		};

		this.resize = function(){
			this.set_size_frame();
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
								po.push('<td>');
								po.push('<div class="ax-item-wraper ' + (cfg.item.addon? "has-addon":"") + '">');

								po.push('<button class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-item-index="' + i + '"></button>');

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
					//cfg.control.height = (cfg.col_height * cfg.rows / 2);
					po.push('<div class="component-grid-control" data-component-grid-els="control" style="width:' + cfg.control.width + 'px;">');
					po.push('<table cellpadding="0" cellspacing="0">');
					po.push('<tbody>');
						po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper">');
								po.push('<button class="ax-btn ' + (cfg.item.klass||"") + '" data-component-grid-control="prev">' + cfg.control.prev + '</buttton>');
							po.push('</div>');
							po.push('</td>');
						po.push('</tr>');
						po.push('<tr>');
							po.push('<td>');
							po.push('<div class="ax-item-wraper">');
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


		this.set_size_frame = function(){  /* resizable */
			var
				target_height = this.target.height();

			this.els["body"].find(".ax-item-wraper").css({height:target_height / cfg.rows});
			this.els["control"].find(".ax-item-wraper").css({height:target_height / 2});

			/*
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
			*/
		};
		
		this.onclick = function(e, target, index){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-component-grid-item-index")){
					return true;
				}
			});
			if(target){

				if(this.selected_item) axd.class_name(this.selected_item, "remove", "selected");
				this.selected_item = target;
				this.selected_item_pgno = this.page.no;
				axd.class_name(target, "add", "selected");

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
		
		this.onmove = function(e, target, dirc){
			target = axd.parent(e.target, function(target){
				if(ax5.dom.attr(target, "data-component-grid-control")){
					return true;
				}
			});
			if(target){
				dirc = axd.attr(target, "data-component-grid-control");
				if(dirc == "prev"){
					if(this.page.no < 1){

					}
					else{
						this.page.no--;
						this.print_list();
					}
				}
				else{
					if(this.page.no < this.page.count-1){
						this.page.no++;
						this.print_list();
					}
				}
			}
		};

		this.set_list = function(list){
			this.list = list;
			this.page.no = 0;
			this.page.size = cfg.rows * cfg.cols;
			this.page.count = Math.ceil( this.list.length / this.page.size );
			this.print_list();
		};

		this.print_list = function(){
			function formatter(val, format){
				if(U.is_function(format)){
					var that = {
						value: val
					};
					return format.call(that);
				}
				else if(format == "money"){
					return U.number(val, {money:true});
				}
				else{
					return val;
				}
			}

			if(this.selected_item) {
				axd.class_name(this.selected_item, "remove", "selected");
				if(this.selected_item_pgno == this.page.no) {
					axd.class_name(this.selected_item, "add", "selected");
				}
			}

			var item_index = this.page.no * this.page.size;
			for(var i=0;i<this.page.size;i++){
				var
					node = this.els["body"].find('[data-component-grid-item-index="' + i + '"]'),
					item = this.list[item_index];

				if(item) {
					node.html('<div class="label">' + formatter(item[cfg.item.label.key], cfg.item.label.formatter) + '</div>');
					if (cfg.item.addon) {
						node.append('<div class="addon">' + formatter(item[cfg.item.addon.key], cfg.item.addon.formatter) + '</div>');
					}
				}else{
					node.empty();
				}
				item_index++;
			}
		};

		this.click = function(index){
			if(this.list[ U.number(index) + this.page.no * this.page.size ]) {
				var target = this.target.find('[data-component-grid-item-index="' + index + '"]');
				if(this.selected_item) axd.class_name(this.selected_item, "remove", "selected");
				this.selected_item = target;
				this.selected_item_pgno = this.page.no;
				axd.class_name(target, "add", "selected");

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

			return this;
		}
	};
	//== UI Class
	
	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.component_grid = ax_class; // ax5.ui에 연결
	
	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_component_grid", [], function () { return ax_class; }); // for requireJS
	}
	//== ui class 공통 처리 구문
	
})(ax5.ui, ax5.ui.root);