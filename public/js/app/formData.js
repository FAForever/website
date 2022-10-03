const form = document.getElementById('form');
const formData = new FormData(form);

for (const [key, value] of formData) {
  console.log(`I'm the key, ${key}, and I'm the value, ${value}!`);
}
