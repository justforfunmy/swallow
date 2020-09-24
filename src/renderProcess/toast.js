const toast = document.querySelector('.toast');

const hideToast = () => {
  toast.style.opacity = 0;
};

exports.showToast = (message) => {
  toast.innerHTML = message;
  toast.style.opacity = 1;
  setTimeout(hideToast, 1000);
};
