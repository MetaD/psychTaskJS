// Instruction texts
var CONTINUE_INSTR = 'Please press right arrow to continue';
var CONTINUE_BACK_INSTR = 'Please press right arrow to continue, or left arrow to go back';
var SYNC_INSTR = 'Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait';
var BREAK_INSTR = 'You are half way done!  Please take a short break now.<br/><br/>The task will resume in ' + BREAK_TIME/1000 + ' seconds.';

var WELCOME_INSTR = 'Welcome to the study!<br/><br/>'
var FIND_PARTNER_INSTR = 'Please wait while we look for a partner for you';

var PARTNER_FOUND_INSTR = 'You are now connected to your study partner\'s computer.<br/><br/>' +
                'Please press the space bar to find out your role.';

var ASSIGN_ROLE_INSTR = 'Assigning your role. Please wait';

var ROLE_ASSIGNED_INSTR = 'You have been assigned the role of:  SHARER<br/>' +
                'This means that you will be creating information throughout the task.<br/><br/>' +
                'Your study partner has been assigned the role of:  RECEIVER<br/>' +
                'This means that he/she will be receiving information throughout the task.';

var SHARER_DUTY_INSTR = 'As the SHARER, there will be two types of information that you will generate.';

var NUMBER_TRIAL_INSTR = 'On some trials, you will be shown a number. On these trials, you will see the word NUMBER at the top of the screen, ' +
                'and you will be presented with a number between 1 and ' + NUM_LIKERT_CHOICES +
                '. This screen will stay up for ' + NUMBER_TIME/1000 + ' seconds.';

var SELF_TRIAL_INSTR = 'On other trials, you will answer a question about yourself - your own preferences, habits or opinions. ' +
                'On these trials, you will see the word SELF at the top of the screen, as well as a statement, such as <br/><br/>' +
                TAB + '"I enjoy skiing or snowboarding."<br/><br/>' +
                'Your task is to rate how much you agree with the statement from 1 (strongly disagree) to ' + NUM_LIKERT_CHOICES + ' (strongly agree). ' +
                'You can make your rating by pressing the corresponding number key (1-' + NUM_LIKERT_CHOICES + ') at the top of the keyboard. ' +
                'You will have ' + LIKERT_CHOICE_TIME/1000 + ' seconds to make your rating. ' +
                'This screen will stay up for the entire ' + LIKERT_CHOICE_TIME/1000 + ' seconds.';

var PRIVATE_SHARE_INSTR = 'After each NUMBER and SELF trial, you will have to choose what to do with the information ' +
                '(your answer to the question or the number). ' +
                'You will have two options: share the information with your partner, or keep it private. ' +
                'Each of these choices will be paired with a variable amount of money, between 1 and 4 cents, ' +
                'that you can earn by choosing that option.';

var PRIVATE_SHARE_EXAMPLE_IMG = ['<img class="reward" src="' + REWARDS[2] + '">', '<img class="reward" src="' + REWARDS[3] + '">'];

var PRIVATE_SHARE_EXAMPLE_INSTR_1 = 'For example: you may be given the option of sharing your SELF answer and earning 3 stars, ' +
                    'or keeping your SELF answer private and earning 4 stars.<br/><br/>';

var PRIVATE_SHARE_EXAMPLE_INSTR_2 = 'SHARE' + THREE_TAB + THREE_TAB + 'PRIVATE<br/>' +
                    PRIVATE_SHARE_EXAMPLE_IMG[0] + THREE_TAB + THREE_TAB + PRIVATE_SHARE_EXAMPLE_IMG[1] + '<br/>';

var PRIVATE_SHARE_EXAMPLE_INSTR_3 = 'You should make your choice by pressing 1 for the left option (SHARE) and ' + NUM_LIKERT_CHOICES +
                    ' for the right option (PRIVATE). You will have ' + PRIVATE_SHARE_TIME/1000 + ' seconds to make your choice. ' +
                    'This screen will stay up for the entire ' + PRIVATE_SHARE_TIME/1000 + ' seconds.';

