var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({
	lazy: true
});

var connect = require('gulp-connect');
var merge = require('merge-stream');
var config = require('./gulp.config.js')();
var startDate = new Date();
var envOptions = config.serverOptions.envDev;

//entry points
gulp.task('build-dev', ['set-env-dev', 'build'], function() {});

gulp.task('build-qa', ['set-env-qa', 'build'], function() {});

gulp.task('build-stage', ['set-env-stage', 'build'], function() {});

gulp.task('build-prod', ['set-env-prod', 'build'], function() {});

//set envOptions 
gulp.task('set-env-dev', function() {
	envOptions = config.serverOptions.envDev;
});

gulp.task('set-env-qa', function() {
	envOptions = config.serverOptions.envQA;
});

gulp.task('set-env-stage', function() {
	envOptions = config.serverOptions.envStage;
});

gulp.task('set-env-prod', function() {
	envOptions = config.serverOptions.envProd;
});

var buildDependencies = function() { // used to omit watches unless the build should be served locally. Execution order requires this to be above the gulp build task
	var dependencies = ['build-html'];
	if (args.serve){
		dependencies.concat(['watch:html', 'watch:styles', 'watch:js', 'watch:images', 'watch:vendor']);
	}
	return dependencies;
};

//main build task that tells gulp to run kick off building files and attach watches 
gulp.task('build', buildDependencies(), function() {
	log('Application Built');
	if (args.serve){ // run the local server is argument has been passed in
		runServer(envOptions);
	}
});

gulp.task('watch:html', function() {
	if (args.serve) {
		gulp.watch([].concat(config.index), ['build-html']);
	}
});

gulp.task('watch:styles', function() {
	if (args.serve) {
		gulp.watch([].concat(config.appCSS, config.appSCSS, config.appLESS), ['build-app-styles']);
		gulp.watch([].concat(config.commonCSS, config.commonSCSS, config.commonLESS), ['build-common-styles']);
	}
});

gulp.task('watch:vendor', function() {
	if (args.serve) {
		gulp.watch(['./bower_components'], ['build']);
	}
});

gulp.task('watch:js', function() {
	if (args.serve) {
		gulp.watch([].concat(config.appJS), ['build-app-js']);
		gulp.watch([].concat(config.commonJS), ['build-common-js']);
	}
});

gulp.task('watch:images', function() {
	if (args.serve) {
		gulp.watch([].concat(config.images), ['build-app-images']);
	}
});

gulp.task('build-files', ['build-app-images',
	'build-vendor-styles',
	'build-common-styles',
	'build-app-styles',
	'build-vendor-js',
	'build-common-js',
	'build-app-js'
], function() {
	log('Files Created');
});

gulp.task('build-html', ['build-files'], function() {
	log('Building index.html File');
	var wiredep = require('wiredep').stream;
	var options = config.getWiredepDefaultOptions();
	var filesToInject = [];


	// use the jsPath from the options to configure load order for compiled js files
	for (var i = 0; i < envOptions.jsPaths.length; i++) {
		filesToInject.push(envOptions.jsPaths[i]);
	}

	for (var x = 0; x < envOptions.cssPaths.length; x++) {
		filesToInject.push(envOptions.cssPaths[x]);
	}

	return gulp.src(config.index)
		.pipe($.if(envOptions.env === config.serverOptions.envDev.env, wiredep(options))) //inject with wiredep if env is dev but this will use inject in test and prod
		.pipe($.inject(gulp.src(filesToInject), { relative: false, ignorePath: envOptions.buildFolder, addRootSlash: false }))
		.pipe(gulp.dest(envOptions.path));
});

gulp.task('build-vendor-styles', function() {
	if (envOptions.env !== config.serverOptions.envDev.env) {
		log('Building Vendor styles');
		var options = config.getWiredepDefaultOptions();
		var wd = require('wiredep')(options);
		return buildStyles(wd.css, [], [], 'vendor.css', envOptions.path);
	}
});

