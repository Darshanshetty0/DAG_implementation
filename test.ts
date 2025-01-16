//Interface vertex is created.
interface Vertex {
  id: string;
  data: any;
}

//Interface Edge uses Vertex
interface Edge {
  coming: Vertex;
  to: Vertex;
}

class DAG {
  private vertices: Vertex[] = [];
  private edges: Edge[] = [];

  // Adding a new vertex
  addVertex(vertex: Vertex): void {
    if (this.vertices.some(v => v.id === vertex.id)) {
      console.error(`Vertex with id '${vertex.id}' already exists.`);
      return;
    }
    this.vertices.push(vertex);
    console.log(`Vertex added: ${JSON.stringify(vertex)}`);
  }

  // Adding a new edge
  addEdge(fromVertexId: string, toVertexId: string): void {
    const fromVertex = this.vertices.find(v => v.id === fromVertexId);
    const toVertex = this.vertices.find(v => v.id === toVertexId);
  
    if (!fromVertex || !toVertex) {
      throw new Error(`Cannot add edge: One or both vertices not found (from: '${fromVertexId}', to: '${toVertexId}').`);
    }
  
    // Check if adding this edge creates a cycle
    if (this.isCyclic(fromVertex)) {
      throw new Error('Cannot add edge: Cycle detected.');
    }
    
    //push the edge if the right conditions are met
    this.edges.push({ coming: fromVertex, to: toVertex });
    console.log(`Edge added: from '${fromVertexId}' to '${toVertexId}'`);
  }
  
  private isCyclic(comingVertex: Vertex, visited: Set<string> = new Set(), recStack: Set<string> = new Set()): boolean {
    if (recStack.has(comingVertex.id)) {
      // If the vertex is in the recursion stack, we detect a cycle and return true
      return true;
    }
  
    if (visited.has(comingVertex.id)) {
      // If the vertex is already visited and not in the recursion stack there is no need to check again
      return false;
    }
  
    // Mark the current vertex as visited and add it to the recursion stack
    visited.add(comingVertex.id);
    recStack.add(comingVertex.id);
  
    // Check all the outgoing edges of the current vertex by filtering the edges
    const outgoingEdges = this.edges.filter(edge => edge.coming.id === comingVertex.id);
  
    for (const edge of outgoingEdges) {
      if (this.isCyclic(edge.to, visited, recStack)) {
        return true;  // If a cycle is detected, return true
      }
    }
  
    // Remove the vertex from the recursion stack after processing all its neighbors
    recStack.delete(comingVertex.id);
  
    return false;  // If no cycle is detected, return false
  }

  // Display the graph
  displayGraph(): void {
    console.log('Vertices:', this.vertices);
    console.log('Edges:', this.edges);
  }
}

// Example usage
const dag = new DAG();
const vertexA: Vertex = { id: 'A', data: {} };
const vertexB: Vertex = { id: 'B', data: {} };
const vertexC: Vertex = { id: 'C', data: {} };

dag.addVertex(vertexA);
dag.addVertex(vertexB);
dag.addVertex(vertexC);

dag.addEdge('A', 'B');
dag.addEdge('B', 'C');

try {
  dag.addEdge('C', 'A');
} catch (error) {
  console.error('Error adding edge:', error); //! This part of the code is supposed to throw error. But it does not and yet implements a cycle
}


dag.displayGraph();
