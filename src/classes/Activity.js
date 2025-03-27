class Activity {
  constructor(person) {
    this.person = person;
    this.steps = 0;
    this.distance = 0;
    this.caloriesBurnt = 0;
    this.timeElapsed = 0;
    this.avgSpeed = 0;
  }

  calculateDistance() {
    this.distance = (this.steps * this.person.strideLength) / 100000; // In kilometers
  }
  calculateAvgSpeed() {
    this.avgSpeed = this.timeElapsed / 60 / this.distance;
    if (this.avgSpeed == Infinity){
        this.avgSpeed = 0;
    }
  }
  updateSteps(steps)
  {
    if(typeof steps !== "number")
    {
        throw new Error( "Steps should be a number");
    }
    if( steps < this.steps)
    {
        throw new Error( "Steps should not decrease");
    }
    this.steps = steps;
  }

  calculateCaloriesBurnt() {
    let distanceInKm = this.distance / 1000; // In km
    this.caloriesBurnt = this.person.weight * distanceInKm * 570;
  }
  updateTime(time)
  {
    this.timeElapsed += time;
  }
}

module.exports = Activity;