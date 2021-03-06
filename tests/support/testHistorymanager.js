module("historymanager.jsm");
(function() {
	function SetupHistoryManager(key) {
		this.key = key;
		this.setup();
	}
	SetupHistoryManager.prototype = {
		prefs: require("resource://dta/preferences.jsm"),
		setup: function () {
			this.old = this.prefs.getExt(this.key, "");
			this.prefs.resetExt(this.key);
		},
		restore: function () {
			this.prefs.setExt(this.key, this.old);
		}
	};

	test("exports", function() {
		checkExports("resource://dta/support/historymanager.jsm", ["getHistory"]);
	});

	test("regular", function() {
		var {getHistory} = require("resource://dta/support/historymanager.jsm");
		var h = getHistory("testHistory");
		deepEqual(h.values, [], "new history must be empty");
		h.push("foo");
		deepEqual(h.values, ["foo"], "push to empty");
		h.push("bar");
		deepEqual(h.values, ["bar", "foo"], "push will unshift");
		h.push("foo");
		deepEqual(h.values, ["foo", "bar"], "no duplicates");
		h.reset();
		deepEqual(h.values, [], "reset");
	});

	test("filter", function() {
		var s = new SetupHistoryManager("filter");
		try {
			var {getHistory} = require("resource://dta/support/historymanager.jsm");
			var h = getHistory("filter");
			ok(h.values && h.values.length, "values is set and not empty");
			h.reset();
			ok(h.values && h.values.length, "values is set and not empty after reset");
			h.push("dude");
			equal(h.values[0], "dude", "pushing works");
		}
		finally {
			s.restore();
		}
	});

	test("directory", function() {
		var s = new SetupHistoryManager("directory");
		try {
			var {getHistory} = require("resource://dta/support/historymanager.jsm");
			var h = getHistory("directory");
			h.reset();
			deepEqual(h.values, [], "directory hist gets empty");
			h.push("C:\\");
			h.push("/home/");
			equal(h.values.length, 1, "Validator at work");
		}
		finally {
			s.restore();
		}
	});
})();
