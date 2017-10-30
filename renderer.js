const PIXI = require('pixi.js')

let renderer = PIXI.autoDetectRenderer(400, 400)
renderer.backgroundColor = 0x666666
document.body.appendChild(renderer.view)

let stage = new PIXI.Container()

renderer.autoResize = true


PIXI.loader
    .add('assets/images/Circle.png')
    .load(setup)

let circleSprite
let circles
stage.position.set(renderer.width / 2, renderer.height / 2)
stage.scale.set(100, -100)
console.log(stage)
function setup() {
    const circleTexture = PIXI.loader.resources['assets/images/Circle.png'].texture
    circles = new PIXI.Container()
    let particlesCount = world.particleSystems[0].GetParticleCount()
    let particlesPos = world.particleSystems[0].GetPositionBuffer()
    for (let i = 0; i < particlesCount; i += 2) {
        let circle = new PIXI.Sprite(circleTexture)
        circle.width = 0.04
        circle.height = 0.04
        circle.anchor.set(0.5,0.5)
        circle.position.set(particlesPos[i], particlesPos[i + 1])

        circles.addChild(circle)
    }

    stage.addChild(circles)
    draw()
}



function draw() {
    requestAnimationFrame(draw)
    world.Step(1 / 60, 5, 5)
    let particlesPos = world.particleSystems[0].GetPositionBuffer()
    let particlesCount = world.particleSystems[0].GetParticleCount()

    for (let i = 0; i < circles.children.length; i++) {
        circles.children[i].x = particlesPos[2 * i]
        circles.children[i].y = particlesPos[2 * i + 1]
    }
    renderer.render(stage)
}