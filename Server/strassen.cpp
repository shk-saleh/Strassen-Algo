#include <bits/stdc++.h>
#include <chrono>
using namespace std;
using namespace chrono;

typedef vector<vector<int>> Matrix;

// Add two matrices
Matrix add(const Matrix &A, const Matrix &B) {
    int n = A.size(), m = A[0].size();
    Matrix C(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            C[i][j] = A[i][j] + B[i][j];
    return C;
}

// Subtract matrix B from A
Matrix subtract(const Matrix &A, const Matrix &B) {
    int n = A.size(), m = A[0].size();
    Matrix C(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            C[i][j] = A[i][j] - B[i][j];
    return C;
}

// Traditional multiplication
Matrix traditionalMultiply(const Matrix &A, const Matrix &B) {
    int n = A.size(), m = B[0].size(), p = B.size();
    Matrix C(n, vector<int>(m, 0));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            for (int k = 0; k < p; k++)
                C[i][j] += A[i][k] * B[k][j];
    return C;
}

// Pad matrix to size nxn
Matrix padMatrix(const Matrix &A, int n) {
    Matrix padded(n, vector<int>(n, 0));
    for (int i = 0; i < A.size(); i++)
        for (int j = 0; j < A[0].size(); j++)
            padded[i][j] = A[i][j];
    return padded;
}

// Remove padding
Matrix unpadMatrix(const Matrix &A, int n, int m) {
    Matrix result(n, vector<int>(m));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            result[i][j] = A[i][j];
    return result;
}

// Split matrix into 4 submatrices
void split(const Matrix &A, Matrix &A11, Matrix &A12, Matrix &A21, Matrix &A22) {
    int n = A.size() / 2;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            A11[i][j] = A[i][j];
            A12[i][j] = A[i][j + n];
            A21[i][j] = A[i + n][j];
            A22[i][j] = A[i + n][j + n];
        }
    }
}

// Join 4 submatrices into one
Matrix join(const Matrix &C11, const Matrix &C12, const Matrix &C21, const Matrix &C22) {
    int n = C11.size();
    Matrix C(2 * n, vector<int>(2 * n));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            C[i][j] = C11[i][j];
            C[i][j + n] = C12[i][j];
            C[i + n][j] = C21[i][j];
            C[i + n][j + n] = C22[i][j];
        }
    }
    return C;
}

// Strassen algorithm
Matrix strassen(const Matrix &A, const Matrix &B) {
    int n = A.size();
    if (n <= 64)
        return traditionalMultiply(A, B);

    int newSize = n / 2;
    Matrix A11(newSize, vector<int>(newSize)), A12(newSize, vector<int>(newSize)),
           A21(newSize, vector<int>(newSize)), A22(newSize, vector<int>(newSize));
    Matrix B11(newSize, vector<int>(newSize)), B12(newSize, vector<int>(newSize)),
           B21(newSize, vector<int>(newSize)), B22(newSize, vector<int>(newSize));

    split(A, A11, A12, A21, A22);
    split(B, B11, B12, B21, B22);

    Matrix M1 = strassen(add(A11, A22), add(B11, B22));
    Matrix M2 = strassen(add(A21, A22), B11);
    Matrix M3 = strassen(A11, subtract(B12, B22));
    Matrix M4 = strassen(A22, subtract(B21, B11));
    Matrix M5 = strassen(add(A11, A12), B22);
    Matrix M6 = strassen(subtract(A21, A11), add(B11, B12));
    Matrix M7 = strassen(subtract(A12, A22), add(B21, B22));

    Matrix C11 = add(subtract(add(M1, M4), M5), M7);
    Matrix C12 = add(M3, M5);
    Matrix C21 = add(M2, M4);
    Matrix C22 = add(subtract(add(M1, M3), M2), M6);

    return join(C11, C12, C21, C22);
}

int nextPowerOfTwo(int n) {
    int power = 1;
    while (power < n) power <<= 1;
    return power;
}

int main() {
    int n;
    cout << "Enter matrix size: ";
    cin >> n;

    // Fill both matrices with 1s
    Matrix A(n, vector<int>(n, 1));
    Matrix B(n, vector<int>(n, 1));

    // Traditional multiply
    auto start1 = high_resolution_clock::now();
    Matrix C1 = traditionalMultiply(A, B);
    auto end1 = high_resolution_clock::now();
    cout << "Traditional Time: " << duration_cast<milliseconds>(end1 - start1).count() << " ms\n";

    // Strassen multiply
    int newSize = nextPowerOfTwo(n);
    Matrix A_padded = padMatrix(A, newSize);
    Matrix B_padded = padMatrix(B, newSize);

    auto start2 = high_resolution_clock::now();
    Matrix C2_padded = strassen(A_padded, B_padded);
    auto end2 = high_resolution_clock::now();

    Matrix C2 = unpadMatrix(C2_padded, n, n);
    cout << "Strassen Time: " << duration_cast<milliseconds>(end2 - start2).count() << " ms\n";

    return 0;
}
