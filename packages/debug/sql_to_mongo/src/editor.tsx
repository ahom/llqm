import * as React from 'react';
import * as CodeMirror from 'codemirror';

export interface Props {
    onChange? : (input : string) => void
}

export default class Editor extends React.Component<Props, void> {
    private _textarea : HTMLTextAreaElement;
    private _codemirror : CodeMirror.EditorFromTextArea;
    constructor(props : Props) {
        super(props);
    }
    componentDidMount() {
        this._codemirror = CodeMirror.fromTextArea(this._textarea, {
            lineNumbers: true,
            theme: 'base16-dark'
        });
        this._codemirror.on('change', this.onChanges.bind(this));
    }
    onChanges(instance : CodeMirror.Editor) {
        this.props.onChange && this.props.onChange(instance.getDoc().getValue());
    }
    render() {
        return <textarea ref={(ref) => this._textarea = ref}></textarea>;
    }
}
