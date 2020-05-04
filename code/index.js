const canv = document.querySelector('canvas')
var ctx = canv.getContext("2d")

canv.height = window.innerHeight
canv.width = window.innerWidth    

window.addEventListener('resize', e => {
    canv.height = window.innerHeight
    canv.width = window.innerWidth
})


window.addEventListener('mousedown', e => {
    if(ball.dy>0){
        if(ball.dy<1){
            ball.y = canv.height - ball.radius -1
        }
        ball.dy += 5
    }else{
        if (ball.dy > -1) {
            ball.y = canv.height - ball.radius - 1
        }
        ball.dy -= 5
    }

    
})


function Ball(x, y, dx, dy, radius, color){
    this.radius = radius
    this.x = x
    this.y = y
    this.color = color
    this.dy = dy
    this.dx = dx

    this.init = function(){
        ctx.restore()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }

    this.move = function(){
        if(this.y >= canv.height - this.radius){
            this.dy = -this.dy*0.95
        }
        else{
            this.dy += 0.2   
        }

        this.y += this.dy
        this.init()
    }
    
}

var ball = new Ball(canv.width / 2, canv.height/2, 0, 2, 30, "#ffffff")

function animate() {
    window.requestAnimationFrame(animate)
    ctx.clearRect(0, 0, innerWidth, innerHeight)

   ball.move()
}

animate()