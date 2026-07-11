# nlib.js

A tiny, dependency-free jQuery-style wrapper for DOM manipulation, event
handling, and form submission. No React, no jQuery, no build step — just
include the script and use `$`.

## Install / Include

```html
<script src="nlib.js"></script>
```

That's it. It attaches a global `$` function and `$.ajax`.

## Core concept

`$(selector)` wraps one element (or a NodeList of elements) and returns a
chainable object. `selector` can be:

- A CSS selector string: `$('#myForm')`
- An event object (from an inline handler), which resolves to `event.target`: `$({event: e})`
- An existing DOM element or NodeList, passed straight through: `$(document.body)`

Most methods return `this`, so calls can be chained:

```js
$('#box').addClass('active').css({ color: 'red' }).show();
```

---

## Selecting & traversing

### `find(selector)`
Query descendants. If exactly one match is found, wraps that single element;
otherwise wraps the NodeList.

```js
$('#list').find('li'); // NodeList of <li> if more than 1, single element if only 1
```

### `findAll(selector)`
Always returns a NodeList, even for a single match.

```js
$('#list').findAll('li').each((i, el) => console.log(i, el.textContent));
```

### `children(callback?)`
Wraps an array of child elements. Optional callback runs on each.

```js
$('#list').children(el => el.classList.add('item'));
```

### `childrenLength()`
```js
const count = $('#list').childrenLength();
```

### `childItem(index)`
Get a single child element by index.

```js
const firstLi = $('#list').childItem(0).element();
```

### `child(index?)`
Like `childItem`, but uses `childNodes` (includes text nodes), not
`children`. Omit `index` to get all child nodes.

```js
$('#list').child(0); // first child node (may be a text node)
```

### `closest(selector)`
```js
$(e).closest('.card').addClass('selected');
```

### `parent()` / `prev()` / `next()`
```js
$('#item').parent().addClass('has-active-child');
$('#item').next().hide();
```

### `siblings(selector?)`
```js
$('#item').siblings('.tab').removeClass('active');
```

### `element()`
Unwrap and return the raw DOM node/NodeList.

```js
const raw = $('#myDiv').element();
```

### `isExist()`
Checks whether the matched element is non-null and still attached to the
document.

```js
if ($('#modal').isExist()) { ... }
```

---

## Reading & writing content

### `html(val?)`
Get or set `innerHTML`.

```js
$('#box').html('<b>Hello</b>');
const markup = $('#box').html();
```

### `text(txt?)`
Get or set `innerText`.

```js
$('#label').text('Saved!');
```

