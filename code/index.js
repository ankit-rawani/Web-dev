var playername = prompt("Enter your name")
var score = 0
var highScore

if(localStorage.length == 0){
    localStorage.setItem(playername, 0)
}
highScore = localStorage[localStorage.key(0)]

var aud = new Audio("./Evix - Whatcha Think (feat. Jake Herring).mp3")
var click = new Audio("./Web-dev-Task1/assets/Click.mp3")
var err = new Audio("./Web-dev-Task1/assets/Click2.mp3")
var beep = new Audio("./Web-dev-Task1/assets/timebeep.mp3")

const play = document.querySelector('#play')
const high = document.querySelector('#high')
const about = document.querySelector('#about')
const intro = document.querySelector('#intro')
const circle = document.querySelector('#circle')
const options = document.querySelector('#options')
const menu = document.querySelector('#menu')
const playgame = document.querySelector('#playgame')
const replay = document.querySelector('#replay')
const ham = document.querySelector('#ham')
const back = document.querySelector('#back')
const cross = document.querySelector('#cross')
const blackout = document.querySelector('#blackout')
const msg = document.querySelector("#msg")
const crossHigh = document.querySelector("#crossHigh")

const canv = document.querySelector('canvas')
var ctx = canv.getContext("2d")

canv.height = window.innerHeight
canv.width = window.innerWidth   

ctx.lineWidth = 10
ctx.lineCap = "round"

var gamePlayState = true
var gameEnded = false

window.addEventListener('resize', e => {
    canv.height = window.innerHeight
    canv.width = window.innerWidth
})


canv.addEventListener('mousedown', e => {
    click.play()
    ball.dy -= 5
    if(ball.y >= canv.height-ball.radius-1){
        ball.y = canv.height - ball.radius - 2
    }
})

function distance(x0, y0, x, y) {
    return Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))
}

function distanceFromLine(l,ball) {
    let side = distance(l.x1, l.y1, l.x2, l.y2)
    let z = ((l.x2 - l.x1) * (ball.x - l.x1) + (l.y2 - l.y1) * (ball.y - l.y1)) / side
    let a = distance(ball.x, ball.y, l.x1, l.y1)

    // console.log(a, z)
    if(z <= side && z>=0)
    { 
        return Math.sqrt( a * a - z * z)
    }
    else {
        return 2 * ball.radius
    }
}

function Ball(x, y, dx, dy, radius, color){
    this.radius = radius
    this.x = x
    this.y = y
    this.color = color
    this.dy = dy
    this.dx = dx

    this.draw = function(){
        ctx.restore()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }

    this.move = function(){
        if(this.y >= canv.height - this.radius-1){
            this.dy = -this.dy*0.9
        }
        else{
            this.dy += 0.2   
        }

        this.y += this.dy
        this.draw()
    }

    // this.checkCollision = function() {
    //     let imgData = ctx.getImageData(this.x-this.radius, this.y-this.radius, 2*this.radius, 2*this.radius)
    //     // console.log(imgData.data)
    //     let i = 0
    //     while(i<imgData.data.length){
    //         let red = imgData.data[0]
    //         let green = imgData.data[1]
    //         let blue = imgData.data[2]
    //         console.log(rgb(parseInt(red), parseInt(green), parseInt(blue)))
    //         i+=4
    //     }
    // }
    
}

function Line(x1, y1, x2, y2, color) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color

    this.draw = function () {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.strokeStyle = this.color
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.closePath()
    }
}

function Arc(centre, radius, sAngle, eAngle, color){
    this.centre = centre
    this.radius = radius
    this.color = color
    this.sAngle = sAngle
    this.eAngle = eAngle

    this.draw = function(){
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.arc(this.centre.x, this.centre.y, this.radius, this.sAngle, this.eAngle)
        ctx.stroke()
        ctx.closePath()
    }

}

function ColorSwitch(pos, vel) {
    this.vel = vel
    this.pos = pos
    this.radius = 10
    this.color
    this.colorArr = ["#ff0000", "#00ff00", "#0000ff"]
    this.circle
    this.i = 0

    this.draw = function(){
        this.i++

        if(this.i%60 == 0){
            this.color = this.colorArr[Math.floor(Math.random() * this.colorArr.length)]
        }

        this.circle = new Arc(this.pos, this.radius, 0, Math.PI * 2, this.color)
        this.circle.draw()
    }

    this.move = function() {
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y

        if(ball.y <= this.pos.y+5 && ball.y >=this.pos.y - 5){
            ball.color = this.colorArr[Math.floor(Math.random() * this.colorArr.length)]
        }
        
        this.draw()
    }

}

