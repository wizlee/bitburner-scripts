const stock_by_day = [25, 161, 129, 125, 56, 17, 61, 175, 7, 1, 28, 97];

var hold1 = Number.MIN_SAFE_INTEGER;
var hold2 = Number.MIN_SAFE_INTEGER;
var release1 = 0;
var release2 = 0;
for (var _i = 0, data_1 = stock_by_day; _i < data_1.length; _i++) {
  var price = data_1[_i];
  release2 = Math.max(release2, hold2 + price);
  hold2 = Math.max(hold2, release1 - price);
  release1 = Math.max(release1, hold1 + price);
  hold1 = Math.max(hold1, price * -1);
}

console.log(release2);