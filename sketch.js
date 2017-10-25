

require(["p5"], function (p5) {
    var myp5 = new p5(function (sketch) {

        sketch.setup = function () {
            var canvas = sketch.createCanvas(400, 400)
            console.log('setup')
            canvas.parent('sketch-div')
        }

        sketch.draw = function () {
            with(sketch){
                background(120)
                textSize(50)
                text('Kappa 123', width/4 + 10*cos(frameCount * 0.1), height/2 + 10*sin(frameCount * 0.05))
            }
        }
    });
});