function gameEnd(){
    err.play()
    gameEnded = true
    gamePlayState = false
    console.log("done")
    window.cancelAnimationFrame(window.x)
    ctx.clearRect(0,0,canv.width,canv.height)

    htitle.textContent = "GAME OVER!!!"
    hmsg.textContent = "Try again, all you need is a little practice."
    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function Triangle(centre, side, velocity){
    this.centre = centre
    this.side = side
    this.velocity = velocity
    this.angle = 0
    this.radVelocity = 0.05
    this.p1 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle), y: (side / Math.sqrt(3)) * Math.sin(this.angle) }
    this.p2 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (2 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (2 / 3) * Math.PI) }
    this.p3 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (4 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (4 / 3) * Math.PI) }
    this.line1
    this.line2
    this.line3

    this.draw = function(){
        this.line1 = new Line(
            this.centre.x + this.p1.x, this.centre.y + this.p1.y,
            this.centre.x + this.p2.x, this.centre.y + this.p2.y,
            "#ff0000"
        )

        this.line1.draw()

        this.line2 = new Line(
            this.centre.x + this.p2.x, this.centre.y + this.p2.y,
            this.centre.x + this.p3.x, this.centre.y + this.p3.y,
            "#00ff00"
        )

        this.line2.draw()

        this.line3 = new Line(
            this.centre.x + this.p3.x, this.centre.y + this.p3.y,
            this.centre.x + this.p1.x, this.centre.y + this.p1.y,
            "#0000ff"
        )

        this.line3.draw()
    }

    this.move = function(){
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y
        this.rotate()

    }

    this.end = function() {
        if (distanceFromLine(this.line1, ball) <= ball.radius && this.line1.color != ball.color) {
            // console.log(distanceFromLine(this.line1, ball))
            gameEnd()
        }

        if (distanceFromLine(this.line2, ball) <= ball.radius && this.line2.color != ball.color) {
            // console.log(distanceFromLine(this.line2, ball))
            gameEnd()
        }

        if (distanceFromLine(this.line3, ball) <= ball.radius && this.line3.color != ball.color) {
            // console.log(distanceFromLine(this.line3, ball))
            gameEnd()
        }
    }

    this.rotate = function () {
        this.angle += this.radVelocity
        this.p1 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle), y: (side / Math.sqrt(3)) * Math.sin(this.angle) }
        this.p2 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (2 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (2 / 3) * Math.PI) }
        this.p3 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (4 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (4 / 3) * Math.PI) }
        this.draw()        
    }

}

function Circle(centre, radius, velocity){
    this.centre = centre
    this.radius = radius
    this.velocity = velocity
    this.colorArray = ["#ff0000", "#00ff00","#0000ff"]
    this.arc1
    this.arc2
    this.arc3
    this.angle = 0
    this.radVelocity = 0.05

    this.draw = function(){
        this.arc1 = new Arc(this.centre, this.radius, this.angle, this.angle + (2 / 3) * Math.PI, this.colorArray[0])
        this.arc1.draw()
        this.arc2 = new Arc(this.centre, this.radius, this.angle + (2 / 3) * Math.PI, this.angle + (4 / 3) * Math.PI, this.colorArray[1])
        this.arc2.draw()
        this.arc3 = new Arc(this.centre, this.radius, this.angle + (4 / 3) * Math.PI, this.angle + 2 * Math.PI, this.colorArray[2])
        this.arc3.draw()
    }

    this.rotate = function(){
        this.angle += this.radVelocity
        this.draw()
    }

    this.move = function () {
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y
        this.rotate()
    }

    this.end = function() {
        if ((distance(this.centre.x, this.centre.y, ball.x, ball.y) <= ball.radius + this.radius + 5) && distance(this.centre.x, this.centre.y, ball.x, ball.y) >= ball.radius + this.radius - 5) {
            let ang
            if (ball.y > this.centre.y) {
                ang = (this.angle - Math.PI / 2) % (2 * Math.PI)
    
            }
            else {
                ang = (this.angle + Math.PI / 2) % (2 * Math.PI)
            }

            if (ang > 0 && ang <= (2 / 3) * Math.PI) {
                console.log("blue")
                if (ball.color != this.colorArray[2]) {
                    gameEnd()
                }
            }
            else if (ang > (2 / 3) * Math.PI && ang <= (4 / 3) * Math.PI) {
                console.log("green")
                if (ball.color != this.colorArray[1]) {
                    gameEnd()
                }
            }
            else {
                console.log('red')
                if (ball.color != this.colorArray[0]) {
                    gameEnd()
                }
            }
        }
    }
}

