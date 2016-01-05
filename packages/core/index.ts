export {default as Compiler} from './src/compiler';
export {default as Pipeline} from './src/pipeline';
export {Pass, IDebugResult} from './src/pass';

import * as schema from './src/schema';
import * as ir from './src/ir/index';
export {schema, ir};
