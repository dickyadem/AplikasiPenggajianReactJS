/**
 * Sorting Algorithms Module for Payroll Application
 * Implements various DSA sorting algorithms for data manipulation
 */

// ============================================
// 1. BUBBLE SORT - O(n²)
// Simple comparison-based sorting algorithm
// ============================================
export const bubbleSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            const a = arr[j][key] ?? '';
            const b = arr[j + 1][key] ?? '';
            
            if ((ascending && a > b) || (!ascending && a < b)) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    
    return arr;
};

// ============================================
// 2. SELECTION SORT - O(n²)
// Selects minimum element and places at beginning
// ============================================
export const selectionSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
        let targetIdx = i;
        for (let j = i + 1; j < n; j++) {
            const a = arr[targetIdx][key] ?? '';
            const b = arr[j][key] ?? '';
            
            if ((ascending && b < a) || (!ascending && b > a)) {
                targetIdx = j;
            }
        }
        if (targetIdx !== i) {
            [arr[i], arr[targetIdx]] = [arr[targetIdx], arr[i]];
        }
    }
    
    return arr;
};

// ============================================
// 3. INSERTION SORT - O(n²)
// Builds sorted array one element at a time
// Best for small or nearly sorted arrays
// ============================================
export const insertionSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    const n = arr.length;
    
    for (let i = 1; i < n; i++) {
        const current = arr[i];
        const currentValue = current[key] ?? '';
        let j = i - 1;
        
        while (j >= 0) {
            const prevValue = arr[j][key] ?? '';
            const shouldMove = ascending ? prevValue > currentValue : prevValue < currentValue;
            
            if (shouldMove) {
                arr[j + 1] = arr[j];
                j--;
            } else {
                break;
            }
        }
        arr[j + 1] = current;
    }
    
    return arr;
};

// ============================================
// 4. MERGE SORT - O(n log n)
// Divide and conquer algorithm
// Stable sort, good for linked lists
// ============================================
export const mergeSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const merge = (left, right) => {
        const result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            const leftVal = left[i][key] ?? '';
            const rightVal = right[j][key] ?? '';
            
            const shouldTakeLeft = ascending ? leftVal <= rightVal : leftVal >= rightVal;
            
            if (shouldTakeLeft) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
        
        return [...result, ...left.slice(i), ...right.slice(j)];
    };
    
    const mid = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, mid), key, ascending);
    const right = mergeSort(array.slice(mid), key, ascending);
    
    return merge(left, right);
};

// ============================================
// 5. QUICK SORT - O(n log n) average, O(n²) worst
// Divide and conquer with pivot selection
// Fast in practice, cache-friendly
// ============================================
export const quickSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const partition = (arr, low, high) => {
        const pivot = arr[high][key] ?? '';
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            const val = arr[j][key] ?? '';
            const shouldSwap = ascending ? val <= pivot : val >= pivot;
            
            if (shouldSwap) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    };
    
    const quickSortRecursive = (arr, low, high) => {
        if (low < high) {
            const pi = partition(arr, low, high);
            quickSortRecursive(arr, low, pi - 1);
            quickSortRecursive(arr, pi + 1, high);
        }
    };
    
    const arr = [...array];
    quickSortRecursive(arr, 0, arr.length - 1);
    return arr;
};

// ============================================
// 6. HEAP SORT - O(n log n)
// Uses binary heap data structure
// In-place, not stable
// ============================================
export const heapSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    const n = arr.length;
    
    const compare = (a, b) => {
        const valA = a[key] ?? '';
        const valB = b[key] ?? '';
        return ascending ? valA < valB : valA > valB;
    };
    
    const heapify = (n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        
        if (left < n && compare(arr[largest], arr[left])) {
            largest = left;
        }
        if (right < n && compare(arr[largest], arr[right])) {
            largest = right;
        }
        
        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(n, largest);
        }
    };
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(i, 0);
    }
    
    return arr;
};

// ============================================
// 7. COUNTING SORT - O(n + k)
// Non-comparison based, works with integers
// k is the range of input values
// ============================================
export const countingSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    // Check if all values are numeric
    const allNumeric = array.every(item => {
        const val = item[key];
        return val !== undefined && val !== null && !isNaN(Number(val));
    });
    
    if (!allNumeric) {
        console.warn('Counting sort requires numeric values. Using merge sort instead.');
        return mergeSort(array, key, ascending);
    }
    
    const arr = [...array];
    const values = arr.map(item => Number(item[key]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min + 1;
    
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);
    
    // Count occurrences
    for (let i = 0; i < arr.length; i++) {
        count[Number(arr[i][key]) - min]++;
    }
    
    // Cumulative count
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = arr.length - 1; i >= 0; i--) {
        const idx = Number(arr[i][key]) - min;
        output[count[idx] - 1] = arr[i];
        count[idx]--;
    }
    
    return ascending ? output : output.reverse();
};

