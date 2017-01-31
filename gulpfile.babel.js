'use strict';

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
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

const rootDir = 'dist/SASSExample',
  liveReloadRootDir = 'dist',
  distributionDir = rootDir + '/dist',
  stylesInput = rootDir + '/assets/sass/**/*.scss',
  stylesOutput = distributionDir + '/css',
  scriptsInput = rootDir + '/assets/js/**/*.js',
  scriptsOutput = distributionDir + '/js',
  scriptTestsInput = rootDir + '/assets/js/**/*_spec.js',
  imageInput = rootDir + '/assets/img/*',
  imageOutput = distributionDir + '/img',
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

gulp.task('styles', ['clean'], () => {
  return gulp.run('styles-watch');
});

gulp.task('styles-watch', ['clean-styles'], () => {
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
    // .pipe(notify({
    //   message: 'Styles task complete!'
    // }))
    ;
});

gulp.task('scripts', ['clean'], () => {
  return gulp.run('scripts-watch');
});

gulp.task('scripts-watch', ['clean-scripts'], () => {
  return gulp.src(['!' + scriptTestsInput, scriptsInput.replace("/*.js", "/!(Controller)*.js"), scriptsInput.replace("/*.js", "/Controller.js"),])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(scriptsOutput))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(scriptsOutput))
    .pipe(connect.reload())
    // .pipe(notify({
    //   message: 'Scripts task complete!'
    // }))
    ;
});

gulp.task('images', ['clean-images', 'clean'], () => {
  return gulp.src(imageInput)
    .pipe(imagemin(imageminOptions))
    .pipe(gulp.dest(imageOutput))
    .pipe(connect.reload());
});

gulp.task('tests', (done) => {
  // return new karma.Server({
  //   configFile: __dirname + '/karma.conf.js'
  // }, done).start();
});

gulp.task('html', () => {
  return gulp.src(htmlLocation)
    .pipe(connect.reload())
    // .pipe(notify({
    //   message: 'HTML task complete'
    // }))
    ;
});

gulp.task('connect', ['styles', 'scripts', 'images'], connect.server({
  root: [liveReloadRootDir],
  host: 'localhost',
  port: 8080,
  open: {
    browser: 'chrome'
  },
  fallback: rootDir + '/index.html',
  livereload: true
}));

gulp.task('clean', () => {
  return del([distributionDir]);
  //return del([stylesOutput, scriptsOutput, imageOutput]);
});

gulp.task('clean-styles', () => {
  //return del([stylesOutput]);
});

gulp.task('clean-scripts', () => {
  //return del([scriptsOutput]);
});

gulp.task('clean-images', () => {
  //return del([imageOutput]);
});

gulp.task('watch', ['connect'], () => {
  gulp.watch(stylesInput, ['styles-watch']);
  gulp.watch(scriptsInput, ['scripts-watch']);
  gulp.watch(htmlLocation, ['html']);
});

gulp.task('default', ['styles', 'scripts', 'images', 'tests', 'html', 'connect', 'watch']);

gulp.task('build', ['default']);
