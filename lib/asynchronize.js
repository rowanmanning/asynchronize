/*global define */
(function (root) {
    'use strict';

    // Utilities
    // ---------

    // process.nextTick polyfill for browsers
    var nextTick = (
        typeof process !== 'undefined' &&
        process.platform &&
        process.nextTick
    ) || setTimeout;


    // Asynchronize Function
    // ---------------------
    //
    // Make a synchronous function appear asynchronous.
    //
    function asynchronize (fn) {

        // Validate arguments
        if (typeof fn !== 'function') {
            throw new Error('Invalid argument, function expected');
        }

        // Curry a new function
        return function () {
            var args, next, error, result;

            // Get arguments, take the last one as a callback
            args = Array.prototype.slice.call(arguments);

            // Get the callback
            if (typeof args[args.length - 1] === 'function') {
                next = args.pop();
            }

            // Defer execution
            nextTick(function () {

                // Get the result of the function call
                try {
                    result = fn.apply(null, args);
                } catch (err) {
                    error = err;
                }

                // Callback (if there is one)
                if (next) {
                    next(error, result);
                }

            });

        };

    }


    // Exports
    // -------

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