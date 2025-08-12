// ==UserScript==
// @name         Enhanced Grok Keyboard Shortcuts
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Enhanced keyboard shortcuts for Grok.com with robust element detection
// @author       Jiehoonk
// @match        https://grok.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- Enhanced Configuration ---
    const config = {
        selectors: {
            sidebar: [
                'button[data-sidebar="trigger"]',
                '[data-testid="sidebar-toggle"]',
                'button[aria-label*="sidebar" i]'
            ],
            modelSwitcher: [
                '#model-select-trigger', // added direct ID selector for new model menu button
                'button[id^="radix-"][aria-haspopup="menu"]',
                'button[aria-haspopup="menu"][role="button"]',
                '[data-testid="model-switcher"]'
            ]
        },
        shortcuts: {
            sidebar: { key: 's', shift: true, description: 'Toggle Sidebar' },
            modelSwitcher: { key: 'm', shift: true, description: 'Open Model Switcher' }
        },
        scriptName: "Enhanced Grok Keyboard Shortcuts v2.1",
        debug: true // Set to true for detailed logging
    };

    /**
     * Enhanced logging function
     */
    function log(message, element = null, level = 'info') {
        if (!config.debug && level === 'debug') return;

        const prefix = `${config.scriptName}:`;
        const fullMessage = `${prefix} ${message}`;

        switch(level) {
            case 'warn':
                console.warn(fullMessage, element || '');
                break;
            case 'error':
                console.error(fullMessage, element || '');
                break;
            case 'debug':
                console.debug(fullMessage, element || '');
                break;
            default:
                console.log(fullMessage, element || '');
        }
    }

    /**
     * Enhanced element finder with multiple selector fallbacks
     */
    function findElement(selectors, additionalCheck = null) {
        if (typeof selectors === 'string') {
            selectors = [selectors];
        }

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);

            for (const element of elements) {
                if (element && !element.disabled && element.offsetParent !== null) {
                    if (!additionalCheck || additionalCheck(element)) {
                        log(`Found element with selector: ${selector}`, element, 'debug');
                        return element;
                    }
                }
            }
        }

        log(`No valid element found with selectors: ${selectors.join(', ')}`, null, 'warn');
        return null;
    }

    /**
     * Enhanced model switcher finder - specifically for Grok 3 button
     */
    function findModelSwitcher() {
        log('Searching for model switcher...', null, 'debug');

        // Fast path: new dedicated ID-based trigger
        const direct = document.getElementById('model-select-trigger');
        if (direct && direct.offsetParent !== null && !direct.disabled) {
            log('Found model switcher by direct ID (#model-select-trigger)', direct, 'debug');
            return direct;
        }

        // Strategy 1: Use XPath (most reliable for exact element)
        try {
            const xpath = "/html/body/div[1]/div[2]/div/div/main/div[2]/div/div[2]/div/form/div/div/div[3]/div[1]/div[2]/button";
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                log('Found model switcher by XPath', result.singleNodeValue, 'debug');
                return result.singleNodeValue;
            }
        } catch (e) {
            log('XPath search failed: ' + e.message, null, 'debug');
        }

        // Strategy 2: Look for button with specific attributes and Grok text
        const buttons = document.querySelectorAll('button[aria-haspopup="menu"][data-state="closed"]');

        for (const button of buttons) {
            const span = button.querySelector('span');
            if (span && span.textContent) {
                const text = span.textContent.trim();
                log(`Checking button with text: "${text}"`, button, 'debug');

                if (text.match(/grok\s*\d*/i)) {
                    log('Found model switcher by Grok text pattern', button, 'debug');
                    return button;
                }
            }
        }

        // Strategy 3: Look for buttons with radix ID and menu popup
        const radixButtons = document.querySelectorAll('button[id*="radix"][aria-haspopup="menu"]');
        for (const button of radixButtons) {
            const span = button.querySelector('span');
            if (span && span.textContent && span.textContent.match(/grok/i)) {
                log('Found model switcher by radix ID pattern', button, 'debug');
                return button;
            }
        }

        // Strategy 4: Look for any button containing "Grok" with specific classes
        const grokButtons = document.querySelectorAll('button');
        for (const button of grokButtons) {
            if (button.getAttribute('aria-haspopup') === 'menu') {
                const text = button.textContent || '';
                if (text.match(/grok/i) && button.querySelector('svg')) {
                    log('Found model switcher by text and SVG presence', button, 'debug');
                    return button;
                }
            }
        }

        log('Model switcher not found with any strategy', null, 'warn');
        return null;
    }

    /**
     * Enhanced click function with multiple click methods and verification
     */
    function clickElement(element, description, retries = 2) {
        if (!element) {
            log(`Cannot click ${description}: element not found`, null, 'error');
            return false;
        }

        try {
            log(`Attempting to click ${description}`, element);

            // For model switcher, try multiple click methods
            if (description.includes('Model switcher')) {
                return clickModelSwitcherWithVerification(element, retries);
            }

            // Standard click for other elements
            if (element.click) {
                element.click();
            } else {
                element.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            }

            return true;
        } catch (error) {
            log(`Error clicking ${description}: ${error.message}`, element, 'error');

            if (retries > 0) {
                log(`Retrying click for ${description} (${retries} attempts left)`, null, 'debug');
                setTimeout(() => clickElement(element, description, retries - 1), 100);
            }

            return false;
        }
    }

    /**
     * Special click handler for model switcher with verification
     */
    function clickModelSwitcherWithVerification(element, retries = 2) {
        const initialState = element.getAttribute('aria-expanded') || 'false';
        log(`Model switcher initial state: aria-expanded="${initialState}"`, element, 'debug');

        // Method 1: Standard click
        log('Trying standard click method', element, 'debug');
        element.click();

        // Check if it worked
        setTimeout(() => {
            const newState = element.getAttribute('aria-expanded') || 'false';
            log(`After standard click: aria-expanded="${newState}"`, element, 'debug');

            if (newState !== initialState && newState === 'true') {
                log('Model switcher opened successfully with standard click!', element);
                return true;
            }

            // Method 2: Mouse events sequence
            if (retries > 0) {
                log('Standard click failed, trying mouse events sequence', element, 'debug');

                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Dispatch mousedown, mouseup, and click events
                ['mousedown', 'mouseup', 'click'].forEach((eventType, index) => {
                    setTimeout(() => {
                        const mouseEvent = new MouseEvent(eventType, {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: centerX,
                            clientY: centerY,
                            button: 0
                        });
                        element.dispatchEvent(mouseEvent);
                        log(`Dispatched ${eventType} event`, element, 'debug');
                    }, index * 10);
                });

                // Check again after mouse events
                setTimeout(() => {
                    const finalState = element.getAttribute('aria-expanded') || 'false';
                    log(`After mouse events: aria-expanded="${finalState}"`, element, 'debug');

                    if (finalState === 'true') {
                        log('Model switcher opened successfully with mouse events!', element);
                        return true;
                    }

                    // Method 3: Focus and Enter key
                    if (retries > 1) {
                        log('Mouse events failed, trying focus and Enter key', element, 'debug');
                        element.focus();

                        setTimeout(() => {
                            const enterEvent = new KeyboardEvent('keydown', {
                                bubbles: true,
                                cancelable: true,
                                key: 'Enter',
                                code: 'Enter',
                                which: 13,
                                keyCode: 13
                            });
                            element.dispatchEvent(enterEvent);

                            setTimeout(() => {
                                const enterUpEvent = new KeyboardEvent('keyup', {
                                    bubbles: true,
                                    cancelable: true,
                                    key: 'Enter',
                                    code: 'Enter',
                                    which: 13,
                                    keyCode: 13
                                });
                                element.dispatchEvent(enterUpEvent);

                                // Final check
                                setTimeout(() => {
                                    const veryFinalState = element.getAttribute('aria-expanded') || 'false';
                                    log(`After Enter key: aria-expanded="${veryFinalState}"`, element, 'debug');

                                    if (veryFinalState === 'true') {
                                        log('Model switcher opened successfully with Enter key!', element);
                                        return true;
                                    } else {
                                        log('All click methods failed - model switcher did not open', element, 'error');
                                        return false;
                                    }
                                }, 100);
                            }, 50);
                        }, 100);
                    }
                }, 200);
            }
        }, 100);

        return false;
    }

    /**
     * Sidebar toggle handler
     */
    function toggleSidebar() {
        const sidebar = findElement(config.selectors.sidebar);
        return clickElement(sidebar, 'Sidebar toggle button');
    }

    /**
     * Model switcher handler
     */
    function openModelSwitcher() {
        const modelSwitcher = findModelSwitcher();
        return clickElement(modelSwitcher, 'Model switcher button');
    }

    /**
     * Enhanced keyboard event handler
     */
    function handleKeyboardEvent(event) {
        // Only handle modifier key combinations
        const isModifierPressed = event.metaKey || event.ctrlKey;
        if (!isModifierPressed || !event.shiftKey) return;

        const key = event.key.toLowerCase();
        let handled = false;

        // Check each shortcut configuration
        for (const [action, shortcut] of Object.entries(config.shortcuts)) {
            if (key === shortcut.key && event.shiftKey === shortcut.shift) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation(); // Prevent other handlers

                log(`Keyboard shortcut triggered: ${shortcut.description}`);

                switch (action) {
                    case 'sidebar':
                        handled = toggleSidebar();
                        break;
                    case 'modelSwitcher':
                        handled = openModelSwitcher();
                        break;
                }

                if (handled) {
                    log(`Successfully executed: ${shortcut.description}`);
                } else {
                    log(`Failed to execute: ${shortcut.description}`, null, 'warn');
                }

                break;
            }
        }
    }

    /**
     * Initialize keyboard shortcuts with better event handling
     */
    function initializeShortcuts() {
        // Remove any existing listeners first
        document.removeEventListener('keydown', handleKeyboardEvent, true);

        // Add the new listener
        document.addEventListener('keydown', handleKeyboardEvent, true);

        log('Enhanced keyboard shortcuts initialized');
        log('Available shortcuts:');
        for (const [action, shortcut] of Object.entries(config.shortcuts)) {
            log(`  • Cmd/Ctrl + Shift + ${shortcut.key.toUpperCase()}: ${shortcut.description}`);
        }
    }

    /**
     * Enhanced initialization with better timing
     */
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeShortcuts);
        } else {
            // Delay initialization slightly to ensure DOM is fully ready
            setTimeout(initializeShortcuts, 100);
        }

        // Also reinitialize on hash changes (SPA navigation)
        window.addEventListener('hashchange', () => {
            setTimeout(initializeShortcuts, 500);
        });

        log('Script loaded and initialized');
    }

    // --- Main Execution ---
    initialize();

})();