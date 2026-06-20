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
  // Hold the Monaco editor instance so we can call its methods imperatively.
  // A ref is used because changing the editor instance should never cause a re-render.
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  // FIX 1: Correct onMount signature — second arg gives us the monaco namespace,
  // needed to call setModelLanguage.
  function handleMount(editor: Monaco.editor.IStandaloneCodeEditor, monaco: typeof Monaco) {
    editorRef.current = editor;

    // FIX 2: Set language to typescriptreact so Monaco gives us TSX syntax
    // highlighting and type checking instead of HTML.
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, 'typescriptreact');
    }
  }

  // FIX 3: Uncontrolled updates via pushEditOperations.
  //
  // Previously: value={code} made Monaco a controlled component — every chunk
  // during streaming caused a full editor re-render, resetting the cursor and
  // lagging badly at ~100 updates/sec.
  //
  // Now: we remove `value` from <Editor /> and update the underlying model
  // imperatively here. pushEditOperations writes the new content as a single
  // undoable edit without resetting the cursor or triggering a React re-render
  // of the Editor component itself.
  useEffect(() => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    // Guard: skip the write if the model already has this content.
    // This avoids a redundant edit on first mount when defaultValue=""
    // and code is also "" (or when the user's own onChange fired last).
    if (model.getValue() === code) return;

    model.pushEditOperations(
      [],
      [{ range: model.getFullModelRange(), text: code }],
      () => null
    );
  }, [code]);

  // When the code tab becomes visible again, Monaco may have stale layout
  // dimensions from when it was hidden (opacity: 0 still has dimensions,
  // but Monaco's internal viewport can get out of sync). Calling layout()
  // forces Monaco to recalculate its viewport grid from its container's
  // current pixel dimensions.
  useEffect(() => {
    if (isVisible && editorRef.current) {
      // Small delay so the browser has time to finish the opacity transition
      // and repaint before Monaco measures its container.
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
        // FIX 4: defaultValue="" makes this uncontrolled — Monaco owns the
        // content; we push updates imperatively via the useEffect above.
        // Do NOT pass `value` here or you re-introduce the controlled-mode lag.
        defaultValue=""
        // FIX 5: defaultLanguage still needed as the initial hint, but
        // handleMount overrides it to typescriptreact immediately after mount.
        defaultLanguage="typescriptreact"
        theme="vs-dark"
        onMount={handleMount}
        onChange={(val) => {
          // Only fire onChange when the user is actually editing (not streaming).
          // During streaming, pushEditOperations triggers this callback too —
          // we suppress it to avoid a feedback loop where EditorPage's setCode
          // fires on every chunk we just wrote ourselves.
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
          // Hide the cursor indicator while streaming — user can't edit anyway.
          cursorStyle: isStreaming ? 'underline' : 'line',
        }}
      />
    </div>
  );
}