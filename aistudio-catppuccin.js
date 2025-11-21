// ==UserScript==
// @name         AI Studio Catppuccin Theme & Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Applies Midnight Pro theme (and others), custom styles, and keyboard shortcuts in Google AI Studio
// @author       Jiehoonk (Modified from AoT Theme v20.5), AI Assistant (Refactored)
// @match        https://aistudio.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // --- Theme Configuration ---
    const config = {
        activeTheme: 'midnightPro',
        themes: {
            midnightPro: {
                rosewater: "#cdd6f4", flamingo: "#f2cdcd", pink: "#cba6f7", mauve: "#cba6f7",
                red: "#00e5ff", maroon: "#2979ff", peach: "#40c4ff", yellow: "#81d4fa",
                green: "#00e676", teal: "#00b0ff", sky: "#0091ea", sapphire: "#2962ff",
                blue: "#2979ff", lavender: "#b4befe", text: "#e3f2fd", subtext1: "#bac2de",
                subtext0: "#a6adc8", overlay2: "#9399b2", overlay1: "#7f849c", overlay0: "#6c7086",
                surface2: "#1e293b", surface1: "#0f172a", surface0: "#020617", base: "#0f1117",
                mantle: "#0b0d12", crust: "#000000",
            },
            obsidian: {
                rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f50057", mauve: "#d500f9",
                red: "#d500f9", maroon: "#c51162", peach: "#ff4081", yellow: "#f9e2af",
                green: "#69f0ae", teal: "#1de9b6", sky: "#00b0ff", sapphire: "#651fff",
                blue: "#3d5afe", lavender: "#b4befe", text: "#ffffff", subtext1: "#e0e0e0",
                subtext0: "#bdbdbd", overlay2: "#9e9e9e", overlay1: "#757575", overlay0: "#616161",
                surface2: "#212121", surface1: "#121212", surface0: "#000000", base: "#000000",
                mantle: "#000000", crust: "#000000",
            },
            deepForest: {
                rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
                red: "#00e676", maroon: "#00c853", peach: "#ffea00", yellow: "#ffd600",
                green: "#69f0ae", teal: "#1de9b6", sky: "#00b0ff", sapphire: "#0091ea",
                blue: "#00b0ff", lavender: "#b4befe", text: "#e8f5e9", subtext1: "#c8e6c9",
                subtext0: "#a5d6a7", overlay2: "#81c784", overlay1: "#66bb6a", overlay0: "#4caf50",
                surface2: "#1b5e20", surface1: "#0a2f12", surface0: "#051b0a", base: "#0a110a",
                mantle: "#060b06", crust: "#000000",
            },
            catppuccin: {
                rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
                red: "#f38ba8", maroon: "#eba0ac", peach: "#fab387", yellow: "#f9e2af",
                green: "#a6e3a1", teal: "#94e2d5", sky: "#89dceb", sapphire: "#74c7ec",
                blue: "#89b4fa", lavender: "#b4befe", text: "#cdd6f4", subtext1: "#bac2de",
                subtext0: "#a6adc8", overlay2: "#9399b2", overlay1: "#7f849c", overlay0: "#6c7086",
                surface2: "#585b70", surface1: "#45475a", surface0: "#313244", base: "#1e1e2e",
                mantle: "#181825", crust: "#11111b",
            }
        }
    };
    const t = config.themes[config.activeTheme];

    // --- Style Definitions ---
    // Text Colors
    const primaryTextColor = t.text;
    const userMessageTextColor = t.text;
    const codeBlockMetaColor = t.subtext0;

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

        /* Scoped Paragraph-level text size & line height */
        main p,
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

        /* Text Colors - Scoped to Main where possible */
        body {
            color: ${primaryTextColor} !important;
        }
        
        /* Main content background to avoid sidebar bleed */
        main, ms-main, .main-content {
            background-color: ${t.base} !important;
        }

        /* User Message Styling */
        ms-chat-turn[aria-label^="User"] *,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk *,
        ms-chat-turn[aria-label^="User"] .text-chunk-content,
        ms-chat-turn[aria-label^="User"] ms-cmark-node,
        ms-chat-turn[aria-label^="User"] ms-cmark-node > *,
        .user-prompt-container .text-chunk
        {
            color: ${userMessageTextColor} !important;
        }

        /* Code Block Styling */
        ms-code-block pre {
             background-color: ${t.base} !important;
             border: 1px solid ${t.surface0} !important;
             border-radius: 5px !important;
             padding: 1em !important;
             overflow-x: auto !important;
        }
        ms-code-block pre code {
            color: ${t.text} !important;
            background-color: transparent !important;
            padding: 0 !important;
            border: none !important;
        }

        /* Code Block Metadata */
        ms-action-chip-list span.language-name,
        ms-action-chip-list span.disclaimer,
        div.code-block-footer span {
            color: ${codeBlockMetaColor} !important;
        }

        /* Markdown Styling - Model Responses */
        body ms-cmark-node > h1,
        body ms-cmark-node > h2,
        body ms-cmark-node > h3,
        body ms-cmark-node > h4,
        body ms-cmark-node > h5,
        body ms-cmark-node > h6 {
            color: ${t.red} !important;
        }
        body ms-cmark-node > strong,
        body ms-cmark-node > b {
            color: ${t.red} !important;
            font-weight: bold !important;
        }
        body ms-cmark-node > em,
        body ms-cmark-node > i {
            color: ${t.peach} !important;
            font-style: italic !important;
        }
        /* Apply italic color more broadly if needed, but avoid overriding icons */
        body:not(ms-cmark-node):not(.material-symbols-outlined):not(.mat-icon) i,
        body:not(ms-cmark-node):not(.material-symbols-outlined):not(.mat-icon) em {
            color: ${t.peach} !important;
            font-style: italic !important;
        }
        body ms-cmark-node > span.inline-code.ng-star-inserted {
            color: ${t.teal} !important;
            background-color: ${t.surface1} !important;
            padding: 0.1em 0.3em !important;
            border-radius: 4px !important;
            border: none !important;
            font-family: monospace !important;
            font-size: 0.95em !important;
        }
        .katex .katex-html,
        .katex .katex-html * {
            color: ${t.peach} !important;
        }

        /* Markdown Styling - User Messages */
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > strong,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > b {
            color: ${t.sky} !important;
        }
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > em,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > i {
            color: ${t.peach} !important;
        }
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk ms-cmark-node > span.inline-code.ng-star-inserted {
            color: ${t.green} !important;
            background-color: ${t.mantle} !important;
            border: none !important;
        }
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk .katex .katex-html,
        ms-chat-turn[aria-label^="User"] ms-prompt-chunk .katex .katex-html * {
            color: ${t.peach} !important;
        }

        /* System Instruction Header */
        .system-instruction-panel .mat-expansion-panel-header h2.gmat-title-medium {
            color: ${t.lavender} !important;
        }
    `;

    // Apply Styles
    GM_addStyle(css);
    console.log("AI Studio Catppuccin Theme & Shortcuts: Styles applied.");

    // --- Keyboard Shortcut: Cmd + J for New Chat ---
    function addNewChatShortcut() {
        window.addEventListener('keydown', function (event) {
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
