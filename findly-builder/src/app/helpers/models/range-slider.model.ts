export class RangeSlider {
    minVal: number;
    maxVal: number;
    step: number;
    default: number
    id: string;
    constructor(minVal, maxVal, step, def, id) {
        this.minVal = minVal;
        this.maxVal = maxVal;
        this.step = step;
        this.default = def;
        this.id = id;
    }   
}