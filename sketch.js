//todo:
//dynamic buttons
//more sorts
//layout

//logic variables
let arr = [];
let arr_color = [];
let arr_sorted = [];

const n = 52;
let sort_running = false;

let correct = 0;
let compares = 0;
let swaps = 0;

const MIN_HEIGHT = 250;
let w;
let h;

const colors = {
  "blue": [0, 137, 230],
  "darkblue": [32, 89, 232],
  "pink": [247, 45, 217],
  "darkpink": [135, 0, 115],
  "black": [0, 0, 0],
  "white": [255, 255, 255]
};

async function setup() {
  h = windowHeight/2;
  h = h > MIN_HEIGHT ? h : MIN_HEIGHT;
  w = document.body.offsetWidth*0.9;
  let canvas = createCanvas(w, h);
  canvas.parent('sketch');
shuffleArray();
}

function draw() {
  background(colors.white);
  drawArray();
  textSize(12);
  textStyle(ITALIC);
  let offset = h*0.3 / 3;
  fill(colors.blue);
  text('unsorted', 20, offset);
  fill(colors.pink);
  text('currently looked at', 20, offset + 15);
  fill(colors.darkblue);
  text('sorted', 20, offset + 30);
  
  let t = correct + " / " + (n-2);
  if (is_sorted()) {
    t += ' | sorted!';
  }
  textStyle(NORMAL);
  textSize(20);
  fill(0, 83, 138);
  text(t, w/2, h*0.3 / 3);
  text("compares: "+ compares, w/2, h*0.3 / 3 + 20);
  text("swaps: " + swaps, w/2, h*0.3 / 3 + 40);
}

function windowResized() { 
  h = windowHeight/2;
  w = document.body.offsetWidth*0.9;
  resizeCanvas(w, h); 
} 

function drawArray() {
  let width = w/n;
  stroke(colors.white);
  correct = 0;
  for(let i = 1; i < arr.length - 1; i++) {
    if (arr_sorted[i] === arr[i] && sort_running && arr_color[i] == colors.blue) {
      correct++;
      fill(colors.darkblue);
    }
    else fill(arr_color[i]);
    rect(width * i, h*0.3, width, arr[i]/100 * h* 0.6, 2);
  }
  

}

function shuffleArray() {
  sort_running = false;
  arr = [];
  arr_color = [];
  for(let i = 0; i < n; i++) {
    arr.push(1+Math.floor(Math.random()*100));
    arr_color.push(colors.blue);
  }
  arr_sorted = Array.from(arr).sort((x, y) => x-y);
}

function is_sorted() {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] != arr_sorted[i]) return false;
  }
  return true;

}
async function sortArray() {
  if (sort_running || is_sorted()) return;
  sort_running = true;
  compares = 0;
  swaps = 0;
  switch (alg) {
    case "Bubblesort":
      bubblesort();
      break;
    case "Quicksort":
      quicksort(0,(arr.length - 1));
      break;
    case "Selectionsort":
      selectionsort();
      break;
  }
}

async function swap(a, b) {
  let tmp = arr[a];
  arr[a]  = arr[b];
  arr[b] = tmp;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function selectionsort() {
  
  for(let i = 0; i < arr.length; i++) {
    let min_idx = i;
    for (let j = i+1; j < arr.length; j++) {
      arr_color[j] = colors.pink;
      await sleep(5);
      arr_color[j] = colors.blue;
      compares++;
      if (arr[min_idx] > arr[j]) min_idx = j;
    }
    await swap(i, min_idx);
    swaps++;
  }
}

async function bubblesort() {
  let run = true;
  for(let i = 0; i < arr.length && run; i++) {
    run = false;
    for(let y = 0; y < arr.length-1; y++) {
      if (!sort_running) return;
      arr_color[y] = colors.pink;
      arr_color[y+1] = colors.pink;
      await sleep(5);
      compares++;
      if (arr[y] > arr[y+1]) {
        run = true;
        await swap(y, y+1);
        await sleep(10);
        swaps++;
      }
      arr_color[y] = colors.blue;
      arr_color[y+1] = colors.blue;
    }
  }
}

async function quicksort(low, high) {
  if (low < high && sort_running) {
    let partition_index = await partition(low, high);

    await Promise.all([
      quicksort(low, partition_index - 1),
      quicksort(partition_index + 1, high)
    ]);
  }
}

async function partition(low, high) {
  
  let pivot = arr[high];
  for(let i = low + 1; i < high; i++) {
    arr_color[i] = colors.pink;
  }
  await sleep(200);
  let i = (low - 1);

  for(let j = low; j <= high - 1; j++) {
    if (!sort_running) return 0;
    compares++;
    if (arr[j] < pivot) {
      i++;
      await swap(i, j);
      swaps++;
      await sleep(100);
    }


  }
  swaps++;
  await swap(i + 1, high);
  for(let i = low + 1; i < high; i++) {
    arr_color[i] = colors.blue;
  }
  await sleep(50);
  return (i+1);
}
function randomColor() {
}
