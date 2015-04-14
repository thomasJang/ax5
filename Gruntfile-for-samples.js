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
					'samples/layout/head.html',
					'samples/layout/visual-dom.html',
					'samples/layout/install.html',
					'samples/ax5/util/*.html',
					'samples/ax5/dom/*.html',
					'samples/ax5/xhr/*.html',
					'samples/layout/bottom.html'
				],
				dest: 'samples/index.html'
			},
            css: {
                src: [
                    'samples/layout/head.html',
	                'samples/layout/visual-css.html',
                    'samples/ax5/css/*.html',
                    'samples/layout/bottom.html'
                ],
                dest: 'samples/css.html'
            },
            ui_class: {
                src: [
                    'samples/layout/head.html',
                    'samples/layout/visual-ui.html',
                    'samples/ax5/ui/*.html',
                    'samples/layout/bottom.html'
                ],
                dest: 'samples/ui-class.html'
            }
		},
		watch: {
            core: {
                files: ['samples/ax5/util/*.html', 'samples/ax5/dom/*.html', 'samples/ax5/xhr/*.html'],
                tasks: ['concat:core', 'replace:core']
            },
            css: {
                files: ['samples/ax5/css/*.html'],
                tasks: ['concat:css', 'replace:css']
            },
            ui_class: {
                files: ['samples/ax5/ui/*.html'],
                tasks: ['concat:ui_class', 'replace:ui_class']
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

                        //var pre_body = regexMatches.join('');
                        if(regexMatches.join('').substr(0, 9) == "$noscript"){
                            return '<pre class="prettyprint linenums">'+ regexMatches.join('').replace(/\$noscript\$/g, "").replace(/</g, "&lt;") +'</pre>';
                        }else{
                            return '<pre class="prettyprint linenums">'+ regexMatches.join('').replace(/</g, "&lt;") +'</pre>' + '<h4>Result</h4>' + regexMatches.join('');
                        }

                        // matchedWord:  "world"
                        // index:  6
                        // fullText:  "Hello world"
                        // regexMatches:  ["ld"]
                    }
                }]
            },
            css: {
                src: ['samples/css.html'],
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
            ui_class: {
                src: ['samples/ui-class.html'],
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
    grunt.registerTask('ax5-css', ['concat:css','replace:css','watch:css']);
    grunt.registerTask('ax5-ui-class', ['concat:ui_class','replace:ui_class','watch:ui_class']);
};