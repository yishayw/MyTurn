
Ext.define('testing.controller.CreateGroup', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            createGroupButton: { tap: "doCreateGroup" },
            submitButton: { tap: 'doSubmitNewGroup' },
            cancelButton: { tap: 'doCancelNewGroup' }
        },
        refs: {
            submitButton: "button[action=submitNewGroup]",
            cancelButton: "button[action=cancelNewGroup]",
            createGroupButton: "button[action=createGroupEvent]",
            createGroupForm: 'createGroupView',
            groupNameTextField: '#createGroupTextfield'
        }
    },

    doCreateGroup: function () {
    	var createGroup = this.getCreateGroupForm();
    	if (!createGroup) {
	        createGroup = Ext.create('testing.view.CreateGroup', {
	            modal: true,
	            hideOnMaskTap: true,
	            centered: true,
	            /*height: '70%',*/
	            /*width: '70%',*/
	            minHeight: 280,
	            minWidth: 300,
	            margin: '0 0 0 0'
	        });
	        Ext.Viewport.add([createGroup]);
    	} else {
    		this.getGroupNameTextField().setValue("");
    	}
        createGroup.show();
    },

    doCancelNewGroup: function() {
        this.getCreateGroupForm().hide();
    },

    doSubmitNewGroup: function() {
        var values = this.getCreateGroupForm().getValues();
        var name = values['name'];
        var groups = Ext.getStore('groups');
        // validate
        if(groups.findExact('name', name) != -1) {
            Ext.Msg.alert('', 'Group ' + name + ' already exists');
            this.getGroupNameTextField().setValue("");
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