
app.controller('DioramaEnvironment', ['$scope', '$rootScope', '$http', '$document', 'audioService', function ($scope, $rootScope, $http, $document, audioService) {

    $scope.soundCTX1 = soundCTX;

    $scope.collection = sound_group_collection;

    $rootScope.choiceMenuOpen;

    $rootScope.sliderWrapperExpanded = false;

    $rootScope.styleRoot = document.querySelector(':root');

    //**************************** audioService CALLABLE FUNCTIONS ****************************

    $scope.createAndStoreFXNodes = function (sottogruppo) {
        audioService.createAndStoreFXNodes(sottogruppo);
    }
    $scope.createAndStoreAudioFiles = function (sottogruppo) {
        console.log(sottogruppo)
        audioService.createAndStoreAudioFiles(sottogruppo);
    }

    $scope.playScatter = function (sottogruppo) {
        audioService.playScatter(sottogruppo);
    }

    $scope.playBackgroundLoop = function (gruppo, elemento, volume = 0) {
        audioService.playBackgroundLoop(gruppo, elemento, volume);
    }


    $scope.pushGroupsInSoundCTX = function (gruppo, pippo) {
       audioService.pushGroupsInSoundCTX(gruppo)
        $scope.toggleChoiceGroupStyle(gruppo);
   
    }


    //**************************** SCOPE FUNCTIONS ****************************

    /*     NON USATE PER ORA QUESTE DUE */
    $scope.initSubGroupSoundCTXSounds = function () {
        for (let i = 0; i < soundCTX.length; i++) {
            for (let j = 0; j < soundCTX[i].sounds.length; j++) {
                $scope.createAndStoreAudioFiles(soundCTX[i].sounds[j]);
            }
        }
    }

    $scope.initSubGroupSoundCTXNodes = function () {
        for (let i = 0; i < soundCTX.length; i++) {
            for (let j = 0; j < soundCTX[i].sounds.length; j++) {
                $scope.createAndStoreFXNodes(soundCTX[i].sounds[j]);
            }
        }
        $scope.initSubGroupSoundCTXSounds();
    }





    $scope.toggleChoiceGroupStyle = function (gruppo) {
        gruppo.selected = !gruppo.selected;
    }

    $scope.toggleChoiceMenu = function () {
        audioService.recreateSliders();
        $rootScope.choiceMenuOpen = !$rootScope.choiceMenuOpen;
    }

    $scope.toggleExpandSliderWrapper = function () {
        //audioService.recreateSliders();
        $rootScope.sliderWrapperExpanded = !$rootScope.sliderWrapperExpanded;
    }


    $rootScope.lastSelectedOption = undefined;
    $scope.toggleSliderOption = function (gruppo) {
        console.log($rootScope.lastSelectedOption)
        if ($rootScope.lastSelectedOption != undefined && $rootScope.lastSelectedOption != gruppo) {
            $rootScope.lastSelectedOption.showMenu = false;
           // $rootScope.styleRoot.style.setProperty('--animation-nome-range-' + $rootScope.lastSelectedOption.groupID, 'waves');
        }
        gruppo.showMenu = !gruppo.showMenu;
        $rootScope.lastSelectedOption = gruppo;
        if (gruppo.showMenu == true) {
            audioService.recreateSubSliders(gruppo);
            //$rootScope.styleRoot.style.setProperty('--animation-nome-range-' + gruppo.groupID, 'wave');
        }
        else {
           // $rootScope.styleRoot.style.setProperty('--animation-nome-range-' + gruppo.groupID, 'waves');
        }

    }


    $scope.startSort =  function (gruppo, event)
    {
       // event.preventDefault();
      console.log('scooooope ' + event);
/*       let el = document.getElementById(event.target.id);
      el.addEventListener("mousedown", $scope.handleStart());
      el.addEventListener("mouseup", $scope.handleEnd()); */
      //afterClick();
    }
    
    $scope.handleStart = function ()
    {
      console.log('This is start click');
    }
    $scope.handleEnd = function ()
    {
      console.log('This is end click');
    }
    $scope.muteGroup = function (gruppo) {
       // $("#" + gruppo.groupID).slider("value", -25);
        gruppo.playing = false;
        for (let index = 0; index < 260; index++) {
            setTimeout(() => {
                let valore = $("#" + gruppo.groupID).slider("value") - 0.1;
                $("#" + gruppo.groupID).slider("value", valore);     
            }, index);

            
        }
    }

    $(".slider-sorter").sortable({
        revert: false,
        revertDuration: 1200,
        axis: "y",
        handle: '.slider-sort-handler',
        start: function (event, ui) {
            console.log(ui.item.context.id)
            $("#" + ui.item.context.id).addClass('sorting');

        },
        stop: function (event, ui) {
            console.log(ui.item.context.id)
            $("#" + ui.item.context.id).removeClass('sorting');
            //location.reload();    

        }

    });

}]);





