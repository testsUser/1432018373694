/*jshint camelcase:false*/

module.exports = function (grunt)
{
    'use strict';

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var config = {
        app: 'app'
    };

    grunt.initConfig({
        config: config, watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }, files: ['<%= config.app %>/*.html', '<%= config.app %>/*.js']
            }
        }, connect: {
            options: {
                port: 9000, livereload: 35729, hostname: 'localhost'
            }, livereload: {
                options: {
                    open: true, middleware: function (connect)
                    {
                        return [connect().use('/bower_components', connect.static('./bower_components')), connect.static(config.app)

                        ];
                    }
                }
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'app/*.js', 'test/**/*.js'],
            options: {
                ignores: 'app/bower_components'
            }
        },

        wiredep: {
            task: {
                src: [
                    'app/**/*.html'
                ]
            }
        }

    });

    grunt.registerTask('serve', function ()
    {
        grunt.task.run(['connect:livereload', 'watch']);
    });

    grunt.registerTask('jshint', ['jshint']);

    grunt.registerTask('karma', ['karma']);

    grunt.registerTask('wiredep', ['wiredep']);

    grunt.registerTask('default', ['serve']);

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-wiredep');
};
