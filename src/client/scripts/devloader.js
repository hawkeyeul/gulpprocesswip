window.name = 'parent';
var devUtilsOpen = false;
var devLoaded = function(){ 
	otherWinRef = window.open("","parent");
	otherWinRef.Bounce(window);
	window.focus();
	alert('Local development libraries loaded');
 };
var devUtils = window.open('https://portal.kiewit.com/sites/test_kiewitpower_development/playground/SitePages/utilsiframe.aspx');


window.onbeforeunload = function(e) {
	devUtils.close();
};

function Bounce(w) {

        window.blur();
        w.focus();
}

