const canv = document.querySelector('canvas')
var ctx = canv.getContext("2d")

canv.height = window.innerHeight
canv.width = window.innerWidth    

window.addEventListener('resize', e => {
    canv.height = window.innerHeight
    canv.width = window.innerWidth
})


window.addEventListener('mousedown', e => {
    ball.dy -= 5
    if(ball.y >= canv.height-ball.radius-1){
        ball.y = canv.height - ball.radius - 2
    }
})

function rotateLine(ln, angle, center){
    let ratio = (ln.x1-center.x)/(ln.x1-ln.x2)
    let l1 = ratio * length
    let l2 = length - l1
    ln.x1 = center.x - l1 * Math.cos(angle)
    ln.y1 = center.y - l1 * Math.sin(angle)
    ln.x2 = center.x + l2 * Math.cos(angle)
    ln.y2 = center.y + l2 * Math.sin(angle)
}

function distance(x0, y0, x, y) {
    return Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))
}

function distanceFromLine(l,ball) {
    let m = (l.y2 - l.y1) / (l.x2 - l.x1)
    let x = (m / (m * m + 1)) * (ball.x / m + ball.y + m * l.x1 - l.y1)
    let y = m * (x - l.x1) + l.y1
    console.log(m)
    
    return distance(ball.x, ball.y, x, y)
}

function Line(position1, position2, color, velocity) {
    this.x1 = position1.x
    this.y1 = position1.y
    this.x2 = position2.x
    this.y2 = position2.y
    this.dx = velocity.x
    this.dy = velocity.y
    this.color = color

    this.draw = function () {
        ctx.strokeStyle = this.color
        ctx.lineWidth = 5
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.stroke()
        ctx.closePath()
    }

    this.end = function() {
        window.cancelAnimationFrame(window.x)
    }

    this.move = function () {
        this.y1 += this.dy
        this.y2 += this.dy
        this.draw()
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
            this.dy = -this.dy*0.95
        }
        else{
            this.dy += 0.2   
        }

        this.y += this.dy
        this.draw()
    }
    
}

var length = 150
var p1 = { x: -length / 2, y: length / (2 * Math.sqrt(3)) }
var p2 = { x: length / 2, y: length / (2 * Math.sqrt(3)) }
var v = { x: 0, y: 0 }
var i = 0
var j = 0

var ball = new Ball(canv.width / 2, canv.height/2, 0, 2, 10, "#ffffff")

var line = new Line(p1, p2, "#ffffff",v)
var line2 = new Line(p1, p2, "#ff0000", v)
var line3 = new Line(p1, p2, "#00ff00", v)

rotateLine(line2,Math.PI/3, p2)
rotateLine(line3, -Math.PI / 3, p1)

console.log(line)
console.log(ball)


function animate() {
    window.x = window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    i++
    
    if(i==72) i=0

    //console.log(distanceFromLine(line, ball))

    if (distanceFromLine(line, ball) <= ball.radius) {
        window.cancelAnimationFrame(window.x)

    }

    ball.move()
    ctx.save()

    ctx.translate(canv.width/2, j)
    
    ctx.rotate(Math.PI/36 * i)
    line.move()
    line2.move()
    line3.move()
    console.log(distanceFromLine(line, ball))

    ctx.restore()
    j += 2
    // if(ball.y <= canv.height/2){      
    //     line.move()
    // }
}

window.addEventListener("keyup",() => {
    window.cancelAnimationFrame(window.x)
}) 

animate()