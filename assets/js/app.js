'use strict';

// import
import header from './modules/common/header.js'
import controller from './modules/controller.js'

// 名前空間定義
(function() {
	let APP = {
		ui: {}
	};
	window.APP = APP;
})();
// インスタンス
(function(APP) {
	APP.ui.header = () => { let headerInst = new header('#header'); };
	APP.ui.controller = (hash) => { let controllerInst = new controller('#view', hash); };
})(APP);
// 起動処理
(function(APP) {
	$(function() {
		$(window).on('dragover', function(e) { e.preventDefault(); });
		$(window).on('drop', function(e) { e.preventDefault(); });
		APP.ui.header();
		APP.ui.controller();
	});
})(APP);
