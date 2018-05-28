/* eslint-disable no-console, no-restricted-syntax */

/*
 * Part 3: Generators with `[Symbol.iterator]`
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
  console.log(`People Invited: ${[...party2018]}`);
};

window[Symbol.for('functionReference')] = GeneratorExmaples;
