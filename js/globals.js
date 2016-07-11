// CONSTANTS
//   Experimental settings
var NUM_LIKERT_CHOICES = 5,  // if this is changed, .css and everything related to Likert must also change
    NUM_TRAINING = 1,   // per type
    NUM_TRIALS_PER_TYPE_PER_BLOCK = 1;   // there are two blocks separated by a break

//   Times (in ms)
var FIND_PARTNER_TIME = random_int(300, 700),
    ASSIGNING_ROLE_TIME = random_int(100, 1000),
    PRIVATE_SHARE_TIME = 2500,
    LIKERT_CHOICE_TIME = 4000,
    NUMBER_TIME = 400,      // Time for showing the random number
    SYNC_TIME = random_int(200, 500),
    GET_READY_TIME = 200,
    NO_ANSWER_SCREEN_TIME = 200,
    BREAK_TIME = 1000;

//   Pictures
var REWARDS
 = ['img/star1.png', 'img/star2.png', 'img/star3.png', 'img/star4.png'];
var IMG_NAME_BEFORE_VALUE = 'star';    // Make sure in the image file name, the number appearing after this string indicates the image value

//   Colors
var PRIVATE_SHARE_COLORS = ['yellow', 'blue'],
    CHOICE_COLOR = 'red',   // border color of the chosen card
    TITLE_COLOR = 'green',  // the title "NUMBER"/"SELF"
    INFO_SENT_COLOR = 'green';
//    assign private/share colors
var randInt = random_int(0, 1);
var shareColor = PRIVATE_SHARE_COLORS[randInt],
    privateColor = PRIVATE_SHARE_COLORS[1 - randInt];

//   Texts
var SHARE = 'SHARE',
    PRIVATE = 'PRIVATE',
    NUMBER = 'NUMBER',
    SELF = 'SELF',
    INFO_SENT = 'Information sent',
    LIKERT_DIV = '<div class="likert">' +
                    '<div id="one" class="cell"><p>1<br/><span class="small">Strongly disagree</span></p></div>' +
                    '<div id="two" class="cell"><p>2</p></div>' +
                    '<div id="three" class="cell"><p>3</p></div>' +
                    '<div id="four" class="cell"><p>4</p></div>' +
                    '<div id="five" class="cell"><p>5<br/><span class="small">Strongly agree</span></p></div>' +
                  '</div>',
    TAB = '&nbsp;&nbsp;&nbsp;&nbsp;',
    THREE_TAB = TAB + TAB + TAB;
//    add HTML
NUMBER = '<p class="large fixed-position-above ' + TITLE_COLOR + '">' + NUMBER + '</p>';
SELF = '<p class="large fixed-position-above ' + TITLE_COLOR + '">' + SELF + '</p>';


// RESULTS (shown to participants at the end)
var results = {
    totalEarning: 0,
    highestPossibleEarning: 0
};



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

function rand_card_attributes() {
    // Randomize private/share sides
    var privSide = (random_int(1, 2) === 1) ? 'left' : 'right', 
        shareSide = (privSide === 'left') ? 'right' : 'left';

    return {
        privateBeginning: '<div id="' + privSide + '-side" class="' + privateColor + ' center-content cards ' + privSide + '"><p>' + PRIVATE + '</p>',
        shareBeginning: '<div id="' + shareSide + '-side"class="' + shareColor + ' center-content cards ' + shareSide + '"><p>' + SHARE + '</p>'
    };
}

