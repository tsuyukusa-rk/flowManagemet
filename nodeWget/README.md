##nodeWget
node.jsを使ったファイル取得プログラム(じゃらんドメイン以外でも使用可)

####使い方

	cd ディレクトリ指定
	npm install
	node fileGet.js pc/sp get/post 対象url 'param'

	node fileGet.js pc get http://www.jalan.net/index.html

	node fileGet.js sp post http://www.jalan.net/dp/jal/uj/ujp1400/ujw1400.do 'distCd=01&afCd=JJ&screenId=UJW1410&outwardDepAptCd=HND&outwardArrAptCd=SPK&outwardBoardYear=2016&outwardBoardMonth=2&outwardBoardDay=19&homewardDepAptCd=SPK&homewardArrAptCd=HND&homewardBoardYear=2016&homewardBoardMonth=2&homewardBoardDay=20&stayCount=1&roomCount=1&adultNum=2&kenCd=010000&lrgCd=010200'

####留意点

 - js内などで、読み込まれているものに対しては未対応で、とってこれない
 - classはnodeのバージョンが4以上のものでないと対応してないらしい

####今後のアップデート予定

 - 取得してきたファイルを一旦、クリアするコマンドの追加
 - コードの整理をしないと
 - URLを外部ファイルで複数指定したり、そもそも起動コマンド自体を外部ファイルを読みこみもできるようにするとか