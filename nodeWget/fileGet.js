// classは、nodeにおいて、
// strictモードでしか実行されないらしい
'use strict';

// 定数定義
const
	// node_modules
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	wget = require('wget-improved'),
	request = require('request'),
	jschardet = require('jschardet'),
	// fn_modules
	regexp = require('./fileGet_modules/regexp.js'),
	assetsDir = 'nodeWgetAssets/';

/*
* ファイル取得のクラスを定義
*/
class FileGet {

	/*
	* 初期化処理
	* @Param career: pc or sp
	* @Param method: リクエストメソッド
	* @Param path: 対象画面url
	* @Param param: 対象画面パラメータ
	*/
	constructor(career, method, path, param) {
		this.outputData = {
			error: [],
			index: {
				dir: null,
				encoding: null
			},
			list: []
		};
		// 対象画面のurl
		this.path = path;
		let formatPath = this.formatPath(this.path);
		this.urlDomain = formatPath.urlDomain;
		this.dirDomain = formatPath.dirDomain;
		this.pathReplace = path.slice(formatPath.domainStrNum);
		if(this.pathReplace !== '') { this.pathReplace.substring(1); }
		// 対象画面パラメータ
		this.param = param;
		// 対象画面パラメータを整形
		this.formObj = this.createParamObj();
		// ファイルの置き場のパスを生成　ファイルネームの切り出し
		this.pathObj = this.createDirectory(this.pathReplace);
		// キャリアによって、ユーザーエージェントを切り替える
		this.userAgent = this.createUserAgent(career);
		// リクエストメソッド
		this.method = method;
		// リクエストをかける
		this.doReqHtml();
		// // log出力
		// this.outputData.index.param = this.formObj;
	}

	/*
	* パラメータを整形
	* @Param
	*/
	createParamObj() {
		// パラメータ設定が存在していれば、処理
		let formObj = {};
		if(typeof this.param !== '' && typeof this.param !== 'undefined') {
			let paramSplit = this.param.split('&');
			for(let i = 0; i < paramSplit.length; i++) {
				let paramSplitSplit = paramSplit[i].split('=');
				let paramSplitSplitName = paramSplitSplit[0];
				formObj[paramSplitSplitName] = paramSplitSplit[1];
			}
		}
		return formObj;
	}

	/*
	* パスの整形
	* @Param path: ファイルのパス
	*/
	formatPath(path) {
		let domainStrNum = path.search(regexp.pt_8);
		domainStrNum += 1;
		let domain = path.substr(0, domainStrNum);
		let urlDomain = domain + '/';
		let dirDomain = domain.replace(regexp.pt_7, './');
		let assets = {
			urlDomain: urlDomain,
			dirDomain: dirDomain,
			domainStrNum: domainStrNum
		};
		return assets;
	}

	/*
	* ファイルの置き場のパスを生成　ファイルネームの切り出し
	* @Param path: ファイルのパス
	*/
	createDirectory(path) {
		// パスの分割
		let pathSplit = path.split('/');
		// 当該ファイル名、空の場合、ファイル名をindex.htmlにする
		let fileName = (pathSplit[pathSplit.length - 1] === '') ? 'index.html' : pathSplit[pathSplit.length - 1] ;
		// 当該ファイルのディレクトリ
		let pathDir = (path.replace(fileName, '') === '') ? '/' : path.replace(fileName, '') ;
		let urlDomain = '';
		let dirDomain = '';
		if(!regexp.pt_6.test(path)) {
		// 相対ルートパス以外のものにたいして、修正をかける
			let formatPath = this.formatPath(this.path);
			urlDomain = formatPath.urlDomain;
			dirDomain = formatPath.dirDomain;
			pathDir = pathDir.replace(urlDomain, '');
		} else {
			urlDomain = this.urlDomain;
			dirDomain = this.dirDomain;
		}
		if(regexp.pt_6.test(pathDir)) { pathDir = pathDir.substring(1); }
		return {
			fileName: fileName,
			directory: dirDomain + '/' + pathDir,
			url: urlDomain + pathDir
		};
	}

	/*
	* ユーザーエージェントの生成
	* @Param career: 対象キャリア
	*/
	createUserAgent(career) {
		let userAgent = '';
		if(career === 'pc') {
			userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.103 Safari/537.36';
		} else if(career === 'sp') {
			userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
		}
		return userAgent;
	}

