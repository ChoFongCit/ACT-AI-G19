// Showing the sub menu function
function show() {
	var x = document.getElementById("expandingMenu");
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}
async function formSubmit(event) {
    event.preventDefault(); 

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const url = form.getAttribute('action');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            messageDiv.innerHTML = `<div style="color: green;">${result.msg}</div>`;
            form.reset();
        } else {
            messageDiv.innerHTML = `<div style="color: red;">${result.msg}</div>`;
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerHTML = `<div style="color: red;">An error occurred.</div>`;
    }
}

function toggleForm() {
    const form = document.getElementById('updateForm');
    form.classList.toggle('hidden'); // Toggles the 'hidden' class
  }
  
