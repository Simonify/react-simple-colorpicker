/* jshint node:true */
module.exports = function(grunt) {

  "use strict";

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    env : {
      dev : {
        NODE_ENV : "development"
      },
      dist : {
        NODE_ENV : "production"
      }
    },

    uglify : {
      options : {
        report : "gzip",
        compress: {
          unsafe: true
        }
      },
      dist : {
        src  : "<%= paths.output %>",
        dest : "<%= paths.output %>"
      }
    },

    paths: {
      entry: './lib/index',
      output: './pkg/index'
    },

    browserify: {
      options: {
        transform: [
          "reactify",
          "envify"
        ]
      },
      dist : {
        src  : "<%= paths.entry %>",
        dest : "<%= paths.output %>"
      }
    },

    react: {
      files: {
        expand: true,
        cwd: 'lib',
        src: ['**/*.*'],
        dest: 'pkg',
        ext: '.js'
      }
    }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-react");

  grunt.registerTask("dist", ["env:dist", "react", "browserify:dist", "uglify:dist"]);

};
