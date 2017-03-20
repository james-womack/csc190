/// <binding Clean='clean' ProjectOpened='dev' />
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ['wwwroot/js/**/*.min.js', 'wwwroot/css/**/*.css'],
        jshint: {
            files: ['wwwroot/js/**/*.js'],
            options: {
                '-W069': false,
            }
        },
        // Sass
        sass: {
            options: {
                sourceMap: true, // Create source map
                outputStyle: 'compressed' // Minify output
            },
            dist: {
                files: [
                    {
                        expand: true, // Recursive
                        cwd: "wwwroot/sass", // The startup directory
                        src: ["**/*.scss"], // Source files
                        dest: "wwwroot/css", // Destination
                        ext: ".css" // File extension 
                    }
                ]
            }
        },

        uglify : {
            files: {
                src: 'wwwroot/js/**/*.js',
                dest: './',
                expand: true,
                ext: '.min.js'
            }
        },

        // Watch
        watch: {
            css: {
                files: ['wwwroot/sass/**/*.scss', 'wwwroot/js/**/*.js'],
                tasks: ['clean', 'jshint', 'sass', 'uglify'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('dev', ['watch']);
    grunt.registerTask('prod', ['clean', 'sass', 'jshint', 'uglify']);
};