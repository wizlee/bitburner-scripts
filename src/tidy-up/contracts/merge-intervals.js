const intervals = [
  [16, 20],
  [21, 31],
  [14, 19],
  [15, 21],
  [5, 10],
  [17, 26],
  [22, 24],
  [21, 31],
  [4, 12],
  [7, 17],
  [22, 23],
  [13, 20],
  [25, 28],
  [9, 12],
  [20, 28],
  [18, 22],
];

// const intervals = [
//   [1, 3],
//   [8, 10],
//   [2, 6],
//   [10, 16],
// ];

// expands intervals array to a 1 dimensional array consisting of all the numbers in the intervals
expanded_intervals = [];
intervals.forEach((interval) => {
  for (let i = interval[0]; i <= interval[1]; i++) {
    expanded_intervals.push(i);
  }
});

unique_and_sorted_intervals = [...new Set(expanded_intervals)].sort((a, b) => a - b);

// create a new intervals array by using the unique_and_sorted_intervals array.
// consecutive numbers are merged into one interval where the start of the interval is the smallest number in the merged interval
let new_intervals = [];
let interval_start = 0;
let interval_end = 0;
for (let i = 0; i < unique_and_sorted_intervals.length; i++) {
  if (i === 0) {
    interval_start = unique_and_sorted_intervals[i];
    interval_end = unique_and_sorted_intervals[i] + 1;
  } else {
    if (unique_and_sorted_intervals[i] === interval_end) {
      interval_end = unique_and_sorted_intervals[i] + 1;
      if (i === unique_and_sorted_intervals.length - 1) {
        new_intervals.push([interval_start, interval_end - 1]);
      }
    } else {
      new_intervals.push([interval_start, interval_end - 1]);
      interval_start = unique_and_sorted_intervals[i];
      interval_end = unique_and_sorted_intervals[i] + 1;
    }
  }
}

console.log(expanded_intervals);
console.log(unique_and_sorted_intervals);
console.log(new_intervals);