import Editor from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import type * as Monaco from 'monaco-editor';

interface CodeEditorProps {
  code: string;
  isStreaming: boolean;
  isVisible?: boolean;
  onChange?: (value: string) => void;
}

export default function CodeEditor({ code, isStreaming, isVisible = true, onChange }: CodeEditorProps) {

  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  function handleMount(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    editorRef.current = editor;

    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, 'typescriptreact');
    }
  }


  useEffect(() => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;


    if (model.getValue() === code) return;

    model.pushEditOperations(
      [],
      [{ range: model.getFullModelRange(), text: code }],
      () => null
    );
  }, [code]);

  useEffect(() => {
    if (isVisible && editorRef.current) {
      const timer = setTimeout(() => {
        editorRef.current?.layout();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        defaultValue=""
        defaultLanguage="typescriptreact"
        theme="vs-dark"
        onMount={handleMount}
        onChange={(val) => {
          if (!isStreaming) onChange?.(val ?? '');
        }}
        options={{
          // Read-only while the AI is writing — becomes editable once done.
          readOnly: isStreaming,
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorStyle: isStreaming ? 'underline' : 'line',
        }}
      />
    </div>
  );
}