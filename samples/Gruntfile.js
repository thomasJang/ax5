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
			files: ['install.html','head.html','bottom.html','ax5/util/*.html','ax5/dom/*.html','ax5/xhr/*.html'],
			tasks: ['concat','replace']
		},
        replace: {
            prettyprint: {
                src: ['index.html'],
                overwrite: true,                 // overwrite matched source files
                options: {
                    processTemplates: false
                },
                replacements: [{
                    from: /<pre[^>]*>([^<]*(?:(?!<\/?pre)<[^<]*)*)<\/pre\s*>/gi,
                    to: function (matchedWord, index, fullText, regexMatches) {

                        // matchedWord:  "world"
                        // index:  6
                        // fullText:  "Hello world"
                        // regexMatches:  ["ld"]
                        return '<pre class="prettyprint linenums">'+ regexMatches.join('').replace(/</g, "&lt;") +'</pre>';
                    }
                }]
            }
        }
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    
	grunt.registerTask('합치고-바구꼬-감시하고', ['concat','replace','watch']);
};