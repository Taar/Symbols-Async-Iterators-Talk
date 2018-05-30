/* eslint-disable no-console, no-restricted-syntax */

/*
 * Part 4: Async Iterator `[Symbol.asyncIterator]`
 * Reference: https://github.com/tc39/proposal-async-iteration
 * CodePen Link: https://codepen.io/Taar/pen/ZRYJPa
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

/*
class PartDatabase {
    ...

  [Symbol.asyncIterator]() {
    const guests = this[guestList].values();
    return {
      next: () => {
        const guestPromise = guests.next()
        (new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({ value: guest.value.name, done: guest.done });
          }, 1000);
        }));
      }
    };
  }

  // Or

  * [Symbol.asyncIterator]() {
    const guests = this[guestList].values();
    for (const guest of guests) {
      yield await (new Promise((resolve, reject) =>
        setTimeout(() => resolve(guest.name), 1000)
      ));
    }
  }
}

const partyDB = new PartyDatabase();
partyDB.add(new Person({name: 'Jim', invite: true}));
partyDB.add(new Person({name: 'Pam', invite: true}));
partyDB.add(new Person({name: 'Michael', invite: true}));
partyDB.add(new Person({name: 'Dwight', invite: true}));
partyDB.add(new Person({name: 'Andy', invite: true}));

for await (const guest of partyDB) {
  console.log(guest);
}

Note: Also added support for async generator functions
async function* Generator () {
  yeild await fetch(...);
}
*/

/*
Part 5: Async now!

This is how you can get this feature now (sort of)
*/

/* eslint-disable-next-line no-unused-vars */
const AsyncNowExamples = (console) => {
  const PartyDatabase = (() => {
    const guestList = Symbol('guestList');

    class Party {
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
        // { value: Promise, done: Boolean }
        const guests = this[guestList].values();
        for (const guest of guests) {
          yield new Promise(resolve =>
            setTimeout(() => resolve(guest.name), 1000));
        }
      }
    }

    return Party;
  })();

  const partyDB = new PartyDatabase();
  partyDB.add(new Person({ name: 'Jim', invite: true }));
  partyDB.add(new Person({ name: 'Pam', invite: true }));
  partyDB.add(new Person({ name: 'Michael', invite: true }));
  partyDB.add(new Person({ name: 'Dwight', invite: true }));
  partyDB.add(new Person({ name: 'Andy', invite: true }));

  (async () => {
    for (const guestPromise of partyDB) {
      /* eslint-disable-next-line no-await-in-loop */
      const guest = await guestPromise;
      console.log(guest);
    }
  })();
};

window[Symbol.for('functionReference')] = AsyncNowExamples;
