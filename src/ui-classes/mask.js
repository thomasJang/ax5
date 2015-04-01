(function(root, ax_super) {
	var U = ax5.util, axd = ax5.dom;

	var ax_class = function () {
		var self = this;
		if (ax_super) ax_super.call(this); // 부모호출
		this.config = {
			mask_target: axd.get(document.body)[0]
		};
		this.mask_content = '<h1>AX5 Mask</h1>';
		this.status = "off";

		//== class body start
		this.init = function(){
			// after set_config();
			if(this.config.content) this.set_body(this.config.content);
		};

		this.set_body = function(content){
			this.mask_content = content;
		};

		this.get_body = function(){
			return this.mask_content;
		};

		this.open = function(config){
			if(this.status === "on") this.close();
			if(config && config.content) this.set_body(config.content);
			self.mask_config = {};
			U.extend(self.mask_config, this.config, true);
			U.extend(self.mask_config, config, true);

			var cfg = self.mask_config,
				mask_target = axd.get(cfg.mask_target)[0],
				po = [], css, mask_id = 'ax-mask-'+ ax5.get_guid(), _mask, css = {},
				that = {};

			po.push('<div class="ax-mask" id="'+ mask_id +'">');
				po.push('<div class="ax-mask-bg"></div>');
				po.push('<div class="ax-mask-content">');
					po.push('<div class="ax-mask-body">');
						po.push(self.get_body());
					po.push('</div>');
				po.push('</div>');
			po.push('</div>');

			if(mask_target == document.body){
				axd.append(mask_target, po.join(''));
			}else{
				axd.append(document.body, po.join(''));
				var box_model = axd.box_model(mask_target);
				css = {
					position:"absolute",
					left: box_model.offset.left,
					top: box_model.offset.top,
				    width: box_model.width,
					height: box_model.height
				};
				axd.class_name(mask_target, "add", "ax-masking");
			}
			this._mask = _mask = axd.get("#"+mask_id);
			this.mask_target = mask_target;
			this.status = "on";
			axd.css(_mask, css);

			if(cfg.onchange) {
				that = {
					type: "open"
				};
				cfg.onchange.call(that, that);
			}
		};

		this.close = function(){
			var cfg = this.mask_config;
			axd.remove(this._mask);
			axd.class_name(this.mask_target, "remove", "ax-masking");
			if(cfg.onchange) {
				that = {
					type: "close"
				};
				cfg.onchange.call(that, that);
			}
		};
		//== class body end
	};


	//== ui class 공통 처리 구문. ==================================
	// define ether to super object
	if (ax_super) ax_class.prototype = new ax_super();

	if (typeof root.module === "object" && root.module && typeof root.module.exports === "object") {
		root.module.exports = ax_class; // commonJS
	} else {
		root.mask = ax_class; // global object
		if (typeof define === "function" && define.amd) {
			/*global define */
			define("_ax5_ui_mask", [], function () { return ax_class; }); // requireJS
		}
	}
	//== ui class 공통 처리 구문. ==================================

})(ax5.ui, ax5.ui.root);
