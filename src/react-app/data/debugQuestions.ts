// Debug questions for Round 2 — Native Input Model
//
// HOW IT WORKS:
// • buggyCode reads input natively (input(), Scanner, scanf, cin)
// • inputPreamble is kept for the UI to display variable hints
// • Judge0 receives tc.input as stdin
// • Students fix only the logic bug — input reading is correct

import type { Language } from "@/react-app/components/LanguageSelector";

export interface DebugQuestion {
    id: number;
    title: string;
    description: string;
    /** Short names shown in the UI above the editor, e.g. ["a","b"] */
    inputVarNames: string[];
    /** Per-language preamble template — for UI display only */
    inputPreamble: Record<Language, string>;
    /** Buggy code that reads input natively via stdin */
    buggyCode: Record<Language, string>;
    testCases: { input: string; expectedOutput: string }[];
    hint: string;
}

// ── Door 1 – Syntax Maze ─────────────────────────────────────────────
export const door1DebugQuestions: DebugQuestion[] = [
    {
        id: 1,
        title: "Fix the Sum Function",
        description:
            "The function should return the sum of two numbers `a` and `b`, but it has a bug. Find and fix it.",
        inputVarNames: ["a", "b"],
        inputPreamble: {
            python: "a, b = {0}, {1}",
            javascript: "let a = {0}, b = {1};",
            java: "int a = {0}, b = {1};",
            c: "int a = {0}, b = {1};",
            cpp: "int a = {0}, b = {1};",
        },
        buggyCode: {
            python: `def add_numbers(a, b):
    result = a - b  # Bug here
    return result

a, b = map(int, input().split())
print(add_numbers(a, b))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const [a, b] = line.trim().split(' ').map(Number);
    function addNumbers(a, b) {
        let result = a - b;  // Bug here
        return result;
    }
    console.log(addNumbers(a, b));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
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
        hint: "Check the arithmetic operator being used in add_numbers.",
    },
    {
        id: 2,
        title: "Fix the Factorial",
        description:
            "This recursive factorial function has a wrong base case. Fix it so factorial(0) returns the correct value.",
        inputVarNames: ["n"],
        inputPreamble: {
            python: "n = {0}",
            javascript: "let n = {0};",
            java: "int n = {0};",
            c: "int n = {0};",
            cpp: "int n = {0};",
        },
        buggyCode: {
            python: `def factorial(n):
    if n == 0:
        return 0  # Bug: wrong base case
    return n * factorial(n - 1)

n = int(input())
print(factorial(n))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const n = parseInt(line.trim());
    function factorial(n) {
        if (n === 0) return 0;  // Bug: wrong base case
        return n * factorial(n - 1);
    }
    console.log(factorial(n));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
    public static int factorial(int n) {
        if (n == 0) return 0;  // Bug: wrong base case
        return n * factorial(n - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(factorial(n));
    }
}`,
            c: `#include <stdio.h>
int factorial(int n) {
    if (n == 0) return 0;  // Bug: wrong base case
    return n * factorial(n - 1);
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", factorial(n));
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
int factorial(int n) {
    if (n == 0) return 0;  // Bug: wrong base case
    return n * factorial(n - 1);
}
int main() {
    int n;
    cin >> n;
    cout << factorial(n) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "5", expectedOutput: "120" },
            { input: "0", expectedOutput: "1" },
            { input: "3", expectedOutput: "6" },
        ],
        hint: "What should factorial(0) return so the multiplication chain works?",
    },
    {
        id: 3,
        title: "Fix the Loop Counter",
        description:
            "This code should print all numbers from 1 to n (inclusive), but the loop has an off-by-one error.",
        inputVarNames: ["n"],
        inputPreamble: {
            python: "n = {0}",
            javascript: "let n = {0};",
            java: "int n = {0};",
            c: "int n = {0};",
            cpp: "int n = {0};",
        },
        buggyCode: {
            python: `n = int(input())
for i in range(1, n):  # Bug: wrong range
    print(i)`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const n = parseInt(line.trim());
    for (let i = 1; i < n; i++) {  // Bug: wrong condition
        console.log(i);
    }
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
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
    int n;
    scanf("%d", &n);
    for (int i = 1; i < n; i++) {  // Bug: wrong condition
        printf("%d\\n", i);
    }
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
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
        hint: "Should the loop stop before n, or include n? Check < vs <=.",
    },
    {
        id: 4,
        title: "Fix String Reversal",
        description:
            "This function should reverse a string `s`, but the loop runs in the wrong direction.",
        inputVarNames: ["s"],
        inputPreamble: {
            python: `s = "{0}"`,
            javascript: `let s = "{0}";`,
            java: `String s = "{0}";`,
            c: `char s[] = "{0}";`,
            cpp: `string s = "{0}";`,
        },
        buggyCode: {
            python: `def reverse_string(s):
    reversed_str = ""
    for i in range(len(s)):  # Bug: wrong iteration direction
        reversed_str += s[i]
    return reversed_str

s = input()
print(reverse_string(s))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const s = line.trim();
    function reverseString(s) {
        let reversed = "";
        for (let i = 0; i < s.length; i++) {  // Bug: wrong direction
            reversed += s[i];
        }
        return reversed;
    }
    console.log(reverseString(s));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
    public static String reverseString(String s) {
        StringBuilder reversed = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {  // Bug: wrong direction
            reversed.append(s.charAt(i));
        }
        return reversed.toString();
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(reverseString(s));
    }
}`,
            c: `#include <stdio.h>
#include <string.h>
int main() {
    char s[100];
    scanf("%s", s);
    int len = strlen(s);
    char result[100];
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
    string s;
    cin >> s;
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
        hint: "To reverse, iterate from the last character down to the first.",
    },
    {
        id: 5,
        title: "Fix the Array Maximum",
        description:
            "find_max should return the maximum of three numbers. It gives wrong answers when all values are negative.",
        inputVarNames: ["a", "b", "c"],
        inputPreamble: {
            python: "a, b, c = {0}, {1}, {2}",
            javascript: "let a = {0}, b = {1}, c = {2};",
            java: "int a = {0}, b = {1}, c = {2};",
            c: "int a = {0}, b = {1}, c = {2};",
            cpp: "int a = {0}, b = {1}, c = {2};",
        },
        buggyCode: {
            python: `def find_max(a, b, c):
    max_val = 0  # Bug: wrong initial value
    if a > max_val:
        max_val = a
    if b > max_val:
        max_val = b
    if c > max_val:
        max_val = c
    return max_val

a, b, c = map(int, input().split())
print(find_max(a, b, c))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const [a, b, c] = line.trim().split(' ').map(Number);
    function findMax(a, b, c) {
        let maxVal = 0;  // Bug: wrong initial value
        if (a > maxVal) maxVal = a;
        if (b > maxVal) maxVal = b;
        if (c > maxVal) maxVal = c;
        return maxVal;
    }
    console.log(findMax(a, b, c));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
    public static int findMax(int a, int b, int c) {
        int maxVal = 0;  // Bug: wrong initial value
        if (a > maxVal) maxVal = a;
        if (b > maxVal) maxVal = b;
        if (c > maxVal) maxVal = c;
        return maxVal;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();
        System.out.println(findMax(a, b, c));
    }
}`,
            c: `#include <stdio.h>
int findMax(int a, int b, int c) {
    int maxVal = 0;  // Bug: wrong initial value
    if (a > maxVal) maxVal = a;
    if (b > maxVal) maxVal = b;
    if (c > maxVal) maxVal = c;
    return maxVal;
}
int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    printf("%d\\n", findMax(a, b, c));
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
int findMax(int a, int b, int c) {
    int maxVal = 0;  // Bug: wrong initial value
    if (a > maxVal) maxVal = a;
    if (b > maxVal) maxVal = b;
    if (c > maxVal) maxVal = c;
    return maxVal;
}
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << findMax(a, b, c) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "3 7 2", expectedOutput: "7" },
            { input: "-5 -2 -8", expectedOutput: "-2" },
            { input: "0 0 0", expectedOutput: "0" },
        ],
        hint: "What happens when all inputs are negative and max_val starts at 0?",
    },
];

