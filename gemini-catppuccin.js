// ==UserScript==
// @name         Gemini Catppuccin Theme & Shortcuts (No Code Block Styling v2.2)
// @namespace    http://tampermonkey.net/
// @version      2.2 // Incremented version for specific Gem targeting
// @description  Applies Catppuccin Mocha theme, custom styles (excluding code blocks), and updated keyboard shortcuts (targeting specific "Default" Gem) in Google Gemini.
// @author       Jiehoonk (Modified for Gemini, Shortcuts, Catppuccin Mocha theme, No Code Block Styling, Updated Shortcuts)
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start // Keep this to inject CSS early
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
    const userMessageTextColor = catppuccin.text;
    const defaultFontFamily = '"SF Pro Rounded", "SF Pro Display", sans-serif';
    const paragraphFontSize = '16px';
    const headingFontSize = '18px';
    const globalLineHeight = '26px';
    const headingLineHeight = '24px';
    const codeFontSize = '15px';
    const codeLineHeight = '24px';

    // --- CSS Styles ---
    const css = `
        /* ---- Core Font Settings ---- */
        body, div, p, span, textarea, input, button {
            font-family: ${defaultFontFamily}, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        pre, code, code *, .code-block *, .font-mono {
            font-family: monospace !important;
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
            color: ${catppuccin.mauve} !important; font-weight: bold !important;
        }
        em, i, [data-testid="text-italic"], [data-formatting="italic"], .italic, .font-italic,
        span[style*="font-style: italic"], span[style*="font-style:italic"] {
            color: ${catppuccin.pink} !important; font-style: italic !important;
        }
        /* Inline code (Model) */
        :not(.user-message) > code:not(pre code),
        code:not(pre code):not([class*="user-message"] code),
        [data-testid="text-code-inline"], [data-formatting="code"], .inline-code {
            color: ${catppuccin.teal} !important; background-color: ${catppuccin.surface1} !important;
            padding: 0.1em 0.3em !important; border-radius: 4px !important; border: none !important;
            font-family: monospace !important; font-size: 0.95em !important;
        }
        /* Code Block Styling Removed */
        /* Math expressions */
        .katex, .katex *, [data-testid="math-inline"], [data-testid="math-block"], [class*="math-"] {
            color: ${catppuccin.pink} !important;
        }
        /* ---- User Message Styling ---- */
        [data-testid="user-message"], [role="user-message"], .user-message,
        div[class*="user-message"], div[class*="human-message"], div[class*="query-message"] {
            color: ${userMessageTextColor} !important;
        }
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
            color: ${catppuccin.green} !important; background-color: ${catppuccin.mantle} !important;
            padding: 0.1em 0.3em !important; border-radius: 4px !important; border: none !important;
            font-family: monospace !important; font-size: 0.95em !important;
        }
    `;

    GM_addStyle(css);
    console.log("Gemini Catppuccin (No Code Block Styling v2.2): Styles injected.");

    function initializeShortcuts() {
        console.log("Gemini Catppuccin (No Code Block Styling v2.2): DOM ready, adding shortcut listeners.");

        document.addEventListener('keydown', function(event) {
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
            const isModifierPressed = event.metaKey || event.ctrlKey;

            // --- Shortcut: Cmd/Ctrl + Shift + J for New Chat --- (Unchanged from v2.1)
            if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === 'j') {
                event.preventDefault();
                event.stopPropagation();
                const newChatButton = document.querySelector('button[aria-label*="New chat"], [data-test-id="new-chat-button"] button');
                if (newChatButton && !newChatButton.disabled) {
                    console.log('Cmd/Ctrl+Shift+J pressed: Clicking New Chat button.');
                    newChatButton.click();
                } else {
                    console.warn('Cmd/Ctrl+Shift+J pressed: New Chat button not found or disabled. Trying fallback.');
                    const fallbackButton = document.querySelector('[data-test-id="new-chat-button"] button');
                     if (fallbackButton && !fallbackButton.disabled) {
                         console.log('Cmd/Ctrl+Shift+J pressed: Clicking New Chat button (fallback selector).');
                         fallbackButton.click();
                    } else {
                         console.warn('Cmd/Ctrl+Shift+J pressed: Fallback New Chat button not found or disabled.');
                    }
                }
            }

            // --- Shortcut: Cmd/Ctrl + J to click the specific "Default" Gem button --- (MODIFIED LOGIC)
            if (isModifierPressed && !event.shiftKey && event.key.toLowerCase() === 'j') {
                 if (isInputFocused) {
                     console.log('Cmd/Ctrl+J pressed while in input/textarea - allowing default browser action.');
                     return;
                 }
                event.preventDefault();
                event.stopPropagation();

                console.log("Cmd/Ctrl+J pressed: Searching for 'Default' Gem button...");
                let defaultGemButtonFound = false;
                // Get all buttons that could be Gems
                const allGemButtons = document.querySelectorAll('button.bot-new-conversation-button');

                // Iterate through them
                for (const button of allGemButtons) {
                    // Find the span containing the name within this button
                    // Using '.bot-name' based on previous inspection, adjust if necessary
                    const nameSpan = button.querySelector('span.bot-name');
                    if (nameSpan && nameSpan.textContent.trim() === 'Default') {
                        console.log("Found 'Default' Gem button. Clicking it.");
                        button.click();
                        defaultGemButtonFound = true;
                        break; // Stop searching once found
                    }
                }

                if (!defaultGemButtonFound) {
                    console.warn("Cmd/Ctrl+J pressed: 'Default' Gem button not found. Selector used for buttons:", 'button.bot-new-conversation-button', "and checking child span.bot-name text.");
                }
            }

            // --- Shortcut: Cmd/Ctrl + Shift + S for Toggle Sidebar --- (Unchanged from v2.1)
            if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === 's') {
                 event.preventDefault();
                 event.stopPropagation();
                 const sidebarToggleButton = document.querySelector('button[aria-label*="menu"], [data-test-id="side-nav-menu-button"]');
                 if (sidebarToggleButton) {
                     console.log('Cmd/Ctrl+Shift+S pressed: Clicking Sidebar Toggle button.');
                     sidebarToggleButton.click();
                 } else {
                     console.warn('Cmd/Ctrl+Shift+S pressed: Sidebar Toggle button not found. Trying fallback.');
                     const fallbackButton = document.querySelector('[data-test-id="side-nav-menu-button"]');
                      if (fallbackButton) {
                          console.log('Cmd/Ctrl+Shift+S pressed: Clicking Sidebar Toggle button (fallback selector).');
                          fallbackButton.click();
                     } else {
                          console.warn('Cmd/Ctrl+Shift+S pressed: Fallback Sidebar Toggle button not found.');
                     }
                 }
            }
        }, true);

         console.log("Gemini Catppuccin (No Code Block Styling v2.2): Shortcut listeners added.");
    }

    // --- Wait for DOMContentLoaded ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShortcuts);
    } else {
        initializeShortcuts();
    }

    console.log("Gemini Catppuccin (No Code Block Styling v2.2): Mutation observer for zoom hack removed.");

})();