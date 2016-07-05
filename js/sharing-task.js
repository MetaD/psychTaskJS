$(document).ready(function() {
    // RANDOMIZATION
    shuffle_array(statements);
    shuffle_array(statements_train);

    // TRIALS
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
        on_finish: function(data) {
            var strBeforeNum = '"very-large center-content">';
            var number = parseInt(data.stimulus[data.stimulus.indexOf(strBeforeNum) + strBeforeNum.length]);
            jsPsych.data.addDataToLastTrial({
                type: 'number',
                number: number
            });
        }
    };

    var privateShareScreen = {  // dummy
        type: 'single-stim',
        is_html: true,
        stimulus: '',
        choices: ['1', '5'],
        timing_response: PRIVATE_SHARE_TIME,
        response_ends_trial: true,
        on_finish: function(data) {
            var trialType = (data.stimulus.indexOf('>SELF<') === -1) ? 'number-choice' : 'self-choice';

            // get values
            var left, right, privateVal, shareVal, earnedVal;
            var firstVal = parseInt(data.stimulus[data.stimulus.indexOf('penny') + 5]),
                secondVal = parseInt(data.stimulus[data.stimulus.lastIndexOf('penny') + 5]);
            var shareIsFirst = data.stimulus.indexOf('SHARE') < data.stimulus.indexOf('PRIVATE'),
                leftIsFirst = data.stimulus.indexOf('left-side') < data.stimulus.indexOf('right-side');
            if ((shareIsFirst && leftIsFirst) || (!shareIsFirst && !leftIsFirst)) {
                // 'share' is on the left side
                left = 'share';
                right = 'private';
            } else {
                // 'private' is on the left side
                left = 'private';
                right = 'share';
            }
            if (shareIsFirst) {
                shareVal = firstVal;
                privateVal = secondVal;
            } else {
                privateVal = firstVal;
                shareVal = secondVal;
            }

            // get response and earning
            var response;
            switch (data.key_press) {
            case 49:
                response = left;
                earnedVal = (response === 'share') ? shareVal : privateVal;
                break;
            case 53:
                response = right;
                earnedVal = (response === 'share') ? shareVal : privateVal;
                break;
            default:
                response = null;
                earnedVal = 0;
                break;
            }

            jsPsych.data.addDataToLastTrial({
                type: trialType,
                response: response,
                private_value: privateVal,
                share_value: shareVal,
                earned_value: earnedVal
            });
        }
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
        on_finish: function(data) {
            var strBeforeStatement = '<p class="fixed-position-mid">',
                strAfterStatement = '</p><div class="likert">';
            var statementStartIdx = data.stimulus.indexOf(strBeforeStatement) + strBeforeStatement.length,
                statementEndIdx = data.stimulus.indexOf(strAfterStatement);
            var statement = data.stimulus.substring(statementStartIdx, statementEndIdx);

            var response;
            switch (data.key_press) {
                case 49: response = 1; break;
                case 50: response = 2; break;
                case 51: response = 3; break;
                case 52: response = 4; break;
                case 53: response = 5; break;
                default: response = null; break;
            }
            jsPsych.data.addDataToLastTrial({
                type: 'self',
                statement: statement,
                number: response,
            });
        }
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


    // START
    function startExperiment() {
        // Start the experiment
        jsPsych.init({
            display_element: $('#jspsych-target'),
            timeline: allTimeline,
            on_finish: function() {
                // A helper function creating an associative array
                function getInitialDistribution() {
                    var dist = {};
                    for (var i = -3; i < 4; ++i) {
                        dist[i] = [0, 0];   // when (value_of_share - value_of_private === i): [num_of_shared_trials, total_num_of_-3_trials]
                    }
                    return dist;
                }

                var data = jsPsych.data.getData();
                // Process data
                var totalEarning = 0,
                    numChoiceDistribution = getInitialDistribution(),
                    selfChoiceDistribution = getInitialDistribution();

                for (var i in data) {
                    var trialData = data[i];
                    if (!trialData.type || !trialData.response) {
                        continue;
                    }
                    if (trialData.type === 'self-choice' || trialData.type === 'number-choice') {
                        totalEarning += trialData.earned_value;

                        var relativeValue = trialData.share_value - trialData.private_value;
                        var dist = (trialData.type === 'self-choice') ? selfChoiceDistribution : numChoiceDistribution;
                        var relValArray = dist[relativeValue];
                        ++relValArray[1];
                        if (trialData.response === 'share') {
                            ++relValArray[0];
                        }
                    }
                }
                console.log([totalEarning, selfChoiceDistribution, numChoiceDistribution]);
                // Save data
            }
        });
    }

    // Load images and then call startExperiment()
    jsPsych.pluginAPI.preloadImages(PENNIES, startExperiment);
});
