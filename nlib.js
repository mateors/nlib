(function () {

  var $ = function (selector) {
    return new $.fn.init(selector);
  };

  let sel;
  var getElement = function (selector) {
    sel = selector;
    if (typeof selector === "string") {
      return document.querySelector(selector);
    } else if (typeof selector.event == "object") {
      return selector.event.target;
    } else {
      return selector;
    }
  };

  $.fn = $.prototype = {
    init: function (selector) {
      this.elm = getElement(selector);
      return this;
    },
    sel: function () {
      return sel;
    },
    element: function () {
      return this.elm;
    },
    datas: function (key) {
      if (typeof key === "undefined") return this.elm.dataset;
      return this.elm.dataset[key];
    },
    html: function (val) {
      if (typeof val === "undefined") return this.elm.innerHTML;
      this.elm.innerHTML = val;
      return this;
    },
    text: function (txt) {
      if (typeof txt === "string") {
        this.elm.innerText = txt;
        return this;
      } else {
        return this.elm.innerText;
      }
    },
    textc: function (txt) {
      if (txt) {
        this.elm.textContent = txt;
        return this;
      }
      return this.elm.textContent;
    },
    on: function (evtName, selector, cb, options) {
      // Support both (event, handler) and (event, selector, handler)
      if (typeof selector === "function") {
        cb = selector;
        selector = null;
      }

      // Delegated listener (with selector)
      if (selector) {
        this.elm.addEventListener(
          evtName,
          function (event) {
            const potentialTargets = this.querySelectorAll(selector);
            for (let i = 0; i < potentialTargets.length; i++) {
              if (
                potentialTargets[i] === event.target ||
                potentialTargets[i].contains(event.target)
              ) {
                cb.call(event.target, event);
                break;
              }
            }
          },
          options
        );
      }
      // Direct listener
      else {
        if (this.elm instanceof NodeList) {
          this.elm.forEach((el) => el.addEventListener(evtName, cb, options));
        } else {
          this.elm.addEventListener(evtName, cb, options);
        }
      }
      return this;
    },
    click: function (cb) {
      this.elm.onclick = cb;
      return this;
    },
    closest: function (sel) {
      this.elm = this.elm.closest(sel);
      return this;
    },
    children: function (cb) {
      this.elm = Array.from(this.elm.children); // HTMLCollection -> Array
      if (cb) this.elm.forEach(cb);
      return this;
    },
    childrenLength: function () {
      return this.elm.children.length;
    },
    child: function (index) {
      if (typeof index === "number") this.elm = this.elm.childNodes[index];
      else this.elm = this.elm.childNodes;
      return this;
    },
    forms: function () {
      return this.elm.elements;
    },
    files: function () {
      return this.elm.files;
    },
    childItem: function (index) {
      this.elm = Array.from(this.elm.children)[index]; // HTMLCollection
      return this;
    },
    prev: function () {
      this.elm = this.elm.previousElementSibling;
      return this;
    },
    next: function () {
      this.elm = this.elm.nextElementSibling;
      return this;
    },
    siblings: function (selector) {
      const parent = this.elm.parentElement;
      if (!parent) return this; // no parent, no siblings
      let sibs = Array.from(parent.children).filter((el) => el !== this.elm);
      if (selector) {
        sibs = sibs.filter((el) => el.matches(selector));
      }
      this.elm = sibs;
      return this;
    },
    parent: function () {
      this.elm = this.elm.parentElement;
      return this;
    },
    hide: function () {
      this.elm.style.display = "none";
      return this;
    },
    show: function () {
      this.elm.style.display = "";
      return this;
    },
    attr: function (name, value) {
      if (value == null) {
        return this.elm.getAttribute(name);
      } else {
        this.elm.setAttribute(name, value);
        return this;
      }
    },
    tag: function () {
      return this.elm.tagName;
    },
    prop: function (name, value) {
      if (value == null) {
        return this.elm[name];
      } else {
        this.elm[name] = value;
        return this;
      }
    },
    val: function (s) {
      if (s !== undefined) {
        this.elm.value = s;
        return this;
      }
      return this.elm.value || this.elm.textContent || "";
    },
    sindex: function () {
      return this.elm.options.selectedIndex;
    },
    index: function () {
      return this.elm.rowIndex;
    },
    stext: function () {
      return this.elm.options[this.sindex()].text;
    },
    find: function (sel) {
      let gls = this.elm.querySelectorAll(sel);
      if (gls.length == 1) {
        this.elm = gls[0];
      } else {
        this.elm = gls;
      }
      return this;
    },
    findAll: function (sel) {
      this.elm = this.elm.querySelectorAll(sel); // NodeList
      return this;
    },
    isExist: function () {
      if (this.elm == null) return false;
      return this.elm.isConnected;
    },
    focus: function () {
      this.elm.focus();
      return this;
    },
    select: function () {
      this.elm.select();
      return this;
    },
    each: function (cb) {
      // Handles single elements, Arrays, and NodeLists uniformly.
      if (Array.isArray(this.elm) || this.elm instanceof NodeList) {
        this.elm.forEach((el, i) => cb(i, el));
      } else {
        cb(0, this.elm); // single element fallback
      }
      return this;
    },
    isHidden: function () {
      // Uses computed style so CSS-class-driven hiding (not just inline
      // style) is detected correctly. An empty inline display is NOT hidden.
      return window.getComputedStyle(this.elm).display === "none";
    },
    nitem: function (index) {
      if (this.elm instanceof NodeList) return this.elm[index];
    },
    matches: function (sel) {
      return this.elm.matches(sel);
    },
    is: function (sel) {
      return this.elm.matches(sel);
    },
    toggle: function (token, force) {
      this.elm.classList.toggle(token, force);
      return this;
    },
    contains: function (cls) {
      return this.elm.classList.contains(cls);
    },
    has: function (attrName) {
      return this.elm.hasAttribute(attrName);
    },
    hasClass: function (cls) {
      return this.elm.classList.contains(cls);
    },
    classList: function () {
      return this.elm.classList;
    },
    addClass: function (token) {
      if (Array.isArray(token)) {
        this.elm.classList.add(...token);
      } else {
        this.elm.classList.add(token);
      }
      return this;
    },
    append: function () {
      if (typeof arguments[0] === "string")
        this.elm.insertAdjacentHTML("beforeend", arguments[0]);
      else this.elm.append(...arguments);
      return this;
    },
    remove: function () {
      this.elm.remove();
      return this;
    },
    empty: function () {
      while (this.elm.hasChildNodes()) {
        this.elm.removeChild(this.elm.lastChild);
      }
      return this;
    },
    trigger: function (evtName) {
      let cvt = new Event(evtName);
      this.elm.dispatchEvent(cvt);
      return this;
    },
    removeClass: function (token) {
      if (Array.isArray(token)) {
        this.elm.classList.remove(...token);
      } else {
        this.elm.classList.remove(token);
      }
      return this;
    },
    submit: function (cb) {
      if (typeof cb === "undefined" && this.elm instanceof HTMLFormElement)
        this.elm.submit();
      else this.elm.onsubmit = cb;
      return this;
    },
    serialize: function () {
      // Builds a URL-encoded query string ("a=1&b=2") from a form's fields.
      let arr = [];
      for (let i = 0; i < this.elm.elements.length; i++) {
        const element = this.elm.elements[i];
        const type = element.type;
        const name = encodeURIComponent(element.name);

        if (!name) continue;

        if (type === "radio" || type === "checkbox") {
          if (element.checked) {
            arr.push(`${name}=${encodeURIComponent(element.value)}`);
          }
        } else if (type === "file") {
          // Skip file inputs
        } else if (element.tagName === "SELECT" && element.multiple) {
          const selected = Array.from(element.selectedOptions)
            .map((opt) => encodeURIComponent(opt.value))
            .join(",");
          if (selected) arr.push(`${name}=${selected}`);
        } else {
          const value = encodeURIComponent(element.value);
          if (value.length > 0) {
            arr.push(`${name}=${value}`);
          }
        }
      }
      return arr.join("&");
    },
    formData: function () {
      // Builds a FormData object from a form's fields, including files.
      var fdata = new FormData();
      for (let i = 0; i < this.elm.elements.length; i++) {
        var element = this.elm.elements[i];
        if (!element.name || element.name.trim().length === 0) continue; // skip unnamed

        let etype = element.type;
        if (etype === "file") {
          let length = element.files.length;
          for (let j = 0; j < length; j++) {
            fdata.append(element.name, element.files[j], element.files[j].name);
          }
        } else if (
          (etype === "radio" || etype === "checkbox") &&
          element.checked
        ) {
          fdata.append(element.name, element.value);
        } else if (etype === "radio" || etype === "checkbox") {
          // unchecked radio/checkbox: skip
        } else {
          fdata.append(element.name, element.value);
        }
      }
      return fdata;
    },
    formSubmit: async function (url, fdata) {
      try {
        const res = await fetch(url, {
          method: "POST",
          mode: "cors",
          body: fdata,
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.description);
          return;
        }
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    postSubmit: async function (obj) {
      try {
        const rsp = await fetch(obj.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: obj.data,
        });
        if (obj.json) {
          return await rsp.json();
        } else {
          return await rsp.text();
        }
      } catch (error) {
        console.log("ERR_" + error);
      }
    },
    fetch: function (obj) {
      return fetch(obj.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: obj.data,
      });
    },
    css: function (object) {
      for (let key in object) {
        this.elm.style[key] = object[key];
      }
      return this; // for chaining
    },
    removeAttr: function (attrName) {
      this.elm.removeAttribute(attrName);
      return this;
    },
    track: function (config, callback) {
      const observer = new MutationObserver(callback);
      observer.observe(this.elm, config);
      this.observer = observer;
      return this;
    },
    rect: function () {
      return this.elm.getBoundingClientRect();
    },
    top: function () {
      let rect = this.rect();
      return rect.top;
    },
    bottom: function () {
      let rect = this.rect();
      return window.innerHeight - rect.bottom;
    },
    insertElement: function (position, elment) {
      this.elm.insertAdjacentElement(position, elment);
      return this;
    },
    insertHTML: function (position, text) {
      this.elm.insertAdjacentHTML(position, text);
      return this;
    },
    insertAfter: function (element) {
      if (typeof element === "object") {
        this.insertElement("afterend", element);
      } else if (typeof element === "string") {
        this.insertHTML("afterend", element);
      }
      return this;
    },
    after: function () {
      this.elm.after(...arguments);
      return this;
    },
    crateAndInsert: function (strElm) {
      let element = this.createClassElement(strElm);
      this.elm.insertAdjacentElement("afterend", element);
      return this;
    },
    createClassElement: function (elementString) {
      let slc = elementString.split(".");
      const clsElm = document.createElement(slc[0]);
      for (let i = 1; i < slc.length; i++) {
        clsElm.classList.add(slc[i]);
      }
      return clsElm;
    },
    addChild: function (element) {
      this.elm.appendChild(element);
      return this;
    },
  };

  $.fn.init.prototype = $.fn;
  window.$ = $;
})();

$.ajax = function (obj) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    const method = (obj.type || "GET").toUpperCase();
    const async = obj.async !== false; // default to true
    let body;

    xhttp.open(method, obj.url, async);

    // Set response type
    if (obj.dataType) {
      try {
        xhttp.responseType = obj.dataType;
      } catch (e) {
        console.warn("Unsupported responseType:", obj.dataType);
      }
    }

    // Prepare body and headers
    if (obj.contentType === "application/json") {
      body = JSON.stringify(obj.data);
      xhttp.setRequestHeader("Content-Type", "application/json");
    } else if (obj.data instanceof FormData) {
      body = obj.data;
    } else if (typeof obj.data === "object") {
      body = new URLSearchParams(obj.data).toString();
      xhttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    } else {
      body = obj.data;
      xhttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
    }

    // Unified response handler
    xhttp.onload = () => {
      const { status, response } = xhttp;
      if (status >= 200 && status < 300) {
        if (obj.success) obj.success(response);
        resolve(response);
      } else {
        if (obj.error) obj.error(status, response);
        reject(`${status} - ${response}`);
      }
    };

    xhttp.onerror = () => {
      reject("Network error");
    };

    xhttp.send(body);
  });
};
