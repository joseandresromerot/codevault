"use client"

import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { oneDark } from "@codemirror/theme-one-dark"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { rust } from "@codemirror/lang-rust"
import { go } from "@codemirror/lang-go"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { sql } from "@codemirror/lang-sql"

const getLanguageExtension = (lang: string) => {
  switch (lang.toLowerCase()) {
    case "javascript": return javascript()
    case "typescript": return javascript({ typescript: true })
    case "python": return python()
    case "rust": return rust()
    case "go": return go()
    case "css": return css()
    case "html": return html()
    case "sql": return sql()
    default: return javascript()
  }
}

type CodeEditorProps = {
  value: string
  language: string
  onChange: (value: string) => void
  minHeight?: string
}

export const CodeEditor = ({ value, language, onChange, minHeight = "300px" }: CodeEditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          oneDark,
          getLanguageExtension(language),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChange(update.state.doc.toString())
          }),
          EditorView.theme({
            "&": { minHeight, borderRadius: "0.5rem" },
            ".cm-scroller": { fontFamily: "var(--font-geist-mono), monospace" },
          }),
        ],
      }),
      parent: containerRef.current,
    })

    viewRef.current = view
    return () => view.destroy()
  }, [language]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current !== value) {
      view.dispatch({ changes: { from: 0, to: current.length, insert: value } })
    }
  }, [value])

  return <div ref={containerRef} className="rounded-lg overflow-hidden border border-zinc-700" />
}
