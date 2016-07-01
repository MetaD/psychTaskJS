// Instruction texts
var PRESS_SPACE_INSTR = 'Please press the space bar to continue',
    SYNC_INSTR = 'Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait',
    BREAK_INSTR = 'You are half way done!  Please take a short break now.<br/><br/>The task will resume in ' + BREAK_TIME/1000 + ' seconds.';

var WELCOME_INSTR = 'Welcome to the study!<br/><br/>Press the space bar to find out your role.';

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

var PRIVATE_SHARE_EXAMPLE_INSTR_1 = 'For example: you may be given the option of sharing your SELF answer and making $0.03, ' +
                    'or keeping your SELF answer private and making $0.04.<br/><br/>';

var PRIVATE_SHARE_EXAMPLE_INSTR_2 = 'SHARE' + THREE_TAB + THREE_TAB + 'PRIVATE<br/><br/>' +
                    '[3 pennies]'+ THREE_TAB + TWO_TAB + '[4 pennies]<br/><br/>';

var PRIVATE_SHARE_EXAMPLE_INSTR_3 = 'You should make your choice by pressing 1 for the left option (SHARE) and ' + NUM_LIKERT_CHOICES +
                    ' for the right option (PRIVATE). You will have ' + PRIVATE_SHARE_TIME/1000 + ' seconds to make your choice. ' +
                    'This screen will stay up for the entire ' + PRIVATE_SHARE_TIME/1000 + ' seconds.';

var EARNING_INSTR = 'It is important to remember that we will actually pay you these amounts at the end of the experiment; ' +
                'based on your choices, you will earn money in addition to the credit you are already earning for your participation.';

var RECEIVER_INSTR = 'Critically, you will be generating information for your study partner in this experiment. ' +
                'This other participant is sitting in the room adjacent to yours NEED TO CHANGE THIS. ' +
                'When you choose to share the SELF or NUMBER information, it will be displayed to your partner in the other room.';

var TRAINING_START_INSTR = 'Let\'s try a few to get a feel for the task.';

var TRAINING_END_INSTR = 'Please find the experimenter now to ask any questions about the task.<br/><br/>' +
            'If you understand these instructions, please find the experimenter to BEGIN';

var EXPERIMENT_END_INSTR = 'Thank you for participanting!';


// Add HTML
WELCOME_INSTR = '<p class="center-content">' + WELCOME_INSTR + '</p>';
PRESS_SPACE_INSTR = '<p class="fixed-position-below small">' + PRESS_SPACE_INSTR + '</p>';
ROLE_ASSIGNED_INSTR = '<p class="small">' + ROLE_ASSIGNED_INSTR + '</p>';
SHARER_DUTY_INSTR = '<p>' + SHARER_DUTY_INSTR + '</p>';
NUMBER_TRIAL_INSTR = '<p>' + NUMBER_TRIAL_INSTR + '</p>';
SELF_TRIAL_INSTR = '<p class="small">' + SELF_TRIAL_INSTR + '</p>';
PRIVATE_SHARE_INSTR = '<p class="small">' + PRIVATE_SHARE_INSTR + '</p>';
PRIVATE_SHARE_EXAMPLE_INSTR_1 = '<ul class="small">' + '<li>' + PRIVATE_SHARE_EXAMPLE_INSTR_1 + '</li>';
PRIVATE_SHARE_EXAMPLE_INSTR_2 = '<li style="text-align: center;">' + PRIVATE_SHARE_EXAMPLE_INSTR_2 + '</li>';
PRIVATE_SHARE_EXAMPLE_INSTR_3 = '<li>' + PRIVATE_SHARE_EXAMPLE_INSTR_3 + '</li>' + '</ul>'
PRIVATE_SHARE_EXAMPLE_INSTR = PRIVATE_SHARE_EXAMPLE_INSTR_1 + PRIVATE_SHARE_EXAMPLE_INSTR_2 + PRIVATE_SHARE_EXAMPLE_INSTR_3;
EARNING_INSTR = '<p>' + EARNING_INSTR + '</p>';
RECEIVER_INSTR = '<p>' + RECEIVER_INSTR + '</p>';
TRAINING_START_INSTR = '<p>' + TRAINING_START_INSTR + '</p>';
TRAINING_END_INSTR = '<p>' + TRAINING_END_INSTR + '</p>';
EXPERIMENT_END_INSTR = '<p>' + EXPERIMENT_END_INSTR + '</p>';


// Create jsPsych-instruction objects
var beginningInstructions = [
    {
        type: 'instructions',
        pages: [WELCOME_INSTR],
        key_forward: 'space',
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
        pages: [ROLE_ASSIGNED_INSTR + PRESS_SPACE_INSTR,
                SHARER_DUTY_INSTR + PRESS_SPACE_INSTR,
                NUMBER_TRIAL_INSTR + PRESS_SPACE_INSTR,
                SELF_TRIAL_INSTR + PRESS_SPACE_INSTR,
                PRIVATE_SHARE_INSTR + PRESS_SPACE_INSTR,
                PRIVATE_SHARE_EXAMPLE_INSTR + PRESS_SPACE_INSTR,
                EARNING_INSTR + PRESS_SPACE_INSTR,
                RECEIVER_INSTR + PRESS_SPACE_INSTR,
                TRAINING_START_INSTR + PRESS_SPACE_INSTR
                ],
        key_forward: 'space',
    }
];

var middleInstruction = {   // This appears after training
    type: 'instructions',
    pages: [TRAINING_END_INSTR],
    key_forward: '=',
}

var endInstruction = {
    type: 'instructions',
    pages: [EXPERIMENT_END_INSTR],
    key_forward: 'space',
}
