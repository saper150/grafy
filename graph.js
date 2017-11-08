import { Circle, JointLine, WorldElement } from './worldElements'
import { GraphTable } from './UItables'
import {htmlUtilis} from './htmlUtilis'

export class Graph {

    constructor(vertexCount, options) {
        this.mat = Array.from(Array(vertexCount).keys())
            .map(y => Array(vertexCount).fill(0))
        this.edgeObjects = []
        this.color = 0xff0000
        if (options) {
            if (options.createTable)
                this.createTable(options.buttonName)
            if (options.color)
                this.color = options.color
        }
    }

    createTable(buttonName) {
        this.table = new GraphTable('AdjTable', this)
        this.showTable = true
        let button = document.getElementById(buttonName)
        button.onclick = () => {
            this.showTable = !this.showTable
            button.firstChild.data = htmlUtilis.twoStateName(this.showTable, 'Show', 'Hide', 'table')
            if (this.showTable)
                this.table.hideTable()
            else
                this.table.showTable()
        }

        let connectivityDiv = document.getElementById('graphIsConnected')
        document.getElementById('buttonConnectivity').onclick = () => connectivityDiv.innerHTML = `is connected: ${this.isGraphConnected()}`
    }

    static random(vertexCount, edgeChance, options) {
        const graph = new Graph(vertexCount, options)
        for (let i = 0; i < vertexCount; i++) {
            for (let j = i + 1; j < vertexCount; j++) {
                if (Math.random() <= edgeChance) graph.addEdge(i, j)
            }
        }
        return graph
    }

    addEdge(a, b) {
        this.mat[a][b] = 1
        this.mat[b][a] = 1
    }

    spawn() {
        let index = 0
        this.vertices = []
        for (let i = 0; i < Math.PI * 2; i += Math.PI * 2 / this.mat.length) {
            const x = (Math.sin(i) * 1.3) + 0
            const y = (Math.cos(i) * 1.3) + 0
            this.vertices.push(new Circle([x, y], 0.14, this.color, { index: ++index }))
        }
        this.createEdges(this.vertices)
    }

    tick() {
        for (const pNode of this.vertices) {
            for (const pNode2 of this.vertices) {
                if (pNode === pNode2) continue
                let diff = new b2Vec2
                b2Vec2.Sub(diff, pNode.body.GetPosition(), pNode2.body.GetPosition())
                let normalized = new b2Vec2
                b2Vec2.Normalize(normalized, diff)
                let final = new b2Vec2
                b2Vec2.MulScalar(final, normalized, 0.3 / diff.LengthSquared())
                pNode.body.ApplyForceToCenter(final)
            }
        }
    }

    createEdges(vertices) {
        for (const [a, b] of this.edges()) {
            this.edgeObjects.push(new JointLine([vertices[a].body, vertices[b].body], 2, 0.1, 1, 0.01, 0xffffff))
        }
    }

    recreateEdges() {
        for (let joint of this.edgeObjects) {
            joint.destroy()
        }
        this.edgeObjects = []
        this.createEdges(this.vertices)
    }


    neighbours(node) {
        return this.mat[node].map((x, index) => [x, index])
            .filter(([x]) => x)
            .map(([x, index]) => index)
    }

    edges() {
        const result = []
        for (let i = 0; i < this.mat.length; i++) {
            for (let j = i + 1; j < this.mat.length; j++) {
                if (this.mat[i][j] === 1) result.push([i, j])
            }
        }
        return result
    }

    //Depth-first search
    DFS() {
        const visited = new Set()
        const searchTree = new Graph(this.mat.length, {color: 0x00ff00})
        const $inner = root => {
            visited.add(root)
            for (const neighbour of this.neighbours(root)) {
                if (visited.has(neighbour)) continue
                searchTree.addEdge(root, neighbour)
                $inner(neighbour)
            }
        }
        $inner(0)
        return searchTree
    }


    BFS() {
        const visited = new Set([0])
        const searchTree = new Graph(this.mat.length, {color: 0xffff00})
        const queue = [0]

        while (queue.length) {
            const current = queue.shift()
            for (const neighbour of this.neighbours(current)) {
                if (visited.has(neighbour)) {
                    continue
                }
                visited.add(neighbour)
                searchTree.addEdge(current, neighbour)
                queue.push(neighbour)
            }
        }
        return searchTree
    }

    isGraphConnected() {
        let neighbours = new Set()

        let checkVertex = (i) => {
            for (let j = 0; j < this.mat[i].length; j++) {
                if (this.mat[i][j] === 1) {
                    if (!neighbours.has(j)) {
                        neighbours.add(j)
                        checkVertex(j)
                    }
                }
            }
        }
        neighbours.add(0)
        checkVertex(0)
        return (neighbours.size === this.mat[0].length)
    }
}

