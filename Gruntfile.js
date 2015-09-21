module.exports = function(grunt) {

  // Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			basic: {
				options: {
					stripBanners: true,
					separator: ';',
					banner: '/*\n'+
					' * <%= pkg.name %> - v<%= pkg.version %> \n' +
					' * <%= grunt.template.today("yyyy-mm-dd") %> \n' +
					' * www.axisj.com Javascript UI Library\n' +
					' * \n' +
					' * Copyright 2013, 2015 AXISJ.com and other contributors \n' +
					' * Released under the MIT license \n' +
					' * www.axisj.com/ax5/license \n' +
					' */\n\n',
					separator: '\n\n'
				},
				files: {
					'src/ax5.js': [
						'src/ax5-polyfill.js',
						'src/ax5-core.js',
						'src/ax5-xhr.js',
						'src/ax5-ui.js'
					],
					'src/ui-classes/all.js': [
						'src/ui-classes/*.js', '!src/ui-classes/all.js'
					]
				}
			}
		},

		uglify: {
			options: {
				mangle: false,
				preserveComments: false
			},
			core: {
				files: {
					'pub/<%= pkg.name %>.min.js': ['src/ax5.js']
				}
			},
			ui: {
				files: [{
					expand: true,
					cwd: 'pub/ui',
					src: ['*.js','!*.min.js'],
					dest: 'pub/ui',
					ext: '.min.js'
				}]
			}
		},
		copy: {
			js: {
				files: [
					{expand: true, cwd: 'src/ui-classes/', src: ['**/*.js'], dest: 'pub/ui/'},
					{expand: true, cwd: 'src/', src: ['ax5.js'], dest: 'pub/'}
				]
			},
			css: {
				files: [
					{expand: true, cwd: 'src/css/', src: ['**/*.min.css'], dest: 'pub/css/'}
				]
			}
		},
		watch: {
			theme: {
				files: ['src/scss/*.scss','src/scss/**/*.scss'],
				tasks: ['sass:theme','cssmin','copy:css']
			},
			sample_doc: {
				files: ['samples/css/*.scss'],
				tasks: ['sass:sample_doc']
			},
			lib: {
				files: ['src/**/*.js','!src/**/*.min.js'],
				tasks: ['pub-js']
			},
			css: {
				files: ['src/**/*.min.css'],
				tasks: ['pub-css']
			}
		},
		sass: {
			options: {
				sassDir: 'src/scss',
				cssDir: 'src/css',
				noLineComments: true,
				outputStyle:'nested',
				spawn: false
			},
			theme: {
				files: {
					'src/css/jellyfish/ax5.css': 'src/scss/jellyfish/ax5.scss',
					'src/css/kakao/ax5.css': 'src/scss/kakao/ax5.scss',
					'src/css/dplus/ax5.css': 'src/scss/dplus/ax5.scss',
					'src/css/gajago/ax5.css': 'src/scss/gajago/ax5.scss'
				}
			},
			sample_doc: {
				files: {
					'samples/css/app.css': 'samples/css/app.scss'
				}
			}
		},
		cssmin: {
			options: {
				banner: '/*! \n<%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			target: {
				files: [
					{expand: true, cwd: 'src/css/jellyfish', src: ['*.css', '!*.min.css'], dest: 'src/css/jellyfish', ext: '.min.css'},
					{expand: true, cwd: 'src/css/kakao', src: ['*.css', '!*.min.css'], dest: 'src/css/kakao', ext: '.min.css'},
					{expand: true, cwd: 'src/css/dplus', src: ['*.css', '!*.min.css'], dest: 'src/css/dplus', ext: '.min.css'},
					{expand: true, cwd: 'src/css/gajago', src: ['*.css', '!*.min.css'], dest: 'src/css/gajago', ext: '.min.css'}
				]
			}
		}
	});
	//grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('pub-js', ['concat','uglify:core','copy:js','uglify:ui','watch:lib']);
	//grunt.registerTask('pub-css', ['cssmin','copy:css','watch:css']);
	
	grunt.registerTask('sass-make-theme', ['sass:theme','cssmin','copy:css','watch:theme']);
	grunt.registerTask('sass-make-doc', ['sass:sample_doc','watch:sample_doc']);
};