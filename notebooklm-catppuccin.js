// ==UserScript==
// @name         NotebookLM Catppuccin Theme & Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.6 // Incremented version
// @description  Applies Catppuccin Mocha theme (dark mode only), custom styles, and keyboard shortcuts in Google NotebookLM
// @author       Your Name (Based on Jiehoonk's script, HTML analysis, and AI update)
// @match        https://notebooklm.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- Catppuccin Mocha Color Palette ---
    const catppuccin = {
        rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
        red: "#f38ba8", maroon: "#eba0ac", peach: "#fab387", yellow: "#f9e2af",
        green: "#a6e3a1", teal: "#94e2d5", sky: "#89dceb", sapphire: "#74c7ec",
        blue: "#89b4fa", lavender: "#b4befe", text: "#cdd6f4", subtext1: "#bac2de",
        subtext0: "#a6adc8", overlay2: "#9399b2", overlay1: "#7f849c", overlay0: "#6c7086",
        surface2: "#585b70", surface1: "#45475a", surface0: "#313244", base: "#1e1e2e",
        mantle: "#181825", crust: "#11111b",
    };

    // --- Style Definitions ---
    const primaryTextColor = catppuccin.text;
    const defaultFontFamily = '"SF Pro Rounded", "SF Pro Display", sans-serif'; // Retained for potential future use
    const paragraphFontSize = '16px';
    const headingFontSize = '1.17em';
    const globalLineHeight = '1.6';
    const headingLineHeight = '1.4';
    const codeFontSize = '0.95em';
    const codeLineHeight = '1.5';

    // --- CSS Styles ---
    const css = `
        /* ---- General Backgrounds ---- */
        body, #app-root, .notebook-layout {
            background-color: ${catppuccin.crust} !important;
            color: ${primaryTextColor} !important;
            font-family: ${defaultFontFamily} !important; /* Apply default font family */
        }
        .source-panel, .studio-panel, .chat-panel {
            background-color: ${catppuccin.mantle} !important;
        }
        mat-card.to-user-message-card-content { /* AI response card */
            background-color: transparent !important;
            box-shadow: none !important;
        }
        mat-card.from-user-message-card-content { /* User message card */
            background-color: transparent !important;
            box-shadow: none !important;
        }
        textarea, .chat-input-box, div[contenteditable="true"].chat-input { /* Input areas */
            background-color: ${catppuccin.base} !important;
            color: ${primaryTextColor} !important;
            border: 1px solid ${catppuccin.surface0} !important;
            border-radius: 4px !important;
            font-family: ${defaultFontFamily} !important; /* Apply default font family */
        }

        /* ---- Center Panel Content Styling (Targeting .message-content container) ---- */
        .message-content {
            color: ${primaryTextColor} !important;
            font-family: ${defaultFontFamily} !important; /* Apply default font family */
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
            color: ${catppuccin.red} !important;
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
            color: ${catppuccin.mauve} !important;
            font-weight: bold !important; /* Ensure font-weight is explicitly bold */
        }

        /* Italic text - Target elements with 'italic' class and standard italic tags */
        .message-content span.italic, /* Assuming similar structure to bold for italics, e.g., <span class="italic..."> */
        .message-content .italic,     /* More general .italic class target */
        .message-content em,          /* Standard HTML italic */
        .message-content i {          /* Standard HTML italic */
            color: ${catppuccin.pink} !important;
            font-style: italic !important; /* Ensure font-style is explicitly italic */
        }

        /* Inline code */
        .message-content code:not(pre code), .message-content .inline-code {
            color: ${catppuccin.teal} !important;
            background-color: ${catppuccin.surface1} !important;
            padding: 0.1em 0.3em !important;
            border-radius: 4px !important;
            border: none !important;
            font-family: monospace !important;
            font-size: ${codeFontSize} !important;
        }

        /* Code blocks */
        .message-content pre, .message-content pre code, .message-content .code-block {
            display: block !important;
            font-size: ${codeFontSize} !important;
            line-height: ${codeLineHeight} !important;
            color: ${catppuccin.text} !important;
            font-family: monospace !important;
            background-color: ${catppuccin.base} !important;
            padding: 1em !important;
            margin: 1em 0 !important;
            border-radius: 5px !important;
            overflow-x: auto !important;
            border: 1px solid ${catppuccin.surface0} !important;
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
        .message-content li::marker {
            color: ${catppuccin.subtext1} !important;
        }

        /* Citation Markers */
        .message-content button.citation-marker {
            background-color: ${catppuccin.surface1} !important;
            color: ${catppuccin.blue} !important;
            padding: 0.1em 0.45em !important;
            border-radius: 4px !important;
            border: none !important;
            font-size: 0.8em !important;
            font-weight: bold;
            margin-left: 0.2em !important;
            vertical-align: baseline;
            cursor: pointer !important;
            line-height: 1 !important;
            min-width: auto !important;
            height: auto !important;
            box-shadow: none !important;
        }
        .message-content button.citation-marker:hover {
            background-color: ${catppuccin.surface2} !important;
        }
        .message-content button.citation-marker:has(span:contains('...')) {
            /* Styles for '...' button if needed */
        }

        /* ---- UI Elements ---- */
        button.pin-button { /* "Save to Memo" button */
            background-color: ${catppuccin.surface0} !important;
            color: ${catppuccin.sky} !important;
            border: 1px solid ${catppuccin.surface1} !important;
            font-family: ${defaultFontFamily} !important;
        }
        button.pin-button:hover {
            background-color: ${catppuccin.surface1} !important;
        }
        chat-actions button.action-button mat-icon {
            color: ${catppuccin.overlay2} !important;
        }
        chat-actions button.action-button:hover mat-icon {
            color: ${catppuccin.subtext1} !important;
        }
    `;

    // --- Theme Management Functions ---
    let themeStyleElement = null;

    function applyTheme() {
        if (!themeStyleElement) {
            themeStyleElement = document.createElement('style');
            themeStyleElement.id = 'notebooklm-catppuccin-theme';
            themeStyleElement.textContent = css;
            document.head.appendChild(themeStyleElement);
            console.log("NotebookLM Catppuccin: Dark theme applied.");
        }
    }

    function removeTheme() {
        if (themeStyleElement) {
            themeStyleElement.remove();
            themeStyleElement = null;
            console.log("NotebookLM Catppuccin: Dark theme removed.");
        }
    }

    function handleThemeChange(mediaQuery) {
        if (mediaQuery.matches) {
            // Dark mode
            applyTheme();
        } else {
            // Light mode
            removeTheme();
        }
    }

    // --- Initialize Theme Based on System Preference ---
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    handleThemeChange(darkModeMediaQuery);
    darkModeMediaQuery.addEventListener('change', handleThemeChange);

    // --- Wait for DOM readiness before adding listeners ---
    function initializeShortcuts() {
        console.log("NotebookLM Catppuccin: DOM ready, adding shortcut listeners.");

        document.addEventListener('keydown', function(event) {
            const isModifierPressed = event.metaKey || event.ctrlKey;
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);

            // Cmd/Ctrl + Shift + S -> Toggle Both Sidebars
            if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === 's') {
                if (isInputFocused) return;
                event.preventDefault();
                event.stopPropagation();
                console.log('Cmd/Ctrl+Shift+S pressed: Toggling sidebars...');

                const leftSidebarButton = document.querySelector('button[aria-label*="Sources"], button.toggle-source-panel-button');
                const rightSidebarButton = document.querySelector('button[aria-label*="Notebook"], button[aria-label*="Studio"], button.toggle-studio-panel-button');

                let clickedLeft = false;
                if (leftSidebarButton) {
                    console.log('Found left sidebar toggle:', leftSidebarButton);
                    leftSidebarButton.click();
                    clickedLeft = true;
                } else { console.warn('Left sidebar toggle button not found.'); }

                setTimeout(() => {
                    if (rightSidebarButton) {
                        console.log('Found right sidebar toggle:', rightSidebarButton);
                        rightSidebarButton.click();
                    } else { console.warn('Right sidebar toggle button not found.'); }
                }, clickedLeft ? 50 : 0);
            }

            // Cmd/Ctrl + J -> Go to Home
            if (isModifierPressed && !event.shiftKey && event.key.toLowerCase() === 'j') {
                if (isInputFocused && activeElement.tagName !== 'BODY') return;
                event.preventDefault();
                event.stopPropagation();
                console.log('Cmd/Ctrl+J pressed: Navigating home...');

                const homeLink = document.querySelector('a[href="/"][aria-label*="NotebookLM home"], div.logo a.logo-link[href="/"]');

                if (homeLink) {
                    console.log('Found home link:', homeLink);
                    homeLink.click();
                } else { console.warn('Home link not found.'); }
            }
        }, true);

        console.log("NotebookLM Catppuccin: Shortcut listeners added.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShortcuts);
    } else {
        initializeShortcuts();
    }

    console.log("NotebookLM Catppuccin: Script initialized with dark mode detection.");
})();