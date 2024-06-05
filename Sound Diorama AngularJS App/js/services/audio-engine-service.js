app.service('audioService', function () {

    //Variabile da intestare all'invoke delle funzioni nello scope da luoghi fuori dallo scope
    var audioServiceThis = this;

    //Tiene traccia dei file gia scaricati
    var groupLoaded = {
        /*         bird: 0,
                car: 0,
                bird2: 0 */
    }

    //**************************** CLASSES DEFINITION ****************************

    class Slider {
        constructor(gruppo) {

            $(function () {
                $('#' + gruppo.groupID).slider({
                    orientation: 'horizontal',
                    value: gruppo.volumeRangeValue,
                    range: "min",
                    animate: false,
                    min: gruppo.volumeRangeValueMinimo,
                    max: gruppo.volumeRangeValueMassimo,
                    step: gruppo.volumeRangeValueStep,

                    slide: function (event, ui) {
                        //sliderMovedAudio.play();
                        updateNodeValue(gruppo, event)
                    },
                    change: function (event, ui) {
                        updateNodeValue(gruppo, event);
                    }
                });
            });
        }
    };

    class ReverbSlider {
        constructor(gruppo) {

            $(function () {
                $('#' + gruppo.groupID + "-reverb").slider({
                    orientation: 'horizontal',
                    value: gruppo.startingReverbWet,
                    range: "min",
                    animate: false,
                    min: gruppo.minReverbWet,
                    max: gruppo.maxReverbWet,
                    step: 0.1,

                    slide: function (event, ui) {
                        // sliderMovedAudio.play();
                        updateNodeValue(gruppo, event, 'turnOffFalse')
                    },
                    change: function (event, ui) {
                        updateNodeValue(gruppo, event, 'turnOffFalse');
                    }
                });
            });
        }
    };

    class AudioFile {
        constructor(url, loop, node, fadeIn, fadeOut) {
            this.sound = new Tone.Player({
                url: url,
                loop: loop,
                volume: 0,
                playbackRate: 1,
                autostart: false,
                fadeIn: fadeIn,
                fadeOut: fadeOut
            }).connect(node);
        }
    };

    class PannerNode {
        constructor(node) {
            this.panner = new Tone.Panner(0).connect(node);
        }
    };

    class GainNode {
        constructor(node, volume) {
            this.gain = new Tone.Volume(volume).connect(node);
        }
    };

    class FilterNode {
        constructor(node, node2) {
            this.filter = new Tone.Filter({
                "type": "lowpass",
                "frequency": 20000,
                "rolloff": -12,
                "Q": 1,
                "gain": 0
            }).fan(node, node2);
        }
    };

    class ReverbNode {
        constructor(gruppo) {
            this.reverb = new Tone.Reverb({
                "wet": gruppo.startingReverbWet,
                "decay": gruppo.minReverbDecay,
                "preDelay": 0.01
            }).connect(masterVolume);
        }
    };




    //**************************** VARIOUS ****************************

    //GLOBAL CONTEXT TONEJS
    const context = new Tone.Context({ latencyHint: 10, lookAhead: 0.1, });
    //const context = new Tone.OfflineContext(1, 1.5, 44100);
    Tone.setContext(context);
    //Tone.Buffer.on('load', tuttoCaricato())

    //MASTER VOLUME
    const masterVolume = new Tone.Volume().toDestination();
    masterVolume.volume.value = 0;
    const root = document.querySelector(':root');


    var reverbMainChannel = new Tone.Reverb({
        "wet": 1,
        "decay": 7.8,
        "preDelay": 0.01
    }).connect(masterVolume);

    //TRIGGER WHEN A SLIDER IS MOVED
    updateNodeValue = function (gruppo, event) {
        console.log(event.target.role);

        if (event.target.role == 'slider-reverb') {
            let sliderValue = $("#" + gruppo.groupID + "-reverb").slider("value");
            gruppo.startingReverbWet = sliderValue;

            let nuovoValoreRiverbero = sliderValue;

            gruppo.startingReverbWet = nuovoValoreRiverbero;

            gruppo.gainAuxRevNodeData.gain.volume.value = nuovoValoreRiverbero;

            console.log('valore riverbero ' + gruppo.gainAuxRevNodeData.gain.volume.value)

            gruppo.sounds.forEach(subGroup => {
                let nuovoValoreFiltro = (sliderValue - (gruppo.volumeRangeValueMinimo)) * (subGroup.filterMinValue - subGroup.filterMaxValue) / (gruppo.volumeRangeValueMassimo - (gruppo.volumeRangeValueMinimo)) + subGroup.filterMaxValue;
                subGroup.filterNode.filter.frequency.value = nuovoValoreFiltro - subGroup.filterModifier
                console.log('valore filtro ' + subGroup.filterNode.filter.frequency.value)
            });
        }




        else if (event.target.role == 'slider-amount') {
            let amountSliderValue = $("#" + gruppo.groupID + '-amount').slider("value");
            gruppo.amountRangeValue = amountSliderValue;

            for (let i = 0; i < gruppo.sounds.length; i++) {

                if (gruppo.sounds[i].amount != 2) {

                    audioServiceThis.playBackgroundLoop(gruppo.sounds[i], amountSliderValue);

                }

            }


        }

        else if (event.target.role == 'slider') {
            //gruppo.playing = true; 

            //Prende valore slider mosso
            let sliderValue = $("#" + gruppo.groupID).slider("value");
            gruppo.volumeRangeValue = sliderValue;

            if (sliderValue == gruppo.volumeRangeValueMinimo) {
                gruppo.playing = false;
                $(".slider-buttons-wrapper-" + gruppo.groupID).addClass("gray-led");
            }
            else {
                if(gruppo.playing == false){
                    gruppo.playing = true;
                    $(".slider-buttons-wrapper-" + gruppo.groupID).removeClass("gray-led");
                }

            }

            let nuovoValoreColore = parseInt(Math.round(((sliderValue - gruppo.volumeRangeValueMinimo) / (gruppo.volumeRangeValueMassimo - gruppo.volumeRangeValueMinimo)) * (100 - 0) + 0)) + 20;
            root.style.setProperty('--opacity-slider-' + gruppo.groupID, nuovoValoreColore + '%');

            let nuovoValoreShadow = ((sliderValue - (gruppo.volumeRangeValueMinimo)) * (8 - 0) / (gruppo.volumeRangeValueMassimo - (gruppo.volumeRangeValueMinimo)) + 0);
            root.style.setProperty('--shadow-spread-' + gruppo.groupID, nuovoValoreShadow + 'px');

            //Scorre tutti i modili sonori del gruppo mosso per aggiornare i valori dei nodi
            for (let i = 0; i < gruppo.sounds.length; i++) {

                // Controlla (per ogni modulo sonoro) che il valore non sia sotto la soglia di attivazione e li disattiva
                if (gruppo.sounds[i].triggerVolumeRange >= sliderValue) {
                    gruppo.sounds[i].playing = false;
                    if (gruppo.sounds[i].type == 'background') {
                        gruppo.sounds[i].audioFiles[0].sound.stop();
                    }

                } //Altrimenti li fa ripartire
                else {
                    if (gruppo.sounds[i].playing == false) {
                        gruppo.sounds[i].playing = true;
                        if (gruppo.sounds[i].type == 'background') {
                            audioServiceThis.playBackgroundLoop(gruppo.sounds[i])
                            // gruppo.sounds[i].audioFiles[0].sound.start();
                        } else if (gruppo.sounds[i].type == 'scatter') {
                            audioServiceThis.playScatter(gruppo.sounds[i])
                        }
                    }
                }



                //Gestise volume dei gruppi

                if (gruppo.sounds[i].playing == true) {

                    let coefficenteRiduzione = gruppo.volumeRangeValueMinimo - gruppo.sounds[i].volumeRescaleValue;
                    let nuovoValoreVolume = parseInt(Math.round((((sliderValue - coefficenteRiduzione) - (gruppo.volumeRangeValueMinimo - coefficenteRiduzione)) / ((gruppo.volumeRangeValueMassimo - coefficenteRiduzione) - (gruppo.volumeRangeValueMinimo - coefficenteRiduzione))) * (gruppo.sounds[i].volumeRangeValueMassimo - gruppo.sounds[i].volumeRangeValueMinimo) + gruppo.sounds[i].volumeRangeValueMinimo));
                    if (gruppo.gainAuxRevNodeData.gain.volume.value > -7) {
                        nuovoValoreVolume -= 10;
                    }

                    gruppo.sounds[i].gainNode.gain.volume.value = nuovoValoreVolume;

                    console.log('valore VOLUME ' + gruppo.sounds[i].moduleID + gruppo.sounds[i].gainNode.gain.volume.value)
                }



            }

        }

    }



    //**************************** COLLECTION OF HOWLER SOUNDS ****************************

    var sliderMovedAudio = new Howl({
        src: ['assets/audio/interface/blop.wav'],
        volume: 0.4,
    });




    //**************************** SERVICES ****************************

    this.pushGroupsInSoundCTX = function (gruppo) {

        let indiceGruppoDaTrovare = soundCTX.findIndex(item => item.groupID === gruppo.groupID);
        let gruppoTrovato = soundCTX[indiceGruppoDaTrovare];


        //TOGLIE MODULO
        if (gruppoTrovato != undefined) {
            audioServiceThis.recreateSliders();
            $("#" + gruppoTrovato.groupID).slider("value", gruppoTrovato.volumeRangeValueMinimo);
            let i = 0;
            while (i < gruppoTrovato.sounds.length) {
                gruppoTrovato.sounds[i].gainNode.gain.volume.value = gruppo.sounds[i].volumeRangeValueMinimo;
                i++;
            }
            gruppoTrovato.mainNodeCreated = false;

            const index = soundCTX.indexOf(gruppoTrovato);
            //const x = soundCTX.splice(index, 1);
            soundCTX.splice(index, 1);

        }

        //METTE MODULO
        else {
            let gruppoAlias = Object.assign({}, gruppo);
            soundCTX.push(gruppoAlias);
            indiceGruppoDaTrovare = soundCTX.findIndex(item => item.groupID === gruppo.groupID);
            gruppoTrovato = soundCTX[indiceGruppoDaTrovare];

            soundCTX[indiceGruppoDaTrovare].loadComplete = false;
            groupLoaded[gruppoTrovato.groupID] = 0;

            setTimeout(() => {
                for (let j = 0; j < gruppoTrovato.sounds.length; j++) { this.createAndStoreFXNodes(gruppoTrovato.sounds[j]); console.log('nodi') }
                for (let j = 0; j < gruppoTrovato.sounds.length; j++) { this.createAndStoreAudioFiles(gruppoTrovato.sounds[j]); console.log('suoni') }

                console.log(soundCTX[indiceGruppoDaTrovare].loadComplete)

                audioServiceThis.checkLoadedAudioFiles(soundCTX[indiceGruppoDaTrovare])

            }, 10);
        }

    };

    this.countAmountofAudioFilesInGroup = function (gruppo) {
        let totalAmount = 0;
        gruppo.sounds.forEach(element => {
            totalAmount += element.amount - 1;
        });
        return totalAmount;
    }

    this.checkLoadedAudioFiles = function (gruppo) {
        console.log('IL GRUPPO CHECKATO ' + gruppo.groupID);
        let totalAmountofFilesInGroup = audioServiceThis.countAmountofAudioFilesInGroup(gruppo);
        if (groupLoaded[gruppo.groupID] == totalAmountofFilesInGroup) {
            gruppo.loadComplete = true;
            let IDGruppo = 'push-button-loading-' + gruppo.groupID + '';
            document.getElementById(IDGruppo).classList.add("invisible");
        }
        else {
            setTimeout(() => {
                this.checkLoadedAudioFiles(gruppo);
            }, 200);
        }
    }


    this.recreateSliders = function () {
        let i = 0;
        while (i < soundCTX.length) {
            let rangeValueNode = new Slider(soundCTX[i]);
            soundCTX[i].volumeRangeValueNode = rangeValueNode;
            i++;
        }
    }

    this.recreateSubSliders = function (gruppo) {
        let rangeReverbNode = new ReverbSlider(gruppo);
        gruppo.reverbRangeValueNode = rangeReverbNode;

    }

    this.findGroupAndSubGroupBySubGroup = function (sottogruppo) {
        let soundCTXgroup;
        let soundCTXSubgroup;
        let i = 0;
        while (i < soundCTX.length) {
            soundCTXSubgroup = soundCTX[i].sounds.find(item => item.moduleID === sottogruppo);
            if (soundCTXSubgroup != undefined) {
                soundCTXgroup = soundCTX[i];
                soundCTXSubgroup = soundCTXSubgroup;
                break;
            }
            i++;
        }
        return {
            gruppo: soundCTXgroup,
            sottogruppo: soundCTXSubgroup
        }
    };


    this.createAndStoreFXNodes = function (sottogruppo) {

        let result = this.findGroupAndSubGroupBySubGroup(sottogruppo.moduleID);
        let soundCTXgroup = result.gruppo;
        let soundCTXSubgroup = result.sottogruppo;

        if (!soundCTXgroup.mainNodeCreated) {
            /*             var reverbNode = new ReverbNode(soundCTXgroup);
                        soundCTXgroup.reverbNode = reverbNode;
                        console.log('group ' + soundCTXgroup.groupID + ' reverb-node-created'); */

            //  var filterNode = new FilterNode(soundCTXgroup.reverbNode.reverb);
            /*             var filterNode = new FilterNode(masterVolume);
                        soundCTXgroup.filterNode = filterNode;
                        console.log('group ' + soundCTXgroup.groupID + ' filter-node-created');
            
                        var gainNode = new GainNode(soundCTXgroup.filterNode.filter, 0);
                        soundCTXgroup.gainNode = gainNode;
                        console.log('group ' + soundCTXgroup.groupID + ' gain-node-created'); */

            let gainAuxRevNode = new GainNode(reverbMainChannel, soundCTXgroup.startingReverbWet);
            soundCTXgroup.gainAuxRevNodeData = gainAuxRevNode;
            console.log('group ' + soundCTXgroup.groupID + ' gain-node-created');

            let rangeValueNode = new Slider(soundCTXgroup);
            soundCTXgroup.volumeRangeValueNode = rangeValueNode;
            console.log('group ' + soundCTXgroup.groupID + ' range creted');

            /*             var rangeReverbNode = new ReverbSlider(soundCTXgroup);
                        soundCTXgroup.reverbRangeValueNode = rangeReverbNode;
                        console.log('group ' + soundCTXgroup.groupID + ' reverb slider creted'); */

            soundCTXgroup.mainNodeCreated = true;

        };

        //SUBGROUP NODES




        //var filterNode = new FilterNode(soundCTXgroup.gainNode.gain);
        let filterNode = new FilterNode(masterVolume, soundCTXgroup.gainAuxRevNodeData.gain);
        soundCTXSubgroup.filterNode = filterNode;
        console.log('module ' + soundCTXSubgroup.moduleID + ' filter-node-created');



        //Il panner viene creato solo sugli scatter
        //Il gain viene collegato al pan solo se è uno scatter
        if (soundCTXSubgroup.type == 'scatter') {
            if (soundCTXSubgroup.hasPan == true) {
                let pannerNode = new PannerNode(soundCTXSubgroup.filterNode.filter);
                soundCTXSubgroup.pannerNode = pannerNode;
                console.log('module ' + soundCTXSubgroup.moduleID + ' panner-node-created');

                let gainNode = new GainNode(soundCTXSubgroup.pannerNode.panner, soundCTXSubgroup.volumeRangeValue);
                soundCTXSubgroup.gainNode = gainNode;
                console.log('module ' + soundCTXSubgroup.moduleID + ' gain-node-created');
            }
            else {
                let gainNode = new GainNode(soundCTXSubgroup.filterNode.filter, soundCTXSubgroup.volumeRangeValue);
                soundCTXSubgroup.gainNode = gainNode;
                console.log('module ' + soundCTXSubgroup.moduleID + ' gain-node-created');
            }


        }
        else {
            let gainNode = new GainNode(soundCTXSubgroup.filterNode.filter, soundCTXSubgroup.volumeRangeValue);
            soundCTXSubgroup.gainNode = gainNode;
            console.log('module ' + soundCTXSubgroup.moduleID + ' gain-node-created');
        }




    };


    this.createAndStoreAudioFiles = function (sottogruppo) {

        let result = audioServiceThis.findGroupAndSubGroupBySubGroup(sottogruppo.moduleID);
        let soundCTXgroup = result.gruppo;
        let soundCTXSubgroup = result.sottogruppo;
        let soundContainer = [];
        let totalAmountofFilesInGroup = audioServiceThis.countAmountofAudioFilesInGroup(soundCTXgroup);
        console.log(totalAmountofFilesInGroup + 'TOTAL AMOUNT')
        //this.sound;

        for (let i = 1; i < soundCTXSubgroup.amount; i++) {
            let url = soundCTXgroup.url + soundCTXSubgroup.url

            if (soundCTXSubgroup.type == 'background') {

                let xhr = new XMLHttpRequest();
                xhr.open("GET", url + '0' + i + '.ogg', true);
                xhr.responseType = 'blob';
                xhr.onload = function () {
                    let blob = URL.createObjectURL(this.response).toString();
                    console.log('created blob for ' + blob);
                    this.sound = new AudioFile(blob, soundCTXSubgroup.loop, soundCTXSubgroup.gainNode.gain, soundCTXSubgroup.fadeIn, soundCTXSubgroup.fadeOut);
                    soundCTXSubgroup.audioFiles.push(this.sound);
                    //soundContainer.push(this.sound);
                    let now = new Date();
                    let diff = now - before;
                    console.log("Took " + diff + " milliseconds");
                    if (groupLoaded[soundCTXgroup.groupID] < totalAmountofFilesInGroup) { groupLoaded[soundCTXgroup.groupID] += 1; }
                    console.log('LOADED ' + groupLoaded[soundCTXgroup.groupID]);
                };
                let before = new Date();
                xhr.send(soundCTXgroup);



            }

            else {            //Else if is a scatter single sound

                if (i >= 10) {

                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", url + i + '.ogg', true);
                    xhr.responseType = 'blob';
                    xhr.onload = function () {
                        let blob = URL.createObjectURL(this.response).toString();
                        console.log('created blob for ' + blob);
                        this.sound = new AudioFile(blob, soundCTXSubgroup.loop, soundCTXSubgroup.gainNode.gain, 0, 0);
                        soundCTXSubgroup.audioFiles.push(this.sound);
                        //soundContainer.push(this.sound);
                        let now = new Date();
                        let diff = now - before;
                        console.log("Took " + diff + " milliseconds");
                        if (groupLoaded[soundCTXgroup.groupID] < totalAmountofFilesInGroup) { groupLoaded[soundCTXgroup.groupID] += 1; }
                        console.log(groupLoaded[soundCTXgroup.groupID]);
                    };
                    let before = new Date();
                    xhr.send(soundCTXgroup);

                }
                else {

                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", url + '0' + i + '.ogg', true);
                    xhr.responseType = 'blob';
                    xhr.onload = function () {
                        let blob = URL.createObjectURL(this.response).toString();
                        console.log('created blob for ' + blob);
                        this.sound = new AudioFile(blob, soundCTXSubgroup.loop, soundCTXSubgroup.gainNode.gain, 0, 0);
                        soundCTXSubgroup.audioFiles.push(this.sound);
                        //soundContainer.push(this.sound);
                        let now = new Date();
                        let diff = now - before;
                        console.log("Took " + diff + " milliseconds");
                        if (groupLoaded[soundCTXgroup.groupID] < totalAmountofFilesInGroup) { groupLoaded[soundCTXgroup.groupID] += 1; }
                        console.log(groupLoaded[soundCTXgroup.groupID]);
                    };
                    let before = new Date();
                    xhr.send(soundCTXgroup);


                }
            }
        }

        //soundCTXSubgroup.audioFiles = soundContainer;
    };



    this.playScatter = function (sottogruppo) {

        let randomClip = Math.floor(Math.random() * ((sottogruppo.amount - 2) - 0 + 1) + 0);

        if (randomClip == sottogruppo.oldRandomClip) {
            if (randomClip == sottogruppo.amount - 2) {
                randomClip == randomClip - 1;
            } else {
                randomClip = randomClip + 1;
            }
        }
        sottogruppo.oldRandomClip = randomClip;

        let randomTime = Math.floor(Math.random() * (sottogruppo.maxTime - sottogruppo.minTime + 1) + sottogruppo.minTime) * 1000;
        let randomVolume = Math.floor(Math.random() * (sottogruppo.maxVolume - sottogruppo.minVolume + 1) + sottogruppo.minVolume);
        let randomPan = Math.round(Math.random() * 10) / 10;
        let auxRandom = Math.round(Math.random() * 10) / 10;
        if (auxRandom < 0.5) {
            randomPan = -Math.abs(randomPan);
        }

        let randomPlaybackRate = Math.random() * (1.1 - 0.9 + 0) + 0.9;

        console.log('volume ' + randomVolume + ' tempo ' + randomTime + ' pan ' + randomPan + ' playbackrate ' + randomPlaybackRate + ' sottogruppo ' + sottogruppo.moduleID + ' sottogruppo is playing ' + sottogruppo.playing);

        if (sottogruppo.playing === true && sottogruppo.type == 'scatter') {
            let audio = sottogruppo.audioFiles[randomClip].sound;
            audio.playbackRate = randomPlaybackRate;
            if (sottogruppo.hasPan == true) {
                sottogruppo.pannerNode.panner.pan.value = randomPan;
            }
            audio.volume.value = randomVolume;
            audio.start();
        }

        if (sottogruppo.playing === true) {
            setTimeout(() => {
                this.playScatter(sottogruppo);
            }, randomTime * sottogruppo.spawnRate);
        }
    };

    this.playBackgroundLoop = function (sottogruppo, amount) {

        if (amount == undefined || amount == '' || amount < 3) {
            if (sottogruppo.playing == true && sottogruppo.type == 'background') {
                let audio = sottogruppo.audioFiles[0].sound;
                audio.start();
                console.log('started ' + sottogruppo.moduleID)
            }
        }
        else { //ANCORA DA SCRIVERE LOGICA PER ALTERNARE I BACKGROUND SENZA CREARE ALTRI SOTTOGRUPPI
            let audio = sottogruppo.audioFiles[amount].sound;
        }


    }
});





