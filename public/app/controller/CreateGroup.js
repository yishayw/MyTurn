
Ext.define('testing.controller.CreateGroup', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            submitButton: { tap: 'doSubmitNewGroup' }
        },
        refs: {
            submitButton: "button[action=submitNewGroup]",
            createGroupForm: 'createGroupView',
            groupNameTextField: '#createGroupTextfield'
        }
    },

    doSubmitNewGroup: function() {
        var values = this.getCreateGroupForm().getValues();
        var name = values['name'];
        var groups = Ext.getStore('groups');
        // validate
        if(groups.findExact('name', name) != -1) {
            Ext.Msg.alert('', 'Group ' + name + ' already exists');
            this.getGroupNameTextField().value = "";
            return;
        }
        // store
        var group = Ext.create('testing.model.Group', values);
        var data = group.data;
        // convert minutes
        data.discussionLength = data.discussionLength * 60 * 1000;
        // convert seconds
        data.turnLength = data.turnLength * 1000;
        groups.add(group);
        groups.sync();
        this.getCreateGroupForm().hide();
    }
});