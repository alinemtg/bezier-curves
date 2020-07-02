function Point(x, y) {
    this.x = x
    this.y = y
}


function Curve() {
    this.avalNumb = 0,
    this.controlPoints = [],
    this.curvePoints = [],
    this.isSelected = false,

    // ─────────────────── 'create' method : algorithm for bezier curves ──────────────────────
    // ── font: https://pages.mtu.edu/~shene/COURSES/cs3621/NOTES/spline/Bezier/de-casteljau.html ──
    this.castejuju  = function(){
        this.curvePoints = []
        var n = this.controlPoints.length-1
        var Qx = []
        var Qy = []

        for (var i=0; i<=n; i++){
            Qx[i] = this.controlPoints[i].x
            Qy[i] = this.controlPoints[i].y
        }  
        for (var u=0; u<=1; u+=1/this.avalNumb){  
            for (var k=1; k<=n; k++){
                for (var i=0; i<=n-k; i++){
                    Qx[i] = (1-u)*Qx[i] + u*Qx[i+1]
                    Qy[i] = (1-u)*Qy[i] + u*Qy[i+1]
                }
            }
            var curvePoint = new Point (Qx[0], Qy[0])
            this.curvePoints.push(curvePoint)
        }
    },


    // ─────────────────── 'show' methods ──────────────────────
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

                ctx.setLineDash([2, 5])
                ctx.lineWidth = 1.0
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
            ctx.setLineDash([])
            ctx.lineWidth = 1.8
            ctx.stroke()
        }
    }
}