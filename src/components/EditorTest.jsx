import { Editor } from '../components/editor/Editor';
import { useState } from 'react';

export default function EditorTest() {
    const [htmlContent, setHtmlContent] = useState('');

    return (
        <div style={{ padding: '20px' }}>
            <h1>Editor Test Page</h1>
            <p>Test the new heading and font size features:</p>

            <Editor
                htmlContent={htmlContent}
                setHtmlContent={setHtmlContent}
            />

            <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <h3>Current HTML Content:</h3>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
                    {htmlContent || 'No content yet...'}
                </pre>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Instructions to Test:</h3>
                <ul>
                    <li>Use the "Block Type" dropdown to change text to different heading levels (h1-h5)</li>
                    <li>Use the "Font Size" dropdown to change the size of selected text</li>
                    <li>Try combining different heading levels with various formatting options</li>
                    <li>Check that the HTML output reflects your changes</li>
                </ul>
            </div>
        </div>
    );
}
