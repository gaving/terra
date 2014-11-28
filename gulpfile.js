"use strict";

var gulp = require('gulp');
var gutil = require('gulp-util');

var beep = require('beepbeep');
var browserify = require('browserify');
var del = require('del');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var react = require('gulp-react');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');

var jsFiles = ['./src/**/*.js'];
var jsxFiles = jsFiles[0] + 'x'
var buildFiles = './build/modules/**/*.js'
var jsExt = (gutil.env.production ? 'min.js' : 'js');

process.env.NODE_ENV = (gutil.env.production ? 'production' : 'development');
process.env.VERSION = require('./package.json').version

gulp.task('clean-modules', function(cb) {
  del('./build/modules/**', cb);
});

gulp.task('copy-js', ['clean-modules'], function() {
  return gulp.src(jsFiles)
  .pipe(gulp.dest('./build/modules'));
});

gulp.task('transpile', ['clean-modules'], function() {
  return gulp.src(jsxFiles)
  .pipe(plumber())
  .pipe(react())
  .pipe(gulp.dest('./build/modules'));
});

gulp.task('deps', function() {
  var b = browserify({detectGlobals: false});
  return b.bundle()
  .pipe(source('deps.js'))
  .pipe(gulp.dest('./build'))
  .pipe(rename('deps.min.js'))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest('./build'));
});

gulp.task('lint', ['copy-js', 'transpile'], function() {
  return gulp.src(buildFiles)
  .pipe(jshint('./.jshintrc'))
  .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', ['lint'], function() {
  var b = browserify('./build/modules/app.js', {
    debug: !gutil.env.production
    , detectGlobals: false
  });

  var stream = b.bundle()
  .on('error', function(err) {
    gutil.log(err.message);
    beep(2, 0);
    this.emit('end');
  })
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build'));

  if (gutil.env.production) {
    stream = stream
    .pipe(rename('app.min.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build'));
  }

  return stream;
})

gulp.task('copy-app', ['build'], function() {
  return gulp.src('./build/app.' + jsExt)
  .pipe(gulp.dest('./dist'));
})

gulp.task('clean-dist', function(cb) {
  del('./dist/**', cb);
})

gulp.task('dist-copy', ['clean-dist', 'build', 'deps'], function() {
  return gulp.src(['./build/app.' + jsExt, './build/deps.' + jsExt, './public/**'])
  .pipe(gulp.dest('./dist'));
})

gulp.task('dist-css', function() {
  return gulp.src('./public/**/*.css')
  .pipe(gulp.dest('./dist'));
})

gulp.task('dist-html', function() {
  return gulp.src('./public/**/*.html')
  .pipe(gulp.dest('./dist'));
})

gulp.task('dist', ['dist-copy'], function() {
  return gulp.src('./dist/index.html')
  .pipe(template({
    jsExt: jsExt
  }))
  .pipe(gulp.dest('./dist'));
})

gulp.task('serve', function() {
  gulp.src('dist')
  .pipe(webserver({
    livereload: true,
    directoryListing: false,
    open: true
  }));
});

gulp.task('watch', ['copy-app'], function() {
  gulp.watch([jsFiles, jsxFiles], ['copy-app']);
  gulp.watch('./public/**/*.css', ['dist-css']);
});
