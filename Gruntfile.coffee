path = require('path')

config = (grunt) ->
  copy:
    npm:
      files: [
        expand: true
        cwd: ''
        src: ["mixpanel_data_export.js"]
        dest: 'npm/lib'
      ]

  uglify:
    min:
      files:
        'mixpanel_data_export_min.js': ['mixpanel_data_export.js']


module.exports = (grunt) ->
  grunt.initConfig( config(grunt) )

  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['copy', 'uglify'])
