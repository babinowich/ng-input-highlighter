import { OnInit, Renderer2, ElementRef, AfterViewInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { TargetArrayItem } from './classes/targetTextItem.class';
import { TargetItem } from './classes/targetItems.class';
export declare class NgInputHighlighterComponent implements OnInit, OnChanges, AfterViewInit {
    private renderer;
    regularClass: string;
    targetItems: Array<TargetItem>;
    localAnalysis: boolean;
    caseSensitive: boolean;
    currentText: EventEmitter<string>;
    lastInput: ElementRef;
    inputBox: ElementRef;
    private textSubject;
    responsePending: boolean;
    textArray: Array<TargetArrayItem>;
    textHTMLstring: string;
    tempString: string;
    constructor(renderer: Renderer2);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    textChange(e: any): void;
    constructLocally(): void;
    constructExternally(): void;
    focusInput(): void;
    placeCaretAtEnd(el: any): void;
}
