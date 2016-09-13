'use strict';

export default class header {
	constructor(el) {
		this.model = {};
		this.setEl(el);
		this.setEvent();
	}
	setEl(el) {
		this.$el = $(el);
		this.$iconMenu = this.$el.find('#iconMenu');
		this.$navList = this.$el.find('.headerNavList');
		this.$headerNav = this.$el.find('#headerNav');
		return this;
	}
	setEvent() {
		this.$navList.on('click', {that:this}, this.translate);
		this.$iconMenu.on('click', {that:this}, this.ctrlHeaderNav);
		return this;
	}
	// ナビゲーションの表示、非表示
	ctrlHeaderNav(e) {
		let that = e.data.that;
		that.$headerNav.slideToggle('fast');
	}
	// ページ遷移
	translate(e) {
		let that = e.data.that;
		let $this = $(this);
		let href = $this.find('a').attr('href');
		that.$headerNav.hide();
		APP.ui.controller(href.replace(/^#/, ''));
	}
}