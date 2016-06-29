// CONSTANTS
//   Experimental settings
var NUM_CARDS = 5,
    NUM_LIKERT_CHOICES = 5,  // if this is changed, .css and everything related to Likert also need changes
    NUM_TRAINING = 2,
    NUM_TRIALS_PER_TYPE_PER_BLOCK = 5;   // there's one block before break and one block after

//   Pictures
var PENNIES = ['<img src="img/penny1.png">', '<img src="img/penny2.png">', '<img src="img/penny3.png">', '<img src="img/penny4.png">'];

//   Colors
var shareColor = random_int(1, 2) == 1 ? 'blue' : 'yellow',
    privateColor = shareColor == 'blue' ? 'yellow' : 'blue';

//   Times
var ROLE_TIME = 1000,    // assigning roles
    PRIVATE_SHARE_TIME = 2500,
    LIKERT_CHOICE_TIME = 4000,
    NUMBER_TIME = 4000,
    SYNC_TIME = 1000,
    GET_READY_TIME = 2000,
    NO_ANSWER_SCREEN_TIME = 2000,
    BREAK_TIME = 5000;

//   Instructions
var PRESS_SPACE = '<p class="fixed-position-below small">Please press the space bar to continue</p>',
    TAB = '&nbsp;&nbsp;&nbsp;&nbsp;',
    TWO_TAB = TAB + TAB,
    THREE_TAB = TWO_TAB + TAB,
    NUMBER = '<p class="large fixed-position-above green">NUMBER</p>',
    SELF = '<p class="large fixed-position-above green">SELF</p>',
    SYNC = '<p>Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait',
    BREAK = '<p class="center-content">You are half way done!  Please take a short break now.<br/><br/>The task will resume in ' +
            BREAK_TIME/1000 + ' seconds.</p>',
    LIKERT_DIV = '<div class="likert">' +
                    '<div id="one" class="cell"><p>1<br/><span class="small">Strongly disagree</span></p></div>' +
                    '<div id="two" class="cell"><p>2</p></div>' +
                    '<div id="three" class="cell"><p>3</p></div>' +
                    '<div id="four" class="cell"><p>4</p></div>' +
                    '<div id="five" class="cell"><p>5<br/><span class="small">Strongly agree</span></p></div>' +
                  '</div>';


