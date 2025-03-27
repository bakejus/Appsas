const Person = require('../../src/classes/Person.js');

describe('Person Class', () => {
  let person;

  beforeEach(() => {
    person = new Person();
  });
//padaryt parametrizuotus testus
  test('should initialize with default values', () => {
    expect(person.name).toBe(""); // Default name should be empty
    expect(person.height).toBe(170); // Default height = 170
    expect(person.weight).toBe(60); // Default weight = 60
    expect(person.strideLength).toBe(70.38); // Default strideLength = 170 * 0.414
  });

  test('should change name successfully', () => {
    person.changeName("John");
    expect(person.name).toBe("John");
  });

  test('should throw error when changing name to an empty string', () => {
    expect(() => person.changeName("")).toThrow("Name should not be empty");
  });

  test('should change height successfully and update stride length', () => {
    person.changeHeight(180);
    expect(person.height).toBe(180);
    expect(person.strideLength).toBe(180 * 0.414);
  });

  test('should throw error when changing height to a non-number value', () => {
    expect(() => person.changeHeight("not a number")).toThrow("Height should be 50-300 cm");
  });

  test('should throw error when changing height to an invalid value', () => {
    expect(() => person.changeHeight(400)).toThrow("Height should be 50-300 cm");
  });

  test('should change weight successfully', () => {
    person.changeWeight(75);
    expect(person.weight).toBe(75);
  });

  test('should throw error when changing weight to a non-number value', () => {
    expect(() => person.changeWeight("not a number")).toThrow("Weight should be 30-600 kg");
  });

  test('should throw error when changing weight to an out-of-range value', () => {
    expect(() => person.changeWeight(700)).toThrow("Weight should be 30-600 kg");
  });

  test('should correctly calculate stride length based on height', () => {
    person.changeHeight(150);
    expect(person.strideLength).toBe(150 * 0.414);
  });
});
