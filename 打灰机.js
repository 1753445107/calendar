// 获取开始界面
var startdiv = document.getElementById('startdiv');
// 获取游戏界面
var maindiv = document.getElementById('maindiv');
// 获取分数
var label = document.getElementById('label');
// 最终的分数
var planescore = document.getElementById('planescore');
// 获取结束界面
var enddiv = document.getElementById('enddiv');
// 获取暂停界面
var stopdiv = document.getElementById('stopdiv');
// 获取暂停界面中的三个button
var inputContinue=document.getElementById('continue');
var inputRestart=document.getElementById('restart');
var inputReturn=document.getElementById('return');
// 定时器
var tid;
// 分数
var scores = 0;
// 保存敌方飞机的数组
var enemys = [];
// 保存子弹的数组
var bullets = [];
var time1 = 0;
var time2 = 0;
// 开始游戏的按钮单机事件
function begin() {
	startdiv.style.display = 'none';
	maindiv.style.display = 'block';
	stopdiv.style.display = 'none';
	tid = setInterval(start,30);
}
// 返回主界面
function tostart() {
	window.location.reload(true);
}
// 继续游戏
function tocontinue() {
	stopdiv.style.display = 'none';
	begin();
	if(document.addEventListener) {
  	maindiv.addEventListener("mousemove",ourmove,true);
	}else if(document.attachEvent) {
  	maindiv.attachEvent("onmousemove",ourmove);
	}
}

