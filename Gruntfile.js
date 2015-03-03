module.exports = function(grunt) {

  // Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
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
			basic: {
				src: [
					'src/ax5-polyfill.js',
					'src/ax5-core.js',
					'src/ax5-xhr.js',
					'src/ax5-ui.js'
				],
				dest: 'src/ax5.js'
			}
		},
		uglify: {
			options: {
				mangle: false,
				preserveComments: false
			},
			my_target: {
				files: {
					'pub/<%= pkg.name %>-<%= pkg.version %>.min.js': ['src/ax5.js'],
					'pub/<%= pkg.name %>.min.js': ['src/ax5.js']
				}
			}
		},
		watch: {
			theme: {
				files: ['src/less/*.less','src/less/**/*.less'],
				tasks: ['less:theme']
			}
		},
		less: {
			theme: {
				files: {
					"src/css/jellyfish/ax5.css": "src/less/jellyfish/ax5.less"
				}
			}
		}
	});
	//grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('js-concat', ['concat']);
	grunt.registerTask('js', ['concat','uglify']);
	grunt.registerTask('css', ['cssmin']);

	grunt.registerTask('theme-watch', ['less:theme','watch:theme']);
};