var EARNING_INSTR = 'It is important to remember that you will actually earn these amounts of credits at the end of the experiment; ' +
                'based on your choices, you will earn extra credits in addition to the credit you are already earning for your participation.';

var RECEIVER_INSTR = 'Critically, you will be generating information for your study partner in this experiment. ' +
                'We have established communication over the Internet between your computer and your partner\'s. ' +
                'When you choose to share the SELF or NUMBER information, it will be displayed to your partner.';

var TRAINING_START_INSTR = 'Let\'s try a few to get a feel for the task.';

var TRAINING_END_INSTR = 'If you have any questions about the task, please contact the experimenter.<br/><br/>' +
            'If you understand these instructions, please press "=" to BEGIN';

var EXPERIMENT_END_INSTR = 'Thank you for participating!';

var RESULTS_INSTR_1 = 'You shared a number for ';
var RESULTS_INSTR_2 = 'You shared information about yourself for ';
var RESULTS_INSTR_3 = 'And you earned ';
var RESULTS_INSTR_4 = ' possible stars!';
var RESULTS_INSTR_OUT_OF = ' out of ';
var RESULTS_INSTR_TIMES = ' times.';

var CLOSE_WINDOW_ALERT = "Do you want to leave this page? Your progress will not be saved.";


// Add HTML
CONTINUE_INSTR = '<p class="fixed-position-below small">' + CONTINUE_INSTR + '</p>';
CONTINUE_BACK_INSTR =  '<p class="fixed-position-below small">' + CONTINUE_BACK_INSTR + '</p>';
WELCOME_INSTR = '<p class="center-content">' + WELCOME_INSTR + '</p><p>' + FIND_PARTNER_INSTR;
PARTNER_FOUND_INSTR = '<p class="center-content">' + PARTNER_FOUND_INSTR + '</p>';
ROLE_ASSIGNED_INSTR = '<p class="small">' + ROLE_ASSIGNED_INSTR + '</p>';
SHARER_DUTY_INSTR = '<p>' + SHARER_DUTY_INSTR + '</p>';
NUMBER_TRIAL_INSTR = '<p>' + NUMBER_TRIAL_INSTR + '</p>';
SELF_TRIAL_INSTR = '<p class="small">' + SELF_TRIAL_INSTR + '</p>';
PRIVATE_SHARE_INSTR = '<p class="small">' + PRIVATE_SHARE_INSTR + '</p>';
PRIVATE_SHARE_EXAMPLE_INSTR_1 = '<ul class="small">' + '<li>' + PRIVATE_SHARE_EXAMPLE_INSTR_1 + '</li>';
PRIVATE_SHARE_EXAMPLE_INSTR_2 = '<li class="center-content">' + PRIVATE_SHARE_EXAMPLE_INSTR_2 + '</li>';
PRIVATE_SHARE_EXAMPLE_INSTR_3 = '<li>' + PRIVATE_SHARE_EXAMPLE_INSTR_3 + '</li>' + '</ul>';
PRIVATE_SHARE_EXAMPLE_INSTR = PRIVATE_SHARE_EXAMPLE_INSTR_1 + PRIVATE_SHARE_EXAMPLE_INSTR_2 + PRIVATE_SHARE_EXAMPLE_INSTR_3;
EARNING_INSTR = '<p>' + EARNING_INSTR + '</p>';
RECEIVER_INSTR = '<p>' + RECEIVER_INSTR + '</p>';
TRAINING_START_INSTR = '<p>' + TRAINING_START_INSTR + '</p>';
TRAINING_END_INSTR = '<p>' + TRAINING_END_INSTR + '</p>';
EXPERIMENT_END_INSTR = '<p class="fixed-position-mid">' + EXPERIMENT_END_INSTR + '</p>';
RESULTS_INSTR_1 = '<div class="fixed-position-mid-below"><p>' + RESULTS_INSTR_1;
RESULTS_INSTR_TIMES = RESULTS_INSTR_TIMES + '<br/>';
RESULTS_INSTR_4 = RESULTS_INSTR_4 + '</p></div>'
INFO_SENT_INSTR = '<p class="fixed-position-below small ' + INFO_SENT_COLOR + '">' + INFO_SENT + '</p>';


