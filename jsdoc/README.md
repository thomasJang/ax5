forked from davidshimjs/jaguarjs-jsdoc

axisj-jsdoc
---
- [Demonstration](http://dev.axisj.com)
- [Documentation](http://newdoc.axisj.com)
- [Website](http://www.axisj.com)
- [Facebook](http://facebook.com/axisj)
- [Google+](http://google.com/+axisj)

Usage
---
###nodejs와 gruntjs는 설치 되었다고 가정 하겠습니다. 
(만약 관련 정보가 필요하시다면. 영어버전 보실 실력이면 굳이 필요 없으니 번역본 링크 입니다.)
- [nodejs한글번역](http://nodejs.sideeffect.kr/docs/)
- [gruntjs한글번역](http://gruntjs-kr.herokuapp.com/getting-started)

###소스를 받아보시면 root에 Gruntfile.js가 있습니다.
```
/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    var path = require('path');

    var DOCU_PATH = 'document'; // html 생성 폴더명 Gruntfile로부터 상대적위치
    var SOURCE_PATH = '../axisj/'; // jsdoc을 추출할 위치 Gruntfile로부터 상대적위치

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'), // 이 파일안에 변수모음이 있다고 생각하시면 됩니다.

        /* 이 부분은 WAS를 연결하는 것 같은데 저는 안 썻습니다. 궁금한건 저 위에 데이빗심씨에게 문의하십시요. */
        connect: {
            options: {
                hostname: '*'
            },
            demo: {
                options: {
                    port: 2016,
                    base: DOCU_PATH,
                    middleware: function (connect, options) {
                        return [
                            require('connect-livereload')(),
                            connect.static(path.resolve(options.base))
                        ];
                    }
                }
            }
        },

        /* 이건 less파일 변화를 감지해서 css를 만들어주는 것입니다. */
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: ['less/**/*.less'],
                tasks: ['less']
            },
            lesscopy: {
                files: ['static/styles/axisjdoc.css'],
                tasks: ['copy:css']
            },
            jscopy: {
                files: ['static/scripts/main.js'],
                tasks: ['copy:js']
            },
            jsdoc: {
                files: ['**/*.tmpl', '*.js'],
                tasks: ['jsdoc']
            }
        },

        /* 도규먼트 생성 폴더를 지워줍니다. */
        clean: {
            demo: {
                src: DOCU_PATH
            }
        },

        /* 도큐먼트를 만들는 구문 입니다. 제일 중요하지요. */
        jsdoc: {
            demo: {
                src: [
	                SOURCE_PATH + 'lib/AXConfig.js',
	                SOURCE_PATH + 'lib/AXUtil.js',

                    // You can add README.md file for index page at documentations.
                    'index.md'
                ],
                options: {
                    verbose: true,
                    destination: DOCU_PATH,
                    configure: 'conf.json',
                    template: './',
                    'private': false
                }
            }
        },

        less: {
            dist: {
                src: 'less/**/axisjdoc.less',
                dest: 'static/styles/axisjdoc.css'
            }
        },

        /* static 이라는 폴더에 내용물을 document 안에 복사합니다. jsdoc하면 publish.js에서 2depth까지 복사 떠주는데. 이건 watch가 이 파일은 바뀔때마다 복사하기 위함입니다.  */
        copy: {
            css: {
                src: 'static/styles/axisjdoc.css',
                dest: DOCU_PATH + '/styles/axisjdoc.css'
            },

            js: {
                src: 'static/scripts/main.js',
                dest: DOCU_PATH + '/scripts/main.js'
            }
        }
    });

    // Load task libraries
    [
        'grunt-contrib-connect',
        'grunt-contrib-watch',
        'grunt-contrib-copy',
        'grunt-contrib-clean',
        'grunt-contrib-less',
        'grunt-jsdoc',
    ].forEach(function (taskName) {
        grunt.loadNpmTasks(taskName);
    });

    // Definitions of tasks
    /*
        watch_run 실행 시켜주면 끝~
        $ /usr/local/bin/grunt --gruntfile /Users/tom/Works/AXISJ/axisj-jsdoc/Gruntfile-for-samples.js watch_run
    */
    grunt.registerTask('watch_run', 'Watch project files', [
        'axisj_jsdoc_bulid',
        //'connect:demo',
        'watch'
    ]);
    /*
        watch 안하고 빌드만 하려면 axisj_jsdoc_bulid
        $ /usr/local/bin/grunt --gruntfile /Users/tom/Works/AXISJ/axisj-jsdoc/Gruntfile-for-samples.js axisj_jsdoc_bulid
    */
    grunt.registerTask('axisj_jsdoc_bulid', 'Create documentations for demo', [
        'less',
        'clean:demo',
        'jsdoc:demo'
    ]);
};
```

###conf.json
---

```
{
	"tags": {
		"allowUnknownTags" : true
	},
	"plugins": ["plugins/markdown"],
	"templates": {
		"cleverLinks": true,
		"monospaceLinks": true,
		"default": {
			"outputSourceFiles" : true
		},
		"applicationName": "AXISJ API",
		"git_liblink": "https://github.com/axisj-com/axisj/blob/master/lib/", // 이부분 추가 했는데요. 메소드 명 옆에 파일이름과 줄번호를 gitHub링크로 보냅니다.
		"disqus": "",
		"googleAnalytics": "",
		"openGraph": {
			"title": "AXISJ JSDOC",
			"type": "JSDOC API",
			"image": "http://dev.axisj.com/ui/AXJ.png",
			"site_name": "풀 스택 오픈소스 자바스크립트 UI 프레임워크 - AXISJ",
			"url": "http://newdoc.axisj.com"
		},
		"meta": {
			"title": "AXISJ API",
			"description": "풀 스택 오픈소스 자바스크립트 UI 프레임워크 AXISJ JSDOC API서비스 입니다.",
			"keyword": "AXISJ, JSDOC, API"
		}
	},
	"markdown": {
		"parser": "gfm",
		"hardwrap": true,
		"tags": ["examples"]
	}
}
```

License
---
This project under the MIT License. and this project refered by default template for JSDoc 3.