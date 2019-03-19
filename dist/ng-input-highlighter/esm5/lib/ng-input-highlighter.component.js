/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ComponentFactoryResolver, ViewChild, Renderer2, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RegularComponent } from './textComponents/text-regular.component';
import { HighlightedComponent } from './textComponents/text-highlight.component';
import { TextDirective } from './textComponents/text.directive';
var NgInputHighlighterComponent = /** @class */ (function () {
    function NgInputHighlighterComponent(componentFactoryResolver, renderer) {
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
    NgInputHighlighterComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Timer to check when to send request to text analysis
        this.textSubject.pipe(debounceTime(2000)).subscribe(function (text) {
            // console.log('idle and time to process', this.textArea)
            // console.log('idle and time to process', this.textArea)
            _this.responsePending = true;
            /** @type {?} */
            var new_text = _this.obtainText();
            _this.targetText.viewContainerRef.clear();
            _this.currentText.emit(new_text);
            // If we're doing local analysis, begin the process, otherwise- wait for response from service in onChanges
            if (_this.localAnalysis) {
                _this.constructLocally(new_text);
                setTimeout(function () {
                    _this.responsePending = false;
                    _this.focusInput();
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
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        var _this = this;
        if ((this.targetItems.length > 0) && (!this.localAnalysis)) {
            if (changes["targetItems"]) {
                console.log('new external target input received');
                /** @type {?} */
                var new_text = this.obtainText();
                this.targetText.viewContainerRef.clear();
                this.currentText.emit(new_text);
                this.constructExternally(new_text);
                setTimeout(function () {
                    _this.responsePending = false;
                    _this.focusInput();
                }, 500);
            }
        }
    };
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // Add event listeners to the DOM elements after rendered, allowing for box-border
        this.renderer.listen(this.targetText.viewContainerRef.element.nativeElement, 'focus', function () {
            _this.renderer.addClass(_this.inputBox.nativeElement, _this.boxFocus);
        });
        this.renderer.listen(this.targetText.viewContainerRef.element.nativeElement, 'blur', function () {
            _this.renderer.removeClass(_this.inputBox.nativeElement, _this.boxFocus);
        });
        // Method called upon a keystroke to begin the process of waiting for a 2 second pause in keystrokes
        this.renderer.listen(this.textArea.nativeElement, 'keyup', function () {
            console.log('keystroke');
            _this.textSubject.next();
        });
        // Focus the caret at the end of the box
        if (this.initFocus) {
            this.focusInput();
        }
    };
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.obtainText = /**
     * @return {?}
     */
    function () {
        console.log('target', this.targetText);
        if (this.textArea.nativeElement.childElementCount < 2) {
            console.log('one child element', this.textArea.nativeElement.childElementCount);
            /** @type {?} */
            var text = this.textArea.nativeElement.innerText;
            console.log(this.textArea);
            console.log('text obtained', text);
            return text;
        }
        else {
            console.log('lots of children elements', this.textArea.nativeElement.childElementCount);
            /** @type {?} */
            var childNodes = this.textArea.nativeElement.childNodes;
            /** @type {?} */
            var newText = '';
            console.log(this.textArea);
            if (this.textArea.nativeElement.childNodes.length > 1) {
                if (this.textArea.nativeElement.childNodes[1].localName === 'br') {
                    console.log('br exists- killing it');
                    this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1]);
                }
                if (this.textArea.nativeElement.childNodes[1].nodeName === '#text') {
                    console.log('clean delete- text exists in [1] exists- extracting it');
                    /** @type {?} */
                    var temp = this.textArea.nativeElement.childNodes[1].textContent;
                    this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1]);
                    if (this.textArea.nativeElement.childNodes[1].localName === 'br') {
                        console.log('a new br exists- killing it');
                        this.textArea.nativeElement.removeChild(this.textArea.nativeElement.childNodes[1]);
                    }
                    console.log('text obtained', temp);
                    return temp;
                }
            }
            for (var i = 0; i < childNodes.length; i++) {
                if (childNodes[i].innerText) {
                    newText = newText + ' ' + childNodes[i].innerText;
                }
            }
            console.log('text obtained', newText);
            return newText;
        }
    };
    /**
     * @param {?} textArray
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.renderComponents = /**
     * @param {?} textArray
     * @return {?}
     */
    function (textArray) {
        var _this = this;
        setTimeout(function () {
            console.log('in render', _this.textArea);
            /** @type {?} */
            var targetRef = _this.targetText;
            _this.textArea.nativeElement.firstChild.textContent = '';
            console.log('render array', textArray);
            /** @type {?} */
            var testMenu = {
                replacementOptions: [
                    { viewValue: 'Sushi', value: 'sushi' },
                    { viewValue: 'Pizza', value: 'pizza' },
                    { viewValue: 'Hot Dogs', value: 'hot dogs' }
                ],
                descriptionItems: [
                    'Suggested replacements'
                ]
            };
            for (var i = 0; i < textArray.length; i++) {
                /** @type {?} */
                var componentFactory = _this.componentFactoryResolver.resolveComponentFactory(textArray[i].component);
                /** @type {?} */
                var ref = targetRef.viewContainerRef.createComponent(componentFactory);
                /** @type {?} */
                var el = _this.targetText.viewContainerRef.element;
                (/** @type {?} */ (ref.instance)).text = textArray[i].text;
                (/** @type {?} */ (ref.instance)).css = textArray[i].css;
                (/** @type {?} */ (ref.instance)).type = textArray[i].type;
                (/** @type {?} */ (ref.instance)).confidence = textArray[i].confidence;
                (/** @type {?} */ (ref.instance)).menu = textArray[i].menu;
                (/** @type {?} */ (ref.instance)).data = textArray[i];
                _this.renderer.appendChild(el.nativeElement, ref.location.nativeElement);
            }
        });
    };
    // Method to construct the html string from an input text array without locations
    /**
     * @param {?} text
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.constructLocally = /**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        console.log('in construct locally');
        /** @type {?} */
        var analysisOutput = localAnalysis(this.targetItems, text, this.caseSensitive);
        this.renderComponents(analysisOutput);
    };
    // Method to construct the html string from an input text array with locations
    /**
     * @param {?} text
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.constructExternally = /**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        console.log('in construct externally');
        constructComponentArray(this.targetItems, text);
    };
    // ACCESSIBILITY
    // Method to direct the focus of any click to the desired location
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.focusInput = /**
     * @return {?}
     */
    function () {
        console.log('focus');
        if (this.textArea) {
            this.textArea.nativeElement.focus();
            this.placeCaretAtEnd(this.textArea.nativeElement);
        }
    };
    // Method to place the caret focus at the end of the last item of the text array
    /**
     * @param {?} el
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.placeCaretAtEnd = /**
     * @param {?} el
     * @return {?}
     */
    function (el) {
        el.focus();
        if (typeof window.getSelection !== 'undefined'
            && typeof document.createRange !== 'undefined') {
            /** @type {?} */
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            /** @type {?} */
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };
    // Method called to select all text in box if double clicked anywhere in the box
    /**
     * @return {?}
     */
    NgInputHighlighterComponent.prototype.selectAll = /**
     * @return {?}
     */
    function () {
        document.execCommand('selectAll', false, null);
    };
    NgInputHighlighterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'lib-ng-input-highlighter',
                    template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"[boxSize, boxClass]\">\n  <div class=\"text-area\" [ngClass]=\"{'pending': responsePending}\">\n    <div libTextHost #textArea contenteditable  id=\"input-span\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"></div>\n    <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n    <span (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"blank-input\"> </span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                    styles: ["#input-area{color:#000;margin-top:10px;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.none{background-color:#f3f6fa}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3;color:gray!important}#delete-this-one{font-style:italic;opacity:.7;color:#778899}"]
                }] }
    ];
    /** @nocollapse */
    NgInputHighlighterComponent.ctorParameters = function () { return [
        { type: ComponentFactoryResolver },
        { type: Renderer2 }
    ]; };
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
    return NgInputHighlighterComponent;
}());
export { NgInputHighlighterComponent };
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
    var e_1, _a;
    console.log('in local analysis');
    /** @type {?} */
    var output = [];
    try {
        for (var searchTargets_1 = tslib_1.__values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
            var item = searchTargets_1_1.value;
            /** @type {?} */
            var startIndex = 0;
            /** @type {?} */
            var index = void 0;
            /** @type {?} */
            var searchStrLen = item.text.length;
            if (searchStrLen === 0) {
                return 'An error occurred. There appears to be no input search string.';
            }
            /** @type {?} */
            var searchingString = void 0;
            /** @type {?} */
            var searchingText = void 0;
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
                var indexItem = {
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
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (searchTargets_1_1 && !searchTargets_1_1.done && (_a = searchTargets_1.return)) _a.call(searchTargets_1);
        }
        finally { if (e_1) throw e_1.error; }
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
    var e_2, _a, e_3, _b;
    console.log('in construct array');
    /** @type {?} */
    var finalArray = [];
    /** @type {?} */
    var locationChecker = true;
    /** @type {?} */
    var erroredItems = [];
    if (searchResults.length === 0) {
        /** @type {?} */
        var onlyItem = {
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
        try {
            for (var searchResults_1 = tslib_1.__values(searchResults), searchResults_1_1 = searchResults_1.next(); !searchResults_1_1.done; searchResults_1_1 = searchResults_1.next()) {
                var item = searchResults_1_1.value;
                if (!item.location) {
                    erroredItems.push(item);
                    locationChecker = false;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (searchResults_1_1 && !searchResults_1_1.done && (_a = searchResults_1.return)) _a.call(searchResults_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        if (!locationChecker) {
            /** @type {?} */
            var erroredItemsText = '';
            try {
                for (var erroredItems_1 = tslib_1.__values(erroredItems), erroredItems_1_1 = erroredItems_1.next(); !erroredItems_1_1.done; erroredItems_1_1 = erroredItems_1.next()) {
                    var item = erroredItems_1_1.value;
                    erroredItemsText = erroredItemsText + item.text + '  ';
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (erroredItems_1_1 && !erroredItems_1_1.done && (_b = erroredItems_1.return)) _b.call(erroredItems_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            /** @type {?} */
            var errorText = 'An error occured. The following items did not have a valid identified index location: ' + erroredItemsText
                + 'Either provide proper index locations of each item to be highlighted or set localAnalysis to true.';
            /** @type {?} */
            var errorItem = {
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
    var start = 0;
    /** @type {?} */
    var end = searchResults[0].location[0];
    /** @type {?} */
    var middle = '';
    for (var i = 0; i < searchResults.length; i++) {
        if (start === 0) {
            /** @type {?} */
            var startItem = {
                text: original_text.substring(start, end),
                css: null,
                menu: null,
                type: null,
                confidence: null,
                component: RegularComponent
            };
            finalArray.push(startItem);
            /** @type {?} */
            var firstItem = {
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
            var nextItem = {
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
            var middleItem = {
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
            var endItem = {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvIiwic291cmNlcyI6WyJsaWIvbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCx3QkFBd0IsRUFDeEIsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQWlCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNoSSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQTtBQUMxRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQTtBQUdoRixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUNBQWlDLENBQUE7O0lBZ0M3RCxxQ0FBb0Isd0JBQWtELEVBQVUsUUFBbUI7UUFBL0UsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7MkJBdEJ6RCxFQUFFOzZCQUNuQixJQUFJO3lCQUNSLEdBQUc7O3dCQUVKLElBQUk7eUJBQ0gsYUFBYTt3QkFDZCxNQUFNO3dCQUNOLFNBQVM7eUJBQ1IsSUFBSTs2QkFDQSxLQUFLOzJCQUNOLElBQUksWUFBWSxFQUFVOzJCQU9YLElBQUksT0FBTyxFQUFFOytCQUMzQixLQUFLO3lCQUNhLEVBQUU7S0FJNUM7Ozs7SUFFRCw4Q0FBUTs7O0lBQVI7UUFBQSxpQkErQkM7O1FBN0JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQ25CLENBQUMsU0FBUyxDQUFDLFVBQUEsSUFBSTs7WUFF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Q0FBQTtZQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDekI7S0FDRjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDeEQsT0FBTyxVQUFVLENBQUM7Q0FDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE9uSW5pdCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBWaWV3Q2hpbGQsIFJlbmRlcmVyMiwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFRleHRDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtYmxvY2suY29tcG9uZW50J1xuaW1wb3J0IHsgUmVndWxhckNvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1yZWd1bGFyLmNvbXBvbmVudCdcbmltcG9ydCB7IEhpZ2hsaWdodGVkQ29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LWhpZ2hsaWdodC5jb21wb25lbnQnXG5pbXBvcnQgeyBUYXJnZXRBcnJheUl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0VGV4dEl0ZW0uY2xhc3MnO1xuaW1wb3J0IHsgVGFyZ2V0SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRJdGVtcy5jbGFzcyc7XG5pbXBvcnQgeyBUZXh0RGlyZWN0aXZlIH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LmRpcmVjdGl2ZSdcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW5nLWlucHV0LWhpZ2hsaWdodGVyJyxcbiAgdGVtcGxhdGVVcmw6ICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5jc3MnXVxufSlcblxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcblxuICBASW5wdXQoKSB0YXJnZXRJdGVtczogQXJyYXk8VGFyZ2V0SXRlbT4gPSBbXTsgLy8gYW5hbHlzaXMgaW5zaWRlIGNvbXBvbmVudDogYXJyYXkgb2YgaXRlbXMgdG8gZmluZFxuICBASW5wdXQoKSBsb2NhbEFuYWx5c2lzID0gdHJ1ZTtcbiAgQElucHV0KCkgYm94SGVpZ2h0ID0gJ00nO1xuICAvLyBASW5wdXQoKSBoaWdoQ29udHJhc3QgPSB0cnVlIC8vIFRPLURPXG4gIEBJbnB1dCgpIGlkbGVUaW1lID0gMjAwMCAvLyBhbGxvdyBmb3IgY3VzdG9taXphdGlvbiBvbiBkZWJvdW5jZSB0aW1lXG4gIEBJbnB1dCgpIGZvbnRDbGFzcyA9ICdyZWd1bGFyVGV4dCc7IC8vIG9wdGlvbmFsIGNsYXNzIGZvciBpbnB1dCBvZiBzdHlsZSBmb3IgcmVndWxhciB0ZXh0IGluIGJveFxuICBASW5wdXQoKSBib3hDbGFzcyA9ICdub25lJztcbiAgQElucHV0KCkgYm94Rm9jdXMgPSAnZm9jdXNlZCc7XG4gIEBJbnB1dCgpIGluaXRGb2N1cyA9IHRydWU7IC8vIGFsbG93IGZvciBvcHRpb24gdG8gZm9jdXMgb24gY29tcG9uZW50IHRleHQgYm94IGluaXRpYWxseSwgcmVjb21tZW5kZWQgZm9yIGFjY2Vzc2liaWxpdHlcbiAgQElucHV0KCkgY2FzZVNlbnNpdGl2ZSA9IGZhbHNlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIHNlbGVjdCBjYXNlIHNlbnNpdGl2aXR5LSBkZWZhdWx0IHRvIG9mZlxuICBAT3V0cHV0KCkgY3VycmVudFRleHQgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTsgLy8gY3VycmVudCB0ZXh0IHN0cmluZywgd2lsbCBvdXRwdXQgZm9yIGFuYWx5c2lzIG9yIG90aGVyIHdvcmsgb3V0c2lkZVxuXG4gIEBWaWV3Q2hpbGQoJ3RleHRBcmVhJykgdGV4dEFyZWE6IEVsZW1lbnRSZWZcbiAgQFZpZXdDaGlsZCgnZW1wdHlUZXh0JykgZW1wdHlUZXh0OiBFbGVtZW50UmVmXG4gIEBWaWV3Q2hpbGQoVGV4dERpcmVjdGl2ZSkgdGFyZ2V0VGV4dDogVGV4dERpcmVjdGl2ZVxuICBAVmlld0NoaWxkKCdpbnB1dEJveCcpIGlucHV0Qm94OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgdGV4dFN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPiA9IG5ldyBTdWJqZWN0KCk7XG4gIHB1YmxpYyByZXNwb25zZVBlbmRpbmcgPSBmYWxzZTtcbiAgcHVibGljIHRleHRBcnJheTogQXJyYXk8VGFyZ2V0QXJyYXlJdGVtPiA9IFtdXG4gIHB1YmxpYyBib3hTaXplOiBTdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgLy8gVGltZXIgdG8gY2hlY2sgd2hlbiB0byBzZW5kIHJlcXVlc3QgdG8gdGV4dCBhbmFseXNpc1xuICAgIHRoaXMudGV4dFN1YmplY3QucGlwZShcbiAgICAgIGRlYm91bmNlVGltZSgyMDAwKVxuICAgICkuc3Vic2NyaWJlKHRleHQgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2lkbGUgYW5kIHRpbWUgdG8gcHJvY2VzcycsIHRoaXMudGV4dEFyZWEpXG4gICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IHRydWVcbiAgICAgIGNvbnN0IG5ld190ZXh0ID0gdGhpcy5vYnRhaW5UZXh0KClcbiAgICAgIHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmNsZWFyKClcbiAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdChuZXdfdGV4dCk7XG4gICAgLy8gSWYgd2UncmUgZG9pbmcgbG9jYWwgYW5hbHlzaXMsIGJlZ2luIHRoZSBwcm9jZXNzLCBvdGhlcndpc2UtIHdhaXQgZm9yIHJlc3BvbnNlIGZyb20gc2VydmljZSBpbiBvbkNoYW5nZXNcbiAgICAgIGlmICh0aGlzLmxvY2FsQW5hbHlzaXMpIHtcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RMb2NhbGx5KG5ld190ZXh0KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4c21hbGwnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdTJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3NtYWxsJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdsYXJnZSc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1hMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3hsYXJnZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdtZWRpdW0nO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMudGFyZ2V0SXRlbXMubGVuZ3RoID4gMCkgJiYgKCF0aGlzLmxvY2FsQW5hbHlzaXMpKSB7XG4gICAgICBpZiAoY2hhbmdlcy50YXJnZXRJdGVtcykge1xuICAgICAgICBjb25zb2xlLmxvZygnbmV3IGV4dGVybmFsIHRhcmdldCBpbnB1dCByZWNlaXZlZCcpXG4gICAgICAgIGNvbnN0IG5ld190ZXh0ID0gdGhpcy5vYnRhaW5UZXh0KClcbiAgICAgICAgdGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuY2xlYXIoKVxuICAgICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQobmV3X3RleHQpXG4gICAgICAgIHRoaXMuY29uc3RydWN0RXh0ZXJuYWxseShuZXdfdGV4dClcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICAgICAgfSwgNTAwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBBZGQgZXZlbnQgbGlzdGVuZXJzIHRvIHRoZSBET00gZWxlbWVudHMgYWZ0ZXIgcmVuZGVyZWQsIGFsbG93aW5nIGZvciBib3gtYm9yZGVyXG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnZm9jdXMnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgdGhpcy5ib3hGb2N1cyk7XG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnYmx1cicsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCB0aGlzLmJveEZvY3VzKTtcbiAgICB9KTtcbiAgICAvLyBNZXRob2QgY2FsbGVkIHVwb24gYSBrZXlzdHJva2UgdG8gYmVnaW4gdGhlIHByb2Nlc3Mgb2Ygd2FpdGluZyBmb3IgYSAyIHNlY29uZCBwYXVzZSBpbiBrZXlzdHJva2VzXG4gICAgdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LCAna2V5dXAnLCAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygna2V5c3Ryb2tlJylcbiAgICAgIHRoaXMudGV4dFN1YmplY3QubmV4dCgpO1xuICAgIH0pO1xuICAgIC8vIEZvY3VzIHRoZSBjYXJldCBhdCB0aGUgZW5kIG9mIHRoZSBib3hcbiAgICBpZiAodGhpcy5pbml0Rm9jdXMpIHtcbiAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgIH1cbiAgfVxuXG4gIG9idGFpblRleHQoKSB7XG4gICAgY29uc29sZS5sb2coJ3RhcmdldCcsIHRoaXMudGFyZ2V0VGV4dClcbiAgICBpZiAodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkRWxlbWVudENvdW50IDwgMikge1xuICAgICAgY29uc29sZS5sb2coJ29uZSBjaGlsZCBlbGVtZW50JywgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkRWxlbWVudENvdW50KVxuICAgICAgY29uc3QgdGV4dCA9IHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5pbm5lclRleHRcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMudGV4dEFyZWEpXG4gICAgICBjb25zb2xlLmxvZygndGV4dCBvYnRhaW5lZCcsIHRleHQpXG4gICAgICByZXR1cm4gdGV4dFxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnbG90cyBvZiBjaGlsZHJlbiBlbGVtZW50cycsIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudClcbiAgICAgIGNvbnN0IGNoaWxkTm9kZXMgPSB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1xuICAgICAgbGV0IG5ld1RleHQgPSAnJ1xuICAgICAgY29uc29sZS5sb2codGhpcy50ZXh0QXJlYSlcblxuICAgICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLmxvY2FsTmFtZSA9PT0gJ2JyJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdiciBleGlzdHMtIGtpbGxpbmcgaXQnKVxuICAgICAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXSlcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0ubm9kZU5hbWUgPT09ICcjdGV4dCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xlYW4gZGVsZXRlLSB0ZXh0IGV4aXN0cyBpbiBbMV0gZXhpc3RzLSBleHRyYWN0aW5nIGl0JylcbiAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0udGV4dENvbnRlbnRcbiAgICAgICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0pXG4gICAgICAgICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLmxvY2FsTmFtZSA9PT0gJ2JyJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2EgbmV3IGJyIGV4aXN0cy0ga2lsbGluZyBpdCcpXG4gICAgICAgICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnNvbGUubG9nKCd0ZXh0IG9idGFpbmVkJywgdGVtcClcbiAgICAgICAgICByZXR1cm4gdGVtcFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNoaWxkTm9kZXNbaV0uaW5uZXJUZXh0KSB7XG4gICAgICAgICAgbmV3VGV4dCA9IG5ld1RleHQgKyAnICcgKyBjaGlsZE5vZGVzW2ldLmlubmVyVGV4dFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygndGV4dCBvYnRhaW5lZCcsIG5ld1RleHQpXG4gICAgICByZXR1cm4gbmV3VGV4dFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudHModGV4dEFycmF5KSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnaW4gcmVuZGVyJywgdGhpcy50ZXh0QXJlYSlcbiAgICAgIGNvbnN0IHRhcmdldFJlZiA9IHRoaXMudGFyZ2V0VGV4dFxuICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmZpcnN0Q2hpbGQudGV4dENvbnRlbnQgPSAnJ1xuXG4gICAgICBjb25zb2xlLmxvZygncmVuZGVyIGFycmF5JywgdGV4dEFycmF5KVxuICAgICAgY29uc3QgdGVzdE1lbnUgPSB7XG4gICAgICAgIHJlcGxhY2VtZW50T3B0aW9uczogW1xuICAgICAgICAgIHsgdmlld1ZhbHVlOiAnU3VzaGknLCB2YWx1ZTogJ3N1c2hpJyB9LFxuICAgICAgICAgIHsgdmlld1ZhbHVlOiAnUGl6emEnLCB2YWx1ZTogJ3BpenphJyB9LFxuICAgICAgICAgIHsgdmlld1ZhbHVlOiAnSG90IERvZ3MnLCB2YWx1ZTogJ2hvdCBkb2dzJyB9XG4gICAgICAgIF0sXG4gICAgICAgIGRlc2NyaXB0aW9uSXRlbXM6IFtcbiAgICAgICAgICAnU3VnZ2VzdGVkIHJlcGxhY2VtZW50cydcbiAgICAgICAgXVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHRleHRBcnJheVtpXS5jb21wb25lbnQpXG4gICAgICAgIGNvbnN0IHJlZiA9IHRhcmdldFJlZi52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5KTtcbiAgICAgICAgY29uc3QgZWwgPSB0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5lbGVtZW50O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS50ZXh0ID0gdGV4dEFycmF5W2ldLnRleHQ7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLmNzcyA9IHRleHRBcnJheVtpXS5jc3M7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLnR5cGUgPSB0ZXh0QXJyYXlbaV0udHlwZTtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkuY29uZmlkZW5jZSA9IHRleHRBcnJheVtpXS5jb25maWRlbmNlO1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5tZW51ID0gdGV4dEFycmF5W2ldLm1lbnU7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLmRhdGEgPSB0ZXh0QXJyYXlbaV07XG5cbiAgICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChlbC5uYXRpdmVFbGVtZW50LCByZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aG91dCBsb2NhdGlvbnNcbiAgY29uc3RydWN0TG9jYWxseSh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coJ2luIGNvbnN0cnVjdCBsb2NhbGx5JylcbiAgICBjb25zdCBhbmFseXNpc091dHB1dCA9IGxvY2FsQW5hbHlzaXModGhpcy50YXJnZXRJdGVtcywgdGV4dCwgdGhpcy5jYXNlU2Vuc2l0aXZlKTtcbiAgICB0aGlzLnJlbmRlckNvbXBvbmVudHMoYW5hbHlzaXNPdXRwdXQpXG4gIH1cblxuICAvLyBNZXRob2QgdG8gY29uc3RydWN0IHRoZSBodG1sIHN0cmluZyBmcm9tIGFuIGlucHV0IHRleHQgYXJyYXkgd2l0aCBsb2NhdGlvbnNcbiAgY29uc3RydWN0RXh0ZXJuYWxseSh0ZXh0KSB7XG4gICAgY29uc29sZS5sb2coJ2luIGNvbnN0cnVjdCBleHRlcm5hbGx5JylcbiAgICBjb25zdHJ1Y3RDb21wb25lbnRBcnJheSh0aGlzLnRhcmdldEl0ZW1zLCB0ZXh0KVxuICB9XG5cbiAgLy8gQUNDRVNTSUJJTElUWVxuICAvLyBNZXRob2QgdG8gZGlyZWN0IHRoZSBmb2N1cyBvZiBhbnkgY2xpY2sgdG8gdGhlIGRlc2lyZWQgbG9jYXRpb25cbiAgZm9jdXNJbnB1dCgpIHtcbiAgICBjb25zb2xlLmxvZygnZm9jdXMnKTtcbiAgICBpZiAodGhpcy50ZXh0QXJlYSkge1xuICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICB0aGlzLnBsYWNlQ2FyZXRBdEVuZCh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBwbGFjZSB0aGUgY2FyZXQgZm9jdXMgYXQgdGhlIGVuZCBvZiB0aGUgbGFzdCBpdGVtIG9mIHRoZSB0ZXh0IGFycmF5XG4gIHBsYWNlQ2FyZXRBdEVuZChlbCkge1xuICAgIGVsLmZvY3VzKCk7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuZ2V0U2VsZWN0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgJiYgdHlwZW9mIGRvY3VtZW50LmNyZWF0ZVJhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xuICAgICAgcmFuZ2Uuc2VsZWN0Tm9kZUNvbnRlbnRzKGVsKTtcbiAgICAgIHJhbmdlLmNvbGxhcHNlKGZhbHNlKTtcbiAgICAgIGNvbnN0IHNlbCA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICAgIHNlbC5yZW1vdmVBbGxSYW5nZXMoKTtcbiAgICAgIHNlbC5hZGRSYW5nZShyYW5nZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIGNhbGxlZCB0byBzZWxlY3QgYWxsIHRleHQgaW4gYm94IGlmIGRvdWJsZSBjbGlja2VkIGFueXdoZXJlIGluIHRoZSBib3hcbiAgc2VsZWN0QWxsKCkge1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdzZWxlY3RBbGwnLCBmYWxzZSwgbnVsbCk7XG4gIH1cbn1cblxuLy8gYWxsIGdvb2QgaGVyZSwgbmVlZHMgdG8gc3RpbGwgbG9vayBmb3IgdGhlIGl0ZW1zIGxvY2FsbHkgYW5kIHNlbmQgb3V0IHRoYXQgdG8gdGV4dCBhcnJheVxuZnVuY3Rpb24gbG9jYWxBbmFseXNpcyhzZWFyY2hUYXJnZXRzLCBzdHIsIGNhc2VTZW5zaXRpdmUpIHtcbiAgY29uc29sZS5sb2coJ2luIGxvY2FsIGFuYWx5c2lzJylcbiAgY29uc3Qgb3V0cHV0ID0gW107XG4gIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hUYXJnZXRzKSB7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuICAgIGxldCBpbmRleDtcbiAgICBjb25zdCBzZWFyY2hTdHJMZW4gPSBpdGVtLnRleHQubGVuZ3RoO1xuICAgIGlmIChzZWFyY2hTdHJMZW4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuICdBbiBlcnJvciBvY2N1cnJlZC4gVGhlcmUgYXBwZWFycyB0byBiZSBubyBpbnB1dCBzZWFyY2ggc3RyaW5nLic7XG4gICAgfVxuICAgIGxldCBzZWFyY2hpbmdTdHJpbmc7XG4gICAgbGV0IHNlYXJjaGluZ1RleHQ7XG4gICAgaWYgKCFjYXNlU2Vuc2l0aXZlKSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHIudG9Mb3dlckNhc2UoKTtcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHQudG9Mb3dlckNhc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyO1xuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dDtcbiAgICB9XG4gICAgd2hpbGUgKChpbmRleCA9IHNlYXJjaGluZ1N0cmluZy5pbmRleE9mKHNlYXJjaGluZ1RleHQsIHN0YXJ0SW5kZXgpKSA+IC0xKSB7XG4gICAgICBjb25zdCBpbmRleEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IHN0ci5zdWJzdHJpbmcoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuKSxcbiAgICAgICAgbG9jYXRpb246IFtpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW5dLFxuICAgICAgICBtZW51OiBpdGVtLm1lbnUgPyBpdGVtLm1lbnUgOiBudWxsLFxuICAgICAgICB0eXBlOiBpdGVtLnR5cGUgPyBpdGVtLnR5cGUgOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjc3M6IGl0ZW0uY3NzXG4gICAgICB9XG4gICAgICBvdXRwdXQucHVzaChpbmRleEl0ZW0pO1xuICAgICAgc3RhcnRJbmRleCA9IGluZGV4ICsgc2VhcmNoU3RyTGVuO1xuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZygnb3V0cHV0IGZyb20gbG9jYWw6ICcsIG91dHB1dClcbiAgcmV0dXJuIGNvbnN0cnVjdENvbXBvbmVudEFycmF5KG91dHB1dCwgc3RyKTtcbn1cblxuXG4vLyBDSEFOR0UgVEhJUyB0byBtYWtlIGNvbXBsZXRlIHRleHQgYXJyYXlcbi8vIHRha2UgaW4gdGFyZ2V0cyBmb3VuZCBhbmQgaW5kaWNlcyBvZiBhbGwsIGNyZWF0ZSBhIGxhcmdlIHRleHQgYXJyYXkgd2l0aCBub24tdGFyZ2V0IHRleHRcbi8vIGFwcGVuZCB0eXBlIG9mIGNvbXBvbmVudCB0byBpdCAoUmVndWxhckNvbXBvbmVudCBvciBIaWdobGlnaHRlZENvbXBvbmVudClcbmZ1bmN0aW9uIGNvbnN0cnVjdENvbXBvbmVudEFycmF5KHNlYXJjaFJlc3VsdHMsIG9yaWdpbmFsX3RleHQpIHtcbiAgY29uc29sZS5sb2coJ2luIGNvbnN0cnVjdCBhcnJheScpXG4gIGNvbnN0IGZpbmFsQXJyYXkgPSBbXVxuICBsZXQgbG9jYXRpb25DaGVja2VyID0gdHJ1ZTtcbiAgY29uc3QgZXJyb3JlZEl0ZW1zID0gW107XG4gIGlmIChzZWFyY2hSZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGNvbnN0IG9ubHlJdGVtID0gIHtcbiAgICAgIHRleHQ6IG9yaWdpbmFsX3RleHQsXG4gICAgICBjc3M6IG51bGwsXG4gICAgICBtZW51OiBudWxsLFxuICAgICAgdHlwZTogbnVsbCxcbiAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICBjb21wb25lbnQ6IFJlZ3VsYXJDb21wb25lbnRcbiAgICB9XG4gICAgZmluYWxBcnJheS5wdXNoKG9ubHlJdGVtKVxuICAgIHJldHVybiBmaW5hbEFycmF5XG4gIH0gZWxzZSB7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFJlc3VsdHMpIHtcbiAgICAgIGlmICghaXRlbS5sb2NhdGlvbikge1xuICAgICAgICBlcnJvcmVkSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgbG9jYXRpb25DaGVja2VyID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghbG9jYXRpb25DaGVja2VyKSB7XG4gICAgICBsZXQgZXJyb3JlZEl0ZW1zVGV4dCA9ICcnXG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZXJyb3JlZEl0ZW1zKSB7XG4gICAgICAgIGVycm9yZWRJdGVtc1RleHQgPSBlcnJvcmVkSXRlbXNUZXh0ICsgaXRlbS50ZXh0ICsgJyAgJztcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVycm9yVGV4dCA9ICdBbiBlcnJvciBvY2N1cmVkLiBUaGUgZm9sbG93aW5nIGl0ZW1zIGRpZCBub3QgaGF2ZSBhIHZhbGlkIGlkZW50aWZpZWQgaW5kZXggbG9jYXRpb246ICcgKyBlcnJvcmVkSXRlbXNUZXh0XG4gICAgICArICdFaXRoZXIgcHJvdmlkZSBwcm9wZXIgaW5kZXggbG9jYXRpb25zIG9mIGVhY2ggaXRlbSB0byBiZSBoaWdobGlnaHRlZCBvciBzZXQgbG9jYWxBbmFseXNpcyB0byB0cnVlLic7XG4gICAgICBjb25zdCBlcnJvckl0ZW0gPSAge1xuICAgICAgICB0ZXh0OiBlcnJvclRleHQsXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2goZXJyb3JJdGVtKVxuICAgICAgcmV0dXJuIGZpbmFsQXJyYXlcbiAgICB9XG4gIH1cbiAgc2VhcmNoUmVzdWx0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYS5sb2NhdGlvblswXSAtIGIubG9jYXRpb25bMF07XG4gIH0pXG4gIGxldCBzdGFydCA9IDA7XG4gIGxldCBlbmQgPSBzZWFyY2hSZXN1bHRzWzBdLmxvY2F0aW9uWzBdO1xuICBsZXQgbWlkZGxlID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhcmNoUmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdGFydCA9PT0gMCkge1xuICAgICAgY29uc3Qgc3RhcnRJdGVtID0ge1xuICAgICAgICB0ZXh0OiBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzdGFydCwgZW5kKSxcbiAgICAgICAgY3NzOiBudWxsLFxuICAgICAgICBtZW51OiBudWxsLFxuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IFJlZ3VsYXJDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChzdGFydEl0ZW0pXG4gICAgICBjb25zdCBmaXJzdEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IHNlYXJjaFJlc3VsdHNbaV0udGV4dCxcbiAgICAgICAgY3NzOiBzZWFyY2hSZXN1bHRzW2ldLmNzcyxcbiAgICAgICAgbWVudTogc2VhcmNoUmVzdWx0c1tpXS5tZW51ID8gc2VhcmNoUmVzdWx0c1tpXS5tZW51IDogbnVsbCxcbiAgICAgICAgdHlwZTogc2VhcmNoUmVzdWx0c1tpXS50eXBlID8gc2VhcmNoUmVzdWx0c1tpXS50eXBlIDogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBIaWdobGlnaHRlZENvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGZpcnN0SXRlbSlcbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IG5leHRJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzZWFyY2hSZXN1bHRzW2ldLnRleHQsXG4gICAgICAgIGNzczogc2VhcmNoUmVzdWx0c1tpXS5jc3MsXG4gICAgICAgIG1lbnU6IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA/IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA6IG51bGwsXG4gICAgICAgIHR5cGU6IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA/IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogSGlnaGxpZ2h0ZWRDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChuZXh0SXRlbSlcbiAgICB9XG5cbiAgICBpZiAoc2VhcmNoUmVzdWx0c1tpICsgMV0pIHtcbiAgICAgIG1pZGRsZSA9IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHNlYXJjaFJlc3VsdHNbaV0ubG9jYXRpb25bMV0sIHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdKTtcbiAgICAgIGNvbnN0IG1pZGRsZUl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IG1pZGRsZSxcbiAgICAgICAgY3NzOiBudWxsLFxuICAgICAgICBtZW51OiBudWxsLFxuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IFJlZ3VsYXJDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChtaWRkbGVJdGVtKVxuICAgICAgc3RhcnQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXTtcbiAgICAgIGVuZCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzFdO1xuICAgIH1cblxuICAgIGlmIChpID09PSAoc2VhcmNoUmVzdWx0cy5sZW5ndGggLSAxKSkge1xuICAgICAgY29uc3QgZW5kSXRlbSA9IHtcbiAgICAgICAgdGV4dDogb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoZW5kLCBvcmlnaW5hbF90ZXh0Lmxlbmd0aCksXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2goZW5kSXRlbSlcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coJ291dHB1dCBvZiBhcnJheSBjb25zdHJ1Y3Rpb246JywgZmluYWxBcnJheSlcbiAgcmV0dXJuIGZpbmFsQXJyYXk7XG59XG4iXX0=