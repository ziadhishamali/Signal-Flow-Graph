function NodeC(name, id) {

    this.name = name;
    this.id = id
    this.edges = [];

    this.addEdge = function (edge) {
        this.edges.push(edge);
    };
}