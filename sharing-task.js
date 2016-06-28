var allTimeline = [];

// HELPER FUNCTIONS
function random_int(min, max) {  // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function rand_card_side() {
    var privSide, shareSide;
    if (random_int(1, 2) == 1) {
        privSide = 'left';
        shareSide = 'right';
    } else {
        privSide = 'right';
        shareSide = 'left';
    }
    privateCardBeginning = '<div id="' + privSide + '-side" class="' + privateColor + ' center-content cards ' + privSide + '"><p>PRIVATE</p>';
    shareCardBeginning = '<div id="' + shareSide + '-side"class="' + shareColor + ' center-content cards ' + shareSide + '"><p>SHARE</p>';
}

function afterChoice(response, num_choices) {
    if (num_choices == 2) {  // private/share choice
        afterPrivateShareChoice(response);
    } else {

    }
    setTimeout(function() {
        var sent = '<p class="fixed-position-below small green">Information sent</p>';
        $('#jspsych-single-stim-stimulus').append(sent);
    }, random_int(300, 600));
}

function afterPrivateShareChoice(response) {
    var chosen;
    if (response == 49) {  // 1: left
        chosen = document.getElementById("left-side");
    } else {  // 5: right
        chosen = document.getElementById("right-side");
    }
    chosen.classList.add("red-border");
}

// CONSTANTS
//   Experimental settings
var NUM_CARDS = 5,
    NUM_LIKERT_CHOICES = 5;

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
    NO_ANSWER_SCREEN_TIME = 2000;

//   Instructions
var PRESS_SPACE = '<p class="fixed-position-below small">Please press the space bar to continue</p>',
    TAB = '&nbsp;&nbsp;&nbsp;&nbsp;',
    TWO_TAB = TAB + TAB,
    THREE_TAB = TWO_TAB + TAB,
    NUMBER = '<p class="large fixed-position-above green">NUMBER</p>',
    SELF = '<p class="large fixed-position-above green">SELF</p>';

//   Choices
var privateCardBeginning, shareCardBeginning;
rand_card_side(privateCardBeginning, shareCardBeginning, privateColor, shareColor);

//  TRIALS
var syncingScreen = {
    type: 'multi-stim-multi-response',
    is_html: true,
    stimuli: [
        '<p>Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait&nbsp;&nbsp;&nbsp;</p>',
        '<p>Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait.&nbsp;&nbsp;</p>',
        '<p>Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait..&nbsp;</p>',
        '<p>Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait...</p>',
        '<p>Get Ready!</p>'
    ],
    choices: [],
    timing_stim: [SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, SYNC_TIME/4, GET_READY_TIME],
    timing_response: SYNC_TIME + GET_READY_TIME,
    response_ends_trial: false,
};

var numberScreen = {
    type: 'single-stim',
    is_html: true,
    stimulus: NUMBER +
              '<p>The number for this trial is</p>' +
              '<p class="very-large center-content">' + random_int(1, 5).toString() + '</p>',
    choices: [],
    timing_response: NUMBER_TIME,
    response_ends_trial: false,
};

var privateShareScreen = {
    type: 'single-stim',
    is_html: true,
    stimulus: NUMBER +  // TODO or SELF???
              '<div class="two-cards">' + privateCardBeginning + PENNIES[0] + '</div>' +
              shareCardBeginning + PENNIES[3] + '</div></div>',
    choices: ['1', '5'],
    timing_response: PRIVATE_SHARE_TIME,
    response_ends_trial: true,
    on_finish: rand_card_side   // TODO check data to see whether responsed
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

var likertScreen = {
    type: 'single-stim',
    is_html: true,
    stimulus: SELF +
              '<div class="two-cards">test</div>',
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

// EXPERIMENTAL TIMELINE START
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
}, {
    type: 'instructions',
    pages: [
        '<p>Please find the experimenter now to ask any questions about the task.<br/><br/>If you understand these instructions, please find the experimenter to BEGIN</p>' +
        'NEED TO CHANGE THIS',    // TODO
    ],
    key_forward: '=',
});
*/
//   End of instructions
//   Training trials start

allTimeline.push(
    // syncingScreen,
    // numberScreen,
    likertLoop
);



jsPsych.init({
    display_element: $('#jspsych-target'),
    timeline: allTimeline,
    // fullscreen: true
});
