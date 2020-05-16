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
            this.dy = -this.dy*0.95
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

function gameEnd(){
    console.log("done")
    window.cancelAnimationFrame(window.x)
    ctx.clearRect(0,0,canv.width,canv.height)
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
        ctx.lineWidth = 10
        ctx.lineCap = "round"

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

var c1 = { x: canv.width / 2, y: -100 }
var s1 = 200
var v1 = { x: 0, y: 3 }

var c2 = { x: canv.width / 2, y: -500 }
var s2 = 100
var v2 = { x: 0, y: 3 }

var ball = new Ball(canv.width / 2, canv.height/2, 0, 2, 5, "#ff0000")
var tri = new Triangle(c1,s1,v1)
var cir = new Circle(c2, s2, v2)

function animate() {
    window.x = window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    
    ball.move()
    if (ball.y <= 3 * canv.height / 4) {
        cir.move()
        cir.end()
        tri.move()
        tri.end()
    }
    else {
        tri.draw()
        tri.end()
        cir.draw()
        cir.end()
    }
    

}


animate()