gulp.task('build-common-styles', function() {
	log('Building Common Styles');
	return buildStyles(config.commonCSS, config.commonSCSS, config.commonLESS, 'common.css', envOptions.path);
});

gulp.task('build-app-styles', function() {
	log('Building App Styles');
	return buildStyles(config.appCSS, config.appSCSS, config.appLESS, 'app.css', envOptions.path);
});

gulp.task('build-vendor-js', function() {
	if (envOptions.env !== config.serverOptions.envDev.env) {
		log('Building Vendor JS');
		var wiredep = require('wiredep').stream;
		var options = config.getWiredepDefaultOptions();
		var wd = require('wiredep')(options);
		return buildJS(wd.js, 'vendor.js', envOptions.path);
	}
});

gulp.task('build-common-js', function() {
	log('Building Common JS');
	return buildJS(config.commonJS, 'common.js', envOptions.path);
});

gulp.task('build-app-js', function() {
	log('Building App JS');
	return buildJS(config.appJS, 'app.js', envOptions.path);
});

gulp.task('build-app-images', function() {
	log('Building App Images');
	return copyFiles(config.images, envOptions.path + 'images/');
});



var buildJS = function(src, output, dest) {
	return gulp
		.src(src)
		.pipe($.if(envOptions.env === config.serverOptions.envQA.env, $.sourcemaps.init()))
		.pipe((envOptions.env !== config.serverOptions.envDev.env, $.concat(output)))
		.pipe($.if(envOptions.env !== config.serverOptions.envDev.env, $.uglify()))
		.pipe($.if(envOptions.env === config.serverOptions.envQA.env, $.sourcemaps.write('.')))
		.pipe(gulp.dest(dest));
};

var buildStyles = function(css, scss, less, output, dest) {
	if (envOptions.env === config.serverOptions.envDev.env) {
		// process style files for Dev
		gulp.src(less)
			.pipe($.less())
			.pipe(gulp.dest(dest));

		gulp.src(scss)
			.pipe($.sass())
			.pipe(gulp.dest(dest));

		return gulp.src(css)
			.pipe(gulp.dest(dest));
	} else {
		// process styles files for QA Stage and Prod
		// based on idea from https://ypereirareis.github.io/blog/2015/10/22/gulp-merge-less-sass-css/
		var lessStream = gulp.src(less)
			//.pipe($.if(envOptions.env !== config.serverOptions.envProd.env, $.sourcemaps.init()))
			.pipe($.less())
			.pipe($.concat('less-files.less'));
		//.pipe($.if(envOptions.env !== config.serverOptions.envProd.env, $.sourcemaps.write('.')));

		var scssStream = gulp.src(scss)
			//.pipe($.if(envOptions.env !== config.serverOptions.envProd.env, $.sourcemaps.init()))
			.pipe($.sass())
			.pipe($.concat('scss-files.scss'));
		//.pipe($.if(envOptions.env !== config.serverOptions.envProd.env, $.sourcemaps.write('.')));

		var cssStream = gulp.src(css)
			//.pipe($.if(envOptions.env !== config.serverOptions.envProd.env, $.sourcemaps.init()))
			.pipe($.concat('css-files.css'));
		//.pipe($.if(envOptions.env !== config.serverOptions.envProd.env, $.sourcemaps.write('.')));

		return merge(lessStream, scssStream, cssStream)
			.pipe($.autoprefixer({
				browsers: ['last 2 versions', '> 5%']
			}))
			.pipe($.concat(output))
			.pipe($.cssmin())
			.pipe(gulp.dest(dest));
	}
};

var copyFiles = function(src, dest) {
	return gulp
		.src(src)
		.pipe(gulp.dest(dest));
};

var log = function(msg) {
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

var runServer = function(options) {
	if (args.serve) {
		connect.server({
			root: options.path,
			port: options.port,
			livereload: true,
			middleware: function(connect) {
				return [connect().use('/bower_components', connect.static('bower_components'))];
			}
		});

		gulp.src(options.path + options.env)
			.pipe($.open({
				url: 'http://localhost:' + options.port
			}));
	}
};