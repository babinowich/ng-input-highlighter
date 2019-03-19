import { Component, Input } from '@angular/core';
import { TextComponent } from './text-block.component';
import { MenuItem } from '../classes/menuItem.class'

@Component({
    templateUrl: './text-regular.component.html'
})
export class RegularComponent implements TextComponent {
  @Input() text: string;
  @Input() css: string
  @Input() type = 'None'
  @Input() confidence = null
  @Input() menu: MenuItem;
  @Input() data: any;

}
