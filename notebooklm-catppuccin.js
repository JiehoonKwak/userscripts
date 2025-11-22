// ==UserScript==
// @name         NotebookLM Catppuccin Theme & Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Applies custom font styles, syntax highlighting, and keyboard shortcuts in Google NotebookLM (no background changes)
// @author       Your Name (Based on Jiehoonk's script, HTML analysis, and AI update)
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  // --- Theme Configuration ---
  const config = {
    activeTheme: "deepForest",
    themes: {
      midnightPro: {
        rosewater: "#cdd6f4",
        flamingo: "#f2cdcd",
        pink: "#cba6f7",
        mauve: "#cba6f7",
        red: "#00e5ff",
        maroon: "#2979ff",
        peach: "#40c4ff",
        yellow: "#81d4fa",
        green: "#00e676",
        teal: "#00b0ff",
        sky: "#0091ea",
        sapphire: "#2962ff",
        blue: "#2979ff",
        lavender: "#b4befe",
        text: "#e3f2fd",
        subtext1: "#bac2de",
        subtext0: "#a6adc8",
        overlay2: "#9399b2",
        overlay1: "#7f849c",
        overlay0: "#6c7086",
        surface2: "#1e293b",
        surface1: "#0f172a",
        surface0: "#020617",
        base: "#0f1117",
        mantle: "#0b0d12",
        crust: "#000000",
      },
      obsidian: {
        rosewater: "#f5e0dc",
        flamingo: "#f2cdcd",
        pink: "#f50057",
        mauve: "#d500f9",
        red: "#d500f9",
        maroon: "#c51162",
        peach: "#ff4081",
        yellow: "#f9e2af",
        green: "#69f0ae",
        teal: "#1de9b6",
        sky: "#00b0ff",
        sapphire: "#651fff",
        blue: "#3d5afe",
        lavender: "#b4befe",
        text: "#ffffff",
        subtext1: "#e0e0e0",
        subtext0: "#bdbdbd",
        overlay2: "#9e9e9e",
        overlay1: "#757575",
        overlay0: "#616161",
        surface2: "#212121",
        surface1: "#121212",
        surface0: "#000000",
        base: "#000000",
        mantle: "#000000",
        crust: "#000000",
      },
      deepForest: {
        rosewater: "#f5e0dc",
        flamingo: "#f2cdcd",
        pink: "#f5c2e7",
        mauve: "#cba6f7",
        red: "#00e676",
        maroon: "#00c853",
        peach: "#ffea00",
        yellow: "#ffd600",
        green: "#69f0ae",
        teal: "#1de9b6",
        sky: "#00b0ff",
        sapphire: "#0091ea",
        blue: "#00b0ff",
        lavender: "#b4befe",
        text: "#e8f5e9",
        subtext1: "#c8e6c9",
        subtext0: "#a5d6a7",
        overlay2: "#81c784",
        overlay1: "#66bb6a",
        overlay0: "#4caf50",
        surface2: "#1b5e20",
        surface1: "#0a2f12",
        surface0: "#051b0a",
        base: "#0a110a",
        mantle: "#060b06",
        crust: "#000000",
      },
      catppuccin: {
        rosewater: "#f5e0dc",
        flamingo: "#f2cdcd",
        pink: "#f5c2e7",
        mauve: "#cba6f7",
        red: "#f38ba8",
        maroon: "#eba0ac",
        peach: "#fab387",
        yellow: "#f9e2af",
        green: "#a6e3a1",
        teal: "#94e2d5",
        sky: "#89dceb",
        sapphire: "#74c7ec",
        blue: "#89b4fa",
        lavender: "#b4befe",
        text: "#cdd6f4",
        subtext1: "#bac2de",
        subtext0: "#a6adc8",
        overlay2: "#9399b2",
        overlay1: "#7f849c",
        overlay0: "#6c7086",
        surface2: "#585b70",
        surface1: "#45475a",
        surface0: "#313244",
        base: "#1e1e2e",
        mantle: "#181825",
        crust: "#11111b",
      },
    },
  };
  const t = config.themes[config.activeTheme];

  // --- Style Definitions ---
  const primaryTextColor = t.text;
  const defaultFontFamily = '"SF Pro Rounded", "SF Pro Display", sans-serif'; // Retained for potential future use
  const paragraphFontSize = "16px";
  const headingFontSize = "1.17em";
  const globalLineHeight = "1.6";
  const headingLineHeight = "1.4";
  const codeFontSize = "0.95em";
  const codeLineHeight = "1.5";

  // --- CSS Styles ---
  const css = `
        /* ---- Typography & Font Styling ---- */
        body, #app-root, .notebook-layout {
            font-family: ${defaultFontFamily} !important;
        }

        /* ---- Center Panel Content Styling (Targeting .message-content container) ---- */
        .message-content {
            font-family: ${defaultFontFamily} !important;
        }

        /* Normal Paragraphs */
        .message-content div.paragraph.normal {
            font-size: ${paragraphFontSize} !important;
            line-height: ${globalLineHeight} !important;
            color: ${primaryTextColor} !important;
            margin-bottom: 0.8em !important;
        }
        /* Ensure spans within normal paragraphs also inherit font, if not overridden by bold/italic etc. */
        .message-content div.paragraph.normal span {
             font-family: inherit !important;
        }


        /* Headings (e.g., 'heading1' class) */
        .message-content div.paragraph.heading1 {
            font-size: ${headingFontSize} !important;
            line-height: ${headingLineHeight} !important;
            font-weight: 600 !important;
            color: ${t.red} !important;
            margin-top: 1.2em !important;
            margin-bottom: 0.6em !important;
        }
        /* .message-content div.paragraph.heading2 { ... } */
        /* .message-content div.paragraph.heading3 { ... } */


        /* ---- Markdown-like Styling (Updated based on inspector results) ---- */
        /* Bold text - Target elements with 'bold' class and standard bold tags */
        .message-content span.bold,  /* Primary target from your inspect result for <span class="bold..."> */
        .message-content .bold,      /* More general .bold class target */
        .message-content strong,     /* Standard HTML bold */
        .message-content b {         /* Standard HTML bold */
            color: ${t.red} !important;
            font-weight: bold !important; /* Ensure font-weight is explicitly bold */
        }

        /* Italic text - Target elements with 'italic' class and standard italic tags */
        .message-content span.italic, /* Assuming similar structure to bold for italics, e.g., <span class="italic..."> */
        .message-content .italic,     /* More general .italic class target */
        .message-content em,          /* Standard HTML italic */
        .message-content i {          /* Standard HTML italic */
            color: ${t.peach} !important;
            font-style: italic !important; /* Ensure font-style is explicitly italic */
        }

        /* Inline code */
        .message-content code:not(pre code), .message-content .inline-code {
            color: ${t.teal} !important;
            font-family: monospace !important;
            font-size: ${codeFontSize} !important;
        }

        /* Code blocks */
        .message-content pre, .message-content pre code, .message-content .code-block {
            display: block !important;
            font-size: ${codeFontSize} !important;
            line-height: ${codeLineHeight} !important;
            font-family: monospace !important;
            overflow-x: auto !important;
        }

        /* List items */
        .message-content ul, .message-content ol {
            margin-left: 1.5em !important;
            margin-bottom: 0.8em !important;
        }
        .message-content li {
            font-size: ${paragraphFontSize} !important;
            line-height: ${globalLineHeight} !important;
            color: ${primaryTextColor} !important;
            margin-bottom: 0.5em !important;
            padding-left: 0.5em !important;
        }
        /* Citation Markers */
        .message-content button.citation-marker {
            color: ${t.blue} !important;
            font-size: 0.8em !important;
            font-weight: bold;
        }
    `;

  // --- Apply Typography Styles ---
  const styleElement = document.createElement("style");
  styleElement.id = "notebooklm-catppuccin-typography";
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  console.log("NotebookLM Catppuccin: Typography styles applied.");

  // --- Wait for DOM readiness before adding listeners ---
  function initializeShortcuts() {
    console.log("NotebookLM Catppuccin: DOM ready, adding shortcut listeners.");

    document.addEventListener(
      "keydown",
      function (event) {
        const isModifierPressed = event.metaKey || event.ctrlKey;
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable);

        // Cmd/Ctrl + Shift + S -> Toggle Both Sidebars
        if (
          isModifierPressed &&
          event.shiftKey &&
          event.key.toLowerCase() === "s"
        ) {
          if (isInputFocused) return;
          event.preventDefault();
          event.stopPropagation();
          console.log("Cmd/Ctrl+Shift+S pressed: Toggling sidebars...");

          const leftSidebarButton = document.querySelector(
            'button[aria-label*="Sources"], button.toggle-source-panel-button',
          );
          const rightSidebarButton = document.querySelector(
            'button[aria-label*="Notebook"], button[aria-label*="Studio"], button.toggle-studio-panel-button',
          );

          let clickedLeft = false;
          if (leftSidebarButton) {
            console.log("Found left sidebar toggle:", leftSidebarButton);
            leftSidebarButton.click();
            clickedLeft = true;
          } else {
            console.warn("Left sidebar toggle button not found.");
          }

          setTimeout(
            () => {
              if (rightSidebarButton) {
                console.log("Found right sidebar toggle:", rightSidebarButton);
                rightSidebarButton.click();
              } else {
                console.warn("Right sidebar toggle button not found.");
              }
            },
            clickedLeft ? 50 : 0,
          );
        }

        // Cmd/Ctrl + J -> Go to Home
        if (
          isModifierPressed &&
          !event.shiftKey &&
          event.key.toLowerCase() === "j"
        ) {
          if (isInputFocused && activeElement.tagName !== "BODY") return;
          event.preventDefault();
          event.stopPropagation();
          console.log("Cmd/Ctrl+J pressed: Navigating home...");

          const homeLink = document.querySelector(
            'a[href="/"][aria-label*="NotebookLM home"], div.logo a.logo-link[href="/"]',
          );

          if (homeLink) {
            console.log("Found home link:", homeLink);
            homeLink.click();
          } else {
            console.warn("Home link not found.");
          }
        }
      },
      true,
    );

    console.log("NotebookLM Catppuccin: Shortcut listeners added.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeShortcuts);
  } else {
    initializeShortcuts();
  }

  console.log(
    "NotebookLM Catppuccin: Script initialized with typography styles and shortcuts.",
  );
})();
