
/* 
Projetinho de PG, II Unidade .
   Aline Gouveia - amtg   · ☆ · 　 　　
                        ✧　 . ·　☆
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
var addPointsToSelectedCurve = document.getElementById('addPointsToSelectedCurve')


// ~·=·=·=·=·=·=·='☆ . · MAIN CODE · . ☆'=·=·=·=·=·=·=·~

var sizeOfPoints = 4
var error = 0.3

var curves = []
var create_pointsPending = []
var change_pointsPending = []
var ctx = canvas.getContext('2d')

canvas.addEventListener('click', function(){

    var clickedPoint = getClickCoordinates(event, canvas)

    if (defaultMode.checked){
        // ~·=·=·=·=·=·=·='☆ . · DEFAULT MODE · . ☆'=·=·=·=·=·=·=·~

        // `•.¸¸.•´´¯`••._.• when i click, a point is drawn •._.••`¯´´•.¸¸.•`        
            ctx.beginPath()
            create_pointsPending.push (clickedPoint)
            ctx.arc (clickedPoint.x, clickedPoint.y, sizeOfPoints, 0,  Math.PI * 2)
            ctx.fillStyle = "#7E8754"
            ctx.fill();
    }
    else{
        // ~·=·=·=·=·=·=·='☆ . · CHANGING MODE · . ☆'=·=·=·=·=·=·=·~

        if (selectingGameHasStarted & curves.length>0){
        
                    // `•.¸¸.•´´¯`••._.• when i click where there's other point, some changes occurs •._.••`¯´´•.¸¸.•`
            var selectedCurveHasClickedPt = false
            for (var i=0; i<curves[selectedCurve].controlPoints.length; i++){
                var comparedPoint = curves[selectedCurve].controlPoints [i]
                if (Math.sqrt((clickedPoint.x-comparedPoint.x)*(clickedPoint.x-comparedPoint.x) + (clickedPoint.y-comparedPoint.y)*(clickedPoint.y-comparedPoint.y)) <= sizeOfPoints+error){
                    selectedCurveHasClickedPt = true
                    curves[selectedCurve].controlPoints.splice(i, 1)
                    curves[selectedCurve].castejuju()
                    redrawInCanvas()
                    break
                }
            }
                    // `•.¸¸.•´´¯`••._.• when i click where there's no other point, a new point is drawn •._.••`¯´´•.¸¸.•`        
            if (!selectedCurveHasClickedPt){
                ctx.beginPath()
                change_pointsPending.push (clickedPoint)
                ctx.arc (clickedPoint.x, clickedPoint.y, sizeOfPoints, 0,  Math.PI * 2)
                ctx.fillStyle = "#66CDAA"
                ctx.fill();
            }
        }else{
            alert("Please select a curve ^^") 
        }
    }        
    
})

// ~·=·='☆ . · response to html elements · . ☆'=·=·~

function redrawInCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

function createNewCurve(){
    var curve = new Curve ()
    curve.avalNumb = avalNumb.value
    curve.controlPoints = create_pointsPending
    curve.castejuju()
    curves.push(curve)
    create_pointsPending = []
 
    c_showCurves.checked = true    
    redrawInCanvas()
}

   // `•.¸¸.•´´¯`••._.• selecting gameeee •._.••`¯´´•.¸¸.•`

restartSelectingGame()

function selectPrevCurve(){
    if(curves.length>0){
        if(selectingGameHasStarted){
            curves[selectedCurve].isSelected = false
        }else{
            selectingGameHasStarted = true
        }
        selectedCurve = Math.abs(selectedCurve-1)%curves.length
        curves[selectedCurve].isSelected = true
        redrawInCanvas()
    }else{
        restartSelectingGame()
    }
}

function selectNextCurve(){
    if(curves.length>0){
        if(selectingGameHasStarted){
            curves[selectedCurve].isSelected = false
        }else{
            selectingGameHasStarted = true
        }
        selectedCurve = Math.abs(selectedCurve+1)%curves.length
        curves[selectedCurve].isSelected = true
        redrawInCanvas()
    }else{
        restartSelectingGame()
    }
}

function deleteSelectedCurve(){
    if(selectingGameHasStarted){
        curves.splice(selectedCurve, 1)
        restartSelectingGame()
        redrawInCanvas()
    }else{
        alert("Please select a curve ^^")  
    }
}

    // `•.¸¸.• making changes in a selected curve •.¸¸.•`
    
function addPendingPointsToSelectedCurve(){
    if (selectedCurve>=0){
        for (var p=0; p<change_pointsPending.length; p++){
            curves[selectedCurve].controlPoints.push(change_pointsPending[p])
        }
        curves[selectedCurve].castejuju()
        redrawInCanvas()
    }else{
        alert("Please select a curve ^^")   
    }
    change_pointsPending = []
}



// `~·=·=·=·=·=·=·='☆ . · some methods · . ☆'=·=·=·=·=·=·=·~

function getClickCoordinates (event, canvas) {
        let rect = canvas.getBoundingClientRect()
        let thisX = event.clientX - rect.left 
        let thisY = event.clientY - rect.top

        return (new Point(thisX, thisY))
}

function restartSelectingGame(){
    selectedCurve = -1
    selectingGameHasStarted = false
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
    this.isSelected = false,

    // ~·=·='☆ . · algorithm for bezier curve · . ☆'=·=·~
    // font: https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/de-casteljau.html

    this.castejuju  = function(){
        this.curvePoints = []
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
           ctx.arc (this.controlPoints[p].x, this.controlPoints[p].y, sizeOfPoints, 0,  Math.PI * 2)

           if (this.isSelected){
               ctx.fillStyle = "#F08080"
            } else{
                ctx.fillStyle = "#7E8754"   
            }
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

                if (this.isSelected){
                    ctx.strokeStyle = "#F08080"
                }else{
                    ctx.strokeStyle = "#7E8754"
                }

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
            
            if (this.isSelected){
                ctx.strokeStyle = "#F08080"
            }else{
                ctx.strokeStyle = "#8FBC8F"
            }

            ctx.setLineDash([0]);
            ctx.lineWidth = 0.7
            ctx.stroke()
        }
    }
}
