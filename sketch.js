
require(["p5"], function (p5) {
    var myp5 = new p5(function (sketch) {
        sketch.disableFriendlyErrors = true
        sketch.setup = function () {
            var canvas = sketch.createCanvas(400, 400)
            canvas.parent('sketch-div')
        }
        let gravity = new b2Vec2(0, -10)
        const scaleMulti = 100
        const particleSize = 15
        sketch.draw = function () {
            with (sketch) {
                //huuge performance jump
                p5.disableFriendlyErrors = true;

                world.Step(1 / 60, 5, 5)

                if (frameCount % 180 === 0) {
                    gravity = new b2Vec2(0, gravity.y * -1)
                    world.SetGravity(gravity)
                }

                background(120)

                
                push()
                translate(width / 2, height)
                rotate(PI)
                fill(123, 224, 242)
                noStroke()
                noSmooth()

                let velocityBuffer = world.particleSystems[0].GetVelocityBuffer()
                let particlePos = world.particleSystems[0].GetPositionBuffer();
                for (let i = 0; i < particlePos.length; i += 2) {
                    fill(0, Math.abs(50 * velocityBuffer[i]), Math.abs(255 - (50 * velocityBuffer[i + 1])), 150)
                    
                    ellipse(100 * particlePos[i], 100 * particlePos[i + 1], particleSize, particleSize)
                }
                
                
                //#TODO: change rendering graph vertices
                for(let i = 0; i < world.bodies.length;i++){
                    if(world.bodies[i].fixtures[0].shape.type === 0){
                        fill(255,0,0)
                        let pos = world.bodies[i].GetPosition()
                        let radius = 2 * world.bodies[i].fixtures[0].shape.radius
                        ellipse(scaleMulti * pos.x, scaleMulti * pos.y, radius * scaleMulti, radius * scaleMulti)
                    }
                }
                pop()
                
                var fps = frameRate();
                fill(255);
                stroke(0);
                strokeWeight(3)
                textSize(20)
                text("FPS: " + fps.toFixed(2), 10, height - 10);
                text(`Particles: ${world.particleSystems[0].GetParticleCount()}`, width - width / 2, height - 10)
            }
        }
    });
});

