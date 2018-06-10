angular
  .module('app')
  .service("combinations", function() {
    this.getCombos = function(length1, length2) {
      var sub_array = []
      var array1 = []
      var array2 = []

      for (let i=0; i<length1; i++) {
        array1.push(i);
      }
      for (let i=0; i<length1; i++) {
        array2.push(i);
      }

      for (let i=0; i<length2; i++) {
        for (let j=0; j<length1; j++) {
          sub_array.push([array1[i], array2[j]]);
        }
      }
      return sub_array;
    }
  })
