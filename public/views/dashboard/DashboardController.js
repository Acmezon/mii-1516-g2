angular.module('acme_supermarket').registerCtrl('DashboardCtrl', ['$scope', '$http', '$translate', 'ngToast', '$location',
function ($scope, $http, $translate, ngToast, $location) {
	checkSocialMediaStatus()

	$scope.startSocialMediaService = function() {
		if($scope.socialMediaServiceRunning) {
			return;
		}

		$http.get('/api/socialMedia/start').then(
			function success(response) {
				$translate(['Dashboard.SocialMedia.Started']).then(function (translation) {
					ngToast.create({
						className: 'success',
						content: translation['Dashboard.SocialMedia.Started']
					});
				});

				checkSocialMediaStatus();
			}, function error(response) {
				switch(response.status) {
					case 403:
						$location.url('/403');
						break;
					case 503:
						$translate(['Dashboard.SocialMedia.StartError']).then(function (translation) {
							ngToast.create({
								className: 'error',
								content: translation['Dashboard.SocialMedia.StartError']
							});
						});
						break;
				}

			}
		);
	};

	$scope.stopSocialMediaService = function() {
		if(!$scope.socialMediaServiceRunning) {
			return;
		}

		$http.get('/api/socialMedia/stop').then(
			function success(response) {
				$translate(['Dashboard.SocialMedia.Stopping']).then(function (translation) {
					ngToast.create({
						className: 'success',
						content: translation['Dashboard.SocialMedia.Stopping']
					});
				});

				checkSocialMediaStatus();
			}, function error(response) {
				switch(response.status) {
					case 403:
						$location.url('/403');
						break;
					case 503:
						$translate(['Dashboard.SocialMedia.StopError']).then(function (translation) {
							ngToast.create({
								className: 'error',
								content: translation['Dashboard.SocialMedia.StopError']
							});
						});
						break;
				}

			}
		);
	};


	function checkSocialMediaStatus() {
		$http.get('/api/socialMedia/status').then(
			function success(response){
				$scope.socialMediaServiceRunning = response.data.running;
			}
		,function error(response){});
	}

}]);