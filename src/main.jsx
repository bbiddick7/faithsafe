import React from "react";
import ReactDOM from "react-dom/client";
import ReligiousHarmReflectionTool from "./ReligiousHarmReflectionTool.jsx";

function PrivacyFooter() {
  return (
    <footer
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "0 clamp(16px,5vw,40px) 56px",
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 12.5,
        lineHeight: 1.7,
        color: "#6a6256",
      }}
    >
      <hr style={{ border: "none", borderTop: "1px solid #d8cdb9", margin: "0 0 18px" }} />
      <p style={{ margin: "0 0 8px" }}>
        <strong style={{ color: "#2b2620" }}>Your privacy.</strong> Your answers are processed
        entirely in your own browser. This tool does not collect, store, or transmit anything
        you enter — there is no account, no database, and no tracking of your responses. If you
        close or refresh the page, your answers are gone.
      </p>
      <p style={{ margin: "0 0 8px" }}>
        Like most websites, the company that hosts this page may keep basic, anonymous access
        logs (such as approximate region and browser type). If you want to minimize even that,
        you can use a private/incognito window.
      </p>
      <p style={{ margin: 0 }}>
        This tool is for personal reflection and education only. It is not medical,
        psychological, or legal advice, and it cannot diagnose anyone or any organization. If
        you are in distress, please reach out to one of the support resources listed in your
        results, or to someone you trust.
      </p>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReligiousHarmReflectionTool />
    <PrivacyFooter />
  </React.StrictMode>
);
