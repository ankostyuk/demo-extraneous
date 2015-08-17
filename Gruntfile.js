//
module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            deps: ['node_modules']
        },

        jshint: {
            options: {
                force: true,
                node: true,
                '-W069': true
            },
            src: ['src/**/*.js']
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [
                    'test/fns/reg_docs/parser-test.js',
                    'test/fedresurs/bankruptcy/parser-test.js'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('build', ['jshint:src', 'test']);
};
