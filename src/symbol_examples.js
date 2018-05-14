/* eslint-disable no-console */

/*
 * Part 1: Symbols
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
 * CodePen Link: https://codepen.io/Taar/pen/RyxmYr/
*/

/* eslint-disable-next-line no-unused-vars */
const SymbolExample = (console) => {
  // A Symbol factory only accepts one option parameter, a description which is
  // only helpful for debugging.
  // The string given as the description cannot be used for accessing a symbol.
  const mySymbol = Symbol('mySymbol');
  const mySymbolTwo = Symbol('mySymbolTwo');

  // Symbols are unqiue!
  console.log(mySymbol === mySymbolTwo);

  // string passed into the symbol is only use for debugging
  // most browser dev tools will call .toString on a symbol if passed to console.log
  console.log(mySymbol.toString());

  // Symbol is a Factory function, therefore you can't use it with the new keyword
  try {
    // eslint-disable-next-line
    new Symbol();
  } catch (e) {
    console.log(e.message);
  }

  // If you need a global symbol you can register it in the Global registry
  // `Symbol.for` will create a new symbol if it doesn't already exist
  const myGlobalSymbol = Symbol.for('myGlobalSymbol');
  // You can retrieve it by using the key given to `Symbol.for`
  console.log(myGlobalSymbol === Symbol.for('myGlobalSymbol'));
  // If you have a reference to a symbol and what to know it's key in the global registry
  console.log(Symbol.keyFor(myGlobalSymbol));

  // There are also default Symbols you can use like Symbol.iterator or Symbol.match
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#Properties

  // Why are Symbols are useful?
  // To best answer this question is to provide some code examples

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

  const dwight = new Person({ name: 'Dwight', invite: true });
  console.log(dwight.isInvited);
  console.log(dwight.toString(), `${dwight}`);
  // JSON.stringify() ignores Symbol-keyed properties
  console.log(JSON.stringify(dwight));
  // Doesn't show Symbol-keyed properties
  console.log(Object.getOwnPropertyNames(dwight));
  // Only get Symbol-keyed properties
  console.log(Object.getOwnPropertySymbols(dwight));
};

window[Symbol.for('functionReference')] = SymbolExample;
