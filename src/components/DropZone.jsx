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
            className="h-64 font-mono text-sm bg-[#0F0F0F] border-[#1E1E1E] focus:border-[#FF6B35] text-[#FAFAFA]"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" className="border-[#1E1E1E] text-[#FAFAFA] hover:bg-[#1E1E1E]" onClick={() => setTextMode(false)}>Cancel</Button>
            <Button className="bg-[#FF6B35] text-[#080808] hover:bg-[#FF6B35]/90" onClick={() => handleProcess(jsonText)}>Audit Dependencies</Button>
          </div>
        </div>
      ) : (
        <div
          className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            dragActive ? "border-[#FF6B35] bg-[#FF6B35]/10" : "border-[#1E1E1E] bg-[#0F0F0F] hover:border-[#FF6B35]/50 hover:bg-[#0F0F0F]/80"
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
          <UploadCloud className={`w-16 h-16 mb-4 ${dragActive ? "text-[#FF6B35]" : "text-[#525252]"}`} />
          <h3 className="text-xl font-bold mb-2 text-[#FAFAFA]">Drop package.json here</h3>
          <p className="text-sm text-[#525252] mb-6">Or click to select a file</p>
          <Button variant="secondary" className="bg-[#1E1E1E] text-[#FAFAFA] hover:bg-[#2E2E2E]" onClick={(e) => { e.stopPropagation(); setTextMode(true); }}>
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