### `textc(txt?)`
Get or set `textContent` (doesn't trigger reflow the way `innerText` does).

```js
$('#label').textc('Saved!');
```

### `val(value?)`
Get or set the `.value` of an input (falls back to `.textContent` when
reading if `.value` is empty).

```js
$('#email').val('mostain@lxroot.com');
const email = $('#email').val();
```

---

## Attributes, properties, data, classes

### `attr(name, value?)`
```js
$('#btn').attr('disabled', 'true');
const href = $('#link').attr('href');
```

### `removeAttr(name)`
```js
$('#btn').removeAttr('disabled');
```

### `prop(name, value?)`
Get/set a DOM property directly (e.g. `checked`, `disabled` as booleans).

```js
$('#agree').prop('checked', true);
const isChecked = $('#agree').prop('checked');
```

### `datas(key?)`
Read `dataset`. Omit `key` to get the whole dataset object.

```js
$('#row').datas('id');       // reads data-id
$('#row').datas();           // whole dataset object
```

### `tag()`
```js
$('#el').tag(); // "DIV"
```

### `addClass(token|token[])` / `removeClass(token|token[])` / `toggle(token)`
```js
$('#el').addClass('active');
$('#el').addClass(['active', 'highlighted']);
$('#el').removeClass('active');
$('#el').toggle('open');
```

### `hasClass(cls)` / `contains(cls)`
Both check `classList.contains`.

```js
if ($('#el').hasClass('active')) { ... }
```

### `has(attrName)`
```js
if ($('#el').has('data-id')) { ... }
```

### `matches(selector)` / `is(selector)`
Both proxy `Element.matches`.

```js
if ($(e).is('.card')) { ... }
```

### `classList()`
Returns the raw `classList` object.

```js
$('#el').classList().forEach(c => console.log(c));
```

---

## Visibility & layout

### `show()` / `hide()`
```js
$('#modal').show();
$('#modal').hide();
```

### `isHidden()`
Uses computed style, so it correctly detects elements hidden via CSS
classes, not just inline `style.display = "none"`.

```js
if ($('#modal').isHidden()) { $('#modal').show(); }
```

### `css(propsObject)`
```js
$('#box').css({ color: 'red', fontSize: '14px' });
```

### `rect()` / `top()` / `bottom()`
```js
const box = $('#box').rect();       // full DOMRect
const distanceFromTop = $('#box').top();
const distanceFromBottom = $('#box').bottom();
```

---

## Creating, inserting, removing elements

### `append(htmlStringOrNodes)`
```js
$('#list').append('<li>New item</li>');
$('#list').append(document.createElement('li'));
```

### `addChild(element)`
```js
const li = document.createElement('li');
$('#list').addChild(li);
```

### `insertHTML(position, text)` / `insertElement(position, element)`
`position` is one of `beforebegin`, `afterbegin`, `beforeend`, `afterend`.

```js
$('#box').insertHTML('beforeend', '<span>note</span>');
```

### `insertAfter(elementOrHTMLString)`
```js
$('#box').insertAfter('<div>after box</div>');
```

### `after(...nodes)`
Direct wrapper around `Element.after(...)`.

```js
$('#box').after(document.createElement('hr'));
```

### `crateAndInsert(classString)`
Creates an element from a `"tag.class1.class2"` string and inserts it right
after the current element.

```js
$('#box').crateAndInsert('div.card.shadow');
```

### `createClassElement(classString)`
Same parsing as above, but just returns the created element without
inserting it.

```js
const card = $('#box').createClassElement('div.card.shadow');
```

### `remove()`
```js
$('#toast').remove();
```

### `empty()`
Removes all child nodes (keeps the element itself).

```js
$('#list').empty();
```

---

## Events

### `click(callback)`
Shorthand that sets `.onclick`.

```js
$('#saveBtn').click(() => save());
```


### `on(eventName, [selector], callback, options?)`
Supports plain binding, or event delegation when a `selector` is given.

```js
// Direct binding
$('#form').on('submit', handleSubmit);

// Delegated binding — cb fires when any current or future .btn inside
// #container is clicked
$('#container').on('click', '.btn', function (e) {
  console.log('button clicked', this);
});
```

### `trigger(eventName)`
Dispatches a synthetic event.

```js
$('#input').trigger('change');
```

### `track(mutationObserverConfig, callback)`
Convenience wrapper around `MutationObserver`.

```js
$('#list').track({ childList: true }, (mutations) => {
  console.log('list changed', mutations);
});
```

---

## Forms

### `forms()`
Returns the raw `.elements` collection of a `<form>`.

```js
const elements = $('#myForm').forms();
```

### `files()`
Returns `.files` of a file input.

```js
const files = $('#upload').files();
```

### `serialize()`
Builds a URL-encoded query string from a form's fields (checked
radios/checkboxes only, multi-selects joined with commas, file inputs
skipped).

```js
const qs = $('#myForm').serialize();
// "name=Mostain&email=mostain%40lxroot.com"
```

### `formData()`
Builds a `FormData` object from a form's fields, including files. Skips
unnamed fields and unchecked radios/checkboxes.

```js
const fd = $('#myForm').formData();
fetch('/api/submit', { method: 'POST', body: fd });
```

