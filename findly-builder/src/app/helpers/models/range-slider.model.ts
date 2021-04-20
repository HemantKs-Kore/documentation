export class RangeSlider {
    minVal: number;
    maxVal: number;
    step: number;
    default: number
    id: string;
    key : string
    constructor(minVal, maxVal, step, def, id, key?) {
        this.minVal = minVal;
        this.maxVal = maxVal;
        this.step = step;
        this.default = def;
        this.id = id;
        this.key = key;
    }
}