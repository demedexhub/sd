app.directive('mainGroupSlider', function() {
	return {
	controller: 'DioramaEnvironment',
	  restrict: 'E',
	  replace: true,
	  scope: {group: '='},
	  templateUrl: 'js/directives/mainGroupSliderTemplate.html'
	}
  });