// HELPER FUNCTIONS
function shuffle_array(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function random_int(min, max) {  // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function rand_card_side(privateColor, shareColor) {
    var privSide, shareSide;
    if (random_int(1, 2) === 1) {
        privSide = 'left';
        shareSide = 'right';
    } else {
        privSide = 'right';
        shareSide = 'left';
    }
    return {
        privateBeginning: '<div id="' + privSide + '-side" class="' + privateColor + ' center-content cards ' + privSide + '"><p>PRIVATE</p>',
        shareBeginning: '<div id="' + shareSide + '-side"class="' + shareColor + ' center-content cards ' + shareSide + '"><p>SHARE</p>'
    };
}

function afterChoice(response, num_choices) {
    if (num_choices !== 2 && num_choices !== 5) {
        return;
    }
    var chosen;
    if (num_choices === 2) {  // private/share choice
        chosen = afterPrivateShareChoice(response);
        if (chosen.innerHTML.indexOf('SHARE') != -1) {  // SHARE was chosen
            setTimeout(function() {
                var sent = '<p class="fixed-position-below small green">Information sent</p>';
                $('#jspsych-single-stim-stimulus').append(sent);
            }, random_int(300, 600));
        }
    } else {                 // Likert choice
        chosen = afterLikertChoice(response);
    }
    chosen.style.borderColor = "red";
}

function afterPrivateShareChoice(response) {
    var chosen;
    if (response == 49) {  // 1: left
        chosen = document.getElementById("left-side");
    } else {  // 5: right
        chosen = document.getElementById("right-side");
    }
    return chosen;
}

function afterLikertChoice(response) {
    var chosen;
    switch(response) {
        case 49: chosen = document.getElementById("one"); break;
        case 50: chosen = document.getElementById("two"); break;
        case 51: chosen = document.getElementById("three"); break;
        case 52: chosen = document.getElementById("four"); break;
        case 53: chosen = document.getElementById("five"); break;
        default: break;
    }
    return chosen;
}

//   Functions making deep copies of trials
function newPrivateShareTrial(trial, prevTrialIsNumber) {
    var copy = jQuery.extend(true, {}, trial);

    // Randomize side
    var tempPair = rand_card_side(privateColor, shareColor);
    var privateCardBeginning = tempPair.privateBeginning,
        shareCardBeginning = tempPair.shareBeginning;
    // new stimulus
    copy['stimulus'] = prevTrialIsNumber ? NUMBER : SELF;
    copy['stimulus'] += '<div class="two-cards">' + privateCardBeginning + PENNIES[random_int(0, 3)] + '</div>';
    copy['stimulus'] += shareCardBeginning + PENNIES[random_int(0, 3)] + '</div></div>';
    return copy;
}

function newPrivateShareLoop(loop, prevTrialIsNumber) {
    var copy = jQuery.extend(true, {}, loop);
    copy['timeline'][0] = newPrivateShareTrial(loop['timeline'][0], prevTrialIsNumber);  // only timeline[0] needs new value
    return copy;
}

function newLikertTrial (trial, isTraining) {
    var copy = jQuery.extend(true, {}, trial);
    // new stimulus
    copy['stimulus'] = SELF;
    copy['stimulus'] += '<p class="fixed-position-mid">' + (isTraining ? statements_train[trainStmtIndex++] : statements[statementIndex++]) + '</p>';
    copy['stimulus'] += LIKERT_DIV;
    return copy;
}

function newLikertLoop(loop, isTraining) {
    var copy = jQuery.extend(true, {}, loop);
    copy['timeline'][0] = newLikertTrial(loop['timeline'][0], isTraining);  // only timeline[0] needs new value
    return copy;
}

function newNumberTrial(trial) {
    var copy = jQuery.extend(true, {}, trial);
    // new stimulus
    copy['stimulus'] = NUMBER + '<p>The number for this trial is</p>';
    copy['stimulus'] += '<p class="very-large center-content">' + random_int(1, 5).toString() + '</p>';
    return copy;
}

// Indexes
var statementIndex = 0,
    trainStmtIndex = 0;

$(document).ready(function() {
    // RANDOMIZATION
    //   Choices
    var tempPair = rand_card_side(privateColor, shareColor);
    var privateCardBeginning = tempPair.privateBeginning,
        shareCardBeginning = tempPair.shareBeginning;

    shuffle_array(statements);
    shuffle_array(statements_train);
    var training = true;

    //  TRIALS
    var syncingScreen = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            SYNC + '&nbsp;&nbsp;&nbsp;</p>',
            SYNC + '.&nbsp;&nbsp;</p>',
            SYNC + '..&nbsp;</p>',
            SYNC + '...</p>',
            '<p>Get Ready!</p>'
        ],
        choices: [],
        timing_stim: [SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, GET_READY_TIME],
        timing_response: SYNC_TIME + GET_READY_TIME,
        response_ends_trial: false,
    };

    var breakScreen = {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            BREAK + '<p class="large center-content"><br/>5</p>',
            BREAK + '<p class="large center-content"><br/>4</p>',
            BREAK + '<p class="large center-content"><br/>3</p>',
            BREAK + '<p class="large center-content"><br/>2</p>',
            BREAK + '<p class="large center-content"><br/>1</p>',
        ],
        choices: [],
        timing_stim: [BREAK_TIME/5, BREAK_TIME/5, BREAK_TIME/5, BREAK_TIME/5, BREAK_TIME/5],
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
    /*allTimeline.push({
        type: 'instructions',
        pages: [
            '<p class="center-content">Welcome to the study!<br/><br/>Press the space bar to find out your role.</p>'
        ],
        key_forward: 'space',
    }, {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            '<p>Assigning your role. Please wait&nbsp;&nbsp;&nbsp;</p>',
            '<p>Assigning your role. Please wait.&nbsp;&nbsp;</p>',
            '<p>Assigning your role. Please wait..&nbsp;</p>',
            '<p>Assigning your role. Please wait...</p>',
        ],
        choices: [],
        timing_stim: [ROLE_TIME/4, ROLE_TIME/4, ROLE_TIME/4, ROLE_TIME/4],
        timing_response: ROLE_TIME,
        response_ends_trial: false,
    }, {
        type: 'instructions',
        pages: [
            '<p class="small">You have been assigned the role of:  SHARER<br/>' +
            'This means that you will be creating information throughout the task.<br/><br/>' +
            'Your study partner has been assigned the role of:  RECEIVER<br/>' +
            'This means that he/she will be receiving information throughout the task.<br/><br/><br/></p>' +
            PRESS_SPACE,

            '<p>As the SHARER, there will be two types of information that you will generate.</p>' +
            PRESS_SPACE,

            '<p>On some trials, you will be shown a number. On these trials, you will see the word NUMBER at the top of the screen, ' +
            'and you will be presented with a number between 1 and ' + NUM_CARDS + '. This screen will stay up for ' + NUMBER_TIME/1000 + ' seconds.</p>' +
            PRESS_SPACE,

            '<p class="small">On other trials, you will answer a question about yourself - your own preferences, habits or opinions. ' +
            'On these trials, you will see the word SELF at the top of the screen, as well as a statement, such as <br/><br/>' +
            TAB + '"I enjoy skiing or snowboarding."<br/><br/>' +
            'Your task is to rate how much you agree with the statement from 1 (strongly disagree) to ' + NUM_LIKERT_CHOICES + ' (strongly agree). ' +
            'You can make your rating by pressing the corresponding number key (1-' + NUM_LIKERT_CHOICES + ') at the top of the keyboard. ' +
            'You will have ' + LIKERT_CHOICE_TIME/1000 + ' seconds to make your rating. This screen will stay up for the entire ' + LIKERT_CHOICE_TIME/1000 + ' seconds.</p>' +
            PRESS_SPACE,

            '<p class="small">After each NUMBER and SELF trial, you will have to choose what to do with the information (your answer to the question or the number). ' +
            'You will have two options: share the information with your partner, or keep it private. ' +
            'Each of these choices will be paired with a variable amount of money, between 1 and 4 cents, that you can earn by choosing that option.</p>' +
            PRESS_SPACE,

            '<ul class="small"><li>For example: you may be given the option of sharing your SELF answer and making $0.03, ' +
            'or keeping your SELF answer private and making $0.04.<br/><br/></li>' +
            '<li style="text-align: center;">SHARE' + THREE_TAB + THREE_TAB + 'PRIVATE<br/><br/>' +
            '[3 pennies]'+ THREE_TAB + TWO_TAB + '[4 pennies]<br/><br/></li>' +
            '<li>You should make your choice by pressing 1 for the left option (SHARE) and ' + NUM_CARDS + ' for the right option (PRIVATE). ' +
            'You will have ' + PRIVATE_SHARE_TIME/1000 + ' seconds to make your choice. This screen will stay up for the entire ' + PRIVATE_SHARE_TIME/1000 + ' seconds.</li></ul>' +
            PRESS_SPACE,

            '<p>It is important to remember that we will actually pay you these amounts at the end of the experiment; ' +
            'based on your choices, you will earn money in addition to the credit you are already earning for your participation.</p>' +    // TODO ?
            PRESS_SPACE,

            '<p>Critically, ' + 'you will be generating information for your study partner in this experiment. ' +
            'This other participant is sitting in the room adjacent to yours NEED TO CHANGE THIS. When you choose to share the SELF or NUMBER information, ' +  // TODO
            'it will be displayed to your partner in the other room.</p>' +
            PRESS_SPACE,

            '<p>Let\'s try a few to get a feel for the task.</p>' + PRESS_SPACE,

        ],
        key_forward: 'space',
    });
    */

    //   Training trials
    addTrialsRandomly(NUM_TRAINING, true);
    //   Instruction
    allTimeline.push({
        type: 'instructions',
        pages: [
            '<p>Please find the experimenter now to ask any questions about the task.<br/><br/>If you understand these instructions, please find the experimenter to BEGIN</p>' +
            'NEED TO CHANGE THIS',    // TODO
        ],
        key_forward: '=',
    });
    //   First block of actual trials
    addTrialsRandomly(NUM_TRIALS_PER_TYPE_PER_BLOCK, false);
    //   Break
    allTimeline.push(breakScreen);
    //   Second block of actual trials
    addTrialsRandomly(NUM_TRIALS_PER_TYPE_PER_BLOCK, false);
    //   Ending instruction
    allTimeline.push({
        type: 'instructions',
        pages: [
            'Thank you for participanting!'
        ],
        key_forward: 'space',
    });

    jsPsych.init({
        display_element: $('#jspsych-target'),
        timeline: allTimeline,
        // fullscreen: true
    });
});
