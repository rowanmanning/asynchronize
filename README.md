
Asynchronize
============

Make synchronous functions look asynchronous.

**Current Version:** *1.1.0*  
**Build Status:** [![Build Status][travis-status]][travis]  
**Node Support:** *0.6, 0.8, 0.10*  
**Browser Support:** *Android Browser 2.2–4.2, Firefox 3.6, Firefox 4–19, Google Chrome 14–26, Internet Explorer 6–10, Mobile Safari iOS 3–6, Opera 12.10, Safari 5–6*


Why?
----

I needed a simple way to make synchronous JavaScript functions look asynchronous, for use in control flow libraries like [async][async]. Thus, Asynchronize was born.

As an oversimplified example, if you have a function which takes an input and returns an output which works like this:

```js
var result = lowercase('FOO');
console.log(result); // 'foo'
```

Asynchronize will turn it into a function which works like this:

```js
lowercase('FOO', function (error, result) {
    console.log(result); // 'foo'
});
```


Getting Started
---------------

You can use Asynchronize on the server side with [Node.js][node] and npm:

```sh
$ npm install asynchronize
```

On the client side, you can either install Asynchronize through [Component][component]:

```sh
$ component install rowanmanning/asynchronize
```

or by simply including `asynchronize.js` in your page:

```html
<script src="path/to/lib/asynchronize.js"></script>
```


Usage
-----

In Node.js or using Component, you can include Asynchronize in your script by using require:

```js
var asynchronize = require('asynchronize');
```

Asynchronize also works with AMD-style module loaders, just specify it as a dependency.

If you're just including with a `<script>`, `asynchronize` is available as a function in the global scope.


### asynchronize( fn )

Create an async-style version of `fn`.  
**fn:** *(function)* The function to convert.  
**return:** *(function)* Returns the new async-style function.

```js
function lowercase (val) {
    return val.toLowerCase();
}
var lowercaseAsync = asynchronize(lowercase);
```

The created function accepts any number of arguments, the last one being used as the callback if it's a function. The callback is called with two arguments; an error object (the result of a `throw` within the original function), and a result (the return value of the original function).

Let's extend the example to throw errors:

```js
function lowercase (val) {
    if (typeof val !== 'string') {
        throw new Error('Expected string');
    }
    return val.toLowerCase();
}
var lowercaseAsync = asynchronize(lowercase);

// Call with string
lowercaseAsync('FOO', function (error, result) {
    console.log(error); // undefined
    console.log(result); // 'foo'
});

// Call with non-string
lowercaseAsync(123, function (error, result) {
    console.log(error); // new Error('Expected string')
    console.log(result); // undefined
});
```


Development
-----------

To develop Asynchronize, you'll need to clone the repo and install dependencies with `make deps`. If you're on Windows, you'll also need to install [Make for Windows][make].

Once you're set up, you can run the following commands:

```sh
$ make deps         # Install dependencies
$ make lint         # Run JSHint with the correct config
$ make test         # Run unit tests in Node
$ make test-server  # Run a server for browser unit testing (visit localhost:3000)
```

When no build target is specified, make will run `deps lint test`. This means you can use the following command for brevity:

```sh
$ make
```

Code with lint errors or no/failing tests will not be accepted, please use the build tools outlined above.


License
-------

Asynchronize is licensed under the [MIT][mit] license.



[async]: https://github.com/caolan/async
[component]: https://github.com/component/component
[make]: http://gnuwin32.sourceforge.net/packages/make.htm
[mit]: http://opensource.org/licenses/mit-license.php
[node]: http://nodejs.org/
[travis]: https://travis-ci.org/rowanmanning/asynchronize
[travis-status]: https://travis-ci.org/rowanmanning/asynchronize.png?branch=master
