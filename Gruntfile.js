module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['public/css/*.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['path/to/**/*.css']
      }
    },
    jshint: {
      options: {
        node: true
      },
      all: ['Gruntfile.js', 'public/**/*.js', 'app/**/*.js', '!node_modules/**', '!public/assets/**']
    },
	jasmine_node: {
		options: {
		  forceExit: true,
		  match: '.',
		  matchall: false,
		  extensions: 'js',
		  specNameMatcher: 'unitspec'
		},
		all: []
	  }
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jasmine-node');

  // Default task(s).
  grunt.registerTask('l', ['csslint']);
  grunt.registerTask('jh', ['jshint']);
  grunt.registerTask('j', ['jasmine_node']);

};