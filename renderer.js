const PIXI = require('pixi.js')
const { worldElement } = require('./worldElements')
let app = new PIXI.Application
let renderer = PIXI.autoDetectRenderer(400, 400)
renderer.backgroundColor = 0x666666
document.getElementById('canvas').appendChild(renderer.view)
// document.body.appendChild(renderer.view)
document.addEventListener('keydown', onKeyDown);


let stage = new PIXI.Container

renderer.autoResize = true


PIXI.loader
    .add('assets/images/Circle.png')
    .load(setup)

let circles
stage.position.set(renderer.width / 2, renderer.height / 2)
stage.scale.set(100, -100)
function setup() {

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
        fps.text = app.ticker.FPS.toFixed(0)
        renderer.render(stage)
    })
}

function particleSetup(filterArray){
    const circleTexture = PIXI.loader.resources['assets/images/Circle.png'].texture
    
    circles = new PIXI.Container
    let particlesPos = world.particleSystems[0].GetPositionBuffer()

    for (let i = 0; i < particlesPos.length; i += 2) {
        let circle = new PIXI.Sprite(circleTexture)
        circle.width = 0.06
        circle.height = 0.06
        circle.anchor.set(0.5, 0.5)
        circle.tint = 0xff0000
        circle.position.set(particlesPos[i], particlesPos[i + 1])
        circles.addChild(circle)
    }
    circles.filters = filterArray
    stage.addChild(circles)
}

function fpsSetup(fps){
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
    for (let i = 0; i < circles.children.length; i++) {
        circles.children[i].x = particlesPos[2 * i]
        circles.children[i].y = particlesPos[2 * i + 1]
        circles.children[i].tint = PIXI.utils.rgb2hex([particleColor[4 * i] / 255, particleColor[4 * i + 1] / 255, particleColor[4 * i + 2] / 255])
    }
}
function displayBox2dShapes() {
    for (let i = 0; i <  worldElement.elements.length; i++){
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