
Ext.define('testing.controller.Discussion', {
    extend: 'Ext.app.Controller',
    requires: [
    	'testing.util.UrlUtils',
    	'testing.util.TimeUtils', 
    	'Ext.device.Notification'
    ],
    config: {
    	beepUrl: 'resources/sounds/beep.mp3',
    	tickUrl: 'resources/sounds/tick.mp3',
	    nativeTickSound: null,
	    nativeBeepSound: null,
        refs: {
        	discussionView: 'discussionView',
            addToQueueButton: "button[action=addToQueueEvent]",
            messageLabel: "#messageLabel",
            timeRemainingLabel: "#timeRemainingLabel",
            beepSound: "#beeper",
            tickSound: "#ticker"
        }
    },

    doAddToQueue: function () {
        this.getApplication().fireEvent('clientMessage', { type: 'requestToSpeak' });
    },

    doRemoveFromQueue: function () {
        this.getApplication().fireEvent('clientMessage', { type: 'relinquishTurn' });
    },

    doDiscussionOver: function (data) {
        Ext.Msg.alert('', 'The discussion is over.');
        // a group was deleted on server, time to reload
        Ext.getStore('groups').load();
    },

    doUsersSaved: function(data) {
       this.clearTick();
       this.initMessageScreen();
    },

    doNewSpeaker: function (data) {
        this.getMessageLabel().setHtml('Current speaker is ' + data.name);
        this.doUpdateTimeRemaining(data);
        if (this.getUserName() != data.name) {
            this.clearTick();
        }
    },

    doWaitingForNewSpeaker: function (data) {
        this.getMessageLabel().setHtml('Waiting for New Speaker');
        this.doUpdateTimeRemaining(data);
        this.doBeep();
        this.clearTick();
    },

    getUserName: function () {
        var users = Ext.getStore('defaultUsers');
        if (users.getCount() == 1) {
            return users.getAt(0).get('name');
        }
        return null;
    },

    initMessageScreen: function () {
        this.getMessageLabel().setHtml('Waiting for New Speaker');
        this.getTimeRemainingLabel().setHtml('');
    },

    clearTick: function () {
        if (this.tickSoundInterval) {
            clearInterval(this.tickSoundInterval);
            this.tickSoundInterval = null;
        }
    },

    doMyTurn: function (data) {
        if (this.tickSoundInterval) {
            return;
        }
        this.doBeep();
        var context = this;
        this.clearTick();
        this.tickSoundInterval = setInterval(function () {
            context.doTick();
        }, 1000);
    },
    
	crossPlatformPlay: function(soundObject) {
        if (EnvUtils.isNative()) {
        	var soundSrc = soundObject.getUrl();
        	var url = testing.util.UrlUtils.getBaseUrl() + soundSrc;
        	var media = new Media(
        		url, 
        		function() {}, 
        		function(err) { 
        			Ext.Msg.alert('media error: ' + err.message);
        		}
        	);
        	media.play();
        } else {
        	soundObject.play();
        }
	},
	
    doBeep: function() {
    	if (EnvUtils.isNative()) {
    		this.getNativeBeepSound().play();
    	} else {
    		this.crossPlatformPlay(this.getBeepSound());
    	}
    	if (EnvUtils.isNative() && Ext.os.is('Android'))
    	{
       		Ext.device.Notification.vibrate();
    	}
    },
    
    doTick: function () {
    	if (EnvUtils.isNative()) {
    		this.getNativeTickSound().play();
    	} else {
    		this.crossPlatformPlay(this.getTickSound());
    	}
    },

    doUpdateTimeRemaining: function (data) {
        var formattedTime = testing.util.TimeUtils.getFormattedTime(data.timeLeft);
        this.getTimeRemainingLabel().setHtml(formattedTime);
    },

    init: function () {
        this.getApplication().on({
            discussionOver: this.doDiscussionOver,
            usersSaved: this.doUsersSaved,
            newSpeaker: this.doNewSpeaker,
            yourTurn: this.doMyTurn,
            waitingForNewSpeaker: this.doWaitingForNewSpeaker,
            cordovaLoaded: this.doCordovaLoaded,
            scope: this
        });
    },

    launch: function () {
    	var button = this.getAddToQueueButton();
    	// temp fix to android context menu on images
    	if (EnvUtils.isNative() || !Ext.os.is('Android')) {
    		button.setText('');
    		button.setStyle('backgroundImage: url(resources/images/icons/myturn-logo.png); ' +
                		'backgroundRepeat: no-repeat; backgroundPosition: center; background-size: contain');
    	}
        button.element.on({
            touchstart: 'doAddToQueue',
            touchend: 'doRemoveFromQueue',
            scope: this
        });
        this.initMessageScreen();
        if (!EnvUtils.isNative()) {
        	var discussionView = this.getDiscussionView();
        	discussionView.add({
                xtype: 'audio',
                hidden: true,
                id: 'beeper',
                url: this.getBeepUrl()
            });
        	discussionView.add({
                xtype: 'audio',
                hidden: true,
                id: 'ticker',
                url: this.getTickUrl()
            });
        }
        this.doCordovaLoaded();
    },
    
    doCordovaLoaded: function() {
        if (!EnvUtils.isNative()) {
        	return;
        }
        // set media objects for native apps
        var tickUrl = testing.util.UrlUtils.getBaseUrl() + this.getTickUrl();
        var beepUrl = testing.util.UrlUtils.getBaseUrl() + this.getBeepUrl();
        var tickMedia = new Media(
    		tickUrl, 
    		function() {}, 
    		function(err) { 
    			//Ext.Msg.alert('tick media error: ' + err.message);
    		}
    	);
        var beepMedia = new Media(
    		beepUrl, 
    		function() {}, 
    		function(err) { 
    			//Ext.Msg.alert('beep media error: ' + err.message);
    		}
    	);
    	this.setNativeTickSound(tickMedia);
    	this.setNativeBeepSound(beepMedia);
    	// first plays are slow so we do this at launch
    	tickMedia.play();
    	beepMedia.play();
    	Ext.destroy(this.getTickSound());
    	Ext.destroy(this.getBeepSound());
    }
});