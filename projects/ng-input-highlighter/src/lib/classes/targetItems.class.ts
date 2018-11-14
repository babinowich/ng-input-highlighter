export class TargetItem {

    public text: string
    public css: string
    public location?: [number, number]
    constructor(
        _text: string,
        _css: any,
        _location?: [number, number]
      ) {
        this.text = _text
        this.css = _css
        this.location = _location
      }
}
