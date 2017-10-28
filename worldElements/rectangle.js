const Box2D = require('box2dweb')
const WorldElement = require('./worldElement')
module.exports = class Rectangle extends WorldElement {
    constructor(world, [x, y], isStatic) {
        let shape = new Box2D.Collision.Shapes.b2PolygonShape
        shape.SetAsBox(100,50)
        super(world, [x, y], shape, isStatic)
    }
}