const { easing, tween, styler } = window.popmotion;

const animationRegistrySymbol = Symbol.for('animation-registry');

const toCenter = ({ eleWidth = 0, eleHeight = 0 }) => {
  const { clientWidth, clientHeight } = document.body;
  const x = (clientWidth / 2) - (eleWidth / 2);
  const y = (clientHeight / 2) - (eleHeight / 2);
  return [x, y];
};

const slideRight = (element) => {
  console.log('woot');
  const divStyler = styler(element);
  const width = element.clientWidth;
  const height = element.clientHeight;

  element.style.visibility = 'visible';

  const [x, y] = toCenter({ eleWidth: width, eleHeight: height });

  tween({
    from: {
      x: (width + 100) * -1,
      y: (height + 100) * -1,
    },
    to: { x, y, rotate: 180 },
    duration: 1000,
    ease: easing.backOut,
    // flip: Infinity,
    // elapsed: 500,
    // loop: 5,
    // yoyo: 5
  }).start(divStyler.set);

};

window[animationRegistrySymbol] = {
  slideRight,
};
