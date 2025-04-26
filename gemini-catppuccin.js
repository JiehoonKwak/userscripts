// ==UserScript==
// @name         Gemini Catppuccin Theme & Shortcuts (No Code Block Styling v2)
// @namespace    http://tampermonkey.net/
// @version      1.5 // Incremented version
// @description  Applies Catppuccin Mocha theme, custom styles (excluding code blocks), and keyboard shortcuts in Google Gemini. Corrected version.
// @author       Jiehoonk (Modified for Gemini, Shortcuts, Catppuccin Mocha theme, No Code Block Styling)
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start // Keep this to inject CSS early
// ==/UserScript==

(function() {
    'use strict';

    // --- Catppuccin Mocha Color Palette ---
    // [Palette remains exactly as in your original script]
    const catppuccin = {
        rosewater: "#f5e0dc",
        flamingo: "#f2cdcd",
        pink: "#f5c2e7",    // Used for Italic, Math
        mauve: "#cba6f7",   // Used for Bold
        red: "#f38ba8",     // Used for Headings
        maroon: "#eba0ac",
        peach: "#fab387",   // Used for User Message Italic
        yellow: "#f9e2af",
        green: "#a6e3a1",   // Used for User Message Inline Code Text
        teal: "#94e2d5",    // Used for Inline Code Text
        sky: "#89dceb",     // Used for User Message Bold
        sapphire: "#74c7ec",
        blue: "#89b4fa",
        lavender: "#b4befe",
        text: "#cdd6f4",    // Used for Primary Text, User Messages
        subtext1: "#bac2de",
        subtext0: "#a6adc8",
        overlay2: "#9399b2",
        overlay1: "#7f849c",
        overlay0: "#6c7086",
        surface2: "#585b70",
        surface1: "#45475a", // Used for Inline Code Background
        surface0: "#313244", // Originally used for Code Block Border
        base: "#1e1e2e",     // Originally used for Code Block Background
        mantle: "#181825",   // Used for User Message Inline Code Background
        crust: "#11111b",
    };


    // --- Style Definitions ---
    // [Definitions remain exactly as in your original script]
    const primaryTextColor = catppuccin.text;
    const userMessageTextColor = catppuccin.text;
    const defaultFontFamily = '"SF Pro Rounded", "SF Pro Display", sans-serif';
    const paragraphFontSize = '16px';
    const headingFontSize = '18px';
    const globalLineHeight = '26px';
    const headingLineHeight = '24px';
    // Note: codeFontSize and codeLineHeight are effectively unused now for blocks
    const codeFontSize = '15px'; // Kept variable definition for potential future use if needed elsewhere
    const codeLineHeight = '24px'; // Kept variable definition

    // --- CSS Styles ---
    // [CSS remains exactly as in your original script, EXCEPT the code block rule is DELETED]
    const css = `
        /* ---- Core Font Settings ---- */
        body, div, p, span, textarea, input, button {
            font-family: ${defaultFontFamily}, sans-serif !important; /* Added generic fallback */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        pre, code, code *, .code-block *, .font-mono { /* Added .font-mono as Gemini might use utility classes */
            font-family: monospace !important; /* Use standard monospace for code */
        }

        /* ---- General Text Styling ---- */
        p, div[role="paragraph"], .message-content, .prose,
        .message-body-content, .prose p, .message-text,
        [data-testid="message-content"] {
            font-size: ${paragraphFontSize} !important;
            line-height: ${globalLineHeight} !important;
            color: ${primaryTextColor} !important;
        }

        h1, h2, h3, h4, h5, h6, [role="heading"], .heading, .headline, div[data-heading="true"] {
            font-size: ${headingFontSize} !important;
            line-height: ${headingLineHeight} !important;
            font-weight: 600 !important;
            color: ${catppuccin.red} !important;
        }

        /* ---- Markdown Styling ---- */
        strong, b, [data-testid="text-bold"], [data-formatting="bold"], .bold, .font-bold, .font-weight-bold,
        span[style*="font-weight: bold"], span[style*="font-weight:bold"],
        span[style*="font-weight: 700"], span[style*="font-weight:700"] {
            color: ${catppuccin.mauve} !important;
            font-weight: bold !important;
        }

        em, i, [data-testid="text-italic"], [data-formatting="italic"], .italic, .font-italic,
        span[style*="font-style: italic"], span[style*="font-style:italic"] {
            color: ${catppuccin.pink} !important;
            font-style: italic !important;
        }

        /* Inline code (Model) */
        :not(.user-message) > code:not(pre code), /* Be more specific to avoid user message code */
        code:not(pre code):not([class*="user-message"] code), /* Another attempt at specificity */
        [data-testid="text-code-inline"], [data-formatting="code"], .inline-code {
            color: ${catppuccin.teal} !important;
            background-color: ${catppuccin.surface1} !important;
            padding: 0.1em 0.3em !important;
            border-radius: 4px !important;
            border: none !important;
            font-family: monospace !important;
            font-size: 0.95em !important;
        }

        /* ---- THIS ENTIRE RULE BLOCK FOR CODE BLOCKS IS DELETED ---- */
        /*
        pre, pre code, .code-block, [data-testid="code-block"], div[class*="code-block"], div[role="code"] {
           // STYLES REMOVED
        }
        */
        /* ---- END OF DELETED BLOCK ---- */


        /* Math expressions */
        .katex, .katex *, [data-testid="math-inline"], [data-testid="math-block"], [class*="math-"] {
            color: ${catppuccin.pink} !important;
        }

        /* ---- User Message Styling ---- */
        [data-testid="user-message"], [role="user-message"], .user-message,
        div[class*="user-message"], div[class*="human-message"], div[class*="query-message"] {
            color: ${userMessageTextColor} !important;
        }

        /* User message specific markdown - Using descendant combinator */
        .user-message strong, .user-message b,
        div[class*="user-message"] strong, div[class*="user-message"] b,
        div[class*="human-message"] strong, div[class*="human-message"] b,
        [data-testid="user-message"] strong, [data-testid="user-message"] b {
            color: ${catppuccin.sky} !important;
        }

        .user-message em, .user-message i,
        div[class*="user-message"] em, div[class*="user-message"] i,
        div[class*="human-message"] em, div[class*="human-message"] i,
         [data-testid="user-message"] em, [data-testid="user-message"] i {
            color: ${catppuccin.peach} !important;
        }

        /* User message inline code */
        .user-message code:not(pre code),
        div[class*="user-message"] code:not(pre code),
        div[class*="human-message"] code:not(pre code),
        [data-testid="user-message"] code:not(pre code) {
            color: ${catppuccin.green} !important;
            background-color: ${catppuccin.mantle} !important;
            padding: 0.1em 0.3em !important; /* Ensure padding is consistent */
            border-radius: 4px !important;   /* Ensure border-radius is consistent */
            border: none !important;
            font-family: monospace !important;
            font-size: 0.95em !important;
        }
    `;

    // Inject styles immediately
    GM_addStyle(css);
    console.log("Gemini Catppuccin (No Code Block Styling v2): Styles injected.");

    // --- Wait for DOM readiness before adding listeners ---
    // [This section remains exactly as in your original script]
    function initializeShortcuts() {
        console.log("Gemini Catppuccin (No Code Block Styling v2): DOM ready, adding shortcut listeners.");

        document.addEventListener('keydown', function(event) {
            // Ignore keydowns if focused in input/textarea fields to avoid conflicts
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);

            if (isInputFocused) {
                // Allow default browser behavior (like Cmd+J for downloads) if in an input
                 // Exception: If we specifically want a shortcut *in* an input, handle it here.
                 // For now, we assume Cmd+J and Cmd+Shift+S are global actions.
                 // Check if the specific shortcut target IS an input, if necessary.
                // return; // Let's allow global shortcuts for now, but be mindful
            }

            const isModifierPressed = event.metaKey || event.ctrlKey;

            // Cmd/Ctrl + J for New Chat
            if (isModifierPressed && !event.shiftKey && event.key.toLowerCase() === 'j') {
                 // Check if focus is specifically in the main prompt input - if so, maybe don't trigger?
                 const promptTextArea = document.querySelector('rich-textarea > div[contenteditable="true"]'); // Adjust selector if needed
                 if (document.activeElement === promptTextArea) {
                     console.log('Cmd/Ctrl+J pressed in prompt - ignoring for New Chat');
                     return; // Don't steal Cmd+J if user might be doing something else in the input
                 }

                event.preventDefault();
                event.stopPropagation(); // Prevent event from bubbling further

                // Use a potentially more stable selector if available
                const newChatButton = document.querySelector('button[aria-label*="New chat"], [data-test-id="new-chat-button"] button'); // Look for aria-label first

                if (newChatButton && !newChatButton.disabled) {
                    console.log('Cmd/Ctrl+J pressed: Clicking New Chat button.');
                    newChatButton.click();
                } else {
                    console.warn('Cmd/Ctrl+J pressed: New Chat button not found or disabled. Selector used:', 'button[aria-label*="New chat"], [data-test-id="new-chat-button"] button');
                    // Attempt fallback selector if needed
                    const fallbackButton = document.querySelector('[data-test-id="new-chat-button"] button');
                     if (fallbackButton && !fallbackButton.disabled) {
                         console.log('Cmd/Ctrl+J pressed: Clicking New Chat button (fallback selector).');
                         fallbackButton.click();
                    } else {
                         console.warn('Cmd/Ctrl+J pressed: Fallback New Chat button not found or disabled.');
                    }
                }
            }

            // Cmd/Ctrl + Shift + S for Toggle Sidebar
            if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === 's') {
                 event.preventDefault();
                 event.stopPropagation();

                 // Use a potentially more stable selector
                 const sidebarToggleButton = document.querySelector('button[aria-label*="menu"], [data-test-id="side-nav-menu-button"]'); // Check for aria-label first

                 if (sidebarToggleButton) {
                     console.log('Cmd/Ctrl+Shift+S pressed: Clicking Sidebar Toggle button.');
                     sidebarToggleButton.click();
                 } else {
                     console.warn('Cmd/Ctrl+Shift+S pressed: Sidebar Toggle button not found. Selector used:', 'button[aria-label*="menu"], [data-test-id="side-nav-menu-button"]');
                     // Attempt fallback selector if needed
                     const fallbackButton = document.querySelector('[data-test-id="side-nav-menu-button"]');
                      if (fallbackButton) {
                          console.log('Cmd/Ctrl+Shift+S pressed: Clicking Sidebar Toggle button (fallback selector).');
                          fallbackButton.click();
                     } else {
                          console.warn('Cmd/Ctrl+Shift+S pressed: Fallback Sidebar Toggle button not found.');
                     }
                 }
            }
        }, true); // Use capture phase to potentially catch event earlier

         console.log("Gemini Catppuccin (No Code Block Styling v2): Shortcut listeners added.");
    }


    // --- Wait for DOMContentLoaded ---
    // [This section remains exactly as in your original script]
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShortcuts);
    } else {
        // DOMContentLoaded has already fired
        initializeShortcuts();
    }

    // --- Removed Mutation Observer ---
    // [This section remains exactly as in your original script]
    console.log("Gemini Catppuccin (No Code Block Styling v2): Mutation observer for zoom hack removed.");

})();