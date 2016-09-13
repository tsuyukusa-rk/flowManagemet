'use strict';

export default class pageBase {
	constructor(el, tmpl) {
		this.setBaseEl();
		this.render(tmpl);
		this.setEl(el);
		this.setEvent();
	}
	setBaseEl() {
		this.$baseEl = $('#contents');
		return this;
	}
	render(tmpl) {
		if(typeof tmpl !== 'undefined') {
			this.$baseEl.html(tmpl);
		}
		return this;
	}
	setEl(el) {
		this.$el = $(el);
		return this;
	}
	setEvent() {
		return this;
	}
}