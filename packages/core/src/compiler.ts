import Pipeline from './pipeline';
import {INode} from './ir/node';

export default class Compiler<IN, OUT> extends Pipeline<IN, INode, OUT> {
}
