export class RangeSlider {
    minVal: number;
    maxVal: number;
    step: number;
    default: number
    id: string;
    key : string;
    enable : boolean;
    constructor(minVal, maxVal, step, def, id, key?,enable?) {
        this.minVal = minVal;
        this.maxVal = maxVal;
        this.step = step;
        this.default = def;
        this.id = id;
        this.key = key;
        this.enable = enable;
    }
}