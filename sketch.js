

require(["p5"], function (p5) {
    var myp5 = new p5(function (sketch) {

        sketch.setup = function () {
            var canvas = sketch.createCanvas(400, 400)
            canvas.parent('sketch-div')
        }

        sketch.draw = function () {
            with (sketch) {
                world.Step(1 / 60, 8, 5)
                background(120)
                textSize(50)
                text('Kappa 123', width / 4 + 10 * cos(frameCount * 0.1), height / 2 + 10 * sin(frameCount * 0.05))
                if (frameCount % 240 === 0)
                    console.log(world.m_bodyList.GetPosition())

                //testing
                push()
                translate(width / 2, 100)
                fill(0, 255, 0)
                let body = world.m_bodyList
                while (body.m_next != null) {
                    let pos = body.GetPosition()
                    ellipse(pos.x, -pos.y, 50, 50)
                    body = body.m_next
                }
                pop()
            }
        }
    });
});