### `submit(callback?)`
With no callback on an actual `<form>` element, submits it natively.
Otherwise, sets `.onsubmit`.

```js
$('#myForm').submit((e) => {
  e.preventDefault();
  console.log($('#myForm').serialize());
});
```

### `select()` / `focus()`
```js
$('#input').focus();
$('#input').select(); // selects text content of the input
```

### `sindex()` / `stext()`
For `<select>` elements: selected index and selected option's text.

```js
$('#country').sindex(); // 2
$('#country').stext();  // "Canada"
```

### `index()`
For a `<tr>`, returns its `rowIndex` within the table.

```js
$('#row5').index(); // 4
```

---

## Talking to a server

### `$.ajax(options)`
Promise-based `XMLHttpRequest` wrapper.

```js
$.ajax({
  url: '/api/users',
  type: 'GET',
  dataType: 'json',
  success: (data) => console.log('got', data),
  error: (status, resp) => console.error(status, resp),
}).then((data) => {
  // also resolves as a Promise
});
```

Options:
| key | description |
|---|---|
| `url` | request URL |
| `type` | HTTP method, default `GET` |
| `data` | body — object (form-encoded), `FormData`, or raw string |
| `contentType` | set to `"application/json"` to JSON-encode `data` |
| `dataType` | sets `xhttp.responseType` (e.g. `"json"`) |
| `async` | defaults to `true` |
| `success(response)` | called on 2xx |
| `error(status, response)` | called on non-2xx |

```js
// JSON POST
$.ajax({
  url: '/api/users',
  type: 'POST',
  contentType: 'application/json',
  data: { name: 'Mostain', email: 'mostain@lxroot.com' },
  success: (res) => console.log(res),
});
```

### `formSubmit(url, formData)`
Posts a `FormData` object (e.g. from `.formData()`) and parses the JSON
response.

```js
const fd = $('#myForm').formData();
const result = await $('#myForm').formSubmit('/api/submit', fd);
```

### `postSubmit({ url, data, json })`
Posts URL-encoded `data` (e.g. from `.serialize()`).

```js
const qs = $('#myForm').serialize();
const result = await $('#myForm').postSubmit({
  url: '/api/submit',
  data: qs,
  json: true, // false -> returns text instead of parsed JSON
});
```

### `fetch({ url, data })`
Low-level: returns the raw `fetch()` Promise for a URL-encoded POST (you
handle `.json()`/`.text()` yourself).

```js
const res = await $('#myForm').fetch({ url: '/api/submit', data: qs });
const json = await res.json();
```

---

## Iteration

### `each(callback)`
Works uniformly whether the wrapped value is a single element, an Array,
or a NodeList — callback always receives `(index, element)`.

```js
$('.card').findAll('.card').each((i, el) => {
  console.log(i, el);
});
```

### `nitem(index)`
Get a specific item out of a wrapped NodeList.

```js
const secondCard = $('.card').nitem(1);
```

---

## Full example: submit a form via AJAX

```html
<form id="signup">
  <input name="name" />
  <input name="email" type="email" />
  <input name="avatar" type="file" />
  <button type="submit">Sign up</button>
</form>

<script src="nlib.js"></script>
<script>
  $('#signup').submit(async (e) => {
    e.preventDefault();
    const fd = $('#signup').formData();
    try {
      const result = await $('#signup').formSubmit('/api/signup', fd);
      $('#signup').html('<p>Thanks for signing up!</p>');
    } catch (err) {
      console.error(err);
    }
  });
</script>
```

## Full example: delegated click handling in a dynamic list

```html
<ul id="todo-list"></ul>
<script>
  $('#todo-list').on('click', '.delete-btn', function (e) {
    $(this).closest('li').remove();
  });

  function addTodo(text) {
    $('#todo-list').append(
      `<li>${text} <button class="delete-btn">x</button></li>`
    );
  }
</script>
```
