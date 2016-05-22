path = require('path')

config = (grunt) ->

  clean: ['tmp', 'dist']

  browserify:
    release:
      files:
        'dist/mixpanel_data_export.js': ['src/mixpanel_data_export.js']
      options:
        browserifyOptions:
          standalone: 'MixpanelExport'
        exclude: ['xmlhttprequest', 'request']
    tests:
      src: [ './tmp/tests_to_browserify.js' ],
      dest: './tmp/browserified_tests.js',
      options:
        external: [ '../../' ],
        debug: true

  uglify:
    release:
      files:
        'dist/mixpanel_data_export.min.js': ['dist/mixpanel_data_export.js']

  compress:
    release:
      options:
        mode: 'gzip'
      files: [
        expand: true,
        src: ['dist/*.min.js'],
        ext: '.min.gz.js'
      ]

  shell:
    generateTestList:
      command: 'mkdir -p ./tmp && find test -name \'*.js\' | sed -e \'s/$/");/\' | sed -e \'s/^/require("..\\//\' > tmp/tests_to_browserify.js'

  mochaTest:
    test:
      options:
        reporter: 'spec',
      src: ['test/**/*.js']

module.exports = (grunt) ->
  grunt.initConfig( config(grunt) )

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['release'])

  grunt.registerTask('release', [
    'browserify',
    'uglify',
    'compress:release'
  ])

  grunt.registerTask('test', [
    'clean'
    'mochaTest'
  ])
