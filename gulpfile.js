'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var server = require('browser-sync').create();
var run = require('run-sequence');
var del = require('del');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task('style', function() {
  gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('stub/build/'))
    .pipe(minify())
    .pipe(server.stream());
});

gulp.task('serve', function() {
  server.init({
    server: 'source/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/sass/**/*.{scss,sass}', ['style']);
  gulp.watch('source/*.html', ['html']).on('change', server.reload);
  gulp.watch('source/js/*.js').on('change', server.reload);
});

gulp.task('clean', function() {
  return del('stub/build');
});

gulp.task('compress', function(cb) {
  pump([
      gulp.src('source/js/*.js'),
      uglify(),
      gulp.dest('stub/build/')
    ],
    cb
  );
});

gulp.task('copy', function() {
  return gulp.src([
    'source/img/**'
  ], {
    base: 'source/'
  })
    .pipe(gulp.dest('stub/build/'));
});

gulp.task('build', function(done) {
  run(
    'clean',
    'style',
    'compress',
    'copy',
    done
  );
});
