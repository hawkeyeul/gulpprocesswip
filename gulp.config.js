module.exports = function() {
	var client = './src/client/';


	var clientApp = client + 'app/';
	var commonLibs = '../KiewitCommonLibrary/';
	var vendorLib = './node_modules/';

	// ########## SERVER SETTINGS ##########
	//dev server settings
	var devPath = './build/dev/';
	var devPort = 7201;
	var devEntryFile = 'index.html';

	//qa server settings
	var qaPath = './build/qa/';
	var qaPort = 7202;
	var qaEntryFile = 'index.html';

	//stage server settings
	var stagePath = './build/stage/';
	var stagePort = 7203;
	var stageEntryFile = 'index.html';

	//prod server settings
	var prodPath = './build/prod/';
	var prodPort = 7204;
	var prodEntryFile = 'index.html';

	// add bower support 
	var config = {
		//files to process
		index: [client + 'index.html'],

		// if js files need to be loaded in order they should be added
		// in the order and blobs should be remove or the individual files should be ignore after 
		// they have added. To ignore a file include it again with '!' + in front of it 
		// example: 
		// client + 'scripts/cool.js' 
		// '!' + client + 'scripts/cool.js'
		// client + 'scripts/**/*.js'  


		// app files
		appJS: [
			client + '**/*.js'
		],
		appCSS: [
			client + 'styles/**/*.css'
		],
		appLESS: [
			client + 'styles/**/*.less'
		],
		appSCSS: [
			client + 'styles/**/*.scss'
		],

		// common library files
		commonJS: [
			commonLibs + 'scripts/utilis.js'
		],
		commonCSS: [
			commonLibs + 'styles/**/*.css'
		],
		commonLESS: [
			commonLibs + 'styles/**/*.less'
		],
		commonSCSS: [
			commonLibs + 'styles/**/*.scss'
		],
		images: [
			client + 'images/**/*'
		],

		//server options
		serverOptions: {
			envDev: {
				path: devPath,
				port: devPort,
				entry: devEntryFile,
				env: 'dev',
				cssPaths: [
					'./build/dev/common.css',
					'./build/dev/app.css'
				],
				jsPaths: [
					'./build/dev/common.js',
					'./build/dev/app.js'
				],
				buildFolder: 'build/dev' //used to remove build path when injecting files
			},
			envQA: {
				path: qaPath,
				port: qaPort,
				entry: qaEntryFile,
				env: 'qa',
				cssPaths: [
					'./build/qa/vendor.css',
					'./build/qa/common.css',
					'./build/qa/app.css'
				],
				jsPaths: [
					'./build/qa/vendor.js',
					'./build/qa/common.js',
					'./build/qa/app.js'
				],
				buildFolder: 'build/qa' //used to remove build path when injecting files
			},
			envStage: {
				path: stagePath,
				port: stagePort,
				entry: stageEntryFile,
				env: 'stage',
				cssPaths: [
					'./build/stage/vendor.css',
					'./build/stage/common.css',
					'./build/stage/app.css'
				],
				jsPaths: [
					'./build/stage/vendor.js',
					'./build/stage/common.js',
					'./build/stage/app.js'
				],
				buildFolder: 'build/stage' //used to remove build path when injecting files
			},
			envProd: {
				path: prodPath,
				port: prodPort,
				entry: prodEntryFile,
				env: 'prod',
				cssPaths: [
					'./build/prod/vendor.css',
					'./build/prod/common.css',
					'./build/prod/app.css'
				],
				jsPaths: [
					'./build/prod/vendor.js',
					'./build/prod/common.js',
					'./build/prod/app.js'
				],
				buildFolder: 'build/prod' //used to remove build path when injecting files
			}
		},
		bower: {
			json: require('./bower.json'),
			directory: './bower_components',
			ignorePath: '../..'
		}
	};

	config.getWiredepDefaultOptions = function() {
		var options = {
			bowerJason: config.bower.json,
			directory: config.bower.directory,
			ignorePath: config.bower.ignorePath,
			fileTypes: {
				html: {
					replace: {
						js: '<script src="..{{filePath}}"></script>',
						css: '<link rel="stylesheet" href="..{{filePath}}" />'
					}
				},
				replace: {
					typeOfBowerFile: 'js',
					anotherTypeOfBowerFile: function(filePath) {
						return '<script src="' + filePath + '"></script>';
					}
				}
			}
		};
		return options;
	};

	return config;
};