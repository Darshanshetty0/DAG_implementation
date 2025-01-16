"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DAG = /** @class */ (function () {
    function DAG() {
        this.vertices = [];
        this.edges = [];
    }
    // Add a new vertex
    DAG.prototype.addVertex = function (vertex) {
        if (this.vertices.some(function (v) { return v.id === vertex.id; })) {
            console.error("Vertex with id '".concat(vertex.id, "' already exists."));
            return;
        }
        this.vertices.push(vertex);
        console.log("Vertex added: ".concat(JSON.stringify(vertex)));
    };
    // Add a new edge
    DAG.prototype.addEdge = function (fromVertexId, toVertexId) {
        var fromVertex = this.vertices.find(function (v) { return v.id === fromVertexId; });
        var toVertex = this.vertices.find(function (v) { return v.id === toVertexId; });
        if (!fromVertex || !toVertex) {
            throw new Error("Cannot add edge: One or both vertices not found (from: '".concat(fromVertexId, "', to: '").concat(toVertexId, "')."));
        }
        // Check if adding this edge creates a cycle
        if (this.isCyclic(fromVertex)) {
            throw new Error('Cannot add edge: Cycle detected.');
        }
        this.edges.push({ coming: fromVertex, to: toVertex });
        console.log("Edge added: from '".concat(fromVertexId, "' to '").concat(toVertexId, "'"));
    };
    DAG.prototype.isCyclic = function (startVertex) {
        var visited = new Set();
        var recStack = new Set();
        var stack = [];
        // Start the DFS with the initial vertex
        stack.push(startVertex);
        var _loop_1 = function () {
            var currentVertex = stack.pop();
            // If the vertex is in the recursion stack, we've detected a cycle
            if (recStack.has(currentVertex.id)) {
                return { value: true };
            }
            // If the vertex hasn't been visited yet, process it
            if (!visited.has(currentVertex.id)) {
                visited.add(currentVertex.id);
                recStack.add(currentVertex.id);
                // Push all the outgoing edges' destination vertices onto the stack
                var outgoingEdges = this_1.edges.filter(function (edge) { return edge.coming.id === currentVertex.id; });
                for (var _i = 0, outgoingEdges_1 = outgoingEdges; _i < outgoingEdges_1.length; _i++) {
                    var edge = outgoingEdges_1[_i];
                    stack.push(edge.to);
                }
            }
            else {
                // If the vertex has been visited, remove it from the recursion stack
                recStack.delete(currentVertex.id);
            }
        };
        var this_1 = this;
        while (stack.length > 0) {
            var state_1 = _loop_1();
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return false; // If no cycle is detected, return false
    };
    // Display the graph
    DAG.prototype.displayGraph = function () {
        console.log('Vertices:', this.vertices);
        console.log('Edges:', this.edges);
    };
    return DAG;
}());
// Example usage
var dag = new DAG();
var vertexA = { id: 'A', data: {} };
var vertexB = { id: 'B', data: {} };
var vertexC = { id: 'C', data: {} };
dag.addVertex(vertexA);
dag.addVertex(vertexB);
dag.addVertex(vertexC);
dag.addEdge('A', 'B');
dag.addEdge('B', 'C');
try {
    dag.addEdge('C', 'A');
}
catch (error) {
    console.error('Error adding edge:', error);
}
dag.displayGraph();
