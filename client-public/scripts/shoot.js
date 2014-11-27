    var signalsValue = []
    var result = 0;
    var rotatingArray = function (element) {
      signalsValue.unshift(element);
      // signalsValue = signalsValue.slice(0, q)  
      return signalsValue.slice(0, 100);
    }

    var preprocessArray = function (array) {
      var minIndex = array.indexOf(math.min(array));
      var maxIndex = array.indexOf(math.max(array));
      array = array.splice(minIndex, 1);
      array = array.splice(maxIndex, 1);
      return array;
    }

    var maxMin = function (){
      array = []
      array.push(math.max(signalsValue));
      array.push(math.abs(math.min(signalsValue)));
      return(math.max(array))
    }

    var shootjs = function(callback){
      window.ondevicemotion = function(event) {

        var xVal = event.accelerationIncludingGravity.x;
        var yVal = event.accelerationIncludingGravity.y;
        var currentValue = math.abs(xVal);
        var currentSignalArray = rotatingArray(currentValue);
        
        
        if(signalsValue.length > 200){

          var mean = math.mean(preprocessArray(currentSignalArray));
          $('#mean').html("mean:" + mean);

          if(currentValue > mean * 3 && currentValue > 0.3){
            signalsValue = [];
            callback();
          }
          else {
            signalsValue.unshift(currentValue);
          }
        } else {
          signalsValue.unshift(currentValue);
        }
      }
  }