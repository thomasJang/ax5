/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    var path = require('path');
    var DEMO_PATH = 'document';
    var DEMO_SAMPLE_PATH = '../';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        connect: {
            options: {
                hostname: '*'
            },
            demo: {
                options: {
                    port: 2016,
                    base: DEMO_PATH,
                    middleware: function (connect, options) {
                        return [
                            require('connect-livereload')(),
                            connect.static(path.resolve(options.base))
                        ];
                    }
                }
            }
        },

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

        clean: {
            demo: {
                src: DEMO_PATH
            }
        },

        jsdoc: {
            demo: {
                src: [
	                DEMO_SAMPLE_PATH + 'src/ax5.js',

                    // You can add README.md file for index page at documentations.
                    'index.md'
                ],
                options: {
                    verbose: true,
                    destination: DEMO_PATH,
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

        copy: {
            css: {
                src: 'static/styles/axisjdoc.css',
                dest: DEMO_PATH + '/styles/axisjdoc.css'
            },

            js: {
                src: 'static/scripts/main.js',
                dest: DEMO_PATH + '/scripts/main.js'
            }
        },

	    wkhtmltopdf: {
		    dev: {
			    /*
			    src: [
					DEMO_PATH + 'Array.html',
					DEMO_PATH + 'AXCalendar.html',
					DEMO_PATH + 'AXConfig.html',
					DEMO_PATH + 'AXContextMenu.html',
					DEMO_PATH + 'AXContextMenuClass.html',
					DEMO_PATH + 'AXEditor.html',
					DEMO_PATH + 'axf.html',
					DEMO_PATH + 'AXGrid.html',
					DEMO_PATH + 'AXInputConverter.html',
					DEMO_PATH + 'AXJ.html',
					DEMO_PATH + 'AXMask.html',
					DEMO_PATH + 'AXMobileMenu.html',
					DEMO_PATH + 'AXMobileModal.html',
					DEMO_PATH + 'AXModal.html',
					DEMO_PATH + 'AXMultiSelect.html',
					DEMO_PATH + 'AXNotification.html',
					DEMO_PATH + 'AXPopOver.html',
					DEMO_PATH + 'AXPopOverClass.html',
					DEMO_PATH + 'AXProgress.html',
					DEMO_PATH + 'AXReq.html',
					DEMO_PATH + 'AXReqQue.html',
					DEMO_PATH + 'AXResizable.html',
					DEMO_PATH + 'AXScroll.html',
					DEMO_PATH + 'AXSearch.html',
					DEMO_PATH + 'AXSelectConverter.html',
					DEMO_PATH + 'AXSlideViewer.html',
					DEMO_PATH + 'AXTabClass.html',
					DEMO_PATH + 'AXTopDownMenu.html',
					DEMO_PATH + 'AXTree.html',
					DEMO_PATH + 'AXUpload5.html',
					DEMO_PATH + 'AXUserSelect.html',
					DEMO_PATH + 'AXValidator.html',
					DEMO_PATH + 'Class.html',
					DEMO_PATH + 'Date.html',
					DEMO_PATH + 'Error.html',
					DEMO_PATH + 'Function.html',
					DEMO_PATH + 'index.html',
					DEMO_PATH + 'jQueryExtends.html',
					DEMO_PATH + 'Number.html',
					DEMO_PATH + 'Object.html',
					DEMO_PATH + 'String.html'
				],
				*/
			    src: DEMO_PATH + '/*.html',
			    dest: 'pdf/'
		    },
		    dev2: {
			    src: [
				    DEMO_PATH + '/index.html',
				    DEMO_PATH + '/String.html'

			    ],
			    dest: 'pdf/'
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
		'grunt-wkhtmltopdf'
    ].forEach(function (taskName) {
        grunt.loadNpmTasks(taskName);
    });

    // Definitions of tasks

    grunt.registerTask('watch_run', 'Watch project files', [
        'axisj_jsdoc_bulid',
        //'connect:demo',
        'watch'
    ]);

    grunt.registerTask('axisj_jsdoc_bulid', 'Create documentations for demo', [
        'less',
        'clean:demo',
        'jsdoc:demo'
    ]);

	/*
	grunt.registerTask('axisj_jsdoc_topdf', 'Create documentations for pdf', [
		'wkhtmltopdf:dev'
	]);
	*/
};
