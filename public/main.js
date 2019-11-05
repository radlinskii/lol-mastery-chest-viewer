function submitHandler(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;

    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(inputValue),
        };
        const response = fetch('/form', options);
    } catch (error) {
        console.error('fetching error');
        console.error(error);
    }
}

window.onload = function() {
    const form = document.getElementById('form');
    form.addEventListener('submit', submitHandler);
};
