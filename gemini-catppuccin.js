// ==UserScript==
// @name         Gemini Catppuccin Theme & Shortcuts (No Code Block Styling v2.3)
// @namespace    http://tampermonkey.net/
// @version      2.3 // Updated version for new shortcut mapping
// @description  Applies Catppuccin Mocha theme, custom styles (excluding code blocks), and updated keyboard shortcuts (Cmd+J for New Chat, Cmd+Shift+J for Default Gem) in Google Gemini.
// @author       Jiehoonk (Modified for Gemini, Shortcuts, Catppuccin Mocha theme, No Code Block Styling, Updated Shortcuts)
// @match        https://gemini.google.com/*
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
    const userMessageTextColor = catppuccin.text;
    const defaultFontFamily = '"SF Pro Rounded", "SF Pro Display", sans-serif';
    const paragraphFontSize = '16px';
    const headingFontSize = '18px';
    const globalLineHeight = '26px';
    const headingLineHeight = '24px';
    // const codeFontSize = '15px'; // Not directly used in global CSS for code blocks anymore
    // const codeLineHeight = '24px'; // Not directly used

    // --- CSS Styles ---
    const css = `
        /* ---- Core Font Settings ---- */
        body, div, p, span, textarea, input, button {
            font-family: ${defaultFontFamily}, sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        pre, code, code *, .code-block *, .font-mono {
            font-family: monospace !important; /* Ensure monospace for all code elements */
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
        /* Code Block Styling Removed - User/Gemini handles this */

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
    console.log("Gemini Catppuccin (No Code Block Styling v2.3): Styles injected.");

    function initializeShortcuts() {
        console.log("Gemini Catppuccin (No Code Block Styling v2.3): DOM ready, adding shortcut listeners.");

        // Add event listener to the document, capturing phase to ensure it runs early
        // and can override default browser behavior or other scripts if necessary.
        document.addEventListener('keydown', function(event) {
            // const activeElement = document.activeElement; // Not strictly needed if we always run shortcuts
            // const isInputFocused = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable);
            const isModifierPressed = event.metaKey || event.ctrlKey; // metaKey for macOS Command, ctrlKey for Windows/Linux Ctrl

            // --- Shortcut: Cmd/Ctrl + J for New Chat --- (MODIFIED from Cmd+Shift+J)
            if (isModifierPressed && !event.shiftKey && event.key.toLowerCase() === 'j') {
                event.preventDefault(); // Prevent default browser action (e.g., opening downloads)
                event.stopPropagation(); // Stop the event from bubbling up
                const newChatButton = document.querySelector('button[aria-label*="New chat"], [data-test-id="new-chat-button"] button, a[href="/app"].mat-mdc-button-base'); // Added common new chat link selector
                if (newChatButton && !newChatButton.disabled) {
                    console.log('Cmd/Ctrl+J pressed: Clicking New Chat button.');
                    newChatButton.click();
                } else {
                    console.warn('Cmd/Ctrl+J pressed: New Chat button not found or disabled. Trying known selectors.');
                    // Attempt with more specific selectors if the general one fails
                    const specificSelectors = [
                        'button[aria-label="New chat"]',
                        'button[aria-label="New Chat"]',
                        '[data-test-id="new-chat-button"] button',
                        'a.gmat-button--primary.new-chat-button', // Example of another possible selector
                        'div[aria-label="New chat"][role="button"]' // Another example
                    ];
                    let clicked = false;
                    for (const selector of specificSelectors) {
                        const button = document.querySelector(selector);
                        if (button && !button.disabled) {
                            console.log(`Cmd/Ctrl+J pressed: Clicking New Chat button (selector: ${selector}).`);
                            button.click();
                            clicked = true;
                            break;
                        }
                    }
                    if (!clicked) {
                         console.warn('Cmd/Ctrl+J pressed: All New Chat button selectors failed.');
                    }
                }
            }

            // --- Shortcut: Cmd/Ctrl + Shift + J to click the specific "Default" Gem button --- (MODIFIED from Cmd+J)
            if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === 'j') {
                // No longer checking if (isInputFocused) to allow shortcut from anywhere
                event.preventDefault();
                event.stopPropagation();

                console.log("Cmd/Ctrl+Shift+J pressed: Searching for 'Default' Gem button...");
                let defaultGemButtonFound = false;
                // Get all buttons that could be Gems. This selector might need to be very specific.
                // Common patterns for such buttons:
                // - They are <button> elements.
                // - They might have a class related to "bot", "conversation", or "gem".
                // - The text "Default" is usually inside a child element like <span> or <div>.
                const allPotentialGemButtons = document.querySelectorAll('button, div[role="button"]'); // Broad start, then filter

                for (const button of allPotentialGemButtons) {
                    // Check for common Gemini UI patterns for these types of buttons
                    // This often involves looking for a specific child span or div with the name.
                    // Example: button > div > span.bot-name
                    // Example: button > span (if text is directly in a span)
                    // Example: div[role="button"] > div > span.name
                    const nameElements = button.querySelectorAll('span, div'); // Look for text in spans or divs within the button
                    let foundNameMatch = false;
                    for (const el of nameElements) {
                        if (el.textContent && el.textContent.trim() === 'Default') {
                            foundNameMatch = true;
                            break;
                        }
                    }

                    if (foundNameMatch) {
                         // Further check if it looks like a "new conversation" or "gem selection" button
                         // This is heuristic. We might check for specific classes or parent structures.
                         // For this example, we'll assume if it contains "Default" and is clickable, it's our target.
                         // A more robust selector would be `button.bot-new-conversation-button` if that class is consistent.
                         // Or `button[data-gem-id="default"]` if such an attribute exists.
                        if (button.matches('button.bot-new-conversation-button') || button.closest('.gem-picker-item')) { // Example refinement
                            console.log("Found 'Default' Gem button. Clicking it.", button);
                            button.click();
                            defaultGemButtonFound = true;
                            break; // Stop searching once found and clicked
                        } else if (!button.matches('button.bot-new-conversation-button') && !button.closest('.gem-picker-item')) {
                            // If it contains "Default" but doesn't match a more specific Gem button pattern,
                            // it might be a less specific button. We still try clicking if it's the only one.
                            // This part is tricky and might need adjustment based on actual UI.
                            // For now, if it has "Default" and is a button, we try.
                            const buttonTextContent = button.textContent || "";
                            if (buttonTextContent.includes("Default") && button.offsetParent !== null) { // Check if visible
                                console.log("Found a clickable element with 'Default' text. Attempting click.", button);
                                button.click();
                                defaultGemButtonFound = true;
                                break;
                            }
                        }
                    }
                }

                if (!defaultGemButtonFound) {
                    console.warn("Cmd/Ctrl+Shift+J pressed: 'Default' Gem button not found. Inspected all buttons and divs with role='button'. The UI structure for these buttons might have changed or the 'Default' text is not in a simple span/div or the button selector needs refinement.");
                }
            }

            // --- Shortcut: Cmd/Ctrl + Shift + S for Toggle Sidebar --- (Unchanged, but also works from input focus)
            if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                event.stopPropagation();
                const sidebarToggleButton = document.querySelector('button[aria-label*="menu"], [data-test-id="side-nav-menu-button"], button[aria-label="Main menu"]');
                if (sidebarToggleButton) {
                    console.log('Cmd/Ctrl+Shift+S pressed: Clicking Sidebar Toggle button.');
                    sidebarToggleButton.click();
                } else {
                    console.warn('Cmd/Ctrl+Shift+S pressed: Sidebar Toggle button not found. Trying fallback selectors.');
                     const fallbackSelectors = [
                        '[data-test-id="side-nav-menu-button"]',
                        'button[aria-label="Menu"]', // Common variation
                        'button[aria-label="Toggle main menu"]'
                    ];
                    let clicked = false;
                    for (const selector of fallbackSelectors) {
                        const button = document.querySelector(selector);
                        if (button) {
                            console.log(`Cmd/Ctrl+Shift+S pressed: Clicking Sidebar Toggle button (selector: ${selector}).`);
                            button.click();
                            clicked = true;
                            break;
                        }
                    }
                    if (!clicked) {
                        console.warn('Cmd/Ctrl+Shift+S pressed: Fallback Sidebar Toggle button not found.');
                    }
                }
            }
        }, true); // Use capturing phase

        console.log("Gemini Catppuccin (No Code Block Styling v2.3): Shortcut listeners added.");
    }

    // --- Wait for DOMContentLoaded ---
    // Using document.readyState is generally more reliable than DOMContentLoaded for userscripts
    // that need to act early or on dynamic content.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShortcuts);
    } else {
        // DOMContentLoaded has already fired
        initializeShortcuts();
    }

    // Removed MutationObserver for zoom hack as it was not requested for this version.
    console.log("Gemini Catppuccin (No Code Block Styling v2.3): Script loaded.");

})();
