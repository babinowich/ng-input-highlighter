import { Component, Input, Directive, ViewContainerRef, ComponentFactoryResolver, ViewChild, Renderer2, Output, EventEmitter, NgModule } from '@angular/core';
import { __values } from 'tslib';
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
var RegularComponent = /** @class */ (function () {
    function RegularComponent() {
        this.type = 'None';
        this.confidence = null;
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
    return RegularComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var HighlightedComponent = /** @class */ (function () {
    function HighlightedComponent() {
        this.type = 'None';
        this.confidence = null;
        this.added = false;
    }
    // @ViewChild('submenu')
    // set subMenu(value: MatMenu)  {
    //   this.text = value;
    // }
    /**
     * @param {?} text
     * @return {?}
     */
    HighlightedComponent.prototype.clickedText = /**
     * @param {?} text
     * @return {?}
     */
    function (text) {
        console.log('CLICKED:' + text + ' ', this.text, this.css);
        console.log(this.menu);
        //   this.clickActive = this.clickActive ? false : true
    };
    /**
     * @return {?}
     */
    HighlightedComponent.prototype.changedText = /**
     * @return {?}
     */
    function () {
        console.log('selected replacement:', this.selected);
        if (!this.added) {
            /** @type {?} */
            var ogItem = {
                viewValue: this.text,
                value: this.text
            };
            this.menu.replacementOptions.push(ogItem);
            this.added = true;
        }
        this.text = this.selected;
    };
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
    return HighlightedComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TextDirective = /** @class */ (function () {
    function TextDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    TextDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[libTextHost]',
                },] }
    ];
    /** @nocollapse */
    TextDirective.ctorParameters = function () { return [
        { type: ViewContainerRef }
    ]; };
    return TextDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
        for (var searchTargets_1 = __values(searchTargets), searchTargets_1_1 = searchTargets_1.next(); !searchTargets_1_1.done; searchTargets_1_1 = searchTargets_1.next()) {
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
            for (var searchResults_1 = __values(searchResults), searchResults_1_1 = searchResults_1.next(); !searchResults_1_1.done; searchResults_1_1 = searchResults_1.next()) {
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
                for (var erroredItems_1 = __values(erroredItems), erroredItems_1_1 = erroredItems_1.next(); !erroredItems_1_1.done; erroredItems_1_1 = erroredItems_1.next()) {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgInputHighlighterModule = /** @class */ (function () {
    function NgInputHighlighterModule() {
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
    return NgInputHighlighterModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgInputHighlighterComponent, NgInputHighlighterModule, HighlightedComponent as ɵb, RegularComponent as ɵc, TextDirective as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIuanMubWFwIiwic291cmNlcyI6WyJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi90ZXh0Q29tcG9uZW50cy90ZXh0LXJlZ3VsYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvdGV4dENvbXBvbmVudHMvdGV4dC1oaWdobGlnaHQuY29tcG9uZW50LnRzIiwibmc6Ly9uZy1pbnB1dC1oaWdobGlnaHRlci9saWIvdGV4dENvbXBvbmVudHMvdGV4dC5kaXJlY3RpdmUudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi9uZy1pbnB1dC1oaWdobGlnaHRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGV4dENvbXBvbmVudCB9IGZyb20gJy4vdGV4dC1ibG9jay5jb21wb25lbnQnO1xuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tICcuLi9jbGFzc2VzL21lbnVJdGVtLmNsYXNzJ1xuXG5AQ29tcG9uZW50KHtcbiAgICB0ZW1wbGF0ZVVybDogJy4vdGV4dC1yZWd1bGFyLmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBSZWd1bGFyQ29tcG9uZW50IGltcGxlbWVudHMgVGV4dENvbXBvbmVudCB7XG4gIEBJbnB1dCgpIHRleHQ6IHN0cmluZztcbiAgQElucHV0KCkgY3NzOiBzdHJpbmdcbiAgQElucHV0KCkgdHlwZSA9ICdOb25lJ1xuICBASW5wdXQoKSBjb25maWRlbmNlID0gbnVsbFxuICBASW5wdXQoKSBtZW51OiBNZW51SXRlbTtcbiAgQElucHV0KCkgZGF0YTogYW55O1xuXG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRleHRDb21wb25lbnQgfSBmcm9tICcuL3RleHQtYmxvY2suY29tcG9uZW50JztcbmltcG9ydCB7IE1hdE1lbnUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9tZW51JztcblxuaW1wb3J0IHsgTWVudUl0ZW0gfSBmcm9tICcuLi9jbGFzc2VzL21lbnVJdGVtLmNsYXNzJ1xuQENvbXBvbmVudCh7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3RleHQtaGlnaGxpZ2h0LmNvbXBvbmVudC5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBIaWdobGlnaHRlZENvbXBvbmVudCBpbXBsZW1lbnRzIFRleHRDb21wb25lbnQge1xuICBASW5wdXQoKSB0ZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNzczogc3RyaW5nXG4gIEBJbnB1dCgpIHR5cGUgPSAnTm9uZSdcbiAgQElucHV0KCkgY29uZmlkZW5jZSA9IG51bGxcbiAgQElucHV0KCkgbWVudTogTWVudUl0ZW1cbiAgQElucHV0KCkgZGF0YTogYW55O1xuICBzZWxlY3RlZDogc3RyaW5nO1xuICBhZGRlZCA9IGZhbHNlXG4gIC8vIEBWaWV3Q2hpbGQoJ3N1Ym1lbnUnKVxuICAvLyBzZXQgc3ViTWVudSh2YWx1ZTogTWF0TWVudSkgIHtcbiAgLy8gICB0aGlzLnRleHQgPSB2YWx1ZTtcbiAgLy8gfVxuXG5cbiAgY2xpY2tlZFRleHQodGV4dCkge1xuICAgICAgY29uc29sZS5sb2coJ0NMSUNLRUQ6JyArIHRleHQgICsgJyAnLCB0aGlzLnRleHQsIHRoaXMuY3NzIClcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubWVudSlcbiAgICAvLyAgIHRoaXMuY2xpY2tBY3RpdmUgPSB0aGlzLmNsaWNrQWN0aXZlID8gZmFsc2UgOiB0cnVlXG4gIH1cblxuICBjaGFuZ2VkVGV4dCgpIHtcbiAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgcmVwbGFjZW1lbnQ6JywgdGhpcy5zZWxlY3RlZClcbiAgICBpZiAoIXRoaXMuYWRkZWQpIHtcbiAgICBjb25zdCBvZ0l0ZW0gPSB7XG4gICAgICB2aWV3VmFsdWU6IHRoaXMudGV4dCxcbiAgICAgIHZhbHVlOiB0aGlzLnRleHRcbiAgICB9XG4gICAgdGhpcy5tZW51LnJlcGxhY2VtZW50T3B0aW9ucy5wdXNoKG9nSXRlbSlcbiAgICB0aGlzLmFkZGVkID0gdHJ1ZVxuICAgIH1cbiAgICB0aGlzLnRleHQgPSB0aGlzLnNlbGVjdGVkXG4gIH1cbn1cbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbGliVGV4dEhvc3RdJyxcbn0pXG5leHBvcnQgY2xhc3MgVGV4dERpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmKSB7IH1cbn1cblxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgVmlld0NoaWxkLCBSZW5kZXJlcjIsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBUZXh0Q29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LWJsb2NrLmNvbXBvbmVudCdcbmltcG9ydCB7IFJlZ3VsYXJDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtcmVndWxhci5jb21wb25lbnQnXG5pbXBvcnQgeyBIaWdobGlnaHRlZENvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1oaWdobGlnaHQuY29tcG9uZW50J1xuaW1wb3J0IHsgVGFyZ2V0QXJyYXlJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldFRleHRJdGVtLmNsYXNzJztcbmltcG9ydCB7IFRhcmdldEl0ZW0gfSBmcm9tICcuL2NsYXNzZXMvdGFyZ2V0SXRlbXMuY2xhc3MnO1xuaW1wb3J0IHsgVGV4dERpcmVjdGl2ZSB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC5kaXJlY3RpdmUnXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2xpYi1uZy1pbnB1dC1oaWdobGlnaHRlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1pbnB1dC1oaWdobGlnaHRlci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY3NzJ11cbn0pXG5cbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCB7XG5cbiAgQElucHV0KCkgdGFyZ2V0SXRlbXM6IEFycmF5PFRhcmdldEl0ZW0+ID0gW107IC8vIGFuYWx5c2lzIGluc2lkZSBjb21wb25lbnQ6IGFycmF5IG9mIGl0ZW1zIHRvIGZpbmRcbiAgQElucHV0KCkgbG9jYWxBbmFseXNpcyA9IHRydWU7XG4gIEBJbnB1dCgpIGJveEhlaWdodCA9ICdNJztcbiAgLy8gQElucHV0KCkgaGlnaENvbnRyYXN0ID0gdHJ1ZSAvLyBUTy1ET1xuICBASW5wdXQoKSBpZGxlVGltZSA9IDIwMDAgLy8gYWxsb3cgZm9yIGN1c3RvbWl6YXRpb24gb24gZGVib3VuY2UgdGltZVxuICBASW5wdXQoKSBmb250Q2xhc3MgPSAncmVndWxhclRleHQnOyAvLyBvcHRpb25hbCBjbGFzcyBmb3IgaW5wdXQgb2Ygc3R5bGUgZm9yIHJlZ3VsYXIgdGV4dCBpbiBib3hcbiAgQElucHV0KCkgYm94Q2xhc3MgPSAnbm9uZSc7XG4gIEBJbnB1dCgpIGJveEZvY3VzID0gJ2ZvY3VzZWQnO1xuICBASW5wdXQoKSBpbml0Rm9jdXMgPSB0cnVlOyAvLyBhbGxvdyBmb3Igb3B0aW9uIHRvIGZvY3VzIG9uIGNvbXBvbmVudCB0ZXh0IGJveCBpbml0aWFsbHksIHJlY29tbWVuZGVkIGZvciBhY2Nlc3NpYmlsaXR5XG4gIEBJbnB1dCgpIGNhc2VTZW5zaXRpdmUgPSBmYWxzZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBzZWxlY3QgY2FzZSBzZW5zaXRpdml0eS0gZGVmYXVsdCB0byBvZmZcbiAgQE91dHB1dCgpIGN1cnJlbnRUZXh0ID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7IC8vIGN1cnJlbnQgdGV4dCBzdHJpbmcsIHdpbGwgb3V0cHV0IGZvciBhbmFseXNpcyBvciBvdGhlciB3b3JrIG91dHNpZGVcblxuICBAVmlld0NoaWxkKCd0ZXh0QXJlYScpIHRleHRBcmVhOiBFbGVtZW50UmVmXG4gIEBWaWV3Q2hpbGQoJ2VtcHR5VGV4dCcpIGVtcHR5VGV4dDogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKFRleHREaXJlY3RpdmUpIHRhcmdldFRleHQ6IFRleHREaXJlY3RpdmVcbiAgQFZpZXdDaGlsZCgnaW5wdXRCb3gnKSBpbnB1dEJveDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHRleHRTdWJqZWN0OiBTdWJqZWN0PHN0cmluZz4gPSBuZXcgU3ViamVjdCgpO1xuICBwdWJsaWMgcmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gIHB1YmxpYyB0ZXh0QXJyYXk6IEFycmF5PFRhcmdldEFycmF5SXRlbT4gPSBbXVxuICBwdWJsaWMgYm94U2l6ZTogU3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIC8vIFRpbWVyIHRvIGNoZWNrIHdoZW4gdG8gc2VuZCByZXF1ZXN0IHRvIHRleHQgYW5hbHlzaXNcbiAgICB0aGlzLnRleHRTdWJqZWN0LnBpcGUoXG4gICAgICBkZWJvdW5jZVRpbWUoMjAwMClcbiAgICApLnN1YnNjcmliZSh0ZXh0ID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpZGxlIGFuZCB0aW1lIHRvIHByb2Nlc3MnLCB0aGlzLnRleHRBcmVhKVxuICAgICAgdGhpcy5yZXNwb25zZVBlbmRpbmcgPSB0cnVlXG4gICAgICBjb25zdCBuZXdfdGV4dCA9IHRoaXMub2J0YWluVGV4dCgpXG4gICAgICB0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5jbGVhcigpXG4gICAgICB0aGlzLmN1cnJlbnRUZXh0LmVtaXQobmV3X3RleHQpO1xuICAgIC8vIElmIHdlJ3JlIGRvaW5nIGxvY2FsIGFuYWx5c2lzLCBiZWdpbiB0aGUgcHJvY2Vzcywgb3RoZXJ3aXNlLSB3YWl0IGZvciByZXNwb25zZSBmcm9tIHNlcnZpY2UgaW4gb25DaGFuZ2VzXG4gICAgICBpZiAodGhpcy5sb2NhbEFuYWx5c2lzKSB7XG4gICAgICAgIHRoaXMuY29uc3RydWN0TG9jYWxseShuZXdfdGV4dCk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWFMnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneHNtYWxsJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnUycpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICdzbWFsbCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ0wnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbGFyZ2UnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdYTCcpIHtcbiAgICAgIHRoaXMuYm94U2l6ZSA9ICd4bGFyZ2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnbWVkaXVtJztcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCh0aGlzLnRhcmdldEl0ZW1zLmxlbmd0aCA+IDApICYmICghdGhpcy5sb2NhbEFuYWx5c2lzKSkge1xuICAgICAgaWYgKGNoYW5nZXMudGFyZ2V0SXRlbXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25ldyBleHRlcm5hbCB0YXJnZXQgaW5wdXQgcmVjZWl2ZWQnKVxuICAgICAgICBjb25zdCBuZXdfdGV4dCA9IHRoaXMub2J0YWluVGV4dCgpXG4gICAgICAgIHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmNsZWFyKClcbiAgICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KG5ld190ZXh0KVxuICAgICAgICB0aGlzLmNvbnN0cnVjdEV4dGVybmFsbHkobmV3X3RleHQpXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIH0sIDUwMClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byB0aGUgRE9NIGVsZW1lbnRzIGFmdGVyIHJlbmRlcmVkLCBhbGxvd2luZyBmb3IgYm94LWJvcmRlclxuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsIHRoaXMuYm94Rm9jdXMpO1xuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JsdXInLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuaW5wdXRCb3gubmF0aXZlRWxlbWVudCwgdGhpcy5ib3hGb2N1cyk7XG4gICAgfSk7XG4gICAgLy8gTWV0aG9kIGNhbGxlZCB1cG9uIGEga2V5c3Ryb2tlIHRvIGJlZ2luIHRoZSBwcm9jZXNzIG9mIHdhaXRpbmcgZm9yIGEgMiBzZWNvbmQgcGF1c2UgaW4ga2V5c3Ryb2tlc1xuICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCwgJ2tleXVwJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2tleXN0cm9rZScpXG4gICAgICB0aGlzLnRleHRTdWJqZWN0Lm5leHQoKTtcbiAgICB9KTtcbiAgICAvLyBGb2N1cyB0aGUgY2FyZXQgYXQgdGhlIGVuZCBvZiB0aGUgYm94XG4gICAgaWYgKHRoaXMuaW5pdEZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzSW5wdXQoKTtcbiAgICB9XG4gIH1cblxuICBvYnRhaW5UZXh0KCkge1xuICAgIGNvbnNvbGUubG9nKCd0YXJnZXQnLCB0aGlzLnRhcmdldFRleHQpXG4gICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudCA8IDIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvbmUgY2hpbGQgZWxlbWVudCcsIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudClcbiAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuaW5uZXJUZXh0XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnRleHRBcmVhKVxuICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCB0ZXh0KVxuICAgICAgcmV0dXJuIHRleHRcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2xvdHMgb2YgY2hpbGRyZW4gZWxlbWVudHMnLCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQpXG4gICAgICBjb25zdCBjaGlsZE5vZGVzID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNcbiAgICAgIGxldCBuZXdUZXh0ID0gJydcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMudGV4dEFyZWEpXG5cbiAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5sb2NhbE5hbWUgPT09ICdicicpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnYnIgZXhpc3RzLSBraWxsaW5nIGl0JylcbiAgICAgICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0pXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLm5vZGVOYW1lID09PSAnI3RleHQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NsZWFuIGRlbGV0ZS0gdGV4dCBleGlzdHMgaW4gWzFdIGV4aXN0cy0gZXh0cmFjdGluZyBpdCcpXG4gICAgICAgICAgY29uc3QgdGVtcCA9IHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdLnRleHRDb250ZW50XG4gICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5sb2NhbE5hbWUgPT09ICdicicpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhIG5ldyBiciBleGlzdHMtIGtpbGxpbmcgaXQnKVxuICAgICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zb2xlLmxvZygndGV4dCBvYnRhaW5lZCcsIHRlbXApXG4gICAgICAgICAgcmV0dXJuIHRlbXBcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChjaGlsZE5vZGVzW2ldLmlubmVyVGV4dCkge1xuICAgICAgICAgIG5ld1RleHQgPSBuZXdUZXh0ICsgJyAnICsgY2hpbGROb2Rlc1tpXS5pbm5lclRleHRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCBuZXdUZXh0KVxuICAgICAgcmV0dXJuIG5ld1RleHRcbiAgICB9XG4gIH1cblxuICByZW5kZXJDb21wb25lbnRzKHRleHRBcnJheSkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ2luIHJlbmRlcicsIHRoaXMudGV4dEFyZWEpXG4gICAgICBjb25zdCB0YXJnZXRSZWYgPSB0aGlzLnRhcmdldFRleHRcbiAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5maXJzdENoaWxkLnRleHRDb250ZW50ID0gJydcblxuICAgICAgY29uc29sZS5sb2coJ3JlbmRlciBhcnJheScsIHRleHRBcnJheSlcbiAgICAgIGNvbnN0IHRlc3RNZW51ID0ge1xuICAgICAgICByZXBsYWNlbWVudE9wdGlvbnM6IFtcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ1N1c2hpJywgdmFsdWU6ICdzdXNoaScgfSxcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ1BpenphJywgdmFsdWU6ICdwaXp6YScgfSxcbiAgICAgICAgICB7IHZpZXdWYWx1ZTogJ0hvdCBEb2dzJywgdmFsdWU6ICdob3QgZG9ncycgfVxuICAgICAgICBdLFxuICAgICAgICBkZXNjcmlwdGlvbkl0ZW1zOiBbXG4gICAgICAgICAgJ1N1Z2dlc3RlZCByZXBsYWNlbWVudHMnXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudEZhY3RvcnlSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeSh0ZXh0QXJyYXlbaV0uY29tcG9uZW50KVxuICAgICAgICBjb25zdCByZWYgPSB0YXJnZXRSZWYudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuZWxlbWVudDtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkudGV4dCA9IHRleHRBcnJheVtpXS50ZXh0O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5jc3MgPSB0ZXh0QXJyYXlbaV0uY3NzO1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS50eXBlID0gdGV4dEFycmF5W2ldLnR5cGU7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLmNvbmZpZGVuY2UgPSB0ZXh0QXJyYXlbaV0uY29uZmlkZW5jZTtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkubWVudSA9IHRleHRBcnJheVtpXS5tZW51O1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5kYXRhID0gdGV4dEFycmF5W2ldO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQoZWwubmF0aXZlRWxlbWVudCwgcmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGhvdXQgbG9jYXRpb25zXG4gIGNvbnN0cnVjdExvY2FsbHkodGV4dCkge1xuICAgIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgbG9jYWxseScpXG4gICAgY29uc3QgYW5hbHlzaXNPdXRwdXQgPSBsb2NhbEFuYWx5c2lzKHRoaXMudGFyZ2V0SXRlbXMsIHRleHQsIHRoaXMuY2FzZVNlbnNpdGl2ZSk7XG4gICAgdGhpcy5yZW5kZXJDb21wb25lbnRzKGFuYWx5c2lzT3V0cHV0KVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGNvbnN0cnVjdCB0aGUgaHRtbCBzdHJpbmcgZnJvbSBhbiBpbnB1dCB0ZXh0IGFycmF5IHdpdGggbG9jYXRpb25zXG4gIGNvbnN0cnVjdEV4dGVybmFsbHkodGV4dCkge1xuICAgIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgZXh0ZXJuYWxseScpXG4gICAgY29uc3RydWN0Q29tcG9uZW50QXJyYXkodGhpcy50YXJnZXRJdGVtcywgdGV4dClcbiAgfVxuXG4gIC8vIEFDQ0VTU0lCSUxJVFlcbiAgLy8gTWV0aG9kIHRvIGRpcmVjdCB0aGUgZm9jdXMgb2YgYW55IGNsaWNrIHRvIHRoZSBkZXNpcmVkIGxvY2F0aW9uXG4gIGZvY3VzSW5wdXQoKSB7XG4gICAgY29uc29sZS5sb2coJ2ZvY3VzJyk7XG4gICAgaWYgKHRoaXMudGV4dEFyZWEpIHtcbiAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgdGhpcy5wbGFjZUNhcmV0QXRFbmQodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcGxhY2UgdGhlIGNhcmV0IGZvY3VzIGF0IHRoZSBlbmQgb2YgdGhlIGxhc3QgaXRlbSBvZiB0aGUgdGV4dCBhcnJheVxuICBwbGFjZUNhcmV0QXRFbmQoZWwpIHtcbiAgICBlbC5mb2N1cygpO1xuICAgIGlmICh0eXBlb2Ygd2luZG93LmdldFNlbGVjdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVSYW5nZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcbiAgICAgIHJhbmdlLnNlbGVjdE5vZGVDb250ZW50cyhlbCk7XG4gICAgICByYW5nZS5jb2xsYXBzZShmYWxzZSk7XG4gICAgICBjb25zdCBzZWwgPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgICBzZWwucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICBzZWwuYWRkUmFuZ2UocmFuZ2UpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCBjYWxsZWQgdG8gc2VsZWN0IGFsbCB0ZXh0IGluIGJveCBpZiBkb3VibGUgY2xpY2tlZCBhbnl3aGVyZSBpbiB0aGUgYm94XG4gIHNlbGVjdEFsbCgpIHtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnc2VsZWN0QWxsJywgZmFsc2UsIG51bGwpO1xuICB9XG59XG5cbi8vIGFsbCBnb29kIGhlcmUsIG5lZWRzIHRvIHN0aWxsIGxvb2sgZm9yIHRoZSBpdGVtcyBsb2NhbGx5IGFuZCBzZW5kIG91dCB0aGF0IHRvIHRleHQgYXJyYXlcbmZ1bmN0aW9uIGxvY2FsQW5hbHlzaXMoc2VhcmNoVGFyZ2V0cywgc3RyLCBjYXNlU2Vuc2l0aXZlKSB7XG4gIGNvbnNvbGUubG9nKCdpbiBsb2NhbCBhbmFseXNpcycpXG4gIGNvbnN0IG91dHB1dCA9IFtdO1xuICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoVGFyZ2V0cykge1xuICAgIGxldCBzdGFydEluZGV4ID0gMDtcbiAgICBsZXQgaW5kZXg7XG4gICAgY29uc3Qgc2VhcmNoU3RyTGVuID0gaXRlbS50ZXh0Lmxlbmd0aDtcbiAgICBpZiAoc2VhcmNoU3RyTGVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnQW4gZXJyb3Igb2NjdXJyZWQuIFRoZXJlIGFwcGVhcnMgdG8gYmUgbm8gaW5wdXQgc2VhcmNoIHN0cmluZy4nO1xuICAgIH1cbiAgICBsZXQgc2VhcmNoaW5nU3RyaW5nO1xuICAgIGxldCBzZWFyY2hpbmdUZXh0O1xuICAgIGlmICghY2FzZVNlbnNpdGl2ZSkge1xuICAgICAgc2VhcmNoaW5nU3RyaW5nID0gc3RyLnRvTG93ZXJDYXNlKCk7XG4gICAgICBzZWFyY2hpbmdUZXh0ID0gaXRlbS50ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0cjtcbiAgICAgIHNlYXJjaGluZ1RleHQgPSBpdGVtLnRleHQ7XG4gICAgfVxuICAgIHdoaWxlICgoaW5kZXggPSBzZWFyY2hpbmdTdHJpbmcuaW5kZXhPZihzZWFyY2hpbmdUZXh0LCBzdGFydEluZGV4KSkgPiAtMSkge1xuICAgICAgY29uc3QgaW5kZXhJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzdHIuc3Vic3RyaW5nKGluZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbiksXG4gICAgICAgIGxvY2F0aW9uOiBbaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyTGVuXSxcbiAgICAgICAgbWVudTogaXRlbS5tZW51ID8gaXRlbS5tZW51IDogbnVsbCxcbiAgICAgICAgdHlwZTogaXRlbS50eXBlID8gaXRlbS50eXBlIDogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY3NzOiBpdGVtLmNzc1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2goaW5kZXhJdGVtKTtcbiAgICAgIHN0YXJ0SW5kZXggPSBpbmRleCArIHNlYXJjaFN0ckxlbjtcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2coJ291dHB1dCBmcm9tIGxvY2FsOiAnLCBvdXRwdXQpXG4gIHJldHVybiBjb25zdHJ1Y3RDb21wb25lbnRBcnJheShvdXRwdXQsIHN0cik7XG59XG5cblxuLy8gQ0hBTkdFIFRISVMgdG8gbWFrZSBjb21wbGV0ZSB0ZXh0IGFycmF5XG4vLyB0YWtlIGluIHRhcmdldHMgZm91bmQgYW5kIGluZGljZXMgb2YgYWxsLCBjcmVhdGUgYSBsYXJnZSB0ZXh0IGFycmF5IHdpdGggbm9uLXRhcmdldCB0ZXh0XG4vLyBhcHBlbmQgdHlwZSBvZiBjb21wb25lbnQgdG8gaXQgKFJlZ3VsYXJDb21wb25lbnQgb3IgSGlnaGxpZ2h0ZWRDb21wb25lbnQpXG5mdW5jdGlvbiBjb25zdHJ1Y3RDb21wb25lbnRBcnJheShzZWFyY2hSZXN1bHRzLCBvcmlnaW5hbF90ZXh0KSB7XG4gIGNvbnNvbGUubG9nKCdpbiBjb25zdHJ1Y3QgYXJyYXknKVxuICBjb25zdCBmaW5hbEFycmF5ID0gW11cbiAgbGV0IGxvY2F0aW9uQ2hlY2tlciA9IHRydWU7XG4gIGNvbnN0IGVycm9yZWRJdGVtcyA9IFtdO1xuICBpZiAoc2VhcmNoUmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICBjb25zdCBvbmx5SXRlbSA9ICB7XG4gICAgICB0ZXh0OiBvcmlnaW5hbF90ZXh0LFxuICAgICAgY3NzOiBudWxsLFxuICAgICAgbWVudTogbnVsbCxcbiAgICAgIHR5cGU6IG51bGwsXG4gICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgfVxuICAgIGZpbmFsQXJyYXkucHVzaChvbmx5SXRlbSlcbiAgICByZXR1cm4gZmluYWxBcnJheVxuICB9IGVsc2Uge1xuICAgIGZvciAoY29uc3QgaXRlbSBvZiBzZWFyY2hSZXN1bHRzKSB7XG4gICAgICBpZiAoIWl0ZW0ubG9jYXRpb24pIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIGxvY2F0aW9uQ2hlY2tlciA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWxvY2F0aW9uQ2hlY2tlcikge1xuICAgICAgbGV0IGVycm9yZWRJdGVtc1RleHQgPSAnJ1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGVycm9yZWRJdGVtcykge1xuICAgICAgICBlcnJvcmVkSXRlbXNUZXh0ID0gZXJyb3JlZEl0ZW1zVGV4dCArIGl0ZW0udGV4dCArICcgICc7XG4gICAgICB9XG4gICAgICBjb25zdCBlcnJvclRleHQgPSAnQW4gZXJyb3Igb2NjdXJlZC4gVGhlIGZvbGxvd2luZyBpdGVtcyBkaWQgbm90IGhhdmUgYSB2YWxpZCBpZGVudGlmaWVkIGluZGV4IGxvY2F0aW9uOiAnICsgZXJyb3JlZEl0ZW1zVGV4dFxuICAgICAgKyAnRWl0aGVyIHByb3ZpZGUgcHJvcGVyIGluZGV4IGxvY2F0aW9ucyBvZiBlYWNoIGl0ZW0gdG8gYmUgaGlnaGxpZ2h0ZWQgb3Igc2V0IGxvY2FsQW5hbHlzaXMgdG8gdHJ1ZS4nO1xuICAgICAgY29uc3QgZXJyb3JJdGVtID0gIHtcbiAgICAgICAgdGV4dDogZXJyb3JUZXh0LFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGVycm9ySXRlbSlcbiAgICAgIHJldHVybiBmaW5hbEFycmF5XG4gICAgfVxuICB9XG4gIHNlYXJjaFJlc3VsdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGEubG9jYXRpb25bMF0gLSBiLmxvY2F0aW9uWzBdO1xuICB9KVxuICBsZXQgc3RhcnQgPSAwO1xuICBsZXQgZW5kID0gc2VhcmNoUmVzdWx0c1swXS5sb2NhdGlvblswXTtcbiAgbGV0IG1pZGRsZSA9ICcnO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaFJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnQgPT09IDApIHtcbiAgICAgIGNvbnN0IHN0YXJ0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc3RhcnQsIGVuZCksXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2goc3RhcnRJdGVtKVxuICAgICAgY29uc3QgZmlyc3RJdGVtID0ge1xuICAgICAgICB0ZXh0OiBzZWFyY2hSZXN1bHRzW2ldLnRleHQsXG4gICAgICAgIGNzczogc2VhcmNoUmVzdWx0c1tpXS5jc3MsXG4gICAgICAgIG1lbnU6IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA/IHNlYXJjaFJlc3VsdHNbaV0ubWVudSA6IG51bGwsXG4gICAgICAgIHR5cGU6IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA/IHNlYXJjaFJlc3VsdHNbaV0udHlwZSA6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogSGlnaGxpZ2h0ZWRDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChmaXJzdEl0ZW0pXG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXh0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc2VhcmNoUmVzdWx0c1tpXS50ZXh0LFxuICAgICAgICBjc3M6IHNlYXJjaFJlc3VsdHNbaV0uY3NzLFxuICAgICAgICBtZW51OiBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgPyBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgOiBudWxsLFxuICAgICAgICB0eXBlOiBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgPyBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IEhpZ2hsaWdodGVkQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2gobmV4dEl0ZW0pXG4gICAgfVxuXG4gICAgaWYgKHNlYXJjaFJlc3VsdHNbaSArIDFdKSB7XG4gICAgICBtaWRkbGUgPSBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhzZWFyY2hSZXN1bHRzW2ldLmxvY2F0aW9uWzFdLCBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblswXSk7XG4gICAgICBjb25zdCBtaWRkbGVJdGVtID0ge1xuICAgICAgICB0ZXh0OiBtaWRkbGUsXG4gICAgICAgIGNzczogbnVsbCxcbiAgICAgICAgbWVudTogbnVsbCxcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBSZWd1bGFyQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2gobWlkZGxlSXRlbSlcbiAgICAgIHN0YXJ0ID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF07XG4gICAgICBlbmQgPSBzZWFyY2hSZXN1bHRzW2kgKyAxXS5sb2NhdGlvblsxXTtcbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gKHNlYXJjaFJlc3VsdHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIGNvbnN0IGVuZEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKGVuZCwgb3JpZ2luYWxfdGV4dC5sZW5ndGgpLFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKGVuZEl0ZW0pXG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKCdvdXRwdXQgb2YgYXJyYXkgY29uc3RydWN0aW9uOicsIGZpbmFsQXJyYXkpXG4gIHJldHVybiBmaW5hbEFycmF5O1xufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5nSW5wdXRIaWdobGlnaHRlckNvbXBvbmVudCB9IGZyb20gJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuY29tcG9uZW50JztcbmltcG9ydCB7IFRleHREaXJlY3RpdmUgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQuZGlyZWN0aXZlJ1xuaW1wb3J0IHsgSGlnaGxpZ2h0ZWRDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtaGlnaGxpZ2h0LmNvbXBvbmVudCdcbmltcG9ydCB7IFJlZ3VsYXJDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtcmVndWxhci5jb21wb25lbnQnXG5pbXBvcnQgeyBNYXRNZW51TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG5pbXBvcnQgeyBNYXRTZWxlY3RNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3QnO1xuaW1wb3J0IHsgTWF0Rm9ybUZpZWxkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZm9ybS1maWVsZCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIE1hdE1lbnVNb2R1bGUsXG4gICAgTWF0U2VsZWN0TW9kdWxlLFxuICAgIE1hdEZvcm1GaWVsZE1vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQsXG4gICAgVGV4dERpcmVjdGl2ZSxcbiAgICBIaWdobGlnaHRlZENvbXBvbmVudCxcbiAgICBSZWd1bGFyQ29tcG9uZW50XG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogWyBIaWdobGlnaHRlZENvbXBvbmVudCwgUmVndWxhckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIE5nSW5wdXRIaWdobGlnaHRlck1vZHVsZSB7IH1cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7b0JBVWtCLE1BQU07MEJBQ0EsSUFBSTs7O2dCQVAzQixTQUFTLFNBQUM7b0JBQ1Asb0lBQTRDO2lCQUMvQzs7O3VCQUVFLEtBQUs7c0JBQ0wsS0FBSzt1QkFDTCxLQUFLOzZCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzsyQkFiUjs7Ozs7OztBQ0FBOztvQkFXa0IsTUFBTTswQkFDQSxJQUFJO3FCQUlsQixLQUFLOzs7Ozs7Ozs7O0lBT2IsMENBQVc7Ozs7SUFBWCxVQUFZLElBQUk7UUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFBO1FBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBOztLQUV6Qjs7OztJQUVELDBDQUFXOzs7SUFBWDtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOztZQUNqQixJQUFNLE1BQU0sR0FBRztnQkFDYixTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ3BCLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSTthQUNqQixDQUFBO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDekMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7U0FDaEI7UUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDMUI7O2dCQW5DRixTQUFTLFNBQUM7b0JBQ1AsK3lDQUE4QztpQkFDakQ7Ozt1QkFFRSxLQUFLO3NCQUNMLEtBQUs7dUJBQ0wsS0FBSzs2QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzs7K0JBZFI7Ozs7Ozs7QUNBQTtJQU1FLHVCQUFtQixnQkFBa0M7UUFBbEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFrQjtLQUFLOztnQkFKM0QsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO2lCQUMxQjs7OztnQkFKbUIsZ0JBQWdCOzt3QkFBcEM7Ozs7Ozs7O0lDNENFLHFDQUFvQix3QkFBa0QsRUFBVSxRQUFtQjtRQUEvRSw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVzsyQkF0QnpELEVBQUU7NkJBQ25CLElBQUk7eUJBQ1IsR0FBRzs7d0JBRUosSUFBSTt5QkFDSCxhQUFhO3dCQUNkLE1BQU07d0JBQ04sU0FBUzt5QkFDUixJQUFJOzZCQUNBLEtBQUs7MkJBQ04sSUFBSSxZQUFZLEVBQVU7MkJBT1gsSUFBSSxPQUFPLEVBQUU7K0JBQzNCLEtBQUs7eUJBQ2EsRUFBRTtLQUk1Qzs7OztJQUVELDhDQUFROzs7SUFBUjtRQUFBLGlCQStCQzs7UUE3QkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJOzs7WUFFZCxLQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQTs7WUFDM0IsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO1lBQ2xDLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDeEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O1lBRWhDLElBQUksS0FBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsS0FBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoQyxVQUFVLENBQUM7b0JBQ1QsS0FBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7b0JBQzdCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDbkIsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUNSO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztTQUN6QjthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDeEI7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ3hCO2FBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztTQUN6QjthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7U0FDekI7S0FDRjs7Ozs7SUFFRCxpREFBVzs7OztJQUFYLFVBQVksT0FBc0I7UUFBbEMsaUJBY0M7UUFiQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzFELElBQUksT0FBTyxpQkFBYztnQkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBOztnQkFDakQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFBO2dCQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDL0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFBO2dCQUNsQyxVQUFVLENBQUM7b0JBQ1QsS0FBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7b0JBQzdCLEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDbkIsRUFBRSxHQUFHLENBQUMsQ0FBQTthQUNSO1NBQ0Y7S0FDRjs7OztJQUVELHFEQUFlOzs7SUFBZjtRQUFBLGlCQWlCQzs7UUFmQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFO1lBQ3BGLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNwRSxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFO1lBQ25GLEtBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN2RSxDQUFDLENBQUM7O1FBRUgsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFO1lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDeEIsS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN6QixDQUFDLENBQUM7O1FBRUgsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtLQUNGOzs7O0lBRUQsZ0RBQVU7OztJQUFWO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQ3RDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxFQUFFO1lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQTs7WUFDL0UsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFBO1lBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ2xDLE9BQU8sSUFBSSxDQUFBO1NBQ1o7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQTs7WUFDdkYsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFBOztZQUN6RCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7WUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFFMUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtvQkFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO29CQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7aUJBQ25GO2dCQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7b0JBQ2xFLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0RBQXdELENBQUMsQ0FBQTs7b0JBQ3JFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUE7b0JBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtvQkFDbEYsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTt3QkFDaEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO3dCQUMxQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7cUJBQ25GO29CQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFBO29CQUNsQyxPQUFPLElBQUksQ0FBQTtpQkFDWjthQUNGO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDM0IsT0FBTyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtpQkFDbEQ7YUFDRjtZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3JDLE9BQU8sT0FBTyxDQUFBO1NBQ2Y7S0FDRjs7Ozs7SUFFRCxzREFBZ0I7Ozs7SUFBaEIsVUFBaUIsU0FBUztRQUExQixpQkErQkM7UUE5QkMsVUFBVSxDQUFDO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztZQUN2QyxJQUFNLFNBQVMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFBO1lBQ2pDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO1lBRXZELE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBV3RDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztnQkFDekMsSUFBTSxnQkFBZ0IsR0FBRyxLQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBOztnQkFDdEcsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztnQkFDekUsSUFBTSxFQUFFLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BELG1CQUFnQixHQUFHLENBQUMsUUFBUSxHQUFFLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN2RCxtQkFBZ0IsR0FBRyxDQUFDLFFBQVEsR0FBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDckQsbUJBQWdCLEdBQUcsQ0FBQyxRQUFRLEdBQUUsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZELG1CQUFnQixHQUFHLENBQUMsUUFBUSxHQUFFLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUNuRSxtQkFBZ0IsR0FBRyxDQUFDLFFBQVEsR0FBRSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDdkQsbUJBQWdCLEdBQUcsQ0FBQyxRQUFRLEdBQUUsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFbEQsS0FBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO2FBQ3hFO1NBQ0YsQ0FBQyxDQUFBO0tBQ0g7Ozs7OztJQUlELHNEQUFnQjs7OztJQUFoQixVQUFpQixJQUFJO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQTs7UUFDbkMsSUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUE7S0FDdEM7Ozs7OztJQUdELHlEQUFtQjs7OztJQUFuQixVQUFvQixJQUFJO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtRQUN0Qyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ2hEOzs7Ozs7SUFJRCxnREFBVTs7O0lBQVY7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDbkQ7S0FDRjs7Ozs7O0lBR0QscURBQWU7Ozs7SUFBZixVQUFnQixFQUFFO1FBQ2hCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNYLElBQUksT0FBTyxNQUFNLENBQUMsWUFBWSxLQUFLLFdBQVc7ZUFDekMsT0FBTyxRQUFRLENBQUMsV0FBVyxLQUFLLFdBQVcsRUFBRTs7WUFDaEQsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3QixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztZQUN0QixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbEMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckI7S0FDRjs7Ozs7SUFHRCwrQ0FBUzs7O0lBQVQ7UUFDRSxRQUFRLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDaEQ7O2dCQXhORixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtvQkFDcEMsd21CQUEwQzs7aUJBRTNDOzs7O2dCQWZDLHdCQUF3QjtnQkFDYixTQUFTOzs7OEJBa0JuQixLQUFLO2dDQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFFTCxLQUFLOzRCQUNMLEtBQUs7MkJBQ0wsS0FBSzsyQkFDTCxLQUFLOzRCQUNMLEtBQUs7Z0NBQ0wsS0FBSzs4QkFDTCxNQUFNOzJCQUVOLFNBQVMsU0FBQyxVQUFVOzRCQUNwQixTQUFTLFNBQUMsV0FBVzs2QkFDckIsU0FBUyxTQUFDLGFBQWE7MkJBQ3ZCLFNBQVMsU0FBQyxVQUFVOztzQ0FyQ3ZCOzs7Ozs7OztBQTBPQSx1QkFBdUIsYUFBYSxFQUFFLEdBQUcsRUFBRSxhQUFhOztJQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7O0lBQ2hDLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7UUFDbEIsS0FBbUIsSUFBQSxrQkFBQUEsU0FBQSxhQUFhLENBQUEsNENBQUEsdUVBQUU7WUFBN0IsSUFBTSxJQUFJLDBCQUFBOztZQUNiLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQzs7WUFDbkIsSUFBSSxLQUFLLFVBQUM7O1lBQ1YsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDdEMsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO2dCQUNwQixPQUFPLGdFQUFnRSxDQUFDO2FBQzNFOztZQUNELElBQUksZUFBZSxVQUFDOztZQUNwQixJQUFJLGFBQWEsVUFBQztZQUNsQixJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNsQixlQUFlLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNwQyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN6QztpQkFBTTtnQkFDTCxlQUFlLEdBQUcsR0FBRyxDQUFDO2dCQUN0QixhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzthQUMzQjtZQUNELE9BQU8sQ0FBQyxLQUFLLEdBQUcsZUFBZSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7O2dCQUN4RSxJQUFNLFNBQVMsR0FBRztvQkFDaEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxZQUFZLENBQUM7b0JBQ2hELFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsWUFBWSxDQUFDO29CQUN2QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUk7b0JBQ2xDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTtvQkFDbEMsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztpQkFDZCxDQUFBO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZCLFVBQVUsR0FBRyxLQUFLLEdBQUcsWUFBWSxDQUFDO2FBQ25DO1NBQ0Y7Ozs7Ozs7OztJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDMUMsT0FBTyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7Q0FDN0M7Ozs7OztBQU1ELGlDQUFpQyxhQUFhLEVBQUUsYUFBYTs7SUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBOztJQUNqQyxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUE7O0lBQ3JCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQzs7SUFDM0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O1FBQzlCLElBQU0sUUFBUSxHQUFJO1lBQ2hCLElBQUksRUFBRSxhQUFhO1lBQ25CLEdBQUcsRUFBRSxJQUFJO1lBQ1QsSUFBSSxFQUFFLElBQUk7WUFDVixJQUFJLEVBQUUsSUFBSTtZQUNWLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFNBQVMsRUFBRSxnQkFBZ0I7U0FDNUIsQ0FBQTtRQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDekIsT0FBTyxVQUFVLENBQUE7S0FDbEI7U0FBTTs7WUFDTCxLQUFtQixJQUFBLGtCQUFBQSxTQUFBLGFBQWEsQ0FBQSw0Q0FBQSx1RUFBRTtnQkFBN0IsSUFBTSxJQUFJLDBCQUFBO2dCQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNsQixZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4QixlQUFlLEdBQUcsS0FBSyxDQUFDO2lCQUN6QjthQUNGOzs7Ozs7Ozs7UUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFOztZQUNwQixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTs7Z0JBQ3pCLEtBQW1CLElBQUEsaUJBQUFBLFNBQUEsWUFBWSxDQUFBLDBDQUFBLG9FQUFFO29CQUE1QixJQUFNLElBQUkseUJBQUE7b0JBQ2IsZ0JBQWdCLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ3hEOzs7Ozs7Ozs7O1lBQ0QsSUFBTSxTQUFTLEdBQUcsd0ZBQXdGLEdBQUcsZ0JBQWdCO2tCQUMzSCxvR0FBb0csQ0FBQzs7WUFDdkcsSUFBTSxTQUFTLEdBQUk7Z0JBQ2pCLElBQUksRUFBRSxTQUFTO2dCQUNmLEdBQUcsRUFBRSxJQUFJO2dCQUNULElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUE7WUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQzFCLE9BQU8sVUFBVSxDQUFBO1NBQ2xCO0tBQ0Y7SUFDRCxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDOUIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEMsQ0FBQyxDQUFBOztJQUNGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQzs7SUFDZCxJQUFJLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUN2QyxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0MsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFOztZQUNmLElBQU0sU0FBUyxHQUFHO2dCQUNoQixJQUFJLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO2dCQUN6QyxHQUFHLEVBQUUsSUFBSTtnQkFDVCxJQUFJLEVBQUUsSUFBSTtnQkFDVixJQUFJLEVBQUUsSUFBSTtnQkFDVixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsU0FBUyxFQUFFLGdCQUFnQjthQUM1QixDQUFBO1lBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTs7WUFDMUIsSUFBTSxTQUFTLEdBQUc7Z0JBQ2hCLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtnQkFDM0IsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO2dCQUN6QixJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUk7Z0JBQzFELElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtnQkFDMUQsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFNBQVMsRUFBRSxvQkFBb0I7YUFDaEMsQ0FBQTtZQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDMUIsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEM7YUFBTTs7WUFDTCxJQUFNLFFBQVEsR0FBRztnQkFDZixJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQzNCLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRztnQkFDekIsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJO2dCQUMxRCxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUk7Z0JBQzFELFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsb0JBQW9CO2FBQ2hDLENBQUE7WUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQzFCO1FBRUQsSUFBSSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDakcsSUFBTSxVQUFVLEdBQUc7Z0JBQ2pCLElBQUksRUFBRSxNQUFNO2dCQUNaLEdBQUcsRUFBRSxJQUFJO2dCQUNULElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixTQUFTLEVBQUUsZ0JBQWdCO2FBQzVCLENBQUE7WUFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQzNCLEtBQUssR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLENBQUMsTUFBTSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFOztZQUNwQyxJQUFNLE9BQU8sR0FBRztnQkFDZCxJQUFJLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLE1BQU0sQ0FBQztnQkFDeEQsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFNBQVMsRUFBRSxnQkFBZ0I7YUFDNUIsQ0FBQTtZQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7U0FDekI7S0FDRjtJQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDeEQsT0FBTyxVQUFVLENBQUM7Q0FDbkI7Ozs7OztBQ2hZRDs7OztnQkFVQyxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLGFBQWE7d0JBQ2IsYUFBYTt3QkFDYixlQUFlO3dCQUNmLGtCQUFrQjtxQkFDbkI7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLDJCQUEyQjt3QkFDM0IsYUFBYTt3QkFDYixvQkFBb0I7d0JBQ3BCLGdCQUFnQjtxQkFDakI7b0JBQ0QsZUFBZSxFQUFFLENBQUUsb0JBQW9CLEVBQUUsZ0JBQWdCLENBQUM7b0JBQzFELE9BQU8sRUFBRSxDQUFDLDJCQUEyQixDQUFDO2lCQUN2Qzs7bUNBekJEOzs7Ozs7Ozs7Ozs7Ozs7In0=