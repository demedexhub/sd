
app.controller('MainController', ['$scope', '$rootScope', '$http', '$document', 'audioService', function ($scope, $rootScope, $http, $document, audioService) {

    $rootScope.isPageLoaded = false;

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        console.log(next.$$route.originalPath)

        if ($rootScope.lastSelectedOption != undefined) {
            $rootScope.lastSelectedOption.showMenu = false;
            $rootScope.styleRoot.style.setProperty('--animation-nome-range-' + $rootScope.lastSelectedOption.groupID, 'waves');
        }

        if ($rootScope.isPageLoaded == false) {
            $('.loading-screen').addClass('visible-load');  

        }

        if (next.$$route.originalPath == '/ChooseSoundPage') {
            $rootScope.choiceMenuOpen = true;
            $rootScope.isPageLoaded = true;
        } else if  (next.$$route.originalPath == '/DioramaPage') {
            $rootScope.choiceMenuOpen = false;
        }
        else if( next.$$route.originalPath == '/MainPage'){
            $rootScope.choiceMenuOpen = false;
        }
    });

    $rootScope.$on('$routeChangeSuccess', function (event, next, current) {
      
        setTimeout(() => {
            audioService.recreateSliders();
        }, 10);
        setTimeout(() => {
            $('.loading-screen').removeClass('visible-load');
        }, 1500);

    });

    $rootScope.message = 'ciao sono la pagina principale';

    $scope.messaggino = 'ciao provengo da main controller';


}]);





