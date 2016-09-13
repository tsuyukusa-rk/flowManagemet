'use strict';

// import
const tmpl = {
	results: require('../../../html/results.html')
};

import pageBase from './pageBase.js';
import toggleLoading from '../loading.js';

export default class nodeWget extends pageBase {
	constructor(el, tmpl) {
		super(el, tmpl);
		this.model = {
			methodVal: null,
			careerVal: null,
			urlVal: null,
			paramVal: null
		};
	}
	// DOMを定義
	setEl(el) {
		this.$el = $(el);
		this.$btnSubmit = this.$el.find('#form_nodeWget_submit');
		this.$inputMethod = this.$el.find('input[name=method]');
		this.$inputCareer = this.$el.find('input[name=career]');
		this.$inputUrl = this.$el.find('input[name=url]');
		this.$inputParam = this.$el.find('input[name=param]');
		this.$results = this.$el.find('#form_nodeWget_results');
		this.$btnClear = this.$el.find('#form_nodeWget_clear');
		return this;
	}
	// イベントの定義
	setEvent() {
		this.$el.on('submit', {that:this}, this.onSubmit);
		this.$btnClear.on('click', {that:this}, this.onClear);
		return this;
	}
	// 選択値を取得
	getParam() {
		this.model.methodVal = this.$inputMethod.filter(':checked').val();
		this.model.careerVal = this.$inputCareer.filter(':checked').val();
		this.model.urlVal = this.$inputUrl.val();
		this.model.paramVal = (this.$inputParam.val() !== '') ? this.$inputParam.val() : "''" ;
		return this;
	}
	// submit時の処理
	onSubmit(e) {
		toggleLoading();
		let that = e.data.that;
		that.getParam();
		let command = `node nodeWget/fileGet.js ${that.model.careerVal} ${that.model.methodVal} ${that.model.urlVal} ${that.model.paramVal}`;
		exec(command, function(error, stdout, stderr) {
			// console.log(error + ',' + stdout + ',' + stderr);
			let data = JSON.parse(stdout);
			let compile = _.template(tmpl.results);
			console.log(data);
			that.$results.html(compile(data));
			toggleLoading();
		});
		return false;
	}
	// formをeクリアする
	onClear(e) {
		let that = e.data.that;
		that.$el.find("textarea, :text, select").val("").end().find(":checked").prop("checked", false);
		that.$results.empty();
	}
}