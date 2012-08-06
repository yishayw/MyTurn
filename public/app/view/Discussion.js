Ext.define("testing.view.Discussion", {
    extend: 'Ext.Container',
    xtype: 'discussionView',
    requires: ['Ext.Button', 'Ext.Label'],
    layout: {
        type: 'vbox'
    },
    config: {
        padding: '10px',
        items: [
        {
            xtype: 'label',
            id: 'messageLabel',
            align: 'middle',
            style: "text-align: center; background-color: #878787; font-size: larger",
            html: 'Messages go here'
        },
        {
            xtype: 'button',
            centered: true,
            action: 'addToQueueEvent',
            text: 'Request to speak'
        }
        ]
    }
});