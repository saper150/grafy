

class WorldElement {
    constructor([x, y], shape) {
        const bd = new b2BodyDef;
        bd.position.Set(x, y);
        bd.type = b2_dynamicBody;
        this.body = world.CreateBody(bd);

        WorldElement.elements.push(this)

        //tmp
        let density = 1
        this.body.CreateFixtureFromShape(shape, density);

    }

    display() {
    }

    static getElements() {
        return WorldElement.elements
    }
}
WorldElement.elements = []

class Circle extends WorldElement {
    constructor([x, y], radius, color, index) {
        var shape = new b2CircleShape
        shape.radius = radius;
        super([x, y], shape)
        this.color = color
        this.radius = radius
        this.index = index
    }

    display(sketch) {
        const pos = this.body.GetPosition()
        const radius = 2 * this.radius
        sketch.push()
        sketch.translate(pos.x * scaleMulti, pos.y * scaleMulti)
        sketch.noStroke()
        sketch.fill(sketch.color(this.color))
        sketch.ellipse(0, 0, radius * scaleMulti, radius * scaleMulti)
        if (this.index !== undefined) {
            sketch.fill(255)
            sketch.strokeWeight(3)
            sketch.textSize(radius * scaleMulti)
            sketch.textAlign(sketch.CENTER, sketch.CENTER)
            sketch.rotate(Math.PI)
            sketch.text(this.index, 0, 0)
        }
        sketch.pop()
    }
}

class JointLine {
    constructor([bodyA, bodyB], frequency, damping, length, thickness, color) {
        this.bodies = [bodyA, bodyB]
        this.thickness = thickness
        this.color = color

        let djd = new b2DistanceJointDef
        djd.bodyA = bodyA
        djd.bodyB = bodyB
        djd.frequencyHz = frequency
        djd.dampingRatio = damping
        djd.length = length
        world.CreateJoint(djd)

        WorldElement.elements.push(this)

    }

    display(sketch) {
        const posA = this.bodies[0].GetPosition()
        const posB = this.bodies[1].GetPosition()

        sketch.strokeWeight(this.thickness * scaleMulti)
        sketch.stroke(sketch.color(this.color))
        sketch.line(posA.x * scaleMulti, posA.y * scaleMulti, posB.x * scaleMulti, posB.y * scaleMulti)

    }
}


module.exports.worldElement = WorldElement
module.exports.circle = Circle
module.exports.jointLine = JointLine