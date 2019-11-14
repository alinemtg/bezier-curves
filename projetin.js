var canvas = document.getElementById('canvas');

if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var isFirstPoint = Boolean(true)
    var points = [];

    canvas.addEventListener("click", function (){
        
        // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄ when i click, a point is drawn ▄▀▄▀▄▀▄▀▄▀▄▀▄▀        
        ctx.beginPath()
        var clickedPoint = getClickCoordinates(event, canvas)
        points.push (clickedPoint)
        ctx.arc (clickedPoint.x, clickedPoint.y, 4, 0,  Math.PI * 2)
        ctx.fill();

        if (!isFirstPoint){
            // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄ there are lines between points! ▄▀▄▀▄▀▄▀▄▀▄▀▄▀
            ctx.beginPath()
            var len = points.length
            ctx.moveTo(points[len-2].x, points[len-2].y)
            ctx.lineTo(clickedPoint.x, clickedPoint.y)
            ctx.stroke()
            
        }else{
            isFirstPoint = false
        }

    
    })


}else{
    console.log("ih, deu ruim")
}




// ▀▄▀▄▀▄▀▄▀▄▀▄▀▄ some structures ▄▀▄▀▄▀▄▀▄▀▄▀▄▀

function Point(x, y) {
    this.x = x;
    this.y = y;
  }


// ▀▄▀▄▀▄▀▄▀▄▀▄▀▄ some methods ▄▀▄▀▄▀▄▀▄▀▄▀▄▀

function getClickCoordinates (event, canvas) {
        let rect = canvas.getBoundingClientRect()
        let thisX = event.clientX - rect.left 
        let thisY = event.clientY - rect.top

        return (new Point(thisX, thisY))
}