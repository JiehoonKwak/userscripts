// ==UserScript==
// @name         AI Studio Catppuccin Theme & Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Applies Catppuccin Mocha theme, custom styles, and keyboard shortcuts in Google AI Studio
// @author       Jiehoonk (Modified from AoT Theme v20.5), AI Assistant (Catppuccin Mocha theme)
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- Catppuccin Mocha Color Palette ---
    const catppuccin = {
        rosewater: "#f5e0dc",
        flamingo: "#f2cdcd",
        pink: "#f5c2e7",    // Used for Italic, Math (Model)
        mauve: "#cba6f7",   // Used for Bold (Model)
        red: "#f38ba8",     // Used for Headings (Model)
        maroon: "#eba0ac",
        peach: "#fab387",   // Used for User Message Italic, User Message Math
        yellow: "#f9e2af",
        green: "#a6e3a1",   // Used for User Message Inline Code Text
        teal: "#94e2d5",    // Used for Inline Code Text (Model)
        sky: "#89dceb",     // Used for User Message Bold
        sapphire: "#74c7ec",
        blue: "#89b4fa",
        lavender: "#b4befe", // Used for System Instruction Header
        text: "#cdd6f4",    // Used for Primary Text, Code Block Text, User Messages
        subtext1: "#bac2de",
        subtext0: "#a6adc8", // Used for Code Block Meta
        overlay2: "#9399b2",
        overlay1: "#7f849c",
        overlay0: "#6c7086",
        surface2: "#585b70",
        surface1: "#45475a", // Used for Inline Code Background (Model)
        surface0: "#313244", // Used for Code Block Border
        base: "#1e1e2e",    // Used for Code Block Background
        mantle: "#181825",  // Used for User Message Inline Code Background
        crust: "#11111b",
    };

    // --- Style Definitions ---
    // Text Colors
    const primaryTextColor = catppuccin.text;
    const userMessageTextColor = catppuccin.text;
    const codeBlockMetaColor = catppuccin.subtext0; // Catppuccin Subtext0

    // Font Variables
    const defaultFontFamily = '"SF Pro Rounded", "SF Pro Display", sans-serif';
    const paragraphFontSize = '16px';
    const headingFontSize = '18px';
    const globalLineHeight = '26px';
    const headingLineHeight = '24px';
    const codeFontSize = '15px';
    const codeLineHeight = '24px';

    // --- CSS Styles ---
    const css = `
        /* Global Font Family */
        body {
            font-family: ${defaultFontFamily} !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Force font on code elements */
        pre, code, ms-code-block pre code {
            font-family: monospace !important; /* Use monospace for code */
        }

        /* Paragraph-level text size & line height */
        p,
        .message-bubble,
        ms-prompt-chunk .text-chunk-content,
        ms-cmark-node > *:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(pre):not(code):not(ul):not(ol):not(blockquote):not(table),
        ms-cmark-node > ul li, ms-cmark-node > ol li,
        ms-cmark-node > blockquote p,
        .mat-mdc-dialog-content,
        .mat-mdc-list-item .mat-mdc-list-item-unscoped-content,
        .mat-mdc-option .mdc-list-item__primary-text,
        .mat-mdc-menu-item .mat-mdc-menu-item-text,
        textarea,
        .system-instruction-panel .mat-expansion-panel-body,
        ms-model-thought .content
        {
            font-size: ${paragraphFontSize} !important;
            line-height: ${globalLineHeight} !important;
        }

        /* Headings size & line height */
        h1, h2, h3, h4, h5, h6,
        .mat-mdc-dialog-title,
        .gmat-title-medium, .gmat-title-large,
        nav.sidenav .nav-section-header,
        .config-panel .setting-section .header,
        .config-panel .mat-expansion-panel-header .mat-expansion-panel-header-title,
        .system-instruction-panel .mat-expansion-panel-header .mat-expansion-panel-header-title,
        ms-model-thought .header
        {
            font-size: ${headingFontSize} !important;
            line-height: ${headingLineHeight} !important;
            font-weight: 600 !important;
        }

        /* Code Blocks size & line height */
        pre, code, ms-code-block pre code {
            font-size: ${codeFontSize} !important;
            line-height: ${codeLineHeight} !important;
        }

        /* Text Colors */
        body {
            color: ${primaryTextColor} !important; /* Catppuccin Text */
        }

        /* User Message Styling */
        ms-chat-turn[aria-label^="User"] *,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk *,
        ms-chat-turn[aria-label^="User"] .text-chunk-content,
        ms-chat-turn[aria-label^="User"] ms-cmark-node,
        ms-chat-turn[aria-label^="User"] ms-cmark-node > *,
        .user-prompt-container .text-chunk
        {
            color: ${userMessageTextColor} !important; /* Catppuccin Text */
        }

        /* Code Block Styling */
        ms-code-block pre {
             background-color: ${catppuccin.base} !important; /* Catppuccin Base */
             border: 1px solid ${catppuccin.surface0} !important; /* Subtle border */
             border-radius: 5px !important;
             padding: 1em !important;
             overflow-x: auto !important;
        }
        ms-code-block pre code {
            color: ${catppuccin.text} !important; /* Catppuccin Text */
            background-color: transparent !important; /* Ensure code inside pre has transparent bg */
            padding: 0 !important;
            border: none !important;
        }

        /* Code Block Metadata */
        ms-action-chip-list span.language-name,
        ms-action-chip-list span.disclaimer,
        div.code-block-footer span {
            color: ${codeBlockMetaColor} !important; /* Catppuccin Subtext0 */
        }

        /* Markdown Styling - Model Responses */
        body ms-cmark-node > h1,
        body ms-cmark-node > h2,
        body ms-cmark-node > h3,
        body ms-cmark-node > h4,
        body ms-cmark-node > h5,
        body ms-cmark-node > h6 {
            color: ${catppuccin.red} !important; /* Catppuccin Red */
        }
        body ms-cmark-node > strong,
        body ms-cmark-node > b {
            color: ${catppuccin.mauve} !important; /* Catppuccin Mauve */
            font-weight: bold !important;
        }
        body ms-cmark-node > em,
        body ms-cmark-node > i {
            color: ${catppuccin.pink} !important; /* Catppuccin Pink */
            font-style: italic !important;
        }
        /* Apply italic color more broadly if needed, but avoid overriding icons */
        body:not(ms-cmark-node):not(.material-symbols-outlined):not(.mat-icon) i,
        body:not(ms-cmark-node):not(.material-symbols-outlined):not(.mat-icon) em {
            color: ${catppuccin.pink} !important; /* Catppuccin Pink */
            font-style: italic !important;
        }
        body ms-cmark-node > span.inline-code.ng-star-inserted {
            color: ${catppuccin.teal} !important; /* Catppuccin Teal */
            background-color: ${catppuccin.surface1} !important; /* Catppuccin Surface1 */
            padding: 0.1em 0.3em !important;
            border-radius: 4px !important;
            border: none !important;
            font-family: monospace !important;
            font-size: 0.95em !important;
        }
        .katex .katex-html,
        .katex .katex-html * {
            color: ${catppuccin.pink} !important; /* Catppuccin Pink */
        }

        /* Markdown Styling - User Messages */
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > strong,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > b {
            color: ${catppuccin.sky} !important; /* Catppuccin Sky */
        }
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > em,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > i {
            color: ${catppuccin.peach} !important; /* Catppuccin Peach */
        }
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > span.inline-code.ng-star-inserted {
            color: ${catppuccin.green} !important; /* Catppuccin Green */
            background-color: ${catppuccin.mantle} !important; /* Catppuccin Mantle */
            border: none !important;
        }
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk .katex .katex-html,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk .katex .katex-html * {
            color: ${catppuccin.peach} !important; /* Catppuccin Peach (matches user italic) */
        }

        /* System Instruction Header */
        .system-instruction-panel .mat-expansion-panel-header h2.gmat-title-medium {
            color: ${catppuccin.lavender} !important; /* Catppuccin Lavender */
        }
    `;

    // Apply Styles
    GM_addStyle(css);
    console.log("AI Studio Catppuccin Theme & Shortcuts: Styles applied.");

    // --- Keyboard Shortcut: Cmd + J for New Chat ---
    function addNewChatShortcut() {
        window.addEventListener('keydown', function(event) {
            // Check for Cmd key (metaKey on Mac/Win) or Ctrl key and 'j' key
            const isModifierPressed = event.metaKey || event.ctrlKey;
            if (isModifierPressed && !event.shiftKey && event.key === 'j') {
                event.preventDefault(); // Prevent default browser action

                // Find the new chat link using its aria-label and href
                // Selector might need adjustment if AI Studio UI changes
                const newChatLink = document.querySelector('a[aria-label="Chat"][href="/prompts/new_chat"], a[aria-label="New chat"][href="/prompts/new_chat"]');

                if (newChatLink) {
                    console.log("Cmd+J pressed: Clicking 'New Chat' link.");
                    newChatLink.click();
                } else {
                    console.warn("Cmd+J pressed: 'New Chat' link not found with current selectors.");
                    // Debugging: Log if the selector fails
                    console.log("Attempted selectors: 'a[aria-label=\"Chat\"][href=\"/prompts/new_chat\"]', 'a[aria-label=\"New chat\"][href=\"/prompts/new_chat\"]'");
                }
            }
        });
        console.log("AI Studio Catppuccin Theme & Shortcuts: Cmd+J shortcut added.");
    }

    // --- Initialization ---
    // Add the shortcut listener after the window loads
    window.addEventListener('load', () => {
        addNewChatShortcut();
        // Add MutationObserver here if dynamic content styling becomes an issue
        console.log("AI Studio Catppuccin Theme & Shortcuts: Initialization complete.");
    });

})();
