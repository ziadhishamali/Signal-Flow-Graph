// Initialise sigma:
var s = new sigma(
    {
        renderer: {
            container: document.getElementById('sigma-container'),
            type: 'canvas'
        },
        settings: {
            edgeLabelSize: 'proportional',
            minArrowSize: 12
        }
    }
);

// Generate a random graph:
var nbNode = 8;
var nbEdge = 13;
var graph = {
    nodes: [],
    edges: []
};
graph.nodes.push({
    id: 1,
    x: 80,
    y: 300,
    size: 8
});

graph.nodes.push({
    id: 2,
    x: 150,
    y: 300,
    size: 5
});

graph.nodes.push({
    id: 3,
    x: 115,
    y: 50,
    size: 2
});
////////////////////////////////
graph.edges.push({
    id: 1,
    source: 1,
    target: 2,
    color: '#000000',
    type: 'curvedArrow',
    label: 'first'
});

graph.edges.push({
    id: 2,
    source: 2,
    target: 3,
    color: '#000000',
    type: 'curvedArrow',
    label: 'second'
});

graph.edges.push({
    id: 3,
    source: 1,
    target: 3,
    color: '#000000',
    type: 'curvedArrow',
    label: 'third'
});


// load the graph
s.graph.read(graph);
// draw the graph
s.refresh();
// launch force-atlas for 5sec
/*s.startForceAtlas2();
window.setTimeout(function() {s.killForceAtlas2()}, 0);*/