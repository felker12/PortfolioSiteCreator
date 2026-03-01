import React, { useEffect, useState } from "react";

export interface FileNameProps {
  value?: string;
  onChange?: (name: string) => void;
  placeholder?: string;
  required?: boolean;
  // Allowed filename pattern (defaults to Windows-safe filename characters)
  allowedPattern?: RegExp;
  className?: string;
  id?: string;
}

/**
 * FileName
 *
 * Small controlled/uncontrolled input component that validates a filename.
 * - Prevents characters that are invalid in common filesystems: \ / : * ? " < > |
 * - Exposes a simple onChange callback with the sanitized value.
 */
const FileName: React.FC<FileNameProps> = ({
  value,
  onChange,
  placeholder = "Enter file name",
  required = false,
  allowedPattern = /^[^\\\/:\*\?"<>\|]+$/,
  className,
  id,
}) => {
  const [internal, setInternal] = useState<string>(value ?? "");
  const [error, setError] = useState<string | null>(null);

  // Keep internal state in sync if value prop changes (controlled usage)
  useEffect(() => {
    if (typeof value === "string") {
      setInternal(value);
      validate(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function validate(name: string) {
    if (required && name.trim().length === 0) {
      setError("File name is required.");
      return false;
    }
    if (!allowedPattern.test(name)) {
      setError('Invalid characters in file name. Avoid \\ / : * ? " < > |');
      return false;
    }
    setError(null);
    return true;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    // Update internal state for uncontrolled usage
    if (value === undefined) {
      setInternal(next);
    }
    validate(next);
    onChange?.(next);
  }

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id ?? "filename-input"} style={{ fontSize: 12, color: "#333" }}>
        File name
      </label>
      <input
        id={id ?? "filename-input"}
        type="text"
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id ?? "filename-input"}-error` : undefined}
        style={{
          padding: "8px 10px",
          border: error ? "1px solid #e03e2d" : "1px solid #ccc",
          borderRadius: 4,
          fontSize: 14,
        }}
      />
      {error ? (
        <div id={`${id ?? "filename-input"}-error`} role="alert" style={{ color: "#e03e2d", fontSize: 12 }}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default FileName;