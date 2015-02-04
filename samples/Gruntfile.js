module.exports = function(grunt) {
  // sample code 빌드
	grunt.initConfig({
		pkg: grunt.file.readJSON('../package.json'),
		concat: {
			options: {
				stripBanners: true,
				separator: '\n\n',
				banner: '<!DOCTYPE html>\n<!-- \n' +
				' <%= pkg.name %> - v<%= pkg.version %> \n' +
				' publish date : <%= grunt.template.today("yyyy-mm-dd") %> \n' +
				'-->\n',
				separator: '\n\n<!-- split -->\n<div class="block-end"></div>\n\n'
			},
			basic: {
				src: [
					'head.html',
                    'install.html',
					'ax5/util/*.html',
					'ax5/dom/*.html',
					'ax5/xhr/*.html',
					'bottom.html'
				],
				dest: 'index.html'
			}
		},
		watch: {
			files: ['*.html','ax5/util/*.html','ax5/dom/*.html','ax5/xhr/*.html'],
			tasks: ['concat']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('make-sample', ['concat','watch']);
};