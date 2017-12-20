import $ from 'jquery'
import { Graph } from "./graph";


let graphs = []


function spawnGraph() {
    destroyGraphs()
    const vertices = parseInt($('#inputGraphVertices').val())
    const prob = parseFloat($('#inputGraphProb').val())
    const radius = parseFloat($('#inputGraphRadius').val())
    const length = parseFloat($('#inputGraphLength').val())
    let graph = Graph.random(vertices, prob,
        {
            createTable: true,
            buttonName: 'buttonShowHideTable',
            color: 0xff0000,
            radius: radius,
            length: length
        })
    graphs.push(graph)
    graphs.forEach(g => g.spawn())
    $('#buttonDFScreate').attr('disabled', false)
    $('#buttonBFScreate').attr('disabled', false)
    $('#buttonColoring').attr('disabled', false)
    $('#buttonShowHideTable').attr('disabled', false)
}

function destroyGraphs() {
    graphs.forEach(g => g.destroy())
    graphs = []

    $('#buttonDFScreate').attr('disabled', true)
    $('#buttonBFScreate').attr('disabled', true)
    $('#buttonColoring').attr('disabled', true)
    $('#buttonGraphSearchClear').attr('disabled', true)
    $('#buttonShowHideTable').attr('disabled', true)
    
}

function spawnDFS(){
    let dfs = graphs[0].DFS() 
    graphs.push(dfs)
    dfs.spawn()
    $('#buttonDFScreate').attr('disabled', true)
    $('#buttonGraphSearchClear').attr('disabled', false)
    
}

function spawnBFS(){
    let bfs = graphs[0].BFS() 
    graphs.push(bfs)
    bfs.spawn()
    $('#buttonBFScreate').attr('disabled', true)
    $('#buttonGraphSearchClear').attr('disabled', false)
    
}

function clearSearches(){
    $('#buttonDFScreate').attr('disabled', false)
    $('#buttonBFScreate').attr('disabled', false)
    $('#buttonColoring').attr('disabled', false)
    $('#buttonGraphSearchClear').attr('disabled', true)
    graphs.splice(1).forEach(g => g.destroy())
}

function graphColoring(){
    graphs[0].coloring()
}

export function graphButtonsSetup() {
    $('#buttonSpawnGraph').click(spawnGraph)
    $('#buttonDestroyGraph').click(destroyGraphs)
    $('#buttonDFScreate').click(spawnDFS)
    $('#buttonBFScreate').click(spawnBFS)
    $('#buttonGraphSearchClear').click(clearSearches)
    $('#buttonGraphSearchClear').attr('disabled', true)
    $('#buttonColoring').click(graphColoring)
    $('#buttonDFScreate').attr('disabled', true)
    $('#buttonBFScreate').attr('disabled', true)
    $('#buttonColoring').attr('disabled', true)
}

export function updateGraphs(){
    graphs.forEach(g => g.tick())
}