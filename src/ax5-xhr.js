/**
 * Refer to this by {@link ax5}.
 * ax5.xhr은 내부에서 AJAX 요청에 대해 queue처리를 하여 순차적으로 요청을 처리하고 응답합니다. 이 처리 과정을 모니터링 할 순 있는 도구도 지원합니다.
 * @namespace ax5.xhr
 */
	// todo : xhr onprocessing 구현
ax5.xhr = (function () {
	var queue = [], queue_status = 0, show_progress = 0, U = ax5.util;
	var http = (function () {
		if (typeof XMLHttpRequest !== "undefined") {
			return new XMLHttpRequest();
		}
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
		return false;
	})();

	/**
	 * XMLHttpRequest 오브젝트를 이용하여 AJAX 통신을 지원합니다.
	 * @method ax5.xhr.request
	 * @param {Object} config
	 * @returns {Boolean}
	 * @example
	 ```
	 // request 옵션정의
	 config = {
	contentType    : {String} ["application/x-www-form-urlencoded; charset=UTF-8"] - request 되는 문서의 content Type,
	accept         : {String} ["*＼*"] - 서버에 응답받기 희망하는 문서 타입,
	addHeader      : {Object} [{}] - setRequestHeader 로 추가하게될 헤드 속성,
	method         : {String} ["GET"],
	url            : {String} [""],
	param          : {String|Object} [""] - 파라미터 형식이나 오브젝트 형식 모두 지원합니다.,
	async          : {Boolean} [true] - 비동기 요청 여부,
	username       : {String} [""] - XMLHttpRequest 스펙에 정의된 open() 옶션 사용 안해봐서 잘 모름,
	password       : {String} [""] - XMLHttpRequest 스펙에 정의된 open() 옶션 사용 안해봐서 잘 모름,
	withCredentials: {Boolean} [false] - 자격증명을 사용하게 할지 여부,
	crossDomain    : {Boolean} [false] - 크로스 도메인 허용 여부 : header 속성이 약간 바뀝니다.,
	timeout        : 0
 }

	 ax5.xhr.req({
    method: "POST",
    url   : "data.php",
    param : "str=1234",
    res   : function (response, status) {
        console.log("success");
        console.log(this);
    },
    error : function () {
        console.log("error");
        console.log(this);
    }
 });

	 // req 또는 request 둘다 사용 가능합니다.
	 ax5.xhr.request({
    url   : "data.php",
    param : "str=1234",
    res   : function (response, status) {
        // status 값이 200 인지 판단 가능
        console.log(this);
    }
 });
	 // 위와 같이 필요한 옵션만 정의 해서 사용 가능합니다.
	 ```
	 */
	function request(config) {
		if(U.is_object(config)) {
			queue.push(U.extend({
				contentType    : "application/x-www-form-urlencoded; charset=UTF-8",
				accept         : "*/*",
				addHeader      : {},
				method         : "GET",
				url            : "",
				param          : "",
				async          : true,
				username       : "",
				password       : "",
				withCredentials: false,
				crossDomain    : false,
				timeout        : 0
			}, config, true));
			if (queue_status === 0) send();
			return true;
		}else{
			return false;
		}
	}

	function send() {
		var cfg = queue.pop(), header = [], that, i;
		if (cfg) {
			queue_status = 1;
			if (cfg.url != "") {
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
				// todo : async 값 교차 테스트 필요

				// header 셋팅
				// You must call setRequestHeader() after open(), but before send().
				http.setRequestHeader('Content-Type', cfg.contentType);
				http.setRequestHeader('Accept', cfg.accept);
				if(!cfg.crossDomain && !cfg.addHeader["X-Requested-With"]){
					cfg.addHeader["X-Requested-With"] = "XMLHttpRequest"
				}
				try {
					for ( i in cfg.addHeader ) {
						http.setRequestHeader( i, cfg.addHeader[i] );
					}
				} catch(e) {}
				//  authorization headers. The default is false.
				http.withCredentials = cfg.withCredentials;
				// The number of milliseconds a request can take before automatically being terminated. A value of 0 (which is the default) means there is no timeout.
				http.timeout = cfg.timeout;
				// 응답
				http.onreadystatechange = function () {
					if (http.readyState == 4) {
						that = {
							response_url: http.responseURL,
							status      : http.status,
							result      : http.statusText,
							state       : http.readyState,
							data        : http.responseText,
							type        : http.responseType
						};
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
						send(); // 다음 큐 호출
					}
				};

				http.ontimeout = function(){
					that = {error:"timeout"};
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
		} else {
			queue_status = 0;
		}
	}

	function stop(){
		if(queue_status === 1) {
			var rs = http.abort();
			queue = [];
			return rs;
		}
		else return true;
	}

	return {
		request: request,
		req    : request,
		stop   : stop
	}
})();