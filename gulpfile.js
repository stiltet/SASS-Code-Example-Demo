var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    karma = require('karma'),
    uglify = require('gulp-uglify'),
    ignore = require('gulp-ignore'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect-multi')(),
    del = require('del');

var rootDir = 'SASSExample',
    stylesInput = rootDir + '/assets/sass/**/*.scss',
    stylesOutput = rootDir + '/dist/css';
    scriptsInput = rootDir + '/assets/js/**/*.js',
    scriptsOutput = rootDir + '/dist/js',
    scriptTestsInput = rootDir + '/assets/js/**/*_spec.js',
    imageInput = rootDir + '/assets/img/*',
    imageOutput = rootDir + '/dist/img',
    htmlLocation = rootDir + '/**/*.html',
    autoprefixerOptions = {
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    },
    sassOptions = {
        errLogToConsole: true,
        style: 'expanded'
    },
    imageminOptions = {
        progressive: true
    };

gulp.task('styles', ['clean-styles'], function () {
    return gulp.src(stylesInput)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(stylesOutput))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(stylesOutput))
        .pipe(connect.reload())
        .pipe(notify({ message: 'Styles task complete!' }));
});

gulp.task('scripts', ['clean-scripts'], function () {
    return gulp.src(['!' + scriptTestsInput, scriptsInput.replace("/*.js", "/!(Controller)*.js"), scriptsInput.replace("/*.js", "/Controller.js"),])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(scriptsOutput))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(scriptsOutput))
        .pipe(connect.reload())
        .pipe(notify({ message: 'Scripts task complete!' }));
});

gulp.task('images', ['clean-images'], function() {
    return gulp.src(imageInput)
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest(imageOutput))
    .pipe(connect.reload());
});

gulp.task('tests', function (done) {
    return new karma.Server({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

gulp.task('html', function () {
    return gulp.src(htmlLocation)
        .pipe(connect.reload())
        .pipe(notify({ message: 'HTML task complete' }));
});

gulp.task('connect', connect.server({
    root: [rootDir],
    host: 'localhost',
    port: 8080,
    open: { browser: 'chrome' },
    fallback: rootDir + '/index.html',
    livereload: true
}));

gulp.task('clean', function () {
    return del([stylesOutput, scriptsOutput, imageOutput]);
});

gulp.task('clean-styles', function () {
    //return del([stylesOutput]);
});

gulp.task('clean-scripts', function () {
    //return del([scriptsOutput]);
});

gulp.task('clean-images', function () {
    //return del([imageOutput]);
});

gulp.task('watch', function () {
    gulp.watch(stylesInput, ['styles']);
    gulp.watch(scriptsInput, ['scripts']);
    gulp.watch(htmlLocation, ['html']);
});

gulp.task('default', ['clean', 'styles', 'scripts', 'images', 'tests', 'html', 'connect', 'watch']);

gulp.task('build', ['default']);