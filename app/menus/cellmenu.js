Foundation.ContextMenu.prototype.addConfig('cellmenu', {
    accessible: true,
    single: true,
    structure: [{
        text: 'Move to',
        help: 'Alt + M',
        key: 'ALT_M',
        click: function ($item) {
            var cell = graph.getCell($item.attr('model-id'));
            console.log(cell);
        }
    }, {
        icon: 'fa fa-paper-plane',
        text: 'Send via mail',
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