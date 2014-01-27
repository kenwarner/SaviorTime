var savior = {
	SALVATION_FREQUENCY: 1000 * 3,

	readDashboard: function() {
		console.log('reading dashboard');

		$.get('http://rescuetime.com/dashboard', function (data) {
			var pulse = $('.productivity-score-chart', data);
			var score = $(pulse).data('productivity-score');

			$('#savior-pulse').html(score);
			chrome.browserAction.setBadgeText({ text: score.toString() });
		});
	},

	save: function () {
		console.log('getting saved...');
		setInterval(savior.readDashboard, this.SALVATION_FREQUENCY);
		savior.readDashboard();
	}
};

document.addEventListener('DOMContentLoaded', function () {
	//savior.save();
});