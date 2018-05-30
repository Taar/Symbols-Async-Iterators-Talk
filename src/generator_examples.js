/* eslint-disable no-console, no-restricted-syntax */

/*
 * Part 3: Generators with `[Symbol.iterator]`
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
 * CodePen Link: https://codepen.io/Taar/pen/oygeya
*/

const Person = (() => {
  const invited = Symbol('invited');

  return class Person_ {
    constructor({ name, invite = false }) {
      this.name = name;
      this[invited] = invite;
    }

    set isInvited(inviteStatus) {
      this[invited] = inviteStatus;
    }

    get isInvited() {
      return this[invited];
    }

    // Works with Object.prototype.toString()
    get [Symbol.toStringTag]() {
      return this.name;
    }
  };
})();

/* eslint-disable-next-line no-unused-vars */
const GeneratorExmaples = (console) => {
  const Party = (() => {
    const guestList = Symbol('guestList');

    return class Party_ {
      constructor(guests = []) {
        this[guestList] = new Set(guests);
      }

      add(guest) {
        this[guestList].add(guest);
      }

      uninvite(names) {
        const changeInvitationStatus =
          guest => (uninvite, name) => !(!uninvite || guest.name === name);
        for (const guest of this[guestList].values()) {
          guest.isInvited = names.reduce(changeInvitationStatus(guest), true);
        }
      }

      * [Symbol.iterator]() {
        for (const guest of this[guestList].values()) {
          if (guest.isInvited) {
            yield guest.name;
          }
        }
      }
    };
  })();

  /*
  Note: `[Symbol.iterator]` only assumes that it's return an object with the following signature:
  { next: Function }
  which should return
  { value: Object, done: Boolean }

  So you could something like this:
  class Chapeaux {
    [Symbol.iterator] () {
      const couleurDuChapeau = ['rouge', 'orange', 'jaune', 'vert', 'bleu', 'violet'];
      return {
        next: () => ({
          done: couleurDuChapeau.length === 0,
          value: couleurDuChapeau.shift()
        })
      };
    }
  }
  */

  // Can't use arrow functions to create generators
  // https://stackoverflow.com/questions/27661306/can-i-use-es6s-arrow-function-syntax-with-generators-arrow-notation#27661420
  function* oneAndTwo() {
    yield 1;
    yield 2;
  }

  const generator = oneAndTwo();
  console.log(generator.next());
  console.log(generator.next());
  console.log(generator.next());

  console.log('---');

  function* addGen(start) {
    let x = start;
    let y = yield start;
    while (true) {
      x += y;
      y = yield x;
    }
  }

  const add = addGen(0);
  console.log(add.next());
  console.log(add.next(5));
  console.log(add.next(5));

  console.log('---');

  function* countingGen() {
    yield* oneAndTwo();
    yield 3;
    yield 4;
  }

  const counting = countingGen();
  console.log(counting.next());
  console.log(counting.next());
  console.log(counting.next());
  console.log(counting.next());
  console.log(counting.next());

  console.log('---');

  function* pizzaToppings() {
    yield* ['cheese', 'bacon', 'pepperoni'];
  }

  const pizza = pizzaToppings();
  console.log(pizza.next());
  console.log(pizza.next());
  console.log(pizza.next());
  console.log(pizza.next());

  const party2018 = new Party();
  party2018.add(new Person({ name: 'Jim', invite: true }));
  party2018.add(new Person({ name: 'Pam', invite: true }));
  party2018.add(new Person({ name: 'Michael', invite: true }));
  party2018.add(new Person({ name: 'Dwight', invite: true }));
  party2018.add(new Person({ name: 'Andy', invite: true }));

  for (const guest of party2018) {
    console.log(guest);
  }

  party2018.uninvite(['Michael', 'Andy']);

  const guests = [...party2018];
  console.log(`People Invited: ${guests.join(', ')}`);
};

window[Symbol.for('functionReference')] = GeneratorExmaples;
