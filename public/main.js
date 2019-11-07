async function submitHandler(event) {
    event.preventDefault();
    const inputValue = event.target[0].value;

    try {
        const options = {
            method: 'POST',
            body: JSON.stringify(inputValue),
        };
        const response = await fetch('/form', options);
        if (response.ok) {
            const responseBody = await response.json();

            console.log(responseBody);
        } else {
            console.error(response);
        }
    } catch (error) {
        console.error('fetching error');
        console.error(error);
    }
}

window.onload = function() {
    const form = document.getElementById('form');
    form.addEventListener('submit', submitHandler);
};
