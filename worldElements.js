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
        this.graphic.interactive = true
        this.text = new PIXI.Text(this.userData.index)
        this.text.width = 1.5 * this.radius
        this.text.height = 2 * this.radius
        this.text.anchor.set(0.5, 0.5)
        this.text.scale.set(this.text.scale.x, this.text.scale.y * -1)
        WorldElement.container.addChild(this.text)
        
        //#TODO: mouse joint has 1m length
        this.mouseMoving = false
        this.graphic.on('pointerdown', (mouse) => this.mouseDown(mouse))
        this.graphic.on('pointerupoutside', (mouse) => this.mouseUp(mouse))
        this.graphic.on('pointerup', (mouse) => this.mouseUp(mouse))
        this.graphic.on('pointermove', (mouse) => this.mouseMove(mouse))
        this.graphic.beginFill(color)
        this.graphic.drawCircle(0, 0, 1.2*radius)
        this.graphic.endFill()
    }

    display() {
        let pos = this.body.GetPosition()
        this.graphic.position.x = pos.x
        this.graphic.position.y = pos.y
        this.text.position.set(pos.x, pos.y)
    }

    mouseDown(mouse) {
        let md = new b2MouseJointDef
        md.bodyA = world.bodies[0]
        md.bodyB = this.body
        md.collideConnected = true
        md.maxForce = 1000
        md.dampingRatio = 0
        this.mouseJoint = world.CreateJoint(md)
        this.body.SetAwake(true)
        this.mouseMoving = true
        this.target = mouse.target.parent
    }

    mouseMove(mouse) {
        if (this.mouseMoving) {
            let mousePos = mouse.data.getLocalPosition(this.target.parent)
            this.mouseJoint.SetTarget(mousePos)
        }
    }

    mouseUp(mouse) {
        if (this.mouseMoving) {
            this.mouseMoving = false
            world.DestroyJoint(this.mouseJoint)
        }
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
        WorldElement.container.removeChild(this.graphic)
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
