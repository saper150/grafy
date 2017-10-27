const Box2D = require('box2dweb')

module.exports = class WorldElement {
    constructor(world, [x, y], shapeb2) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef
        bodyDef.position.Set(x, y)
        bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody

        const shape = shapeb2
        console.log(shapeb2)
        shape.radius = 0.1
        this.body = world.CreateBody(bodyDef)
        console.log(this.body)
        this.body.CreateFixture2(shape, 1)

    }
    getBody() {
        return this.body
    }

    display(sketch) {
        let pos = this.body.GetPosition()
        // console.log(pos)
        sketch.fill(0,255,0)
        sketch.ellipse(pos.x, pos.y, 100, 100)
        // sketch.noLoop()
    }
}
