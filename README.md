# sharingTaskJS
Issues
---
- Change instructions (e.g. earning money, find experimenter)
- Change some statements for people from other places?
  - "I visit a part of _Boston_ I've never been to"
  - "I would like to travel more to _states_ in the _United States_"
  - "I would like to travel to countries outside the _United States_"
  - "I look forward to spending _Thanksgiving_ at home"
 - prevent closing window?
 - enter ID at the beginning to match demographics?

How to make changes
---
#### Changing statements
Statements are stored in `statements_personal.js`.

Tip: If you need to use a single quote `'` inside a string, put a `\` before it.

#### Changing numbers
Numbers of trials and time intervals are stored in `globals.js`.

If you need a random integer, use the function `random_int(min, max)` to get one between `min` and `max`, inclusive.

Please don't change the helper functions in `globals.js` if not completely sure what you are doing.

#### Changing instructions
Instructions are stored in `instructions.js`. They are strings with html elements.

###### Tips
- Long strings are concatenated by `+`s in middle.

- If you need to use a single quote `'` inside a string, put a `\` before it.

- Some useful html elements are:
  - `<br/>`: line break
  - `&nbsp;`: space (when you need more than one and normal spaces don't work)
  - `<p>` and `</p>`: two tags indicating start and end of paragraphs. Example: `'<p>This is a paragraph.</p>'`. Tags must appear in pairs.
  - `<p class="some-class"> ... </p>`: applying a class to a paragraph. A class is a group of styles (sizes, fonts, positions, etc.) defined in `jspsych.css` file. If you only need to change the font sizes, you can add `class="very-small"`, `class="small"`, `class="large"` or `class="very-large"` in the `<p>` tag. Multiple classes can be applied to one paragraph, e.g. `<p class="first-class second-class"> ... </p>`.

##### How to add a page of instruction
Normal instructions (those controlled by the participant) are `jsPsych-instruction` objects. [See their documentation and examples here.](http://docs.jspsych.org/plugins/jspsych-instructions/)

Note: an object (i.e. a JSON object) looks like `{ attribute_A: xxx, attribute_B: yyy, attribute_C: zzz }`. There could be any number of attributes and an attribute could store anything.

Special instructions with random or fixed times (e.g. syncing, assigning partners/roles, break) are `jspsych-multi-stim-multi-response` objects. [See their documentation and examples here.](http://docs.jspsych.org/plugins/jspsych-multi-stim-multi-response/) To use this for instructions, `is_html` should be `true`, `response_ends_trial` should be `false`, and the sum of milliseconds in the `timing_stim` array should equal `timing_response`.

All of the instructions appearing before the training trials are stored in order in the `beginningInstructions` array. If you need to add a page of normal instruction, you can simply add an html string to the `pages` array in one of the objects of type `instructions`. If you need to add a page of timed instruction, follow the pattern of the partner or role assigning page (inside `beginningInstructions` array) and add a new object to this array.
