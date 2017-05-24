// ReactJS GULP PROCESS ONLY //
//Library and framework dependencies 
var libs = [
  'react',
  'react-addons-test-utils'
];

//Library and framework styles
var libStyles = [
  'node_modules/bootstrap/dist/css/bootstrap.css',
  'node_modules/bootstrap/dist/css/bootstrap-theme.css'
];

//Common library dependencies
var common = [

];

//Common styles
var commonStyles = [

];

//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
//** Warning make sure you need to change the lines below before editing **/
var development = true;

var browserifyOptions = {
  development: development,
  src: './app/app.jsx',
  dest: './build'
};

var commonStylesOptions = {
  development: development,
  files: commonStyles,
  file: 'common.css',
  dest: './build'
};

var libStylesOptions = {
  development: development,
  files: libStyles,
  file: 'lib.css',
  dest: './build'
};

var htmlOptions = {
  development: development,
  src: 'index.html',
  dest: './build'
};

var cssOptions = {
  development: development,
  files: ['./styles/**/*.css'],
  file: 'app.css',
  dest: './build'
};

var imageOptions = {
  development: development,
  src: 'images/**/*',
  dest: './build'
}

//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/
//** EXTRA WARNING!!! Do not change anything below unless you are 100% sure the way GULP process file should be changed **/

var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var glob = require('glob');
var livereload = require('gulp-livereload');
var jasminePhantomJs = require('gulp-jasmine2-phantomjs');
var connect = require('gulp-connect');
var startDate = new Date();

var browserifyTask = function (options) {
  // Our app bundler
  var appBundler = browserify({
    entries: [options.src], // Only need initial file, browserify finds the rest
    transform: [
      [babelify, {
        presets: ['react']
      }]
    ], // We want to convert JSX to normal javascript
    debug: options.development, // Gives us sourcemapping
    cache: {},
    packageCache: {},
    fullPaths: options.development // Requirement of watchify
  });

  // We set our dependencies as externals on our app bundler when developing
  (options.development ? libs : []).forEach(function (lib) {
    appBundler.external(lib);
  });



  // The rebundle process
  var rebundle = function () {
    console.log('Building APP bundle');
    appBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('index.jsx'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(rename({
        extname: ".js"
      }))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, livereload()))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - startDate) + 'ms');
      }));
  };

  // Fire up Watchify when developing
  if (options.development) {
    appBundler = watchify(appBundler);
    appBundler.on('update', rebundle);
  }

  rebundle();

  // We create a separate bundle for our dependencies as they
  // should not rebundle on file changes. This only happens when
  // we develop. When deploying the dependencies will be included
  // in the application bundle
  if (options.development) {

    var testFiles = glob.sync('./specs/**/*-spec.js');
    var testBundler = browserify({
      entries: testFiles,
      debug: true, // Gives us sourcemapping
      transform: [
        [babelify, {
          presets: ['react']
        }]
      ],
      cache: {},
      packageCache: {},
      fullPaths: true // Requirement of watchify
    });

    testBundler.external(libs);

    var rebundleTests = function () {
      console.log('Building TEST bundle');
      testBundler.bundle()
        .on('error', gutil.log)
        .pipe(source('specs.js'))
        .pipe(gulp.dest(options.dest))
        .pipe(livereload())
        .pipe(notify(function () {
          console.log('TEST bundle built in ' + (Date.now() - startDate) + 'ms');
        }));
    };

    testBundler = watchify(testBundler);
    testBundler.on('update', rebundleTests);
    rebundleTests();

    var libsBundler = browserify({
      debug: true,
      require: libs
    });

    // Run the library bundle
    console.log('Building Library bundle');
    libsBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('libs.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('Library bundle built in ' + (Date.now() - startDate) + 'ms');
      }));

    var commonBundler = browserify({
      debug: true,
      require: common
    });

    // Run the common bundle
    console.log('Building Common bundle');
    commonBundler.bundle()
      .on('error', gutil.log)
      .pipe(source('common.js'))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log('Common bundle built in ' + (Date.now() - startDate) + 'ms');
      }));

  }
}

var stylesTask = function (options) {
  if (options.development) {
    var task = function () {
      console.log(options.file + ' building');
      gulp.src(options.files)
        .pipe(concat(options.file))
        .pipe(gulp.dest(options.dest));
    }
    task();
    gulp.watch(options.files, task);
  } else {
    console.log(options.file + ' building for production');
    gulp.src(options.files)
      .pipe(concat(options.file))
      .pipe(cssmin())
      .pipe(gulp.dest(options.dest));
  }
}

var htmlTask = function (options) {
  var task = function () {
    console.log(options.src + ' building');
    gulp.src(options.src)
      .pipe(rename({
        extname: ".html"
      }))
      .pipe(gulp.dest(options.dest));
  }
  task();
  gulp.watch(options.src, task);
}

var imageTask = function(options){
  var task = function() {
    console.log(options.src + ' building ' + options.dest);
    gulp.src([options.src], {base: '.'})
    .pipe(gulp.dest(options.dest));
  }
  task();
  gulp.watch(options.src, task);
}


var runTasks = function () {
  imageTask(imageOptions);
  htmlTask(htmlOptions);
  stylesTask(cssOptions);
  stylesTask(libStylesOptions);
  stylesTask(commonStylesOptions);
  browserifyTask(browserifyOptions);
}

// Starts our development workflow
gulp.task('default', function () {
  development = true;

  livereload.listen();

  runTasks();

  connect.server({
    root: [
      'build'
    ], 
    port: 8889
  });
});

gulp.task('deploy', function () {

  development = false;

  runTasks();

});



gulp.task('test', function () {
  return gulp.src('./build/testrunner-phantomjs.html').pipe(jasminePhantomJs());
});