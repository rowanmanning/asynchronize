/*jshint maxlen: 200 */
/*global beforeEach, describe, it */
(function () {
    'use strict';

    // Dependencies
    var assert = require('proclaim');
    var sinon = require('sinon');

    // Test subject
    var asynchronize = require('../../lib/asynchronize');

    // Tests
    describe('asynchronize()', function () {

        it('should throw when called with a non-function argument', function () {
            assert.throws(function () {
                asynchronize(null);
            }, /function expected/i);
        });

        it('should not throw when called with a function argument', function () {
            assert.doesNotThrow(function () {
                asynchronize(function () {});
            });
        });

        it('should return a function', function () {
            assert.isFunction(asynchronize(function () {}));
        });

        describe('returnedFunction()', function () {
            var fn, asyncFn, callback;

            beforeEach(function () {
                fn = sinon.stub();
                asyncFn = asynchronize(fn);
                callback = sinon.spy();
            });

            it('should return nothing', function () {
                assert.isUndefined(asyncFn());
            });

            it('should call the original function with the expected values', function () {
                asyncFn('foo', 'bar', callback);
                asyncFn('foo', 'bar', 'baz');
                assert.isTrue(fn.calledTwice);
                assert.deepEqual(fn.firstCall.args, ['foo', 'bar']);
                assert.deepEqual(fn.secondCall.args, ['foo', 'bar', 'baz']);
            });

            it('should call the callback with the return value of the original function', function () {
                fn.withArgs('foo').returns('bar');
                asyncFn('foo', callback);
                assert.isTrue(callback.withArgs(undefined, 'bar').calledOnce);
            });

            it('should call the callback with the error thrown in the original function', function () {
                var err = new Error('bar');
                fn.withArgs('foo').throws(err);
                asyncFn('foo', callback);
                assert.isTrue(callback.withArgs(err, undefined).calledOnce);
            });

        });

    });

} ());