//暂停界面重新开始事件  
function restart(){  
	stopdiv.style.display = 'none';
	enddiv.style.display = 'none';
	selfplane.planenode.src = 'image/我的飞机.gif'
	scores=0;
	label.innerHTML = scores;
	var t = setInterval(function(){
		for (var i = 0,enemylen = enemys.length; i < enemys.length; i++) {
			maindiv.removeChild(enemys[i].planenode); 
			enemys.splice(i,1);
			enemylen--;
		}
		for (var i = 0,bulletlen = bullets.length; i < bullets.length; i++) {
			maindiv.removeChild(bullets[i].bulletnode); 
			bullets.splice(i,1);
			bulletlen--;
		}
		if (enemys.length == 0 && bullets.length == 0) {
		clearInterval(t);
		}
	},1);
	if(document.addEventListener) {
  		maindiv.addEventListener("mousemove",ourmove,true);
	}else if(document.attachEvent) {
  		maindiv.attachEvent("onmousemove",ourmove);
	}
	begin();
}
// 暂停函数
function stop() {	
	stopdiv.style.display = 'block';
	inputContinue.addEventListener('click',tocontinue,true);
	inputRestart.addEventListener('click',restart,true);
	inputReturn.addEventListener('click',tostart,true);
	clearInterval(tid);
	if (document.removeEventListener) {
		maindiv.removeEventListener('mousemove',ourmove,true);
	}else if(document.detachEvent){
		maindiv.detachEvent('onmousemove',ourmove);
	}
}
// 背景流动的临时变量
var positionY = 0;
// 循环调用的方法
function start() {
	// 背景图片的流动(不支持 FireFox)
	maindiv.style.backgroundPositionY = positionY + 'px';
	positionY += 1;
	if (positionY == 568) {
		positionY = 0;
	}
	time1++;
	if (time1 == 20) {
		time2++;
		if (time2 % 5 == 0) { //创建中型飞机
			enemys.push(new enemy(25,282,46,60,'image/enemy3_fly_1.png','image/中飞机爆炸.gif',3,15,300,500));
		}
		if (time2 == 20) { //创建大型飞机
			enemys.push(new enemy(57,216,110,164,'image/enemy2_fly_1.png','image/大飞机爆炸.gif',2,30,600,1000));
			time2 = 0;
		}
		else { //创建小型飞机
			enemys.push(new enemy(10,285,34,24,'image/enemy1_fly_1.png','image/小飞机爆炸.gif',4,2,200,200));
		}
		time1 = 0;
	}
	// 遍历数组
	var enemylen = enemys.length;
	for (var i = 0; i < enemylen; i++) {
		enemys[i].move();
		// 判断对应的敌方飞机是否超出边界
		if (enemys[i].planenode.offsetTop > 550) {
			maindiv.removeChild(enemys[i].planenode); //删除节点
			enemys.splice(i,1); //删除数组的元素
			enemylen--;
		}
		// 判断地方飞机当前是否为死亡
		if (enemys[i].planeisdie == true) {
			enemys[i].diecount += 20;
			if (enemys[i].diecount == enemys[i].dietime) {
				// 清除飞机
				maindiv.removeChild(enemys[i].planenode);
				enemys.splice(i,1);
				enemylen--;
			}
		}
		if (enemys[i].planeisdie == false) {
			// 1.本方飞机与敌方飞机的碰撞判断
			if (enemys[i].planenode.offsetLeft <= selfplane.planenode.offsetLeft + 66 && enemys[i].planenode.offsetLeft + enemys[i].sizeX >= selfplane.planenode.offsetLeft) {
				if (enemys[i].planenode.offsetTop <= selfplane.planenode.offsetTop + 80 && enemys[i].planenode.offsetTop + enemys[i].sizeY >= selfplane.planenode.offsetTop + 40) {
					// 碰撞后本方飞机爆炸，切换图片
					selfplane.planenode.src = 'image/本方飞机爆炸.gif';
					// 显示结束界面
					enddiv.style.display = 'block';
					// 显示分数
					planescore.innerHTML = scores;
					// 结束循环时间，关闭定时器
					clearInterval(tid);
					// 取消鼠标移动(监听事件)
					if (document.removeEventListener) {
						maindiv.removeEventListener('mousemove',ourmove,true);
					}else if(document.detachEvent){
						maindiv.detachEvent('onmousemove',ourmove);
					}
				}
			}
		}
	}
	// 创建子弹
	if (time1 % 5 == 0) {
		bullets.push(new oddbullet((selfplane.planenode.offsetLeft + 31),(selfplane.planenode.offsetTop - 15)));
		bullets.push(new oddbullet1((selfplane.planenode.offsetLeft + 31),(selfplane.planenode.offsetTop - 15)));
		bullets.push(new oddbullet2((selfplane.planenode.offsetLeft + 31),(selfplane.planenode.offsetTop - 15)));
	}
	// 子弹移动
	var bulletlen = bullets.length;
	for (var i = 0; i < bulletlen; i++) {
		bullets[i].move();
		// 子弹超出边界
		if (bullets[i].bulletnode.offsetTop < 0){
		maindiv.removeChild(bullets[i].bulletnode);
		bullets.splice(i,1);
		bulletlen--;
		}
	}
	// 碰撞判断
	for (var k = 0; k < bulletlen; k++){
		for (var j = 0; j < enemylen; j++){
			// 2.子弹与敌方飞机的碰撞判断
			if (bullets[k].bulletnode.offsetLeft <= enemys[j].planenode.offsetLeft + enemys[j].sizeX && bullets[k].bulletnode.offsetLeft + 6 >= enemys[j].planenode.offsetLeft) {
				if (bullets[k].bulletnode.offsetTop <= enemys[j].planenode.offsetTop + enemys[j].sizeY && bullets[k].bulletnode.offsetTop + 14 >= enemys[j].planenode.offsetTop) {
					// 四个条件都满足时满足碰撞
					enemys[j].hp -= 1;
					if (enemys[j].hp == 0) {
						enemys[j].planenode.src = enemys[j].boomsrc;	
						// 飞机标记为死亡
						enemys[j].planeisdie = true;
						// 统计分数
						scores += enemys[j].score;
						label.innerHTML = scores;
					}
					// 删除打中的子弹
					maindiv.removeChild(bullets[k].bulletnode);
					bullets.splice(k,1);
					bulletlen--;
					break; 
				}
			}
		}
	}
}
// ----------------------创造对象----------------------- //
// 创建飞机父类构造函数
function plane(x,y,sizeX,sizeY,imgsrc,boomsrc,speed,hp,dietime,score) {
	this.x = x;
	this.y = y;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.imgsrc = imgsrc;
	this.boomsrc = boomsrc;
	this.speed = speed;
	this.hp = hp;
	// 敌方飞机是否死亡
	this.planeisdie = false;
	// 死亡时间，延时爆炸
	this.dietime = dietime;
	this.diecount = 0;
	this.score = score;
	// 显示飞机原理：创建节点,插入节点
	this.planenode = null;
	this.init = function() {
		this.planenode = document.createElement('img');
		this.planenode.style.position = 'absolute';
		this.planenode.style.left = this.x + 'px';
		this.planenode.style.top = this.y + 'px';
		this.planenode.src = this.imgsrc;
	}
	this.init();
	// 插入节点
	maindiv.appendChild(this.planenode);
	// 移动行为
	this.move = function() {
		if(scores<=5000){  
		this.planenode.style.top=this.planenode.offsetTop+this.speed+"px";  
		}  
		else if(scores>5000&&scores<=10000){  
		this.planenode.style.top=this.planenode.offsetTop+this.speed+1+"px";  
		}  
		else if(scores>10000&&scores<=15000){  
		this.planenode.style.top=this.planenode.offsetTop+this.speed+2+"px";  
		} 
		else if(scores>15000&&scores<=20000){  
		this.planenode.style.top=this.planenode.offsetTop+this.speed+3+"px";  
		} 		
		else{  
		this.planenode.style.top=this.planenode.offsetTop+this.speed+4+"px";  
		}   
	}
}
// 创建子弹的父类构造函数
function bullet(x,y,imgsrc) {
	this.x = x;
	this.y = y;
	this.imgsrc = imgsrc;
	this.bulletnode = null;
	this.init = function() {
		this.bulletnode = document.createElement('img');
		this.bulletnode.style.position = 'absolute';
		this.bulletnode.style.left = this.x + 'px';
		this.bulletnode.style.top = this.y + 'px';
		this.bulletnode.src = this.imgsrc;
		maindiv.appendChild(this.bulletnode);
	}
	this.init();
	// 移动行为
	this.move = function() {
		this.bulletnode.style.top = this.bulletnode.offsetTop - 20 + 'px';
	}
}
// 创建本方飞机构造函数
function selfplane(x,y){
	plane.call(this,x,y,null,null,'image/我的飞机.gif',null,null,null,null,null);
}
// 1.本方飞机移动
var ourmove = function() {
	var oevent = window.event || arguments[0];
	var selfplaneX = oevent.clientX - 500;
	var selfplaneY = oevent.clientY;
	if (oevent.clientX < 787 && oevent.clientX > 533 && oevent.clientY < 528 && oevent.clientY > 40) {
		selfplane.planenode.style.left = selfplaneX - 33 + 'px';
		selfplane.planenode.style.top = selfplaneY - 40 + 'px';
	}
}
// 创建本方飞机对象
var selfplane = new selfplane(120,485);
// 创建敌方飞机构造函数
function enemy(a,b,sizeX,sizeY,imgsrc,boomsrc,speed,hp,dietime,score) {
	plane.call(this,random(a,b),0,sizeX,sizeY,imgsrc,boomsrc,speed,hp,dietime,score);
}
function random(a,b) {
	return Math.floor(Math.random()*(b-a) + a);
}
// -------------------------子弹------------------------- //
//创建单行子弹
function oddbullet(x,y) {
  bullet.call(this,x,y,"image/bullet1.png");
}
function oddbullet1(x,y) {
  bullet.call(this,(x-22),(y+25),"image/bullet1.png");
}
function oddbullet2(x,y) {
  bullet.call(this,(x+22),(y+25),"image/bullet1.png");
}
// ----------------------事件监听----------------------- //
if(document.addEventListener) {
  	maindiv.addEventListener("mousemove",ourmove,true);
  	maindiv.addEventListener("click",stop,true);
}else if(document.attachEvent) {
  	maindiv.attachEvent("onmousemove",ourmove);
  	maindiv.attachEvent("onclick",stop);
}