data = [
  10,
  [
    196, 146, 123, 74, 168, 60, 47, 93, 179, 157, 9, 25, 56, 41, 173, 185, 144,
    194, 115, 53, 42, 139, 59, 9, 149, 151, 59, 36, 85, 190, 96, 188, 165, 75,
    14, 138, 142, 105, 106, 20, 129,
  ],
];

var k = data[0]
var prices = data[1]
var len = prices.length
if (len < 2) {
  return 0
}
if (k > len / 2) {
  var res = 0
  for (var i = 1; i < len; ++i) {
    res += Math.max(prices[i] - prices[i - 1], 0)
  }
  return res
}
var hold = []
var rele = []
hold.length = k + 1
rele.length = k + 1
for (var i = 0; i <= k; ++i) {
  hold[i] = Number.MIN_SAFE_INTEGER
  rele[i] = 0
}
var cur
for (var i = 0; i < len; ++i) {
  cur = prices[i]
  for (var j = k; j > 0; --j) {
    rele[j] = Math.max(rele[j], hold[j] + cur)
    hold[j] = Math.max(hold[j], rele[j - 1] - cur)
  }
}
console.log(rele[k]);