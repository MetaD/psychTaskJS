$(document).ready(function() {
    // RANDOMIZATION
    shuffle_array(statements);
    shuffle_array(statements_train);

    // TRIALS
    var syncingScreen = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            '<p>' + SYNC + '&nbsp;&nbsp;&nbsp;</p>',
            '<p>' + SYNC + '.&nbsp;&nbsp;</p>',
            '<p>' + SYNC + '..&nbsp;</p>',
            '<p>' + SYNC + '...</p>',
            '<p>Get Ready!</p>'
        ],
        choices: [],
        timing_stim: [SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, GET_READY_TIME],
        timing_response: SYNC_TIME + GET_READY_TIME,
        response_ends_trial: false,
    };

    var breakStimuli = [], breakTiming = [];
    for (var i = BREAK_TIME/1000; i > 0; --i) {
        breakStimuli.push('<p class="center-content">' + BREAK + '</p><p class="large center-content"><br/>' + i.toString() + '</p>');
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
    };

    var privateShareScreen = {  // dummy
        type: 'single-stim',
        is_html: true,
        stimulus: '',
        choices: ['1', '5'],
        timing_response: PRIVATE_SHARE_TIME,
        response_ends_trial: true,
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


    // add numTrialsPerType self trials and numTrialsPerType number trials in random order
    function addTrialsRandomly(numTrialsPerType, isTraining) {
        for (var i = 0, j = 0; i < numTrialsPerType || j < numTrialsPerType;) {
            var randInt = random_int(1, 2);
            if (i < numTrialsPerType && (randInt === 1 || j === numTrialsPerType)) {
                allTimeline.push(
                    newNumberTrial(numberScreen),
                    newPrivateShareLoop(privateShareLoop, true)
                );
                ++i;
            }
            if (j < numTrialsPerType && (randInt === 2 || i === numTrialsPerType)) {
                allTimeline.push(
                    newLikertLoop(likertLoop, isTraining),
                    newPrivateShareLoop(privateShareLoop, false)
                );
                ++j;
            }
        }
    }


    // EXPERIMENT START
    var allTimeline = [];
    //   Instructions
    for (var i in beginningInstructions) {
        allTimeline.push(beginningInstructions[i]);
    }

    //   Training trials
    allTimeline.push(syncingScreen);
    addTrialsRandomly(NUM_TRAINING, true);

    //   Instruction
    allTimeline.push({
        type: 'instructions',
        pages: [
            '<p>Please find the experimenter now to ask any questions about the task.<br/><br/>If you understand these instructions, please find the experimenter to BEGIN</p>',
        ],
        key_forward: '=',
    });

    //   First block of actual trials
    allTimeline.push(syncingScreen);
    addTrialsRandomly(NUM_TRIALS_PER_TYPE_PER_BLOCK, false);

    //   Break
    allTimeline.push(breakScreen);

    //   Second block of actual trials
    allTimeline.push(syncingScreen);
    addTrialsRandomly(NUM_TRIALS_PER_TYPE_PER_BLOCK, false);

    //   Ending instruction
    allTimeline.push({
        type: 'instructions',
        pages: [
            'Thank you for participanting!'
        ],
        key_forward: 'space',
    });

    // INITIALIZATION
    jsPsych.init({
        display_element: $('#jspsych-target'),
        timeline: allTimeline,
        // fullscreen: true
    });
});
