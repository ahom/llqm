export interface ILocation {
    line: number,
    col: number,
    offset: number
}

export interface ILocationRange {
    start: ILocation,
    end: ILocation
}
