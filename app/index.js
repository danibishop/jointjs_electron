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
    markAvailable: true,
    linkPinning: false,
});


paper.on('cell:contextmenu', function (cellView, evt, x, y) {
    showCellmenu(cellView, x, y);
})

paper.on('blank:pointerclick', function (evt, x, y) {
    hideCellmenu();
})

var cellWithMenu = undefined;
function setCellWithMenu(cellView) {
    var id = cellView.attributes()['model-id'];
    cellWithMenu = graph.getCell(id);
}

function showCellmenu(cellView, x, y) {
    setCellWithMenu(cellView);
    $('#cellmenu').css({
        top: y,
        left: x
    }).show();
}

function hideCellmenu() {
    cellWithMenu = undefined;
    $('#cellmenu').hide();
}

function resizeCellToPorts() {
    var heightSlots = Math.max(cellWithMenu.attributes.inPorts.length, cellWithMenu.attributes.outPorts.length);
    cellWithMenu.resize(100, heightSlots * 25);
}

function addInput() {
    if (cellWithMenu) {
        var randomName = Math.random().toString(36).substring(7);
        cellWithMenu.addInPort(randomName);
        resizeCellToPorts();
        hideCellmenu();
    }
}

function addOutput() {
    if (cellWithMenu) {
        var randomName = Math.random().toString(36).substring(7);
        cellWithMenu.addOutPort(randomName);
        resizeCellToPorts();
        hideCellmenu();
    }
}

function validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) return false;

    // Prevent linking in2in or out2out
    if (magnetS && magnetT && magnetS.getAttribute('port-group') === magnetT.getAttribute('port-group')) return false;

    // Prevent multiple links for the same connection
    if (graph.getLinks().find((x) => {
        return (x.attributes.source.id == cellViewS.model.id &&
            x.attributes.target.id == cellViewT.model.id &&
            x.attributes.source.port == magnetS.attributes.port.value &&
            x.attributes.target.port == magnetT.attributes.port.value)
    })) return false;
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
hideCellmenu();
document.querySelector("#auto-layout").addEventListener("click", autoLayout);
document.querySelector("#add-input").addEventListener("click", addInput);
document.querySelector("#add-output").addEventListener("click", addOutput);
resizePaper();
window.onresize = resizePaper;
$(document).foundation();