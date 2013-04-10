/*jshint maxlen: 200 */
/*global beforeEach, describe, it */
(function (process) {
    'use strict';

    // Dependencies
    var assert = require('proclaim');
    var sinon = require('sinon');

    // process.nextTick polyfill for browsers
    var nextTick = process && process.nextTick || setTimeout;

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

            it('should call the original function with the expected values', function (done) {
                asyncFn('foo', 'bar', callback);
                asyncFn('foo', 'bar', 'baz');
                nextTick(function () {
                    assert.isTrue(fn.calledTwice);
                    assert.deepEqual(fn.firstCall.args, ['foo', 'bar']);
                    assert.deepEqual(fn.secondCall.args, ['foo', 'bar', 'baz']);
                    done();
                });
            });

            it('should call the callback with the return value of the original function', function (done) {
                fn.withArgs('foo').returns('bar');
                asyncFn('foo', callback);
                nextTick(function () {
                    assert.isTrue(callback.withArgs(undefined, 'bar').calledOnce);
                    done();
                });
            });

            it('should call the callback with the error thrown in the original function', function (done) {
                var err = new Error('bar');
                fn.withArgs('foo').throws(err);
                asyncFn('foo', callback);
                nextTick(function () {
                    assert.isTrue(callback.withArgs(err, undefined).calledOnce);
                    done();
                });
            });

            it('should call the callback in the next tick', function (done) {
                var result = 'foo';
                asynchronize(function () {
                    result += 'bar';
                })();
                result += 'baz';
                nextTick(function () {
                    assert.strictEqual(result, 'foobazbar');
                    done();
                });
            });

        });

    });

} (process));