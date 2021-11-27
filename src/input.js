const Input = {
  /**
   * @type {{ [key: string]: boolean }}
   */
  keysDown: {}
};

document.body.addEventListener('keydown', event => {
  Input.keysDown[event.key] = true;
});

document.body.addEventListener('keyup', event => {
  Input.keysDown[event.key] = false;
});

export default Input;
