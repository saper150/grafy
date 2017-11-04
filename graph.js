import { Circle, JointLine, WorldElement } from './worldElements'

export class Graph {
    constructor(vertexCount) {
        this.mat = Array.from(Array(vertexCount).keys())
            .map(y => Array(vertexCount).fill(0))
        this.edgeObjects = []
    }

    static random(vertexCount, edgeChance) {
        const graph = new Graph(vertexCount)
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
            this.vertices.push(new Circle([x, y], 0.1, 0xff0000, { index: ++index }))
        }
        this.createEdges(this.vertices)
    }

    createEdges(vertices) {
        for (const [a, b] of this.edges()) {
            this.edgeObjects.push(new JointLine([vertices[a].body, vertices[b].body], 2, 0.1, 1, 0.01, 0xffffff))
        }
    }

    recreateEdges(){
        for(let joint of this.edgeObjects){
            joint.destroy()
        }
        this.edgeObjects = []
        this.createEdges(this.vertices)
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

}
