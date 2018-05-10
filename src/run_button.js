const EventHandler = {
  handleEvent(e) {
    this[`on${e.type}`](e);
  },
};

const noop = event => event.preventDefault();

const clickHandlerFactory = (clickHandler = noop) =>
  Object.create(EventHandler, {
    onclick: {
      value: clickHandler,
    },
  });

// TODO injection of document and functions
const createButton = ({ handler = noop, text = 'run', classList = [] }) => {
  const button = document.createElement('button');
  const textNode = document.createTextNode(text);
  const clickHandler = clickHandlerFactory(handler);

  button.classList.add(...classList);
  button.appendChild(textNode);
  button.addEventListener('click', clickHandler, true);

  return button;
};

const root = document.querySelector('#root');

const functionReferenceSymbol = Symbol.for('functionReference');

const runButton = createButton({
  handler(event) {
    event.preventDefault();
    window[functionReferenceSymbol](console);
  },
});

root.appendChild(runButton);
