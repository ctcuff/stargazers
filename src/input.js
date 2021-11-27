const Input = {
  /**
   * @type {Array<{ keyCode: string, func: (event: KeyboardEvent) => void}>}
   */
  _keyListeners: [],
  /**
   * @type {Array<(event: MouseEvent) => void>}
   */
  _mouseListeners: [],
  /**
   * @type {{ [key: string]: boolean }}
   */
  keysDown: {},
  /**
   * @param {string} keyCode The name of the keyboard key to register (case insensitive)
   * @param {(event: KeyboardEvent) => void} func The function to invoke with `keyCode` is pressed
   */
  addKeyPressListener(keyCode, func) {
    this._keyListeners.push({
      keyCode,
      func
    });
  },
  /**
   * @param {(event: MouseEvent) => void} func
   */
  addClickListener(func) {
    this._mouseListeners.push(func);
  },
  /**
   * @param {(event: KeyboardEvent) => void} func
   */
  removeKeyPressListener(func) {
    this._keyListeners = this._keyListeners.filter(listener => listener.func !== func);
  },
  /**
   * @param {(event: MouseEvent) => void} func
   */
  removeClickListener(func) {
    this._mouseListeners = this._mouseListeners.filter(listener => listener !== func);
  }
};

document.body.addEventListener('keydown', event => {
  Input.keysDown[event.key] = true;
});

document.body.addEventListener('keyup', event => {
  Input.keysDown[event.key] = false;
});

document.addEventListener('mousedown', event => {
  Input._mouseListeners.forEach(func => func(event));
});

document.addEventListener('keypress', event => {
  if (event.repeat) {
    return;
  }

  Input._keyListeners.forEach(listener => {
    if (listener.keyCode.toLowerCase() === event.code.toLowerCase()) {
      listener.func(event);
    }
  });
});

export default Input;
