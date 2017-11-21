import 'pixi.js'
import { WorldElement } from './worldElements'
import { addWaterToWorld } from './particles'
import { allahuAkbar } from "./allahu-akbar";
import 'fpsmeter'
import { htmlUtilis } from './htmlUtilis'
import $ from 'jquery'
let app, renderer, stage, meter, particlesContainer, selectClickOption, background
let graphs = []
app = new PIXI.Application
renderer = PIXI.autoDetectRenderer(1000, 800)
import { Graph } from "./graph";
import { Sprite } from 'pixi.js';

renderer.backgroundColor = 0x999999
document.getElementById('canvas').appendChild(renderer.view)
document.addEventListener('keydown', onKeyDown);
document.addEventListener('mouseup', onMouseUp)
meter = new FPSMeter(document.getElementById('canvas'), { position: 'sticky', margin: 'inherit', width: 50, graph: 1, history: 20, heat: 1 })

let g_groundBody = null
let mouseJoint = null


function spawnGraph() {
    destroyGraphs()
    const vertices = parseInt($('#inputGraphVertices').val())
    const prob = parseFloat($('#inputGraphProb').val())
    const radius = parseFloat($('#inputGraphRadius').val())
    const length = parseFloat($('#inputGraphLength').val())
    let graph = Graph.random(vertices, prob, { createTable: true, buttonName: 'buttonShowHideTable', color: 0xff0000, radius: radius, length: length })
    graphs.push(graph)
    graphs.forEach(g => g.spawn())
    $('#buttonDFScreate').attr('disabled', false)
    $('#buttonBFScreate').attr('disabled', false)
    $('#buttonColoring').attr('disabled', false)
}

function destroyGraphs() {
    graphs.forEach(g => g.destroy())
    graphs = []

    $('#buttonDFScreate').attr('disabled', true)
    $('#buttonBFScreate').attr('disabled', true)
    $('#buttonColoring').attr('disabled', true)
}

function spawnDFS(){
    let dfs = graphs[0].DFS() 
    graphs.push(dfs)
    dfs.spawn()
    $('#buttonDFScreate').attr('disabled', true)
}

function spawnBFS(){
    let bfs = graphs[0].BFS() 
    graphs.push(bfs)
    bfs.spawn()
    $('#buttonBFScreate').attr('disabled', true)
}

function clearSearches(){
    $('#buttonDFScreate').attr('disabled', false)
    $('#buttonBFScreate').attr('disabled', false)
    $('#buttonColoring').attr('disabled', false)
    graphs.splice(1).forEach(g => g.destroy())
}

function removeWater(){
    world.particleSystems[0].particleGroups.forEach(p => p.DestroyParticles())
    particlesContainer.children.forEach(p => p.destroy(true))
    for (let i = particlesContainer.children.length - 1; i >= 0; i--)
        particlesContainer.removeChild(particlesContainer.children[i])
    $('#particlesCount').text('Particles: 0')
}

function graphColoring(){
    graphs[0].coloring()
}

function buttonsSetup() {
    $('#buttonSpawnGraph').click(spawnGraph)
    $('#buttonSpawnWater').click(spawnWater)
    $('#buttonRemoveWater').click(removeWater)
    $('#buttonDestroyGraph').click(destroyGraphs)
    $('#buttonDFScreate').click(spawnDFS)
    $('#buttonBFScreate').click(spawnBFS)
    $('#buttonGraphSearchClear').click(clearSearches)
    $('#buttonColoring').click(graphColoring)
    
}

function spawnWater() {
    const count = addWaterToWorld({ x: 0, y: 1, width: 0.55, height: 1.5, count: 7 })
    addNewParticlesToRender(count)
    
}

function stageSetup() {
    stage = new PIXI.Container
    stage.interactive = true
    stage.hitArea = new PIXI.Rectangle(-renderer.width, -renderer.height, 2 * renderer.width, 2 * renderer.height)
    stage.on('pointerdown', onMouseDown)
    stage.on('pointermove', onMouseMove)
    stage.position.set(renderer.width / 2, renderer.height / 2)
    stage.scale.set(100, -100)
}

