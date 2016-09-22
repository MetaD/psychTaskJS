# Sharing Task - Docs
https://metad.github.io/sharingTask/
## Contents
- [Issues](#issues)
- [Files](#files)
- [How to make changes](#how-to-make-changes)
  - [Change statements](#change-statements)
  - [Change numbers](#change-statements)
  - [Change instructions](#change-instructions)
    - [Tips](#tips)
    - [How to add a page of instruction](#how-to-add-a-page-of-instruction)
  - [Change ID validation](#change-id-validation)
- [How to get the data](#how-to-get-the-data)
- [How to read the data](#how-to-read-the-data)

## Issues
- The four statements below have been removed
  - "I visit a part of _Boston_ I've never been to"

  if doing it outside US:
  - "I would like to travel more to _states_ in the _United States_"
  - "I would like to travel to countries outside the _United States_"
  - "I look forward to spending _Thanksgiving_ at home"

## Files
- `index.html`: open this on your computer to see the experiment
- `js` folder:
  - `sharing-task.js` is the main driver for this web. It reads the user ID, connects to Firebase, constructs trials and the experimental timeline, and starts the experiment at the end.
  - `globals.js` contains the constants (e.g. number of trials, durations of trials, colors, etc.), many helper functions (e.g. generators for random numbers and random trial contents, data processors, etc.), and several global variables.
  - `instructions.js` contains the string literals of instructions, then adds html tags to those strings, and then constructs jsPsych instruction objects based on them.
  - `statements_personal.js` contains two arrays of self statements, one for training trials and the other for actual trials.
  - `bootstrap.min.js` was directly downloaded from [Bootstrap](http://getbootstrap.com/), which is a commonly used framework comes with all kinds of pretty html elements and animations. This file is only useful for ID input.
  - `firebase.js`: directly downloaded from Firebase
  - `jquery.min.js`: directly downloaded from jQuery, which is similar to Bootstrap and is required by jsPsych
- `json-csv parser` folder: contains a python program to parse the Firebase json data files to csv files, as well as example data and results.
- `img` folder: contains the images of rewards. Make sure to name the files as <file_name> + <value>, e.g. penny1, star2. Also, it would be better to make all the image files 100px * 100px (like the star files there).
- `jspsych-5.0.3` folder: contains the jsPsych files with a bit custom changes for this particular experiment
- `css` folder: contains `css` files which defines the styles of webpages (e.g. fonts, sizes, positions, etc.).
  - `bootstrap.min.css` was directly downloaded from [Bootstrap](http://getbootstrap.com/). Only useful for ID input.
  - `jspsych.css` is mostly copy-pasted from the css file of jsPsych, but about 100 lines at the beginning were added for just this experiment.

## How to make changes
#### Change statements
Statements are stored in `statements_personal.js`.

Tip: If you need to use a single quote `'` inside a string, put a `\` before it.

#### Change numbers
Numbers of trials and time intervals are stored in `globals.js`.

If you need a random integer, use the function `random_int(min, max)` to get one between `min` and `max`, inclusive.

Please don't change the helper functions in `globals.js` if not completely sure what you are doing.

#### Change instructions
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

#### Change ID validation
Currently a "valid" ID is either anything 5 characters long, or "test". You can changes this in `sharing-task.js`, `function valid_id(uid)`. Just change this `if` condition to whatever you want. (Note: the `ID_LENGTH` variable is stored in `globals.js`.) 

## How to get the data
- Log in to [Firebase](https://firebase.google.com/) with the lab gmail account, and click `Go to console` in the upper right corner.
- Select this project (`sharing task`), then select `Database` on the left panel.
- You should be able to view the JSON data in the database. Export the json data (`Export JSON`).
- From this GitHub repo, get `parser.py` in `json-csv parser` folder.
- Put `parser.py` and the json data file in the same folder, and then run `parser.py` with the name of the data file as a command line parameter, like this:

  `python parser.py example_data.json`
- You should get the `.csv` file in the same folder

## How to read the data
Data are organized in this way:
- Data file
  - Subject 1
    - ID
    - start time
    - end time - *if end time is empty, that probably means the participant did not finish this experiment*
    - Trial 1
      - type - *four possible types: number, self, number-choice, self-choice. The former two are number/self screens, and the latter two are the screens where people need to make a private/share choice for number/self information*
      - trial_index - *this is the (useless?) trial index from jsPsych, where instruction pages are also counted as trials*
      - is_training - *either true or false*
      - rt - *if rt is -1, that means either a response is unnecessary (e.g. in a number screen) or the participant did not respond (in which case this trial would be repeated)*
      - stimulus - *the full html content shown to the participant (you can basically reconstruct the webpage with this). The rest attributes of a trial are just the useful information extracted from here.*
      - number - *for number and self screens only. Indicates either the random number, or the number (in Likert scale) rated by the participant*
      - statement - *for self screen only*
      - response - *for choice screens only. Empty if participant did not respond.*
      - share_value - *for choice screens only.*
      - private_value - *for choice screens only.*
      - earned_value - *for choice screens only.*
    - Trial 2
      - ...
    - Trial 3
      - ...
    - ...
  - Subject 2
    - ...
  - ...
