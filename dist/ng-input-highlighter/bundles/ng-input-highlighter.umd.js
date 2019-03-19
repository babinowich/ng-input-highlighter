(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/platform-browser'), require('@angular/material/menu'), require('@angular/material/select'), require('@angular/material/form-field')) :
    typeof define === 'function' && define.amd ? define('ng-input-highlighter', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/platform-browser', '@angular/material/menu', '@angular/material/select', '@angular/material/form-field'], factory) :
    (factory((global['ng-input-highlighter'] = {}),global.ng.core,global.rxjs,global.rxjs.operators,global.ng.platformBrowser,global.ng.material.menu,global.ng.material.select,global.ng.material['form-field']));
}(this, (function (exports,core,rxjs,operators,platformBrowser,menu,select,formField) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

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
            { type: core.Component, args: [{
                        template: "<span contenteditable style=\"margin-right:2px; display:inline-block; min-width:2px; min-height:14px\">{{ text }}</span>"
                    }] }
        ];
        RegularComponent.propDecorators = {
            text: [{ type: core.Input }],
            css: [{ type: core.Input }],
            type: [{ type: core.Input }],
            confidence: [{ type: core.Input }],
            menu: [{ type: core.Input }],
            data: [{ type: core.Input }]
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
            { type: core.Component, args: [{
                        template: "<span *ngIf=\"!menu\" contenteditable style=\"margin-right:2px;\" (click)=\"clickedText(text)\" [ngClass]=\"css\">{{ text }}</span>\n\n<span *ngIf=\"menu\" contenteditable style=\"margin-right:2px;cursor: pointer;\" (click)=\"clickedText(text)\" [ngClass]=\"css\" [matMenuTriggerFor]=\"appMenu\">{{ text }}</span>\n\n<mat-menu #appMenu=\"matMenu\" style=\"font-size:14px;\">\n                <!-- <button mat-menu-item>Settings</button>\n                <button mat-menu-item>Help</button> -->\n    <div *ngIf=\"menu\" style=\"padding:10px\">\n            <p *ngFor=\"let item of menu.descriptionItems\" class=\"miniMenu\">{{ item }}</p>\n            <p *ngIf=\"type\">Identified type: {{ type }}</p>\n            <p *ngIf=\"confidence\">Confidence: {{ confidence }}</p>\n            <mat-form-field *ngIf=\"menu.replacementOptions\">\n                <mat-select placeholder=\"Potential replacements\" [(value)]=\"selected\" (selectionChange)=\"changedText()\">\n                    <mat-option *ngFor=\"let option of menu.replacementOptions\" [value]=\"option.value\">{{ option.viewValue }}</mat-option>\n                </mat-select>\n            </mat-form-field>\n    </div>\n\n    <!-- <span *ngFor=\"let item of actionBtns\">\n        <button mat-menu-item (click)=\"\"></button>\n    <span> -->\n</mat-menu>"
                    }] }
        ];
        HighlightedComponent.propDecorators = {
            text: [{ type: core.Input }],
            css: [{ type: core.Input }],
            type: [{ type: core.Input }],
            confidence: [{ type: core.Input }],
            menu: [{ type: core.Input }],
            data: [{ type: core.Input }]
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
            { type: core.Directive, args: [{
                        selector: '[libTextHost]',
                    },] }
        ];
        /** @nocollapse */
        TextDirective.ctorParameters = function () {
            return [
                { type: core.ViewContainerRef }
            ];
        };
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
            this.currentText = new core.EventEmitter();
            this.textSubject = new rxjs.Subject();
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
                this.textSubject.pipe(operators.debounceTime(2000)).subscribe(function (text) {
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
                        ( /** @type {?} */(ref.instance)).text = textArray[i].text;
                        ( /** @type {?} */(ref.instance)).css = textArray[i].css;
                        ( /** @type {?} */(ref.instance)).type = textArray[i].type;
                        ( /** @type {?} */(ref.instance)).confidence = textArray[i].confidence;
                        ( /** @type {?} */(ref.instance)).menu = textArray[i].menu;
                        ( /** @type {?} */(ref.instance)).data = textArray[i];
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
            { type: core.Component, args: [{
                        selector: 'lib-ng-input-highlighter',
                        template: "<div #inputBox id=\"input-area\" tabindex=\"0\" [ngClass]=\"[boxSize, boxClass]\">\n  <div class=\"text-area\" [ngClass]=\"{'pending': responsePending}\">\n    <div libTextHost #textArea contenteditable  id=\"input-span\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"></div>\n    <span *ngIf=\"responsePending\"><i class=\"fa fa-circle-o-notch fa-spin fa-fw\"></i></span>\n    <span (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"blank-input\"> </span>\n  </div>\n  <div (click)=\"focusInput()\" (dblclick)=\"selectAll()\" class=\"rest\"></div>\n</div>",
                        styles: ["#input-area{color:#000;margin-top:10px;border-radius:5px;width:100%;border:1px solid #e3ecf7;overflow:hidden;padding:10px}.none{background-color:#f3f6fa}.xsmall{height:41px}.small{height:100px}.medium{height:250px}.large{height:500px}.xlarge{height:1000px}.text-area{display:flex;flex-wrap:wrap;max-width:100%}#input-span{max-width:100%;min-width:2px}#input-span:focus{outline:transparent solid 0}.blank-input{flex:1;width:100%}.rest{flex:1;flex-direction:column;width:100%;height:90%;max-height:230px}.focused{border:1px solid #647182!important}.pending{opacity:.3;color:gray!important}#delete-this-one{font-style:italic;opacity:.7;color:#778899}"]
                    }] }
        ];
        /** @nocollapse */
        NgInputHighlighterComponent.ctorParameters = function () {
            return [
                { type: core.ComponentFactoryResolver },
                { type: core.Renderer2 }
            ];
        };
        NgInputHighlighterComponent.propDecorators = {
            targetItems: [{ type: core.Input }],
            localAnalysis: [{ type: core.Input }],
            boxHeight: [{ type: core.Input }],
            idleTime: [{ type: core.Input }],
            fontClass: [{ type: core.Input }],
            boxClass: [{ type: core.Input }],
            boxFocus: [{ type: core.Input }],
            initFocus: [{ type: core.Input }],
            caseSensitive: [{ type: core.Input }],
            currentText: [{ type: core.Output }],
            textArea: [{ type: core.ViewChild, args: ['textArea',] }],
            emptyText: [{ type: core.ViewChild, args: ['emptyText',] }],
            targetText: [{ type: core.ViewChild, args: [TextDirective,] }],
            inputBox: [{ type: core.ViewChild, args: ['inputBox',] }]
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
        catch (e_1_1) {
            e_1 = { error: e_1_1 };
        }
        finally {
            try {
                if (searchTargets_1_1 && !searchTargets_1_1.done && (_a = searchTargets_1.return))
                    _a.call(searchTargets_1);
            }
            finally {
                if (e_1)
                    throw e_1.error;
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
            catch (e_2_1) {
                e_2 = { error: e_2_1 };
            }
            finally {
                try {
                    if (searchResults_1_1 && !searchResults_1_1.done && (_a = searchResults_1.return))
                        _a.call(searchResults_1);
                }
                finally {
                    if (e_2)
                        throw e_2.error;
                }
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
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (erroredItems_1_1 && !erroredItems_1_1.done && (_b = erroredItems_1.return))
                            _b.call(erroredItems_1);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
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
            { type: core.NgModule, args: [{
                        imports: [
                            platformBrowser.BrowserModule,
                            menu.MatMenuModule,
                            select.MatSelectModule,
                            formField.MatFormFieldModule
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

    exports.NgInputHighlighterComponent = NgInputHighlighterComponent;
    exports.NgInputHighlighterModule = NgInputHighlighterModule;
    exports.ɵb = HighlightedComponent;
    exports.ɵc = RegularComponent;
    exports.ɵa = TextDirective;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctaW5wdXQtaGlnaGxpZ2h0ZXIudW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvbGliL3RleHRDb21wb25lbnRzL3RleHQtcmVndWxhci5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi90ZXh0Q29tcG9uZW50cy90ZXh0LWhpZ2hsaWdodC5jb21wb25lbnQudHMiLCJuZzovL25nLWlucHV0LWhpZ2hsaWdodGVyL2xpYi90ZXh0Q29tcG9uZW50cy90ZXh0LmRpcmVjdGl2ZS50cyIsIm5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvbGliL25nLWlucHV0LWhpZ2hsaWdodGVyLmNvbXBvbmVudC50cyIsIm5nOi8vbmctaW5wdXQtaGlnaGxpZ2h0ZXIvbGliL25nLWlucHV0LWhpZ2hsaWdodGVyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRleHRDb21wb25lbnQgfSBmcm9tICcuL3RleHQtYmxvY2suY29tcG9uZW50JztcbmltcG9ydCB7IE1lbnVJdGVtIH0gZnJvbSAnLi4vY2xhc3Nlcy9tZW51SXRlbS5jbGFzcydcblxuQENvbXBvbmVudCh7XG4gICAgdGVtcGxhdGVVcmw6ICcuL3RleHQtcmVndWxhci5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgUmVndWxhckNvbXBvbmVudCBpbXBsZW1lbnRzIFRleHRDb21wb25lbnQge1xuICBASW5wdXQoKSB0ZXh0OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNzczogc3RyaW5nXG4gIEBJbnB1dCgpIHR5cGUgPSAnTm9uZSdcbiAgQElucHV0KCkgY29uZmlkZW5jZSA9IG51bGxcbiAgQElucHV0KCkgbWVudTogTWVudUl0ZW07XG4gIEBJbnB1dCgpIGRhdGE6IGFueTtcblxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUZXh0Q29tcG9uZW50IH0gZnJvbSAnLi90ZXh0LWJsb2NrLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNYXRNZW51IH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG5cbmltcG9ydCB7IE1lbnVJdGVtIH0gZnJvbSAnLi4vY2xhc3Nlcy9tZW51SXRlbS5jbGFzcydcbkBDb21wb25lbnQoe1xuICAgIHRlbXBsYXRlVXJsOiAnLi90ZXh0LWhpZ2hsaWdodC5jb21wb25lbnQuaHRtbCdcbn0pXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0ZWRDb21wb25lbnQgaW1wbGVtZW50cyBUZXh0Q29tcG9uZW50IHtcbiAgQElucHV0KCkgdGV4dDogc3RyaW5nO1xuICBASW5wdXQoKSBjc3M6IHN0cmluZ1xuICBASW5wdXQoKSB0eXBlID0gJ05vbmUnXG4gIEBJbnB1dCgpIGNvbmZpZGVuY2UgPSBudWxsXG4gIEBJbnB1dCgpIG1lbnU6IE1lbnVJdGVtXG4gIEBJbnB1dCgpIGRhdGE6IGFueTtcbiAgc2VsZWN0ZWQ6IHN0cmluZztcbiAgYWRkZWQgPSBmYWxzZVxuICAvLyBAVmlld0NoaWxkKCdzdWJtZW51JylcbiAgLy8gc2V0IHN1Yk1lbnUodmFsdWU6IE1hdE1lbnUpICB7XG4gIC8vICAgdGhpcy50ZXh0ID0gdmFsdWU7XG4gIC8vIH1cblxuXG4gIGNsaWNrZWRUZXh0KHRleHQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDTElDS0VEOicgKyB0ZXh0ICArICcgJywgdGhpcy50ZXh0LCB0aGlzLmNzcyApXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLm1lbnUpXG4gICAgLy8gICB0aGlzLmNsaWNrQWN0aXZlID0gdGhpcy5jbGlja0FjdGl2ZSA/IGZhbHNlIDogdHJ1ZVxuICB9XG5cbiAgY2hhbmdlZFRleHQoKSB7XG4gICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIHJlcGxhY2VtZW50OicsIHRoaXMuc2VsZWN0ZWQpXG4gICAgaWYgKCF0aGlzLmFkZGVkKSB7XG4gICAgY29uc3Qgb2dJdGVtID0ge1xuICAgICAgdmlld1ZhbHVlOiB0aGlzLnRleHQsXG4gICAgICB2YWx1ZTogdGhpcy50ZXh0XG4gICAgfVxuICAgIHRoaXMubWVudS5yZXBsYWNlbWVudE9wdGlvbnMucHVzaChvZ0l0ZW0pXG4gICAgdGhpcy5hZGRlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy50ZXh0ID0gdGhpcy5zZWxlY3RlZFxuICB9XG59XG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIFZpZXdDb250YWluZXJSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2xpYlRleHRIb3N0XScsXG59KVxuZXhwb3J0IGNsYXNzIFRleHREaXJlY3RpdmUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZikgeyB9XG59XG5cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgT25Jbml0LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIFZpZXdDaGlsZCwgUmVuZGVyZXIyLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVGV4dENvbXBvbmVudCB9IGZyb20gJy4vdGV4dENvbXBvbmVudHMvdGV4dC1ibG9jay5jb21wb25lbnQnXG5pbXBvcnQgeyBSZWd1bGFyQ29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LXJlZ3VsYXIuY29tcG9uZW50J1xuaW1wb3J0IHsgSGlnaGxpZ2h0ZWRDb21wb25lbnQgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQtaGlnaGxpZ2h0LmNvbXBvbmVudCdcbmltcG9ydCB7IFRhcmdldEFycmF5SXRlbSB9IGZyb20gJy4vY2xhc3Nlcy90YXJnZXRUZXh0SXRlbS5jbGFzcyc7XG5pbXBvcnQgeyBUYXJnZXRJdGVtIH0gZnJvbSAnLi9jbGFzc2VzL3RhcmdldEl0ZW1zLmNsYXNzJztcbmltcG9ydCB7IFRleHREaXJlY3RpdmUgfSBmcm9tICcuL3RleHRDb21wb25lbnRzL3RleHQuZGlyZWN0aXZlJ1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbmctaW5wdXQtaGlnaGxpZ2h0ZXInLFxuICB0ZW1wbGF0ZVVybDogJy4vbmctaW5wdXQtaGlnaGxpZ2h0ZXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNzcyddXG59KVxuXG5leHBvcnQgY2xhc3MgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuXG4gIEBJbnB1dCgpIHRhcmdldEl0ZW1zOiBBcnJheTxUYXJnZXRJdGVtPiA9IFtdOyAvLyBhbmFseXNpcyBpbnNpZGUgY29tcG9uZW50OiBhcnJheSBvZiBpdGVtcyB0byBmaW5kXG4gIEBJbnB1dCgpIGxvY2FsQW5hbHlzaXMgPSB0cnVlO1xuICBASW5wdXQoKSBib3hIZWlnaHQgPSAnTSc7XG4gIC8vIEBJbnB1dCgpIGhpZ2hDb250cmFzdCA9IHRydWUgLy8gVE8tRE9cbiAgQElucHV0KCkgaWRsZVRpbWUgPSAyMDAwIC8vIGFsbG93IGZvciBjdXN0b21pemF0aW9uIG9uIGRlYm91bmNlIHRpbWVcbiAgQElucHV0KCkgZm9udENsYXNzID0gJ3JlZ3VsYXJUZXh0JzsgLy8gb3B0aW9uYWwgY2xhc3MgZm9yIGlucHV0IG9mIHN0eWxlIGZvciByZWd1bGFyIHRleHQgaW4gYm94XG4gIEBJbnB1dCgpIGJveENsYXNzID0gJ25vbmUnO1xuICBASW5wdXQoKSBib3hGb2N1cyA9ICdmb2N1c2VkJztcbiAgQElucHV0KCkgaW5pdEZvY3VzID0gdHJ1ZTsgLy8gYWxsb3cgZm9yIG9wdGlvbiB0byBmb2N1cyBvbiBjb21wb25lbnQgdGV4dCBib3ggaW5pdGlhbGx5LCByZWNvbW1lbmRlZCBmb3IgYWNjZXNzaWJpbGl0eVxuICBASW5wdXQoKSBjYXNlU2Vuc2l0aXZlID0gZmFsc2U7IC8vIGFsbG93IGZvciBvcHRpb24gdG8gc2VsZWN0IGNhc2Ugc2Vuc2l0aXZpdHktIGRlZmF1bHQgdG8gb2ZmXG4gIEBPdXRwdXQoKSBjdXJyZW50VGV4dCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpOyAvLyBjdXJyZW50IHRleHQgc3RyaW5nLCB3aWxsIG91dHB1dCBmb3IgYW5hbHlzaXMgb3Igb3RoZXIgd29yayBvdXRzaWRlXG5cbiAgQFZpZXdDaGlsZCgndGV4dEFyZWEnKSB0ZXh0QXJlYTogRWxlbWVudFJlZlxuICBAVmlld0NoaWxkKCdlbXB0eVRleHQnKSBlbXB0eVRleHQ6IEVsZW1lbnRSZWZcbiAgQFZpZXdDaGlsZChUZXh0RGlyZWN0aXZlKSB0YXJnZXRUZXh0OiBUZXh0RGlyZWN0aXZlXG4gIEBWaWV3Q2hpbGQoJ2lucHV0Qm94JykgaW5wdXRCb3g6IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSB0ZXh0U3ViamVjdDogU3ViamVjdDxzdHJpbmc+ID0gbmV3IFN1YmplY3QoKTtcbiAgcHVibGljIHJlc3BvbnNlUGVuZGluZyA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dEFycmF5OiBBcnJheTxUYXJnZXRBcnJheUl0ZW0+ID0gW11cbiAgcHVibGljIGJveFNpemU6IFN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAvLyBUaW1lciB0byBjaGVjayB3aGVuIHRvIHNlbmQgcmVxdWVzdCB0byB0ZXh0IGFuYWx5c2lzXG4gICAgdGhpcy50ZXh0U3ViamVjdC5waXBlKFxuICAgICAgZGVib3VuY2VUaW1lKDIwMDApXG4gICAgKS5zdWJzY3JpYmUodGV4dCA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaWRsZSBhbmQgdGltZSB0byBwcm9jZXNzJywgdGhpcy50ZXh0QXJlYSlcbiAgICAgIHRoaXMucmVzcG9uc2VQZW5kaW5nID0gdHJ1ZVxuICAgICAgY29uc3QgbmV3X3RleHQgPSB0aGlzLm9idGFpblRleHQoKVxuICAgICAgdGhpcy50YXJnZXRUZXh0LnZpZXdDb250YWluZXJSZWYuY2xlYXIoKVxuICAgICAgdGhpcy5jdXJyZW50VGV4dC5lbWl0KG5ld190ZXh0KTtcbiAgICAvLyBJZiB3ZSdyZSBkb2luZyBsb2NhbCBhbmFseXNpcywgYmVnaW4gdGhlIHByb2Nlc3MsIG90aGVyd2lzZS0gd2FpdCBmb3IgcmVzcG9uc2UgZnJvbSBzZXJ2aWNlIGluIG9uQ2hhbmdlc1xuICAgICAgaWYgKHRoaXMubG9jYWxBbmFseXNpcykge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdExvY2FsbHkobmV3X3RleHQpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1hTJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ3hzbWFsbCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLmJveEhlaWdodCA9PT0gJ1MnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAnc21hbGwnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ib3hIZWlnaHQgPT09ICdMJykge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ2xhcmdlJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuYm94SGVpZ2h0ID09PSAnWEwnKSB7XG4gICAgICB0aGlzLmJveFNpemUgPSAneGxhcmdlJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ib3hTaXplID0gJ21lZGl1bSc7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgodGhpcy50YXJnZXRJdGVtcy5sZW5ndGggPiAwKSAmJiAoIXRoaXMubG9jYWxBbmFseXNpcykpIHtcbiAgICAgIGlmIChjaGFuZ2VzLnRhcmdldEl0ZW1zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCduZXcgZXh0ZXJuYWwgdGFyZ2V0IGlucHV0IHJlY2VpdmVkJylcbiAgICAgICAgY29uc3QgbmV3X3RleHQgPSB0aGlzLm9idGFpblRleHQoKVxuICAgICAgICB0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5jbGVhcigpXG4gICAgICAgIHRoaXMuY3VycmVudFRleHQuZW1pdChuZXdfdGV4dClcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RFeHRlcm5hbGx5KG5ld190ZXh0KVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc3BvbnNlUGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgICAgICB9LCA1MDApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gdGhlIERPTSBlbGVtZW50cyBhZnRlciByZW5kZXJlZCwgYWxsb3dpbmcgZm9yIGJveC1ib3JkZXJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdmb2N1cycsICgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5pbnB1dEJveC5uYXRpdmVFbGVtZW50LCB0aGlzLmJveEZvY3VzKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLnRhcmdldFRleHQudmlld0NvbnRhaW5lclJlZi5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdibHVyJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmlucHV0Qm94Lm5hdGl2ZUVsZW1lbnQsIHRoaXMuYm94Rm9jdXMpO1xuICAgIH0pO1xuICAgIC8vIE1ldGhvZCBjYWxsZWQgdXBvbiBhIGtleXN0cm9rZSB0byBiZWdpbiB0aGUgcHJvY2VzcyBvZiB3YWl0aW5nIGZvciBhIDIgc2Vjb25kIHBhdXNlIGluIGtleXN0cm9rZXNcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQsICdrZXl1cCcsICgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdrZXlzdHJva2UnKVxuICAgICAgdGhpcy50ZXh0U3ViamVjdC5uZXh0KCk7XG4gICAgfSk7XG4gICAgLy8gRm9jdXMgdGhlIGNhcmV0IGF0IHRoZSBlbmQgb2YgdGhlIGJveFxuICAgIGlmICh0aGlzLmluaXRGb2N1cykge1xuICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgfVxuICB9XG5cbiAgb2J0YWluVGV4dCgpIHtcbiAgICBjb25zb2xlLmxvZygndGFyZ2V0JywgdGhpcy50YXJnZXRUZXh0KVxuICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQgPCAyKSB7XG4gICAgICBjb25zb2xlLmxvZygnb25lIGNoaWxkIGVsZW1lbnQnLCB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGRFbGVtZW50Q291bnQpXG4gICAgICBjb25zdCB0ZXh0ID0gdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmlubmVyVGV4dFxuICAgICAgY29uc29sZS5sb2codGhpcy50ZXh0QXJlYSlcbiAgICAgIGNvbnNvbGUubG9nKCd0ZXh0IG9idGFpbmVkJywgdGV4dClcbiAgICAgIHJldHVybiB0ZXh0XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdsb3RzIG9mIGNoaWxkcmVuIGVsZW1lbnRzJywgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkRWxlbWVudENvdW50KVxuICAgICAgY29uc3QgY2hpbGROb2RlcyA9IHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzXG4gICAgICBsZXQgbmV3VGV4dCA9ICcnXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnRleHRBcmVhKVxuXG4gICAgICBpZiAodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgICBpZiAodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0ubG9jYWxOYW1lID09PSAnYnInKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2JyIGV4aXN0cy0ga2lsbGluZyBpdCcpXG4gICAgICAgICAgdGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzWzFdKVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS5ub2RlTmFtZSA9PT0gJyN0ZXh0Jykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGVhbiBkZWxldGUtIHRleHQgZXhpc3RzIGluIFsxXSBleGlzdHMtIGV4dHJhY3RpbmcgaXQnKVxuICAgICAgICAgIGNvbnN0IHRlbXAgPSB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXS50ZXh0Q29udGVudFxuICAgICAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXSlcbiAgICAgICAgICBpZiAodGhpcy50ZXh0QXJlYS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXNbMV0ubG9jYWxOYW1lID09PSAnYnInKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYSBuZXcgYnIgZXhpc3RzLSBraWxsaW5nIGl0JylcbiAgICAgICAgICAgIHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2Rlc1sxXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc29sZS5sb2coJ3RleHQgb2J0YWluZWQnLCB0ZW1wKVxuICAgICAgICAgIHJldHVybiB0ZW1wXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoY2hpbGROb2Rlc1tpXS5pbm5lclRleHQpIHtcbiAgICAgICAgICBuZXdUZXh0ID0gbmV3VGV4dCArICcgJyArIGNoaWxkTm9kZXNbaV0uaW5uZXJUZXh0XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKCd0ZXh0IG9idGFpbmVkJywgbmV3VGV4dClcbiAgICAgIHJldHVybiBuZXdUZXh0XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50cyh0ZXh0QXJyYXkpIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdpbiByZW5kZXInLCB0aGlzLnRleHRBcmVhKVxuICAgICAgY29uc3QgdGFyZ2V0UmVmID0gdGhpcy50YXJnZXRUZXh0XG4gICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZmlyc3RDaGlsZC50ZXh0Q29udGVudCA9ICcnXG5cbiAgICAgIGNvbnNvbGUubG9nKCdyZW5kZXIgYXJyYXknLCB0ZXh0QXJyYXkpXG4gICAgICBjb25zdCB0ZXN0TWVudSA9IHtcbiAgICAgICAgcmVwbGFjZW1lbnRPcHRpb25zOiBbXG4gICAgICAgICAgeyB2aWV3VmFsdWU6ICdTdXNoaScsIHZhbHVlOiAnc3VzaGknIH0sXG4gICAgICAgICAgeyB2aWV3VmFsdWU6ICdQaXp6YScsIHZhbHVlOiAncGl6emEnIH0sXG4gICAgICAgICAgeyB2aWV3VmFsdWU6ICdIb3QgRG9ncycsIHZhbHVlOiAnaG90IGRvZ3MnIH1cbiAgICAgICAgXSxcbiAgICAgICAgZGVzY3JpcHRpb25JdGVtczogW1xuICAgICAgICAgICdTdWdnZXN0ZWQgcmVwbGFjZW1lbnRzJ1xuICAgICAgICBdXG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkodGV4dEFycmF5W2ldLmNvbXBvbmVudClcbiAgICAgICAgY29uc3QgcmVmID0gdGFyZ2V0UmVmLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnkpO1xuICAgICAgICBjb25zdCBlbCA9IHRoaXMudGFyZ2V0VGV4dC52aWV3Q29udGFpbmVyUmVmLmVsZW1lbnQ7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLnRleHQgPSB0ZXh0QXJyYXlbaV0udGV4dDtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkuY3NzID0gdGV4dEFycmF5W2ldLmNzcztcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkudHlwZSA9IHRleHRBcnJheVtpXS50eXBlO1xuICAgICAgICAoPFRleHRDb21wb25lbnQ+cmVmLmluc3RhbmNlKS5jb25maWRlbmNlID0gdGV4dEFycmF5W2ldLmNvbmZpZGVuY2U7XG4gICAgICAgICg8VGV4dENvbXBvbmVudD5yZWYuaW5zdGFuY2UpLm1lbnUgPSB0ZXh0QXJyYXlbaV0ubWVudTtcbiAgICAgICAgKDxUZXh0Q29tcG9uZW50PnJlZi5pbnN0YW5jZSkuZGF0YSA9IHRleHRBcnJheVtpXTtcblxuICAgICAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKGVsLm5hdGl2ZUVsZW1lbnQsIHJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRob3V0IGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RMb2NhbGx5KHRleHQpIHtcbiAgICBjb25zb2xlLmxvZygnaW4gY29uc3RydWN0IGxvY2FsbHknKVxuICAgIGNvbnN0IGFuYWx5c2lzT3V0cHV0ID0gbG9jYWxBbmFseXNpcyh0aGlzLnRhcmdldEl0ZW1zLCB0ZXh0LCB0aGlzLmNhc2VTZW5zaXRpdmUpO1xuICAgIHRoaXMucmVuZGVyQ29tcG9uZW50cyhhbmFseXNpc091dHB1dClcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBjb25zdHJ1Y3QgdGhlIGh0bWwgc3RyaW5nIGZyb20gYW4gaW5wdXQgdGV4dCBhcnJheSB3aXRoIGxvY2F0aW9uc1xuICBjb25zdHJ1Y3RFeHRlcm5hbGx5KHRleHQpIHtcbiAgICBjb25zb2xlLmxvZygnaW4gY29uc3RydWN0IGV4dGVybmFsbHknKVxuICAgIGNvbnN0cnVjdENvbXBvbmVudEFycmF5KHRoaXMudGFyZ2V0SXRlbXMsIHRleHQpXG4gIH1cblxuICAvLyBBQ0NFU1NJQklMSVRZXG4gIC8vIE1ldGhvZCB0byBkaXJlY3QgdGhlIGZvY3VzIG9mIGFueSBjbGljayB0byB0aGUgZGVzaXJlZCBsb2NhdGlvblxuICBmb2N1c0lucHV0KCkge1xuICAgIGNvbnNvbGUubG9nKCdmb2N1cycpO1xuICAgIGlmICh0aGlzLnRleHRBcmVhKSB7XG4gICAgICB0aGlzLnRleHRBcmVhLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgIHRoaXMucGxhY2VDYXJldEF0RW5kKHRoaXMudGV4dEFyZWEubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHBsYWNlIHRoZSBjYXJldCBmb2N1cyBhdCB0aGUgZW5kIG9mIHRoZSBsYXN0IGl0ZW0gb2YgdGhlIHRleHQgYXJyYXlcbiAgcGxhY2VDYXJldEF0RW5kKGVsKSB7XG4gICAgZWwuZm9jdXMoKTtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5nZXRTZWxlY3Rpb24gIT09ICd1bmRlZmluZWQnXG4gICAgICAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlUmFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4gICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWwpO1xuICAgICAgcmFuZ2UuY29sbGFwc2UoZmFsc2UpO1xuICAgICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgICAgc2VsLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgICAgc2VsLmFkZFJhbmdlKHJhbmdlKTtcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgY2FsbGVkIHRvIHNlbGVjdCBhbGwgdGV4dCBpbiBib3ggaWYgZG91YmxlIGNsaWNrZWQgYW55d2hlcmUgaW4gdGhlIGJveFxuICBzZWxlY3RBbGwoKSB7XG4gICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ3NlbGVjdEFsbCcsIGZhbHNlLCBudWxsKTtcbiAgfVxufVxuXG4vLyBhbGwgZ29vZCBoZXJlLCBuZWVkcyB0byBzdGlsbCBsb29rIGZvciB0aGUgaXRlbXMgbG9jYWxseSBhbmQgc2VuZCBvdXQgdGhhdCB0byB0ZXh0IGFycmF5XG5mdW5jdGlvbiBsb2NhbEFuYWx5c2lzKHNlYXJjaFRhcmdldHMsIHN0ciwgY2FzZVNlbnNpdGl2ZSkge1xuICBjb25zb2xlLmxvZygnaW4gbG9jYWwgYW5hbHlzaXMnKVxuICBjb25zdCBvdXRwdXQgPSBbXTtcbiAgZm9yIChjb25zdCBpdGVtIG9mIHNlYXJjaFRhcmdldHMpIHtcbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG4gICAgbGV0IGluZGV4O1xuICAgIGNvbnN0IHNlYXJjaFN0ckxlbiA9IGl0ZW0udGV4dC5sZW5ndGg7XG4gICAgaWYgKHNlYXJjaFN0ckxlbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJ0FuIGVycm9yIG9jY3VycmVkLiBUaGVyZSBhcHBlYXJzIHRvIGJlIG5vIGlucHV0IHNlYXJjaCBzdHJpbmcuJztcbiAgICB9XG4gICAgbGV0IHNlYXJjaGluZ1N0cmluZztcbiAgICBsZXQgc2VhcmNoaW5nVGV4dDtcbiAgICBpZiAoIWNhc2VTZW5zaXRpdmUpIHtcbiAgICAgIHNlYXJjaGluZ1N0cmluZyA9IHN0ci50b0xvd2VyQ2FzZSgpO1xuICAgICAgc2VhcmNoaW5nVGV4dCA9IGl0ZW0udGV4dC50b0xvd2VyQ2FzZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWFyY2hpbmdTdHJpbmcgPSBzdHI7XG4gICAgICBzZWFyY2hpbmdUZXh0ID0gaXRlbS50ZXh0O1xuICAgIH1cbiAgICB3aGlsZSAoKGluZGV4ID0gc2VhcmNoaW5nU3RyaW5nLmluZGV4T2Yoc2VhcmNoaW5nVGV4dCwgc3RhcnRJbmRleCkpID4gLTEpIHtcbiAgICAgIGNvbnN0IGluZGV4SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc3RyLnN1YnN0cmluZyhpbmRleCwgaW5kZXggKyBzZWFyY2hTdHJMZW4pLFxuICAgICAgICBsb2NhdGlvbjogW2luZGV4LCBpbmRleCArIHNlYXJjaFN0ckxlbl0sXG4gICAgICAgIG1lbnU6IGl0ZW0ubWVudSA/IGl0ZW0ubWVudSA6IG51bGwsXG4gICAgICAgIHR5cGU6IGl0ZW0udHlwZSA/IGl0ZW0udHlwZSA6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNzczogaXRlbS5jc3NcbiAgICAgIH1cbiAgICAgIG91dHB1dC5wdXNoKGluZGV4SXRlbSk7XG4gICAgICBzdGFydEluZGV4ID0gaW5kZXggKyBzZWFyY2hTdHJMZW47XG4gICAgfVxuICB9XG4gIGNvbnNvbGUubG9nKCdvdXRwdXQgZnJvbSBsb2NhbDogJywgb3V0cHV0KVxuICByZXR1cm4gY29uc3RydWN0Q29tcG9uZW50QXJyYXkob3V0cHV0LCBzdHIpO1xufVxuXG5cbi8vIENIQU5HRSBUSElTIHRvIG1ha2UgY29tcGxldGUgdGV4dCBhcnJheVxuLy8gdGFrZSBpbiB0YXJnZXRzIGZvdW5kIGFuZCBpbmRpY2VzIG9mIGFsbCwgY3JlYXRlIGEgbGFyZ2UgdGV4dCBhcnJheSB3aXRoIG5vbi10YXJnZXQgdGV4dFxuLy8gYXBwZW5kIHR5cGUgb2YgY29tcG9uZW50IHRvIGl0IChSZWd1bGFyQ29tcG9uZW50IG9yIEhpZ2hsaWdodGVkQ29tcG9uZW50KVxuZnVuY3Rpb24gY29uc3RydWN0Q29tcG9uZW50QXJyYXkoc2VhcmNoUmVzdWx0cywgb3JpZ2luYWxfdGV4dCkge1xuICBjb25zb2xlLmxvZygnaW4gY29uc3RydWN0IGFycmF5JylcbiAgY29uc3QgZmluYWxBcnJheSA9IFtdXG4gIGxldCBsb2NhdGlvbkNoZWNrZXIgPSB0cnVlO1xuICBjb25zdCBlcnJvcmVkSXRlbXMgPSBbXTtcbiAgaWYgKHNlYXJjaFJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgY29uc3Qgb25seUl0ZW0gPSAge1xuICAgICAgdGV4dDogb3JpZ2luYWxfdGV4dCxcbiAgICAgIGNzczogbnVsbCxcbiAgICAgIG1lbnU6IG51bGwsXG4gICAgICB0eXBlOiBudWxsLFxuICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgIH1cbiAgICBmaW5hbEFycmF5LnB1c2gob25seUl0ZW0pXG4gICAgcmV0dXJuIGZpbmFsQXJyYXlcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygc2VhcmNoUmVzdWx0cykge1xuICAgICAgaWYgKCFpdGVtLmxvY2F0aW9uKSB7XG4gICAgICAgIGVycm9yZWRJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICBsb2NhdGlvbkNoZWNrZXIgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFsb2NhdGlvbkNoZWNrZXIpIHtcbiAgICAgIGxldCBlcnJvcmVkSXRlbXNUZXh0ID0gJydcbiAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBlcnJvcmVkSXRlbXMpIHtcbiAgICAgICAgZXJyb3JlZEl0ZW1zVGV4dCA9IGVycm9yZWRJdGVtc1RleHQgKyBpdGVtLnRleHQgKyAnICAnO1xuICAgICAgfVxuICAgICAgY29uc3QgZXJyb3JUZXh0ID0gJ0FuIGVycm9yIG9jY3VyZWQuIFRoZSBmb2xsb3dpbmcgaXRlbXMgZGlkIG5vdCBoYXZlIGEgdmFsaWQgaWRlbnRpZmllZCBpbmRleCBsb2NhdGlvbjogJyArIGVycm9yZWRJdGVtc1RleHRcbiAgICAgICsgJ0VpdGhlciBwcm92aWRlIHByb3BlciBpbmRleCBsb2NhdGlvbnMgb2YgZWFjaCBpdGVtIHRvIGJlIGhpZ2hsaWdodGVkIG9yIHNldCBsb2NhbEFuYWx5c2lzIHRvIHRydWUuJztcbiAgICAgIGNvbnN0IGVycm9ySXRlbSA9ICB7XG4gICAgICAgIHRleHQ6IGVycm9yVGV4dCxcbiAgICAgICAgY3NzOiBudWxsLFxuICAgICAgICBtZW51OiBudWxsLFxuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IFJlZ3VsYXJDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChlcnJvckl0ZW0pXG4gICAgICByZXR1cm4gZmluYWxBcnJheVxuICAgIH1cbiAgfVxuICBzZWFyY2hSZXN1bHRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBhLmxvY2F0aW9uWzBdIC0gYi5sb2NhdGlvblswXTtcbiAgfSlcbiAgbGV0IHN0YXJ0ID0gMDtcbiAgbGV0IGVuZCA9IHNlYXJjaFJlc3VsdHNbMF0ubG9jYXRpb25bMF07XG4gIGxldCBtaWRkbGUgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWFyY2hSZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0ID09PSAwKSB7XG4gICAgICBjb25zdCBzdGFydEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IG9yaWdpbmFsX3RleHQuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpLFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKHN0YXJ0SXRlbSlcbiAgICAgIGNvbnN0IGZpcnN0SXRlbSA9IHtcbiAgICAgICAgdGV4dDogc2VhcmNoUmVzdWx0c1tpXS50ZXh0LFxuICAgICAgICBjc3M6IHNlYXJjaFJlc3VsdHNbaV0uY3NzLFxuICAgICAgICBtZW51OiBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgPyBzZWFyY2hSZXN1bHRzW2ldLm1lbnUgOiBudWxsLFxuICAgICAgICB0eXBlOiBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgPyBzZWFyY2hSZXN1bHRzW2ldLnR5cGUgOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IEhpZ2hsaWdodGVkQ29tcG9uZW50XG4gICAgICB9XG4gICAgICBmaW5hbEFycmF5LnB1c2goZmlyc3RJdGVtKVxuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbmV4dEl0ZW0gPSB7XG4gICAgICAgIHRleHQ6IHNlYXJjaFJlc3VsdHNbaV0udGV4dCxcbiAgICAgICAgY3NzOiBzZWFyY2hSZXN1bHRzW2ldLmNzcyxcbiAgICAgICAgbWVudTogc2VhcmNoUmVzdWx0c1tpXS5tZW51ID8gc2VhcmNoUmVzdWx0c1tpXS5tZW51IDogbnVsbCxcbiAgICAgICAgdHlwZTogc2VhcmNoUmVzdWx0c1tpXS50eXBlID8gc2VhcmNoUmVzdWx0c1tpXS50eXBlIDogbnVsbCxcbiAgICAgICAgY29uZmlkZW5jZTogbnVsbCxcbiAgICAgICAgY29tcG9uZW50OiBIaWdobGlnaHRlZENvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKG5leHRJdGVtKVxuICAgIH1cblxuICAgIGlmIChzZWFyY2hSZXN1bHRzW2kgKyAxXSkge1xuICAgICAgbWlkZGxlID0gb3JpZ2luYWxfdGV4dC5zdWJzdHJpbmcoc2VhcmNoUmVzdWx0c1tpXS5sb2NhdGlvblsxXSwgc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMF0pO1xuICAgICAgY29uc3QgbWlkZGxlSXRlbSA9IHtcbiAgICAgICAgdGV4dDogbWlkZGxlLFxuICAgICAgICBjc3M6IG51bGwsXG4gICAgICAgIG1lbnU6IG51bGwsXG4gICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIGNvbmZpZGVuY2U6IG51bGwsXG4gICAgICAgIGNvbXBvbmVudDogUmVndWxhckNvbXBvbmVudFxuICAgICAgfVxuICAgICAgZmluYWxBcnJheS5wdXNoKG1pZGRsZUl0ZW0pXG4gICAgICBzdGFydCA9IHNlYXJjaFJlc3VsdHNbaSArIDFdLmxvY2F0aW9uWzBdO1xuICAgICAgZW5kID0gc2VhcmNoUmVzdWx0c1tpICsgMV0ubG9jYXRpb25bMV07XG4gICAgfVxuXG4gICAgaWYgKGkgPT09IChzZWFyY2hSZXN1bHRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICBjb25zdCBlbmRJdGVtID0ge1xuICAgICAgICB0ZXh0OiBvcmlnaW5hbF90ZXh0LnN1YnN0cmluZyhlbmQsIG9yaWdpbmFsX3RleHQubGVuZ3RoKSxcbiAgICAgICAgY3NzOiBudWxsLFxuICAgICAgICBtZW51OiBudWxsLFxuICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICBjb25maWRlbmNlOiBudWxsLFxuICAgICAgICBjb21wb25lbnQ6IFJlZ3VsYXJDb21wb25lbnRcbiAgICAgIH1cbiAgICAgIGZpbmFsQXJyYXkucHVzaChlbmRJdGVtKVxuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZygnb3V0cHV0IG9mIGFycmF5IGNvbnN0cnVjdGlvbjonLCBmaW5hbEFycmF5KVxuICByZXR1cm4gZmluYWxBcnJheTtcbn1cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOZ0lucHV0SGlnaGxpZ2h0ZXJDb21wb25lbnQgfSBmcm9tICcuL25nLWlucHV0LWhpZ2hsaWdodGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBUZXh0RGlyZWN0aXZlIH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LmRpcmVjdGl2ZSdcbmltcG9ydCB7IEhpZ2hsaWdodGVkQ29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LWhpZ2hsaWdodC5jb21wb25lbnQnXG5pbXBvcnQgeyBSZWd1bGFyQ29tcG9uZW50IH0gZnJvbSAnLi90ZXh0Q29tcG9uZW50cy90ZXh0LXJlZ3VsYXIuY29tcG9uZW50J1xuaW1wb3J0IHsgTWF0TWVudU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL21lbnUnO1xuaW1wb3J0IHsgTWF0U2VsZWN0TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0JztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZSxcbiAgICBNYXRNZW51TW9kdWxlLFxuICAgIE1hdFNlbGVjdE1vZHVsZSxcbiAgICBNYXRGb3JtRmllbGRNb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50LFxuICAgIFRleHREaXJlY3RpdmUsXG4gICAgSGlnaGxpZ2h0ZWRDb21wb25lbnQsXG4gICAgUmVndWxhckNvbXBvbmVudFxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFsgSGlnaGxpZ2h0ZWRDb21wb25lbnQsIFJlZ3VsYXJDb21wb25lbnRdLFxuICBleHBvcnRzOiBbTmdJbnB1dEhpZ2hsaWdodGVyQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBOZ0lucHV0SGlnaGxpZ2h0ZXJNb2R1bGUgeyB9XG4iXSwibmFtZXMiOlsiQ29tcG9uZW50IiwiSW5wdXQiLCJEaXJlY3RpdmUiLCJWaWV3Q29udGFpbmVyUmVmIiwiRXZlbnRFbWl0dGVyIiwiU3ViamVjdCIsImRlYm91bmNlVGltZSIsIkNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciIsIlJlbmRlcmVyMiIsIk91dHB1dCIsIlZpZXdDaGlsZCIsInRzbGliXzEuX192YWx1ZXMiLCJOZ01vZHVsZSIsIkJyb3dzZXJNb2R1bGUiLCJNYXRNZW51TW9kdWxlIiwiTWF0U2VsZWN0TW9kdWxlIiwiTWF0Rm9ybUZpZWxkTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFjQSxzQkE0RnlCLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsT0FBTztZQUNILElBQUksRUFBRTtnQkFDRixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU07b0JBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUMzQztTQUNKLENBQUM7SUFDTixDQUFDOzs7Ozs7QUNuSEQ7O3dCQVVrQixNQUFNOzhCQUNBLElBQUk7OztvQkFQM0JBLGNBQVMsU0FBQzt3QkFDUCxvSUFBNEM7cUJBQy9DOzs7MkJBRUVDLFVBQUs7MEJBQ0xBLFVBQUs7MkJBQ0xBLFVBQUs7aUNBQ0xBLFVBQUs7MkJBQ0xBLFVBQUs7MkJBQ0xBLFVBQUs7OytCQWJSOzs7Ozs7O0FDQUE7O3dCQVdrQixNQUFNOzhCQUNBLElBQUk7eUJBSWxCLEtBQUs7Ozs7Ozs7Ozs7UUFPYiwwQ0FBVzs7OztZQUFYLFVBQVksSUFBSTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUksR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFBO2dCQUMzRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTs7YUFFekI7Ozs7UUFFRCwwQ0FBVzs7O1lBQVg7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7Z0JBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFOztvQkFDakIsSUFBTSxNQUFNLEdBQUc7d0JBQ2IsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJO3dCQUNwQixLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUk7cUJBQ2pCLENBQUE7b0JBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7b0JBQ3pDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO2lCQUNoQjtnQkFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7YUFDMUI7O29CQW5DRkQsY0FBUyxTQUFDO3dCQUNQLCt5Q0FBOEM7cUJBQ2pEOzs7MkJBRUVDLFVBQUs7MEJBQ0xBLFVBQUs7MkJBQ0xBLFVBQUs7aUNBQ0xBLFVBQUs7MkJBQ0xBLFVBQUs7MkJBQ0xBLFVBQUs7O21DQWRSOzs7Ozs7O0FDQUE7UUFNRSx1QkFBbUIsZ0JBQWtDO1lBQWxDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7U0FBSzs7b0JBSjNEQyxjQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLGVBQWU7cUJBQzFCOzs7Ozt3QkFKbUJDLHFCQUFnQjs7OzRCQUFwQzs7Ozs7Ozs7UUM0Q0UscUNBQW9CLHdCQUFrRCxFQUFVLFFBQW1CO1lBQS9FLDZCQUF3QixHQUF4Qix3QkFBd0IsQ0FBMEI7WUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXOytCQXRCekQsRUFBRTtpQ0FDbkIsSUFBSTs2QkFDUixHQUFHOzs0QkFFSixJQUFJOzZCQUNILGFBQWE7NEJBQ2QsTUFBTTs0QkFDTixTQUFTOzZCQUNSLElBQUk7aUNBQ0EsS0FBSzsrQkFDTixJQUFJQyxpQkFBWSxFQUFVOytCQU9YLElBQUlDLFlBQU8sRUFBRTttQ0FDM0IsS0FBSzs2QkFDYSxFQUFFO1NBSTVDOzs7O1FBRUQsOENBQVE7OztZQUFSO2dCQUFBLGlCQStCQzs7Z0JBN0JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUNuQkMsc0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJOzs7b0JBRWQsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7O29CQUMzQixJQUFNLFFBQVEsR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7b0JBQ2xDLEtBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUE7b0JBQ3hDLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztvQkFFaEMsSUFBSSxLQUFJLENBQUMsYUFBYSxFQUFFO3dCQUN0QixLQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQ2hDLFVBQVUsQ0FBQzs0QkFDVCxLQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQzs0QkFDN0IsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO3lCQUNuQixFQUFFLEdBQUcsQ0FBQyxDQUFBO3FCQUNSO2lCQUNGLENBQUMsQ0FBQTtnQkFFRixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO29CQUMzQixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztpQkFDekI7cUJBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBRTtvQkFDakMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7aUJBQ3hCO3FCQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2lCQUN4QjtxQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO29CQUNsQyxJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztpQkFDekI7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7aUJBQ3pCO2FBQ0Y7Ozs7O1FBRUQsaURBQVc7Ozs7WUFBWCxVQUFZLE9BQXNCO2dCQUFsQyxpQkFjQztnQkFiQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUMxRCxJQUFJLE9BQU8saUJBQWM7d0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQTs7d0JBQ2pELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTt3QkFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQTt3QkFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7d0JBQy9CLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTt3QkFDbEMsVUFBVSxDQUFDOzRCQUNULEtBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDOzRCQUM3QixLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7eUJBQ25CLEVBQUUsR0FBRyxDQUFDLENBQUE7cUJBQ1I7aUJBQ0Y7YUFDRjs7OztRQUVELHFEQUFlOzs7WUFBZjtnQkFBQSxpQkFpQkM7O2dCQWZDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUU7b0JBQ3BGLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDcEUsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUU7b0JBQ25GLEtBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDdkUsQ0FBQyxDQUFDOztnQkFFSCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUU7b0JBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7b0JBQ3hCLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ3pCLENBQUMsQ0FBQzs7Z0JBRUgsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO29CQUNsQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7aUJBQ25CO2FBQ0Y7Ozs7UUFFRCxnREFBVTs7O1lBQVY7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO2dCQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLGlCQUFpQixHQUFHLENBQUMsRUFBRTtvQkFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBOztvQkFDL0UsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFBO29CQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUE7b0JBQ2xDLE9BQU8sSUFBSSxDQUFBO2lCQUNaO3FCQUFNO29CQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQTs7b0JBQ3ZGLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQTs7b0JBQ3pELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtvQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7b0JBRTFCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3JELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxJQUFJLEVBQUU7NEJBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTs0QkFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO3lCQUNuRjt3QkFDRCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFOzRCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdEQUF3RCxDQUFDLENBQUE7OzRCQUNyRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFBOzRCQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7NEJBQ2xGLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxJQUFJLEVBQUU7Z0NBQ2hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtnQ0FDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBOzZCQUNuRjs0QkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQTs0QkFDbEMsT0FBTyxJQUFJLENBQUE7eUJBQ1o7cUJBQ0Y7b0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRTs0QkFDM0IsT0FBTyxHQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTt5QkFDbEQ7cUJBQ0Y7b0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUE7b0JBQ3JDLE9BQU8sT0FBTyxDQUFBO2lCQUNmO2FBQ0Y7Ozs7O1FBRUQsc0RBQWdCOzs7O1lBQWhCLFVBQWlCLFNBQVM7Z0JBQTFCLGlCQStCQztnQkE5QkMsVUFBVSxDQUFDO29CQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTs7b0JBQ3ZDLElBQU0sU0FBUyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUE7b0JBQ2pDLEtBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO29CQUV2RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQTtvQkFXdEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O3dCQUN6QyxJQUFNLGdCQUFnQixHQUFHLEtBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7O3dCQUN0RyxJQUFNLEdBQUcsR0FBRyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O3dCQUN6RSxJQUFNLEVBQUUsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQzt3QkFDcEQsbUJBQWdCLEdBQUcsQ0FBQyxRQUFRLEdBQUUsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3ZELG1CQUFnQixHQUFHLENBQUMsUUFBUSxHQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO3dCQUNyRCxtQkFBZ0IsR0FBRyxDQUFDLFFBQVEsR0FBRSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDdkQsbUJBQWdCLEdBQUcsQ0FBQyxRQUFRLEdBQUUsVUFBVSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7d0JBQ25FLG1CQUFnQixHQUFHLENBQUMsUUFBUSxHQUFFLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO3dCQUN2RCxtQkFBZ0IsR0FBRyxDQUFDLFFBQVEsR0FBRSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVsRCxLQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7cUJBQ3hFO2lCQUNGLENBQUMsQ0FBQTthQUNIOzs7Ozs7UUFJRCxzREFBZ0I7Ozs7WUFBaEIsVUFBaUIsSUFBSTtnQkFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBOztnQkFDbkMsSUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDakYsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFBO2FBQ3RDOzs7Ozs7UUFHRCx5REFBbUI7Ozs7WUFBbkIsVUFBb0IsSUFBSTtnQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO2dCQUN0Qyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFBO2FBQ2hEOzs7Ozs7UUFJRCxnREFBVTs7O1lBQVY7Z0JBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNuRDthQUNGOzs7Ozs7UUFHRCxxREFBZTs7OztZQUFmLFVBQWdCLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDWCxJQUFJLE9BQU8sTUFBTSxDQUFDLFlBQVksS0FBSyxXQUFXO3VCQUN6QyxPQUFPLFFBQVEsQ0FBQyxXQUFXLEtBQUssV0FBVyxFQUFFOztvQkFDaEQsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUNyQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzdCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7O29CQUN0QixJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQ2xDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztvQkFDdEIsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDckI7YUFDRjs7Ozs7UUFHRCwrQ0FBUzs7O1lBQVQ7Z0JBQ0UsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2hEOztvQkF4TkZOLGNBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsMEJBQTBCO3dCQUNwQyx3bUJBQTBDOztxQkFFM0M7Ozs7O3dCQWZDTyw2QkFBd0I7d0JBQ2JDLGNBQVM7Ozs7a0NBa0JuQlAsVUFBSztvQ0FDTEEsVUFBSztnQ0FDTEEsVUFBSzsrQkFFTEEsVUFBSztnQ0FDTEEsVUFBSzsrQkFDTEEsVUFBSzsrQkFDTEEsVUFBSztnQ0FDTEEsVUFBSztvQ0FDTEEsVUFBSztrQ0FDTFEsV0FBTTsrQkFFTkMsY0FBUyxTQUFDLFVBQVU7Z0NBQ3BCQSxjQUFTLFNBQUMsV0FBVztpQ0FDckJBLGNBQVMsU0FBQyxhQUFhOytCQUN2QkEsY0FBUyxTQUFDLFVBQVU7OzBDQXJDdkI7Ozs7Ozs7O0lBME9BLHVCQUF1QixhQUFhLEVBQUUsR0FBRyxFQUFFLGFBQWE7O1FBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQTs7UUFDaEMsSUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDOztZQUNsQixLQUFtQixJQUFBLGtCQUFBQyxTQUFBLGFBQWEsQ0FBQSw0Q0FBQSx1RUFBRTtnQkFBN0IsSUFBTSxJQUFJLDBCQUFBOztnQkFDYixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7O2dCQUNuQixJQUFJLEtBQUssVUFBQzs7Z0JBQ1YsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3RDLElBQUksWUFBWSxLQUFLLENBQUMsRUFBRTtvQkFDcEIsT0FBTyxnRUFBZ0UsQ0FBQztpQkFDM0U7O2dCQUNELElBQUksZUFBZSxVQUFDOztnQkFDcEIsSUFBSSxhQUFhLFVBQUM7Z0JBQ2xCLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ2xCLGVBQWUsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ3BDLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2lCQUN6QztxQkFBTTtvQkFDTCxlQUFlLEdBQUcsR0FBRyxDQUFDO29CQUN0QixhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztpQkFDM0I7Z0JBQ0QsT0FBTyxDQUFDLEtBQUssR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTs7b0JBQ3hFLElBQU0sU0FBUyxHQUFHO3dCQUNoQixJQUFJLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLFlBQVksQ0FBQzt3QkFDaEQsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxZQUFZLENBQUM7d0JBQ3ZDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSTt3QkFDbEMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJO3dCQUNsQyxVQUFVLEVBQUUsSUFBSTt3QkFDaEIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO3FCQUNkLENBQUE7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdkIsVUFBVSxHQUFHLEtBQUssR0FBRyxZQUFZLENBQUM7aUJBQ25DO2FBQ0Y7Ozs7Ozs7Ozs7Ozs7OztRQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFDMUMsT0FBTyx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDN0M7Ozs7OztJQU1ELGlDQUFpQyxhQUFhLEVBQUUsYUFBYTs7UUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBOztRQUNqQyxJQUFNLFVBQVUsR0FBRyxFQUFFLENBQUE7O1FBQ3JCLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQzs7UUFDM0IsSUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O1lBQzlCLElBQU0sUUFBUSxHQUFJO2dCQUNoQixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFNBQVMsRUFBRSxnQkFBZ0I7YUFDNUIsQ0FBQTtZQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDekIsT0FBTyxVQUFVLENBQUE7U0FDbEI7YUFBTTs7Z0JBQ0wsS0FBbUIsSUFBQSxrQkFBQUEsU0FBQSxhQUFhLENBQUEsNENBQUEsdUVBQUU7b0JBQTdCLElBQU0sSUFBSSwwQkFBQTtvQkFDYixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTt3QkFDbEIsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDeEIsZUFBZSxHQUFHLEtBQUssQ0FBQztxQkFDekI7aUJBQ0Y7Ozs7Ozs7Ozs7Ozs7OztZQUNELElBQUksQ0FBQyxlQUFlLEVBQUU7O2dCQUNwQixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTs7b0JBQ3pCLEtBQW1CLElBQUEsaUJBQUFBLFNBQUEsWUFBWSxDQUFBLDBDQUFBLG9FQUFFO3dCQUE1QixJQUFNLElBQUkseUJBQUE7d0JBQ2IsZ0JBQWdCLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7cUJBQ3hEOzs7Ozs7Ozs7Ozs7Ozs7O2dCQUNELElBQU0sU0FBUyxHQUFHLHdGQUF3RixHQUFHLGdCQUFnQjtzQkFDM0gsb0dBQW9HLENBQUM7O2dCQUN2RyxJQUFNLFNBQVMsR0FBSTtvQkFDakIsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsR0FBRyxFQUFFLElBQUk7b0JBQ1QsSUFBSSxFQUFFLElBQUk7b0JBQ1YsSUFBSSxFQUFFLElBQUk7b0JBQ1YsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFNBQVMsRUFBRSxnQkFBZ0I7aUJBQzVCLENBQUE7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDMUIsT0FBTyxVQUFVLENBQUE7YUFDbEI7U0FDRjtRQUNELGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQztZQUM5QixPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0QyxDQUFDLENBQUE7O1FBQ0YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOztRQUNkLElBQUksR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7O1FBQ3ZDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7O2dCQUNmLElBQU0sU0FBUyxHQUFHO29CQUNoQixJQUFJLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO29CQUN6QyxHQUFHLEVBQUUsSUFBSTtvQkFDVCxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsSUFBSTtvQkFDVixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsU0FBUyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQTtnQkFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztnQkFDMUIsSUFBTSxTQUFTLEdBQUc7b0JBQ2hCLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDM0IsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO29CQUN6QixJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUk7b0JBQzFELElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtvQkFDMUQsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFNBQVMsRUFBRSxvQkFBb0I7aUJBQ2hDLENBQUE7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDMUIsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEM7aUJBQU07O2dCQUNMLElBQU0sUUFBUSxHQUFHO29CQUNmLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTtvQkFDM0IsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHO29CQUN6QixJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUk7b0JBQzFELElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSTtvQkFDMUQsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFNBQVMsRUFBRSxvQkFBb0I7aUJBQ2hDLENBQUE7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTthQUMxQjtZQUVELElBQUksYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFDakcsSUFBTSxVQUFVLEdBQUc7b0JBQ2pCLElBQUksRUFBRSxNQUFNO29CQUNaLEdBQUcsRUFBRSxJQUFJO29CQUNULElBQUksRUFBRSxJQUFJO29CQUNWLElBQUksRUFBRSxJQUFJO29CQUNWLFVBQVUsRUFBRSxJQUFJO29CQUNoQixTQUFTLEVBQUUsZ0JBQWdCO2lCQUM1QixDQUFBO2dCQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQzNCLEtBQUssR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hDO1lBRUQsSUFBSSxDQUFDLE1BQU0sYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRTs7Z0JBQ3BDLElBQU0sT0FBTyxHQUFHO29CQUNkLElBQUksRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDO29CQUN4RCxHQUFHLEVBQUUsSUFBSTtvQkFDVCxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsSUFBSTtvQkFDVixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsU0FBUyxFQUFFLGdCQUFnQjtpQkFDNUIsQ0FBQTtnQkFDRCxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ3pCO1NBQ0Y7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQ3hELE9BQU8sVUFBVSxDQUFDO0tBQ25COzs7Ozs7QUNoWUQ7Ozs7b0JBVUNDLGFBQVEsU0FBQzt3QkFDUixPQUFPLEVBQUU7NEJBQ1BDLDZCQUFhOzRCQUNiQyxrQkFBYTs0QkFDYkMsc0JBQWU7NEJBQ2ZDLDRCQUFrQjt5QkFDbkI7d0JBQ0QsWUFBWSxFQUFFOzRCQUNaLDJCQUEyQjs0QkFDM0IsYUFBYTs0QkFDYixvQkFBb0I7NEJBQ3BCLGdCQUFnQjt5QkFDakI7d0JBQ0QsZUFBZSxFQUFFLENBQUUsb0JBQW9CLEVBQUUsZ0JBQWdCLENBQUM7d0JBQzFELE9BQU8sRUFBRSxDQUFDLDJCQUEyQixDQUFDO3FCQUN2Qzs7dUNBekJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7In0=