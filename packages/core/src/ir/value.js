export const STR = "string";
export const NUM = "number";
export const BOOL = "boolean";
export const DATE = "date";
export const ARR = "array";
export const OBJ = "object";

class Value {
    constructor(val) {
        this.type = OBJ;
        switch (typeof val) {
            case STR:
                this.type = STR;
                break;
            case NUM:
                this,type = NUM;
                break;
            case BOOL:
                this.type = BOOL;
                break;
            default:
                if (Array.isArray(val)) {
                    this.type = ARR;
                } else if (val instanceof Date) {
                    this.type = DATE;
                }
                break;
        }
        this.value = val;
    }
}

export default function(value) {
    return new Value(value);
}
