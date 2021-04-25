
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const tabs = $$('.tab-item');
const panes = $$('.tab-pane');
const tabAcive = $('.tab-item.active');
const line = $('.tabs .line');

const setLineStyle = (line,tab) => {
    line.style.left = tab.offsetLeft + 'px';
    line.style.width = tab.offsetWidth + 'px';
}

setLineStyle(line,tabAcive);

tabs.forEach((tab,index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $('.tab-item.active').classList.remove('active');
        $('.tab-pane.active').classList.remove('active');

        this.classList.add('active');
        pane.classList.add('active');

        setLineStyle(line,this);
    }
});