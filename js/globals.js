// CONSTANTS
//   Experimental settings
var NUM_LIKERT_CHOICES = 5,  // if this is changed, .css and everything related to Likert must also change
    NUM_TRAINING = 1,
    NUM_TRIALS_PER_TYPE_PER_BLOCK = 1;   // there are two blocks separated by a break

//   Times (in ms)
var ASSIGNING_ROLE_TIME = 1000,
    PRIVATE_SHARE_TIME = 2500,
    LIKERT_CHOICE_TIME = 4000,
    NUMBER_TIME = 4000,
    SYNC_TIME = random_int(5000, 10000),
    GET_READY_TIME = 2000,
    NO_ANSWER_SCREEN_TIME = 2000,
    BREAK_TIME = 10000;

//   Pictures
var PENNIES = ['<img src="img/penny1.png">', '<img src="img/penny2.png">', '<img src="img/penny3.png">', '<img src="img/penny4.png">'];

//   Texts
var TAB = '&nbsp;&nbsp;&nbsp;&nbsp;',
    TWO_TAB = TAB + TAB,
    THREE_TAB = TWO_TAB + TAB,
    NUMBER = '<p class="large fixed-position-above green">NUMBER</p>',
    SELF = '<p class="large fixed-position-above green">SELF</p>',
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

function rand_card_attributes() {
    // Randomize private/share color and side
    var shareColor = random_int(1, 2) === 1 ? 'blue' : 'yellow',
        privateColor = shareColor === 'blue' ? 'yellow' : 'blue';

    var privSide = (random_int(1, 2) === 1) ? 'left' : 'right', 
        shareSide = (privSide === 'left') ? 'right' : 'left';

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
    var tempPair = rand_card_attributes();
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