function backgroundSetup(){
    background = makeSprite(renderer.width/100,renderer.height/100, 'assets/images/Space.jpg')
    stage.addChild(background)
}

function makeBlur(blurStr) {
    let blurFilter = new PIXI.filters.BlurFilter
    blurFilter.blur = blurStr
    return blurFilter
}

PIXI.loader
    .add('assets/images/Circle.png')
    .add('assets/images/Space.jpg')
    .load(setup)

function setup() {
    selectClickOption = htmlUtilis.setupSelectWithOptions({ name: 'selectClickOption', options: ['move', 'add water', 'kaboom'] })
    buttonsSetup()
    stageSetup()
    backgroundSetup()
    particleSetup([makeBlur(3)])
    g_groundBody = world.CreateBody(new b2BodyDef);
    stage.addChild(WorldElement.container)
    $('#particleCount').text(`Particles: ${world.particleSystems[0].GetParticleCount() / 2}`)

    let counter = 0
    //main loop
    app.ticker.add(function () {
        counter++
        meter.tickStart()
        world.Step(1 / 60, 5, 5)
        particles()
        WorldElement.elements.forEach(we => we.display())

        graphs.forEach(g => g.tick())

        background.alpha = map(Math.abs(world.gravity.x) + Math.abs(world.gravity.y), 0, 5,1,0)
        renderer.render(stage)
        meter.tick()
    })
}
function map(n, start1, stop1, start2, stop2) {
    return ((n - start1)/(stop1 - start1)) * (stop2 - start2) + start2;
}

function makeSprite(width, height, texturePath) {
    let sprite = new PIXI.Sprite(PIXI.Texture.fromImage(texturePath));
    sprite.position.set(0, 0)
    sprite.width = width
    sprite.height = height
    sprite.anchor.set(0.5, 0.5)
    return sprite
}

function particleSetup(filterArray) {
    particlesContainer = new PIXI.Container
    const particleCount = world.particleSystems[0].GetParticleCount() / 2
    const radius = world.particleSystems[0].radius
    for (let i = 0; i < particleCount; i++) {
        particlesContainer.addChild(makeSprite(2 * radius, 2 * radius, 'assets/images/Circle.png'))
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

function moveObject(localPos) {
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

const gravityChange = [
    { key: 38, x: 0, y: 1, dir: 'up' },
    { key: 40, x: 0, y: -1, dir: 'down' },
    { key: 37, x: -1, y: 0, dir: 'left' },
    { key: 39, x: 1, y: 0, dir: 'right' }
]

function onKeyDown(key) {
    if (key.keyCode === 32) {
        world.multGravity(-1, -1)
        key.preventDefault()
    }
    gravityChange.forEach((change) => {
        if (change.key === key.keyCode) {
            world.addToGravity(change.x, change.y)
            key.preventDefault()
        }
    })
    if (key.code === 'KeyG')
        world.resetGravity()
    $('#gravity').text(`Gravity: ${world.gravity.x}, ${world.gravity.y}`)
}

function getMousePosition(mouse) {
    const pos = mouse.data.getLocalPosition(mouse.target)
    return new b2Vec2(pos.x, pos.y)
}

function onMouseDown(mouse) {
    const localPos = getMousePosition(mouse)
    if (selectClickOption.value === 'move')
        moveObject(localPos)
    if (selectClickOption.value === 'kaboom')
        allahuAkbar({ center: localPos })
    if (selectClickOption.value === 'add water')
        addNewParticles({ x: localPos.x, y: localPos.y, width: 0.25, height: 0.25, count: 1 })
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

function addNewParticles(settings) {
    const count = addWaterToWorld(settings)
    addNewParticlesToRender(count)
}

function addNewParticlesToRender(count) {
    const radius = world.particleSystems[0].radius
    for (var i = 0; i < count; i++) {
        particlesContainer.addChild(makeSprite(2 * radius, 2 * radius, 'assets/images/Circle.png'))
    }
    $('#particlesCount').text(`Particles: ${world.particleSystems[0].GetParticleCount() / 2}`)
}

