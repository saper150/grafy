const PIXI = require('pixi.js')
const { worldElement } = require('./worldElements')
let app = new PIXI.Application
let renderer = PIXI.autoDetectRenderer(400, 400)
renderer.backgroundColor = 0x666666
document.body.appendChild(renderer.view)
document.addEventListener('keydown', onKeyDown);


let stage = new PIXI.Container

renderer.autoResize = true


PIXI.loader
    .add('assets/images/Circle.png')
    .load(setup)

let circles, blurFilter, filter
let box2dElements = []
stage.position.set(renderer.width / 2, renderer.height / 2)
stage.scale.set(100, -100)
function setup() {
    blurFilter = new PIXI.filters.BlurFilter
    blurFilter.blur = 3
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
    circles.filters = [blurFilter]
    stage.addChild(circles)

    let fps = new PIXI.Text
    fps.position.set(1.5, 2)
    fps.width = 0.5
    fps.height = 0.5
    fps.rotation = Math.PI
    fps.scale.x = -1
    stage.addChild(fps)

    for (let i = 0; i < worldElement.elements.length; i++) {
        let graphic = new PIXI.Graphics
        if (worldElement.elements[i].type === undefined)
            continue
        if (worldElement.elements[i].type === 'circle') {
            graphic.beginFill(worldElement.elements[i].color)
            graphic.drawCircle(0, 0, worldElement.elements[i].radius)
            graphic.endFill()
        }
        stage.addChild(graphic)
        box2dElements.push({ element: worldElement.elements[i], graphic, type: worldElement.elements[i].type })
    }

    app.ticker.add(function () {
        world.Step(1 / 60, 5, 5)
        particles()
        displayBox2dShapes()
        fps.text = app.ticker.FPS.toFixed(0)
        renderer.render(stage)
    })
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
console.log(worldElement.elements)
function displayBox2dShapes() {
    for (let i = 0; i < box2dElements.length; i++) {
        if (box2dElements[i].element.type === 'circle') {
            let pos = box2dElements[i].element.body.GetPosition()
            box2dElements[i].graphic.position.x = pos.x
            box2dElements[i].graphic.position.y = pos.y
        }
        if (box2dElements[i].element.type === 'line') {
            let pos = box2dElements[i].element.bodies
            let posA = pos[0].GetPosition()
            let posB = pos[1].GetPosition()
            box2dElements[i].graphic.clear()
            box2dElements[i].graphic.lineStyle(box2dElements[i].element.thickness, box2dElements[i].element.color)
            box2dElements[i].graphic.moveTo(posA.x, posA.y)
            box2dElements[i].graphic.lineTo(posB.x, posB.y)
        }
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
    // console.log(gravity)
}