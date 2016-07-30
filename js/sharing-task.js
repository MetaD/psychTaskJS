/*
 * Author: Meng Du
 * Date: July 12, 2016
 */


var allTimeline = [];
var firebaseUid, userId;


function startExperiment() {
    hookWindow = true;
    // Start the experiment
    jsPsych.init({
        display_element: $('#jspsych-target'),
        timeline: allTimeline
    });
}

function valid_id(uid) {
    if (uid === 'test' || uid.length === ID_LENGTH) {
        return true;
    }
    return false;
}

function id_submission() {
    userId = $("#uid-input").val();
    if (valid_id(userId)) {
        $("#id-dialog").modal('hide');

        // Firebase Anonymous Authentication
        firebase.auth().signInAnonymously().then(function(user) {
            firebaseUid = user.uid;
            console.log('Signed in as ' + firebaseUid);

            // save participant id to firebase user
            firebase.database().ref('/' + firebaseUid).set({
                id: userId
            });
        });

        // Load images and then start experiment
        jsPsych.pluginAPI.preloadImages(REWARDS, startExperiment);
    }
    else {
        $("#uid-field").addClass("has-error");
    }
}


$(document).ready(function() {
    $("#id-dialog").modal('show');

    // PREVENT CLOSING WINDOW
    window.onbeforeunload = function() {
        if (hookWindow) {
            return CLOSE_WINDOW_ALERT;
        }
    }

    // FIREBASE
    var config = {
        apiKey: "AIzaSyBeixOTp2AjaOlWaIFI0O4Ew0CMVNhKPlo",
        authDomain: "sharing-task.firebaseapp.com",
        databaseURL: "https://sharing-task.firebaseio.com",
        storageBucket: "",
    };
    firebase.initializeApp(config);

    // RANDOMIZATION
    shuffle_array(statements);
    shuffle_array(statements_train);

    // TRIALS
    // Note: only data from trials with on_finish function are recorded
    var syncingScreen = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            '<p>' + SYNC_INSTR + '&nbsp;&nbsp;&nbsp;</p>',
            '<p>' + SYNC_INSTR + '.&nbsp;&nbsp;</p>',
            '<p>' + SYNC_INSTR + '..&nbsp;</p>',
            '<p>' + SYNC_INSTR + '...</p>',
            '<p>Get Ready!</p>'
        ],
        choices: [],
        timing_stim: [SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, GET_READY_TIME],
        timing_response: SYNC_TIME + GET_READY_TIME,
        response_ends_trial: false,
    };

    var breakStimuli = [], breakTiming = [];
    for (var i = BREAK_TIME/1000; i > 0; --i) {
        breakStimuli.push('<p class="center-content">' + BREAK_INSTR + '</p><p class="large center-content"><br/>' + i.toString() + '</p>');
        breakTiming.push(1000);
    }

    var breakScreen = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: breakStimuli,
        choices: [],
        timing_stim: breakTiming,
        timing_response: BREAK_TIME,
        response_ends_trial: false,
    };

    var numberScreen = {    // dummy
        type: 'single-stim',
        is_html: true,
        stimulus: '',
        choices: [],
        timing_response: NUMBER_TIME,
        response_ends_trial: false,
        on_finish: function(data) { processNumberTrialData(data, firebaseUid); }
    };

    var privateShareScreen = {  // dummy
        type: 'single-stim',
        is_html: true,
        stimulus: '',
        choices: ['1', '5'],
        timing_response: PRIVATE_SHARE_TIME,
        response_ends_trial: true,
        on_finish: function (data) { processPrivateShareData(data, firebaseUid); }
    };

    var privateShareNoAnswer = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: ['<p>Press 1 for the left option and 5 for the right option.</p>'],
        choices: [],
        timing_stim: NO_ANSWER_SCREEN_TIME,
        timing_response: NO_ANSWER_SCREEN_TIME,
        response_ends_trial: false,
    };

    var privateShareCondition = {
        timeline: [privateShareNoAnswer],
        conditional_function: function() {
            return jsPsych.data.getLastTrialData().key_press === -1;  // show information if no response
        },
    }

    var privateShareLoop = {
        timeline: [privateShareScreen, privateShareCondition],
        loop_function: function(data) {
            return data[0].key_press === -1;  // loop if no response
        }
    }

    var likertScreen = {    // dummy
        type: 'single-stim',
        is_html: true,
        stimulus: '',
        choices: ['1', '2', '3', '4', '5'],
        timing_response: LIKERT_CHOICE_TIME,
        response_ends_trial: true,
        on_finish: function(data) { processSelfTrialData(data, firebaseUid); }
    }

    var likertNoAnswer = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: ['<p>Press a number between 1 and 5.</p>'],
        choices: [],
        timing_stim: NO_ANSWER_SCREEN_TIME,
        timing_response: NO_ANSWER_SCREEN_TIME,
        response_ends_trial: false,
    };

    var likertCondition = {
        timeline: [likertNoAnswer],
        conditional_function: function() {
            return jsPsych.data.getLastTrialData().key_press === -1;  // show information if no response
        },
    }

    var likertLoop = {
        timeline: [likertScreen, likertCondition],
        loop_function: function(data) {
            return data[0].key_press === -1;  // loop if no response
        }
    }


    // add <numTrialsPerType> self trials and <numTrialsPerType number> trials in random order
    function addTrialsRandomly(numTrialsPerType, isTraining) {
        for (var i = 0, j = 0; i < numTrialsPerType || j < numTrialsPerType;) {
            var randInt = random_int(1, 2);
            if (i < numTrialsPerType && (randInt === 1 || j === numTrialsPerType)) {
                allTimeline.push(
                    newNumberTrial(numberScreen),
                    newPrivateShareLoop(privateShareLoop, true, isTraining)
                );
                ++i;
            }
            if (j < numTrialsPerType && (randInt === 2 || i === numTrialsPerType)) {
                allTimeline.push(
                    newLikertLoop(likertLoop, isTraining),
                    newPrivateShareLoop(privateShareLoop, false, isTraining)
                );
                ++j;
            }
        }
    }


    // EXPERIMENT TIMELINE
    //   Instructions
    for (var i in beginningInstructions) {
        allTimeline.push(beginningInstructions[i]);
    }

    //   Training trials
    allTimeline.push(syncingScreen);
    addTrialsRandomly(NUM_TRAINING, true);

    //   Instruction
    allTimeline.push(middleInstruction);

    //   First block of actual trials
    allTimeline.push(syncingScreen);
    addTrialsRandomly(NUM_TRIALS_PER_TYPE_PER_BLOCK, false);

    //   Break
    allTimeline.push(breakScreen);

    //   Second block of actual trials
    allTimeline.push(syncingScreen);
    addTrialsRandomly(NUM_TRIALS_PER_TYPE_PER_BLOCK, false);

    //   Ending
    allTimeline.push(endInstruction);
});
