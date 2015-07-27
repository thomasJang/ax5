module.exports = function(grunt) {
  // sample code 빌드

	grunt.registerMultiTask('ax5_mobile_inline', '', function () {
		var options = this.options({});
		var file_names = grunt.file.expand({cwd: options.pwd}, options.filter);
		// grunt.log.writeln( JSON.stringify(files) );

	});

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			run: {
				files: ['mobile/**/*.*'],
				tasks: ['ax5_mobile_inline']
			}
		},
		ax5_mobile_inline: {
			run: {
				options: {
					pwd: 'mobile/form',
					filter: '*'
				}
			}
		}
	});
	grunt.loadNpmTasks('ax5_mobile_inline');
    
	grunt.registerTask('run', ['ax5_mobile_inline','watch']);
};