[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-OpensourceJavascriptUILibrary-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5 

Optimized for modern browsers Javascript dom Control / Touch UI library


## link
- [API테스터] (http://ax5.io)
- [API JSDOC] (http://ax5.io/jsdoc)
- [API SAMPLE] (http://ax5.io/samples)


## Install
```html
<head>
    <meta charset="UTF-8"/>
    <title>ax5</title>
    <u><script type="text/javascript" src="pub/ax5.min.js"></script></u>
</head>
```

## ax5.dom
```html
<div id="div-ax5-dom-css" class="script-result">
	<div class="target-div"></div>
</div>
<script>
	(function(){
		var util = ax5.util, el = ax5.dom("#div-ax5-dom-css");
		var po = [];
 
		// 인자값을 문자열로 했을 땐 get
		po.push( 'el.css("width") => ' + el.css("width") );
 
		var target_div = el.find(".target-div");
 
		// 인자값을 Object로 했을 땐 set
		target_div.css({height:50, background:"#ccc", margin:"10px", "text-align":"center", "line-height":50, border:"2px solid #000", "border-radius":10});
		po.push( 'target_div.css("height") => ' + target_div.css("height") );
		target_div.html("height: 50px;");
 
		// 한번에 여러개의 속성 가져오기
		po.push( util.to_json( target_div.css(["width","height","border"]) ) );
		el.append( po.join('<br/>') );
	})();
</script>
```

## Yoon Added explain
```
<script type="text/javascript">
module.exports = function(grunt) {
	// sample code 빌드

	// module inline 생성
	grunt.registerMultiTask('ax5_inline', '', function () {
		var options = this.options({});
		var file_names = grunt.file.expand({cwd: options.pwd}, options.filter);
		grunt.log.writeln( JSON.stringify(file_names) );

	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ax5_inline: {
			run: {
				options: {
					pwd: 'mobile/form',
					filter: '*'
				}
			}
		},
		watch: {
			run: {
				files: ['mobile/**/*.*', '!mobile/**/*.css'],
				tasks: ['sass', 'ax5_inline']
			}
		},
		sass: {
			options: {
				noLineComments: true,
				outputStyle:'nested',
				spawn: false
			},
			doc: {
				files: {
					'mobile/static/css/app.css': 'mobile/static/css/app.scss'
				}
			}
		},

	});

	//grunt.loadNpmTasks('ax5_inline');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');


	grunt.registerTask('marko-run', ['sass', 'ax5_inline', 'watch']);
};
</script>
```