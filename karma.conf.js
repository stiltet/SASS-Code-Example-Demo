module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        files: ['www/assets/js/**/*.js']
    });
};