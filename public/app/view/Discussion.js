Ext.define("testing.view.Discussion", {
    extend: 'Ext.Container',
    xtype: 'discussionView',
    requires: ['Ext.Button', 'Ext.Label', 'Ext.Audio'],
    layout: {
        type: 'vbox'
    },
    config: {
        padding: '10px',
        items: [
            {
                xtype: 'audio',
                hidden: true,
                id: 'beeper',
                url: 'resources/sounds/beep.mp3'
            },
            {
                xtype: 'label',
                id: 'messageLabel',
                align: 'middle',
                style: "text-align: center; background-color: #878787; font-size: larger",
                html: 'Waiting for New Speaker'
            },
            {
                xtype: 'button',
                centered: true,
                action: 'addToQueueEvent',
                height: '50%',
                width: '50%',
                text: 'Request to speak'
            }
        ]
    }
});