/**
 * http://gruntjs.com/configuring-tasks
 */
module.exports = function (grunt) {
    var path = require('path');
    var DOCU_PATH = 'document';
    var SOURCE_PATH = '../src';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
	    
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
                src: DOCU_PATH
            }
        },

        jsdoc: {
            demo: {
                src: [
	                SOURCE_PATH + '/ax5.js',
                    SOURCE_PATH + '/ui-classes/*.js',
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

        copy: {
            css: {
                src: 'static/styles/axisjdoc.css',
                dest: DOCU_PATH + '/styles/axisjdoc.css'
            },
            js: {
                src: 'static/scripts/main.js',
                dest: DOCU_PATH + '/scripts/main.js'
            }
        },

	    wkhtmltopdf: {
		    dev: {
			    src: [
				    DOCU_PATH + '/*.html'
			    ],
			    dest: DOCU_PATH + '/pdf/'
		    }
	    }
    });

    // Load task libraries
    [
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
        'watch'
    ]);

    grunt.registerTask('axisj_jsdoc_bulid', 'Create documentations for demo', [
        'less',
        'clean:demo',
        'jsdoc:demo'
    ]);


	grunt.registerTask('axisj_jsdoc_topdf', 'Create documentations for pdf', [
		'wkhtmltopdf:dev'
	]);
};
