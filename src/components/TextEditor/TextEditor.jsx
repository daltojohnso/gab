import React from 'react';
import PropTypes from 'prop-types';
import {Editor} from 'slate-react';
import {Value} from 'slate';

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.value = Value.fromJSON({
            document: {
                nodes: [
                    {
                        object: 'block',
                        type: 'paragraph',
                        nodes: [
                            {
                                object: 'text',
                                leaves: [
                                    {
                                        text: 'A line of text in a paragraph.'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        });
    }

    onChange(e) {
        this.setState({
            value: e.value
        });
    }

    render() {
        return (
            <Editor
                value={this.state.value}
                onChange={this.onChange.bind(this)}
            />
        );
    }
}

TextEditor.propTypes = {
}

export default TextEditor;
