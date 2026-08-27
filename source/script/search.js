var lastMatches = []; // текстовые узлы, подсвеченные предыдущим поиском

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function clearHighlights() {
  lastMatches.forEach(function (mark) {
    var parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
    parent.removeChild(mark);
    parent.normalize();
  });
  lastMatches = [];
}

function FindOnPage(inputId) { // ищет текст на странице, в параметр передается ID поля для ввода
  var input = document.getElementById(inputId);
  if (!input) {
    alert("Введенная фраза не найдена");
    return;
  }

  var textToFind = input.value.trim();
  clearHighlights();

  if (textToFind === "") {
    alert("Вы ничего не ввели");
    return;
  }

  var regex = new RegExp(escapeRegExp(textToFind), "gi");

  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (!node.nodeValue || !node.parentElement) return NodeFilter.FILTER_REJECT;
      if (node.parentElement.closest("script, style, .search, mark.search-highlight")) return NodeFilter.FILTER_REJECT;
      regex.lastIndex = 0;
      return regex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  var textNodes = [];
  var node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach(function (textNode) {
    var text = textNode.nodeValue;
    regex.lastIndex = 0;
    var frag = document.createDocumentFragment();
    var lastIndex = 0;
    var match;
    while ((match = regex.exec(text))) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      var mark = document.createElement("mark");
      mark.className = "search-highlight";
      mark.textContent = match[0];
      frag.appendChild(mark);
      lastMatches.push(mark);
      lastIndex = match.index + match[0].length;
    }
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
    textNode.parentNode.replaceChild(frag, textNode);
  });

  if (lastMatches.length === 0) {
    alert("Ничего не найдено, проверьте правильность ввода!");
    return;
  }

  lastMatches[0].scrollIntoView({ behavior: "smooth", block: "center" });
}

function ClearSearch(inputId) { // очищает подсветку и поле поиска, не уходя со страницы
  clearHighlights();
  var input = document.getElementById(inputId);
  if (input) input.value = "";
}
