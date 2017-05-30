module.exports = function () {
    var build = './dev/';
    var client = './src/client/';


    var clientApp = client + 'app/';
    var commonLibs = '../KiewitCommonLibrary/';
    var vendorLib = './node_modules/';

    //server settings
    var envProd = './build/';
    var envDev = './dev/';
    var serverDefaultFile = 'index.html';
    var serverPort = 7203;



    var config = {
        //files to process
        react: [client + 'app/**/*.jsx'],
        index: [client + 'index.html'],
        appJS: [
            './src/**/*.js',
            './*.js'
        ],
        appCSS: [
            client + 'styles/**/*.css'
        ],
        vendorJS: [
            vendorLib + 'react/react.js',
            vendorLib + 'react/react-addons-test-utils.js'
        ],
        vendorCSS: [
            vendorLib + 'bootstrap/dist/css/bootstrap.css',
            vendorLib + 'bootstrap/dist/css/bootstrap-theme.css'
        ],
        commonJS: [
            commonLibs + 'scripts/utilis.js'
        ],
        commonCSS: [
            commonLibs + 'styles/kiewit-theme-dark.css'
        ],
        images: [
            client + 'images/**/*'
        ],

        //folder location
        client: client,
        server: server,
        build: build,


        //server options
        serverOptions: {
            envDev: serverDev,
            envProd: serverProd,
            file: serverDefaultFile,
            port: serverPort
        }

    };

    return config;
}