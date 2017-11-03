import 'pixi.js'

export class WorldElement {
    constructor([x, y], shape, color, userData) {
        const bd = new b2BodyDef;
        bd.position.Set(x, y);
        bd.type = b2_dynamicBody;
        this.body = world.CreateBody(bd);
        WorldElement.elements.push(this)
        this.graphic = new PIXI.Graphics
        WorldElement.container.addChild(this.graphic)
        //tmp
        let density = 1
        const fixture = this.body.CreateFixtureFromShape(shape, density);
        this.userData = userData
    }

    display() {    }
}
    
WorldElement.elements = []
WorldElement.container = new PIXI.Container

export class Circle extends WorldElement {
    constructor([x, y], radius, color, userData) {
        let shape = new b2CircleShape
        shape.radius = radius;
        super([x, y], shape, color, userData)
        this.color = color
        this.radius = radius

        this.graphic.beginFill(color)
        this.graphic.drawCircle(0, 0, radius)
        this.graphic.endFill()
    }

    display() {
        let pos = this.body.GetPosition()
        this.graphic.position.x = pos.x
        this.graphic.position.y = pos.y
    }
}

export class JointLine {
    constructor([bodyA, bodyB], frequency, damping, length, thickness, color) {
        this.bodies = [bodyA, bodyB]
        this.thickness = thickness
        this.color = color
        this.graphic = new PIXI.Graphics

        let djd = new b2DistanceJointDef
        djd.bodyA = bodyA
        djd.bodyB = bodyB
        djd.frequencyHz = frequency
        djd.dampingRatio = damping
        djd.length = length
        world.CreateJoint(djd)

        WorldElement.elements.push(this)
        WorldElement.container.addChild(this.graphic)

    }


    display() {
        let pos = this.bodies
        let posA = pos[0].GetPosition()
        let posB = pos[1].GetPosition()
        this.graphic.clear()
        this.graphic.lineStyle(this.thickness, this.color)
        this.graphic.moveTo(posA.x, posA.y)
        this.graphic.lineTo(posB.x, posB.y)
    }
}
