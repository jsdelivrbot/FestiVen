var bower = require('bower');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sh = require('shelljs');
var uglify = require('gulp-uglify')

var paths = {
  sass: ['./scss/**/*.scss'],
  ng: ['./www/js/ng/**/module.js', './www/js/ng/run.js',
  './www/js/ng/**/*.fct.js',
  './www/js/ng/config.js', './www/js/ng/**/*.dir.js', './www/js/ng/**/*.svc.js', './www/js/ng/**/*.ctrl.js'],
  js: ['./www/js/*.js']
};

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch([paths.sass, paths.ng], ['sass', 'ng']);
});

gulp.task('ng', function() {
  gulp.src(paths.ng)
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./www/js/'));
});

// gulp.task('js', function() {
//   gulp.src(paths.js)
//   .pipe(concat('scripts.js'))
//   .pipe(gulp.dest(paths.js))
//   .pipe(rename('scripts.min.js'))
//   .pipe(uglify())
//   .pipe(gulp.dest(paths.js));
// });

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if(!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['sass', 'ng']);
