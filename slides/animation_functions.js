const { easing, tween, keyframes, styler } = window.popmotion;

const animationRegistrySymbol = Symbol.for('animation-registry');

const toCenter = ({ eleWidth = 0, eleHeight = 0 }) => {
  const { clientWidth, clientHeight } = document.body;
  const x = (clientWidth / 2) - (eleWidth / 2);
  const y = (clientHeight / 2) - (eleHeight / 2);
  return [x, y];
};

/*
 * Given two boxes, it'll return the x, y coord to place box1
 * above and center of box2
 * box1: { width, height, x, y }
 * box2: { width, height, x, y }
 */
const toCenterAbove = (box1, box2) => {
  const { width: b1w, height: b1h } = box1;
  const { width: b2w, x: b2x, y: b2y } = box2;
  // Note: in the browser, { x: 0, y: 0 } is the top, left corner.
  const x = ((b2w / 2) + b2x) - (b1w / 2);
  // to figure out the y, we need to subtract the box1's height with the box2's
  // y position. This is because y0 is at the top of the page.
  const y = b2y - b1h;
  return [x, y];
};

const centerAbove = (animationElement, slideElement) => {
  const selector = animationElement.getAttribute('data-element-selector');
  const targetElement = slideElement.querySelector(selector);
  const divStyler = styler(animationElement);

  const animationRect = animationElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  animationElement.style.visibility = 'visible';

  const [x, y] = toCenterAbove(
    animationRect,
    targetRect,
  );

  tween({
    from: {
      x,
      y: (animationRect.height + 100) * -1,
    },
    to: { x, y, rotate: 180 },
    duration: 500,
    ease: easing.backOut,
  }).start(divStyler.set);
};

const slideRight = (animationElement) => {
  const divStyler = styler(animationElement);
  const width = animationElement.clientWidth;
  const height = animationElement.clientHeight;

  animationElement.style.visibility = 'visible';

  const [x, y] = toCenter({ eleWidth: width, eleHeight: height });

  tween({
    from: {
      x: (width + 100) * -1,
      y: (height + 100) * -1,
    },
    to: { x, y, rotate: 180 },
    duration: 1000,
    ease: easing.backOut,
  }).start(divStyler.set);
};

const powerUp = (animationElement) => {
  const divStyler = styler(animationElement);

  keyframes({
    values: [
      {
        color: '#ffffff',
      },
      {
        color: '#fcda00',
      },
      {
        color: '#fc5c00',
      },
      {
        color: '#fc0021',
      },
      {
        color: '#fc5c00',
      },
      {
        color: '#fcda00',
      },
      {
        color: '#ffffff',
      },
    ],
    duration: 3000,
    loop: Infinity,
  }).start(divStyler.set);
};

window[animationRegistrySymbol] = {
  slideRight,
  centerAbove,
  powerUp,
};
