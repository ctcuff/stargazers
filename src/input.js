const Input = {
  /**
   * @type {{ [key: string]: boolean }}
   */
  keysDown: {}
};

document.body.addEventListener('keydown', event => {
  Input.keysDown[event.code] = true;
});

document.body.addEventListener('keyup', event => {
  Input.keysDown[event.code] = false;
});

export default Input;
