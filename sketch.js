var tick = 0;
// 画面遷移管理 1:スタート画面 2:プレイ画面 3:リザルト画面
var screenNo = 1;
// ゲーム共通
var difficulty = 0.8;
var score = 0;
var posedFlg = false;
// ドラム
var drumX = [400, 800, 1200, 1600, 2000, 2400, 3000];
var drumSize = [250, 250, 250, 250, 250, 250, 150];
var drumMovable = [false, false, false, false, false, true, false];
var drumXmax = 3000;
var speedX = 2;
// プレイヤー
var playerY = 250;
var playerSpeedY = 0;
var divedFlg = false;

function preload() {
	titleImg = loadImage('assets/title.png');
	startImg = loadImage('assets/start.png');
	restartImg = loadImage('assets/restart.png');
	guysImg = loadImage('assets/takepiro_bye3.png');
	drumImg = loadImage('assets/drum.png');
	diveImg = loadImage('assets/dive.png');
	jumpImg = loadImage('assets/jump.png');
	UpperRightImg = loadImage('assets/UpperRight.png');
	
}

function setup() {
	// put setup code here
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background('#d1fafb');
	
	// スタート画面
	if(screenNo == 1){
		imageMode(CENTER);
		image(guysImg, windowWidth/2 - 400, windowHeight/2);
		image(titleImg, windowWidth/2, windowHeight/2);
		image(startImg, windowWidth/2, windowHeight/2 + 200);
		//fill('#000000');
		//textAlign(CENTER);
		//textSize(32);
		//text('START TO CLICK',windowWidth/2, windowHeight/2 + 400);
	}
	
	// プレイ画面
	if(screenNo == 2){
		// ドラムの更新
		for(var i = 0; i < drumX.length; i++){
			// ドラムの描画
			if(drumMovable[i] == false){
				// circle(drumX[i], windowHeight - 100, 50);
				// rect(drumX[i], windowHeight - 100, drumSize[i], 50);
				imageMode(CORNER);
				image(drumImg, drumX[i], windowHeight - 100, drumSize[i], 270 * drumSize[i] / 370);
			}else{
				// circle(drumX[i] + 60 * sin(tick/70), windowHeight - 100, 50);
				// rect(drumX[i] + 60 * sin(tick/70), windowHeight - 100, drumSize[i], 50);
				imageMode(CORNER);
				image(drumImg, drumX[i] + 60 * sin(tick/70), windowHeight - 100, drumSize[i], 270 * drumSize[i] / 370);
			}
			
			// ドラムの座標更新
			if(!posedFlg)drumX[i] = drumX[i] - speedX * difficulty;
			
			// ドラムのスポーン・デスポーン
			if(drumX[i] < -400){
				drumX[i] = drumXmax + 400 +	Math.random() * 300;
				drumXmax = drumX[i];
				if(random() < 0.1){
					drumSize[i] = 150;
				}else{
					drumSize[i] = 250;
				}
				if(random() < 0.1){
					drumMovable[i] = true;
				}else{
					drumMovable[i] = false;
				}
			}
		}
		if(!posedFlg)drumXmax = drumXmax - speedX * difficulty;
		
		// プレイヤーの更新
		// プレイヤーの描画
		// circle(300, windowHeight - playerY, 50);
		if(divedFlg){
			imageMode(CENTER);
			image(diveImg, 300, windowHeight - playerY);
		}else{
			imageMode(CENTER);
			image(jumpImg, 300, windowHeight - playerY);
		}
		// プレイヤーの座標更新
		if(!posedFlg)playerY = playerY + playerSpeedY;
		// プレイヤーの速度更新
		if(!posedFlg)playerSpeedY = playerSpeedY - difficulty * 0.03;
		// ドラム当たり判定
		var drumHitFlg = false;
		for(var i = 0; i < drumX.length; i++){
			var movedX = 0;
			if(drumMovable[i])movedX = 60 * sin(tick/70);
			if(drumX[i] + movedX <= 300 && drumX[i] + movedX + drumSize[i] >= 300)drumHitFlg = true;
		}
		if(playerY < 100 && playerY > 90 && drumHitFlg){
			playerSpeedY = 4;
			divedFlg = false;
		}
		
		// 死亡判定
		if(playerY < 0)screenNo = 3;
		
		// フレームカウント
		if(!posedFlg)tick = tick + 1;
		
		// 難易度更新
		if(difficulty < 4 && !posedFlg)difficulty = difficulty + 0.0003;
		
		// スコア計上
		imageMode(CENTER);
		image(UpperRightImg, windowWidth - 140, 70, 400, 240 * 400 / 900);
		if(!posedFlg)score = score + 1;
		fill('#ffffff');
		textAlign(CENTER, CENTER);
		textSize(32);
		text('SCORE: ' +score, windowWidth - 160, 65);
		
		// ポーズボタン
		fill('#cccccc');
		noStroke();
		rectMode(CENTER);
		rect(40, 50, 10, 30);
		rect(60, 50, 10, 30);
		fill('rgba(0, 0, 0, 0.5)');
		
		// ポーズ画面
		if(posedFlg){
			rectMode(CORNER);
			rect(0, 0, windowWidth, windowHeight);
			fill('#ffffff');
			textAlign(CENTER, CENTER);
			textSize(32);
			text('POSED', windowWidth/2, windowHeight/2);
			text('CLICK TO RESUME', windowWidth/2, windowHeight/2 + 40);
		}
	}
	
	// リザルト画面
	if(screenNo == 3){
		fill('#cccccc');
		textAlign(CENTER);
		textStyle(BOLD);
		textSize(32);
		text('SCORE:' + score,windowWidth/2, windowHeight/2);
		//fill('#ffffff');
		//text('SCORE:' + score,windowWidth/2, windowHeight/2);
		//text('RESTART TO CLICK',windowWidth/2, windowHeight/2 + 300);
		imageMode(CENTER);
		image(guysImg, windowWidth/2 - 400, windowHeight/2);
		image(restartImg, windowWidth/2, windowHeight/2 + 200);
	}
}

