module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        files: ['SassExample/assets/js/**/*.js']
    });
};
