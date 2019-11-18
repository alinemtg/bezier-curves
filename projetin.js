
/* Projetinho de PG, II Unidade  .
   Aline Gouveia - amtg      · 　 ☆ · 　 　　
                           ✧　 . · 　☆
                        　   · 　☆ . ·
                        　　 　　· ✧　.
*/


// `~·=·=·=·=·=·=·='☆ . · getting html elements · . ☆'=·=·=·=·=·=·=·~

var canvas = document.getElementById('canvas')

var avalNumb = document.getElementById('avalNumber')
var b_createNewCurve = document.getElementById('createNewCurve')

var b_prevCurve = document.getElementById('prevCurve')
var b_nextCurve = document.getElementById('nextCurve')
var b_deleteSelCurve = document.getElementById('deleteCurve')

var c_showPolyg = document.getElementById('showPolyg')
var c_showCurves = document.getElementById('showCurves')
var c_showContrPoints = document.getElementById('showControlPoints') 

var defaultMode = document.getElementById('defaultMode')


// ~·=·=·=·=·=·=·='☆ . · MAIN CODE · . ☆'=·=·=·=·=·=·=·~

var curves = []
var pointsPending = []
var ctx = canvas.getContext('2d')

canvas.addEventListener('click', function(){

    var clickedPoint = getClickCoordinates(event, canvas)

    // `•.¸¸.•´´¯`••._.• when i click, a point is drawn •._.••`¯´´•.¸¸.•`        
        ctx.beginPath()
        pointsPending.push (clickedPoint)
        ctx.arc (clickedPoint.x, clickedPoint.y, 4, 0,  Math.PI * 2)
        ctx.fillStyle = "#7E8754"
        ctx.fill();

})

// ~·=·='☆ . · response to html elements · . ☆'=·=·~

function createNewCurve(){
    var curve = new Curve ()
    curve.avalNumb = avalNumb.value
    curve.controlPoints = pointsPending
    curve.castejuju()
    curves.push(curve)
    pointsPending = []
 
    c_showCurves.checked = true
    console.log(c_showCurves.checked)
    
    redrawInCanvas()
}

function redrawInCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(c_showCurves.checked)
    if (c_showCurves.checked){
        for (var c=0; c<curves.length; c++){
            curves[c].showCurve(ctx)
        }
    }
    if (c_showPolyg.checked){
        for (var c=0; c<curves.length; c++){
            curves[c].showPolyg(ctx)
           }
    }
    if (c_showContrPoints.checked){
        for (var c=0; c<curves.length; c++){
            curves[c].showContrPoints(ctx)
        }
    }
}


// `~·=·=·=·=·=·=·='☆ . · some methods · . ☆'=·=·=·=·=·=·=·~

function getClickCoordinates (event, canvas) {
        let rect = canvas.getBoundingClientRect()
        let thisX = event.clientX - rect.left 
        let thisY = event.clientY - rect.top

        return (new Point(thisX, thisY))
}


// ~·=·=·=·=·=·=·='☆ . · some structures · . ☆'=·=·=·=·=·=·=·~

function Point(x, y) {
    this.x = x
    this.y = y
}

function Curve() {
    this.avalNumb = 15,
    this.controlPoints = [],
    this.curvePoints = [],

    // ~·=·='☆ . · algorithm for bezier curve · . ☆'=·=·~

    this.castejuju  = function(){

        console.log (avalNumb)
        var n = this.controlPoints.length-1
        var Qx = []
        var Qy = []

        for (var u=0; u<=1; u+=1/this.avalNumb){
            for (var i=0; i<=n; i++){
                Qx[i] = this.controlPoints[i].x
                Qy[i] = this.controlPoints[i].y
            }
            for (var k=1; k<=n; k++){
                for (var i=0; i<=n-k; i++){
                    Qx[i] = (1-u)*Qx[i] + u*Qx[i+1]
                    Qy[i] = (1-u)*Qy[i] + u*Qy[i+1]
                }
            }
            var curvePoint = new Point (Qx[0], Qy[0])
            this.curvePoints.push(curvePoint)
        }
    } 
    ,

    // ~·=·='☆ . · "show" methods · . ☆'=·=·~

    this.showContrPoints = function(ctx){ 
        for (var p=0; p<this.controlPoints.length; p++){
           ctx.beginPath()
           ctx.moveTo(this.controlPoints.x, this.controlPoints.y)
           ctx.arc (this.controlPoints[p].x, this.controlPoints[p].y, 4, 0,  Math.PI * 2)
           ctx.fillStyle = "#7E8754"
           ctx.fill()
        }
    } 
    ,
    this.showPolyg = function(ctx){
        ctx.beginPath()
        var CPlen = this.controlPoints.length
        if (CPlen>1){
            ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y)
            for (var p=0; p<CPlen; p++){
                ctx.lineTo(this.controlPoints[p].x, this.controlPoints[p].y)
                ctx.strokeStyle = "#7E8754"
                ctx.setLineDash([2, 3])
                ctx.lineWidth = 0.5
                ctx.stroke()  
            }
        }
    }
    ,
    this.showCurve = function(ctx){
        ctx.beginPath()
        ctx.moveTo(this.curvePoints[0].x, this.curvePoints[0].y)
        for (var i=0; i<this.curvePoints.length; i++){
            ctx.lineTo(this.curvePoints[i].x, this.curvePoints[i].y)
            ctx.strokeStyle = "#FFAAA4"
            ctx.setLineDash([0]);
            ctx.lineWidth = 0.7
            ctx.stroke()
        }
    }
}
