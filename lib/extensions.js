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
  return arr.sort(function(a,b) {
    var val;
    if ((a == undefined || a == "") && b != undefined && b != "") {
      val = 1;
    } else if ((b == undefined || b == "") && a != undefined && a != "") {
      val = -1;
    } else if (a > b) {
      val = 1;
    } else if (b > a) {
      val = -1;
    } else {
      return 0;
    }

     if (direction == 'asc') {
      return val;
     } else {
      return val * -1;
     }
  })
}

exports.customSortEnumerated = function(arr, direction, enumeration) {
  return arr.sort(function(a,b) {
    if (direction == 'asc') {
      return enumeration[a] - enumeration[b]
    } else {
      return enumeration[b] - enumeration[a]
    }
  });  
}

exports.customSortStringsInsensitive = function(arr, direction) {
  return arr.sort(function(a,b) {
    if (direction == 'asc') {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    } else {
      return b.toLowerCase().localeCompare(a.toLowerCase());
    }
  })
}

exports.customSortDates = function(arr, direction) {
  return arr.sort(function (a, b) {
      // '01/03/2014'.split('/')
      // gives ["01", "03", "2014"]
      a = a.split('/');
      b = b.split('/');
      if (direction == 'asc') {
        return a[2] - b[2] || a[0] - b[0] || a[1] - b[1];  
      } else {
        return b[2] - a[2] || b[0] - a[0] || b[1] - a[1];  
      }
  });
}

exports.generateRandomText = function(numLetters) {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i < numLetters; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
