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

    display() { }
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
        this.text = new PIXI.Text(this.userData.index)
        this.text.width = 1.5 * this.radius
        this.text.height = 2 * this.radius
        this.text.anchor.set(0.5, 0.5)
        this.text.scale.set(this.text.scale.x, this.text.scale.y * -1)
        WorldElement.container.addChild(this.text)

        this.graphic.beginFill(0xffffff)
        this.graphic.drawCircle(0, 0, 1.2 * radius)
        this.graphic.endFill()
        this.graphic.tint = this.color
    }

    display() {
        if(this.destroyed) return
        let pos = this.body.GetPosition()
        this.graphic.position.x = pos.x
        this.graphic.position.y = pos.y
        this.text.position.set(pos.x, pos.y)
    }

    colorVertex(color){
        this.graphic.tint = color
    }

    destroy() {
        WorldElement.container.removeChild(this.graphic)
        world.DestroyBody(this.body)
        this.graphic.destroy(true)
        this.text.destroy(true)
        this.destroyed = true
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
        this.joint = world.CreateJoint(djd)

        WorldElement.elements.push(this)
        WorldElement.container.addChild(this.graphic)
    }

    destroy() {
        world.DestroyJoint(this.joint)
        this.graphic.destroy(true)
        WorldElement.container.removeChild(this.graphic)
        this.destroyed = true
    }

    display() {
        if (this.destroyed) return

        let pos = this.bodies
        let posA = pos[0].GetPosition()
        let posB = pos[1].GetPosition()
        this.graphic.clear()
        this.graphic.lineStyle(this.thickness, this.color)
        this.graphic.moveTo(posA.x, posA.y)
        this.graphic.lineTo(posB.x, posB.y)

    }
}
