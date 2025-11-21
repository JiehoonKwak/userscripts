// ==UserScript==
// @name         Gemini Catppuccin & Shortcuts (Refactored v3.3)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Applies Midnight Pro theme (and others), and robust keyboard shortcuts to Google Gemini. Refactored for maintainability and resilience.
// @author       Jiehoonk (Refactored Version)
// @match        https://gemini.google.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. Centralized Configuration Object ---
    const config = {
        activeTheme: 'midnightPro', // Options: 'midnightPro', 'obsidian', 'deepForest', 'catppuccin'
        themes: {
            midnightPro: { // Deep Blue/Black, Cyan/Blue Accents
                rosewater: "#cdd6f4", flamingo: "#f2cdcd", pink: "#cba6f7", mauve: "#cba6f7",
                red: "#00e5ff",       // Main Heading / Accent
                maroon: "#2979ff",
                peach: "#40c4ff",     // User Italic
                yellow: "#81d4fa",
                green: "#00e676",     // User Code
                teal: "#00b0ff",      // Model Code
                sky: "#0091ea",       // User Bold
                sapphire: "#2962ff",
                blue: "#2979ff",
                lavender: "#b4befe",
                text: "#e3f2fd",      // Main Text (Cool White)
                subtext1: "#bac2de",
                subtext0: "#a6adc8",
                overlay2: "#9399b2",
                overlay1: "#7f849c",
                overlay0: "#6c7086",
                surface2: "#1e293b",
                surface1: "#0f172a",  // Code Background
                surface0: "#020617",
                base: "#0f1117",      // Main Background
                mantle: "#0b0d12",    // Sidebar / Secondary
                crust: "#000000",
            },
            obsidian: { // Pure Black, Purple/Pink Accents
                rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f50057", mauve: "#d500f9",
                red: "#d500f9",       // Main Heading
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
            deepForest: { // Dark Green, Emerald/Gold Accents
                rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
                red: "#00e676",       // Main Heading
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
            catppuccin: { // Original
                rosewater: "#f5e0dc", flamingo: "#f2cdcd", pink: "#f5c2e7", mauve: "#cba6f7",
                red: "#f38ba8", maroon: "#eba0ac", peach: "#fab387", yellow: "#f9e2af",
                green: "#a6e3a1", teal: "#94e2d5", sky: "#89dceb", sapphire: "#74c7ec",
                blue: "#89b4fa", lavender: "#b4befe", text: "#cdd6f4", subtext1: "#bac2de",
                subtext0: "#a6adc8", overlay2: "#9399b2", overlay1: "#7f849c", overlay0: "#6c7086",
                surface2: "#585b70", surface1: "#45475a", surface0: "#313244", base: "#1e1e2e",
                mantle: "#181825", crust: "#11111b",
            }
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
            ].join(', '),
            modeSwitcher: 'bard-mode-switcher div button',
            // Added: search button selectors
            searchButton: [
                'button[aria-label="검색"]',
                'button[aria-label="Search"]',
                'button.search-button',
                'search-nav-button button[mat-icon-button]'
            ].join(', ')
        },
        scriptName: "Gemini Catppuccin & Shortcuts v3.4"
    };

    /**
     * --- 2. Improved CSS with CSS Variables ---
     */
    function generateCSS() {
        const t = config.themes[config.activeTheme];
        const f = config.fonts;
        return `
            /* Scoped CSS Variables - Only available inside the main interface */
            main, [role="main"], .chat-container, .conversation-container {
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
            /* Scoped Font Application */
            main, main div, main p, main span, main textarea, main input, main button {
                font-family: ${f.default}, sans-serif !important;
                -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
            }
            main pre, main code, main .code-block, main .font-mono { font-family: monospace !important; }

            /* Scoped Main Interface Styling */
            main, [role="main"], .chat-container, .conversation-container {
                background-color: var(--base) !important;
                color: var(--text) !important;
            }

            main p, main div[role="paragraph"], .message-content, .prose, .message-body-content,
            .prose p, .message-text, [data-testid="message-content"] {
                font-size: ${f.paragraphSize} !important; line-height: ${f.lineHeight} !important;
                color: var(--text) !important;
            }
            main h1, main h2, main h3, main h4, main h5, main h6, [role="heading"] {
                font-size: ${f.headingSize} !important; line-height: ${f.headingLineHeight} !important;
                font-weight: 600 !important; color: var(--red) !important;
            }
            main strong, main b { color: var(--red) !important; font-weight: bold !important; }
            main em, main i { color: var(--peach) !important; font-style: italic !important; }
            main .katex, main .katex * { color: var(--peach) !important; }
            main :not(.user-message) > code:not(pre code) {
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
    }

    // --- Theme Management Functions ---
    let themeStyleElement = null;

    function applyTheme() {
        if (!themeStyleElement) {
            themeStyleElement = document.createElement('style');
            themeStyleElement.id = 'gemini-catppuccin-theme';
            themeStyleElement.textContent = generateCSS();
            document.head.appendChild(themeStyleElement);
            console.log(`${config.scriptName}: Dark theme applied.`);
        }
    }

    function removeTheme() {
        if (themeStyleElement) {
            themeStyleElement.remove();
            themeStyleElement = null;
            console.log(`${config.scriptName}: Dark theme removed.`);
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

            if (!event.shiftKey && key === 'k') { // Cmd/Ctrl + K -> Search
                event.preventDefault();
                event.stopPropagation();
                findAndClick(config.selectors.searchButton, '"Search" button');
            } else if (!event.shiftKey && key === 'j') { // Cmd/Ctrl + J -> New Chat
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
            } else if (event.shiftKey && key === 'm') { // Cmd/Ctrl + Shift + M -> Mode Switcher
                event.preventDefault();
                event.stopPropagation();
                findAndClick(config.selectors.modeSwitcher, '"Mode Switcher" button');
            }
        }, true);

        console.log(`${config.scriptName}: Shortcut listeners added.`);
    }

    // --- Main Execution ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeShortcuts);
    } else {
        initializeShortcuts();
    }
    console.log(`${config.scriptName}: Script loaded with dark mode detection.`);

})();