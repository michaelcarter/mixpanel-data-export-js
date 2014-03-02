path = require('path')

config = (grunt) ->

  copy:
    main:
      files: [
        expand: true
        cwd: 'assets/javascripts/spec/fixtures/'
        src: ['**']
        dest: 'www/js/spec/fixtures/'
      ]

  haml:
    compile:
      options:
        placement: "amd"
        language: "coffee"
        target: "js"
      files: grunt.file.expandMapping ['assets/javascripts/app/templates/**/*.haml'], 'www/js/'
        rename: (base, path) ->
          base + path.replace(/assets\/javascripts\//,'').replace(/\.haml$/, '.js')

  mocha_phantomjs:
    options:
      reporter: 'dot'
    nerds: ['www/js/spec/index.html']

module.exports = (grunt) ->

  grunt.initConfig( config(grunt) )

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-mocha-phantomjs')
  grunt.registerTask('default', ['copy'])
