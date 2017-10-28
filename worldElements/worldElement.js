const Box2D = require('box2dweb')

module.exports = class WorldElement {
    constructor(world, [x, y], shape, isStatic) {
        const bodyDef = new Box2D.Dynamics.b2BodyDef
        bodyDef.position.Set(x, y)
        if (isStatic)
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody
        else
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody

        // const shape = shapeb2
        // console.log(shapeb2)
        // shape.m_radius = 0.1

        this.body = world.CreateBody(bodyDef)
        this.body.CreateFixture2(shape, 100)

    }
    getBody() {
        return this.body
    }

    display(sketch) {
        let pos = this.body.GetPosition()
        // console.log(pos)
        sketch.fill(0, 255, 0)
        sketch.ellipse(pos.x, pos.y, 100, 100)
        // sketch.noLoop()
    }
}
