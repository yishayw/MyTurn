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
                type: 'container',
                layout: 'hbox',
                style: "background-color: #878787; font-size: larger",
                items: [
                   {
                        xtype: 'label',
                        id: 'messageLabel',
                        centered: true,
                        html: 'Waiting for New Speaker'
                    },
                    {
                        xtype: 'label',
                        id: 'timeRemainingLabel',
                        docked: 'left'
                    },
                ]
            },
             {
                xtype: 'button',
                centered: true,
                action: 'addToQueueEvent',
                height: '50%',
                width: '50%',
                text: 'My turn'
            }
         ]
    }
});