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

exports.customSort = function(arr, direction, customSortKey) {
  var newArr = arr.slice(0);

  if (customSortKey) {
    return arr.sort(function(a,b) {
      if (direction == 'asc') {
        return customSortKey[a] - customSortKey[b]
      } else {
        return customSortKey[b] - customSortKey[a]
      }
    })
  } else {
    if (direction == 'asc') {
      return newArr.sort();
    } else {
      return newArr.sort().reverse();
    }
  }
}

exports.customSortStrings = function(arr, direction, caseInsensitive) {
  var newArr = arr.slice(0);
  if (caseInsensitive) {
    return arr.sort(function(a,b) {
      if (direction == 'asc') {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      } else {
        return b.toLowerCase().localeCompare(a.toLowerCase());
      }
    })
    
  } else {
    if (direction == 'asc') {
      return newArr.sort();
    } else {
      return newArr.sort().reverse();
    }
  }
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
