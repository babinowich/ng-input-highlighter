[![npm version](https://badge.fury.io/js/ng-input-highlighter.svg)](https://badge.fury.io/js/ng-input-highlighter)
# ng-input-highlighter
Rich-text input that decorates text with a designated css class

Checkout the [demo](https://ng-input-highlighter.firebaseapp.com/) 

This Angular library creates a rich-text input that decorates text with a designated css class without using separate div's, allowing normal html web interactions such as selecting and right-click. The entire textbox is a contenteditable div with conjoined Angular directives rendered on the fly. 

## Key Features

#### Flexibility with Internal or External Parsing
Allow the Component to perform simple quick lookups and find indices of select target words or provide an array of items and indices for the Component to render. This lets your parsing be as advanced as you'd like, using outputs from NLP APIs such as IBM Watson or as simple as a string match.

#### Use Normal CSS Classes For Decorations
The Component sets the class of identified target words to whatever class you want. Just give it the string name for the target, and it will set it on the rendered directive. For examples of CSS used in the demo, checkout the bottom of the page.</p>

#### Normal HTML Accessibility
While the Component is actually several divs and spans, it appears and functions as one. Clicking and dragging allows for normal fluid selection. Clicks in the empty spaces brings the caret position to the end of the input naturally and bring focus to the entire textbox. Double clicks inside the textbox select all text.

#### Ability to Add Actions and Pop Up Menus
Since each identified word is its own component, the Component has the ability to attach unique menus with descriptions such as Entity Type, Confidence as well as allow for suggested replacements of words identified.


## Requirements
Angular 6.0+

## Importing
In your app.module.ts or whatever module you are using it in:

```import { NgInputHighlighterModule } from 'ng-input-highlighter';```

Add to your imports array:

``` imports: [ NgInputHighlighterModule ] ```

And then you have two options- for local analysis, meaning letting the component look for a defined set of words, place the component in your html with:

```   <lib-ng-input-highlighter [localAnalysis]="true" [targetItems]="targetItems"></lib-ng-input-highlighter>```

With the targetItems array input as ```targetItems: object[]```	

With objects as:   
    targetItem: {
        text: string,
        css: string
    } 
If you'd like to add menus and replacement options, refer to the documentation and demo for optional attributes on the targetItem class.

If you choose to do external analysis, meaning letting a separate parsing service look for specific entities, place the component in your html with:

```   <lib-ng-input-highlighter [localAnalysis]="false" [targetItems]="targetItems"></lib-ng-input-highlighter>```

With objects as:   
    targetItem: {
        text: string,
        css: string,
        location: [start, end]
    } 


For more information on use with further customization, check out the [demo](https://ng-input-highlighter.firebaseapp.com/) 

## To run the local demo app

Run `npm install` then run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.