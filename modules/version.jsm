/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is DownThemAll Version module.
 *
 * The Initial Developer of the Original Code is Nils Maier
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Nils Maier <MaierMan@web.de>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

"use strict";

const EXPORTED_SYMBOLS = ['Version'];

const Cc = Components.classes;
const Ci = Components.interfaces;
const module = Components.utils.import;

const ID = 'dta@downthemall.net';

module("resource://gre/modules/Services.jsm");

let _callbacks = [];

const Version = {
		TOPIC_SHOWABOUT: "DTA:showAbout",
		ID: ID,
		LOCALE: Cc["@mozilla.org/chrome/chrome-registry;1"].getService(Ci.nsIXULChromeRegistry).getSelectedLocale('global'),
		APP_NAME: Services.appinfo.name.toLowerCase().replace(/ /, ''),
		OS: Services.appinfo.OS.toLowerCase(),
		APP_VERSION: Services.appinfo.version,
		APP_ID: Services.appinfo.ID,
		VERSION: '0.0',
		BASE_VERSION: '0.0',
		NAME: 'DownThemAll!',
		ready: false,
		showAbout: null,
		compareVersion: function(version, cmp) {
			if (!cmp) {
				[version, cmp] = [this.VERSION, version];
			}
			return Services.vc.compare(version, cmp);
		},
		getInfo: function(callback) {
			if (this.ready) {
				callback.call(callback, this);
			}
			else {
				_callbacks.push(callback);
			}
		}
};

function completeVersion(addon) {
	if (addon) {
		Version.VERSION = addon.version;
		Version.BASE_VERSION = Version.VERSION.replace(/^([\d\w]+\.[\d\w]+).*?$/, '$1');
		Version.NAME = addon.name;
		Version.ready = true;
	}

	_callbacks.forEach(function(c) c.call(c, Version));
	_callbacks = [];
}

module("resource://gre/modules/AddonManager.jsm");
AddonManager.getAddonByID(Version.ID, function(addon) {
	completeVersion(addon);
});
