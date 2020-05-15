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

// function rotateLine(ln, angle, center){
//     let ratio = (ln.x1-center.x)/(ln.x1-ln.x2)
//     let l1 = ratio * length
//     let l2 = length - l1
//     ln.x1 = center.x - l1 * Math.cos(angle)
//     ln.y1 = center.y - l1 * Math.sin(angle)
//     ln.x2 = center.x + l2 * Math.cos(angle)
//     ln.y2 = center.y + l2 * Math.sin(angle)
// }

// function distance(x0, y0, x, y) {
//     return Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0))
// }

// function distanceFromLine(l,ball) {
//     let m = (l.y2 - l.y1) / (l.x2 - l.x1)
//     let x = (m / (m * m + 1)) * (ball.x / m + ball.y + m * l.x1 - l.y1)
//     let y = m * (x - l.x1) + l.y1
//     console.log(m)
    
//     return distance(ball.x, ball.y, x, y)
// }




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

// function rgb(r, g, b){
//     return ("#" + r.toString(16) + g.toString(16) + b.toString(16)) 

// }

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

    this.end = function () {
        window.cancelAnimationFrame(window.x)
    }

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

    this.draw = function(){
        ctx.lineWidth = 10
        ctx.lineCap = "round"

        let line1 = new Line(
            this.centre.x + this.p1.x, this.centre.y + this.p1.y,
            this.centre.x + this.p2.x, this.centre.y + this.p2.y,
            "#ff0000"
        )

        line1.draw()

        let line2 = new Line(
            this.centre.x + this.p2.x, this.centre.y + this.p2.y,
            this.centre.x + this.p3.x, this.centre.y + this.p3.y,
            "#00ff00"
        )

        line2.draw()
        let line3 = new Line(
            this.centre.x + this.p3.x, this.centre.y + this.p3.y,
            this.centre.x + this.p1.x, this.centre.y + this.p1.y,
            "#0000ff"
        )

        line3.draw()
    }

    this.move = function(){
        this.centre.x += this.velocity.x
        this.centre.y += this.velocity.y
        this.draw()
    }

    this.rotate = function () {
        this.angle += this.radVelocity
        this.p1 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle), y: (side / Math.sqrt(3)) * Math.sin(this.angle) }
        this.p2 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (2 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (2 / 3) * Math.PI) }
        this.p3 = { x: (side / Math.sqrt(3)) * Math.cos(this.angle + (4 / 3) * Math.PI), y: (side / Math.sqrt(3)) * Math.sin(this.angle + (4 / 3) * Math.PI) }
        this.draw()        
    }

}

// var length = 150
// var p1 = { x: -length / 2, y: length / (2 * Math.sqrt(3)) }
// var p2 = { x: length / 2, y: length / (2 * Math.sqrt(3)) }
// var v = { x: 0, y: 0 }
// var i = 0
// var j = 0

var c = {x:canv.width/2, y:-100}
var s = 100
var v = {x:0,y:3}

var ball = new Ball(canv.width / 2, canv.height/2, 0, 2, 5, "#ffffff")
var tri = new Triangle(c,s,v)

// var line = new Line(p1, p2, "#ffffff",v)
// var line2 = new Line(p1, p2, "#ff0000", v)
// var line3 = new Line(p1, p2, "#00ff00", v)

// rotateLine(line2,Math.PI/3, p2)
// rotateLine(line3, -Math.PI / 3, p1)

// console.log(line)
// console.log(ball)


function animate() {
    window.x = window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    // i++
    
    // if(i==72) i=0

    //console.log(distanceFromLine(line, ball))

    // if (distanceFromLine(line, ball) <= ball.radius) {
    //     window.cancelAnimationFrame(window.x)

    // }

    ball.move()
    // ball.checkCollision()
    if (ball.y <= canv.height / 2) {
        tri.move()
        tri.rotate()
    }
    else {
        tri.draw()
    }
    
//     ctx.save()

//     ctx.translate(canv.width/2, j)
    
//     ctx.rotate(Math.PI/36 * i)
//     line.move()
//     line2.move()
//     line3.move()
//     console.log(distanceFromLine(line, ball))

//     ctx.restore()
//     j += 2
//     // if(ball.y <= canv.height/2){      
//     //     line.move()
//     // }
}

// window.addEventListener("keyup",() => {
//     window.cancelAnimationFrame(window.x)
// }) 

animate()