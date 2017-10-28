
require(["p5"], function (p5) {
    var myp5 = new p5(function (sketch) {
        sketch.disableFriendlyErrors = true
        sketch.setup = function () {
            var canvas = sketch.createCanvas(400, 400)
            canvas.parent('sketch-div')
        }

        sketch.draw = function () {
            with (sketch) {

                world.Step(1 / 60, 5, 5)
                background(120)

                //testing
                push()
                translate(width / 2, height)
                rotate(PI)
                fill(123, 224, 242)
                noStroke()
                let particlePos= world.particleSystems[0].GetPositionBuffer();
                for(let i = 0; i < particlePos.length; i+=2){
                    ellipse(100*particlePos[i], 100*particlePos[i+1], 30, 30)
                }
                pop()

                var fps = frameRate();
                fill(255);
                stroke(0);
                strokeWeight(3)
                textSize(20)
                text("FPS: " + fps.toFixed(2), 10, height - 10);
                text(`Particles: ${world.particleSystems[0].GetParticleCount()}`,width - width/2 , height - 10)
            }
        }
    });
});