function afterChoice(response, num_choices) {
    if (num_choices !== 2 && num_choices !== 5) {
        return;
    }
    var chosen;
    if (num_choices === 2) {  // private/share choice
        chosen = afterPrivateShareChoice(response);
        if (chosen.innerHTML.indexOf(SHARE) != -1 && !document.getElementById("is-training")) {  // SHARE was chosen in a non-training trial
            setTimeout(function() {
                $('#jspsych-single-stim-stimulus').append(INFO_SENT_INSTR);
            }, random_int(300, 600));
        }
    } else {                 // Likert choice
        chosen = afterLikertChoice(response);
    }
    chosen.style.borderColor = CHOICE_COLOR;
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
function newPrivateShareTrial(trial, prevTrialIsNumber, isTraining) {
    var copy = jQuery.extend(true, {}, trial);

    // Randomize side
    var tempPair = rand_card_attributes();
    var privateCardBeginning = tempPair.privateBeginning,
        shareCardBeginning = tempPair.shareBeginning;
    // new stimulus
    copy['stimulus'] = prevTrialIsNumber ? NUMBER : SELF;
    copy['stimulus'] += '<div class="two-cards">' + privateCardBeginning + '<img class="reward" src="' + REWARDS[random_int(0, 3)] + '"></div>';
    copy['stimulus'] += shareCardBeginning + '<img class="reward" src="' + REWARDS[random_int(0, 3)] + '"></div></div>';
    if (isTraining) {
        copy['stimulus'] += '<div id="is-training"></div>';  // dummy div marking this trial as training
    }
    return copy;
}

function newPrivateShareLoop(loop, prevTrialIsNumber, isTraining) {
    var copy = jQuery.extend(true, {}, loop);
    copy['timeline'][0] = newPrivateShareTrial(loop['timeline'][0], prevTrialIsNumber, isTraining);  // only timeline[0] needs new value
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


// Data processors
function processPrivateShareData(data, userId) {
    var trialType = (data.stimulus.indexOf(SELF) === -1) ? 'number-choice' : 'self-choice';

    // get values
    var left, right, privateVal, shareVal, earnedVal;
    var firstVal = parseInt(data.stimulus[data.stimulus.indexOf(IMG_NAME_BEFORE_VALUE) + IMG_NAME_BEFORE_VALUE.length]),
        secondVal = parseInt(data.stimulus[data.stimulus.lastIndexOf(IMG_NAME_BEFORE_VALUE) + IMG_NAME_BEFORE_VALUE.length]);
    var shareIsFirst = data.stimulus.indexOf(SHARE) < data.stimulus.indexOf(PRIVATE),
        leftIsFirst = data.stimulus.indexOf('left-side') < data.stimulus.indexOf('right-side');
    if ((shareIsFirst && leftIsFirst) || (!shareIsFirst && !leftIsFirst)) {
        // 'share' is on the left side
        left = SHARE;
        right = PRIVATE;
    } else {
        // 'private' is on the left side
        left = PRIVATE;
        right = SHARE;
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
        earnedVal = (response === SHARE) ? shareVal : privateVal;
        break;
    case 53:
        response = right;
        earnedVal = (response === SHARE) ? shareVal : privateVal;
        break;
    default:
        response = null;
        earnedVal = 0;
        break;
    }

    // Update results for participants
    results.totalEarning += data.earned_value;
    results.highestPossibleEarning += data.share_value > data.private_value ? data.share_value : data.private_value;

    sendToDatabase({
        type: trialType,
        trial_index: data.trial_index,
        stimulus: data.stimulus,
        rt: data.rt,
        response: response,
        private_value: privateVal,
        share_value: shareVal,
        earned_value: earnedVal
    }, userId);
}

function processNumberTrialData(data, userId) {
    console.log(data);
    var strBeforeNum = '<p class="very-large center-content">';
    var number = parseInt(data.stimulus[data.stimulus.indexOf(strBeforeNum) + strBeforeNum.length]);
    sendToDatabase({
        type: 'number',
        trial_index: data.trial_index,
        stimulus: data.stimulus,
        rt: data.rt,
        number: number
    }, userId);
}

function processSelfTrialData(data, userId) {
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
    
    sendToDatabase({
        type: 'self',
        trial_index: data.trial_index,
        stimulus: data.stimulus,
        rt: data.rt,
        statement: statement,
        number: response
    }, userId);
}

function sendToDatabase(data, userId) {
    // Firebase
    var newDataKey = firebase.database().ref().child(userId).push().key;
    var path = '/' + userId + '/' + newDataKey + '/';
    firebase.database().ref(path).set(data);
}

// Indexes
var statementIndex = 0,
    trainStmtIndex = 0;
