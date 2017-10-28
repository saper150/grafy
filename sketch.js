
let Box2D = require('box2dweb')
require(["p5"], function (p5) {
    var myp5 = new p5(function (sketch) {
        sketch.disableFriendlyErrors = true
        sketch.setup = function () {
            var canvas = sketch.createCanvas(400, 400)
            canvas.parent('sketch-div')
        }

        sketch.draw = function () {
            with (sketch) {

                world.Step(1 / 30, 1, 1)
                background(120)

                //testing
                push()
                translate(width / 2, height/2)
                let body = world.m_bodyList
                while (body.m_next != null) {
                    let pos = body.GetPosition()
                    let shape = body.m_fixtureList.m_shape

                    if(pos.y < -height || pos.x > width/2 || pos.x < -width/2)
                    world.DestroyBody(body)

                    //circle
                    if (shape.m_type === 0){
                        push()
                        fill(200,0,0)
                        translate(pos.x, -pos.y)
                        ellipse(0, 0, 2*shape.m_radius, 2*shape.m_radius)
                        pop()
                    }
                    //polygon (rectangle)
                    if (shape.m_type === 1) {
                        push()
                        translate(pos.x, -pos.y)
                        fill(0,120,0)
                        let vert = shape.GetVertices()
                        let w = vert[2].x - vert[0].x
                        let h = vert[2].y - vert[0].y
                        body.SetAngle(0.785398163)
                        rotate(-body.GetAngle())
                        rectMode(CENTER)
                        rect(0, 0, w, h)
                        pop()
                    }
                    body = body.m_next
                }
                pop()

                var fps = frameRate();
                fill(255);
                stroke(0);
                textSize(20)
                text("FPS: " + fps.toFixed(2), 10, height - 10);
                text("Bodies: " + world.GetBodyCount(), width - width/4, height - 10);
                
            }
        }
    });
});

