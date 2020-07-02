function addPointToCreatedCurve (curves, clickedPoint){
    if(curves.length >0){
        curves[curves.length-1].controlPoints.push(clickedPoint)
        curves[curves.length-1].castejuju()
        redrawInCanvas()
    }else{
        alert("Try to create a curve first! ^^")
    } 
}


// ───────────── EVENTS ─────────────

var b_createNewCurve = document.querySelector("#b_createNewCurve")
b_createNewCurve.addEventListener('click', function (){
    var curve = new Curve ()
    var avalNumber = document.querySelector("#avalNumber")
    curve.avalNumb = avalNumber.value
    curve.controlPoints = []
    redrawInCanvas()
    curves.push(curve)
})