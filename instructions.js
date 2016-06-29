var PRESS_SPACE = 'Please press the space bar to continue',
    ASSIGN_ROLE = 'Assigning your role. Please wait',
    SYNC = 'Please wait while you and your partner\'s computers are syncing.<br/><br/><br/>Syncing computers. Please wait',
    BREAK = 'You are half way done!  Please take a short break now.<br/><br/>The task will resume in ' + BREAK_TIME/1000 + ' seconds.',

PRESS_SPACE = '<p class="fixed-position-below small">' + PRESS_SPACE + '</p>';

var beginningInstructions = [
    {
        type: 'instructions',
        pages: [
            '<p class="center-content">' +
                'Welcome to the study!<br/><br/>Press the space bar to find out your role.' +
            '</p>'
        ],
        key_forward: 'space',
    },
    {
        type: 'multi-stim-multi-response',
        is_html: true,
        stimuli: [
            '<p>' + ASSIGN_ROLE + '&nbsp;&nbsp;&nbsp;</p>',
            '<p>' + ASSIGN_ROLE + '.&nbsp;&nbsp;</p>',
            '<p>' + ASSIGN_ROLE + '..&nbsp;</p>',
            '<p>' + ASSIGN_ROLE + '...</p>',
        ],
        choices: [],
        timing_stim: [ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4, ASSIGNING_ROLE_TIME/4],
        timing_response: ASSIGNING_ROLE_TIME,
        response_ends_trial: false,
    },
    {
        type: 'instructions',
        pages: [
            '<p class="small">' +
                'You have been assigned the role of:  SHARER<br/>' +
                'This means that you will be creating information throughout the task.<br/><br/>' +
                'Your study partner has been assigned the role of:  RECEIVER<br/>' +
                'This means that he/she will be receiving information throughout the task.' +
            '</p>' +
            PRESS_SPACE,

            '<p>' +
                'As the SHARER, there will be two types of information that you will generate.' +
            '</p>' +
            PRESS_SPACE,

            '<p>' +
                'On some trials, you will be shown a number. On these trials, you will see the word NUMBER at the top of the screen, ' +
                'and you will be presented with a number between 1 and ' + NUM_CARDS + '. This screen will stay up for ' + NUMBER_TIME/1000 + ' seconds.' +
            '</p>' +
            PRESS_SPACE,

            '<p class="small">' +
                'On other trials, you will answer a question about yourself - your own preferences, habits or opinions. ' +
                'On these trials, you will see the word SELF at the top of the screen, as well as a statement, such as <br/><br/>' +
                TAB + '"I enjoy skiing or snowboarding."<br/><br/>' +
                'Your task is to rate how much you agree with the statement from 1 (strongly disagree) to ' + NUM_LIKERT_CHOICES + ' (strongly agree). ' +
                'You can make your rating by pressing the corresponding number key (1-' + NUM_LIKERT_CHOICES + ') at the top of the keyboard. ' +
                'You will have ' + LIKERT_CHOICE_TIME/1000 + ' seconds to make your rating. ' +
                'This screen will stay up for the entire ' + LIKERT_CHOICE_TIME/1000 + ' seconds.' +
            '</p>' +
            PRESS_SPACE,

            '<p class="small">' +
                'After each NUMBER and SELF trial, you will have to choose what to do with the information (your answer to the question or the number). ' +
                'You will have two options: share the information with your partner, or keep it private. ' +
                'Each of these choices will be paired with a variable amount of money, between 1 and 4 cents, that you can earn by choosing that option.' +
            '</p>' +
            PRESS_SPACE,

            '<ul class="small">' +
                '<li>' +
                    'For example: you may be given the option of sharing your SELF answer and making $0.03, ' +
                    'or keeping your SELF answer private and making $0.04.<br/><br/>' +
                '</li>' +
                '<li style="text-align: center;">' +
                    'SHARE' + THREE_TAB + THREE_TAB + 'PRIVATE<br/><br/>' +
                    '[3 pennies]'+ THREE_TAB + TWO_TAB + '[4 pennies]<br/><br/>' +
                '</li>' +
                '<li>' +
                    'You should make your choice by pressing 1 for the left option (SHARE) and ' + NUM_CARDS + ' for the right option (PRIVATE). ' +
                    'You will have ' + PRIVATE_SHARE_TIME/1000 + ' seconds to make your choice. ' +
                    'This screen will stay up for the entire ' + PRIVATE_SHARE_TIME/1000 + ' seconds.' +
                '</li>' +
            '</ul>' +
            PRESS_SPACE,

            '<p>' +
                'It is important to remember that we will actually pay you these amounts at the end of the experiment; ' +
                'based on your choices, you will earn money in addition to the credit you are already earning for your participation.' +
            '</p>' +
            PRESS_SPACE,

            '<p>' +
                'Critically, you will be generating information for your study partner in this experiment. ' +
                'This other participant is sitting in the room adjacent to yours NEED TO CHANGE THIS. ' +
                'When you choose to share the SELF or NUMBER information, it will be displayed to your partner in the other room.' +
            '</p>' +
            PRESS_SPACE,

            '<p>' +
                'Let\'s try a few to get a feel for the task.' +
            '</p>' +
            PRESS_SPACE,

        ],
        key_forward: 'space',
    }
];
