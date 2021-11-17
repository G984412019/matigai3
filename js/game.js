let timer = null;
const Max = 3;
let clear = 0;

const APPLICATION_KEY = "2a8c57e41a5d463f4e84dc227a4aa4515d4b5b9e90f3350253cb4acbb04b0bfc";
const CLIENT_KEY = "5d09e947c280844aebe9926ecc776dc95a2db1ed3677100a9cdc5a597d4de64b";
const ncmb = new NCMB(APPLICATION_KEY,CLIENT_KEY);
const DBName = "TestClass";

let TestClass = ncmb.DataStore(DBName);

function init() {
  if (timer == null) {
    start = new Date();
    time();
    gameStart();
  }
}

function gameStart() {
  let size = 5;
  let qNum = Math.floor(Math.random()*q.length);
  for(let i=0; i<size*size; i++){
    let s = document.createElement("span");
    s.textContent = q[qNum][0];
    s.setAttribute("id", "num"+i);
    s.addEventListener("click", function(){
      if (this.textContent == q[qNum][1]){
         // alert("正解");
        clear++;
        correct.play();
        while (cells.firstChild) {
          cells.removeChild(cells.firstChild);
        }
        if(clear == Max){
          clearTimeout(timer);
          alert("クリア!  " + (timer - 1)+"秒");
          //データ保存
          let test = new TestClass();
          let key = "message";
          let value = (timer - 1);
          test.set(key, parseInt(value));
          test.save()
          .then (function(){
            console.log("成功");
          })
          .catch(function(err){
            console.log("エラー発生:" + err);
          });
          //データの比較
          TestClass
          .order("message")
          .fetchAll()
          .then(function(results){
            for (let i=0; i<results.length; i++) {
              console.log(results[i].message);
            }
            if(results[0].message >= parseInt(score.textContent)){
              alert("ハイスコア!");
            }
          })
          .catch(function (err) {
            console.log("エラー発生" + err);
          });
        }else{
          gameStart();
        }
      } else {
        wrong.play();
      }
    });
    cells.appendChild(s);
    if(i % size == size-1){
      const br = document.createElement("br");
      cells.appendChild(br);
    }
  }
  let p = Math.floor(Math.random()*size*size);
  let ans = document.getElementById("num" + p);
  ans.textContent = q[qNum][1];
}

function time() {
  let now = new Date();
  let eTime = parseInt((now.getTime() - start.getTime())/1000);
  score.textContent = eTime;
  timer = setTimeout("time()", 1000);
}
