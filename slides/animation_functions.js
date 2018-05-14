const {
  easing,
  tween,
  keyframes,
  styler,
} = window.popmotion;

const toCenterOfElement = ({ eleWidth = 0, eleHeight = 0, element }) => {
  const { clientWidth, clientHeight } = element;
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

// Cell names and either positions
const GRID_CELLS_5BY5 = [
  ['1x1', 0, 0],
  ['1x2', 0, 1],
  ['1x3', 0, 2],
  ['1x4', 0, 3],
  ['1x5', 0, 4],

  ['2x1', 1, 0],
  ['topLeft', 1, 1],
  ['centerLeft', 1, 2],
  ['bottomLeft', 1, 3],
  ['2x5', 1, 4],

  ['3x1', 2, 0],
  ['topCenter', 2, 1],
  ['center', 2, 2],
  ['bottomCenter', 2, 3],
  ['3x5', 2, 4],

  ['4x1', 3, 0],
  ['topRight', 3, 1],
  ['centerRight', 3, 2],
  ['bottomRight', 3, 3],
  ['4x5', 3, 4],

  ['5x1', 4, 0],
  ['5x2', 4, 1],
  ['5x3', 4, 2],
  ['5x4', 4, 3],
  ['5x5', 4, 4],
];

/**
 * Factory for creating a position grid over top the given element
 * The grid is 5 by 5 however, only the inner 3 by 3 grid is within the
 * elements bounds.
 * Any cell named NxN are outside the element's bounds
 * eg.
 * -------------------------------------------------------
 * | 1x1 | 2x1        | 3x1          | 4x1         | 5x1 |
 * | 1x2 | topLeft    | topCenter    | topRight    | 5x2 |
 * | 1x3 | centerLeft | center       | centerRight | 5x3 |
 * | 1x4 | bottomLeft | bottomCenter | bottomRight | 5x4 |
 * | 1x5 | 2x5        | 3x5          | 4x5         | 5x5 |
 * -------------------------------------------------------
 */
const gridFactory = (element) => {
  const { width, height } = element.getBoundingClientRect();
  const cellWidth = width / 3;
  const cellHeight = height / 3;
  // The relative position of the top, left corner of the cell.
  // The outter cells are outside the bounds of the element.
  // Therefore topLeft would have the coords of 0,0 while
  // 1x1 would be -5,-5 assuming the inner cells width and height are 5
  // To figure out the inner cells width and height, we need to take the
  // width and height on the element and divide them by 3 (the inner grid size)
  // So assuming the element is 15 by 3, the inner cells height and width would
  // be 5 by 1
  // 5x3 would then be 15, 1
  // eg.
  // columns = [-5, 0, 5, 10, 15]
  // rows = [-1, 0, 1, 2, 3]
  const columns = [(cellWidth * -1), 0, cellWidth, cellWidth * 2, cellWidth * 3];
  const rows = [(cellHeight * -1), 0, cellHeight, cellHeight * 2, cellHeight * 3];

  return GRID_CELLS_5BY5.reduce((grid, [key, columnIdx, rowIdx]) => ({
    ...grid,
    [key]: {
      // Add half the row width to get the cells center point
      x: columns[columnIdx] + (cellWidth / 2),
      y: rows[rowIdx] + (cellHeight / 2),
    },
  }), {});
};

const slideFromTo = grid => animationElement => () => {
  const divStyler = styler(animationElement);
  const fromKey = animationElement.getAttribute('data-animation-from');
  const toKey = animationElement.getAttribute('data-animation-to');
  const fromPosition = grid[fromKey];
  const toPosition = grid[toKey];

  const { height, width } = animationElement.getBoundingClientRect();

  animationElement.style.visibility = 'visible';

  return tween({
    from: {
      x: fromPosition.x - (width / 2),
      y: fromPosition.y - (height / 2),
      rotate: 180,
    },
    to: {
      x: toPosition.x - (width / 2),
      y: toPosition.y - (height / 2),
    },
    duration: 1000,
    ease: easing.backOut,
  }).start(divStyler.set);
};

const below = (animationElement, slideElement) => () => {
  const selector = animationElement.getAttribute('data-element-selector');
  const targetElement = slideElement.querySelector(selector);
  const divStyler = styler(animationElement);

  const animationRect = animationElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  animationElement.style.visibility = 'visible';

  const { x, y } = targetRect;

  return tween({
    from: {
      x,
      y: (animationRect.height + 100) * -1,
    },
    to: {
      x,
      y, // not sure why I don't need to add the target's height here
      rotate: 180,
    },
    duration: 500,
    ease: easing.backOut,
  }).start(divStyler.set);
};

const centerAbove = (animationElement, slideElement) => () => {
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

  return tween({
    from: {
      x,
      y: (animationRect.height + 100) * -1,
    },
    to: { x, y, rotate: 180 },
    duration: 500,
    ease: easing.backOut,
  }).start(divStyler.set);
};

const slideRight = animationElement => () => {
  const divStyler = styler(animationElement);
  const width = animationElement.clientWidth;
  const height = animationElement.clientHeight;

  animationElement.style.visibility = 'visible';

  const [x, y] = toCenterOfElement({
    eleWidth: width,
    eleHeight: height,
    element: document.body,
  });

  return tween({
    from: {
      x: (width + 100) * -1,
      y: (height + 100) * -1,
    },
    to: { x, y, rotate: 180 },
    duration: 1000,
    ease: easing.backOut,
  }).start(divStyler.set);
};

const powerUp = animationElement => () => {
  const divStyler = styler(animationElement);

  return keyframes({
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

window.addEventListener('load', () => {
  const BODY_GRID = gridFactory(document.body);

  window[Symbol.for('animation-registry')] = {
    slideRight,
    centerAbove,
    powerUp,
    below,
    slideFromTo: slideFromTo(BODY_GRID),
  };
});
