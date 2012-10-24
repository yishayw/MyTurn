Ext.define("testing.view.Discussion", {
    extend: 'Ext.Container',
    xtype: 'discussionView',
    requires: ['Ext.Button', 'Ext.Label', 'Ext.Audio', 'testing.view.UserReport'],
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
                xtype: 'audio',
                hidden: true,
                id: 'ticker',
                url: 'resources/sounds/tick.mp3'
            },
            {
                xtype: 'container',
                layout: 'vbox',
                style: "background-color: #878787; font-size: larger",
                items: [
                    {
                        xtype: 'label',
                        id: 'timeRemainingLabel'
                    },
                   {
                        xtype: 'label',
                        id: 'messageLabel',
                        html: 'Waiting for New Speaker'
                    }
                ]
            },
            {
                xtype: 'button',
                centered: true,
                action: 'addToQueueEvent',
                height: '50%',
                width: '50%',
                text: 'My turn'
            },
         ]
    }
});