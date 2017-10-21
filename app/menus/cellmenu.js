Foundation.ContextMenu.prototype.addConfig('cellmenu', {
    accessible: true,
    single: true,
    structure: [{
        text: 'Add input pin',
        click: function ($item) {
            var cell = graph.getCell($item.attr('model-id'));
            cell.addInPort("R");
            var heightSlots = Math.max(cell.attributes.inPorts.length, cell.attributes.outPorts.length);
            cell.resize(100, heightSlots * 25);
        }
    }, {
        text: 'Add output pin',
        click: function ($item) {
            alert('Sending a mail!');
        }
    }, {
        cssClass: 'divider'
    }, {
        text: 'More...',
        children: [{
            text: 'Delete'
        }, {
            text: 'Download...',
            children: [{
                text: 'Save as PDF'
            }, {
                text: 'Save as PNG'
            }]
        }]
    }]
});

function addContextMenus() {
    $(".joint-cell").attr("data-context-menu", "cellmenu");
    $(".joint-cell").foundation();
}