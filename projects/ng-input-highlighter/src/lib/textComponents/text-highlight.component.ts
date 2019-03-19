import { Component, Input, ViewChild } from '@angular/core';
import { TextComponent } from './text-block.component';
import { MatMenu } from '@angular/material/menu';

import { MenuItem } from '../classes/menuItem.class'
@Component({
    templateUrl: './text-highlight.component.html'
})
export class HighlightedComponent implements TextComponent {
  @Input() text: string;
  @Input() css: string
  @Input() type = 'None'
  @Input() confidence = null
  @Input() menu: MenuItem
  @Input() data: any;
  selected: string;
  added = false
  // @ViewChild('submenu')
  // set subMenu(value: MatMenu)  {
  //   this.text = value;
  // }


  clickedText(text) {
      console.log('CLICKED:' + text  + ' ', this.text, this.css )
      console.log(this.menu)
    //   this.clickActive = this.clickActive ? false : true
  }

  changedText() {
    console.log('selected replacement:', this.selected)
    if (!this.added) {
    const ogItem = {
      viewValue: this.text,
      value: this.text
    }
    this.menu.replacementOptions.push(ogItem)
    this.added = true
    }
    this.text = this.selected
  }
}
