const { dialog } = require('electron').remote
const fs = require('fs');

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
autoLayout();

document.querySelector("#import").addEventListener("click", importGraph);
document.querySelector("#export").addEventListener("click", exportGraph);
document.querySelector("#auto-layout").addEventListener("click", autoLayout);

function importGraph() {
    var targetFile = dialog.showOpenDialog({ properties: ['openFile'] });
    if (targetFile) {
        var json = fs.readFileSync(targetFile[0]);
        graph.fromJSON(JSON.parse(json));
    }
}

function exportGraph() {

    var targetFile = dialog.showSaveDialog();
    if (targetFile) {
        var json = JSON.stringify(graph);
        fs.writeFileSync(targetFile, json);
    }

}

function autoLayout() {
    joint.layout.DirectedGraph.layout(graph, {
        nodeSep: 50,
        edgeSep: 80,
        rankDir: "LR",
        marginX: 80,
        marginY: 80
    })
}