import { Component, Input, Directive, ViewContainerRef, ComponentFactoryResolver, ViewChild, Renderer2, Output, EventEmitter, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class RegularComponent {
    constructor() {
        this.type = 'None';
        this.confidence = null;
    }
}
RegularComponent.decorators = [
    { type: Component, args: [{
                template: "<span contenteditable style=\"margin-right:2px; display:inline-block; min-width:2px; min-height:14px\">{{ text }}</span>"
            }] }
];
RegularComponent.propDecorators = {
    text: [{ type: Input }],
    css: [{ type: Input }],
    type: [{ type: Input }],
    confidence: [{ type: Input }],
    menu: [{ type: Input }],
    data: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class HighlightedComponent {
    constructor() {
        this.type = 'None';
        this.confidence = null;
        this.added = false;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    clickedText(text) {
        console.log('CLICKED:' + text + ' ', this.text, this.css);
        console.log(this.menu);
        //   this.clickActive = this.clickActive ? false : true
    }
    /**
     * @return {?}
     */
    changedText() {
        console.log('selected replacement:', this.selected);
        if (!this.added) {
            /** @type {?} */
            const ogItem = {
                viewValue: this.text,
                value: this.text
            };
            this.menu.replacementOptions.push(ogItem);
            this.added = true;
        }
        this.text = this.selected;
    }
}
HighlightedComponent.decorators = [
    { type: Component, args: [{
                template: "<span *ngIf=\"!menu\" contenteditable style=\"margin-right:2px;\" (click)=\"clickedText(text)\" [ngClass]=\"css\">{{ text }}</span>\n\n<span *ngIf=\"menu\" contenteditable style=\"margin-right:2px;cursor: pointer;\" (click)=\"clickedText(text)\" [ngClass]=\"css\" [matMenuTriggerFor]=\"appMenu\">{{ text }}</span>\n\n<mat-menu #appMenu=\"matMenu\" style=\"font-size:14px;\">\n                <!-- <button mat-menu-item>Settings</button>\n                <button mat-menu-item>Help</button> -->\n    <div *ngIf=\"menu\" style=\"padding:10px\">\n            <p *ngFor=\"let item of menu.descriptionItems\" class=\"miniMenu\">{{ item }}</p>\n            <p *ngIf=\"type\">Identified type: {{ type }}</p>\n            <p *ngIf=\"confidence\">Confidence: {{ confidence }}</p>\n            <mat-form-field *ngIf=\"menu.replacementOptions\">\n                <mat-select placeholder=\"Potential replacements\" [(value)]=\"selected\" (selectionChange)=\"changedText()\">\n                    <mat-option *ngFor=\"let option of menu.replacementOptions\" [value]=\"option.value\">{{ option.viewValue }}</mat-option>\n                </mat-select>\n            </mat-form-field>\n    </div>\n\n    <!-- <span *ngFor=\"let item of actionBtns\">\n        <button mat-menu-item (click)=\"\"></button>\n    <span> -->\n</mat-menu>"
            }] }
];
HighlightedComponent.propDecorators = {
    text: [{ type: Input }],
    css: [{ type: Input }],
    type: [{ type: Input }],
    confidence: [{ type: Input }],
    menu: [{ type: Input }],
    data: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class TextDirective {
    /**
     * @param {?} viewContainerRef
     */
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
}
TextDirective.decorators = [
    { type: Directive, args: [{
                selector: '[libTextHost]',
            },] }
];
/** @nocollapse */
TextDirective.ctorParameters = () => [
    { type: ViewContainerRef }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgInputHighlighterComponent {
    /**
     * @param {?} componentFactoryResolver
     * @param {?} renderer
     */
    constructor(componentFactoryResolver, renderer) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.renderer = renderer;
        this.targetItems = [];
        this.localAnalysis = true;
        this.boxHeight = 'M';
        // @Input() highContrast = true // TO-DO
        this.idleTime = 2000;
        this.fontClass = 'regularText';
        this.boxClass = 'none';
        this.boxFocus = 'focused';
        this.initFocus = true;
        this.caseSensitive = false;
        this.currentText = new EventEmitter();
        this.textSubject = new Subject();
        this.responsePending = false;
        this.textArray = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // Timer to check when to send request to text analysis
        this.textSubject.pipe(debounceTime(2000)).subscribe(text => {
            // console.log('idle and time to process', this.textArea)
            this.responsePending = true;
            /** @type {?} */
            const new_text = this.obtainText();
            this.targetText.viewContainerRef.clear();
            this.currentText.emit(new_text);
            // If we're doing local analysis, begin the process, otherwise- wait for response from service in onChanges
            if (this.localAnalysis) {
                this.constructLocally(new_text);
                setTimeout(() => {
                    this.responsePending = false;
                    this.focusInput();
                }, 500);
            }
        });
        if (this.boxHeight === 'XS') {
            this.boxSize = 'xsmall';
        }
        else if (this.boxHeight === 'S') {
            this.boxSize = 'small';
        }
        else if (this.boxHeight === 'L') {
            this.boxSize = 'large';
        }
        else if (this.boxHeight === 'XL') {
            this.boxSize = 'xlarge';
        }
        else {
            this.boxSize = 'medium';
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
            if (changes["targetItems"]) {
                console.log('new external target input received');
                /** @type {?} */
                const new_text = this.obtainText();
                this.targetText.viewContainerRef.clear();
                this.currentText.emit(new_text);
                this.constructExternally(new_text);
                setTimeout(() => {
                    this.responsePending = false;
                    this.focusInput();
                }, 500);
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        // Add event listeners to the DOM elements after rendered, allowing for box-border
        this.renderer.listen(this.targetText.viewContainerRef.element.nativeElement, 'focus', () => {
            this.renderer.addClass(this.inputBox.nativeElement, this.boxFocus);
        });
        this.renderer.listen(this.targetText.viewContainerRef.element.nativeElement, 'blur', () => {
            this.renderer.removeClass(this.inputBox.nativeElement, this.boxFocus);
        });
        // Method called upon a keystroke to begin the process of waiting for a 2 second pause in keystrokes
        this.renderer.listen(this.textArea.nativeElement, 'keyup', () => {
            console.log('keystroke');
            this.textSubject.next();
        });
        // Focus the caret at the end of the box
        if (this.initFocus) {
            this.focusInput();
        }
    }
    /**
     * @return {?}
     */
    obtainText() {
        console.log('target', this.targetText);
        if (this.textArea.nativeElement.childElementCount < 2) {
            console.log('one child element', this.textArea.nativeElement.childElementCount);
            /** @type {?} */
            const text = this.textArea.nativeElement.innerText;
            console.log(this.textArea);
            console.log('text obtained', text);
            return text;
        }
        else {
            console.log('lots of children elements', this.textArea.nativeElement.childElementCount);
            /** @type {?} */
            const childNodes = this.textArea.nativeElement.childNodes;
            /** @type {?} */
            let newText = '';
            console.log(this.textArea);
            if (this.textArea.nativeElement.childNodes.length > 1) {
                if (this.textArea.nativeElement.childNodes[1].localName === 'br') {
                    console.log('br exists- killing it');
                    this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1]);
                }
                if (this.textArea.nativeElement.childNodes[1].nodeName === '#text') {
                    console.log('clean delete- text exists in [1] exists- extracting it');
                    /** @type {?} */
                    const temp = this.textArea.nativeElement.childNodes[1].textContent;
                    this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1]);
                    if (this.textArea.nativeElement.childNodes[1].localName === 'br') {
                        console.log('a new br exists- killing it');
                        this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1]);
                    }
                    console.log('text obtained', temp);
                    return temp;
                }
            }
            for (let i = 0; i < childNodes.length; i++) {
                if (childNodes[i].innerText) {
                    newText = newText + ' ' + childNodes[i].innerText;
                }
            }
            console.log('text obtained', newText);
            return newText;
        }
    }
    /**
     * @param {?} textArray
     * @return {?}
     */
    renderComponents(textArray) {
        setTimeout(() => {
            console.log('in render', this.textArea);
            /** @type {?} */
            const targetRef = this.targetText;
            this.textArea.nativeElement.firstChild.textContent = '';
            console.log('render array', textArray);
            for (let i = 0; i < textArray.length; i++) {
                /** @type {?} */
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(textArray[i].component);
                /** @type {?} */
                const ref = targetRef.viewContainerRef.createComponent(componentFactory);
                /** @type {?} */
                const el = this.targetText.viewContainerRef.element;
                (/** @type {?} */ (ref.instance)).text = textArray[i].text;
                (/** @type {?} */ (ref.instance)).css = textArray[i].css;
                (/** @type {?} */ (ref.instance)).type = textArray[i].type;
                (/** @type {?} */ (ref.instance)).confidence = textArray[i].confidence;
                (/** @type {?} */ (ref.instance)).menu = textArray[i].menu;
                (/** @type {?} */ (ref.instance)).data = textArray[i];
                this.renderer.appendChild(el.nativeElement, ref.location.nativeElement);
            }
        });
    }
    /**
     * @param {?} text
     * @return {?}
     */
    constructLocally(text) {
        console.log('in construct locally');
        /** @type {?} */
        const analysisOutput = localAnalysis(this.targetItems, text, this.caseSensitive);
        this.renderComponents(analysisOutput);
    }
    /**
     * @param {?} text
     * @return {?}
     */
    constructExternally(text) {
        console.log('in construct externally');
        constructComponentArray(this.targetItems, text);
    }
    /**
     * @return {?}
     */
    focusInput() {
        console.log('focus');
        if (this.textArea) {
            this.textArea.nativeElement.focus();
            this.placeCaretAtEnd(this.textArea.nativeElement);
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection !== 'undefined'
            && typeof document.createRange !== 'undefined') {
            /** @type {?} */
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            /** @type {?} */
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    /**
     * @return {?}
     */
    selectAll() {
        document.execCommand('selectAll', false, null);
    }
}
NgInputHighlighterComponent.decorators = [
    { type: Component, args: [{
                selector: 'lib-ng-input-highlighter',
                template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"[boxSize, boxClass]\">\n  <div class=\"text-area\" [ngClass]=\"{'pending': responsePending}\">\n    <div libTextHost #textArea contenteditable  id=\"input-span\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"></div>\n    <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n    <span (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"blank-input\"> </span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                styles: ["#input-area{color:#000;margin-top:10px;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.none{background-color:#f3f6fa}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3;color:gray!important}#delete-this-one{font-style:italic;opacity:.7;color:#778899}"]
            }] }
];
/** @nocollapse */
NgInputHighlighterComponent.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: Renderer2 }
];
NgInputHighlighterComponent.propDecorators = {
    targetItems: [{ type: Input }],
    localAnalysis: [{ type: Input }],
    boxHeight: [{ type: Input }],
    idleTime: [{ type: Input }],
    fontClass: [{ type: Input }],
    boxClass: [{ type: Input }],
    boxFocus: [{ type: Input }],
    initFocus: [{ type: Input }],
    caseSensitive: [{ type: Input }],
    currentText: [{ type: Output }],
    textArea: [{ type: ViewChild, args: ['textArea',] }],
    emptyText: [{ type: ViewChild, args: ['emptyText',] }],
    targetText: [{ type: ViewChild, args: [TextDirective,] }],
    inputBox: [{ type: ViewChild, args: ['inputBox',] }]
};
/**
 * @param {?} searchTargets
 * @param {?} str
 * @param {?} caseSensitive
 * @return {?}
 */
function localAnalysis(searchTargets, str, caseSensitive) {
    console.log('in local analysis');
    /** @type {?} */
    const output = [];
    for (const item of searchTargets) {
        /** @type {?} */
        let startIndex = 0;
        /** @type {?} */
        let index;
        /** @type {?} */
        const searchStrLen = item.text.length;
        if (searchStrLen === 0) {
            return 'An error occurred. There appears to be no input search string.';
        }
        /** @type {?} */
        let searchingString;
        /** @type {?} */
        let searchingText;
        if (!caseSensitive) {
            searchingString = str.toLowerCase();
            searchingText = item.text.toLowerCase();
        }
        else {
            searchingString = str;
            searchingText = item.text;
        }
        while ((index = searchingString.indexOf(searchingText, startIndex)) > -1) {
            /** @type {?} */
            const indexItem = {
                text: str.substring(index, index + searchStrLen),
                location: [index, index + searchStrLen],
                menu: item.menu ? item.menu : null,
                type: item.type ? item.type : null,
                confidence: null,
                css: item.css
            };
            output.push(indexItem);
            startIndex = index + searchStrLen;
        }
    }
    console.log('output from local: ', output);
    return constructComponentArray(output, str);
}
/**
 * @param {?} searchResults
 * @param {?} original_text
 * @return {?}
 */
function constructComponentArray(searchResults, original_text) {
    console.log('in construct array');
    /** @type {?} */
    const finalArray = [];
    /** @type {?} */
    let locationChecker = true;
    /** @type {?} */
    const erroredItems = [];
    if (searchResults.length === 0) {
        /** @type {?} */
        const onlyItem = {
            text: original_text,
            css: null,
            menu: null,
            type: null,
            confidence: null,
            component: RegularComponent
        };
        finalArray.push(onlyItem);
        return finalArray;
    }
    else {
        for (const item of searchResults) {
            if (!item.location) {
                erroredItems.push(item);
                locationChecker = false;
            }
        }
        if (!locationChecker) {
            /** @type {?} */
            let erroredItemsText = '';
            for (const item of erroredItems) {
                erroredItemsText = erroredItemsText + item.text + '  ';
            }
            /** @type {?} */
            const errorText = 'An error occured. The following items did not have a valid identified index location: ' + erroredItemsText
                + 'Either provide proper index locations of each item to be highlighted or set localAnalysis to true.';
            /** @type {?} */
            const errorItem = {
                text: errorText,
                css: null,
                menu: null,
                type: null,
                confidence: null,
                component: RegularComponent
            };
            finalArray.push(errorItem);
            return finalArray;
        }
    }
    searchResults.sort(function (a, b) {
        return a.location[0] - b.location[0];
    });
    /** @type {?} */
    let start = 0;
    /** @type {?} */
    let end = searchResults[0].location[0];
    /** @type {?} */
    let middle = '';
    for (let i = 0; i < searchResults.length; i++) {
        if (start === 0) {
            /** @type {?} */
            const startItem = {
                text: original_text.substring(start, end),
                css: null,
                menu: null,
                type: null,
                confidence: null,
                component: RegularComponent
            };
            finalArray.push(startItem);
            /** @type {?} */
            const firstItem = {
                text: searchResults[i].text,
                css: searchResults[i].css,
                menu: searchResults[i].menu ? searchResults[i].menu : null,
                type: searchResults[i].type ? searchResults[i].type : null,
                confidence: null,
                component: HighlightedComponent
            };
            finalArray.push(firstItem);
            end = searchResults[i].location[1];
        }
        else {
            /** @type {?} */
            const nextItem = {
                text: searchResults[i].text,
                css: searchResults[i].css,
                menu: searchResults[i].menu ? searchResults[i].menu : null,
                type: searchResults[i].type ? searchResults[i].type : null,
                confidence: null,
                component: HighlightedComponent
            };
            finalArray.push(nextItem);
        }
        if (searchResults[i + 1]) {
            middle = original_text.substring(searchResults[i].location[1], searchResults[i + 1].location[0]);
            /** @type {?} */
            const middleItem = {
                text: middle,
                css: null,
                menu: null,
                type: null,
                confidence: null,
                component: RegularComponent
            };
            finalArray.push(middleItem);
            start = searchResults[i + 1].location[0];
            end = searchResults[i + 1].location[1];
        }
        if (i === (searchResults.length - 1)) {
            /** @type {?} */
            const endItem = {
                text: original_text.substring(end, original_text.length),
                css: null,
                menu: null,
                type: null,
                confidence: null,
                component: RegularComponent
            };
            finalArray.push(endItem);
        }
    }
    console.log('output of array construction:', finalArray);
    return finalArray;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgInputHighlighterModule {
}
NgInputHighlighterModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BrowserModule,
                    MatMenuModule,
                    MatSelectModule,
                    MatFormFieldModule
                ],
                declarations: [
                    NgInputHighlighterComponent,
                    TextDirective,
                    HighlightedComponent,
                    RegularComponent
                ],
                entryComponents: [HighlightedComponent, RegularComponent],
                exports: [NgInputHighlighterComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgInputHighlighterComponent, NgInputHighlighterModule, HighlightedComponent as ɵb, RegularComponent as ɵc, TextDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi90ZXh0Q29tcG9uZW50cy90ZXh0LXJlZ3VsYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvdGV4dENvbXBvbmVudHMvdGV4dC1oaWdobGlnaHQuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvdGV4dENvbXBvbmVudHMvdGV4dC5kaXJlY3RpdmUudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGV4dENvbXBvbmVudCB9IGZyb20gJy4vdGV4dC1ibG9jay5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tICcuLi9jbGFzc2VzL21lbnVJdGVtLmNsYXNzJ1xuXG5AQ29tcG9uZW50KHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdGV4dC1yZWd1bGFyLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBSZWd1bGFyQ29tcG9uZW50IGltcGxlbWVudHMgVGV4dENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIHRleHQ6IHN0cmluZztcbiAgQElucHV0KCkgY3NzOiBzdHJpbmdcbiAgQElucHV0KCkgdHlwZSA9ICdOb25lJ1xuICBASW5wdXQoKSBjb25maWRlbmNlID0gbnVsbFxuICBASW5wdXQoKSBtZW51OiBNZW51SXRlbTtcbiAgQElucHV0KCkgZGF0YTogYW55O1xuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRleHRDb21wb25lbnQgfSBmcm9tICcuL3RleHQtYmxvY2suY29tcG9uZW50JztcbmltcG9ydCB7IE1hdE1lbnUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcblxuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tICcuLi9jbGFzc2VzL21lbnVJdGVtLmNsYXNzJ1xuQENvbXBvbmVudCh7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3RleHQtaGlnaGxpZ2h0LmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRlZENvbXBvbmVudCBpbXBsZW1lbnRzIFRleHRDb21wb25lbnQge1xuICBASW5wdXQoKSB0ZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNzczogc3RyaW5nXG4gIEBJbnB1dCgpIHR5cGUgPSAnTm9uZSdcbiAgQElucHV0KCkgY29uZmlkZW5jZSA9IG51bGxcbiAgQElucHV0KCkgbWVudTogTWVudUl0ZW1cbiAgQElucHV0KCkgZGF0YTogYW55O1xuICBzZWxlY3RlZDogc3RyaW5nO1xuICBhZGRlZCA9IGZhbHNlXG4gIC8vIEBWaWV3Q2hpbGQoJ3N1Ym1lbnUnKVxuICAvLyBzZXQgc3ViTWVudSh2YWx1ZTogTWF0TWVudSkgIHtcbiAgLy8gICB0aGlzLnRleHQgPSB2YWx1ZTtcbiAgLy8gfVxuXG5cbiAgY2xpY2tlZFRleHQodGV4dCkge1xuICAgICAgY29uc29sZS5sb2coJ0NMSUNLRUQ6JyArIHRleHQgICsgJyAnLCB0aGlzLnRleHQsIHRoaXMuY3NzIClcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVudSlcbiAgICAvLyAgIHRoaXMuY2xpY2tBY3RpdmUgPSB0aGlzLmNsaWNrQWN0aXZlID8gZmFsc2UgOiB0cnVlXG4gIH1cblxuICBjaGFuZ2VkVGV4dCgpIHtcbiAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgcmVwbGFjZW1lbnQ6JywgdGhpcy5zZWxlY3RlZClcbiAgICBpZiAoIXRoaXMuYWRkZWQpIHtcbiAgICBjb25zdCBvZ0l0ZW0gPSB7XG4gICAgICB2aWV3VmFsdWU6IHRoaXMudGV4dCxcbiAgICAgIHZhbHVlOiB0aGlzLnRleHRcbiAgICB9XG4gICAgdGhpcy5tZW51LnJlcGxhY2VtZW50T3B0aW9ucy5wdXNoKG9nSXRlbSlcbiAgICB0aGlzLmFkZGVkID0gdHJ1ZVxuICAgIH1cbiAgICB0aGlzLnRleHQgPSB0aGlzLnNlbGVjdGVkXG4gIH1cbn1cbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbGliVGV4dEhvc3RdJyxcbn0pXG5leHBvcnQgY2xhc3MgVGV4dERpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7IH1cbn1cblxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBUZXh0Q29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LWJsb2NrLmNvbXBvbmVudCdcbmltcG9ydCB7IFJlZ3VsYXJDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtcmVndWxhci5jb21wb25lbnQnXG5pbXBvcnQgeyBIaWdobGlnaHRlZENvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1oaWdobGlnaHQuY29tcG9uZW50J1xuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuaW1wb3J0IHsgVGV4dERpcmVjdGl2ZSB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC5kaXJlY3RpdmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZy1pbnB1dC1oaWdobGlnaHRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgdGFyZ2V0SXRlbXM6IEFycmF5PFRhcmdldEl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIGluc2lkZSBjb21wb25lbnQ6IGFycmF5IG9mIGl0ZW1zIHRvIGZpbmRcbiAgQElucHV0KCkgbG9jYWxBbmFseXNpcyA9IHRydWU7XG4gIEBJbnB1dCgpIGJveEhlaWdodCA9ICdNJztcbiAgLy8gQElucHV0KCkgaGlnaENvbnRyYXN0ID0gdHJ1ZSAvLyBUTy1ET1xuICBASW5wdXQoKSBpZGxlVGltZSA9IDIwMDAgLy8gYWxsb3cgZm9yIGN1c3RvbWl6YXRpb24gb24gZGVib3VuY2UgdGltZVxuICBASW5wdXQoKSBmb250Q2xhc3MgPSAncmVndWxhclRleHQnOyAvLyBvcHRpb25hbCBjbGFzcyBmb3IgaW5wdXQgb2Ygc3R5bGUgZm9yIHJlZ3VsYXIgdGV4dCBpbiBib3hcbiAgQElucHV0KCkgYm94Q2xhc3MgPSAnbm9uZSc7XG4gIEBJbnB1dCgpIGJveEZvY3VzID0gJ2ZvY3VzZWQnO1xuICBASW5wdXQoKSBpbml0Rm9jdXMgPSB0cnVlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIGZvY3VzIG9uIGNvbXBvbmVudCB0ZXh0IGJveCBpbml0aWFsbHksIHJlY29tbWVuZGVkIGZvciBhY2Nlc3NpYmlsaXR5XG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCd0ZXh0QXJlYScpIHRleHRBcmVhOiBFbGVtZW50UmVmXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5VGV4dCcpIGVtcHR5VGV4dDogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKFRleHREaXJlY3RpdmUpIHRhcmdldFRleHQ6IFRleHREaXJlY3RpdmVcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgYm94U2l6ZTogU3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIC8vIFRpbWVyIHRvIGNoZWNrIHdoZW4gdG8gc2VuZCByZXF1ZXN0IHRvIHRleHQgYW5hbHlzaXNcbiAgICB0aGlzLnRleHRTdWJqZWN0LnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMjAwMClcbiAgICApLnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpZGxlIGFuZCB0aW1lIHRvIHByb2Nlc3MnLCB0aGlzLnRleHRBcmVhKVxuICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSB0cnVlXG4gICAgICBjb25zdCBuZXdfdGV4dCA9IHRoaXMub2J0YWluVGV4dCgpXG4gICAgICB0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5jbGVhcigpXG4gICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQobmV3X3RleHQpO1xuICAgIC8vIElmIHdlJ3JlIGRvaW5nIGxvY2FsIGFuYWx5c2lzLCBiZWdpbiB0aGUgcHJvY2Vzcywgb3RoZXJ3aXNlLSB3YWl0IGZvciByZXNwb25zZSBmcm9tIHNlcnZpY2UgaW4gb25DaGFuZ2VzXG4gICAgICBpZiAodGhpcy5sb2NhbEFuYWx5c2lzKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TG9jYWxseShuZXdfdGV4dCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWFMnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneHNtYWxsJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdzbWFsbCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ0wnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbGFyZ2UnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4bGFyZ2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbWVkaXVtJztcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25ldyBleHRlcm5hbCB0YXJnZXQgaW5wdXQgcmVjZWl2ZWQnKVxuICAgICAgICBjb25zdCBuZXdfdGV4dCA9IHRoaXMub2J0YWluVGV4dCgpXG4gICAgICAgIHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmNsZWFyKClcbiAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KG5ld190ZXh0KVxuICAgICAgICB0aGlzLmNvbnN0cnVjdEV4dGVybmFsbHkobmV3X3RleHQpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsIHRoaXMuYm94Rm9jdXMpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JsdXInLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgdGhpcy5ib3hGb2N1cyk7XG4gICAgfSk7XG4gICAgLy8gTWV0aG9kIGNhbGxlZCB1cG9uIGEga2V5c3Ryb2tlIHRvIGJlZ2luIHRoZSBwcm9jZXNzIG9mIHdhaXRpbmcgZm9yIGEgMiBzZWNvbmQgcGF1c2UgaW4ga2V5c3Ryb2tlc1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2tleXVwJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2tleXN0cm9rZScpXG4gICAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoKTtcbiAgICB9KTtcbiAgICAvLyBGb2N1cyB0aGUgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgYm94XG4gICAgaWYgKHRoaXMuaW5pdEZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICB9XG4gIH1cblxuICBvYnRhaW5UZXh0KCkge1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0aGlzLnRhcmdldFRleHQpXG4gICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudCA8IDIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvbmUgY2hpbGQgZWxlbWVudCcsIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudClcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuaW5uZXJUZXh0XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnRleHRBcmVhKVxuICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCB0ZXh0KVxuICAgICAgcmV0dXJuIHRleHRcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2xvdHMgb2YgY2hpbGRyZW4gZWxlbWVudHMnLCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQpXG4gICAgICBjb25zdCBjaGlsZE5vZGVzID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNcbiAgICAgIGxldCBuZXdUZXh0ID0gJydcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMudGV4dEFyZWEpXG5cbiAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5sb2NhbE5hbWUgPT09ICdicicpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnYnIgZXhpc3RzLSBraWxsaW5nIGl0JylcbiAgICAgICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsZWFuIGRlbGV0ZS0gdGV4dCBleGlzdHMgaW4gWzFdIGV4aXN0cy0gZXh0cmFjdGluZyBpdCcpXG4gICAgICAgICAgY29uc3QgdGVtcCA9IHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLnRleHRDb250ZW50XG4gICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5sb2NhbE5hbWUgPT09ICdicicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhIG5ldyBiciBleGlzdHMtIGtpbGxpbmcgaXQnKVxuICAgICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZygndGV4dCBvYnRhaW5lZCcsIHRlbXApXG4gICAgICAgICAgcmV0dXJuIHRlbXBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGlsZE5vZGVzW2ldLmlubmVyVGV4dCkge1xuICAgICAgICAgIG5ld1RleHQgPSBuZXdUZXh0ICsgJyAnICsgY2hpbGROb2Rlc1tpXS5pbm5lclRleHRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCBuZXdUZXh0KVxuICAgICAgcmV0dXJuIG5ld1RleHRcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb21wb25lbnRzKHRleHRBcnJheSkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2luIHJlbmRlcicsIHRoaXMudGV4dEFyZWEpXG4gICAgICBjb25zdCB0YXJnZXRSZWYgPSB0aGlzLnRhcmdldFRleHRcbiAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5maXJzdENoaWxkLnRleHRDb250ZW50ID0gJydcblxuICAgICAgY29uc29sZS5sb2coJ3JlbmRlciBhcnJheScsIHRleHRBcnJheSlcbiAgICAgIGNvbnN0IHRlc3RNZW51ID0ge1xuICAgICAgICByZXBsYWNlbWVudE9wdGlvbnM6IFtcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ1N1c2hpJywgdmFsdWU6ICdzdXNoaScgfSxcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ1BpenphJywgdmFsdWU6ICdwaXp6YScgfSxcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ0hvdCBEb2dzJywgdmFsdWU6ICdob3QgZG9ncycgfVxuICAgICAgICBdLFxuICAgICAgICBkZXNjcmlwdGlvbkl0ZW1zOiBbXG4gICAgICAgICAgJ1N1Z2dlc3RlZCByZXBsYWNlbWVudHMnXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0ZXh0QXJyYXlbaV0uY29tcG9uZW50KVxuICAgICAgICBjb25zdCByZWYgPSB0YXJnZXRSZWYudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuZWxlbWVudDtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkudGV4dCA9IHRleHRBcnJheVtpXS50ZXh0O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5jc3MgPSB0ZXh0QXJyYXlbaV0uY3NzO1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS50eXBlID0gdGV4dEFycmF5W2ldLnR5cGU7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLmNvbmZpZGVuY2UgPSB0ZXh0QXJyYXlbaV0uY29uZmlkZW5jZTtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkubWVudSA9IHRleHRBcnJheVtpXS5tZW51O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5kYXRhID0gdGV4dEFycmF5W2ldO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoZWwubmF0aXZlRWxlbWVudCwgcmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkodGV4dCkge1xuICAgIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgbG9jYWxseScpXG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRleHQsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy5yZW5kZXJDb21wb25lbnRzKGFuYWx5c2lzT3V0cHV0KVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkodGV4dCkge1xuICAgIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgZXh0ZXJuYWxseScpXG4gICAgY29uc3RydWN0Q29tcG9uZW50QXJyYXkodGhpcy50YXJnZXRJdGVtcywgdGV4dClcbiAgfVxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMudGV4dEFyZWEpIHtcbiAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wbGFjZUNhcmV0QXRFbmQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpO1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmdldFNlbGVjdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVSYW5nZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbCk7XG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCBjYWxsZWQgdG8gc2VsZWN0IGFsbCB0ZXh0IGluIGJveCBpZiBkb3VibGUgY2xpY2tlZCBhbnl3aGVyZSBpbiB0aGUgYm94XG4gIHNlbGVjdEFsbCgpIHtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnc2VsZWN0QWxsJywgZmFsc2UsIG51bGwpO1xuICB9XG59XG5cbi8vIGFsbCBnb29kIGhlcmUsIG5lZWRzIHRvIHN0aWxsIGxvb2sgZm9yIHRoZSBpdGVtcyBsb2NhbGx5IGFuZCBzZW5kIG91dCB0aGF0IHRvIHRleHQgYXJyYXlcbmZ1bmN0aW9uIGxvY2FsQW5hbHlzaXMoc2VhcmNoVGFyZ2V0cywgc3RyLCBjYXNlU2Vuc2l0aXZlKSB7XG4gIGNvbnNvbGUubG9nKCdpbiBsb2NhbCBhbmFseXNpcycpXG4gIGNvbnN0IG91dHB1dCA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgIGxldCBzdGFydEluZGV4ID0gMDtcbiAgICBsZXQgaW5kZXg7XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nO1xuICAgIH1cbiAgICBsZXQgc2VhcmNoaW5nU3RyaW5nO1xuICAgIGxldCBzZWFyY2hpbmdUZXh0O1xuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICBzZWFyY2hpbmdUZXh0ID0gaXRlbS50ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0cjtcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHQ7XG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzZWFyY2hpbmdTdHJpbmcuaW5kZXhPZihzZWFyY2hpbmdUZXh0LCBzdGFydEluZGV4KSkgPiAtMSkge1xuICAgICAgY29uc3QgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzdHIuc3Vic3RyaW5nKGluZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbiksXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgbWVudTogaXRlbS5tZW51ID8gaXRlbS5tZW51IDogbnVsbCxcbiAgICAgICAgdHlwZTogaXRlbS50eXBlID8gaXRlbS50eXBlIDogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKTtcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coJ291dHB1dCBmcm9tIGxvY2FsOiAnLCBvdXRwdXQpXG4gIHJldHVybiBjb25zdHJ1Y3RDb21wb25lbnRBcnJheShvdXRwdXQsIHN0cik7XG59XG5cblxuLy8gQ0hBTkdFIFRISVMgdG8gbWFrZSBjb21wbGV0ZSB0ZXh0IGFycmF5XG4vLyB0YWtlIGluIHRhcmdldHMgZm91bmQgYW5kIGluZGljZXMgb2YgYWxsLCBjcmVhdGUgYSBsYXJnZSB0ZXh0IGFycmF5IHdpdGggbm9uLXRhcmdldCB0ZXh0XG4vLyBhcHBlbmQgdHlwZSBvZiBjb21wb25lbnQgdG8gaXQgKFJlZ3VsYXJDb21wb25lbnQgb3IgSGlnaGxpZ2h0ZWRDb21wb25lbnQpXG5mdW5jdGlvbiBjb25zdHJ1Y3RDb21wb25lbnRBcnJheShzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgYXJyYXknKVxuICBjb25zdCBmaW5hbEFycmF5ID0gW11cbiAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWU7XG4gIGNvbnN0IGVycm9yZWRJdGVtcyA9IFtdO1xuICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCBvbmx5SXRlbSA9ICB7XG4gICAgICB0ZXh0OiBvcmlnaW5hbF90ZXh0LFxuICAgICAgY3NzOiBudWxsLFxuICAgICAgbWVudTogbnVsbCxcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgfVxuICAgIGZpbmFsQXJyYXkucHVzaChvbmx5SXRlbSlcbiAgICByZXR1cm4gZmluYWxBcnJheVxuICB9IGVsc2Uge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hSZXN1bHRzKSB7XG4gICAgICBpZiAoIWl0ZW0ubG9jYXRpb24pIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgbGV0IGVycm9yZWRJdGVtc1RleHQgPSAnJ1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICc7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvclRleHQgPSAnQW4gZXJyb3Igb2NjdXJlZC4gVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgKyAnRWl0aGVyIHByb3ZpZGUgcHJvcGVyIGluZGV4IGxvY2F0aW9ucyBvZiBlYWNoIGl0ZW0gdG8gYmUgaGlnaGxpZ2h0ZWQgb3Igc2V0IGxvY2FsQW5hbHlzaXMgdG8gdHJ1ZS4nO1xuICAgICAgY29uc3QgZXJyb3JJdGVtID0gIHtcbiAgICAgICAgdGV4dDogZXJyb3JUZXh0LFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGVycm9ySXRlbSlcbiAgICAgIHJldHVybiBmaW5hbEFycmF5XG4gICAgfVxuICB9XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdO1xuICB9KVxuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgZW5kID0gc2VhcmNoUmVzdWx0c1swXS5sb2NhdGlvblswXTtcbiAgbGV0IG1pZGRsZSA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGNvbnN0IHN0YXJ0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCksXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2goc3RhcnRJdGVtKVxuICAgICAgY29uc3QgZmlyc3RJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzZWFyY2hSZXN1bHRzW2ldLnRleHQsXG4gICAgICAgIGNzczogc2VhcmNoUmVzdWx0c1tpXS5jc3MsXG4gICAgICAgIG1lbnU6IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA/IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA6IG51bGwsXG4gICAgICAgIHR5cGU6IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA/IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogSGlnaGxpZ2h0ZWRDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChmaXJzdEl0ZW0pXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXh0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc2VhcmNoUmVzdWx0c1tpXS50ZXh0LFxuICAgICAgICBjc3M6IHNlYXJjaFJlc3VsdHNbaV0uY3NzLFxuICAgICAgICBtZW51OiBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgPyBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgOiBudWxsLFxuICAgICAgICB0eXBlOiBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgPyBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IEhpZ2hsaWdodGVkQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2gobmV4dEl0ZW0pXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSk7XG4gICAgICBjb25zdCBtaWRkbGVJdGVtID0ge1xuICAgICAgICB0ZXh0OiBtaWRkbGUsXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2gobWlkZGxlSXRlbSlcbiAgICAgIHN0YXJ0ID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF07XG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblsxXTtcbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGNvbnN0IGVuZEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpLFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGVuZEl0ZW0pXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKCdvdXRwdXQgb2YgYXJyYXkgY29uc3RydWN0aW9uOicsIGZpbmFsQXJyYXkpXG4gIHJldHVybiBmaW5hbEFycmF5O1xufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCB9IGZyb20gJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFRleHREaXJlY3RpdmUgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQuZGlyZWN0aXZlJ1xuaW1wb3J0IHsgSGlnaGxpZ2h0ZWRDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtaGlnaGxpZ2h0LmNvbXBvbmVudCdcbmltcG9ydCB7IFJlZ3VsYXJDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtcmVndWxhci5jb21wb25lbnQnXG5pbXBvcnQgeyBNYXRNZW51TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG5pbXBvcnQgeyBNYXRTZWxlY3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QnO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIE1hdE1lbnVNb2R1bGUsXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQsXG4gICAgVGV4dERpcmVjdGl2ZSxcbiAgICBIaWdobGlnaHRlZENvbXBvbmVudCxcbiAgICBSZWd1bGFyQ29tcG9uZW50XG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogWyBIaWdobGlnaHRlZENvbXBvbmVudCwgUmVndWxhckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztvQkFVa0IsTUFBTTswQkFDQSxJQUFJOzs7O1lBUDNCLFNBQVMsU0FBQztnQkFDUCxvSUFBNEM7YUFDL0M7OzttQkFFRSxLQUFLO2tCQUNMLEtBQUs7bUJBQ0wsS0FBSzt5QkFDTCxLQUFLO21CQUNMLEtBQUs7bUJBQ0wsS0FBSzs7Ozs7OztBQ2JSOztvQkFXa0IsTUFBTTswQkFDQSxJQUFJO3FCQUlsQixLQUFLOzs7Ozs7SUFPYixXQUFXLENBQUMsSUFBSTtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksR0FBSSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFFLENBQUE7UUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7O0tBRXpCOzs7O0lBRUQsV0FBVztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOztZQUNqQixNQUFNLE1BQU0sR0FBRztnQkFDYixTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTthQUNqQixDQUFBO1lBQ0Qs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