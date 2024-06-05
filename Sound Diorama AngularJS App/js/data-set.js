
var soundCTX= [];



const sound_group_collection = [

    {
        name: 'Birds',
        groupID: 'bird',
        focusAudioShot: 'assets/audio/bird/fx.ogg',
        url: 'assets/audio/bird/',
        startingReverbWet: -25, maxReverbWet: 0, minReverbWet: -30,
        volumeRangeValue: -25, volumeRangeValueMinimo: -25, volumeRangeValueMassimo: 0, volumeRangeValueStep: 0.1, focus: false, selected: false,  mainNodeCreated: false, loadComplete: false, showMenu: false,playing: false,
        sounds: [
            {   moduleID: 'bird-background',
                audioFiles: [],
                number: 0,
                amount: 1 + 1,

                loop: true,
                url: 'background/bird-background',
                type: 'background',
                fadeIn: 5,
                fadeOut: 5,

                triggerVolumeRange: -22,
                volumeRescaleValue: -11,
                filterModifier: 0, filterMaxValue: 20000, filterMinValue: 5000,
                crossoverLow: -10,
                volumeRangeValue: 0, volumeRangeValueMinimo: -25, volumeRangeValueMassimo: 0, volumeRangeValueStep: 1, playing: true
            },


            {   moduleID: 'bird-scatter1',
                audioFiles: [],
                number: 1,
                amount: 11 + 1,

                loop: false,
                url: 'scatter01/bird',
                type: 'scatter',

                minTime: 16,
                maxTime: 29,
                minVolume: -3,
                maxVolume: 0,

                triggerVolumeRange: -24,
                volumeRescaleValue: -4,
                filterModifier: 0, filterMaxValue: 20000, filterMinValue: 5000,
                spawnRate: 1,
                hasPan: true,
                volumeRangeValue: 0, volumeRangeValueMinimo: -25, volumeRangeValueMassimo: 0, volumeRangeValueStep: 1, oldRandomClip: undefined, playing: true
            },

            
        ]
    },



    //********************************************************/

    {
        name: 'Cars',
        groupID: 'car',
        number: 1,
        color: 'gree',
        focusAudioShot: 'assets/audio/car/fx.ogg',
        url: 'assets/audio/car/',
        startingReverbWet: -25, maxReverbWet: 0, minReverbWet: -30, maxReverbDecay: 6.5, minReverbDecay: 0.5,
        volumeRangeValue: -25, volumeRangeValueMinimo: -25, volumeRangeValueMassimo: 1, volumeRangeValueStep: 0.1, volumeRangeValueOrientation: 'horizontal', focus: false, selected: false,  mainNodeCreated: false, loadComplete: false, showMenu: false,playing: false,
        
        sounds: [
            {   moduleID: 'car-background',
                audioFiles: [],
                number: 0,
                amount: 1 + 1,

                loop: true,
                url: 'background/car-background',
                type: 'background',
                fadeIn: 5,
                fadeOut: 5,

                triggerVolumeRange: -24,
                volumeRescaleValue: -5,
                filterModifier: 0, filterMaxValue: 20000, filterMinValue: 5000,
                volumeRangeValue: 0, volumeRangeValueMinimo: -25, volumeRangeValueMassimo: -10, volumeRangeValueStep: 1, playing: true
            },


            {   moduleID: 'car-scatter1',
                audioFiles: [],
                number: 1,
                amount: 6 + 1,

                loop: false,
                url: 'scatter01/car',
                type: 'scatter',

                minTime: 6,
                maxTime: 25,
                minVolume: -7,
                maxVolume: 1,

                triggerVolumeRange: -24,
                volumeRescaleValue: -4,
                filterModifier: 0, filterMaxValue: 20000, filterMinValue: 5000,
                spawnRate: 1,
                hasPan: false,
                volumeRangeValue: 0, volumeRangeValueMinimo: -18, volumeRangeValueMassimo: 1, volumeRangeValueStep: 1, oldRandomClip: undefined, playing: true
            },

            
        ]
    },



    //********************************************************/


    {
        name: 'Persone',
        groupID: 'persone',
        number: 1,
        color: 'pink',
        focusAudioShot: 'assets/audio/persone/fx.ogg',
        url: 'assets/audio/persone/',
        minimumReverb: 0.1,
        volumeRangeValue: -25, volumeRangeValueMinimo: -25, volumeRangeValueMassimo: 1, volumeRangeValueStep: 1, volumeRangeValueOrientation: 'horizontal', focus: false, selected: false,  mainNodeCreated: false, loadComplete: false, showMenu: false,
        
        sounds: [
            {   moduleID: 'persone-background',
                audioFiles: [],
                number: 0,
                amount: 1 + 1,

                loop: true,
                url: 'background/persone-background',
                type: 'background',
                fadeIn: 5,
                fadeOut: 5,

                triggerVolumeRange: -24,
                filterModifier: 0,
                volumeRangeValue: 0, volumeRangeValueMinimo: -18, volumeRangeValueMassimo: -15, volumeRangeValueStep: 1, playing: true
            },


            {   moduleID: 'persone-scatter1',
                audioFiles: [],
                number: 1,
                amount: 6 + 1,

                loop: false,
                url: 'scatter01/persone',
                type: 'scatter',

                minTime: 6,
                maxTime: 25,
                minVolume: -7,
                maxVolume: 1,

                triggerVolumeRange: -24,
                filterModifier: 0,
                spawnRate: 1,
                volumeRangeValue: 0, volumeRangeValueMinimo: -18, volumeRangeValueMassimo: 1, volumeRangeValueStep: 1, oldRandomClip: undefined, playing: true
            },

            
        ]
    },



    //********************************************************/


];

let gruppoAliass = Object.assign({}, sound_group_collection); 
console.log(gruppoAliass)