function mousePressed() {
	// ゲームスタート
	if(screenNo == 1 || screenNo == 3){
		screenNo = 2;
		difficulty = 0.8;
		score = 0;
		// ドラム
		drumX = [400, 800, 1200, 1600, 2000, 2400, 3000];
		drumSize = [250, 250, 250, 250, 250, 250, 150];
		drumMovable = [false, false, false, false, false, true, false];
		drumXmax = 3000;
		speedX = 2;
		// プレイヤー
		playerY = 250;
		playerSpeedY = 0;
		divedFlg = false;
	}
	
	// ダイブ処理
	if(!divedFlg && !(mouseX < 80 && mouseY < 80) && !posedFlg){
		playerSpeedY = 0;
		divedFlg = true;
	}
	
	// 大ジャンプ処理
	var drumHitFlg = false;
	for(var i = 0; i < drumX.length; i++){
		if(drumX[i] <= 300 && drumX[i] + drumSize[i] >= 300 )drumHitFlg = true;
	}
	if(playerY >= 100 && playerY < 140 && drumHitFlg && !(mouseX < 80 && mouseY < 80) && !posedFlg){
		playerSpeedY = 6;
		divedFlg = false;
	}
	
	// 再開
	if(posedFlg)posedFlg = false;
	
	// ポーズ処理
	if(screenNo == 2 && mouseX < 80 && mouseY < 80){
		posedFlg = true;
	}
}

function keyPressed() {
	// スペースキー:32/エンターキー:13が押された
	if(keyCode == 32 || keyCode == 13){
		// ゲームスタート
		if(screenNo == 1 || screenNo == 3){
			screenNo = 2;
			difficulty = 0.8;
			score = 0;
			// ドラム
			drumX = [400, 800, 1200, 1600, 2000, 2400, 3000];
			drumSize = [250, 250, 250, 250, 250, 250, 150];
			drumMovable = [false, false, false, false, false, true, false];
			drumXmax = 3000;
			speedX = 2;
			// プレイヤー
			playerY = 250;
			playerSpeedY = 0;
			divedFlg = false;
		}
		
		// ダイブ処理
		if(!divedFlg && !(mouseX < 80 && mouseY < 80) && !posedFlg){
			playerSpeedY = 0;
			divedFlg = true;
		}

		// 大ジャンプ処理
		var drumHitFlg = false;
		for(var i = 0; i < drumX.length; i++){
			if(drumX[i] <= 300 && drumX[i] + drumSize[i] >= 300 )drumHitFlg = true;
		}
		if(playerY >= 100 && playerY < 140 && drumHitFlg && !(mouseX < 80 && mouseY < 80) && !posedFlg){
			playerSpeedY = 6;
			divedFlg = false;
		}
		
		// 再開
		if(posedFlg)posedFlg = false;
	}
	
	// esc:27 / p:80(ポーズ)が押された
	if(screenNo == 2 && (keyCode == 27 || keyCode == 80)){
		posedFlg = true;
	}
}