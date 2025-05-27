import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';
import { javascript } from '@codemirror/lang-javascript';
import 'codemirror/theme/dracula.css';

interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: 'javascript' | 'python' | 'html' | 'css';
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value = '', 
  onChange, 
  language = 'javascript' 
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;


        // Create extensions array with update listener
        const update = () => {
            if (onChange && viewRef.current) {
                onChange(viewRef.current.state.doc.toString());
            }
        };
        
        const extensions = [
            autocompletion(),
            javascript(),
            EditorView.theme({ theme: 'dracula' as any }),
            EditorView.updateListener.of(update)
        ];
    
    viewRef.current = new EditorView({
      parent: editorRef.current,
      state: EditorState.create({
        doc: value,
        extensions
      })
    });

    return () => {
      viewRef.current?.destroy();
    };
  }, [language, value]);

  useEffect(() => {
    if (!viewRef.current) return;
    
    // Update listener is now part of the extensions array
  }, [onChange]);

  return <div ref={editorRef} className="codemirror-editor h-full w-full" />;
};

export default CodeEditor;
