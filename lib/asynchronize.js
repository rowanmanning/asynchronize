/* global define */
(function (root) {
    'use strict';

    // Make a synchronous function appear asynchronous.
    function asynchronize (fn) {

        if (typeof fn !== 'function') {
            throw new Error('Invalid argument, function expected');
        }

        return function () {

            var args = Array.prototype.slice.call(arguments);
            var next = (typeof args[args.length - 1] === 'function' ? args.pop() : null);

            nextTick(function () {
                var error;
                var result;

                try {
                    result = fn.apply(null, args);
                } catch (err) {
                    error = err;
                }

                if (next) {
                    next(error, result);
                }

            });

        };

    }

    // Compat function: process.nextTick/setTimeout
    var nextTick = (
        typeof process !== 'undefined' &&
        process.platform &&
        process.nextTick
    ) || setTimeout;

    // AMD
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return asynchronize;
        });
    }
    // CommonJS
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = asynchronize;
    }
    // Script tag
    else {
        root.asynchronize = asynchronize;
    }

} (this));