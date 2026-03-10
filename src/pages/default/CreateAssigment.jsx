import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";

export default function CreateAssigment() {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize on each change
  useEffect(() => {
    const el = textareaRef.current;
    el.style.height = "auto"; // reset height
    el.style.height = el.scrollHeight + "px"; // grow to fit content
  }, [value]);
  return (
    <>
      <Navbar />
      <div className="route-container">
        <h1
          style={{
            color: "var(--fg)",
            marginBottom: "20px",
            fontSize: "1.8rem",
            letterSpacing: "0.5px",
            fontWeight: "600",
          }}
        >
          Create Assignment
        </h1>

        {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          width: "100%",
          maxWidth: "450px",
        }}
      > */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Write your problem..."
          style={{
            padding: "12px 15px",
            borderRadius: "10px",
            border: "1px solid var(--card-border)",
            background: "var(--bg-secondary)",
            color: "var(--fg)",
            width: "100%",
            fontSize: "1rem",
            resize: "none", // disable manual resize
            overflow: "hidden", // hide scrollbars
            outline: "none",
            transition: "0.2s",
          }}
        />

        <input
          type="submit"
          value="Create"
          style={{
            padding: "12px 15px",
            borderRadius: "10px",
            border: "none",
            background: "var(--accent)",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "0.2s",
          }}
        />
        {/*  */}
      </div>
    </>
  );
}
