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