// Create jsPsych-instruction objects
var beginningInstructions = [
    {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            WELCOME_INSTR + '&nbsp;&nbsp;&nbsp;</p>',
            WELCOME_INSTR + '.&nbsp;&nbsp;</p>',
            WELCOME_INSTR + '..&nbsp;</p>',
            WELCOME_INSTR + '...</p>',
        ],
        choices: [],
        timing_stim: [FIND_PARTNER_TIME/4, FIND_PARTNER_TIME/4, FIND_PARTNER_TIME/4, FIND_PARTNER_TIME/4],
        timing_response: FIND_PARTNER_TIME,
        response_ends_trial: false,
    },
    {
        type: 'instructions',
        pages: [PARTNER_FOUND_INSTR],
        key_forward: 'space'
    },
    {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            '<p>' + ASSIGN_ROLE_INSTR + '&nbsp;&nbsp;&nbsp;</p>',
            '<p>' + ASSIGN_ROLE_INSTR + '.&nbsp;&nbsp;</p>',
            '<p>' + ASSIGN_ROLE_INSTR + '..&nbsp;</p>',
            '<p>' + ASSIGN_ROLE_INSTR + '...</p>',
        ],
        choices: [],
        timing_stim: [ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4],
        timing_response: ASSIGNING_ROLE_TIME,
        response_ends_trial: false,
    },
    {
        type: 'instructions',
        pages: [
                    ROLE_ASSIGNED_INSTR + CONTINUE_INSTR,
                    SHARER_DUTY_INSTR + CONTINUE_BACK_INSTR,
                    NUMBER_TRIAL_INSTR + CONTINUE_BACK_INSTR,
                    SELF_TRIAL_INSTR + CONTINUE_BACK_INSTR,
                    PRIVATE_SHARE_INSTR + CONTINUE_BACK_INSTR,
                    PRIVATE_SHARE_EXAMPLE_INSTR + CONTINUE_BACK_INSTR,
                    EARNING_INSTR + CONTINUE_BACK_INSTR,
                    RECEIVER_INSTR + CONTINUE_BACK_INSTR,
                    TRAINING_START_INSTR + CONTINUE_BACK_INSTR
                ]
    }
];

var middleInstruction = {   // This appears after training
    type: 'instructions',
    pages: [TRAINING_END_INSTR],
    key_forward: '=',
}

var endInstruction = {
    type: 'multi-stim-multi-response',
    is_html: true,
    stimuli: [EXPERIMENT_END_INSTR],
    prompt: function() {
        // send end time to firebase
        var endTimeUpdate = {};
        endTimeUpdate['/' + firebaseUid + '/end_time'] = (new Date()).toUTCString();
        firebase.database().ref().update(endTimeUpdate).then(function() {
            // sign out anonymous user
            firebase.auth().signOut().then(function() {
                hookWindow = false;  // no alert for closing the window now
            }, function(error) {
                console.log(error);
            });
        });

        var numTrialsPerType = NUM_TRIALS_PER_TYPE_PER_BLOCK * 2;
        return RESULTS_INSTR_1 + results.sharedNumberTrials + RESULTS_INSTR_OUT_OF + numTrialsPerType + RESULTS_INSTR_TIMES +
               RESULTS_INSTR_2 + results.sharedSelfTrials + RESULTS_INSTR_OUT_OF + numTrialsPerType + RESULTS_INSTR_TIMES +
               RESULTS_INSTR_3 + results.totalEarning + RESULTS_INSTR_OUT_OF + results.highestPossibleEarning + RESULTS_INSTR_4;
    },
    choices: [],
    timing_stim: RESULTS_TIME,
    response_ends_trial: false
}
