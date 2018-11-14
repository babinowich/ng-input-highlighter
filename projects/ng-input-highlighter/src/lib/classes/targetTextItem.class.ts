export class TargetArrayItem {

    public entity: string
    public location: [number, number]

    constructor(
        _entity: string,
        _location: [number, number],
      ) {
        this.entity = _entity
        this.location = _location
      }
}
