// Debug questions for Round 2
// Buggy code reads from stdin so Judge0 can test with different inputs.

import type { Language } from "@/react-app/components/LanguageSelector";

export interface DebugQuestion {
    id: number;
    title: string;
    description: string;
    buggyCode: Record<Language, string>;
    testCases: {
        input: string;    // actual stdin sent to Judge0
        expectedOutput: string;
    }[];
    hint: string;
}

// ── Door 1 – Syntax Maze ──────────────────────────────────────────────
export const door1DebugQuestions: DebugQuestion[] = [
    {
        id: 1,
        title: "Fix the Sum Function",
        description:
            "The function should return the sum of two numbers, but it has a bug. Find and fix it.",
        buggyCode: {
            python: `a, b = map(int, input().split())

def add_numbers(a, b):
    result = a - b  # Bug here
    return result

print(add_numbers(a, b))`,
            javascript: `const [a, b] = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);

function addNumbers(a, b) {
    let result = a - b;  // Bug here
    return result;
}

console.log(addNumbers(a, b));`,
            java: `import java.util.Scanner;
public class Solution {
    public static int addNumbers(int a, int b) {
        int result = a - b;  // Bug here
        return result;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt();
        System.out.println(addNumbers(a, b));
    }
}`,
            c: `#include <stdio.h>
int addNumbers(int a, int b) {
    int result = a - b;  // Bug here
    return result;
}
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", addNumbers(a, b));
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
int addNumbers(int a, int b) {
    int result = a - b;  // Bug here
    return result;
}
int main() {
    int a, b;
    cin >> a >> b;
    cout << addNumbers(a, b) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "5 3", expectedOutput: "8" },
            { input: "10 20", expectedOutput: "30" },
            { input: "-5 5", expectedOutput: "0" },
        ],
        hint: "Check the arithmetic operator being used.",
    },
    {
        id: 2,
        title: "Fix the Array Maximum",
        description:
            "This function should find the maximum value in an array, but it returns the wrong result for negative numbers.",
        buggyCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))

def find_max(arr):
    max_val = 0  # Bug: should initialize differently
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val

print(find_max(arr))`,
            javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const n = parseInt(lines[0]);
const arr = lines[1].split(' ').map(Number);

function findMax(arr) {
    let maxVal = 0;  // Bug: should initialize differently
    for (let num of arr) {
        if (num > maxVal) maxVal = num;
    }
    return maxVal;
}

console.log(findMax(arr));`,
            java: `import java.util.*;
public class Solution {
    public static int findMax(int[] arr) {
        int maxVal = 0;  // Bug: should initialize differently
        for (int num : arr) {
            if (num > maxVal) maxVal = num;
        }
        return maxVal;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.println(findMax(arr));
    }
}`,
            c: `#include <stdio.h>
int findMax(int arr[], int size) {
    int maxVal = 0;  // Bug: should initialize differently
    for (int i = 0; i < size; i++) {
        if (arr[i] > maxVal) maxVal = arr[i];
    }
    return maxVal;
}
int main() {
    int n; scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    printf("%d\\n", findMax(arr, n));
    return 0;
}`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;
int findMax(vector<int>& arr) {
    int maxVal = 0;  // Bug: should initialize differently
    for (int num : arr) {
        if (num > maxVal) maxVal = num;
    }
    return maxVal;
}
int main() {
    int n; cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << findMax(arr) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "5\n3 7 2 9 1", expectedOutput: "9" },
            { input: "4\n-5 -2 -8 -1", expectedOutput: "-1" },
            { input: "1\n100", expectedOutput: "100" },
        ],
        hint: "What happens when all numbers are negative?",
    },
    {
        id: 3,
        title: "Fix the Loop Counter",
        description:
            "This code should print numbers from 1 to N (inclusive), but it has an off-by-one error.",
        buggyCode: {
            python: `n = int(input())

def print_numbers(n):
    for i in range(1, n):  # Bug: wrong range
        print(i)

print_numbers(n)`,
            javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

function printNumbers(n) {
    for (let i = 1; i < n; i++) {  // Bug: wrong condition
        console.log(i);
    }
}

printNumbers(n);`,
            java: `import java.util.Scanner;
public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        for (int i = 1; i < n; i++) {  // Bug: wrong condition
            System.out.println(i);
        }
    }
}`,
            c: `#include <stdio.h>
int main() {
    int n; scanf("%d", &n);
    for (int i = 1; i < n; i++) {  // Bug: wrong condition
        printf("%d\\n", i);
    }
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
int main() {
    int n; cin >> n;
    for (int i = 1; i < n; i++) {  // Bug: wrong condition
        cout << i << endl;
    }
    return 0;
}`,
        },
        testCases: [
            { input: "5", expectedOutput: "1\n2\n3\n4\n5" },
            { input: "3", expectedOutput: "1\n2\n3" },
            { input: "1", expectedOutput: "1" },
        ],
        hint: "Check the loop boundary condition — should it use < or <=?",
    },
    {
        id: 4,
        title: "Fix String Reversal",
        description:
            "This function should reverse a string, but it's not working correctly.",
        buggyCode: {
            python: `s = input()

def reverse_string(s):
    reversed_str = ""
    for i in range(len(s)):  # Bug: wrong iteration direction
        reversed_str += s[i]
    return reversed_str

print(reverse_string(s))`,
            javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

function reverseString(s) {
    let reversed = "";
    for (let i = 0; i < s.length; i++) {  // Bug: wrong direction
        reversed += s[i];
    }
    return reversed;
}

console.log(reverseString(s));`,
            java: `import java.util.Scanner;
public class Solution {
    public static String reverseString(String s) {
        StringBuilder reversed = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {  // Bug: wrong direction
            reversed.append(s.charAt(i));
        }
        return reversed.toString();
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(reverseString(sc.nextLine()));
    }
}`,
            c: `#include <stdio.h>
#include <string.h>
int main() {
    char s[100], result[100];
    scanf("%s", s);
    int len = strlen(s);
    for (int i = 0; i < len; i++) {  // Bug: wrong direction
        result[i] = s[i];
    }
    result[len] = '\\0';
    printf("%s\\n", result);
    return 0;
}`,
            cpp: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string s; cin >> s;
    string reversed = "";
    for (int i = 0; i < (int)s.length(); i++) {  // Bug: wrong direction
        reversed += s[i];
    }
    cout << reversed << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "hello", expectedOutput: "olleh" },
            { input: "world", expectedOutput: "dlrow" },
            { input: "a", expectedOutput: "a" },
        ],
        hint: "Iterate from the end of the string to the beginning.",
    },
    {
        id: 5,
        title: "Fix the Factorial",
        description:
            "This recursive factorial function has a bug that causes incorrect results.",
        buggyCode: {
            python: `n = int(input())

def factorial(n):
    if n == 0:
        return 0  # Bug: wrong base case
    return n * factorial(n - 1)

print(factorial(n))`,
            javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

function factorial(n) {
    if (n === 0) {
        return 0;  // Bug: wrong base case
    }
    return n * factorial(n - 1);
}

console.log(factorial(n));`,
            java: `import java.util.Scanner;
public class Solution {
    public static int factorial(int n) {
        if (n == 0) {
            return 0;  // Bug: wrong base case
        }
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(factorial(sc.nextInt()));
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
    int n; scanf("%d", &n);
    printf("%d\\n", factorial(n));
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
    int n; cin >> n;
    cout << factorial(n) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "5", expectedOutput: "120" },
            { input: "0", expectedOutput: "1" },
            { input: "3", expectedOutput: "6" },
        ],
        hint: "What should factorial(0) return to make multiplication work?",
    },
];

// ── Door 2 – Logic Trap ───────────────────────────────────────────────
export const door2DebugQuestions: DebugQuestion[] = [
    {
        id: 1,
        title: "Fix the Even/Odd Checker",
        description:
            "This function should print 'true' if a number is even, but the logic is backwards.",
        buggyCode: {
            python: `n = int(input())

def is_even(n):
    return n % 2 == 1  # Bug: wrong comparison

print(str(is_even(n)).lower())`,
            javascript: `const n = parseInt(require('fs').readFileSync('/dev/stdin','utf8').trim());

function isEven(n) {
    return n % 2 === 1;  // Bug: wrong comparison
}

console.log(isEven(n));`,
            java: `import java.util.Scanner;
public class Solution {
    public static boolean isEven(int n) {
        return n % 2 == 1;  // Bug: wrong comparison
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(isEven(sc.nextInt()));
    }
}`,
            c: `#include <stdio.h>
int isEven(int n) {
    return n % 2 == 1;  // Bug: wrong comparison
}
int main() {
    int n; scanf("%d", &n);
    printf("%s\\n", isEven(n) ? "true" : "false");
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
bool isEven(int n) {
    return n % 2 == 1;  // Bug: wrong comparison
}
int main() {
    int n; cin >> n;
    cout << boolalpha << isEven(n) << endl;
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
            "This function calculates the sum of an array but skips elements due to a wrong loop step.",
        buggyCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))

def array_sum(arr):
    total = 0
    for i in range(0, len(arr), 2):  # Bug: wrong step
        total += arr[i]
    return total

print(array_sum(arr))`,
            javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const arr = lines[1].split(' ').map(Number);

function arraySum(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i += 2) {  // Bug: wrong step
        total += arr[i];
    }
    return total;
}

console.log(arraySum(arr));`,
            java: `import java.util.*;
public class Solution {
    public static int arraySum(int[] arr) {
        int total = 0;
        for (int i = 0; i < arr.length; i += 2) {  // Bug: wrong step
            total += arr[i];
        }
        return total;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
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
    int n; scanf("%d", &n);
    int arr[100];
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    printf("%d\\n", arraySum(arr, n));
    return 0;
}`,
            cpp: `#include <iostream>
#include <vector>
using namespace std;
int arraySum(vector<int>& arr) {
    int total = 0;
    for (int i = 0; i < (int)arr.size(); i += 2) {  // Bug: wrong step
        total += arr[i];
    }
    return total;
}
int main() {
    int n; cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << arraySum(arr) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "5\n1 2 3 4 5", expectedOutput: "15" },
            { input: "3\n10 20 30", expectedOutput: "60" },
            { input: "1\n5", expectedOutput: "5" },
        ],
        hint: "Check the loop increment step — it should visit every element, not alternate ones.",
    },
    {
        id: 3,
        title: "Fix the Power Function",
        description:
            "This function should calculate base^exponent but gives wrong results due to an incorrect initial value.",
        buggyCode: {
            python: `base, exp = map(int, input().split())

def power(base, exp):
    result = 0  # Bug: wrong initial value
    for _ in range(exp):
        result *= base
    return result

print(power(base, exp))`,
            javascript: `const [base, exp] = require('fs').readFileSync('/dev/stdin','utf8').trim().split(' ').map(Number);

function power(base, exp) {
    let result = 0;  // Bug: wrong initial value
    for (let i = 0; i < exp; i++) {
        result *= base;
    }
    return result;
}

console.log(power(base, exp));`,
            java: `import java.util.Scanner;
public class Solution {
    public static int power(int base, int exp) {
        int result = 0;  // Bug: wrong initial value
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(power(sc.nextInt(), sc.nextInt()));
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
    int base, exp;
    scanf("%d %d", &base, &exp);
    printf("%d\\n", power(base, exp));
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
    int base, exp; cin >> base >> exp;
    cout << power(base, exp) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "2 3", expectedOutput: "8" },
            { input: "5 2", expectedOutput: "25" },
            { input: "3 0", expectedOutput: "1" },
        ],
        hint: "What should the initial value be for multiplication to work correctly?",
    },
    {
        id: 4,
        title: "Fix the Palindrome Checker",
        description:
            "This function should check if a string is a palindrome and print true/false.",
        buggyCode: {
            python: `s = input()

def is_palindrome(s):
    left = 0
    right = len(s)  # Bug: off by one
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

print(str(is_palindrome(s)).lower())`,
            javascript: `const s = require('fs').readFileSync('/dev/stdin','utf8').trim();

function isPalindrome(s) {
    let left = 0, right = s.length;  // Bug: off by one
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++; right--;
    }
    return true;
}

console.log(isPalindrome(s));`,
            java: `import java.util.Scanner;
public class Solution {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length();  // Bug: off by one
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++; right--;
        }
        return true;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(isPalindrome(sc.nextLine()));
    }
}`,
            c: `#include <stdio.h>
#include <string.h>
int isPalindrome(char* s) {
    int left = 0, right = strlen(s);  // Bug: off by one
    while (left < right) {
        if (s[left] != s[right]) return 0;
        left++; right--;
    }
    return 1;
}
int main() {
    char s[100]; scanf("%s", s);
    printf("%s\\n", isPalindrome(s) ? "true" : "false");
    return 0;
}`,
            cpp: `#include <iostream>
#include <string>
using namespace std;
bool isPalindrome(string s) {
    int left = 0, right = s.length();  // Bug: off by one
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++; right--;
    }
    return true;
}
int main() {
    string s; cin >> s;
    cout << boolalpha << isPalindrome(s) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "racecar", expectedOutput: "true" },
            { input: "hello", expectedOutput: "false" },
            { input: "a", expectedOutput: "true" },
        ],
        hint: "Array indices are 0-based — what is the index of the last character?",
    },
    {
        id: 5,
        title: "Fix the Count Occurrences",
        description:
            "This function should count how many times a value appears in an array, but it stops too early.",
        buggyCode: {
            python: `n = int(input())
arr = list(map(int, input().split()))
target = int(input())

def count_occurrences(arr, target):
    count = 0
    for num in arr:
        if num == target:
            count += 1
            break  # Bug: shouldn't break
    return count

print(count_occurrences(arr, target))`,
            javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
const arr = lines[1].split(' ').map(Number);
const target = parseInt(lines[2]);

function countOccurrences(arr, target) {
    let count = 0;
    for (let num of arr) {
        if (num === target) {
            count++;
            break;  // Bug: shouldn't break
        }
    }
    return count;
}

console.log(countOccurrences(arr, target));`,
            java: `import java.util.*;
public class Solution {
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
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int target = sc.nextInt();
        System.out.println(countOccurrences(arr, target));
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
    int n; scanf("%d", &n);
    int arr[100], target;
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    scanf("%d", &target);
    printf("%d\\n", countOccurrences(arr, n, target));
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
    int n; cin >> n;
    vector<int> arr(n);
    for (int i = 0; i < n; i++) cin >> arr[i];
    int target; cin >> target;
    cout << countOccurrences(arr, target) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "6\n1 2 2 3 2 4\n2", expectedOutput: "3" },
            { input: "4\n1 1 1 1\n1", expectedOutput: "4" },
            { input: "3\n1 2 3\n5", expectedOutput: "0" },
        ],
        hint: "Should the loop stop after finding the first match? What happens if we remove break?",
    },
];

// Door 3 - Runtime Rush (re-uses Door 1 set)
export const door3DebugQuestions: DebugQuestion[] = door1DebugQuestions.map((q, i) => ({
    ...q,
    id: i + 1,
    title: `Challenge ${i + 1}: ${q.title}`,
}));

export const getDebugQuestionsForDoor = (doorNumber: number): DebugQuestion[] => {
    switch (doorNumber) {
        case 1: return door1DebugQuestions;
        case 2: return door2DebugQuestions;
        case 3: return door3DebugQuestions;
        default: return door1DebugQuestions;
    }
};
