import { MenuItem } from './menuItem.class'

export class TargetItem {
    public text: string
    public css: string
    public menu?: MenuItem
    public type?: string
    public confidence?: number
    public location?: [number, number]
    constructor(
        _text: string,
        _css: string,
        _menu?: MenuItem,
        _type?: string,
        _confidence?: number,
        _location?: [number, number]
      ) {
        this.text = _text
        this.css = _css
        this.menu = _menu
        this.type = _type
        this.confidence = _confidence
        this.location = _location
      }
}
