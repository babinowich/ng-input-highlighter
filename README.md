# ng-input-highlighter
Rich-text input that decorates text with a designated css class

Checkout the [demo](https://ng-input-highlighter.firebaseapp.com/) 

Key Features
Flexibility with Internal or External Parsing
Allow the Component to perform simple quick lookups and find indices of select target words or provide an array of items and indices for the component to decorate. This lets your parsing be as advanced as you'd like, using outputs from NLP APIs such as IBM Watson.

Use Normal CSS Classes For Decorations
The Component sets the targeted spans class to whatever class you want. Just give it the string name for the target, and it will set it. For examples of CSS used in the demo, checkout the bottom of the page.

Accessibility
While the Component is actually several divs and spans, it appears and functions as one. Clicks in the empty spaces brings the caret position to the end of the input naturally and bring focus to the entire textbox.

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

If you choose to do external analysis, meaning letting a separate parsing service look for specific entities, place the component in your html with:
```   <lib-ng-input-highlighter [localAnalysis]="false" [targetItems]="targetItems"></lib-ng-input-highlighter>```

With objects as:   
    targetItem: {
        text: string,
        css: string,
        location: [start, end]
    } 


For more information on use, check out the [demo](https://ng-input-highlighter.firebaseapp.com/) 

## To run the local demo app

Run `npm install` then run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.