function Fan(centre, radius, velocity) {
    this.centre = centre
    this.radius = radius
    this.velocity = velocity
    this.colorArray = ["#ff0000", "#00ff00", "#0000ff"]
    this.angle = 0
    this.radVelocity = 0.05
    this.line1
    this.line2
    this.line3
    this.p1 = { x: this.radius * Math.cos(this.angle), y: this.radius * Math.sin(this.angle) }
    this.p2 = { x: this.radius * Math.cos(this.angle + (2 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (2 / 3) * Math.PI) }
    this.p3 = { x: this.radius * Math.cos(this.angle + (4 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (4 / 3) * Math.PI) }

    this.draw = function() {
        this.line1 = new Line(this.centre.x, this.centre.y, this.centre.x + this.p1.x, this.centre.y + this.p1.y, colorArray[0])
        this.line1.draw()

        this.line2 = new Line(this.centre.x, this.centre.y, this.centre.x + this.p2.x, this.centre.y + this.p2.y, colorArray[1])
        this.line2.draw()

        this.line3 = new Line(this.centre.x, this.centre.y, this.centre.x + this.p3.x, this.centre.y + this.p3.y, colorArray[2])
        this.line3.draw()
    }

    this.rotate = function() {
        this.angle += this.radVelocity
        this.p1 = { x: this.radius * Math.cos(this.angle), y: this.radius * Math.sin(this.angle) }
        this.p2 = { x: this.radius * Math.cos(this.angle + (2 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (2 / 3) * Math.PI) }
        this.p3 = { x: this.radius * Math.cos(this.angle + (4 / 3) * Math.PI), y: this.radius * Math.sin(this.angle + (4 / 3) * Math.PI) }
        this.draw()
    }

    this.move = function() {
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y

        this.rotate()
    }

    this.end = function() {
            if (distanceFromLine(this.line1, ball) <= ball.radius && this.line1.color != ball.color) {
                // console.log(distanceFromLine(this.line1, ball))
                gameEnd()
            }

            if (distanceFromLine(this.line2, ball) <= ball.radius && this.line2.color != ball.color) {
                // console.log(distanceFromLine(this.line2, ball))
                gameEnd()
            }

            if (distanceFromLine(this.line3, ball) <= ball.radius && this.line3.color != ball.color) {
                // console.log(distanceFromLine(this.line3, ball))
                gameEnd()
            }
    }


}

function func(a, b) {
    return Math.random() - 0.5
}

var v = { x: 0, y: 3 }
var y_array = [-100, -700, -1300]

y_array.sort(func)

var c1 = { x: canv.width / 2, y: y_array[0] }
var s1 = 200

var c2 = { x: canv.width / 2, y: y_array[1] }
var s2 = 100

var c3 = { x: canv.width / 2 - 40, y: y_array[2] }
var s3 = 100

var colorArray = ["#ff0000","#00ff00","#0000ff"]

var ball = new Ball(canv.width / 2, canv.height/2, 0, 2, 5, colorArray[Math.floor(Math.random()*3)])

var obstacles = []
var tri = new Triangle(c1,s1,v)
var cir = new Circle(c2, s2, v)
var fan = new Fan(c3, s3, v)

obstacles.push(tri)
obstacles.push(cir)
obstacles.push(fan)

var pS = { x: canv.width/2, y: -1000}
var swt = new ColorSwitch(pS,v)

function animate() {
    window.x = window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    
    if(score>2000){
        gameWon()
    }
    ball.move()
    if (ball.y <= 3 * canv.height / 4) {
            obstacles.forEach(obs => {
            obs.move()
            obs.end()
        })


        swt.move()
        ctx.font = "20px 'Open-sans', sans-serif"
        ctx.fillStyle = "#ffffff"
        ctx.fillText(score, canv.width - 50, 30)
        score += v.y 
    }
    else {
        obstacles.forEach(obs => {
            obs.rotate()
            obs.end()
            ctx.fillStyle = "#ffffff"
            ctx.fillText(score, canv.width - 50, 30)
        })
        swt.draw()
    }
    

}

// animate()


play.addEventListener("click", e=> {
    beep.play()
    circle.style.display = "none"
    intro.style.display = "none"
    options.style.display = "none"
    canv.style.display = "block"

    ham.style.display = "block"
    replayGame()
})

ham.addEventListener("click", pauseGame)
back.addEventListener("click", backToHome)
cross.addEventListener("click", playGame)
replay.addEventListener("click", replayGame)
playgame.addEventListener("click", playGame)


function pauseGame(){
    beep.play()
    window.cancelAnimationFrame(window.x)
    menu.style.display = "inline-block"
    ham.style.display = "none"
    gamePlayState = false
}

function playGame(){
    beep.play()
    if(!gamePlayState && !gameEnded){
        ham.style.display = "inline-block"
        menu.style.display = "none"
        window.x = window.requestAnimationFrame(animate)
        gamePlayState = true
    }
}

function replayGame(){
    gamePlayState = true
    gameEnded = false
    beep.play()

    if(highScore < score){
        localStorage.clear()
        localStorage.setItem(playername, score)
    }

    score = 0
    highScore = localStorage[localStorage.key(0)]
    ctx.lineWidth = 10
    ctx.lineCap = "round"
    window.cancelAnimationFrame(window.x)
    ham.style.display = "inline-block"
    menu.style.display = "none"
    
    ctx.clearRect(0, 0, innerWidth, innerHeight)

    obstacles = []
    var v = { x: 0, y: 3 }
    var y_array = [-100, -700, -1300]

    y_array.sort(func)

    var c1 = { x: canv.width / 2, y: y_array[0] }
    var s1 = 200

    var c2 = { x: canv.width / 2, y: y_array[1] }
    var s2 = 100

    var c3 = { x: canv.width / 2 - 40, y: y_array[2] }
    var s3 = 100

    ball = new Ball(canv.width / 2, canv.height / 2, 0, 2, 5, colorArray[Math.floor(Math.random() * 3)])
    tri = new Triangle(c1, s1, v)
    cir = new Circle(c2, s2, v)
    fan = new Fan(c3, s3, v)

    obstacles.push(tri)
    obstacles.push(cir)
    obstacles.push(fan)

    pS = { x: canv.width / 2, y: -1000 }
    swt = new ColorSwitch(pS, v)

    animate()

}

function backToHome(){
    canv.style.display = "none"
    circle.style.display = "block"
    intro.style.display = "block"
    options.style.display = "flex"
    menu.style.display = "none"

    ham.style.display = "none"

}

high.addEventListener("click", showHigh)
crossHigh.addEventListener("click", hideHigh)

var hmsg = document.createElement('p')
hmsg.style.fontSize = "3vw"
hmsg.style.textAlign = "center"

var htitle = document.createElement('div')
htitle.style.fontSize = "6vw"
htitle.style.textAlign = "center"
htitle.style.fontFamily = "'Chewy', cursive"

function showHigh(){
    aud.play()
    hmsg.textContent = localStorage.key(0) + " : " + localStorage[localStorage.key(0)]
    htitle.textContent = "Our Highest Scorer"
    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function hideHigh(){
    aud.pause()
    beep.play()
    while(msg.firstChild){
        msg.removeChild(msg.firstChild)
    }

    blackout.style.display = "none"
    msg.style.display = "none"
    crossHigh.style.display = "none"
}

about.addEventListener("click", showAbout)

function showAbout() {
    aud.play()
    htitle.textContent = "About"
    hmsg.innerHTML = "This is a game made as a task for the Inductions of Delta Club of NITT.<br/>Made by Ankit Rawani <br/>GitHub ID : <a href='https://github.com/ankit-rawani'><b>ankit-rawani</b></a>"
    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}

function gameWon(){
    aud.play()
    gameEnded = true
    gamePlayState = false
    console.log("done")
    window.cancelAnimationFrame(window.x)
    ctx.clearRect(0, 0, canv.width, canv.height)
    htitle.textContent = "You Won!!!"
    hmsg.textContent = "Congatulations! You completed the game."
    msg.appendChild(htitle)
    msg.appendChild(hmsg)
    blackout.style.display = "block"
    msg.style.display = "block"
    crossHigh.style.display = "block"
}