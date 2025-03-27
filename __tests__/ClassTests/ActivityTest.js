const Activity = require("../../src/classes/Activity.js");

describe("Activity Class", () => {
  let person;
  let activity;

  beforeEach(() => {
    person = { strideLength: 75, weight: 70 }; // Example person with stride length 75cm and weight 70kg
    activity = new Activity(person);
  });

  test("should initialize correctly", () => {
    expect(activity.person).toBe(person);
    expect(activity.steps).toBe(0);
    expect(activity.distance).toBe(0);
    expect(activity.caloriesBurnt).toBe(0);
  });

  test("should calculate distance correctly", () => {
    activity.updateSteps(2000);
    expect(activity.distance).toBe((2000 * person.strideLength) / 100); // 1500 meters
  });

  test("should calculate calories burnt correctly", () => {
    activity.updateSteps(2000);
    const expectedCalories = (person.weight * (activity.distance / 1000) * 0.57); //maybe skaiciu rasyt
    expect(activity.caloriesBurnt).toBeCloseTo(expectedCalories);
  });

  test("should update steps correctly", () => {
    activity.updateSteps(1000);
    expect(activity.steps).toBe(1000);
    expect(activity.distance).toBe((1000 * person.strideLength) / 100);
    expect(activity.caloriesBurnt).toBeCloseTo(person.weight * (activity.distance / 1000) * 0.57);
  });

  test("should throw error when updating steps to a non-number", () => {
    expect(() => activity.updateSteps("invalid")).toThrow("Steps should be a number");
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
});
