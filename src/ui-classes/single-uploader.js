(function (root, ax_super) {

	/**
	 * @class ax5.ui.single_uploader
	 * @classdesc
	 * @version v0.0.1
	 * @author tom@axisj.com
	 * @logs
	 * 2015-10-03 tom : 시작
	 * @example
	 * ```
	 * var my_single_uploader = new ax5.ui.single_uploader();
	 * ```
	 */

	var U = ax5.util, axd = ax5.dom;

	//== UI Class
	var ax_class = function () {
		// 클래스 생성자
		this.main = (function () {
			if (ax_super) ax_super.call(this); // 부모호출
			this.config = {
				theme: "",
				file_types: "*/*"
			};
		}).apply(this, arguments);


		this.target = null;
		var _this = this;
		var cfg = this.config;
		this.uploaded_file = null;

		this.init = function () {
			this.target = ax5.dom(cfg.target);
			this.target.html( this.__get_layout() );

			this.els = {
				"container": this.target.find('[data-ui-els="container"]'),
				"preview": this.target.find('[data-ui-els="preview"]'),
				"preview-img": this.target.find('[data-ui-els="preview-img"]'),
				"input-file": this.target.find('[data-ui-els="input-file"]'),
				"progress": this.target.find('[data-ui-els="progress"]'),
				"progress-bar": this.target.find('[data-ui-els="progress-bar"]')
			};

			this.els["preview"].on("click", (function(){
				this.__request_select_file();
			}).bind(this));

			this.els["input-file"].on("change", (function(e){
				this.__on_select_file(e || window.event);
			}).bind(this));

			(function(){

				var dragZone = this.els["container"],
					preview_img = this.els["preview-img"],
					_this = this, timer;

				dragZone.elements[0].addEventListener('dragover', function(e){
					e.stopPropagation();
					e.preventDefault();

					preview_img.hide();
					if(timer) clearTimeout(timer);

					dragZone.class_name("add", "dragover");
				}, false);
				dragZone.elements[0].addEventListener('dragleave', function(e){
					e.stopPropagation();
					e.preventDefault();

					if(timer) clearTimeout(timer);
					timer = setTimeout(function(){
						preview_img.show();
					}, 100);

					dragZone.class_name("remove", "dragover");
				}, false);

				dragZone.elements[0].addEventListener('drop', function(e){
					e.stopPropagation();
					e.preventDefault();

					dragZone.class_name("remove", "dragover");
					_this.__on_select_file(e || window.event);
				}, false);

			}).call(this);

			setTimeout((function(){
				this.__set_size_layout();
			}).bind(this));

		};

		this.__get_layout = function(){
			var po = [],
				inputFileMultiple = "", // inputFileMultiple = 'multiple="multiple"',  support multifile
				inputFileAccept = cfg.file_types;

			po.push('<div class="' + cfg.theme + '" data-ui-els="container">');
			po.push('<div class="AXF-upload-preview" data-ui-els="preview">');

			po.push('<img class="AXF-upload-preview-img" data-ui-els="preview-img" src="" style="display:none;" />');
			po.push('<span class="empty-msg">' + cfg.empty_msg + '<span>');
			po.push('</div>');
			po.push('<div class="AXF-upload-progress" data-ui-els="progress" style="display: none;"><div class="AXF-upload-progress-bar" data-ui-els="progress-bar"></div></div>');
			po.push('<input type="file" '+inputFileMultiple+' accept="'+inputFileAccept+'" data-ui-els="input-file" />');

			po.push('</div>');

			return po.join('');
		};

		this.__set_size_layout = function(){
			var progress_margin = 20,
				progress_height = this.els["progress"].height(),
				ct_width = this.els["container"].width(),
				ct_height = this.els["container"].height();

			this.els["progress"].css({
				left: progress_margin,
				top: ct_height / 2 - progress_height / 2,
				width: ct_width - (progress_margin * 2)
			});
			this.els["preview-img"].css({width: ct_width, height: ct_height});
		};

		this.__request_select_file = function(){
			if(cfg.before_select_file){
				if(!cfg.before_select_file.call()){
					return false; // 중지
				}
			}

			this.els["input-file"].dispatch_event("click");
		};

		this.__on_select_file = function(evt){
			var file,
				target_id = this.target.id,
				preview   = this.els["preview-img"].get(0);

			if('dataTransfer' in evt){
				file = evt.dataTransfer.files[0];
			}else{
				file = evt.target.files[0];
			}

			if(!file) return false;
			// todo : size over check

			// 선택된 이미지 프리뷰 기능
			(function(root){
				return;
				//try {

				root.els["preview-img"].show();
				var reader = new FileReader(target_id);

				reader.onloadend = function () {
					try {
						preview.src = reader.result;
					} catch (ex) {
						console.log(ex);
					}
				};

				if (file) {
					reader.readAsDataURL(file);
				}
				/*
				 } catch (e) {
				 trace(e.print());
				 }
				 */
			})(this);

			if(file) this.upload(file);
		};

		this.upload = function(file){
			var formData = new FormData(),
				progress_bar = this.els["progress-bar"];

			this.els["progress"].show();
			progress_bar.css({width:'0%'});

			formData.append(cfg.upload_http.filename_param_key, file);
			for(var k in cfg.upload_http.data){
				formData.append(k, cfg.upload_http.data[k]);
			}

			this.xhr = new XMLHttpRequest();
			this.xhr.open(cfg.upload_http.method, cfg.upload_http.url, true);
			this.xhr.onload = function(e) {
				var res = e.target.response;
				try { if (typeof res == "string") res = res.object(); } catch (e) {
					trace(e);
					return;
				}
				if (res.error) {
					return false;
				}
				_this.upload_complete(res);
			};
			this.xhr.upload.onprogress = function(e) {
				progress_bar.css({width: ((e.loaded / e.total) * 100).round(2) + '%'});
				if (e.lengthComputable) {
					if(	e.loaded >= e.total ){
						//_this.upload_complete();
						setTimeout(function(){
							_this.els["progress"].fadeOut();
						}, 300);
					}
				}
			};
			this.xhr.send(formData);  // multipart/form-data
		};

		this.upload_complete = function(res){
			this.uploaded_file = res;
			this.els["container"].addClass("uploaded");

			if(cfg.onupload){
				cfg.onupload.call(res, res);
			}
			//console.log(this.uploadedFile);
		};

		this.set_uploaded_file = function(file){
			this.uploaded_file = file;
			if(this.uploaded_file) {
				this.els["container"].addClass("uploaded");
			}else{
				this.els["container"].removeClass("uploaded");
			}
		};

		this.set_preview_img = function(src){
			if(src) {
				this.els["preview-img"].fadeIn();
				this.els["preview-img"].attr("src", src);
			}else{
				this.els["preview-img"].hide();
				this.els["preview-img"].removeAttr("src");
			}
		};

	};
	//== UI Class

	//== ui class 공통 처리 구문
	if (U.is_function(ax_super)) ax_class.prototype = new ax_super(); // 상속
	root.single_uploader = ax_class; // ax5.ui에 연결

	if (typeof define === "function" && define.amd) {
		define("_ax5_ui_single_uploader", [], function () {
			return ax_class;
		}); // for requireJS
	}
	//== ui class 공통 처리 구문

})(ax5.ui, ax5.ui.root);