// ============================================
// 8. RADIX SORT - O(d * n)
// Sorts by individual digits (LSD or MSD)
// Works with integers or fixed-length strings
// ============================================
export const radixSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    
    // Get max value to determine number of digits
    const getMax = () => {
        let max = -Infinity;
        for (const item of arr) {
            const val = Number(item[key]);
            if (!isNaN(val)) max = Math.max(max, val);
        }
        return max;
    };
    
    const max = getMax();
    if (!isFinite(max)) {
        console.warn('Radix sort requires numeric values. Using merge sort instead.');
        return mergeSort(array, key, ascending);
    }
    
    // Counting sort by digit
    const countingSortByDigit = (exp) => {
        const output = new Array(arr.length);
        const count = new Array(10).fill(0);
        
        for (let i = 0; i < arr.length; i++) {
            const digit = Math.floor(Number(arr[i][key]) / exp) % 10;
            count[digit]++;
        }
        
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        
        for (let i = arr.length - 1; i >= 0; i--) {
            const digit = Math.floor(Number(arr[i][key]) / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }
        
        for (let i = 0; i < arr.length; i++) {
            arr[i] = output[i];
        }
    };
    
    // Do counting sort for each digit
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingSortByDigit(exp);
    }
    
    return ascending ? arr : arr.reverse();
};

// ============================================
// 9. BUCKET SORT - O(n + k) average
// Distributes elements into buckets
// Good for uniformly distributed data
// ============================================
export const bucketSort = (array, key, ascending = true, bucketSize = 5) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    
    // Check if all values are numeric
    const allNumeric = array.every(item => {
        const val = item[key];
        return val !== undefined && val !== null && !isNaN(Number(val));
    });
    
    if (!allNumeric) {
        console.warn('Bucket sort works best with numeric values. Using merge sort instead.');
        return mergeSort(array, key, ascending);
    }
    
    const values = arr.map(item => Number(item[key]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Create buckets
    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = Array.from({ length: bucketCount }, () => []);
    
    // Distribute into buckets
    for (const item of arr) {
        const idx = Math.floor((Number(item[key]) - min) / bucketSize);
        buckets[idx].push(item);
    }
    
    // Sort each bucket and concatenate
    const result = [];
    for (const bucket of buckets) {
        if (bucket.length > 0) {
            const sorted = insertionSort(bucket, key, ascending);
            result.push(...sorted);
        }
    }
    
    return ascending ? result : result.reverse();
};

// ============================================
// 10. SHELL SORT - O(n log n) to O(n²)
// Generalization of insertion sort
// Allows exchange of far apart elements
// ============================================
export const shellSort = (array, key, ascending = true) => {
    if (!Array.isArray(array) || array.length <= 1) return array;
    
    const arr = [...array];
    const n = arr.length;
    
    // Shell's sequence: gap = n/2, n/4, ..., 1
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            const tempValue = temp[key] ?? '';
            let j = i;
            
            while (j >= gap) {
                const prevValue = arr[j - gap][key] ?? '';
                const shouldMove = ascending ? prevValue > tempValue : prevValue < tempValue;
                
                if (shouldMove) {
                    arr[j] = arr[j - gap];
                    j -= gap;
                } else {
                    break;
                }
            }
            arr[j] = temp;
        }
    }
    
    return arr;
};

// ============================================
// UTILITY: Get sort icon based on current sort state
// ============================================
export const getSortIcon = (currentKey, targetKey, currentOrder) => {
    if (currentKey !== targetKey) return '↕';
    return currentOrder === 'asc' ? '↑' : '↓';
};

// ============================================
// UTILITY: Toggle sort order
// ============================================
export const toggleSortOrder = (currentKey, targetKey, currentOrder) => {
    if (currentKey !== targetKey) {
        return { key: targetKey, order: 'asc' };
    }
    return { key: targetKey, order: currentOrder === 'asc' ? 'desc' : 'asc' };
};

// ============================================
// Default export with all algorithms
// ============================================
const sortingAlgorithms = {
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort,
    countingSort,
    radixSort,
    bucketSort,
    shellSort,
    getSortIcon,
    toggleSortOrder
};

export default sortingAlgorithms;
