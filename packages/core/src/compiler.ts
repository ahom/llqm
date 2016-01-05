import Pipeline from './pipeline';
import {Node} from './ir/node';

export default class Compiler<IN, OUT> extends Pipeline<IN, Node, OUT> {
}

