import 'pixi.js'
import { WorldElement } from './worldElements'
import { spawnParticles } from './particles'
import { Graph } from "./graph";

let app = new PIXI.Application
let renderer = PIXI.autoDetectRenderer(400, 400)
renderer.backgroundColor = 0x999999
document.getElementById('canvas').appendChild(renderer.view)
document.addEventListener('keydown', onKeyDown);

let button = document.getElementById('buttonAddParticles')
let particlesOnClick = false

let g_groundBody = null
let mouseJoint = null

button.onclick = () => {
    particlesOnClick = !particlesOnClick
    button.firstChild.data = getEnableDisableString(!particlesOnClick, 'particles on click')
}

function getEnableDisableString(condition, data) {
    if (condition)
        return `Enable ${data}`
    return `Disable ${data}`

}

let graph 

let particleCountDiv = document.getElementById('particlesCount')

let stage = new PIXI.Container
stage.interactive = true
stage.hitArea = new PIXI.Rectangle(-renderer.width, -renderer.height, 2 * renderer.width, 2 * renderer.height)
stage.on('pointerdown', onMouseDown)

function resize(width, height) {
    renderer.resize(width, height)
    stage.scale.set(100 * width / 400, -100 * height / 400)
    stage.position.set(renderer.width / 2, renderer.height / 2)
}
window.resize = resize

PIXI.loader
    .add('assets/images/Circle.png')
    .load(setup)

let particlesContainer, circleTexture
stage.position.set(renderer.width / 2, renderer.height / 2)
stage.scale.set(100, -100)

function setup() {

    graph = Graph.random(8, 1).BFS()
    graph.spawn()

    g_groundBody = world.CreateBody(new b2BodyDef);
    circleTexture = PIXI.loader.resources['assets/images/Circle.png'].texture
    let blurFilter = new PIXI.filters.BlurFilter
    blurFilter.blur = 3
    particleSetup([blurFilter])
    let fps = new PIXI.Text
    fpsSetup(fps)
    stage.addChild(WorldElement.container)

    //main loop
    app.ticker.add(function () {
        world.Step(1 / 60, 5, 5)
        graph.tick()
        drawParticles()
        displayBox2dShapes()
        newParticles()
        fps.text = app.ticker.FPS.toFixed(0)
        renderer.render(stage)


        //debugging info
        particleCountDiv.innerHTML = `Particles: ${world.particleSystems[0].GetParticleCount() / 2}`
    })
}

function newParticles() {
    
    const newParticlesCount = world.particleSystems[0].GetParticleCount() / 2 - particlesContainer.children.length
    if (newParticlesCount > 0)
        for (var i = 0; i < newParticlesCount; i++) {
            particlesContainer.addChild(makeSprite(circleTexture))
        }
}

function makeSprite(texture) {
    let circle = new PIXI.Sprite(texture)
    circle.width = 0.06
    circle.height = 0.06
    circle.anchor.set(0.5, 0.5)
    circle.tint = 0x666666
    return circle
}

function particleSetup(filterArray) {

    particlesContainer = new PIXI.Container
    let particleCount = world.particleSystems[0].GetParticleCount() / 2
    for (var i = 0; i < particleCount; i++) {
        particlesContainer.addChild(makeSprite(circleTexture))
    }
    particlesContainer.filters = filterArray
    stage.addChild(particlesContainer)
}

function fpsSetup(fps) {
    fps.position.set(1.5, 2)
    fps.width = 0.3
    fps.height = 0.3
    fps.rotation = Math.PI
    fps.scale.x = -1
    stage.addChild(fps)
}



function particles() {
    let particlesPos = world.particleSystems[0].GetPositionBuffer()
    let particleColor = world.particleSystems[0].GetColorBuffer()
    for (var i = 0; i < particlesContainer.children.length; i++) {
        particlesContainer.children[i].x = particlesPos[2 * i]
        particlesContainer.children[i].y = particlesPos[2 * i + 1]
        particlesContainer.children[i].tint = PIXI.utils.rgb2hex([particleColor[4 * i] / 255, particleColor[4 * i + 1] / 255, particleColor[4 * i + 2] / 255])
    }
}
function displayBox2dShapes() {
    for (let i = 0; i < WorldElement.elements.length; i++) {
        WorldElement.elements[i].display()
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

    gravityChange.forEach(function (change) {
        if (change.key === key.keyCode) {
            world.addToGravity(change.x, change.y)
        }
    });

    document.getElementById('gravity').innerHTML = `Gravity: ${world.gravity.x}, ${world.gravity.y}`
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