	/*
	* リクエストでhtmlを取得し、ダウンロード
	* @Param
	*/
	doReqHtml() {
		let that = this;
		// リクエストの設定
		let setting = {
			url: that.path,
			qs: that.formObj,
			method: that.method,
			headers: {
				'User-Agent': that.userAgent
			},
			encoding: null
		};
		// リクエスト処理
		let requestMethod = request(setting, function(err, res, body) {
			// エンコードをチェック
			let detectResult = jschardet.detect(body);
			that.outputData.index.encoding = detectResult;
			// ディレクトリを作成
			mkdirp(assetsDir + that.pathObj.directory, function (err) {
				// エラーがあれば、処理を止める
				if (err) {
					that.outputData.error.push('mkdirpError: ' + err);
					// console.log(that.outputData);
					return false;
				}
				// 取得したファイルを書き出す
				fs.writeFile(assetsDir + that.pathObj.directory + that.pathObj.fileName, body, function(err) {
					if (err) {
						that.outputData.error.push(err);
						// console.log(that.outputData);
						return false;
					}
					// エラーがなければ、取得すべきファイル一覧の生成
					that.outputData.index.dir = assetsDir + that.pathObj.directory + that.pathObj.fileName;
					that.doCreateUrlList();
				});
			});
		});
	}

	/*
	* 取得対象リストをhtmlから抽出
	* @Param
	*/
	doCreateUrlList() {
		// 取得したHTMLを読み込み、テキストとして抽出。その後、url部分で分割する
		let buf = fs.readFileSync(assetsDir + this.pathObj.directory + this.pathObj.fileName);
		let str = buf.toString();
		let strSplit = str.split(regexp.pt_1);
		// 取得対象を抽出する
		let getUrlArray = [];
		for(let i = 0; i < strSplit.length; i++) {
			let text = strSplit[i];
			// 後ろのいらない部分を切り捨てる
			let textSplit = text.split(regexp.pt_3);
			// 頭のいらないところを削除して、パラメーターを切り捨てる
			let textSplitReplace = textSplit[0].replace(regexp.pt_4, '').split('?');
			// ="で始まるもの以外は処理しない
			// 該当する拡張子ではなかった場合、処理しない
			if(!regexp.pt_2.test(text) || !regexp.pt_5.test(textSplitReplace[0]) || /#.html/.test(textSplitReplace[0])) { continue; }
			// 整形したものを保存
			getUrlArray.push(textSplitReplace[0]);
		}
		// 抽出した取得対象リストを元に、ダウンロードする
		this.doDownloadFiles(getUrlArray);
	}

	/*
	* 抽出した取得対象リストを元に、ダウンロードする
	* @Param getUrlArray: 取得対象リスト
	*/
	doDownloadFiles(getUrlArray) {
		let that = this;
		// 抽出した取得対象のリストをループにかける
		for(let i = 0; i < getUrlArray.length; i++) {
			// pathObjを設定
			let pathObj = that.createDirectory(getUrlArray[i]);
			let endFlg = ((i + 1) === getUrlArray.length) ? true : false ;
			// ディレクトリを作成
			mkdirp(assetsDir + pathObj.directory, function (err) {
				// console.error('取得パス : ' + pathObj.url + pathObj.fileName + '<br>');
				if (err) {
				// エラーになったら、処理を止める
					that.outputData.error.push(err);
					// console.log(that.outputData);
					return false;
				} else {
				// wgetでファイル取得
					let options = {};
					that.doWget(
						pathObj.url + pathObj.fileName,
						assetsDir + pathObj.directory + pathObj.fileName,
						options,
						endFlg,
						that
					);
				}
			});
		}
	}

	/*
	* nodeのwgetモジュールの処理
	* @Param url: 取得対象のurl
	* @Param dir: 取得対象の配置ディレクトリ
	* @Param options: wgetのオプション
	*/
	doWget(url, dir, options, endFlg, that) {
		that.outputData.list.push([url,dir]);
		let downloadWget = wget.download(url, dir, options);
		// 取得エラー時
		downloadWget.on('error', function(err) {
			that.outputData.error.push(err + ' : ' + url);
			if(endFlg) {
				console.log(JSON.stringify(that.outputData));
			}
		});
		// 取得開始時
		downloadWget.on('start', function(fileSize) {
			// console.log(fileSize);
		});
		// 取得完了時
		downloadWget.on('end', function(output) {
			// 取得対象をログとして出力
			if(endFlg) {
				console.log(JSON.stringify(that.outputData));
			}
		});
	}

}

// インスタンス
// コマンドライン引数 process.argv[i]
let fileGet = new FileGet(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);