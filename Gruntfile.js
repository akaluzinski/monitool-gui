module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            source: {
                files: [
                    'Gruntfile.js',
                    'app/**/*.js',
                    'app/**/**/*.js',
                    'app/**/*.html',
                    'app/**/**/*.html',
                    'app/**/**/**/*.html',
                    'app/themes/**/css/*.css'
                ],
                tasks: ['jshint:all', 'clean:build', 'build']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'app/js/*.js']
        },
        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '(function() { /** GENERATED BY GRUNT. DO NOT EDIT THIS FILE ! **/ "use strict";\n\n {%= __ngModule %} })();',
                name: 'monitool.common.i18n'
            }
        },
        bower: {
            copy: {
                options: {
                    verbose: true,
                    targetDir: './public/assets/dist/lib',
                    forceLatest: true,
                    cleanTargetDir: true,
                    layout: "byComponent"
                }
            }
        },
        copy: {
            components2dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/assets/bower_components',
                        src: ['**'],
                        dest: 'public/assets/dist/lib/'
                    }
                ]
            },
            themes: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/themes',
                        src: '**',
                        dest: 'public/assets/dist/themes/'
                    }
                ]
            },
            partials: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/partials',
                        src: ['**'],
                        dest: 'public/assets/dist/views/'
                    }
                ]
            }
        },
        html2js: {
            appTemplates: {
                options: {
                    module: 'monitool.app.views',
                    base: 'app/',
                    rename: function (name) { return '/' + name; }
                },
                src: ['app/views/**/*.html'],
                dest: 'app/.tmp/templates/app.js'
            }
        },
        concat: {
            runapp: {
                src: ['app/js/runapps.js'],
                dest: 'public/assets/dist/js/runapps.js'
            },
            core: {
                src: [
                    'app/js/core/Class.js',
                    'app/js/core/Mvc/ServiceLocator.js',
                    'app/js/core/Mvc/*.js',
                    'app/js/core/Events/*.js'
                ],
                dest: 'public/assets/dist/js/core.js'
            },
            common: {
                src: [
                    'app/.tmp/templates/common.js',
                    'app/js/common/common.js',
                    'app/js/common/i18n/i18n.js',
                    'app/js/common/configs/*.js',
                    'app/js/common/directives/*.js',
                    'app/js/common/resources/*.js',
                    'app/js/common/services/*.js'
                ],
                dest: 'public/assets/dist/js/common.js'
            },
            app: {
                src: [
                    'app/.tmp/templates/app.js',
                    'app/js/app/app.js',
                    'app/js/app/configs/*.js',
                    'app/js/app/resources/*.js',
                    'app/js/app/services/*.js',
                    'app/js/app/directives/*.js',
                    'app/js/app/controllers/*.js',
                    'app/js/app/*.js'
                ],
                dest: 'public/assets/dist/js/app.js'
            }
        },
        clean: {
            build: [
                'app/.tmp/',
                'public/assets/dist/css',
                'public/assets/dist/img',
                'public/assets/dist/js',
                'public/assets/dist/themes',
                'public/assets/dist/vendor',
                'public/assets/dist/views',
                'public/assets/dist/lib'
            ],
            prod: [
                'public/assets/dist/js'
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('build', [
        'copy:themes',
        'copy:components2dist',
        'copy:partials',
        'ngconstant',
        'html2js',
        'concat'
    ]);

    grunt.registerTask('build:production', [
        'bower:copy',
        'copy:themes',
        'copy:components2dist',
        'copy:partials',
        'ngconstant',
        'html2js',
        'concat',
        'uglify',
        'clean:prod'
    ]);

    grunt.registerTask('default', ['watch:source']);
};