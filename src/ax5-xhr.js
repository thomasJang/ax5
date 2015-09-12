ax5.xhr = (function (){
	var U = ax5.util, getXHR;

	try{
		new ActiveXObject("Msxml2.XMLHTTP");
		getXHR = function(){return new ActiveXObject("Msxml2.XMLHTTP");}
	}catch(e){
		try{
			new ActiveXObject("Microsoft.XMLHTTP");
			getXHR = function(){return new ActiveXObject("Microsoft.XMLHTTP");}
		}catch(e){
			getXHR = "XMLHttpRequest" in window ? function(){return new XMLHttpRequest();} : function(){};
		}
	}
	
	function request(queue, onend){
		var cfg = queue.pop(), http, that, i,
            time_id, ontimeout;
		
		if (typeof cfg === "undefined") {
			onend();
		}
		else
		{
			cfg = U.extend_all(cfg, ax5.xhr.options);
			if (cfg.url != "") {
				http = getXHR();
				// 파라미터 값 문자열로 맞춤 : 오브젝트이면 문자열로 치환합니다.
				cfg.param = U.param(cfg.param, "param");
				// method : GET이면 url 뒤에 ? 파라미터 연결
				if(cfg.method.toUpperCase() == "GET" && cfg.param != "") {
					cfg.url = (cfg.url.search(/\?/) != -1) ? cfg.url + "&" + cfg.param : cfg.url + "?" + cfg.param;
				}

				if (!cfg.response)  cfg.response = cfg.res; // 함수이름 확장
				// xhr.open
				if (cfg.username)   http.open(cfg.method, cfg.url, cfg.async, cfg.username, cfg.password);
				else                http.open(cfg.method, cfg.url, cfg.async);

				// header 셋팅
				if(cfg.method.toUpperCase() == "GET"){
					// GET이면 head 무시
					cfg.header.accept = "*/*", cfg.header['content-type'] = "text/html";
				}
				
				try {
					for ( i in cfg.header ) {
						http.setRequestHeader( i, cfg.header[i] );
					}
				} catch(e) {}
				
				//  authorization headers. The default is false.
				if("withCredentials" in http) http.withCredentials = cfg.withCredentials;
				// todo : withCredentials 이 지원되지 않는 브라우저 일 때 대처법 필요

				// 응답
				http.onreadystatechange = function () {
					if (http.readyState == 4) {
                        if(time_id == -1) return;
                        clearTimeout(time_id), time_id = -1;
						that = {};
						that.response_url= ("responseURL" in http) ? http.responseURL : "";
						that.status      = ("status" in http) ? http.status : "";
						that.result      = http.statusText;
						that.state       = http.readyState;
						that.type        = http.responseType;

						try {
							that.data = ("responseText" in http) ? http.responseText : "";
							if(http.responseType == "JSON" && typeof that.data == "string") that.data = U.parse_json(that.data);
						}catch(e){}

						if (http.status == 200) {
							if (cfg.response) cfg.response.call(that, that.data, that.status, http);
							else console.log(http);
						}
						else
						if (http.status != 0)
						{
							that.error = that.result; // 에러키 추가
							if (cfg.error) {
								cfg.error.call(that, that);
							} else {
								if (cfg.response) cfg.response.call(that, that.data, that.status, http);
								else console.log(http);
							}
						}
						request(queue, onend);
					}
				};
                ontimeout = function(){
                    if(time_id == -1) return;
                    if(http.readyState !== 4) http.abort();
                    time_id = -1;
	                //http.onreadystatechange = null;
                    
                    that = {error:"timeout"};
                    if (cfg.error) {
                        cfg.error.call(that, that);
                    } else {
                        if (cfg.response) cfg.response.call(that, that, that.data, that.status, http);
                        else console.log(http);
                    }
                };
                if( "ontimeout" in http ) http.timeout = cfg.timeout, http.ontimeout = ontimeout;
                else time_id = setTimeout( ontimeout, cfg.timeout);

				http.onerror = function(e){
					that = cfg;
					//that.error = "error";
					if (cfg.error) {
						cfg.error.call(that, that);
					} else {
						if (cfg.response) cfg.response.call(that, that, that.data, that.status, http);
						else console.log(http);
					}
				};

				// 데이터 전송
				http.send(cfg.param);
			}
			
		}
	}
	
	// todo : CORS지원 / 예외사항 처리
	/**
	 * Refer to this by {@link ax5}. <br/>
	 * ax5.xhr({Object}[, {Function}]); 으로 사용하는 함수입니다. XHR요청을 개별또는 큐단위로 처리 합니다.
	 * @namespace ax5.xhr
	 * @param {Object} opts
	 * @param {Function} [onend] - xhr전송이 완료되면 호출되는 콜백함수
	 * @example
	 * ```
	 * // request 옵션정의
	 * config = {
	 * 	header         : {
	 * 		//setRequestHeader 로 추가하게될 헤드 속성
	 * 		'content-type' : {String} ["application/x-www-form-urlencoded; charset=UTF-8"] - request 되는 문서의 content Type,
	 * 		'accept'       : {String} ["*＼*"] - 서버에 응답받기 희망하는 문서 타입,
	 * 	},
	 * 	method         : {String} ["GET"],
	 * 	url            : {String} [""],
	 * 	param          : {String|Object} [""] - 파라미터 형식이나 오브젝트 형식 모두 지원합니다.,
	 * 	async          : {Boolean} [true] - 비동기 요청 여부,
	 * 	username       : {String} [""] - XMLHttpRequest 스펙에 정의된 open() 옶션 사용 안해봐서 잘 모름,
	 * 	password       : {String} [""] - XMLHttpRequest 스펙에 정의된 open() 옶션 사용 안해봐서 잘 모름,
	 * 	withCredentials: {Boolean} [false] - 자격증명을 사용하게 할지 여부,
	 * 	crossDomain    : {Boolean} [false] - 크로스 도메인 허용 여부 : header 속성이 약간 바뀝니다.,
	 * 	timeout        : 0
	 * }
	 * 
	 * ax5.xhr({
	 *    method: "POST",
	 *    url   : "data.php",
	 *    param : "str=1234",
	 *    res   : function (response, status) {
	 *        console.log("success");
	 *        console.log(this);
	 *    },
	 *    error : function () {
	 *        console.log("error");
	 *        console.log(this);
	 *    }
	 * });
	 * 
	 * // req 또는 request 둘다 사용 가능합니다.
	 * ax5.xhr({
	 *    url   : "data.php",
	 *    param : "str=1234",
	 *    res   : function (response, status) {
	 *        // status 값이 200 인지 판단 가능
	 *        console.log(this);
	 *    }
	 * });
	 * // 위와 같이 필요한 옵션만 정의 해서 사용 가능합니다.
	 * 
	 * // 요청을 큐로 만들어 순차적으로 작동하게 하고 종료 시점을 컨트롤 할 수 있습니다.
	 * var xhr_queue = [];
	 * xhr_queue.push({
	 *    method: "POST",
	 *    url   : "../samples/ax5/xhr/data.php",
	 *    param : "str=1234",
	 *    res   : function (response, status) {
	 *        console.log(response);
	 *    }
	 * });
	 * xhr_queue.push({
	 *    method: "POST",
	 *    url   : "../samples/ax5/xhr/data.php",
	 *    param : "str=1234",
	 *    res   : function (response, status) {
	 *        console.log(response);
	 *    }
	 * });
	 * 
	 * ax5.xhr(xhr_queue, function() {
	 *    console.log("큐 완료")
	 * });
	 * ```
	 */
	return function(opts, onend){
		var queue = [].concat(opts);
		request(queue, function(){
			if(onend) onend();
		});
	}
})();

