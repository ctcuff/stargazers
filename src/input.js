const Input = {
  /**
   * @type {Array<{ code: string, func: (event: KeyboardEvent) => void}>}
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
   * @param {string} code The name of the keyboard key to register (case insensitive)
   * @param {(event: KeyboardEvent) => void} func The function to invoke with `code` is pressed
   */
  addKeyPressListener(code, func) {
    this._keyListeners.push({
      code,
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

  Input._keyListeners.forEach(listener => {
    if (listener.code.toLowerCase() === event.code.toLowerCase()) {
      listener.func(event);
    }
  });
});

document.body.addEventListener('keyup', event => {
  Input.keysDown[event.key] = false;
});

document.addEventListener('mousedown', event => {
  Input._mouseListeners.forEach(func => func(event));
});

export default Input;
