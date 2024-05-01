document.createElement('figure');
document.createElement('figcaption');
document.addEventListener ('selectionchange', function (){
  // getSelection().toString();
}, false);
$(document).ready(function () {
  $('.header__burger,.header__list').click(function (event) {
    $('.header__burger,.header__menu').toggleClass('active');
    $('body').toggleClass('lock');
  });
  $('.clear').click(function (event) {
    $('body').toggleClass('lock');
  });
});

function styliString(color) {
  const selection = getSelection();
  const range = selection.getRangeAt(0);
  const selectionContents = range.extractContents();
  const span = document.createElement("span");
  
  for(const oldSpan of selectionContents.querySelectorAll(".selected")) {
    for(const childNode of [...oldSpan.childNodes])
      oldSpan.parentNode.insertBefore(childNode, oldSpan);
    
    oldSpan.remove();
  }
  
  selectionContents.normalize();
  span.classList.add("selected");
  span.style.backgroundColor = color;
  span.appendChild(selectionContents);
  range.insertNode(span);
}

document.addEventListener("click", ({ target }) => {
  if(target.classList.contains("color")) {
    styliString(target.dataset.color || target.textContent);
  }
});
