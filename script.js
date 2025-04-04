const algorithmDescriptions = {
  default:
    "Select an algorithm from the dropdown menu to view its description.",
  bubble:
    "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  quicksort:
    "Quicksort is a divide-and-conquer algorithm that works by selecting a 'pivot' element from the array, and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot.",
  mergesort:
    "Merge Sort is a divide-and-conquer algorithm that works by dividing the input array into two halves, calling itself for the two halves, and then merging the two sorted halves.",
  insertion:
    "Insertion Sort is a simple sorting algorithm that works by iterating through an array, removing one element at a time, and inserting it into the correct position in the sorted portion of the array.",
  selection:
    "Selection Sort is a simple sorting algorithm that works by repeatedly finding the minimum element from the unsorted part of the array and swapping it with the first element of the unsorted part.",
  heapsort:
    "Heap Sort is a comparison-based sorting technique based on the binary heap data structure. It is one of the most efficient sorting algorithms, with a time complexity of O(n log n).",
};

// Get references to HTML elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const algorithmSelect = document.getElementById("algorithmSelect");
const generateButton = document.getElementById("generateButton");
const visualizeButton = document.getElementById("visualizeButton");
const speedSlider = document.getElementById("speedSlider");
const algorithmDescription = document.getElementById("algorithm-description");

algorithmSelect.addEventListener("change", () => {
  const selectedAlgorithm = algorithmSelect.value;
  algorithmDescription.textContent = algorithmDescriptions[selectedAlgorithm];
});
// Set canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Array to store bar heights
let barHeights = [];
let sortingSpeed = 10; // 1x speed

// Function to generate random bar heights
function generateBarHeights() {
  const numBars = 10;
  barHeights = Array.from(
    { length: numBars },
    () => Math.floor(Math.random() * 350) + 50
  );
}

// Function to draw the bars on the canvas
function drawBars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / barHeights.length;
  barHeights.forEach((height, index) => {
    const x = index * barWidth;
    const y = canvas.height - height;
    ctx.fillRect(x, y, barWidth - 1, height);
  });
}

// Function to update the bar heights in the visualization
function updateBarHeights(array) {
  barHeights = array;
  drawBars();
}

// Bubble Sort algorithm
async function bubbleSort(array, visualize = false) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        if (visualize) {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 / sortingSpeed)
          );
          updateBarHeights(array);
        }
      }
    }
  }
}

// Insertion Sort algorithm
async function insertionSort(array, visualize = false) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
      if (visualize) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 / sortingSpeed)
        );
        updateBarHeights(array);
      }
    }
    array[j + 1] = key;
  }
}

// Selection Sort algorithm
async function selectionSort(array, visualize = false) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    if (visualize) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / sortingSpeed));
      updateBarHeights(array);
    }
  }
}

// Quick Sort algorithm
async function quickSort(array, low, high, visualize = false) {
  if (low < high) {
    const pivotIndex = await partition(array, low, high, visualize);
    await quickSort(array, low, pivotIndex - 1, visualize);
    await quickSort(array, pivotIndex + 1, high, visualize);
  }
}

async function partition(array, low, high, visualize = false) {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      if (visualize) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 / sortingSpeed)
        );
        updateBarHeights(array);
      }
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  if (visualize) {
    await new Promise((resolve) => setTimeout(resolve, 1000 / sortingSpeed));
    updateBarHeights(array);
  }
  return i + 1;
}

// Merge Sort algorithm
async function mergeSort(array, visualize = false) {
  if (array.length <= 1) {
    return array;
  }

  const middle = Math.floor(array.length / 2);
  const left = array.slice(0, middle);
  const right = array.slice(middle);

  await mergeSort(left, visualize);
  await mergeSort(right, visualize);

  return await merge(left, right, array, visualize);
}

