module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            src: ['src/jquery.responsiveImage.js']
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> Last build: <%= grunt.template.today("yyyy-mm-dd") %> Licensed MIT */\n',
                sourceMap: true,
                sourceMapName: 'build/jquery.responsiveImage.map'
            },
            build: {
                src: 'src/jquery.responsiveImage.js',
                dest: 'build/jquery.responsiveImage.min.js'
            }
        },

        clean: {
            build: 'build'
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('build', ['clean', 'jshint', 'uglify']);

};