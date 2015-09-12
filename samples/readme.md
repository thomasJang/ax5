# ax5 sample 빌드

ax5 폴더 아래에 위치한 util, dom, xhr 폴더안에 위치한 html파일들은 index.html 로 합쳐주고 
파일이 변경됨을 감지하여 실시간 빌드 하는 gruntfile.js 에 대한 설명입니다.

```
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
				separator: '\n\n<!-- split -->\n\n'
			},
			basic: {
				src: [
					'head.html',
					'ax5/util/*.html',
					'ax5/dom/*.html',
					'ax5/xhr/*.html',
					'bottom.html'
				],
				dest: 'index.html'
			}
		},
		watch: {
			files: ['ax5/util/*.html','ax5/dom/*.html','ax5/xhr/*.html'],
			tasks: ['concat']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('make-sample', ['concat','watch']);
};
```

watch 는 파일변경을 감지하고 concat은 파일을 합쳐줍니다. 

ax5 sample페이지를 원페이지로 제작하기 위한 준비작업 입니다.
