var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    defaultRouter: { name: "manhattan" },
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

    },
    validateConnection: validateConnection,
    linkPinning: false
});

function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) return false;
    // Prevent linking outputs
    if (magnetS.getAttribute('port-group') === 'out' && magnetT.getAttribute('port-group') === 'out') return false;
    return true;
}

var rect = new joint.shapes.devs.Model({
    position: { x: 100, y: 30 },
    size: { width: 100, height: 50 },
    attrs: { rect: { fill: 'blue' }, text: { text: 'Model A', fill: 'white' } },
    inPorts: ["A", "B"],
    outPorts: ["C", "D"]
});

var rect2 = new joint.shapes.devs.Model({
    position: { x: 100, y: 30 },
    size: { width: 100, height: 50 },
    attrs: { rect: { fill: 'green' }, text: { text: 'Model B', fill: 'white' } },
    inPorts: ["A", "B"],
    outPorts: ["C", "D"]
});

var link1 = new joint.dia.Link({
    source: { id: rect.id, port: "A" },
    target: { id: rect2.id, port: "D" }

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

function runningInElectron() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf(' electron/') > -1;
}

if (runningInElectron()) {
    // Electron-specific code
    const { dialog } = require('electron').remote
    const fs = require('fs');

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

    document.querySelector("#import").addEventListener("click", importGraph);
    document.querySelector("#export").addEventListener("click", exportGraph);
} else {
    document.querySelector("#import").setAttribute("disabled", true);
    document.querySelector("#export").setAttribute("disabled", true);
}

document.querySelector("#auto-layout").addEventListener("click", autoLayout);
resizePaper();



function autoLayout() {
    joint.layout.DirectedGraph.layout(graph, {
        nodeSep: 50,
        edgeSep: 80,
        rankDir: "LR",
        marginX: 80,
        marginY: 80
    })
}

function resizePaper(event) {
    $("#container").height(document.documentElement.clientHeight - 100);
    $('#myholder').width($("#container").width());
    $('#myholder').height($("#container").height());
    paper.setDimensions($('#myholder').width(), $('#myholder').height());

};

window.onresize = resizePaper;

$(document).foundation();