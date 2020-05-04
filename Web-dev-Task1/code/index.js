var Click = new Audio("./assets/Click2.mp3")
var Click2 = new Audio("./assets/Click.mp3")
var bgm2 = new Audio("./assets/BGM2.mp3")
var timebeep = new Audio("./assets/timebeep.mp3")
var bgm = new Audio("./assets/BGM.mp3")

function timer(object){
  window.x = "null"
  const start = new Date()

  window.x = setInterval(()=>{
    let now = new Date()
    let dt = now.getTime()-start.getTime()
    object.innerHTML = dt/1000
  }, 1)

}

function max(a){
  let m = 0
  for(let i = 0; i<5; i++){
    if(a[m]<a[i]){
      m = i
    }
  }
  return m
}

console.log(max(localStorage))

window.m = localStorage.length
var gs, total, bestTime, click
const main = document.querySelector("#main")
const init = document.querySelector("#init")
const mainStart = document.querySelector("#mainStart")
const high = document.querySelector("#high")
const highScore = document.querySelector("#highScore")
const back = document.querySelectorAll(".back")
const hslist = document.querySelector("#hslist")
const best = document.querySelector("#best")

mainStart.addEventListener("click", e =>{
  bgm2.play()
  init.style.display = "none"
  main.style.display = "block"
  bestTime = displayHighScore()
  best.textContent = bestTime[0]
})

back.forEach(bk=>{
  bk.addEventListener("click", e =>{
    e.target.parentNode.parentNode.style.display = "none"
    init.style.display = "block"
    bgm2.pause()
    bgm.pause()
  })
})

high.addEventListener("click", e =>{
  bgm2.play()
  init.style.display = "none"
  highScore.style.display = "block"
  let x = displayHighScore();
})

function displayHighScore(){
  while(hslist.firstChild){
    hslist.removeChild(hslist.firstChild)
  }

  var hl = localStorage.length
  var scores = []
  for(let i=0; i<hl; i++){
    scores.push(parseFloat(localStorage[i]))
  }

  scores.sort(srt)

  function srt(a,b){
    return (a-b)
  }

  for(let i=0; i<hl; i++){
      let li = document.createElement("div")
      li.textContent = scores[i]
      hslist.appendChild(li)
  }
  return scores
}

const totalCount = document.querySelectorAll("#start>#totalCount>input")
const gridSize = document.querySelectorAll("#start>#gridSize>input")
const start = document.querySelector("#start")
const boxes = document.querySelector("#boxes")
const msg = document.querySelector("#msg")
const clock = document.querySelector("#clock")

totalCount.forEach(rad => {
  rad.addEventListener('click', e => {
    Click2.play()
    console.log(e.target.value)
    total = e.target.value
  })
})

gridSize.forEach(rad => {
  rad.addEventListener('click', e => {
    Click2.play()
    console.log(e.target.value)
    gs = e.target.value
  })
})

function newGame(){
  clearInterval(window.x)
  bgm.pause()
  bgm2.play()
  boxes.removeEventListener('click', click)
  start.style.visibility = "visible"

  while(boxes.firstChild){
    boxes.removeChild(boxes.firstChild)
  }
  boxes.style.visibility = "collapse"
  msg.style.fontSize = '5vw'
  msg.style.visibility = "collapse"
}

function game(){
  if(gs==undefined || total==undefined){
    start.style.visibility = "hidden"
    msg.style.visibility = "visible"
    msg.style.fontSize = '8vw'
    msg.textContent="No option selected!"
    Click.play()
  }
  else {
  bgm2.pause()
  start.style.visibility = "collapse"
  const s = new Date()
  var z = setInterval(()=>{
    let n = new Date()
    let t = n.getTime()-s.getTime()
    v = 3-t/1000+1
    msg.style.visibility = "visible"
    msg.style.fontSize = '15vw'
    msg.textContent = Math.floor(v)
    timebeep.play()
    if(v<1){
      clearInterval(z)
      gameStart()
    }
  }, 100)
}
}

function gameStart(){
  msg.style.visibility = "collapse"
  boxes.style.visibility = "visible"

  boxes.style.gridTemplateColumns = "repeat("+gs+", 1fr)"
  boxes.style.gridTemplateRows = "repeat("+gs+", 1fr)"

  var j = 0
  var arr1 = []
  var arr2 = gs*gs+1

  for(let i=1;i<=gs*gs;i++){
    arr1.push(i)
  }

  arr1.sort(func)
  function func(a,b){
    return 0.5-Math.random()
  }

  for (let i=0; i<gs*gs; i++){
    let x = document.createElement("div")
    x.className = "box"
    x.textContent = arr1[i]
    boxes.appendChild(x)
  }

  //fortyShades()

  timer(clock);

  var count = 1

  click = function(e){

    let tar = e.target
    if(tar.textContent==count){
      Click2.play()
      if(e.target.textContent>total-gs*gs){
        tar.style.color = "rgba(0,0,0,0)"
      }
      else{
        e.target.textContent = arr2++
      }
      count++
    }
    else {
      clearInterval(window.x)
      let b = document.querySelectorAll(".box")
      b.forEach(c =>{
        c.style.visibility = "hidden"
        msg.style.visibility = "visible"
        msg.style.fontSize = "5vw"
        msg.textContent = "You lost!"
        Click.play()
        boxes.removeEventListener("click", click)
      })

    }
    if((count-1)==total){
      clearInterval(window.x)
      boxes.removeEventListener("click", click)
      msg.style.visibility = "visible"
      msg.style.fontSize = "5vw"
      msg.textContent = "You WON!"
      fortyShades()
      bgm.play()
      if(localStorage.length<5){
        localStorage.setItem(""+window.m, clock.textContent)
        window.m++
      }
      else {
        let m = max(localStorage)
        if(localStorage[m]>clock.textContent){
          localStorage.removeItem(m)
          localStorage.setItem(""+m,clock.textContent)
        }
      }

      var d = displayHighScore()
      best.textContent = d[0]
    }

  }

  boxes.addEventListener("click", click)
}

function fortyShades(){
  let bx = document.querySelectorAll(".box")
  let grad = 100/(gs*gs)
  let i = 1
  bx.forEach(x => {
    let l = (i++)*grad
    x.style.background = "hsl(0, 0%, "+l+"%)"

  })
}
