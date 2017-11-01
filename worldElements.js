const PIXI = require('pixi.js')

class WorldElement {
    constructor([x, y], shape, color, userData) {
        const bd = new b2BodyDef;
        bd.position.Set(x, y);
        bd.type = b2_dynamicBody;
        this.body = world.CreateBody(bd);
        WorldElement.elements.push(this)

        //tmp
        let density = 1
        const fixture = this.body.CreateFixtureFromShape(shape, density);
        this.userData = userData
    }

    display() {
        //#TODO: displaying shapes here
    }

}
WorldElement.elements = []

class Circle extends WorldElement {
    constructor([x, y], radius, color, userData) {
        let shape = new b2CircleShape
        shape.radius = radius;
        super([x, y], shape, color, userData)
        this.color = color
        this.radius = radius
        this.type = 'circle'
    }

    display() {
    }
}

class JointLine {
    constructor([bodyA, bodyB], frequency, damping, length, thickness, color) {
        this.bodies = [bodyA, bodyB]
        this.thickness = thickness
        this.color = color
        this.type = 'line'
        let djd = new b2DistanceJointDef
        djd.bodyA = bodyA
        djd.bodyB = bodyB
        djd.frequencyHz = frequency
        djd.dampingRatio = damping
        djd.length = length
        world.CreateJoint(djd)

        WorldElement.elements.push(this)

    }

    display() {

    }
}


module.exports.worldElement = WorldElement
module.exports.circle = Circle
module.exports.jointLine = JointLine