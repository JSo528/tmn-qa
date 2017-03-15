var perToNum = function(percentage) {
  return (Number(percentage.replace(/\%/, '')))
};

var isSorted = function(arr, asc) {
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

var customSort = function(arr, direction) {
  var newArray = arr.slice(0);
  return newArray.sort(function(a,b) {
    var val;
    if (a == "" && b != "") {
      val = 1;
    } else if (b == "" && a != "") {
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

var customSortEnumerated = function(arr, direction, enumeration) {
  var newArray = arr.slice(0);
  return newArray.sort(function(a,b) {
    if (direction == 'asc') {
      return enumeration.indexOf(a) - enumeration.indexOf(b);
    } else {
      return enumeration.indexOf(b) - enumeration.indexOf(a);
    }
  });  
}

var customSortNumber = function(arr, direction) {
  var newArray = arr.slice(0);
  newArray.map(function(val) {
    return parseFloat(val);
  })

  return customSort(arr, direction);
}

var customSortStringInsensitive = function(arr, direction) {
  var newArray = arr.slice(0).map(function(val) {
    return val;
  })
  return newArray.sort(function(a,b) {
    if (direction == 'asc') {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    } else {
      return b.toLowerCase().localeCompare(a.toLowerCase());
    }
  })
}

var customSortDates = function(arr, direction) {
  var newArray = arr.slice(0);
  return newArray.sort(function (a, b) {
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

var customSortBoolean = function(arr, direction) {
  var enumeration = ['check_box_outline_blank', 'check_box'];
  return customSortEnumerated(arr, direction, enumeration);
}

var customSortByType = function(type, arr, direction, enumeration) {
  switch (type) {
    case 'enumerated':
      return customSortEnumerated(arr, direction, enumeration);
    case 'dates':
      return customSortDates(arr, direction);
    case 'number':
      return customSortNumber(arr, direction);
    case 'boolean':
      return customSortBoolean(arr, direction);
    case 'stringInsensitive':
      return customSortStringInsensitive(arr, direction);
    default:
      return customSort(arr, direction);
  }
}

var generateRandomText = function(numLetters) {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for(var i=0; i < numLetters; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

var normalizeArray = function(array, type, placeholder) {
  array = array.map(function(val) {
    return (val == placeholder) ? "" : val;
  });

  switch (type) {
    case 'string':
      return array.map(function(val) {
        return val.replace(/[^a-zA-Z]/g, '');
      });
    case 'stringInsensitive':
      return array.map(function(val) {
        return val.toLowerCase().replace(/[^a-zA-Z]/g, '');
      });
    case 'number':
      return array.map(function(val) {
        if (val == "") {
          return "";
        } else {
          return parseFloat(val);  
        }
      });
    default:
      return array;
  }
};

var chooseRandom = function(values) {
  return values[Math.floor(Math.random() * values.length)];
}

module.exports = {
  perToNum: perToNum,
  isSorted: isSorted,
  customSort: customSort,
  customSortNumber: customSortNumber, 
  customSortStringInsensitive: customSortStringInsensitive,
  customSortDates: customSortDates,
  customSortEnumerated: customSortEnumerated,
  customSortBoolean: customSortBoolean,
  customSortByType: customSortByType,
  generateRandomText: generateRandomText,
  normalizeArray: normalizeArray,
  chooseRandom: chooseRandom
}