
function show() {
    const menu = document.getElementById('expandingMenu');
    if (menu.classList.contains('hide')) {
        menu.classList.remove('hide');
        menu.classList.add('show');
    } else {
        menu.classList.remove('show');
        menu.classList.add('hide');
    }
}
