/* 
Projetinho de PG, II Unidade .
   Aline Gouveia - amtg   · ☆ · 　 　　
                        ✧　 . ·　☆
                        　· 　☆ . ·
                        　　· ✧　.
*/

// - - colors used ^^ - - 
// pending point in defaultMode = #91A8D0
// pending point in changingMode = ##bf7191
// curve point/polygon normal = #91A8D0
// curve normal = #6784b5
// curve - all- selected = #F08080

// `~·=·=·=·=·=·=·='☆ . · getting html elements · . ☆'=·=·=·=·=·=·=·~
//           ☆ c_ stands for checkbox | and b_ for buttons ☆

var canvas = document.getElementById('canvas')

var c_showPolyg = document.getElementById('showPolyg')
var c_showCurves = document.getElementById('showCurves')
var c_showContrPoints = document.getElementById('showControlPoints') 

//~·=·='☆ . · 'default mode' elements · . ☆'=·=·~ 
var avalNumb = document.getElementById('avalNumber')
var b_createNewCurve = document.getElementById('createNewCurve')

//~·=·='☆ . · 'make changes mode' elements · . ☆'=·=·~ 
var b_prevCurve = document.getElementById('prevCurve')
var b_nextCurve = document.getElementById('nextCurve')
var c_transformMode = document.getElementById('c_transformMode')
var b_deleteSelCurve = document.getElementById('deleteCurve')
var b_addPointsToSelCurve = document.getElementById('addPointsToSelectedCurve')

// on init we show the 'default mode' elements 
var isInDefaultMode = false
changeMode()
var isInTransformMode = false
changeTransformMode()

// ~·=·=·=·=·=·=·=·=·=·=·=·='☆ . · MAIN CODE · . ☆'=·=·=·=·=·=·=·=·=·=·=·=·~

var sizeOfPoints = 4
var error = 0.5

var curves = []
var create_pointsPending = []
var change_pointsPending = []
var ctx = canvas.getContext('2d')

var  mouseIsDown = false 

canvas.addEventListener('mousedown', clickOnCanvas)
function clickOnCanvas(){    

    var clickedPoint = getClickCoordinates(event, canvas)

    if (isInDefaultMode){
        // ~·=·=·=·=·=·=·='☆ . · 'DEFAULT' MODE · . ☆'=·=·=·=·=·=·=·~

        // `•.¸¸.•´´¯`••._.• when i click, a point is drawn •._.••`¯´´•.¸¸.•`        
            ctx.beginPath()
            create_pointsPending.push (clickedPoint)
            ctx.arc (clickedPoint.x, clickedPoint.y, sizeOfPoints, 0,  Math.PI * 2)
            ctx.fillStyle = "#91A8D0"
            ctx.fill();
    }

    else{
        // ~·=·=·=·=·=·=·='☆ . · 'MAKE CHANGES' MODE · . ☆'=·=·=·=·=·=·=·~

        if (selectingGameHasStarted & curves.length>0){
        
            var indexPoint = clickedPtIndexAtSelectedCurve(curves[selectedCurve], clickedPoint)
        
            // `•.¸¸.•´´¯`••._.• when i click where there's other point, some changes occurs •._.••`¯´´•.¸¸.•`
                
                // `•.¸¸.• the change here is to transform the curve by translating the clicked point if it is a controlPoints •.¸¸.•`
            if (c_transformMode.checked){
                if (indexPoint>-1){
                    canvas.addEventListener('mouseup', mouseupF = (event) =>{
                        canvas.removeEventListener('mousemove', mousemoveF)
                        canvas.removeEventListener('mousedown', mouseupF)
                    })
                    canvas.addEventListener('mousemove', mousemoveF = (event) =>{
                        curves[selectedCurve].controlPoints[indexPoint] = getClickCoordinates(event, canvas)
                        curves[selectedCurve].castejuju()
                        redrawInCanvas()
                    })
                }
            }else{
                
                // `•.¸¸.• the change here is to delete the clicked point •.¸¸.•`
                if (indexPoint>-1){
                    curves[selectedCurve].controlPoints.splice(indexPoint, 1)
                    console.log(change_pointsPending)
                    if (curves[selectedCurve].controlPoints.length==0){
                        deleteSelectedCurve()
                        alert("oops, you killed a curve!")
                    }else{
                        curves[selectedCurve].castejuju()
                    }
                    redrawInCanvas()
                

            // `•.¸¸.•´´¯`••._.• but when i click where there's no other point, a new point is drawn •._.••`¯´´•.¸¸.•`        
                }else{
                    ctx.beginPath()
                    change_pointsPending.push (clickedPoint)
                    ctx.arc (clickedPoint.x, clickedPoint.y, sizeOfPoints, 0,  Math.PI * 2)
                    ctx.fillStyle = "#bf7191"
                    ctx.fill();
                }
            }
        }else{
            alert("Please select a curve ^^") 
        }
    }        
    
}

// ~·=·=·=·=·=·=·=·=·=·=·=·='☆ . · RESPONSES TO SOME HTML ELEMENTS · . ☆'=·=·=·=·=·=·=·=·=·=·=·=·~

// ~·=·=·=·=·=·=·='☆ . · 'DEFAULT' MODE · . ☆'=·=·=·=·=·=·=·~

