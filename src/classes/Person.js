class Person {
  constructor() {
    this.name = "";
    this.height = 170; // in cm
    this.weight = 60; // in kg
    this.strideLength = this.calculateStrideLength();
  }
  calculateStrideLength() {
      return (this.height * 0.414); // in cm
  }
  changeName(name){
    if (name == ""){
        throw new Error( "Name should not be empty");
    }
    this.name = name;
  }
  changeHeight(height){
    if (typeof height !== "number" || height < 50 || height > 300){
        throw new Error( "Height should be 50-300 cm");
    }
    this.height = height;
    this.strideLength = this.calculateStrideLength();
  }
  changeWeight(weight){
    if (typeof weight !== "number" || weight < 30 || weight > 600){
        throw new Error( "Weight should be 30-600 kg");
    }
    this.weight = weight;
  }
}

module.exports = Person;