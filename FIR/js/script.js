// JavaScript Document
window.onload=function(){
	var chessBoard = [];//存储棋盘各个位置，二维数组
	var me = true;//区分下棋的两方，true为黑棋，false为白棋
	var over = false; //标志游戏是否结束
	
	var wins = [];	//赢法数组，三维数组
	
	//赢法的统计数组
	var myWin = [];
	var computerWin = [];
	
	//初始化棋盘数组
	for(var i=0; i<15; i++){
		chessBoard[i]=[];//定义为二维数组
		for(var j=0; j<15; j++){
			chessBoard[i][j]=0;
		}
	}
	//初始化赢法数组，三维数组
	for(var i=0; i<15; i++){
		wins[i] = [];//定义为二维数组
		for(var j=0; j<15; j++){
			wins[i][j]=[];//定义为三维数组
		}
	}
	
	var count = 0;//赢法种类的索引
	//横线赢
	for(var i=0; i<15; i++){
		for(var j=0; j<11; j++){
			for(var k=0; k<5; k++){
				wins[i][j+k][count] = true;
			}
			count++;
		}
	}
	//竖线赢
	for(var i=0; i<15; i++){
		for(var j=0; j<11; j++){
			for(var k=0; k<5; k++){
				wins[j+k][i][count] = true; //注意下标
			}
			count++;
		}
	}
	//斜线赢
	for(var i=0; i<11; i++){
		for(var j=0; j<11; j++){
			for(var k=0; k<5; k++){
				wins[i+k][j+k][count] = true;
			}
			count++;
		}
	}
	//反斜线赢
	for(var i=0; i<11; i++){
		for(var j=14; j>3; j--){
			for(var k=0; k<5; k++){
				wins[i+k][j-k][count] = true;
			}
			count++;
		}
	}
	
	//初始化赢法统计数组
	for(var i=0; i<count; i++){
		myWin[i] = 0;
		computerWin[i] = 0;
	}
	
	

	//画棋盘
	var chess = document.getElementById('chess');
	var context = chess.getContext('2d');
	
	context.strokeStyle = "#BFBFBF";
	
	//画logo
	var drawLogo = function(){
		//var logo = new Image();
		//logo.src = "image/logo.jpg";
		//logo.onload = function(){
			//context.drawImage(logo, 0, 0, 450, 450);
			drawChessBoard();

		//}

	}
	//画背景线
	var drawChessBoard = function(){
		for(var i=0 ;i<15; i++){
			//画竖线
			context.moveTo(15 + i*30, 15);
			context.lineTo(15 + i*30, 435);
			context.stroke();
			//画横线
			context.moveTo(15, 15 + i*30);
			context.lineTo(435,15 + i*30);
			context.stroke();
		}
	
	}
	//画棋子
	var oneStep = function(i, j, me){
		context.beginPath();
		context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
		context.closePath();
		
		var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
		
		//设置棋子的颜色
		if(me){
			gradient.addColorStop(0,"#0a0a0a");
			gradient.addColorStop(1,"#636766");
		}else{
			gradient.addColorStop(0,"#d1d1d1");
			gradient.addColorStop(1,"#f9f9f9");
		}
		
		context.fillStyle = gradient;
		context.fill();
	}
	
	drawLogo();
	
	chess.onclick = function(e){
		if(over){
			return;
		}
		if(!me){
			return;
		}
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x/30);
		var j = Math.floor(y/30);
		if(chessBoard[i][j] == 0){//对棋盘进行设定，已经有棋子的位置就不允许再下棋
			oneStep(i, j, me);
			chessBoard[i][j] = 1;//如果是黑棋，则为1			
			
			for(var k=0;k<count;k++){
				if(wins[i][j][k]){
					myWin[k]++;
					computerWin[k] = 6;//6为异常值
					if(myWin[k] == 5){
						window.alert("你赢了");
						over = true;
					}
				}
			}
			if(!over){
				me=!me;
				computerAI();
			}
		}
	}
	var computerAI = function(){
		var myScore = [];//记录我方得分
		var computerScore = [];//记录计算机得分
		var max = 0;//
		var u=0,v=0;
		for(var i=0; i<15; i++){
			myScore[i] = [];
			computerScore[i] = [];
			for(var j=0; j<15; j++){
				myScore[i][j] = 0;
				computerScore[i][j] = 0;
			}
		}
		for(var i=0; i<15; i++){
			for(var j=0; j<15; j++){
				if(chessBoard[i][j] == 0){
					for(var k=0; k<count; k++){
						if(wins[i][j][k]){
							if(myWin[k] == 1){
								myScore[i][j] += 200;
							}else if(myWin[k] == 2){
								myScore[i][j] += 400;
							}else if(myWin[k] == 3){
								myScore[i][j] += 2000;
							}else if(myWin[k] == 4){
								myScore[i][j] += 10000;	
							}
							
							if(computerWin[k] == 1){
								computerScore[i][j] += 220;
							}else if(computerWin[k] == 2){
								computerScore[i][j] += 420;
							}else if(computerWin[k] == 3){
								computerScore[i][j] += 2200;
							}else if(computerWin[k] == 4){
								computerScore[i][j] += 20000;	
							}
						}
					}
					
					if(myScore[i][j] > max){
						max = myScore[i][j];
						u = i;
						v = j;
					}else if(myScore[i][j] = max){
						if(computerScore[i][j] > computerScore[u][v]){
							u = i;
							v = j;
						}
					}
					if(computerScore[i][j] > max){
						max = computerScore[i][j];
						u = i;
						v = j;
					}else if(computerScore[i][j] = max){
						if(myScore[i][j] > myScore[u][v]){
							u = i;
							v = j;
						}
					}
					
				}
			}
		}
		oneStep(u,v,false);
		chessBoard[u][v] = 2;
		for(var k=0;k<count;k++){
				if(wins[u][v][k]){
					computerWin[k]++;
					myWin[k] = 6;//6为异常值
					if(computerWin[k] == 5){
						window.alert("你输了");
						over = true;
					}
				}
			}
			if(!over){
				me=!me;
			}
	}
	
}



