/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ComponentFactoryResolver, ViewChild, Renderer2, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RegularComponent } from './textComponents/text-regular.component';
import { HighlightedComponent } from './textComponents/text-highlight.component';
import { TextDirective } from './textComponents/text.directive';
export class NgInputHighlighterComponent {
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
            /** @type {?} */
            const testMenu = {
                replacementOptions: [
                    { viewValue: 'Sushi', value: 'sushi' },
                    { viewValue: 'Pizza', value: 'pizza' },
                    { viewValue: 'Hot Dogs', value: 'hot dogs' }
                ],
                descriptionItems: [
                    'Suggested replacements'
                ]
            };
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
if (false) {
    /** @type {?} */
    NgInputHighlighterComponent.prototype.targetItems;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.localAnalysis;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxHeight;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.idleTime;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.fontClass;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxClass;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxFocus;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.initFocus;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.caseSensitive;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.currentText;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.textArea;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.emptyText;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.targetText;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.inputBox;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.textSubject;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.responsePending;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.textArray;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.boxSize;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.componentFactoryResolver;
    /** @type {?} */
    NgInputHighlighterComponent.prototype.renderer;
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVULHdCQUF3QixFQUN4QixTQUFTLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBaUIsS0FBSyxFQUE0QixNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLHlDQUF5QyxDQUFBO0FBQzFFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDJDQUEyQyxDQUFBO0FBR2hGLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQTtBQVEvRCxNQUFNOzs7OztJQXdCSixZQUFvQix3QkFBa0QsRUFBVSxRQUFtQjtRQUEvRSw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVzsyQkF0QnpELEVBQUU7NkJBQ25CLElBQUk7eUJBQ1IsR0FBRzs7d0JBRUosSUFBSTt5QkFDSCxhQUFhO3dCQUNkLE1BQU07d0JBQ04sU0FBUzt5QkFDUixJQUFJOzZCQUNBLEtBQUs7MkJBQ04sSUFBSSxZQUFZLEVBQVU7MkJBT1gsSUFBSSxPQUFPLEVBQUU7K0JBQzNCLEtBQUs7eUJBQ2EsRUFBRTtLQUk1Qzs7OztJQUVELFFBQVE7O1FBRU4sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7O1lBRWpCLElB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LElBQUk7Z0JBQ1QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFNBQVMsRUFBRSxnQkFBZ0I7YUFDNUIsQ0FBQTtZQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDM0IsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTs7WUFDcEMsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsSUFBSSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3hELEdBQUcsRUFBRSxJQUFJO2dCQUNULElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUE7WUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1NBQ3pCO0tBQ0Y7SUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ3hELE9BQU8sVUFBVSxDQUFDO0NBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBUZXh0Q29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LWJsb2NrLmNvbXBvbmVudCdcbmltcG9ydCB7IFJlZ3VsYXJDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtcmVndWxhci5jb21wb25lbnQnXG5pbXBvcnQgeyBIaWdobGlnaHRlZENvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1oaWdobGlnaHQuY29tcG9uZW50J1xuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuaW1wb3J0IHsgVGV4dERpcmVjdGl2ZSB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC5kaXJlY3RpdmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZy1pbnB1dC1oaWdobGlnaHRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgdGFyZ2V0SXRlbXM6IEFycmF5PFRhcmdldEl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIGluc2lkZSBjb21wb25lbnQ6IGFycmF5IG9mIGl0ZW1zIHRvIGZpbmRcbiAgQElucHV0KCkgbG9jYWxBbmFseXNpcyA9IHRydWU7XG4gIEBJbnB1dCgpIGJveEhlaWdodCA9ICdNJztcbiAgLy8gQElucHV0KCkgaGlnaENvbnRyYXN0ID0gdHJ1ZSAvLyBUTy1ET1xuICBASW5wdXQoKSBpZGxlVGltZSA9IDIwMDAgLy8gYWxsb3cgZm9yIGN1c3RvbWl6YXRpb24gb24gZGVib3VuY2UgdGltZVxuICBASW5wdXQoKSBmb250Q2xhc3MgPSAncmVndWxhclRleHQnOyAvLyBvcHRpb25hbCBjbGFzcyBmb3IgaW5wdXQgb2Ygc3R5bGUgZm9yIHJlZ3VsYXIgdGV4dCBpbiBib3hcbiAgQElucHV0KCkgYm94Q2xhc3MgPSAnbm9uZSc7XG4gIEBJbnB1dCgpIGJveEZvY3VzID0gJ2ZvY3VzZWQnO1xuICBASW5wdXQoKSBpbml0Rm9jdXMgPSB0cnVlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIGZvY3VzIG9uIGNvbXBvbmVudCB0ZXh0IGJveCBpbml0aWFsbHksIHJlY29tbWVuZGVkIGZvciBhY2Nlc3NpYmlsaXR5XG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCd0ZXh0QXJlYScpIHRleHRBcmVhOiBFbGVtZW50UmVmXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5VGV4dCcpIGVtcHR5VGV4dDogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKFRleHREaXJlY3RpdmUpIHRhcmdldFRleHQ6IFRleHREaXJlY3RpdmVcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgYm94U2l6ZTogU3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIC8vIFRpbWVyIHRvIGNoZWNrIHdoZW4gdG8gc2VuZCByZXF1ZXN0IHRvIHRleHQgYW5hbHlzaXNcbiAgICB0aGlzLnRleHRTdWJqZWN0LnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMjAwMClcbiAgICApLnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpZGxlIGFuZCB0aW1lIHRvIHByb2Nlc3MnLCB0aGlzLnRleHRBcmVhKVxuICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSB0cnVlXG4gICAgICBjb25zdCBuZXdfdGV4dCA9IHRoaXMub2J0YWluVGV4dCgpXG4gICAgICB0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5jbGVhcigpXG4gICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQobmV3X3RleHQpO1xuICAgIC8vIElmIHdlJ3JlIGRvaW5nIGxvY2FsIGFuYWx5c2lzLCBiZWdpbiB0aGUgcHJvY2Vzcywgb3RoZXJ3aXNlLSB3YWl0IGZvciByZXNwb25zZSBmcm9tIHNlcnZpY2UgaW4gb25DaGFuZ2VzXG4gICAgICBpZiAodGhpcy5sb2NhbEFuYWx5c2lzKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TG9jYWxseShuZXdfdGV4dCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWFMnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneHNtYWxsJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdzbWFsbCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ0wnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbGFyZ2UnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4bGFyZ2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbWVkaXVtJztcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25ldyBleHRlcm5hbCB0YXJnZXQgaW5wdXQgcmVjZWl2ZWQnKVxuICAgICAgICBjb25zdCBuZXdfdGV4dCA9IHRoaXMub2J0YWluVGV4dCgpXG4gICAgICAgIHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmNsZWFyKClcbiAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KG5ld190ZXh0KVxuICAgICAgICB0aGlzLmNvbnN0cnVjdEV4dGVybmFsbHkobmV3X3RleHQpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsIHRoaXMuYm94Rm9jdXMpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JsdXInLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgdGhpcy5ib3hGb2N1cyk7XG4gICAgfSk7XG4gICAgLy8gTWV0aG9kIGNhbGxlZCB1cG9uIGEga2V5c3Ryb2tlIHRvIGJlZ2luIHRoZSBwcm9jZXNzIG9mIHdhaXRpbmcgZm9yIGEgMiBzZWNvbmQgcGF1c2UgaW4ga2V5c3Ryb2tlc1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2tleXVwJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2tleXN0cm9rZScpXG4gICAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoKTtcbiAgICB9KTtcbiAgICAvLyBGb2N1cyB0aGUgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgYm94XG4gICAgaWYgKHRoaXMuaW5pdEZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICB9XG4gIH1cblxuICBvYnRhaW5UZXh0KCkge1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0aGlzLnRhcmdldFRleHQpXG4gICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudCA8IDIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvbmUgY2hpbGQgZWxlbWVudCcsIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudClcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuaW5uZXJUZXh0XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnRleHRBcmVhKVxuICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCB0ZXh0KVxuICAgICAgcmV0dXJuIHRleHRcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2xvdHMgb2YgY2hpbGRyZW4gZWxlbWVudHMnLCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQpXG4gICAgICBjb25zdCBjaGlsZE5vZGVzID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNcbiAgICAgIGxldCBuZXdUZXh0ID0gJydcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMudGV4dEFyZWEpXG5cbiAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5sb2NhbE5hbWUgPT09ICdicicpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnYnIgZXhpc3RzLSBraWxsaW5nIGl0JylcbiAgICAgICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsZWFuIGRlbGV0ZS0gdGV4dCBleGlzdHMgaW4gWzFdIGV4aXN0cy0gZXh0cmFjdGluZyBpdCcpXG4gICAgICAgICAgY29uc3QgdGVtcCA9IHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLnRleHRDb250ZW50XG4gICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5sb2NhbE5hbWUgPT09ICdicicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhIG5ldyBiciBleGlzdHMtIGtpbGxpbmcgaXQnKVxuICAgICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZygndGV4dCBvYnRhaW5lZCcsIHRlbXApXG4gICAgICAgICAgcmV0dXJuIHRlbXBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGlsZE5vZGVzW2ldLmlubmVyVGV4dCkge1xuICAgICAgICAgIG5ld1RleHQgPSBuZXdUZXh0ICsgJyAnICsgY2hpbGROb2Rlc1tpXS5pbm5lclRleHRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCBuZXdUZXh0KVxuICAgICAgcmV0dXJuIG5ld1RleHRcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb21wb25lbnRzKHRleHRBcnJheSkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2luIHJlbmRlcicsIHRoaXMudGV4dEFyZWEpXG4gICAgICBjb25zdCB0YXJnZXRSZWYgPSB0aGlzLnRhcmdldFRleHRcbiAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5maXJzdENoaWxkLnRleHRDb250ZW50ID0gJydcblxuICAgICAgY29uc29sZS5sb2coJ3JlbmRlciBhcnJheScsIHRleHRBcnJheSlcbiAgICAgIGNvbnN0IHRlc3RNZW51ID0ge1xuICAgICAgICByZXBsYWNlbWVudE9wdGlvbnM6IFtcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ1N1c2hpJywgdmFsdWU6ICdzdXNoaScgfSxcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ1BpenphJywgdmFsdWU6ICdwaXp6YScgfSxcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ0hvdCBEb2dzJywgdmFsdWU6ICdob3QgZG9ncycgfVxuICAgICAgICBdLFxuICAgICAgICBkZXNjcmlwdGlvbkl0ZW1zOiBbXG4gICAgICAgICAgJ1N1Z2dlc3RlZCByZXBsYWNlbWVudHMnXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0ZXh0QXJyYXlbaV0uY29tcG9uZW50KVxuICAgICAgICBjb25zdCByZWYgPSB0YXJnZXRSZWYudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuZWxlbWVudDtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkudGV4dCA9IHRleHRBcnJheVtpXS50ZXh0O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5jc3MgPSB0ZXh0QXJyYXlbaV0uY3NzO1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS50eXBlID0gdGV4dEFycmF5W2ldLnR5cGU7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLmNvbmZpZGVuY2UgPSB0ZXh0QXJyYXlbaV0uY29uZmlkZW5jZTtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkubWVudSA9IHRleHRBcnJheVtpXS5tZW51O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5kYXRhID0gdGV4dEFycmF5W2ldO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoZWwubmF0aXZlRWxlbWVudCwgcmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkodGV4dCkge1xuICAgIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgbG9jYWxseScpXG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRleHQsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy5yZW5kZXJDb21wb25lbnRzKGFuYWx5c2lzT3V0cHV0KVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkodGV4dCkge1xuICAgIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgZXh0ZXJuYWxseScpXG4gICAgY29uc3RydWN0Q29tcG9uZW50QXJyYXkodGhpcy50YXJnZXRJdGVtcywgdGV4dClcbiAgfVxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMudGV4dEFyZWEpIHtcbiAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wbGFjZUNhcmV0QXRFbmQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpO1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmdldFNlbGVjdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVSYW5nZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbCk7XG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCBjYWxsZWQgdG8gc2VsZWN0IGFsbCB0ZXh0IGluIGJveCBpZiBkb3VibGUgY2xpY2tlZCBhbnl3aGVyZSBpbiB0aGUgYm94XG4gIHNlbGVjdEFsbCgpIHtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnc2VsZWN0QWxsJywgZmFsc2UsIG51bGwpO1xuICB9XG59XG5cbi8vIGFsbCBnb29kIGhlcmUsIG5lZWRzIHRvIHN0aWxsIGxvb2sgZm9yIHRoZSBpdGVtcyBsb2NhbGx5IGFuZCBzZW5kIG91dCB0aGF0IHRvIHRleHQgYXJyYXlcbmZ1bmN0aW9uIGxvY2FsQW5hbHlzaXMoc2VhcmNoVGFyZ2V0cywgc3RyLCBjYXNlU2Vuc2l0aXZlKSB7XG4gIGNvbnNvbGUubG9nKCdpbiBsb2NhbCBhbmFseXNpcycpXG4gIGNvbnN0IG91dHB1dCA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgIGxldCBzdGFydEluZGV4ID0gMDtcbiAgICBsZXQgaW5kZXg7XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nO1xuICAgIH1cbiAgICBsZXQgc2VhcmNoaW5nU3RyaW5nO1xuICAgIGxldCBzZWFyY2hpbmdUZXh0O1xuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICBzZWFyY2hpbmdUZXh0ID0gaXRlbS50ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0cjtcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHQ7XG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzZWFyY2hpbmdTdHJpbmcuaW5kZXhPZihzZWFyY2hpbmdUZXh0LCBzdGFydEluZGV4KSkgPiAtMSkge1xuICAgICAgY29uc3QgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzdHIuc3Vic3RyaW5nKGluZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbiksXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgbWVudTogaXRlbS5tZW51ID8gaXRlbS5tZW51IDogbnVsbCxcbiAgICAgICAgdHlwZTogaXRlbS50eXBlID8gaXRlbS50eXBlIDogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKTtcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coJ291dHB1dCBmcm9tIGxvY2FsOiAnLCBvdXRwdXQpXG4gIHJldHVybiBjb25zdHJ1Y3RDb21wb25lbnRBcnJheShvdXRwdXQsIHN0cik7XG59XG5cblxuLy8gQ0hBTkdFIFRISVMgdG8gbWFrZSBjb21wbGV0ZSB0ZXh0IGFycmF5XG4vLyB0YWtlIGluIHRhcmdldHMgZm91bmQgYW5kIGluZGljZXMgb2YgYWxsLCBjcmVhdGUgYSBsYXJnZSB0ZXh0IGFycmF5IHdpdGggbm9uLXRhcmdldCB0ZXh0XG4vLyBhcHBlbmQgdHlwZSBvZiBjb21wb25lbnQgdG8gaXQgKFJlZ3VsYXJDb21wb25lbnQgb3IgSGlnaGxpZ2h0ZWRDb21wb25lbnQpXG5mdW5jdGlvbiBjb25zdHJ1Y3RDb21wb25lbnRBcnJheShzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgYXJyYXknKVxuICBjb25zdCBmaW5hbEFycmF5ID0gW11cbiAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWU7XG4gIGNvbnN0IGVycm9yZWRJdGVtcyA9IFtdO1xuICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCBvbmx5SXRlbSA9ICB7XG4gICAgICB0ZXh0OiBvcmlnaW5hbF90ZXh0LFxuICAgICAgY3NzOiBudWxsLFxuICAgICAgbWVudTogbnVsbCxcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgfVxuICAgIGZpbmFsQXJyYXkucHVzaChvbmx5SXRlbSlcbiAgICByZXR1cm4gZmluYWxBcnJheVxuICB9IGVsc2Uge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hSZXN1bHRzKSB7XG4gICAgICBpZiAoIWl0ZW0ubG9jYXRpb24pIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgbGV0IGVycm9yZWRJdGVtc1RleHQgPSAnJ1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICc7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvclRleHQgPSAnQW4gZXJyb3Igb2NjdXJlZC4gVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgKyAnRWl0aGVyIHByb3ZpZGUgcHJvcGVyIGluZGV4IGxvY2F0aW9ucyBvZiBlYWNoIGl0ZW0gdG8gYmUgaGlnaGxpZ2h0ZWQgb3Igc2V0IGxvY2FsQW5hbHlzaXMgdG8gdHJ1ZS4nO1xuICAgICAgY29uc3QgZXJyb3JJdGVtID0gIHtcbiAgICAgICAgdGV4dDogZXJyb3JUZXh0LFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGVycm9ySXRlbSlcbiAgICAgIHJldHVybiBmaW5hbEFycmF5XG4gICAgfVxuICB9XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdO1xuICB9KVxuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgZW5kID0gc2VhcmNoUmVzdWx0c1swXS5sb2NhdGlvblswXTtcbiAgbGV0IG1pZGRsZSA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGNvbnN0IHN0YXJ0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCksXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2goc3RhcnRJdGVtKVxuICAgICAgY29uc3QgZmlyc3RJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzZWFyY2hSZXN1bHRzW2ldLnRleHQsXG4gICAgICAgIGNzczogc2VhcmNoUmVzdWx0c1tpXS5jc3MsXG4gICAgICAgIG1lbnU6IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA/IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA6IG51bGwsXG4gICAgICAgIHR5cGU6IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA/IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogSGlnaGxpZ2h0ZWRDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChmaXJzdEl0ZW0pXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXh0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc2VhcmNoUmVzdWx0c1tpXS50ZXh0LFxuICAgICAgICBjc3M6IHNlYXJjaFJlc3VsdHNbaV0uY3NzLFxuICAgICAgICBtZW51OiBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgPyBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgOiBudWxsLFxuICAgICAgICB0eXBlOiBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgPyBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IEhpZ2hsaWdodGVkQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2gobmV4dEl0ZW0pXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSk7XG4gICAgICBjb25zdCBtaWRkbGVJdGVtID0ge1xuICAgICAgICB0ZXh0OiBtaWRkbGUsXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2gobWlkZGxlSXRlbSlcbiAgICAgIHN0YXJ0ID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF07XG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblsxXTtcbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGNvbnN0IGVuZEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpLFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGVuZEl0ZW0pXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKCdvdXRwdXQgb2YgYXJyYXkgY29uc3RydWN0aW9uOicsIGZpbmFsQXJyYXkpXG4gIHJldHVybiBmaW5hbEFycmF5O1xufVxuIl19