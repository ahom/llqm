import {Node} from './node';

export abstract class Value extends Node {
}

export class IntegerValue extends Value {
    constructor(public value: number) {
        super('int_value');
    }
}

export class FloatValue extends Value {
    constructor(public value: number) {
        super('float_value');
    }
}

export class BooleanValue extends Value {
    constructor(public value: boolean) {
        super('bool_value');
    }
}

export class StringValue extends Value {
    constructor(public value: string) {
        super('str_value');
    }
}

export class DateValue extends Value {
    constructor(public value: Date) {
        super('date_value');
    }
}
