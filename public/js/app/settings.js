// This basically allows us to change which setting of our account we want to display
const optionSettings = document.querySelectorAll('.optionSettings');
const accountContent = document.querySelectorAll('.accountContent');
accountContent[0].style.display = 'block';

optionSettings.forEach((item,index) => item.addEventListener('click', () => {
  accountContent.forEach(container => container.style.display = 'none');
  accountContent[index].style.display = 'block';
}));

