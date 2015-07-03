# formium

> Automated progressive enhancement for `<form>` elements

# Install

```shell
npm install formium --save
```

# Usage

Formium is a progressive enhancement facility that allows you to seamlessly submit plain old HTML forms via AJAX and handle the response in a conventional manner.

### `formium.submit(form, done?)`

Exactly as you would expect, this method will submit a `<form>` asynchronously via AJAX.

```js
form.addEventListener('submit', function handler (e) {
  e.preventDefault();
  formium.submit(form, function responded (err, data) {
    // handle the response
  });
});
```

The form submission mechanism provided by `formium` will:

- Run any [transformers](#formiumtransformfn) on the `<form>` elements before submission
- Submit the `<form>` from within an `<iframe>`
  - The form submission is effectively AJAX
  - Browser loading indicator while the form is being posted _(unlike AJAX)_
  - Form auto-fill values are persisted by the browser _(unlike AJAX)_
- Run the restoration callback for each one of the previously applied [transformers](#formiumtransformfn)
- Disable the `<form>` and `<button>`s inside it while the form loads
- Grab the response once the `<iframe>` finishes loading
- Call `done(err, data)` with `this` set to the `form`

For maximum usefulness, we recommend that you come up with some conventions to handle forms submitted via `formium`. For example, you could make it so responses like `{ redirect: '/foo' }` end up redirecting the user to `/foo` (or rendering that view with a client-side view rendering engine). That convention alone should simplify your application so that you don't have to treat individual forms differently from one another.

### `formium.configure(options)`

You can set a `qs` option that will be used to construct a query string appended to each AJAX form request.

```js
formium.configure({
  qs: function (form) {
    return {
      foo: 'bar'
    };
  }
});
```

### `formium.transform(fn)`

This method allows you to register a `fn(form)` callback that gets called whenever a `form` is submitted. You can prepare the form for submission in any way you want. You can optionally return a callback that restores the form to its original state.

The use case for Formium transforms is for those cases when you have a UX enhancement that breaks the state of the form, say if you were using [insignia][1]. In those cases, you can turn the field's value into something plain, and restore the more complex [insignia][1] tag editor right afterwards.

```js
formium.transform(function fix (form) {
  $(form).find('.nsg-input').forEach(function (input) {
    input.attr('data-prev', input.value());
    input.value(insignia(input).value());
  });
  return function restore () {
    $(form).find('.nsg-input').forEach(function (input) {
      input.value(input.attr('data-prev'));
    });
  };
});
```

# Events

A synthetic custom `formium` event is submitted on `<form>` DOM elements whenever we get complete a submission. It'll contain details about the response. Use this for advanced cases where you need to handle the response in a specialized way.

```js
formium.submit(form);
form.addEventListener('formium', function (e) {
  console.log(e.detail.error);
  console.log(e.detail.data);
});
```

# License

MIT

[1]: https://github.com/bevacqua/insignia
