// Projetinho de PG, II Unidade - 2019.2
// Aline Gouveia - amtg 

// `•.¸¸.•´´¯`••._.• ! ! ! ! •._.••`¯´´•.¸¸.•`

var canvas = document.getElementById('canvas')
var defaultMode = document.getElementById('defaultMode')

if (canvas.getContext) {
    var ctx = canvas.getContext('2d')
    var points = []

    canvas.addEventListener('click', function (){

        var clickedPoint = getClickCoordinates(event, canvas)
        
        // `•.¸¸.•´´¯`••._.• - - - INSERT MODE - - - •._.••`¯´´•.¸¸.•`

        if (!defaultMode.checked){
        
        // `•.¸¸.•´´¯`••._.• when i click, a point is drawn •._.••`¯´´•.¸¸.•`        
        ctx.beginPath()
        points.push (clickedPoint)
        ctx.arc (clickedPoint.x, clickedPoint.y, 4, 0,  Math.PI * 2)
        ctx.fillStyle = "#ff0000"
        ctx.fill();
    
        var pLen = points.length
        
        // `•.¸¸.•´´¯`••._.• there are lines between points! •._.••`¯´´•.¸¸.•`
        if (pLen>1){
            ctx.beginPath()
            //ctx.setLineDash([2, 3]);
            ctx.moveTo(points[pLen-2].x, points[pLen-2].y)
            ctx.lineTo(clickedPoint.x, clickedPoint.y)
            ctx.strokeStyle = "#FF0000"
            ctx.lineWidth = 0.5
            ctx.stroke()   
        }

    }else{
        
        // `•.¸¸.•´´¯`••._.• - - - DELETE MODE - - - •._.••`¯´´•.¸¸.•`

        console.log("lesgou excluir")
        console.log(points)
        
        var index = -1
        var pointToBeErased
        
        for (var i=0; i<points.length; i++){
            var point = points [i]
            if (Math.sqrt((clickedPoint.x-point.x)*(clickedPoint.x-point.x) + (clickedPoint.y-point.y)*(clickedPoint.y-point.y)) <= 4.3){
                pointToBeErased = new Point (point.x, point.y) 
                index = i
                break
            }
        }

        if (index > -1) {
            clearHistory (ctx, points, pointToBeErased, index)
            points.splice(index, 1)
        }
        index = -1

    }

    
    console.log (" - - -")
    if (points.length > 4){
        var numbAvali = 500
        var curvePoints = []
        for (var t=0; t<=1; t+=1/numbAvali){
            var Xaux = []
            var Yaux = []
            for (var i=0; i<=points.length-1; i++){
                Xaux.push(points[i].x)
                Yaux.push(points[i].y)
            }
            var curvePoint = new Point(castejuju(t, Xaux), castejuju(t, Yaux))
            //console.log (curvePoint)
            curvePoints.push(curvePoint)
        }
        
        ctx.moveTo(curvePoints[0].x, curvePoints[0].y)
        for (var i=1; i<curvePoints.length; i++){
            ctx.lineTo(curvePoints[i].x, curvePoints[i].y)
            ctx.strokeStyle = "#FFDEAD"
            ctx.lineWidth = 0.5
            ctx.stroke()   
        }
    }

    })


}else{ // get context failed
    console.log("ih, deu ruim")
}




// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// `•.¸¸.•´´¯`••._.• algorithm for bezier curve •._.••`¯´´•.¸¸.•`

function castejuju (u, coord){
    /* based on the pseudocode provided here: 
    https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/de-casteljau.html */ 
    var n = coord.length;

    for (var k=1; k <= n; k++){
        for (var i=0; i < n-k; i++){
            coord[i] = (1-u)*coord[i] + u*coord[i+1]
            console.log(coord[i])
       }
    }
    return coord[0];
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// `•.¸¸.•´´¯`••._.• some structures •._.••`¯´´•.¸¸.•`

function Point(x, y) {
    this.x = x
    this.y = y

    this.dot = function(numeroAe){
        this.x = numeroAe*this.x
        this.y = numeroAe*this.y
    }
   // this.sum = function(numeroAe){
     //   this.x = numeroAe + x
       // this.y = numeroAe + y
   // }
}

// `•.¸¸.•´´¯`••._.• some methods •._.••`¯´´•.¸¸.•`

function getClickCoordinates (event, canvas) {
        let rect = canvas.getBoundingClientRect()
        let thisX = event.clientX - rect.left 
        let thisY = event.clientY - rect.top

        return (new Point(thisX, thisY))
}

function clearHistory (ctx, points, pointToBeErased, index){
    
    // erase point
    ctx.beginPath()
    ctx.arc (pointToBeErased.x, pointToBeErased.y, 4.8 , 0,  Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'white'
    ctx.fill()

    // remove lines  ￼
    if (index<points.length-1){
        ctx.beginPath()
        ctx.moveTo(pointToBeErased.x, pointToBeErased.y)
        ctx.lineTo(points[index+1].x, points[index+1].y)
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 3
        ctx.stroke()
    }
    if (index>0){
        ctx.beginPath()
        ctx.moveTo(pointToBeErased.x, pointToBeErased.y)
        ctx.lineTo(points[index-1].x, points[index-1].y)
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 3
        ctx.stroke()
    }
    
    // draw line for remaing points
    if (index<points.length-1 && index>0){
        ctx.beginPath()
        ctx.moveTo(points[index-1].x, points[index-1].y)
        ctx.lineTo(points[index+1].x, points[index+1].y)
        ctx.strokeStyle = "#FF0000"
        ctx.lineWidth = 2
        ctx.stroke()

    }
}