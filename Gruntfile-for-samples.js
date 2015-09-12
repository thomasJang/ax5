module.exports = function(grunt) {
  // sample code 빌드
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
            samples: {
	            options: {
		            stripBanners: true,
		            separator: '\n\n',
		            banner: '<!DOCTYPE html>\n<!-- \n' +
		            ' <%= pkg.name %> - v<%= pkg.version %> \n' +
		            ' publish date : <%= grunt.template.today("yyyy-mm-dd") %> \n' +
		            '-->\n',
		            separator: '\n\n<!-- split -->\n\n'
	            },
				files: {
					'samples/index.html': ['samples/layout/head.html', 'samples/layout/visual-dom.html', 'samples/layout/install.html', 'samples/ax5/util/*.html', 'samples/ax5/dom/*.html', 'samples/ax5/xhr/*.html', 'samples/layout/bottom.html'],
					'samples/css.html': ['samples/layout/head.html', 'samples/layout/visual-css.html', 'samples/ax5/css/*.html', 'samples/layout/bottom.html'],
					'samples/ui-class.html': ['samples/layout/head.html','samples/layout/visual-ui.html','samples/ax5/ui/*.html','samples/layout/bottom.html']
				}
			}
		},
        replace: {
	        samples: {
                src: ['samples/index.html','samples/css.html','samples/ui-class.html'],
                overwrite: true,                 // overwrite matched source files
                options: {
                    processTemplates: false
                },
                replacements: [{
                    from: /<pre[^>]*>([^<]*(?:(?!<\/?pre)<[^<]*)*)<\/pre\s*>/gi,
                    to: function (matchedWord, index, fullText, regexMatches) {
                        if(regexMatches.join('').substr(0, 9) == "$noscript"){
                            return '<pre class="prettyprint linenums">'+ regexMatches.join('').replace(/\$noscript\$/g, "").replace(/</g, "&lt;") +'</pre>';
                        }else{
                            return '<pre class="prettyprint linenums">'+ regexMatches.join('').replace(/</g, "&lt;") +'</pre>' + '<h4>Result</h4>' + regexMatches.join('');
                        }
                    }
                }]
            },
	        url: {
		        src: ['samples/index.html','samples/css.html','samples/ui-class.html'],
		        overwrite: true,                 // overwrite matched source files
		        options: {
			        processTemplates: false
		        },
		        replacements: [{
			        from: /<url[^>]*>([^<]*(?:(?!<\/?url)<[^<]*)*)<\/url\s*>/gi,
			        to: function (matchedWord, index, fullText, regexMatches) {
				        return '<a href="' + regexMatches.join('') + '" target="_blank">'+ regexMatches.join('') +'</a>';
			        }
		        }]
	        }
        },
		watch: {
			samples: {
				files: ['samples/ax5/util/*.html', 'samples/ax5/dom/*.html', 'samples/ax5/xhr/*.html','samples/ax5/css/*.html','samples/ax5/ui/*.html'],
				tasks: ['concat:samples', 'replace:samples', 'replace:url']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-text-replace');
    
	grunt.registerTask('samples', ['concat:samples','replace:samples','replace:url','watch:samples']);
};