var gulp = require('gulp');
var uglify = require('gulp-uglify-es').default;
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var htmlmin = require('gulp-htmlmin');
var inject = require('gulp-inject-string');
var runSequence = require('run-sequence');
var del = require('del');

// Set the browser that you want to support
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('styles', function () {
  return gulp.src([
    'node_modules/basscss/css/basscss-cp.min.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    './css/**/*.css'
    ])
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(csso())
    .pipe(gulp.dest('./docs/css'))
});

gulp.task('fonts', function() {
  return gulp.src([
    'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('./docs/fonts'))
});

gulp.task('scripts', function() {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/vue/dist/vue.min.js',
    'node_modules/vue-router/dist/vue-router.min.js',
    './js/**/*.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('./docs/js'))
});

gulp.task('pages', function() {
  return gulp.src(['./*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(inject.replace('node_modules/basscss/css/basscss-cp.min.css', 'css/basscss-cp.min.css'))
    .pipe(inject.replace('node_modules/font-awesome/css/font-awesome.min.css', 'css/font-awesome.min.css'))
    .pipe(inject.replace('node_modules/jquery/dist/jquery.min.js', 'js/jquery.min.js'))
    .pipe(inject.replace('node_modules/vue/dist/vue.min.js', 'js/vue.min.js'))
    .pipe(inject.replace('node_modules/vue-router/dist/vue-router.min.js', 'js/vue-router.min.js'))
    .pipe(gulp.dest('./docs'));
});

gulp.task('clean', () => del(['docs']));

gulp.task('default', ['clean'], function () {
  runSequence(
    'styles',
    'fonts',
    'scripts',
    'pages'
  );

  gulp.src('./manifest.json').pipe(gulp.dest('./dist'))
});
