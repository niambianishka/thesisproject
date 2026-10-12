/* ------------------------------------------------------------------
   PAGE-LOAD FADE-IN (see atlas-anim.css)
   Gives every armed element its own small delay so the page settles in
   as a wave, then drops the arming class so anything rendered later is
   shown instantly.
   ------------------------------------------------------------------ */
(function () {
    'use strict';

    var ARM_CLASS = 'atlas-arm';
    var DURATION = 450;     // keep in sync with atlas-anim.css
    var ROOT_STAGGER = 80;  // top bar, then main, then footer
    var DEPTH_STAGGER = 32; // outer blocks before the content inside them
    var SIBLING_STAGGER = 14;
    var MAX_DELAY = 420;

    function run() {
        var root = document.documentElement;
        if (!root.classList.contains(ARM_CLASS)) return;

        var hosts = document.querySelectorAll('header, main, footer');
        var animated = [];
        var longest = 0;

        try {
            Array.prototype.forEach.call(hosts, function (host, hostIndex) {
                (function walk(el, depth) {
                    Array.prototype.forEach.call(el.children, function (child, i) {
                        var style = window.getComputedStyle(child);

                        // A hidden view has nothing to fade in yet, and its
                        // children are not rendered either
                        if (style.display === 'none') return;

                        if (style.animationName.indexOf('atlasCascadeIn') !== -1) {
                            var delay = Math.min(
                                hostIndex * ROOT_STAGGER + depth * DEPTH_STAGGER + i * SIBLING_STAGGER,
                                MAX_DELAY
                            );
                            child.style.setProperty('--atlas-delay', delay + 'ms');
                            animated.push(child);
                            if (delay > longest) longest = delay;
                        }

                        walk(child, depth + 1);
                    });
                })(host, 0);
            });
        } catch (e) {
            // A failure here must never leave the page waiting on the
            // animation: the class is still dropped below.
        }

        window.setTimeout(function () {
            root.classList.remove(ARM_CLASS);
            animated.forEach(function (el) {
                el.style.removeProperty('--atlas-delay');
            });
        }, longest + DURATION + 120);
    }

    // A page loaded with this script deferred is still "interactive" here,
    // so waiting for DOMContentLoaded also places the cascade after the
    // page's own first render (module cards, history rows).
    if (document.readyState === 'complete') {
        run();
    } else {
        document.addEventListener('DOMContentLoaded', run);
    }
})();
