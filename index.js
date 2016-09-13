/*
 * index.js
 */
'use strict';

// アプリケーションをコントロールするモジュール
const app = require('electron').app;
// ウィンドウを作成するモジュール
const BrowserWindow = require('electron').BrowserWindow;
// 起動 URL
const currentURL = 'file://' + __dirname + '/build/index.html';

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on('ready', function() {
  // インスタンスし、メイン画面のサイズ
  let mainWindow = new BrowserWindow({width: 1000, height: 800, show: false});
  // 起動 url を指定
  mainWindow.loadURL(currentURL);
  // 画面を表示
  mainWindow.show();
  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});