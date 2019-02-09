const parseDate = d3.timeParse('%s');

function switchSelectedButton(oldButton, newButton) {
    oldButton.attr('class', null);
    newButton.attr('class', 'selected');
}

function selectButton(button) {
    button.attr('class', 'selected');
}

function deselectButton(button) {
    button.attr('class', null);
}