const Box2D = require('box2dweb')
const WorldElement = require('./worldElement')
module.exports = class Circle extends WorldElement {
    constructor(world, [x, y], r) {
        let shape = new Box2D.Collision.Shapes.b2CircleShape
        shape.m_radius = r
        super(world, [x, y], shape)
    }
}