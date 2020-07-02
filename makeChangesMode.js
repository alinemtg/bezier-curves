var c_pointsKillerMode = document.querySelector("#c_pointsKillerMode")

function modifySelectedPoint (curves, clickedPoint){

    if (selectingGameHasStarted & curves.length > 0){
        var indexPoint = clickedPtIndexAtSelectedCurve(curves[selectedCurve], clickedPoint)
                
        if (!c_pointsKillerMode.checked){
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
            }else{
                console.log(indexPoint)
                curves[curves.length-1].controlPoints.push(clickedPoint)
                curves[curves.length-1].castejuju()
                redrawInCanvas()
            }

        }else{
            if (indexPoint > -1){
                // ── the point is a control point of the select curve ───
                curves[selectedCurve].controlPoints.splice(indexPoint, 1)
                if (curves[selectedCurve].controlPoints.length==0){
                    alert("oops! you killed a curve (╥_╥)")
                    curves.splice(selectedCurve, 1)
                    restartSelectingGame()
                    redrawInCanvas()
                }else{
                    curves[selectedCurve].castejuju()
                }
            redrawInCanvas()
            
            }else{
                // ── the point is NOT a control point ───
                curves[selectedCurve].controlPoints.push(clickedPoint)
                curves[selectedCurve].castejuju()
                redrawInCanvas()
            }
        }
    }else{
        alert("Please select a curve first ^^") 
    }
}



// ───────────── EVENTS ─────────────

var b_prevCurve = document.querySelector("#b_prevCurve")

b_prevCurve.addEventListener('click', function (){
    if(curves.length>0){
        if(selectingGameHasStarted){
            curves[selectedCurve].isSelected = false
        }else{
            selectingGameHasStarted = true
        }
        selectedCurve = selectedCurve-1
        if (selectedCurve<0){
            selectedCurve = curves.length-1
        }
        curves[selectedCurve].isSelected = true
        redrawInCanvas()
    }else{
        alert("There's no curve to select :(")
        restartSelectingGame()
    }
})

var b_nextCurve = document.querySelector("#b_nextCurve")
b_nextCurve.addEventListener('click', function (){
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
        alert("There's no curve to select :(")
        restartSelectingGame()
    }
})

var b_deleteCurve = document.querySelector("#b_deleteCurve")
b_deleteCurve.addEventListener('click', function(){
    if(selectingGameHasStarted){
        curves.splice(selectedCurve, 1)
        restartSelectingGame()
        redrawInCanvas()
    }else{
        alert("Please select a curve first ^^")  
    }
})


// ───────────── AUX FUNCTIONS ─────────────

function clickedPtIndexAtSelectedCurve(curve, clickedPoint){
    var indexPoint = -1 
    for (var i=0; i<curve.controlPoints.length; i++){
        var comparedPoint = curve.controlPoints [i]
        if (Math.sqrt((clickedPoint.x-comparedPoint.x)*(clickedPoint.x-comparedPoint.x) + (clickedPoint.y-comparedPoint.y)*(clickedPoint.y-comparedPoint.y)) <= sizeOfPoints+error){
        indexPoint = i
        break
        }
    }
    return indexPoint
}
function changeEvaluationNumber(){
    if (selectingGameHasStarted & curves.length>0){
        var toChangeAvalNumber = document.querySelector("#toChangeAvalNumber")
        curves[selectedCurve].avalNumb = toChangeAvalNumber.value
        curves[selectedCurve].castejuju()
        redrawInCanvas()
    }else{
        alert("Please select a curve first ^^")  
    }
}