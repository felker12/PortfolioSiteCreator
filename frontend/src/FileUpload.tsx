import React, { useEffect, useRef, useState } from "react";

type FileEntry = {
  id: string;
  file: File;
  previewUrl?: string;
  progress: number;
  status: "ready" | "uploading" | "done" | "error";
  errorMessage?: string;
};

type Props = {
  uploadUrl?: string; // If provided, component can upload files to this endpoint (POST multipart/form-data with field "file")
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  onFilesSelected?: (files: File[]) => void;
  showPreview?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function FileUpload({
  uploadUrl,
  multiple = true,
  accept,
  maxSizeMB = 10,
  onFilesSelected,
  showPreview = true,
  className,
  style,
}: Props) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      // revoke object URLs when unmounting
      entries.forEach((e) => {
        if (e.previewUrl) URL.revokeObjectURL(e.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOpenFileDialog() {
    inputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    handleFiles(e.target.files);
    e.currentTarget.value = ""; // reset to allow same-file re-select
  }

  function handleFiles(fileList: FileList) {
    const accepted: FileEntry[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (accept && !file.type && accept.includes(".") && !file.name.match(new RegExp(accept.split(",").join("|").replace(/\./g, "\\."), "i"))) {
        // best effort filename match for extensions
        errors.push(`${file.name}: not an accepted file type`);
        return;
      }

      if (accept && file.type && !accept.split(",").map((s) => s.trim()).some((a) => a === file.type || a === `${file.type.split("/")[0]}/*` || a === file.type)) {
        // fallback: if accept provided and file.type not obviously matched, still allow (some browsers give empty type)
        // don't reject aggressively here
      }

      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        errors.push(`${file.name}: exceeds maximum size of ${maxSizeMB} MB`);
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const previewUrl = showPreview && file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      accepted.push({
        id,
        file,
        previewUrl,
        progress: 0,
        status: "ready",
      });
    });

    if (accepted.length === 0 && errors.length) {
      // simple console warning - host app can show UI as needed
      console.warn("FileUpload: files rejected", errors);
    }

    if (accepted.length) {
      setEntries((prev) => {
        const next = multiple ? [...prev, ...accepted] : [...accepted];
        // notify parent
        onFilesSelected?.(next.map((e) => e.file));
        return next;
      });

      if (uploadUrl) {
        // start uploading accepted files
        accepted.forEach((entry) => uploadEntry(entry));
      }
    }
  }

  function uploadEntry(entry: FileEntry) {
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "uploading", progress: 0 } : e)));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl || "", true);

    xhr.upload.onprogress = function (ev) {
      if (ev.lengthComputable) {
        const percent = Math.round((ev.loaded / ev.total) * 100);
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, progress: percent } : e)));
      }
    };

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, progress: 100, status: "done" } : e)));
      } else {
        setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "error", errorMessage: `Upload failed: ${xhr.status}` } : e)));
      }
    };

    xhr.onerror = function () {
      setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, status: "error", errorMessage: "Network error" } : e)));
    };

    const form = new FormData();
    form.append("file", entry.file, entry.file.name);
    xhr.send(form);
  }

  function removeEntry(id: string) {
    setEntries((prev) => {
      const next = prev.filter((e) => {
        if (e.id === id && e.previewUrl) URL.revokeObjectURL(e.previewUrl);
        return e.id !== id;
      });
      onFilesSelected?.(next.map((e) => e.file));
      return next;
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  return (
    <div className={className} style={{ fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif", ...style }}>
      <div
        onClick={handleOpenFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpenFileDialog();
        }}
        style={{
          border: "2px dashed #c7c7c7",
          borderRadius: 8,
          padding: 20,
          textAlign: "center",
          background: isDragging ? "#fafafa" : "transparent",
          cursor: "pointer",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          style={{ display: "none" }}
          onChange={handleInputChange}
        />
        <div style={{ fontSize: 14, color: "#333" }}>
          <strong>Click to select files</strong>
          <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
            or drag & drop files here
            <div style={{ marginTop: 4 }}>{accept ? `Accepted: ${accept}` : `Max size: ${maxSizeMB} MB`}</div>
          </div>
        </div>
      </div>

      {entries.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {entries.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #eee",
                marginBottom: 8,
              }}
            >
              {showPreview && e.previewUrl ? (
                <img src={e.previewUrl} alt={e.file.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 4 }} />
              ) : (
                <div
                  style={{
                    width: 64,
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f4f4f4",
                    borderRadius: 4,
                    color: "#666",
                    fontSize: 12,
                  }}
                >
                  {e.file.type?.split("/")[0] || "file"}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.file.name}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>{formatBytes(e.file.size)}</div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${e.progress}%`, height: "100%", background: e.status === "error" ? "#e55353" : "#3b82f6", transition: "width 200ms linear" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 12, color: "#666" }}>
                    <div>{e.status === "uploading" ? `Uploading (${e.progress}%)` : e.status === "done" ? "Uploaded" : e.status === "error" ? e.errorMessage || "Error" : "Ready"}</div>
                    <div>
                      {e.status === "ready" && uploadUrl && (
                        <button
                          onClick={() => uploadEntry(e)}
                          style={{
                            background: "#0b5fff",
                            color: "white",
                            border: "none",
                            padding: "4px 8px",
                            borderRadius: 4,
                            cursor: "pointer",
                            marginRight: 8,
                          }}
                        >
                          Upload
                        </button>
                      )}
                      <button
                        onClick={() => removeEntry(e.id)}
                        style={{
                          background: "transparent",
                          border: "1px solid #ddd",
                          padding: "4px 8px",
                          borderRadius: 4,
                          cursor: "pointer",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}