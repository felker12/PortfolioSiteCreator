import React, { useEffect, useRef, useState } from "react";

type LoadedFile = {
  name: string;
  type: string;
  size: number;
  content: string; // text or data URL for binary (images)
};

type Props = {
  // If a file is passed in, component will load it automatically.
  file?: File | null;
  // Callback invoked when a file is successfully loaded.
  onLoad?: (loaded: LoadedFile) => void;
  // Accepted mime types (e.g. "image/*,application/json,text/plain")
  accept?: string;
  // Max size in bytes (defaults to 5 MB)
  maxSize?: number;
  // Optional label for the input UI
  label?: string;
};

export default function LoadSubmittedFile({
  file: externalFile = null,
  onLoad,
  accept = "image/*,text/*,application/json",
  maxSize = 5 * 1024 * 1024,
  label = "Choose file to load",
}: Props) {
  const [file, setFile] = useState<File | null>(externalFile);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFile(externalFile);
  }, [externalFile]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      setTextPreview(null);
      setError(null);
      return;
    }

    setError(null);
    setLoading(true);
    const reader = new FileReader();

    const isImage = file.type.startsWith("image/");

    reader.onerror = () => {
      setError("Failed to read file.");
      setLoading(false);
    };

    reader.onload = () => {
      const result = reader.result as string | null;
      if (!result) {
        setError("File is empty or could not be read.");
        setLoading(false);
        return;
      }

      if (isImage) {
        // data URL for preview
        setPreview(result);
        setTextPreview(null);
        onLoad?.({
          name: file.name,
          type: file.type,
          size: file.size,
          content: result,
        });
      } else {
        // text content
        const text = result;
        setTextPreview(text);
        setPreview(null);
        onLoad?.({
          name: file.name,
          type: file.type,
          size: file.size,
          content: text,
        });
      }
      setLoading(false);
    };

    // Choose reading method
    if (isImage) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file, "utf-8");
    }

    // cleanup
    return () => {
      reader.onload = null;
      reader.onerror = null;
    };
  }, [file, onLoad]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    if (f.size > maxSize) {
      setError(`File is too large. Max size is ${Math.round(maxSize / 1024)} KB.`);
      e.currentTarget.value = "";
      return;
    }

    if (accept && accept.length > 0) {
      // Basic accept check (browser normally enforces)
      const accepted = accept
        .split(",")
        .map((s) => s.trim())
        .some((pattern) => {
          if (pattern === "") return false;
          if (pattern.endsWith("/*")) {
            return f.type.startsWith(pattern.replace("/*", ""));
          }
          return f.type === pattern || f.name.toLowerCase().endsWith(pattern);
        });
      if (!accepted) {
        setError("File type not allowed.");
        e.currentTarget.value = "";
        return;
      }
    }

    setFile(f);
  }

  function handleBrowseClick() {
    inputRef.current?.click();
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "Segoe UI, Roboto, system-ui, sans-serif" }}>
      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>

      <div
        onClick={handleBrowseClick}
        style={{
          border: "1px dashed #999",
          padding: 12,
          borderRadius: 6,
          cursor: "pointer",
          background: "#fafafa",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          style={{ display: "none" }}
          data-testid="load-file-input"
        />
        <div style={{ color: "#333" }}>{file ? file.name : "Click to select a file or drag & drop here"}</div>
        <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
          {file && (
            <>
              <span>{Math.round((file.size / 1024) * 100) / 100} KB</span>
              <span style={{ marginLeft: 8 }}>•</span>
              <span style={{ marginLeft: 8 }}>{file.type || "unknown"}</span>
            </>
          )}
        </div>
      </div>

      {loading && <div style={{ marginTop: 10 }}>Loading...</div>}

      {error && (
        <div style={{ marginTop: 10, color: "#a94442", background: "#f2dede", padding: 8, borderRadius: 4 }}>
          {error}
        </div>
      )}

      {preview && (
        <div style={{ marginTop: 12 }}>
          <img src={preview} alt={file?.name} style={{ maxWidth: "100%", borderRadius: 6 }} />
        </div>
      )}

      {textPreview && (
        <div style={{ marginTop: 12 }}>
          <pre
            style={{
              background: "#1e1e1e",
              color: "#dcdcdc",
              padding: 12,
              borderRadius: 6,
              maxHeight: 320,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 13,
            }}
          >
            {textPreview}
          </pre>
        </div>
      )}
    </div>
  );
}