async function merge(left, right, array, visualize = false) {
  let leftIndex = 0;
  let rightIndex = 0;
  let outputIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      array[outputIndex++] = left[leftIndex++];
    } else {
      array[outputIndex++] = right[rightIndex++];
    }
    if (visualize) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / sortingSpeed));
      updateBarHeights(array);
    }
  }

  while (leftIndex < left.length) {
    array[outputIndex++] = left[leftIndex++];
    if (visualize) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / sortingSpeed));
      updateBarHeights(array);
    }
  }

  while (rightIndex < right.length) {
    array[outputIndex++] = right[rightIndex++];
    if (visualize) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / sortingSpeed));
      updateBarHeights(array);
    }
  }

  return array;
}

// Heap Sort algorithm
async function heapSort(array, visualize = false) {
  const n = array.length;

  // Build the heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i, visualize);
  }

  // Extract elements from the heap
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    await heapify(array, i, 0, visualize);
  }
}

async function heapify(array, n, i, visualize = false) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && array[left] > array[largest]) {
    largest = left;
  }

  if (right < n && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [array[i], array[largest]] = [array[largest], array[i]];
    if (visualize) {
      await new Promise((resolve) => setTimeout(resolve, 1000 / sortingSpeed));
      updateBarHeights(array);
    }
    await heapify(array, n, largest, visualize);
  }
}

function generateAlgorithm() {
  generateBarHeights();
  drawBars();
}
async function visualizeAlgorithm(algorithmName) {
  switch (algorithmName) {
    case "bubble":
      await bubbleSort(barHeights, true);
      break;
    case "insertion":
      await insertionSort(barHeights, true);
      break;
    case "selection":
      await selectionSort(barHeights, true);
      break;
    case "quicksort":
      await quickSort(barHeights, 0, barHeights.length - 1, true);
      break;
    case "mergesort":
      await mergeSort(barHeights, true);
      break;
    case "heapsort":
      await heapSort(barHeights, true);
      break;
    default:
      showAlert("success", "Please choose a proper algorithm and try again");
  }
}

// Event listeners
generateButton.addEventListener("click", () => {
  generateAlgorithm();
});

visualizeButton.addEventListener("click", () => {
  const selectedAlgorithm = algorithmSelect.value;
  visualizeAlgorithm(selectedAlgorithm);
});

speedSlider.addEventListener("click", () => {
  if (sortingSpeed === 1) {
    sortingSpeed = 50;
    speedSlider.textContent = "Speed: 50x";
  } else {
    sortingSpeed = 100;
    speedSlider.textContent = "Speed: 100x";
  }
});
var alertContainer = document.createElement("div");
alertContainer.classList.add("alert-container");
document.body.appendChild(alertContainer);

var currentAlert = null;

window.addEventListener("alert", function (event) {
  // If there's an existing alert, remove it
  if (currentAlert) {
    currentAlert.classList.remove("show");
    setTimeout(function () {
      currentAlert.remove();
      currentAlert = null;
    }, 400);
  }

  var alert = document.createElement("div");
  alert.classList.add("alert");

  if (event.detail.type === "success") {
    alert.classList.add("success");
  }

  var msg = document.createElement("span");
  msg.textContent = event.detail.message;

  var closeBtn = document.createElement("span");
  closeBtn.classList.add("closebtn");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = function () {
    alert.classList.remove("show");
    setTimeout(function () {
      alert.remove();
      currentAlert = null;
    }, 400);
  };

  alert.appendChild(msg);
  alert.appendChild(closeBtn);

  alertContainer.appendChild(alert);
  setTimeout(function () {
    alert.classList.add("show");
  }, 100);

  currentAlert = alert;

  // Keep the alert visible for at least 2 seconds
  setTimeout(function () {
    if (currentAlert) {
      currentAlert.classList.remove("show");
      setTimeout(function () {
        currentAlert.remove();
        currentAlert = null;
      }, 400);
    }
  }, 2000);
});

function showAlert(type, message) {
  var event = new CustomEvent("alert", {
    detail: {
      type: type,
      message: message,
    },
  });
  window.dispatchEvent(event);
}
