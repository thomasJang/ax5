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