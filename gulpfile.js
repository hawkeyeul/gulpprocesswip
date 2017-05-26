var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({
  lazy: true
});
var config = require('./gulp.config.js')();
var glob = require('glob');
var startDate = new Date();
var dev = true;


//TODO Create watch and page reload on file change
//TODO Create launch server 
//TODO add dev / prod functionallity
gulp.task('serve-dev', function(){
  dev = true;
});

gulp.task('serve-prod', function(){
  dev = false;
});

gulp.task('build', ['build-html'], function () {
  log('Application Built');
});

gulp.task('build-files', 
['build-app-images',
  'build-vendor-css',
  'build-common-css',
  'build-app-css',
  'build-vendor-js',
  'build-common-js',
  'build-app-js',
  'build-jsx'], function(){
    log('Files Created');
  });

gulp.task('build-html', ['build-files'], function () {
  log('Building index.html File');
  gulp.src(config.index)
    .pipe($.inject(gulp.src([config.build + '**/*.js', config.build + '**/*.css'])))
    .pipe(gulp.dest(config.build));
});

gulp.task('build-vendor-css', function () {
  log('Building vendor CSS');
  buildCSS(config.vendorCSS, 'vendor.css', config.build);
});

gulp.task('build-common-css', function () {
  log('Building Common CSS');
  buildCSS(config.commonCSS, 'common.css', config.build);
});

gulp.task('build-app-css', function () {
  log('Building App CSS');
  buildCSS(config.appCSS, 'app.css', config.build);
});
gulp.task('build-vendor-js', function () {
  log('Building vendor JS');
  buildJS(config.vendorJS, 'vendor.js', config.build);
});
gulp.task('build-common-js', function () {
  log('Building Common JS');
    buildJS(config.commonJS, 'common.js', config.build);
});
gulp.task('build-app-js', function () {
  log('Building App JS');
      buildJS(config.appJS, 'app.js', config.build);
});
gulp.task('build-app-images', function () {
  log('Building App Images');
  copyFiles(config.images, config.build + 'images/');
});
gulp.task('build-jsx', function(){
    buildJSX(config.react, 'appReact.js', config.build);
});


var buildJSX = function (src, output, dest) {
  return gulp
    .src(src)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: [
        'es2015',
        'react'
      ]
    }))
    .pipe($.concat(output))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

var buildJS = function (src, output, dest) {
  return gulp
    .src(src)
    .pipe($.sourcemaps.init())
    .pipe($.concat(output))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

var buildCSS = function (src, output, dest) {
  return gulp
    .src(src)
    .pipe($.plumber())
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', '> 5%']
    }))
    .pipe($.sourcemaps.init())
    .pipe($.concat(output))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(dest));
};

var copyFiles = function (src, dest) {
  return gulp
    .src(src)
    .pipe(gulp.dest(dest));
};

var log = function (msg) {
  if (typeof (msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
};

gulp.task('test', function () {
  return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});