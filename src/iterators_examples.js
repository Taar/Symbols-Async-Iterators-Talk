/* eslint-disable no-console, no-restricted-syntax */

/*
 * Part 2: Iterators `[Symbol.iterator]`
 * Reference:
 * CodePen Link:
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
const IteratorsExample = (console) => {
  /* Only works with Native JS
   * NOTE: Very interesting, need to look into this more
  class Party extends Set {
    // gives us access to the Global
    constructor (guests = []) {
      super(guests);
    }
    static get [Symbol.species] () { return Set; }
  }
  */

  const Party = (() => {
    const guestList = Symbol('guestList');

    return class Party_ {
      constructor(guests = []) {
        this[guestList] = new Set(guests);
      }

      add(guest) {
        this[guestList].add(guest);
      }

      // There is a better way to do this
      get guestList() {
        return this[guestList].values();
      }

      [Symbol.iterator]() {
        // [Symbol.iterator] needs to return an iterator
        // Luckily for us, the Set object has an iterator for all the values in the set
        // therefore we can just return that.
        // You could also return an array here
        // eg return Array.from(this[guestList].values());
        return this[guestList].values();
      }
    };
  })();

  const party2018 = new Party();
  party2018.add(new Person({ name: 'Jim', invite: true }));
  party2018.add(new Person({ name: 'Pam', invite: true }));
  party2018.add(new Person({ name: 'Michael', invite: false }));
  party2018.add(new Person({ name: 'Dwight', invite: true }));
  party2018.add(new Person({ name: 'Andy', invite: true }));
  const guests = party2018.guestList;
  // Iterators return an object like { name: Function }
  console.log(guests.next);
  // next should return { value: Object, done: Boolean }
  // done will be true when there are no more items to iterator over.
  console.log(guests.next());
  console.log(guests.next());
  console.log(guests.next());
  console.log(guests.next());
  console.log(guests.next());
  console.log(guests.next());
  console.log('---');
  console.log(Array.from(party2018.guestList));
  for (const guest of party2018.guestList) {
    console.log('guestList', guest);
  }
  console.log(Array.from(party2018));
  for (const guest of party2018) {
    console.log('Symbol.iterator', guest);
  }
};

window[Symbol.for('functionReference')] = IteratorsExample;
