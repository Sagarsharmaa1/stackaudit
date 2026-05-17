import { useState, useRef } from "react";
import { parsePackageJson } from "../lib/parsePackageJson";
import { UploadCloud, FileJson, AlertCircle } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function DropZone({ onParsed }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [textMode, setTextMode] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const fileInputRef = useRef(null);

  const handleProcess = (content) => {
    try {
      setError(null);
      const parsed = parsePackageJson(content);
      onParsed(parsed);
    } catch (err) {
      setError(err.message);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => handleProcess(event.target.result);
      reader.readAsText(file);
    }
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => handleProcess(event.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {textMode ? (
        <div className="flex flex-col gap-4">
          <Textarea 
            placeholder="Paste your package.json content here..." 
            className="h-64 font-mono text-sm bg-[var(--bg-surface)] border-[var(--border)] focus:border-[var(--accent)] text-[var(--text-primary)]"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" className="border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]" onClick={() => setTextMode(false)}>Cancel</Button>
            <Button className="bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-dim)]" onClick={() => handleProcess(jsonText)}>Audit Dependencies</Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            dragActive ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border-hover)] bg-[var(--bg-surface)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface)]/80"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={onFileChange}
          />
          <UploadCloud className={`w-16 h-16 mb-4 ${dragActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
          <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Drop package.json here</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">Or click to select a file</p>
          <Button variant="secondary" className="bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--border-hover)]" onClick={(e) => { e.stopPropagation(); setTextMode(true); }}>
            <FileJson className="w-4 h-4 mr-2" />
            Paste raw JSON
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}