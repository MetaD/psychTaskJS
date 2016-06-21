var allTimeline = [];

// Instructions
allTimeline.push({
    type: 'instructions',
    pages: [
        'Hello world!',
        'Helllooooo froooom the oooother siiiiidde'
    ],
    key_forward: 'space'
});

jsPsych.init({
    display_element: $('#jspsych-target'),
    timeline: allTimeline
});
