// const assert = require('assert');

// // class가 무엇인지 확인하고 그리고 mocha에서 어떻게 기능들을 테스트 하는지 살펴본다.

// class Car {
//   park() {
//     return 'stopped';
//   }
//   drive() {
//     return 'vroom';
//   }
// }

// let car;

// beforeEach(() => {
//   car = new Car()
// });

// describe('Class car', () => {
//   it('can park', () => {
//     assert.equal(car.park(), 'stopped'); // undefined.park()
//   });

//   it('can drive', () => {
//     assert.equal(car.drive(), 'vroom');
//   })
// });
