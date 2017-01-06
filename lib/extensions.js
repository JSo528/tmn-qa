exports.perToNum = function(percentage) {
  return (Number(percentage.replace(/\%/, '')))
};

exports.isSorted = function(arr, asc) {
  asc = asc || true;

  var len = arr.length - 1;
  for(var i = 0; i < len; ++i) {
    var termOne = asc ? arr[i] : arr[i+i];
    var termTwo = asc ? arr[i+1] : arr[i];
      if (isNaN(termOne) || isNaN(termTwo)) {
        if (termOne.toLowerCase() > termTwo.toLowerCase()) {
         return false;
        }  
      } else {
        if (termOne > termTwo) {
          return false;
        }  
      }
      
  }
  return true;
}

exports.customSort = function(arr, direction) {
  var newArr = arr.slice(0);
  if (direction == 'asc') {
    return newArr.sort();
  } else {
    return newArr.sort().reverse();
  }
}

exports.generateRandomText = function(numLetters) {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i < numLetters; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
