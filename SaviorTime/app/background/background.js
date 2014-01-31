var browser = {
	canvas: null,
	context: null,

	setIcon: function (text) {
		text = text || "";

		if (!this.canvas) {
			this.canvas = document.createElement('canvas');
			this.canvas.height = 19;
			this.canvas.width = 19;
			this.context = this.canvas.getContext('2d');
		}

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var color = this.calculateColor(text) || 'transparent';
		this.context.fillStyle = color;

		// Set faux rounded corners
		var cornerRadius = 5;
		this.context.lineJoin = "round";
		this.context.lineWidth = cornerRadius;
		this.context.strokeStyle = color;

		// Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
		this.context.strokeRect((cornerRadius / 2), (cornerRadius / 2), this.canvas.width - cornerRadius, this.canvas.height - cornerRadius);
		this.context.fillRect((cornerRadius / 2), (cornerRadius / 2), this.canvas.width - cornerRadius, this.canvas.height - cornerRadius);

		this.context.font = 'bold 10pt Courier New';
		this.context.fillStyle = '#e9e9e9';

    var textWidth = this.context.measureText(text).width;
		this.context.fillText(text, (this.canvas.width / 2) - (textWidth / 2), 14);

		var imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		chrome.browserAction.setIcon({ imageData: imageData });
		chrome.browserAction.setTitle({ title: "" + text });
	},

	readDashboard: function () {
		// TODO rescuetime has an API. let's use it
		$.get('https://www.rescuetime.com/dashboard/for/the/day/of/today', function (data) {
			var pulse = $('.productivity-score-chart', data);
			var score = $(pulse).data('productivity-score');
			browser.setIcon(score);
		});
	},

	calculateColor: function(value) {
		if (value < 0 || value >= 100)
			return null;

		var r1 = Math.floor(207 - 1.945 * value).toString(16);
		var g1 = Math.floor(40 + .825 * value).toString(16);
		var b1 = Math.floor(16 + 1.875 * value).toString(16);

		var r = ('0' + r1).substr(-2);
		var g = ('0' + g1).substr(-2);
		var b = ('0' + b1).substr(-2);

		return '#' + r + g + b;
	}

};

function onAlarm() {
	browser.readDashboard();
}

chrome.runtime.onInstalled.addListener(function () {
	chrome.alarms.onAlarm.addListener(onAlarm);
	chrome.alarms.create('refresh', { periodInMinutes: 1 });
	browser.readDashboard();
});