(function () {
	var U = ax5.util, 
		options = {
			header      : {
				'accept'      : "*/*",
				'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
			},
			method         : "GET",
			url            : "",
			param          : "",
			async          : true,
			username       : "",
			password       : "",
			withCredentials: false,
			crossDomain    : false,
			timeout        : 3000
		};
		
/**
 * @member {type} ax5.xhr.options
 * @example
 * ```
 * ax5.xhr.options = {
 * 	header         : {
 * 		//setRequestHeader 로 추가하게될 헤드 속성
 * 		'content-type' : {String} ["application/x-www-form-urlencoded; charset=UTF-8"] - request 되는 문서의 content Type,
 * 		'accept'       : {String} ["*＼*"] - 서버에 응답받기 희망하는 문서 타입,
 * 	},
 * 	method         : {String} ["GET"],
 * 	url            : {String} [""],
 * 	param          : {String|Object} [""] - 파라미터 형식이나 오브젝트 형식 모두 지원합니다.,
 * 	async          : {Boolean} [true] - 비동기 요청 여부,
 * 	username       : {String} [""] - XMLHttpRequest 스펙에 정의된 open() 옶션 사용 안해봐서 잘 모름,
 * 	password       : {String} [""] - XMLHttpRequest 스펙에 정의된 open() 옶션 사용 안해봐서 잘 모름,
 * 	withCredentials: {Boolean} [false] - 자격증명을 사용하게 할지 여부,
 * 	crossDomain    : {Boolean} [false] - 크로스 도메인 허용 여부 : header 속성이 약간 바뀝니다.,
 * 	timeout        : 0
 * } 
 * ```
 */

/**
 * ax5.xhr 통신 기본 값을 설정합니다.
 * @method ax5.xhr.config
 * @param {Object} opts - XHR 요청옵션 기본 값
 * @returns {Object} opts
 * @example
 * ```
 * ax5.xhr.config({
 *	header      : {
 *		'accept'      : "*.*",
 *		'content-type': "application/x-www-form-urlencoded; charset=UTF-8"
 *	},
 *	method         : "GET",
 *	url            : "",
 *	param          : "",
 *	async          : true,
 *	username       : "",
 *	password       : "",
 *	withCredentials: false,
 *	crossDomain    : false,
 *	timeout        : 0
 * });
 *
 * ax5.xhr.config({
 *	header      : {
 *		'accept' : "*.html"
 *	}
 * });
 * // ax5.xhr 요청 기본값 설정
 * ```
 */
	function config(opts){
		options = U.extend_all(options, opts, true);
		return options;
	}

	ax5.util.extend(ax5.xhr, {
		options: options,
		config : config
	});
})();