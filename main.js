// ───────────── PRESETTINGS ─────────────
var sizeOfPoints = 7
var error = 1
var curves = []
var change_pointsPending = []
var canvas = document.querySelector("canvas")
var ctx = canvas.getContext('2d')
restartSelectingGame()

// on init we show the 'default mode' elements 
var isInDefaultMode = true

// ───────────── EVENTS ─────────────
canvas.addEventListener('mousedown', function (){
    var clickedPoint = getClickCoordinates(event, canvas)

    if (isInDefaultMode){
        addPointToCreatedCurve(curves, clickedPoint)
    }else{
        modifySelectedPoint(curves, clickedPoint)
    }           
})


var c_showCurves = document.querySelector("#c_showCurves")
var c_showPolyg = document.querySelector("#c_showPolyg")
var c_showControlPoints = document.querySelector("#c_showControlPoints")

c_showCurves.addEventListener ('click', redrawInCanvas())
c_showPolyg.addEventListener ('click', redrawInCanvas())
c_showControlPoints.addEventListener ('click', redrawInCanvas())


var b_changeMode = document.querySelector("#b_changeMode")
b_changeMode.addEventListener('click', function (){
    isInDefaultMode = !isInDefaultMode

    var defaulModeElements = document.querySelector(".defaultMode")
    var makeChangesModeElements = document.querySelector(".makeChangesMode")

    if(isInDefaultMode){
        defaulModeElements.style.display = "block"
        makeChangesModeElements.style.display = "none"
    }else{
        defaulModeElements.style.display = "none"
        makeChangesModeElements.style.display = "block"
    }
    if(curves.length>0){
        if (curves[curves.length-1].controlPoints.length==0) alert("The latest curve created still has zero points TT")
    }
})



// ───────────── AUX FUNCTIONS ─────────────
function restartSelectingGame(){
    selectedCurve = -1
    selectingGameHasStarted = false
}

function getClickCoordinates (event, canvas) {
    let rect = canvas.getBoundingClientRect()
    let thisX = event.clientX - rect.left 
    let thisY = event.clientY - rect.top

    return (new Point(thisX, thisY))
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
    if (c_showControlPoints.checked){
        for (var c=0; c<curves.length; c++){
            curves[c].showContrPoints(ctx)
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

function changeMode(){
    isInDefaultMode = !isInDefaultMode

    var defaultModeElements = document.querySelector(".defaultMode")
    var makeChangesModeElements = document.querySelector(".makeChangesMode")

    if(isInDefaultMode){
        defaultModeElements.style.display = ""
        makeChangesModeElements.style.display = "none"
    }else{
        defaultModeElements.style.display = "none"
        makeChangesModeElements.style.display = ""
    }
    if(curves.length>0){
        if (curves[curves.length-1].controlPoints.length==0) alert("The latest curve created still has zero points TT")
    }
}

