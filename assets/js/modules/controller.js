'use strict';

export default class controller {
	constructor(el, hash) {
		this.model = {
			current: null
		};
		this.setEl(el);
		this.setEvent();
		this.render(hash);
	}
	setEl(el) {
		this.$el = $(el);
		this.$contents = this.$el.find('#contents');
		return this;
	}
	setEvent() {
		return this;
	}
	// モジュールを取ってくる
	moduleImport(selectHash) {
		let hash = (selectHash === '') ? 'top' : selectHash ;
		let module = {
			tmpl: require(`../../html/contents/${hash}.html`),
			js: require(`./pages/${hash}.js`)
		};
		return module;
	}
	// ハッシュ後の処理決定
	render(selectHash) {
		this.$el.hide();
		let locationHash = location.hash.replace(/^#/, '');
		let current = (typeof selectHash !== 'undefined') ? selectHash : locationHash ;
		let module = this.moduleImport(current);
		let inst = new module.js(`#${selectHash}`, module.tmpl);
		this.model.current = current;
		this.$el.fadeIn('slow');
		return this;
	}
}