'use strict';

const mergely = require('mergely');
const encoding = require('encoding-japanese');

import pageBase from './pageBase.js';

export default class diff extends pageBase {
	constructor(el, tmpl) {
		super(el, tmpl);
		this.model = {
			compareFlg: false
		};
	}
	setEl(el) {
		this.$el = $(el);
		this.$dropBox = this.$el.find('.dropBox');
		this.$dropResults = this.$el.find('.dropResults');
		this.$compareBox = this.$el.find('#compareBox');
		this.$compare = this.$el.find('#compare');
		this.$btnCompare = this.$el.find('#btnCompare');
		this.$btnCompareClear = this.$el.find('#btnCompareClear');
		return this;
	}
	setEvent() {
		this.$dropBox.on('dragover', {that:this}, this.onDragover);
		this.$dropBox.on('drop', {that:this}, this.onDrop);
		this.$btnCompareClear.on('click', {that:this}, this.clear);
		this.$btnCompare.on('click', {that:this}, this.compare);
		return this;
	}
	// ドラッグした状態で、要素上来た時
	onDragover(e) {
		let that = e.data.that;
		e.preventDefault();
		return that;
	}
	// ドロップした時
	onDrop(e) {
		e.preventDefault();
		let that = e.data.that;
		let $this = $(this);
		let thisNum = that.$dropBox.index(this);
		let fileReader = new FileReader();
		fileReader.addEventListener('load', function(e) {
			let array = new Uint8Array(this.result);
			let encode = encoding.detect(array);
			let unicodeArray = encoding.convert(array, 'UNICODE');
			let text = encoding.codeToString(unicodeArray);
			that.$dropResults.eq(thisNum)
				.text(text)
				.fadeIn(function() {
					let flg1 = false;
					let flg2 = false;
					that.$dropResults.each(function(i) {
						let $this = $(this);
						if(i === 0) {
							flg1 = ($this.css('display') === 'list-item') ? true : false ;
						} else if(i === 1) {
							flg2 = ($this.css('display') === 'list-item') ? true : false ;
						}
					});
					if(flg1 && flg2) {
						that.$btnCompare.removeClass('disabled');
						that.model.compareFlg = true;
					}
				});
			$this.addClass('active');
		});
		for(let i = 0;i<e.originalEvent.dataTransfer.files.length ;i++){
			$this.text(e.originalEvent.dataTransfer.files[i].path);
			fileReader.readAsArrayBuffer(e.originalEvent.dataTransfer.files[i]);
		}
		return that;
	}
	// clear
	clear(e) {
		let that = e.data.that;
		window.location.reload(false);
		return that;
	}
	// diff表示
	compare(e) {
		let that = e.data.that;
		let compareTxt1 = '';
		let compareTxt2 = '';
		if(!that.model.compareFlg) { return false; }
		that.$dropResults.each(function(i) {
			let $this = $(this);
			if(i === 0) {
				compareTxt1 = $this.text();
			} else if(i === 1) {
				compareTxt2 = $this.text();
			}
		});
		that.$compare.mergely({
			cmsettings: {
				readOnly: false, //読込みのみ
				lineNumbers: true //行番号の表示
			},
			editor_width: '445px',
			editor_height: 'auto',
			lhs: function(setValue) {
				setValue(compareTxt1); //比較元テキスト
			},
			rhs: function(setValue) {
				setValue(compareTxt2); //比較先テキスト
			}
		});
		that.$compareBox.fadeIn();
		return that;
	}
}