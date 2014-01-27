var browser = {
	canvas: null,
	context: null,

	setIcon: function (text) {
		if (!this.canvas) {
			console.log('creating canvas');
			this.canvas = document.createElement('canvas');
			this.canvas.height = 19;
			this.canvas.width = 19;
			this.context = this.canvas.getContext('2d');
		}

		console.log('setting icon with ' + this.canvas.height + " x " + this.canvas.width);

		this.context.font = 'bold 10pt Courier New';
		this.context.fillText(text, 0, 14);

		var imageData = this.context.getImageData(0, 0, 19, 19);
		chrome.browserAction.setIcon({ imageData: imageData });
		chrome.browserAction.setTitle({ title: text });
	}
};

function onAlarm() {
	console.log('alarm!');
	browser.setIcon('77');
}

chrome.runtime.onInstalled.addListener(function () {
	console.log('runtime installed');
	chrome.alarms.onAlarm.addListener(onAlarm);
	chrome.alarms.create('refresh', { periodInMinutes: 1 });

	browser.setIcon('55');
});