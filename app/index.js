var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#myholder'),
    width: 600,
    height: 600,
    model: graph,
    gridSize: 20,
    drawGrid: {
        name: "doubleMesh",
        args: [
            { color: "#333333" },
            { color: "#BBBBBB" }
        ]

    }
});

var rect = new joint.shapes.devs.Model({
    position: { x: 100, y: 30 },
    size: { width: 100, height: 50 },
    attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } },
    inPorts: ["A", "B"],
    outPorts: ["C", "D"]

});

var rect2 = rect.clone();
//rect2.translate(300);

var link1 = new joint.dia.Link({
    source: { id: rect.id, port: "A" },
    target: { id: rect2.id, port: "D" },
    router: { name: "manhattan" }
});

link1.label(0, {
    position: .5,
    attrs: {
        rect: { fill: 'white' },
        text: { fill: 'blue', text: 'my label' }
    }
});

var link2 = new joint.dia.Link({
    source: { id: rect.id, port: "C" },
    target: { id: rect2.id, port: "B" },
    router: { name: "manhattan" }
});

graph.addCells([rect, rect2, link1, link2]);

var bbox = joint.layout.DirectedGraph.layout(graph, {
    nodeSep: 50,
    edgeSep: 80,
    rankDir: "LR",
    marginX: 80,
    marginY: 80
})