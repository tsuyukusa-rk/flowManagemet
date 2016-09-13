const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const electron = require('electron-connect').server.create();
const webpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config.js');

const srcDir = 'assets';
const libDir = 'build';

gulp.task('compile', function(){
  return gulp.src(`${srcDir}/js/**/*.js`)
    .pipe($.webpack(webpackConfig))
    .pipe(gulp.dest(libDir + '/js'));
});

gulp.task('cleanBuild', function (cb) {
  var rimraf = require('rimraf');
  rimraf(libDir, cb);
});

gulp.task('copy', ['cleanBuild'], function() {
  return gulp.src([ '**/*.html', '**/*.css', '**/*.gif', '**/*.jpg', '**/*.png'], { base: srcDir })
    .pipe(gulp.dest(libDir));
});

// コンパイルしてElectron起動
gulp.task('start', ['copy','compile'], function(){
  // electron開始
  electron.start();
  // ファイルが変更されたら再コンパイル
  gulp.watch(srcDir + '/**/*.{html,js,css,gif,jpg,png}', ['copy','compile', electron.reload]);
  // BrowserProcessが読み込むファイルが変更されたらRestart。
  gulp.watch(['index.js'], electron.restart);
  // RendererProcessが読み込むファイルが変更されたらReload。
  // gulp.watch(srcDir + '/**/*.{html,js,css}', electron.reload);
});