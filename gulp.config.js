module.exports = function () {
    var client = './src/client/';
    var clientApp = client + 'app/';
    var commonLibs = '../KiewitCommonLibrary/';
    var vendorLib = './node_modules/';
    var temp = './.temp/';
    var build = './build/';

    var config = {
        //files to process
        react: [client+ 'app/**/*.jsx'],
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
        images:[
            client + 'images/**/*'
        ],
        
        //folder location
        client: client,
        clientApp: clientApp,
        commonLibs: commonLibs,
        temp: temp,
        build: build
    };
    
    return config;
};