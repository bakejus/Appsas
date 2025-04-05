const Activity = require("../../src/classes/Activity.js");

class Person {
    constructor(height = 170, strideLength = 75, weight = 60) {
        this.height = height;
        this.strideLength = strideLength;
        this.weight = weight;
    }
}

describe("Activity Class", () => {
  let person;
  let activity;

  beforeEach(() => {
    person = new Person();
    activity = new Activity(person);
  });


  test("should initialize correctly", () => {
      expect(activity.person).toBe(person);
      expect(activity.steps).toBe(0);
      expect(activity.distance).toBe(0);
      expect(activity.caloriesBurnt).toBe(0);
    });

    test.each([
      [1000, 0.75],
      [2000, 1.5],
      [5000, 3.75]
    ])("should calculate distance correctly for %i steps", (steps, expectedDistance) => {
      activity.updateSteps(steps);
      expect(activity.distance).toBe(expectedDistance);
    });

    test.each([
      [1000, 45],
      [2000, 90],
      [5000, 225]
    ])("should calculate calories burnt correctly for %i steps", (steps, expectedCalories) => {
      activity.updateSteps(steps);
      expect(activity.caloriesBurnt).toBeCloseTo(expectedCalories);
    });

    test.each([
      [1000],
      [2000],
      [5000]
    ])("should update steps correctly to %i", (steps) => {
      activity.updateSteps(steps);
      expect(activity.steps).toBe(steps);
      expect(activity.distance).toBe((steps * person.strideLength) / 100000);
      expect(activity.caloriesBurnt).toBeCloseTo(person.weight * activity.distance);
    });

    test.each([
      ["invalid"],
      [null],
      [undefined],
      [{}],
      [[]]
    ])("should throw error when updating steps to a non-number: %p", (invalidInput) => {
      expect(() => activity.updateSteps(invalidInput)).toThrow("Steps should be a number");
    });

    test("should throw error when decreasing steps", () => {
      activity.updateSteps(3000);
      expect(() => activity.updateSteps(2000)).toThrow("Steps should not decrease");
    });

    test("should allow increasing steps multiple times", () => {
      activity.updateSteps(1000);
      activity.updateSteps(2000);
      expect(activity.steps).toBe(2000);
    });

    test('should set avgSpeed to 0 when distance is 0', () => {
      activity.distance = 0;
      activity.timeElapsed = 10;
      activity.calculateAvgSpeed();
      expect(activity.avgSpeed).toBe(0);
    });

    test('should correctly calculate average speed', () => {
      activity.distance = 2;
      activity.timeElapsed = 30; 
      activity.calculateAvgSpeed();
      expect(activity.avgSpeed).toBeCloseTo(0.25); 
    });

    test('should update time correctly', () => {
      activity.updateTime(15);
      expect(activity.timeElapsed).toBe(15);
      activity.updateTime(10);
      expect(activity.timeElapsed).toBe(25);
    });
  });

