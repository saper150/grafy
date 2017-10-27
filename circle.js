const Box2D = require('box2dweb')
const WorldElement = require('./worldElement')
module.exports = class Circle extends WorldElement {
    constructor(world, [x, y]) {
        super(world, [x, y], new Box2D.Collision.Shapes.b2CircleShape)
    }
}