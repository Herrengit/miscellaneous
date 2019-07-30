$(function() {
  var d = new Date()
  var currYear = d.getFullYear()
  var currMonth = (d.getMonth() + 1)
  var currDate = d.getDate()

  $('#date').text(currYear + '年-' + currMonth + '月')
  ergodicDate(currYear, currMonth)
  
  var changeYear = currYear
  var changeMonth = currMonth
  $('#left').click(function () {
    --changeMonth
    if (changeMonth <= 0) {
      --changeYear
      changeMonth = 12
    }
    changeDate(changeYear, changeMonth)
  })
  $('#right').click(function () {
    ++changeMonth
    if (changeMonth >= 12) {
      ++changeYear
      changeMonth = 1
    }
    changeDate(changeYear, changeMonth)
  })
  function changeDate(changeYear, changeMonth) {
    ergodicDate(changeYear, changeMonth)
    changeMonth = changeMonth < 10 ? '0' + changeMonth : changeMonth
    $('#date').text(changeYear + '年-' + changeMonth + '月')
  }

  $('.day-tabel').on('click', '.tabel-li', function (e) {
    console.log(changeYear, changeMonth, e.target.innerHTML*1)
  })

  function ergodicDate(year, month) {
    var preMonth = month - 1
    var perYear = year

    var preMonthLength = getMothLength(perYear, preMonth)
    $(".day-tabel").eq(0).empty();
    var date1 = new Date(year + "/" + month + "/" + 1).getDay();

    function getMothLength(year, month) {
      function isLeapYear(year) {
        return (year % 4 == 0) && (year & 100 != 0 || year & 400 == 0)
      }
      if (month == 4 || month == 6 || month == 9 || month == 11) {
        return month = 30
      } else {
        if (month == 2) {
          if (isLeapYear == true) {
            return month = 29
          } else {
            return month = 28
          }
        } else {
          return month = 31
        }
      }
    }

    var dayLength = getMothLength(year, month)
    // var dayArr = []
    // for (var m = 1; m < dayLength + 1; m++) {
    //   dayArr.push(m)
    // }

    var flag = false;
    for (var k = 0; k < 6; k++) {
      var li1 = $('<li class="tabel-line"></li>')
      var ul2 = $('<ul class="tabel-ul"></ul>')
      for (var n = 0; n < 7; n++) {
        if (k == 0 && n < date1) {
          if (currDate < 7 && (preMonthLength - date1 + n + 1) == currDate && (currMonth == month && currYear == year)) {
            ul2.append('<li class="tabel-li preDays active">' + (preMonthLength - date1 + n + 1) + '</li>')
          } else {
            ul2.append('<li class="tabel-li preDays">' + (preMonthLength - date1 + n + 1) + "</li>")
          }
        } else {
          // dayArr.length
          if ((k * 7 - date1 + n + 1) > dayLength) {
            break
          } else {
            if ((k * 7 - date1 + n + 1) == currDate && (currMonth == month && currYear == year)) {
              ul2.append('<li class="tabel-li active">' + (k * 7 - date1 + n + 1) + "</li>")
            } else {
              ul2.append('<li class="tabel-li">' + (k * 7 - date1 + n + 1) + "</li>")
            }
          }
          // dayArr.length
          if ((k * 7 - date1 + n + 1) == dayLength) {
            flag = true;
            currN = n;
            currK = k;
            currArr = 5 - currK
          }
        }
      }
      li1.append(ul2)
      $(".day-tabel").eq(0).append(li1);
      if (flag == true) {
        for (var q = 0; q < 6 - currN; q++) {
          $(".tabel-line").eq(currK).children().append(
            '<li class="tabel-li nextDay">' + (q + 1) + "</li>")
        }
        if (currK == 4 && currN != 0) {
          var lik = $('<li class="tabel-line"></li>')
          var ulk = $('<ul class="tabel-ul"></ul>')
          if (currN == 6) {
            currK = 1
          }
          for (var k = 0; k < currArr * 7; k++) {
            ulk.append('<li class="tabel-li nextDay">' + (k + currK) + "</li>")
            lik.append(ulk)
            $(".day-tabel").append(lik);
          }
        }
        break
      }
    }
  }
})