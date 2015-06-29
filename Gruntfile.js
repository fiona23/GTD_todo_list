module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [],
                dest: ''
            }
        },
        uglify: {
            options: {
                banner: '/*!<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %>\n* created by <%= pkg.author %>\n*/\n'
            },
            my_target: {
                files: {
                    'dist/js/categoryData.js': ['src/js/categoryData.js'],
                    'dist/js/defaults.js': ['src/js/defaults.js'],
                    'dist/js/init.js': ['src/js/init.js'],
                    'dist/js/operateCategory.js': ['src/js/operateCategory.js'],
                    'dist/js/operateTask.js': ['src/js/operateTask.js'],
                    'dist/js/todoData.js': ['src/js/todoData.js'],
                    'dist/js/util.js': ['src/js/util.js'],
                    'dist/main.js': ['src/main.js'],
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js/",
                    mainConfigFile: "main.js",
                    done: function(done, output) {
                    var duplicates = require('rjs-build-analysis').duplicates(output);
                    if (duplicates.length > 0) {
                        grunt.log.subhead('Duplicates found in requirejs build:');
                        grunt.log.warn(duplicates);
                        done(new Error('r.js built duplicate modules, please check the excludes option.'));
                    }
                    done();
                    }
                }
            }
        },
        less: {
            development: {
                options: {
                  paths: ["/css/"]
                },
                files: {
                  "src/css/style.css": "src/css/style.less"
                }
            }
        },
        cssmin: {
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          target: {
            files: {
              'dist/css/style.css': ['src/css/style.css']
            }
          }
        },
        copy: {
          main: {
            files: [
              {expand: true, cwd: 'src/', src: ['index.html'], dest: 'dist'},
              {expand: true, cwd: 'src/', src: ['img/**'], dest: 'dist'},
            ],
          },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    // 默认执行的任务
    grunt.registerTask('default', ['uglify']);
}