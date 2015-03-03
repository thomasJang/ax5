module.exports = function(grunt) {
  // sample code 빌드
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				stripBanners: true,
				separator: '\n\n',
				banner: '<!DOCTYPE html>\n<!-- \n' +
				' <%= pkg.name %> - v<%= pkg.version %> \n' +
				' publish date : <%= grunt.template.today("yyyy-mm-dd") %> \n' +
				'-->\n',
				separator: '\n\n<!-- split -->\n\n'
			},
            core: {
				src: [
					'samples/core/head.html',
                    'samples/core/install.html',
					'samples/ax5/util/*.html',
					'samples/ax5/dom/*.html',
					'samples/ax5/xhr/*.html',
					'samples/core/bottom.html'
				],
				dest: 'samples/index.html'
			},
            ui: {
                src: [
                    'samples/ui/head.html',
                    'samples/ax5/ui/*.html',
                    'samples/ui/bottom.html'
                ],
                dest: 'samples/ui.html'
            }
		},
		watch: {
            core: {
                files: ['samples/core/*.html', 'samples/ax5/util/*.html', 'samples/ax5/dom/*.html', 'samples/ax5/xhr/*.html'],
                tasks: ['concat:core', 'replace:core']
            },
            ui: {
                files: ['samples/ui/*.html','samples/ax5/ui/*.html'],
                tasks: ['concat:ui', 'replace:ui']
            }
		},
        replace: {
            core: {
                src: ['samples/index.html'],
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
            },
            ui: {
                src: ['samples/ui.html'],
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
    
	grunt.registerTask('ax5-core', ['concat:core','replace:core','watch:core']);
    grunt.registerTask('ax5-ui', ['concat:ui','replace:ui','watch:ui']);
};