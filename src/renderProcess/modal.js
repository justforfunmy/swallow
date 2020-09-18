const addFieldBtn = document.querySelector('#add-field');
const fieldInput = document.querySelector('#field');
const selectorInput = document.querySelector('#selector');
const sourceInput = document.querySelector('#source');
const formModal = document.querySelector('#form-modal');
let modalTarget = null;

exports.setTarget = (target) => {
  modalTarget = target;
};

addFieldBtn.addEventListener('click', () => {
  if (modalTarget) {
    const textarea = modalTarget.querySelector('textarea');
    const value = {
      field: fieldInput.value,
      selector: selectorInput.value,
      source: sourceInput.value
    };
    console.log(value);
    textarea.value = JSON.stringify(value, null, 2);
    formModal.style.display = 'none';
  }
});
