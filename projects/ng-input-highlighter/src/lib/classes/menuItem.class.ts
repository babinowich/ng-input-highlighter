import { ReplacementItem } from './replacementItem.class'
// import { ActionBtnItem } from './actionBtnItem.class'

export class MenuItem {
    public type: string
    public css?: string
    // public actionBtns?: Array<ActionBtnItem>
    public descriptionItems?: any
    public replacementOptions?: Array<ReplacementItem>
    constructor(
        _type: string,
        _css: string,
        _descriptionItems?: any,
        _replacementOptions?:  Array<ReplacementItem>
      ) {
        this.type = _type
        this.css = _css
        this.descriptionItems = _descriptionItems
        this.replacementOptions = _replacementOptions
      }
}
