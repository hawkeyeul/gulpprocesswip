var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({
  lazy: true
});
var config = require('./gulp.config.js')();
var glob = require('glob');
var startDate = new Date();
var devEnv = true;


//TODO Create watch and page reload on file change
//TODO Create launch server 
//TODO add dev / prod functionallity
gulp.task('serve-dev', ['build'], function () {
  devEnv = true;
  config.build = config.envDev;
  runServer(devEnv, config.serverOptions);
  gulp.watch('./gulp.config.js', ['serve-dev']);
});

gulp.task('serve-prod', function () {
  devEnv = false;
  config.build = config.envProd;
  runServer(devEnv, config.serverOptions);
  gulp.watch('./gulp.config.js', ['serve-prod']);
});

gulp.task('build', ['build-html','watch:html', 'watch:css','watch:js','watch:jsx','watch:images'], function () {
  log('Application Built');
});

gulp.task('watch:html', function(){
  gulp.watch([].concat(config.index), ['build-html']);
});

gulp.task('watch:css', function () {
  gulp.watch([].concat(config.appCSS), ['build-app-css']);
  gulp.watch([].concat(config.commonCSS), ['build-common-css']);
  gulp.watch([].concat(config.vendorCSS), ['build-vendor-css']);
});

gulp.task('watch:js', function () {
  gulp.watch([].concat(config.appJS), ['build-app-js']);
  gulp.watch([].concat(config.commonJS), ['build-common-js']);
  gulp.watch([].concat(config.vendorJS), ['build-vendor-js']);
});

gulp.task('watch:jsx', function () {
  gulp.watch([].concat(config.react), ['build-jsx']);
});

gulp.task('watch:images', function () {
  gulp.watch([].concat(config.images), ['build-app-images']);
});

gulp.task('build-files', ['build-app-images',
  'build-vendor-css',
  'build-common-css',
  'build-app-css',
  'build-vendor-js',
  'build-common-js',
  'build-app-js',
  'build-jsx'
], function () {
  log('Files Created');
});


gulp.task('build-html', ['build-files'], function () {
  log('Building index.html File');
  return gulp.src(config.index)
    .pipe($.inject(gulp.src([config.build + '**/*.js', config.build + '**/*.css'])))
    .pipe(gulp.dest(config.build));
});

gulp.task('build-vendor-css', function () {
  log('Building vendor CSS');
  return buildCSS(config.vendorCSS, 'vendor.css', config.build);
});

gulp.task('build-common-css', function () {
  log('Building Common CSS');
  return buildCSS(config.commonCSS, 'common.css', config.build);
});

gulp.task('build-app-css', function () {
  log('Building App CSS');
  return buildCSS(config.appCSS, 'app.css', config.build);
});

gulp.task('build-vendor-js', function () {
  log('Building vendor JS');
  return buildJS(config.vendorJS, 'vendor.js', config.build);
});

gulp.task('build-common-js', function () {
  log('Building Common JS');
  return buildJS(config.commonJS, 'common.js', config.build);
});

gulp.task('build-app-js', function () {
  log('Building App JS');
  return buildJS(config.appJS, 'app.js', config.build);
});

gulp.task('build-app-images', function () {
  log('Building App Images');
  return copyFiles(config.images, config.build + 'images/');
});

gulp.task('build-jsx', function () {
  return buildJSX(config.react, 'appReact.js', config.build);
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

var runServer = function(env, options){
   return gulp
  .src((env)? options.envDev : options.envProd)
  .pipe($.server-livereload({
    livereload: true,
    directoryListing: true,
    log: 'debug',
    clientConsole: true,
    port: options.port,
    defaultFile: options.file
  }));

};


gulp.task('test', function () {
  return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});