QUnit.config.autostart = false;
QUnit.extend(QUnit, {
	arrayEqual: function arrayEqual(actual, expected, message) {
		[actual, expected] = [actual.slice(0).sort(), expected.slice(0).sort()];
		QUnit.deepEqual(actual, expected, message);
	}
});
const arrayEqual = QUnit.arrayEqual;

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Exception = Components.Exception;

Cu.import("resource://dta/glue.jsm");

function checkExports(m, exports) {
	arrayEqual(
		Object.keys(require(m)),
		exports,
		"Correct exports"
		);
}

addEventListener("load", function load() {
	"use strict";
	removeEventListener("load", load, false);
	QUnit.start();
}, false);