function createNewCurve(){
    var curve = new Curve ()
    curve.avalNumb = avalNumb.value
    curve.controlPoints = create_pointsPending
    curve.castejuju()
    curves.push(curve)
    create_pointsPending = []
    redrawInCanvas()
}

function changeMode(){
    isInDefaultMode = !isInDefaultMode
    if(isInDefaultMode){
        document.getElementById("defaultModeElements").style.display = "block"
        document.getElementById("makeChangesModeElements").style.display = "none"
    }else{
        document.getElementById("defaultModeElements").style.display = "none"
        document.getElementById("makeChangesModeElements").style.display = "block"
    }
}

function changeTransformMode(){
    isInTransformMode = !isInTransformMode
    if (isInTransformMode){
        document.getElementById("notTransformModeButtons").style.display = "none"
    }else{
        document.getElementById("notTransformModeButtons").style.display = "block"
    }
}


// ~·=·=·=·=·=·=·='☆ . · 'MAKE CHANGES' MODE · . ☆'=·=·=·=·=·=·=·~

restartSelectingGame()

// ~·=·='☆ . · 'select' methods · . ☆'=·=·~

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

// ~·=·='☆ . · 'transform' methods · . ☆'=·=·~

function deleteSelectedCurve(){
    if(selectingGameHasStarted){
        curves.splice(selectedCurve, 1)
        restartSelectingGame()
        redrawInCanvas()
    }else{
        alert("Please select a curve ^^")  
    }
}
    
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


// ~·=·=·=·=·=·=·=·=·=·=·=·='☆ . · SOME METHODS · . ☆'=·=·=·=·=·=·=·=·=·=·=·=·~

function getClickCoordinates (event, canvas) {
        let rect = canvas.getBoundingClientRect()
        let thisX = event.clientX - rect.left 
        let thisY = event.clientY - rect.top

        return (new Point(thisX, thisY))
}

function clickedPtIndexAtSelectedCurve(curve, clickedPoint){
    var indexPoint = -1 
    for (var i=0; i<curve.controlPoints.length; i++){
        var comparedPoint = curve.controlPoints [i]
        if (Math.sqrt((clickedPoint.x-comparedPoint.x)*(clickedPoint.x-comparedPoint.x) + (clickedPoint.y-comparedPoint.y)*(clickedPoint.y-comparedPoint.y)) <= sizeOfPoints+error){
        //selectedCurveHasClickedPt = true
        indexPoint = i
        break
        }
    }
    return indexPoint
}

function restartSelectingGame(){
    selectedCurve = -1
    selectingGameHasStarted = false
}

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
    if (create_pointsPending.length>0){
        for (var p=0; p<create_pointsPending.length; p++){
            ctx.beginPath()
            ctx.moveTo(create_pointsPending[p].x, create_pointsPending[p].y)
            ctx.arc (create_pointsPending[p].x, create_pointsPending[p].y, sizeOfPoints, 0,  Math.PI * 2)
            ctx.fillStyle = "#91A8D0"
            ctx.fill();
        }
    }
    if (change_pointsPending.length>0){
        for (var p=0; p<change_pointsPending.length; p++){
            ctx.beginPath()
            ctx.moveTo(change_pointsPending[p].x, change_pointsPending[p].y)
            ctx.arc (change_pointsPending[p].x, change_pointsPending[p].y, sizeOfPoints, 0,  Math.PI * 2)
            ctx.fillStyle = "#bf7191"
            ctx.fill();
        }
    }
}

// ~·=·=·=·=·=·=·=·=·=·=·=·='☆ . · SOME STRUCTURES · . ☆'=·=·=·=·=·=·=·=·=·=·=·=·~

function Point(x, y) {
    this.x = x
    this.y = y
}

function Curve() {
    this.avalNumb = 15,
    this.controlPoints = [],
    this.curvePoints = [],
    this.isSelected = false,

    // ~·=·='☆ . · 'create' method : algorithm for bezier curve · . ☆'=·=·~
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

    // ~·=·='☆ . · 'show' methods · . ☆'=·=·~

    this.showContrPoints = function(ctx){ 
        for (var p=0; p<this.controlPoints.length; p++){
           ctx.beginPath()
           ctx.moveTo(this.controlPoints.x, this.controlPoints.y)
           ctx.arc (this.controlPoints[p].x, this.controlPoints[p].y, sizeOfPoints, 0,  Math.PI * 2)

           if (this.isSelected){
               ctx.fillStyle = "#F08080"
            } else{
                ctx.fillStyle = "#91A8D0"   
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
                    ctx.strokeStyle = "#91A8D0"
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
                ctx.strokeStyle = "#6784b5"
            }

            ctx.setLineDash([0]);
            ctx.lineWidth = 0.7
            ctx.stroke()
        }
    }
}

// (un)necessary : set a random bong bong

function getRandomImage() {
    var images = ['./assets/1.png', './assets/2.png', './assets/3.png', './assets/4.png'];
    var image = images[Math.floor(Math.random()*images.length)];
     
    return image;
    }
     
function displayRandomImage() {
    var htmlImage = document.getElementById("bongbong");
    htmlImage.src = getRandomImage();
}
displayRandomImage();
