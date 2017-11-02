const PIXI = require('pixi.js')
const { worldElement } = require('./worldElements')
const { spawnParticles } = require('./particles')
let app = new PIXI.Application
let renderer = PIXI.autoDetectRenderer(400, 400)
renderer.backgroundColor = 0x666666
document.getElementById('canvas').appendChild(renderer.view)
document.addEventListener('keydown', onKeyDown);

let button = document.getElementById('buttonAddParticles')
let particlesOnClick = false
button.onclick = () => {
    particlesOnClick = !particlesOnClick
    if (particlesOnClick)
        button.firstChild.data = 'Disable particles on click'
    else
        button.firstChild.data = 'Enable particles on click'
}

let particleCountDiv = document.getElementById('particlesCount')

let stage = new PIXI.Container
stage.interactive = true
stage.hitArea = new PIXI.Rectangle(-renderer.width, -renderer.height, 2 * renderer.width, 2 * renderer.height)
stage.on('pointerdown', onMouseDown)
renderer.autoResize = true


PIXI.loader
    .add('assets/images/Circle.png')
    .load(setup)

let particlesContainer, circleTexture
stage.position.set(renderer.width / 2, renderer.height / 2)
stage.scale.set(100, -100)
function setup() {
    
    circleTexture = PIXI.loader.resources['assets/images/Circle.png'].texture
    let blurFilter = new PIXI.filters.BlurFilter
    blurFilter.blur = 3
    particleSetup([blurFilter])
    let fps = new PIXI.Text
    fpsSetup(fps)
    stage.addChild(worldElement.container)

    //main loop
    app.ticker.add(function () {
        world.Step(1 / 60, 5, 5)
        particles()
        displayBox2dShapes()
        newParticles()
        fps.text = app.ticker.FPS.toFixed(0)
        renderer.render(stage)


        //#TODO: debugging info
        particleCountDiv.innerHTML = `Particles: ${world.particleSystems[0].GetParticleCount()}`
    })
}

function newParticles() {
    const newParticlesCount = world.particleSystems[0].GetParticleCount() / 2 - particlesContainer.children.length
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
    fps.width = 0.5
    fps.height = 0.5
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
    for (let i = 0; i < worldElement.elements.length; i++) {
        worldElement.elements[i].display()
    }
}


let gravity = new b2Vec2(0, -10)
function onKeyDown(key) {
    if (key.keyCode === 32) {
        gravity.y *= -1
        gravity.x *= -1
    }
    if (key.keyCode === 38) {
        gravity.y += 1
    }
    if (key.keyCode === 40) {
        gravity.y -= 1
    }
    if (key.keyCode === 37) {
        gravity.x -= 1
    }
    if (key.keyCode === 39) {
        gravity.x += 1
    }
    world.SetGravity(new b2Vec2(gravity.x, gravity.y))
    document.getElementById('gravity').innerHTML = `Gravity: ${gravity.x}, ${gravity.y}`
}

function onMouseDown(mouse) {
    if (particlesOnClick) {
        const localPos = mouse.data.getLocalPosition(mouse.target)
        spawnParticles([localPos.x, localPos.y], [0.25, 0.25], 0.03)
    }
}