// ── Door 2 – Logic Trap ───────────────────────────────────────────────
export const door2DebugQuestions: DebugQuestion[] = [
    {
        id: 1,
        title: "Fix the Even/Odd Checker",
        description:
            "isEven(n) should return 'true' if n is even, but the comparison operator is wrong.",
        inputVarNames: ["n"],
        inputPreamble: {
            python: "n = {0}",
            javascript: "let n = {0};",
            java: "int n = {0};",
            c: "int n = {0};",
            cpp: "int n = {0};",
        },
        buggyCode: {
            python: `def is_even(n):
    return n % 2 == 1  # Bug: wrong comparison

n = int(input())
print(str(is_even(n)).lower())`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const n = parseInt(line.trim());
    function isEven(n) {
        return n % 2 === 1;  // Bug: wrong comparison
    }
    console.log(String(isEven(n)));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
    public static boolean isEven(int n) {
        return n % 2 == 1;  // Bug: wrong comparison
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(isEven(n));
    }
}`,
            c: `#include <stdio.h>
int isEven(int n) {
    return n % 2 == 1;  // Bug: wrong comparison
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%s\\n", isEven(n) ? "true" : "false");
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
bool isEven(int n) {
    return n % 2 == 1;  // Bug: wrong comparison
}
int main() {
    int n;
    cin >> n;
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
        title: "Fix the Power Function",
        description:
            "power(base, exp) should calculate base^exp but always returns 0. The initial value is wrong.",
        inputVarNames: ["base", "exp"],
        inputPreamble: {
            python: "base, exp = {0}, {1}",
            javascript: "let base = {0}, exp = {1};",
            java: "int base = {0}, exp = {1};",
            c: "int base = {0}, exp = {1};",
            cpp: "int base = {0}, exp = {1};",
        },
        buggyCode: {
            python: `def power(base, exp):
    result = 0  # Bug: wrong initial value
    for _ in range(exp):
        result *= base
    return result

base, exp = map(int, input().split())
print(power(base, exp))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const [base, exp] = line.trim().split(' ').map(Number);
    function power(base, exp) {
        let result = 0;  // Bug: wrong initial value
        for (let i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }
    console.log(power(base, exp));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
    public static int power(int base, int exp) {
        int result = 0;  // Bug: wrong initial value
        for (int i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int base = sc.nextInt(), exp = sc.nextInt();
        System.out.println(power(base, exp));
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
    int base, exp;
    cin >> base >> exp;
    cout << power(base, exp) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "2 3", expectedOutput: "8" },
            { input: "5 2", expectedOutput: "25" },
            { input: "3 0", expectedOutput: "1" },
        ],
        hint: "What should result start at so multiplication builds up correctly?",
    },
    {
        id: 3,
        title: "Fix the Palindrome Checker",
        description:
            "isPalindrome(s) should return 'true' if s reads the same forwards and backwards. There's an off-by-one in the right pointer.",
        inputVarNames: ["s"],
        inputPreamble: {
            python: `s = "{0}"`,
            javascript: `let s = "{0}";`,
            java: `String s = "{0}";`,
            c: `char s[] = "{0}";`,
            cpp: `string s = "{0}";`,
        },
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

s = input()
print(str(is_palindrome(s)).lower())`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const s = line.trim();
    function isPalindrome(s) {
        let left = 0, right = s.length;  // Bug: off by one
        while (left < right) {
            if (s[left] !== s[right]) return false;
            left++; right--;
        }
        return true;
    }
    console.log(String(isPalindrome(s)));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
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
        String s = sc.nextLine();
        System.out.println(isPalindrome(s));
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
    char s[100];
    scanf("%s", s);
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
    string s;
    cin >> s;
    cout << boolalpha << isPalindrome(s) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "racecar", expectedOutput: "true" },
            { input: "hello", expectedOutput: "false" },
            { input: "a", expectedOutput: "true" },
        ],
        hint: "Indices are 0-based — the last valid index is length-1, not length.",
    },
    {
        id: 4,
        title: "Fix the Array Sum (Step Bug)",
        description:
            "arraySum should add every element of 5 numbers but only adds every other one due to a wrong loop step.",
        inputVarNames: ["a", "b", "c", "d", "e"],
        inputPreamble: {
            python: "arr = [{0}, {1}, {2}, {3}, {4}]",
            javascript: "let arr = [{0}, {1}, {2}, {3}, {4}];",
            java: "int[] arr = {{0}, {1}, {2}, {3}, {4}};",
            c: "int arr[] = {{0}, {1}, {2}, {3}, {4}}; int n = 5;",
            cpp: "int arr[] = {{0}, {1}, {2}, {3}, {4}}; int n = 5;",
        },
        buggyCode: {
            python: `def array_sum(arr):
    total = 0
    for i in range(0, len(arr), 2):  # Bug: wrong step
        total += arr[i]
    return total

arr = list(map(int, input().split()))
print(array_sum(arr))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const arr = line.trim().split(' ').map(Number);
    function arraySum(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i += 2) {  // Bug: wrong step
            total += arr[i];
        }
        return total;
    }
    console.log(arraySum(arr));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
    public static int arraySum(int[] arr) {
        int total = 0;
        for (int i = 0; i < arr.length; i += 2) {  // Bug: wrong step
            total += arr[i];
        }
        return total;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) arr[i] = sc.nextInt();
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
    int arr[5];
    for (int i = 0; i < 5; i++) scanf("%d", &arr[i]);
    printf("%d\\n", arraySum(arr, 5));
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
int arraySum(int arr[], int size) {
    int total = 0;
    for (int i = 0; i < size; i += 2) {  // Bug: wrong step
        total += arr[i];
    }
    return total;
}
int main() {
    int arr[5];
    for (int i = 0; i < 5; i++) cin >> arr[i];
    cout << arraySum(arr, 5) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "1 2 3 4 5", expectedOutput: "15" },
            { input: "10 20 30 40 50", expectedOutput: "150" },
            { input: "0 0 0 0 0", expectedOutput: "0" },
        ],
        hint: "The loop step should visit every element — change the increment.",
    },
    {
        id: 5,
        title: "Fix Count Occurrences",
        description:
            "countOccurrences should count ALL times `target` appears in an array of 5 numbers, but it stops after the first match.\n\nInput format: 5 numbers followed by target (6 values).",
        inputVarNames: ["a", "b", "c", "d", "e", "target"],
        inputPreamble: {
            python: "arr = [{0}, {1}, {2}, {3}, {4}]\ntarget = {5}",
            javascript: "let arr = [{0}, {1}, {2}, {3}, {4}];\nlet target = {5};",
            java: "int[] arr = {{0}, {1}, {2}, {3}, {4}};\nint target = {5};",
            c: "int arr[] = {{0}, {1}, {2}, {3}, {4}}; int n = 5; int target = {5};",
            cpp: "int arr[] = {{0}, {1}, {2}, {3}, {4}}; int n = 5; int target = {5};",
        },
        buggyCode: {
            python: `def count_occurrences(arr, target):
    count = 0
    for num in arr:
        if num == target:
            count += 1
            break  # Bug: shouldn't break
    return count

nums = list(map(int, input().split()))
arr, target = nums[:5], nums[5]
print(count_occurrences(arr, target))`,
            javascript: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
    const nums = line.trim().split(' ').map(Number);
    const arr = nums.slice(0, 5), target = nums[5];
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
    console.log(countOccurrences(arr, target));
    rl.close();
});`,
            java: `import java.util.Scanner;
public class Main {
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
        int[] arr = new int[5];
        for (int i = 0; i < 5; i++) arr[i] = sc.nextInt();
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
    int arr[5], target;
    for (int i = 0; i < 5; i++) scanf("%d", &arr[i]);
    scanf("%d", &target);
    printf("%d\\n", countOccurrences(arr, 5, target));
    return 0;
}`,
            cpp: `#include <iostream>
using namespace std;
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
    int arr[5], target;
    for (int i = 0; i < 5; i++) cin >> arr[i];
    cin >> target;
    cout << countOccurrences(arr, 5, target) << endl;
    return 0;
}`,
        },
        testCases: [
            { input: "1 2 2 3 2 2", expectedOutput: "3" },
            { input: "1 1 1 1 1 1", expectedOutput: "5" },
            { input: "1 2 3 4 5 9", expectedOutput: "0" },
        ],
        hint: "Remove the statement that exits the loop after the first match.",
    },
];

// ── Door 3 – Runtime Rush (reuses Door 2) ────────────────────────────
export const door3DebugQuestions: DebugQuestion[] = door2DebugQuestions.map((q, i) => ({
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
