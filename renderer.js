import 'pixi.js'
import { WorldElement } from './worldElements'
import { spawnParticles } from './particles'
import 'fpsmeter'
import htmlUtilis from './htmlUtilis'
let app, renderer, stage, meter, particlesContainer
app = new PIXI.Application
renderer = PIXI.autoDetectRenderer(400, 400)
renderer.backgroundColor = 0x999999
document.getElementById('canvas').appendChild(renderer.view)
document.addEventListener('keydown', onKeyDown);

meter = new FPSMeter(document.getElementById('canvas'), {position: 'sticky', margin: 'inherit', width: 50, graph: 1, history: 20, heat: 1})

let particlesOnClick = false
document.getElementById('buttonAddParticles').onclick = addParticlesOnClick

function addParticlesOnClick(){
    particlesOnClick = !particlesOnClick
    this.firstChild.data = htmlUtilis.twoStateName(particlesOnClick, 'Disable', 'Enable', 'particles on click')
}


let g_groundBody = null
let mouseJoint = null



function stageSetup() {
    stage = new PIXI.Container
    stage.interactive = true
    stage.hitArea = new PIXI.Rectangle(-renderer.width, -renderer.height, 2 * renderer.width, 2 * renderer.height)
    stage.on('pointerdown', onMouseDown)
    stage.position.set(renderer.width / 2, renderer.height / 2)
    stage.scale.set(100, -100)
}

function makeBlur(blurStr) {
    let blurFilter = new PIXI.filters.BlurFilter
    blurFilter.blur = blurStr
    return blurFilter
}

PIXI.loader
.add('assets/images/Circle.png')
.load(setup)

function setup() {
    stageSetup()
    particleSetup([makeBlur(3)])
    stage.addChild(WorldElement.container)

    htmlUtilis.setTextInDiv('particlesCount', `Particles: ${world.particleSystems[0].GetParticleCount() / 2}`)

    //main loop
    app.ticker.add(function () {
        meter.tickStart()
        world.Step(1 / 60, 5, 5)
        particles()
        WorldElement.elements.map(we => we.display())

        newParticles()
        renderer.render(stage)
        meter.tick()
    })
}

function newParticles() {
    const newParticlesCount = world.particleSystems[0].GetParticleCount() / 2 - particlesContainer.children.length
    const radius = world.particleSystems[0].radius
    if (newParticlesCount > 0) {
        for (var i = 0; i < newParticlesCount; i++) {
            particlesContainer.addChild(makeSprite(2*radius, 2*radius,PIXI.loader.resources['assets/images/Circle.png'].texture))
        }
        htmlUtilis.setTextInDiv('particlesCount', `Particles: ${world.particleSystems[0].GetParticleCount() / 2}`)
    }
}

function makeSprite(width, height,texture) {
    let sprite = new PIXI.Sprite(texture)
    sprite.width = width
    sprite.height = height
    sprite.anchor.set(0.5, 0.5)
    sprite.tint = 0x666666
    return sprite
}

function particleSetup(filterArray) {
    particlesContainer = new PIXI.Container
    const particleCount = world.particleSystems[0].GetParticleCount() / 2
    const radius = world.particleSystems[0].radius
    for (let i = 0; i < particleCount; i++) {
        particlesContainer.addChild(makeSprite(2*radius, 2*radius,PIXI.loader.resources['assets/images/Circle.png'].texture))
    }
    if (filterArray)
        particlesContainer.filters = filterArray
    stage.addChild(particlesContainer)
}

function particles() {
    const particlesPos = world.particleSystems[0].GetPositionBuffer()
    const particleColor = world.particleSystems[0].GetColorBuffer()
    for (var i = 0; i < particlesContainer.children.length; i++) {
        particlesContainer.children[i].position.set(particlesPos[2 * i], particlesPos[2 * i + 1])
        particlesContainer.children[i].tint = PIXI.utils.rgb2hex([particleColor[4 * i] / 255, particleColor[4 * i + 1] / 255, particleColor[4 * i + 2] / 255])
    }
}

const gravityChange = [
    { key: 38, x: 0, y: 1, dir: 'up' },
    { key: 40, x: 0, y: -1, dir: 'down' },
    { key: 37, x: -1, y: 0, dir: 'left' },
    { key: 39, x: 1, y: 0, dir: 'right' }
]

function onKeyDown(key) {
    if (key.keyCode === 32)
        world.multGravity(-1, -1)

    gravityChange.forEach((change)=> {
        if (change.key === key.keyCode) {
            world.addToGravity(change.x, change.y)
        }
    })
    htmlUtilis.setTextInDiv('gravity', `Gravity: ${world.gravity.x}, ${world.gravity.y}` )
}

function getMousePosition(mouse) { 
    const pos = mouse.data.getLocalPosition(mouse.target)
    return new b2Vec2(pos.x, pos.y)
}

function onMouseDown(mouse) {
    const localPos = getMousePosition(mouse)
    if (particlesOnClick) {
        spawnParticles([localPos.x, localPos.y], [0.25, 0.25], 0.03)
    } else {
        var aabb = new b2AABB;
        aabb.lowerBound = new b2Vec2(localPos.x + 0.001, localPos.y - 0.001)
        aabb.upperBound = new b2Vec2(localPos.x - 0.001, localPos.y + 0.001)

        const callbackQuery = {
            ReportFixture: (fixture) => {
                var body = fixture.body;
                var joint = new b2MouseJointDef;
                joint.bodyA = g_groundBody;
                joint.bodyB = body;
                joint.target = localPos;
                joint.maxForce = 1000 * body.GetMass();
                mouseJoint = world.CreateJoint(joint);
                body.SetAwake(true);
            }
        }

        world.QueryAABB(callbackQuery, aabb);

    }
}

function onMouseUp() {
    if (mouseJoint) { 
        world.DestroyJoint(mouseJoint)
        mouseJoint = null
    }
}

function onMouseMove(event) {
    if (mouseJoint) { 
        mouseJoint.SetTarget(getMousePosition(event))
    }
}

