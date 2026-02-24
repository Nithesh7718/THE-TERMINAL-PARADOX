// Debug questions for Round 2
// In production, these would come from the backend

import type { Language } from "@/react-app/components/LanguageSelector";

export interface DebugQuestion {
  id: number;
  title: string;
  description: string;
  buggyCode: Record<Language, string>;
  testCases: {
    input: string;
    expectedOutput: string;
  }[];
  hint: string;
}

// Door 1 - Syntax Maze
export const door1DebugQuestions: DebugQuestion[] = [
  {
    id: 1,
    title: "Fix the Sum Function",
    description:
      "The function should return the sum of two numbers, but it has a bug. Find and fix it.",
    buggyCode: {
      python: `def add_numbers(a, b):
    result = a - b  # Bug here
    return result

# Test
print(add_numbers(5, 3))`,
      javascript: `function addNumbers(a, b) {
    let result = a - b;  // Bug here
    return result;
}

// Test
console.log(addNumbers(5, 3));`,
      java: `public class Solution {
    public static int addNumbers(int a, int b) {
        int result = a - b;  // Bug here
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(addNumbers(5, 3));
    }
}`,
      c: `#include <stdio.h>

int addNumbers(int a, int b) {
    int result = a - b;  // Bug here
    return result;
}

int main() {
    printf("%d\\n", addNumbers(5, 3));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int addNumbers(int a, int b) {
    int result = a - b;  // Bug here
    return result;
}

int main() {
    cout << addNumbers(5, 3) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "5, 3", expectedOutput: "8" },
      { input: "10, 20", expectedOutput: "30" },
      { input: "-5, 5", expectedOutput: "0" },
    ],
    hint: "Check the arithmetic operator being used.",
  },
  {
    id: 2,
    title: "Fix the Array Maximum",
    description:
      "This function should find the maximum value in an array, but it returns the wrong result.",
    buggyCode: {
      python: `def find_max(arr):
    max_val = 0  # Bug: should initialize differently
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val

# Test
print(find_max([3, 7, 2, 9, 1]))`,
      javascript: `function findMax(arr) {
    let maxVal = 0;  // Bug: should initialize differently
    for (let num of arr) {
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
}

// Test
console.log(findMax([3, 7, 2, 9, 1]));`,
      java: `public class Solution {
    public static int findMax(int[] arr) {
        int maxVal = 0;  // Bug: should initialize differently
        for (int num : arr) {
            if (num > maxVal) {
                maxVal = num;
            }
        }
        return maxVal;
    }
    
    public static void main(String[] args) {
        int[] arr = {3, 7, 2, 9, 1};
        System.out.println(findMax(arr));
    }
}`,
      c: `#include <stdio.h>

int findMax(int arr[], int size) {
    int maxVal = 0;  // Bug: should initialize differently
    for (int i = 0; i < size; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}

int main() {
    int arr[] = {3, 7, 2, 9, 1};
    printf("%d\\n", findMax(arr, 5));
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int findMax(vector<int>& arr) {
    int maxVal = 0;  // Bug: should initialize differently
    for (int num : arr) {
        if (num > maxVal) {
            maxVal = num;
        }
    }
    return maxVal;
}

int main() {
    vector<int> arr = {3, 7, 2, 9, 1};
    cout << findMax(arr) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "[3, 7, 2, 9, 1]", expectedOutput: "9" },
      { input: "[-5, -2, -8, -1]", expectedOutput: "-1" },
      { input: "[100]", expectedOutput: "100" },
    ],
    hint: "What happens when all numbers are negative?",
  },
  {
    id: 3,
    title: "Fix the Loop Counter",
    description:
      "This code should print numbers from 1 to 5, but it has an off-by-one error.",
    buggyCode: {
      python: `def print_numbers():
    for i in range(1, 5):  # Bug: wrong range
        print(i)

print_numbers()`,
      javascript: `function printNumbers() {
    for (let i = 1; i < 5; i++) {  // Bug: wrong condition
        console.log(i);
    }
}

printNumbers();`,
      java: `public class Solution {
    public static void printNumbers() {
        for (int i = 1; i < 5; i++) {  // Bug: wrong condition
            System.out.println(i);
        }
    }
    
    public static void main(String[] args) {
        printNumbers();
    }
}`,
      c: `#include <stdio.h>

void printNumbers() {
    for (int i = 1; i < 5; i++) {  // Bug: wrong condition
        printf("%d\\n", i);
    }
}

int main() {
    printNumbers();
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

void printNumbers() {
    for (int i = 1; i < 5; i++) {  // Bug: wrong condition
        cout << i << endl;
    }
}

int main() {
    printNumbers();
    return 0;
}`,
    },
    testCases: [
      { input: "", expectedOutput: "1\n2\n3\n4\n5" },
    ],
    hint: "Check the loop boundary condition.",
  },
  {
    id: 4,
    title: "Fix String Reversal",
    description:
      "This function should reverse a string, but it's not working correctly.",
    buggyCode: {
      python: `def reverse_string(s):
    reversed_str = ""
    for i in range(len(s)):  # Bug: wrong iteration direction
        reversed_str += s[i]
    return reversed_str

print(reverse_string("hello"))`,
      javascript: `function reverseString(s) {
    let reversed = "";
    for (let i = 0; i < s.length; i++) {  // Bug: wrong direction
        reversed += s[i];
    }
    return reversed;
}

console.log(reverseString("hello"));`,
      java: `public class Solution {
    public static String reverseString(String s) {
        StringBuilder reversed = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {  // Bug: wrong direction
            reversed.append(s.charAt(i));
        }
        return reversed.toString();
    }
    
    public static void main(String[] args) {
        System.out.println(reverseString("hello"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

void reverseString(char* s, char* result) {
    int len = strlen(s);
    for (int i = 0; i < len; i++) {  // Bug: wrong direction
        result[i] = s[i];
    }
    result[len] = '\\0';
}

int main() {
    char s[] = "hello";
    char result[100];
    reverseString(s, result);
    printf("%s\\n", result);
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

string reverseString(string s) {
    string reversed = "";
    for (int i = 0; i < s.length(); i++) {  // Bug: wrong direction
        reversed += s[i];
    }
    return reversed;
}

int main() {
    cout << reverseString("hello") << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "world", expectedOutput: "dlrow" },
      { input: "a", expectedOutput: "a" },
    ],
    hint: "In which direction should you iterate to reverse?",
  },
  {
    id: 5,
    title: "Fix the Factorial",
    description:
      "This recursive factorial function has a bug that causes incorrect results.",
    buggyCode: {
      python: `def factorial(n):
    if n == 0:
        return 0  # Bug: wrong base case
    return n * factorial(n - 1)

print(factorial(5))`,
      javascript: `function factorial(n) {
    if (n === 0) {
        return 0;  // Bug: wrong base case
    }
    return n * factorial(n - 1);
}

console.log(factorial(5));`,
      java: `public class Solution {
    public static int factorial(int n) {
        if (n == 0) {
            return 0;  // Bug: wrong base case
        }
        return n * factorial(n - 1);
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5));
    }
}`,
      c: `#include <stdio.h>

int factorial(int n) {
    if (n == 0) {
        return 0;  // Bug: wrong base case
    }
    return n * factorial(n - 1);
}

int main() {
    printf("%d\\n", factorial(5));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int factorial(int n) {
    if (n == 0) {
        return 0;  // Bug: wrong base case
    }
    return n * factorial(n - 1);
}

int main() {
    cout << factorial(5) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "0", expectedOutput: "1" },
      { input: "3", expectedOutput: "6" },
    ],
    hint: "What should factorial(0) return?",
  },
];

// Door 2 - Logic Trap (use same structure, different problems)
export const door2DebugQuestions: DebugQuestion[] = [
  {
    id: 1,
    title: "Fix the Even/Odd Checker",
    description:
      "This function should return true if a number is even, but it's backwards.",
    buggyCode: {
      python: `def is_even(n):
    return n % 2 == 1  # Bug: wrong comparison

print(is_even(4))`,
      javascript: `function isEven(n) {
    return n % 2 === 1;  // Bug: wrong comparison
}

console.log(isEven(4));`,
      java: `public class Solution {
    public static boolean isEven(int n) {
        return n % 2 == 1;  // Bug: wrong comparison
    }
    
    public static void main(String[] args) {
        System.out.println(isEven(4));
    }
}`,
      c: `#include <stdio.h>

int isEven(int n) {
    return n % 2 == 1;  // Bug: wrong comparison
}

int main() {
    printf("%d\\n", isEven(4));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

bool isEven(int n) {
    return n % 2 == 1;  // Bug: wrong comparison
}

int main() {
    cout << boolalpha << isEven(4) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "4", expectedOutput: "true" },
      { input: "7", expectedOutput: "false" },
      { input: "0", expectedOutput: "true" },
    ],
    hint: "What remainder does an even number have when divided by 2?",
  },
  {
    id: 2,
    title: "Fix the Array Sum",
    description:
      "This function calculates sum but skips elements.",
    buggyCode: {
      python: `def array_sum(arr):
    total = 0
    for i in range(0, len(arr), 2):  # Bug: wrong step
        total += arr[i]
    return total

print(array_sum([1, 2, 3, 4, 5]))`,
      javascript: `function arraySum(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i += 2) {  // Bug: wrong step
        total += arr[i];
    }
    return total;
}

console.log(arraySum([1, 2, 3, 4, 5]));`,
      java: `public class Solution {
    public static int arraySum(int[] arr) {
        int total = 0;
        for (int i = 0; i < arr.length; i += 2) {  // Bug: wrong step
            total += arr[i];
        }
        return total;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        System.out.println(arraySum(arr));
    }
}`,
      c: `#include <stdio.h>

int arraySum(int arr[], int size) {
    int total = 0;
    for (int i = 0; i < size; i += 2) {  // Bug: wrong step
        total += arr[i];
    }
    return total;
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    printf("%d\\n", arraySum(arr, 5));
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int arraySum(vector<int>& arr) {
    int total = 0;
    for (int i = 0; i < arr.size(); i += 2) {  // Bug: wrong step
        total += arr[i];
    }
    return total;
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    cout << arraySum(arr) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "15" },
      { input: "[10, 20, 30]", expectedOutput: "60" },
      { input: "[5]", expectedOutput: "5" },
    ],
    hint: "Check the loop increment step.",
  },
  {
    id: 3,
    title: "Fix the Power Function",
    description:
      "This function should calculate base^exponent but gives wrong results.",
    buggyCode: {
      python: `def power(base, exp):
    result = 0  # Bug: wrong initial value
    for _ in range(exp):
        result *= base
    return result

print(power(2, 3))`,
      javascript: `function power(base, exp) {
    let result = 0;  // Bug: wrong initial value
    for (let i = 0; i < exp; i++) {
        result *= base;
    }
    return result;
}

console.log(power(2, 3));`,
      java: `public class Solution {
    public static int power(int base, int exp) {
        int result = 0;  // Bug: wrong initial value
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(power(2, 3));
    }
}`,
      c: `#include <stdio.h>

int power(int base, int exp) {
    int result = 0;  // Bug: wrong initial value
    for (int i = 0; i < exp; i++) {
        result *= base;
    }
    return result;
}

int main() {
    printf("%d\\n", power(2, 3));
    return 0;
}`,
      cpp: `#include <iostream>
using namespace std;

int power(int base, int exp) {
    int result = 0;  // Bug: wrong initial value
    for (int i = 0; i < exp; i++) {
        result *= base;
    }
    return result;
}

int main() {
    cout << power(2, 3) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "2, 3", expectedOutput: "8" },
      { input: "5, 2", expectedOutput: "25" },
      { input: "3, 0", expectedOutput: "1" },
    ],
    hint: "What should the initial value be for multiplication?",
  },
  {
    id: 4,
    title: "Fix the Palindrome Checker",
    description:
      "This function should check if a string is a palindrome.",
    buggyCode: {
      python: `def is_palindrome(s):
    left = 0
    right = len(s)  # Bug: off by one
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("racecar"))`,
      javascript: `function isPalindrome(s) {
    let left = 0;
    let right = s.length;  // Bug: off by one
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

console.log(isPalindrome("racecar"));`,
      java: `public class Solution {
    public static boolean isPalindrome(String s) {
        int left = 0;
        int right = s.length();  // Bug: off by one
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("racecar"));
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

int isPalindrome(char* s) {
    int left = 0;
    int right = strlen(s);  // Bug: off by one
    while (left < right) {
        if (s[left] != s[right]) {
            return 0;
        }
        left++;
        right--;
    }
    return 1;
}

int main() {
    printf("%d\\n", isPalindrome("racecar"));
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    int left = 0;
    int right = s.length();  // Bug: off by one
    while (left < right) {
        if (s[left] != s[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

int main() {
    cout << boolalpha << isPalindrome("racecar") << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "racecar", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" },
      { input: "a", expectedOutput: "true" },
    ],
    hint: "What is the index of the last character?",
  },
  {
    id: 5,
    title: "Fix the Count Occurrences",
    description:
      "This function should count how many times a value appears in an array.",
    buggyCode: {
      python: `def count_occurrences(arr, target):
    count = 0
    for num in arr:
        if num == target:
            count += 1
            break  # Bug: shouldn't break
    return count

print(count_occurrences([1, 2, 2, 3, 2, 4], 2))`,
      javascript: `function countOccurrences(arr, target) {
    let count = 0;
    for (let num of arr) {
        if (num === target) {
            count++;
            break;  // Bug: shouldn't break
        }
    }
    return count;
}

console.log(countOccurrences([1, 2, 2, 3, 2, 4], 2));`,
      java: `public class Solution {
    public static int countOccurrences(int[] arr, int target) {
        int count = 0;
        for (int num : arr) {
            if (num == target) {
                count++;
                break;  // Bug: shouldn't break
            }
        }
        return count;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 2, 2, 3, 2, 4};
        System.out.println(countOccurrences(arr, 2));
    }
}`,
      c: `#include <stdio.h>

int countOccurrences(int arr[], int size, int target) {
    int count = 0;
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            count++;
            break;  // Bug: shouldn't break
        }
    }
    return count;
}

int main() {
    int arr[] = {1, 2, 2, 3, 2, 4};
    printf("%d\\n", countOccurrences(arr, 6, 2));
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int countOccurrences(vector<int>& arr, int target) {
    int count = 0;
    for (int num : arr) {
        if (num == target) {
            count++;
            break;  // Bug: shouldn't break
        }
    }
    return count;
}

int main() {
    vector<int> arr = {1, 2, 2, 3, 2, 4};
    cout << countOccurrences(arr, 2) << endl;
    return 0;
}`,
    },
    testCases: [
      { input: "[1, 2, 2, 3, 2, 4], 2", expectedOutput: "3" },
      { input: "[1, 1, 1, 1], 1", expectedOutput: "4" },
      { input: "[1, 2, 3], 5", expectedOutput: "0" },
    ],
    hint: "Should the loop stop after finding the first match?",
  },
];

// Door 3 - Runtime Rush
export const door3DebugQuestions: DebugQuestion[] = door1DebugQuestions.map((q, i) => ({
  ...q,
  id: i + 1,
  title: `Challenge ${i + 1}: ${q.title}`,
}));

export const getDebugQuestionsForDoor = (doorNumber: number): DebugQuestion[] => {
  switch (doorNumber) {
    case 1:
      return door1DebugQuestions;
    case 2:
      return door2DebugQuestions;
    case 3:
      return door3DebugQuestions;
    default:
      return door1DebugQuestions;
  }
};
