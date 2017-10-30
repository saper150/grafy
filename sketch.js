let {worldElement} = require('./worldElements')
require(["p5"], function (p5) {
    var myp5 = new p5(function (sketch) {
        
        //performance improvement
        p5.disableFriendlyErrors = true;

        sketch.setup = function () {
            var canvas = sketch.createCanvas(400, 400)
            canvas.parent('sketch-div')
        }
        let gravity = new b2Vec2(0, -10)
        const scaleMulti = 100
        const particleSize = 15
        sketch.draw = function () {
                let {width, height, frameCount} = sketch
                world.Step(1 / 60, 5, 5)

                if (frameCount % 300 === 0) {
                    gravity = new b2Vec2(0, gravity.y * -1)
                    world.SetGravity(gravity)
                }

                sketch.background(120)


                sketch.push()
                sketch.translate(width / 2, height)
                sketch.rotate(Math.PI)
                sketch.fill(123, 224, 242)
                sketch.noStroke()
                sketch.noSmooth()

                let velocityBuffer = world.particleSystems[0].GetVelocityBuffer()
                let particlePos = world.particleSystems[0].GetPositionBuffer();
                for (let i = 0; i < particlePos.length; i += 2) {
                    sketch.fill(0, Math.abs(50 * velocityBuffer[i]), Math.abs(255 - (50 * velocityBuffer[i + 1])), 150)

                    sketch.ellipse(100 * particlePos[i], 100 * particlePos[i + 1], particleSize, particleSize)
                }
                for(let i = 0; i < worldElement.elements.length; i++){
                    worldElement.elements[i].display(sketch)
                }
                sketch.pop()

                var fps = sketch.frameRate();
                sketch.fill(255);
                sketch.stroke(0);
                sketch.strokeWeight(3)
                sketch.textSize(20)
                sketch.text("FPS: " + fps.toFixed(2), 10, height - 10);
                sketch.text(`Particles: ${world.particleSystems[0].GetParticleCount()}`, width - width / 2, height - 10)
            
        }
    });
});

