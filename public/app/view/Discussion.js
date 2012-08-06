Ext.define("testing.view.Discussion", {
    extend: 'Ext.Container',
    xtype: 'discussionView',
    requires: ['Ext.Button'],
    config: {
        items: [
        {
            xtype: 'button',
            action: 'addToQueueEvent',
            text: 'Request to speak'
        }
        ]
    }
});