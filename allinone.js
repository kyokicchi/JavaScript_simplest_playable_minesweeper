
<html>
<head>
<style>
button { 
width: 20px;
height: 20px;
font-size: 10px;
text-align: center;
font-weight: bold;
vertical-align: middle;
}

.opened{
background-color: darkgray;
}
</style>

</head>
<body>
<div>----------------</div>
<div id="field"></div>
<div>----------------</div>
</body>


<script type="text/javascript" >

//------------------------------------------------------------------- Init process

var field = document.getElementById("field");

field.addEventListener("contextmenu", function(e){
                    e.preventDefault();
                }, false);


var H;
var W;
var B;

var coveredStr = " ";
var markedStr = "!";
var emptyStr = " ";
var bombStr = "x"




var L = [];
var F = [];
var visible = [];
var openStock = [];

function initGame(){

	H = window.prompt("number of rows?"); 
	W = window.prompt("number of columns?");
	B = window.prompt("number of bombs?");
	if(B>H*W){alert("# of Bombs > field. Not gonna work.");initGame();}

	initField();
	initIndex();
	for(i=0;i<B;i++){ placeBomb(); }
	analyzeField();
	showField();
}

initGame();

//------------------------------------------------------------------- when button clicked

function buttonClicked(x,y){
	if(F[x][y] == bombStr){
		alert("Kaboon!");
		initGame();
	}else{
		if(F[x][y]==emptyStr){ 
			openStock = [];
			openSeqChk(x,y);
			applyOpen();
		}
		else{visible[x][y] = "show";}
		showField();
	}

	openNum =0;
	visible.forEach(function(v){ v.forEach(function(vv){if(vv =="show"){openNum++;}}); })
	if (openNum == (W*H) - B){
		alert("nice work!");
		initGame();
	}
}



function buttonMarked(x,y){
	visible[x][y] = visible[x][y] =="marked" ? "hidden" : "marked";
	showField();
}

//------------------------------------------------------------------- sub functions

function applyOpen(){
	openStock.forEach(function(v){
		coords = v.split("-");
		x = coords[0];
		y = coords[1];
		visible[x][y]="show"
	});
}



function openSeqChk(x,y){
	txt = x + "-" + y;
	openStock.push(txt);
	for(var i=-1;i<=1;i++){
		for(var j=-1;j<=1;j++){
			xinrange = x+i >=0 && x+i < H ? true:false;
			yinrange = y+j >=0 && y+j < W ? true:false;
			txtnxt = (x+i) + "-" + (y+j);
			notChecked = openStock.indexOf(txtnxt) == -1? true:false;
			if(xinrange && yinrange && notChecked){
				if (F[x+i][y+j] == emptyStr){openSeqChk(x+i,y+j);}
				else if (F[x+i][y+j] !==bombStr){ openStock.push(txtnxt);}
			}
		}
	}

}

function initField(){
	for (var i = 0 ; i<H ; i++){
		subF = [];
		subV = [];
		for (var j = 0;j<W;j++){
			subF[j] = emptyStr;
			subV[j] = "hidden";
		}
		F[i] = subF;
		visible[i] = subV;
	}
}

function initIndex(){
	L = [];
	for (var i = 0 ; i<H ; i++){
		for (var j = 0;j<W;j++){
			L.push([i , j]);
		}
	}	
}

function placeBomb(){
	var dice = Math.floor(Math.random() * L.length)
	var pick = L[dice];
	L.splice(dice,1)
	var x = pick[0];
	var y = pick[1];
	F[x][y] = bombStr;
}

function analyzeField(){
	for(i = 0;i<H;i++){
		for(j=0;j<W;j++){
			if(F[i][j] !== bombStr){ 
				tmp = bombsAround(i , j);
				F[i][j]  = tmp == 0? emptyStr : tmp;
			}
		}
	}
}

function bombsAround(x,y){
	var num = 0;
	for(var ii=-1;ii<=1;ii++){
		for(var jj=-1;jj<=1;jj++){
			if(x+ii >=0 && x+ii <H && y+jj >=0 && y+jj <W){
				if(F[x+ii][y+jj] == bombStr){num++;}
			}
		}
	}
	return num;
}

"oncontextmenu = 'buttonMarked(" + i +", "+ j + ")'>"

function showField(){
	var ans =""
	for (var i = 0 ; i<H ; i++){
		for (var j = 0;j<W;j++){
			label = F[i][j] == 0 ? emptyStr : F[i][j];
			if(visible[i][j] == "show"){ans = ans + "<button class='opened'>" + label +"</button>";}
			else if(visible[i][j] == "marked"){ans = ans + "<button onclick='buttonClicked(" + i + ","+ j + ")' " +"oncontextmenu = 'buttonMarked(" + i +", "+ j + ")'>" + markedStr +"</button>";}
			else{ans = ans + "<button onclick='buttonClicked(" + i + ","+ j + ")' " +"oncontextmenu = 'buttonMarked(" + i +", "+ j + ")'>" + coveredStr +"</button>";}
		}
		ans = ans + "<br>";
	}
document.getElementById("field").innerHTML = ans;
}




</script>
</html>
