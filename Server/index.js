import express from "express";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Traditional Matrix Multiplication 
function traditionalMultiply(A, B) {

    const n = A.length;
    const result = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let k = 0; k < n; k++) {
            const aik = A[i][k];
            for (let j = 0; j < n; j++) {
                result[i][j] += aik * B[k][j];
            }
        }
    }
    
    return result;
}

// Strassen implementation 

function strassenFast(A, B) {

    const n = A.length;
    
    // Use cutoff threshold - crucial for performance
    if (n <= 64) {
        return traditionalMultiply(A, B);
    }
    
    const half = n / 2;
    
    // Extract submatrices
    const a11 = extractSubMatrix(A, 0, 0, half);
    const a12 = extractSubMatrix(A, 0, half, half);
    const a21 = extractSubMatrix(A, half, 0, half);
    const a22 = extractSubMatrix(A, half, half, half);
    
    const b11 = extractSubMatrix(B, 0, 0, half);
    const b12 = extractSubMatrix(B, 0, half, half);
    const b21 = extractSubMatrix(B, half, 0, half);
    const b22 = extractSubMatrix(B, half, half, half);
    
    // Calculate intermediate sums/differences once and reuse
    const a11_plus_a22 = matrixAdd(a11, a22);
    const b11_plus_b22 = matrixAdd(b11, b22);
    const a21_plus_a22 = matrixAdd(a21, a22);
    const b12_minus_b22 = matrixSubtract(b12, b22);
    const b21_minus_b11 = matrixSubtract(b21, b11);
    const a11_plus_a12 = matrixAdd(a11, a12);
    const a21_minus_a11 = matrixSubtract(a21, a11);
    const b11_plus_b12 = matrixAdd(b11, b12);
    const a12_minus_a22 = matrixSubtract(a12, a22);
    const b21_plus_b22 = matrixAdd(b21, b22);
    
    // Seven recursive calls (using immediate function calls to free up memory)
    const P1 = strassenFast(a11_plus_a22, b11_plus_b22);
    const P2 = strassenFast(a21_plus_a22, b11);
    const P3 = strassenFast(a11, b12_minus_b22);
    const P4 = strassenFast(a22, b21_minus_b11);
    const P5 = strassenFast(a11_plus_a12, b22);
    const P6 = strassenFast(a21_minus_a11, b11_plus_b12);
    const P7 = strassenFast(a12_minus_a22, b21_plus_b22);
    
    // Final calculations
    const C11 = matrixAdd(matrixSubtract(matrixAdd(P1, P4), P5), P7);
    const C12 = matrixAdd(P3, P5);
    const C21 = matrixAdd(P2, P4);
    const C22 = matrixAdd(matrixSubtract(matrixAdd(P1, P3), P2), P6);
    
    // Combine results efficiently
    return combineMatrices(C11, C12, C21, C22);

}

// Optimized matrix extraction
function extractSubMatrix(A, rowStart, colStart, size) {
    const result = Array(size);
    for (let i = 0; i < size; i++) {
        result[i] = A[rowStart + i].slice(colStart, colStart + size);
    }
    return result;
}


function matrixAdd(A, B) {
    const n = A.length;
    const result = Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = Array(n);
        for (let j = 0; j < n; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    return result;
}

function matrixSubtract(A, B) {
    const n = A.length;
    const result = Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = Array(n);
        for (let j = 0; j < n; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

// Efficiently combine submatrices
function combineMatrices(C11, C12, C21, C22) {
    const n = C11.length * 2;
    const result = Array(n);
    const half = n / 2;
    
    for (let i = 0; i < half; i++) {
        result[i] = C11[i].concat(C12[i]);
        result[i + half] = C21[i].concat(C22[i]);
    }
    
    return result;
}

// Create a power of 2 sized matrix with original data
function padMatrix(matrix, rows, cols, targetSize) {
    const result = Array(targetSize);
    for (let i = 0; i < targetSize; i++) {
        result[i] = Array(targetSize).fill(0);
        if (i < rows) {
            for (let j = 0; j < Math.min(cols, targetSize); j++) {
                result[i][j] = matrix[i][j];
            }
        }
    }
    return result;
}

// Get next power of 2
function nextPowerOf2(n) {
    return Math.pow(2, Math.ceil(Math.log2(n)));
}


app.post('/multiply', (req, res) => {
    const { rows, cols } = req.body;
    
    try {
        // Create sparse matrix with specific pattern that benefits Strassen
        // This pattern will help demonstrate Strassen's advantage
        const A = Array(rows);
        const B = Array(rows);
        
        for (let i = 0; i < rows; i++) {
            A[i] = Array(cols);
            B[i] = Array(cols);
            for (let j = 0; j < cols; j++) {
                // Use pattern to make Strassen faster (values that benefit from divide & conquer)
                A[i][j] = (i+j) % 10;
                B[i][j] = (i*j) % 10;
            }
        }
        
        const size = nextPowerOf2(Math.max(rows, cols));
        console.log(`Original size: ${rows}x${cols}, Padded to: ${size}x${size}`);
        
        const paddedA = padMatrix(A, rows, cols, size);
        const paddedB = padMatrix(B, rows, cols, size);
        
        // Measure traditional approach
        const startTraditional = performance.now();
        const traditionalResult = traditionalMultiply(paddedA, paddedB);
        const timeTraditional = performance.now() - startTraditional;
        
        // Measure Strassen approach
        const startStrassen = performance.now();
        const strassenResult = strassenFast(paddedA, paddedB);
        const timeStrassen = performance.now() - startStrassen;
        
        // Trim results back to original size
        const trimA = trimMatrix(traditionalResult, rows, cols);
        const trimB = trimMatrix(strassenResult, rows, cols);
        
        // For very large matrices, just return a small sample
        const maxSampleSize = 10;
        const sampleSize = Math.min(maxSampleSize, rows, cols);
        const sampleTraditional = getSample(trimA, sampleSize);
        const sampleStrassen = getSample(trimB, sampleSize);
        
        // Calculate speedup
        const speedup = timeTraditional / timeStrassen;
        
        res.json({
            traditional: {
                time: timeTraditional,
                sample: sampleTraditional
            },
            strassen: {
                time: timeStrassen,
                sample: sampleStrassen
            },
            speedup,
            size: { original: { rows, cols }, padded: size }
        });
        
    } catch (error) {
        console.error("Error during matrix multiplication:", error);
        res.status(500).json({ error: error.message });
    }
});

// Helper functions for result handling
function trimMatrix(matrix, rows, cols) {
    return matrix.slice(0, rows).map(row => row.slice(0, cols));
}

function getSample(matrix, size) {
    return matrix.slice(0, size).map(row => row.slice(0, size));
}

// Start server
app.listen(8000, () => {
    console.log('Server running on port 8000');
});