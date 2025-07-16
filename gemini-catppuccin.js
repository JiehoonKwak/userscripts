// ==UserScript==
// @name         Gemini Catppuccin & Shortcuts (Refactored v3.1)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Applies Catppuccin Mocha theme and robust keyboard shortcuts to Google Gemini. Refactored for maintainability and resilience.
// @author       Jiehoonk (Refactored Version)
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. Centralized Configuration Object ---
    const config = {
        theme: {
            rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
            red: "#f38ba8", maroon: "#eba0ac", peach: "#fab387", yellow: "#f9e2af",
            green: "#a6e3a1", teal: "#94e2d5", sky: "#89dceb", sapphire: "#74c7ec",
            blue: "#89b4fa", lavender: "#b4befe", text: "#cdd6f4", subtext1: "#bac2de",
            subtext0: "#a6adc8", overlay2: "#9399b2", overlay1: "#7f849c", overlay0: "#6c7086",
            surface2: "#585b70", surface1: "#45475a", surface0: "#313244", base: "#1e1e2e",
            mantle: "#181825", crust: "#11111b",
        },
        fonts: {
            default: '"SF Pro Rounded", "SF Pro Display", sans-serif',
            paragraphSize: '16px',
            headingSize: '18px',
            lineHeight: '26px',
            headingLineHeight: '24px',
        },
        selectors: {
            newChat: [
                'a[href="/app"].mat-mdc-button-base',
                'button[aria-label*="New chat"]',
                '[data-test-id="new-chat-button"] button',
                'div[aria-label="New chat"][role="button"]'
            ].join(', '),
            toggleSidebar: [
                'button[aria-label="Main menu"]',
                'button[aria-label*="menu"]',
                '[data-test-id="side-nav-menu-button"]'
            ].join(', ')
        },
        scriptName: "Gemini Catppuccin & Shortcuts v3.1"
    };

    /**
     * --- 2. Improved CSS with CSS Variables ---
     */
    function applyStyles() {
        const t = config.theme;
        const f = config.fonts;
        const css = `
            :root {
                --rosewater: ${t.rosewater}; --flamingo: ${t.flamingo}; --pink: ${t.pink};
                --mauve: ${t.mauve}; --red: ${t.red}; --maroon: ${t.maroon};
                --peach: ${t.peach}; --yellow: ${t.yellow}; --green: ${t.green};
                --teal: ${t.teal}; --sky: ${t.sky}; --sapphire: ${t.sapphire};
                --blue: ${t.blue}; --lavender: ${t.lavender}; --text: ${t.text};
                --subtext1: ${t.subtext1}; --subtext0: ${t.subtext0}; --overlay2: ${t.overlay2};
                --overlay1: ${t.overlay1}; --overlay0: ${t.overlay0}; --surface2: ${t.surface2};
                --surface1: ${t.surface1}; --surface0: ${t.surface0}; --base: ${t.base};
                --mantle: ${t.mantle}; --crust: ${t.crust};
            }
            body, div, p, span, textarea, input, button {
                font-family: ${f.default}, sans-serif !important;
                -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
            }
            pre, code, code *, .code-block *, .font-mono { font-family: monospace !important; }
            p, div[role="paragraph"], .message-content, .prose, .message-body-content,
            .prose p, .message-text, [data-testid="message-content"] {
                font-size: ${f.paragraphSize} !important; line-height: ${f.lineHeight} !important;
                color: var(--text) !important;
            }
            h1, h2, h3, h4, h5, h6, [role="heading"] {
                font-size: ${f.headingSize} !important; line-height: ${f.headingLineHeight} !important;
                font-weight: 600 !important; color: var(--red) !important;
            }
            strong, b { color: var(--mauve) !important; font-weight: bold !important; }
            em, i { color: var(--pink) !important; font-style: italic !important; }
            .katex, .katex * { color: var(--pink) !important; }
            :not(.user-message) > code:not(pre code) {
                color: var(--teal) !important; background-color: var(--surface1) !important;
                padding: 0.1em 0.3em !important; border-radius: 4px !important;
                font-family: monospace !important; font-size: 0.95em !important;
            }
            .user-message, [data-testid="user-message"] { color: var(--text) !important; }
            .user-message strong, .user-message b { color: var(--sky) !important; }
            .user-message em, .user-message i { color: var(--peach) !important; }
            .user-message code:not(pre code) {
                color: var(--green) !important; background-color: var(--mantle) !important;
                padding: 0.1em 0.3em !important; border-radius: 4px !important;
                font-family: monospace !important; font-size: 0.95em !important;
            }
        `;
        GM_addStyle(css);
        console.log(`${config.scriptName}: Styles injected.`);
    }

    /**
     * --- 3. Reusable Helper Function for Clicking Elements ---
     */
    function findAndClick(selectors, description) {
        const element = document.querySelector(selectors);
        if (element && !element.disabled) {
            console.log(`${config.scriptName}: Clicking ${description}.`, element);
            element.click();
            return true;
        }
        console.warn(`${config.scriptName}: Could not find or click ${description}. Selectors used:`, selectors);
        return false;
    }

    /**
     * Special click handler for the "Default" Gem, which requires searching text content.
     * CORRECTED VERSION
     */
    function clickDefaultGem() {
        const description = "'Default' Gem button";
        const allButtons = document.querySelectorAll('button, div[role="button"]');

        for (const button of allButtons) {
            // Use .includes() for a more flexible search, and check if the element is visible.
            if (button.textContent && button.textContent.includes('Default') && button.offsetParent !== null) {
                console.log(`${config.scriptName}: Clicking ${description} based on text content.`, button);
                button.click();
                return true; // Exit after finding and clicking the first match
            }
        }

        console.warn(`${config.scriptName}: Could not find a visible ${description}.`);
        return false;
    }

    /**
     * --- 4. Streamlined Shortcut Initialization ---
     */
    function initializeShortcuts() {
        document.addEventListener('keydown', (event) => {
            const isModifierPressed = event.metaKey || event.ctrlKey;
            if (!isModifierPressed) return;

            const key = event.key.toLowerCase();

            if (!event.shiftKey && key === 'j') { // Cmd/Ctrl + J -> New Chat
                event.preventDefault();
                event.stopPropagation();
                findAndClick(config.selectors.newChat, '"New Chat" button');
            } else if (event.shiftKey && key === 'j') { // Cmd/Ctrl + Shift + J -> Default Gem
                event.preventDefault();
                event.stopPropagation();
                clickDefaultGem();
            } else if (event.shiftKey && key === 's') { // Cmd/Ctrl + Shift + S -> Toggle Sidebar
                event.preventDefault();
                event.stopPropagation();
                findAndClick(config.selectors.toggleSidebar, '"Toggle Sidebar" button');
            }
        }, true);

        console.log(`${config.scriptName}: Shortcut listeners added.`);
    }

    // --- Main Execution ---
    applyStyles();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShortcuts);
    } else {
        initializeShortcuts();
    }
    console.log(`${config.scriptName}: Script loaded.`);

})();