export interface CodingQuestion {
    id: number;
    title: string;
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
    starterCode: Record<string, string>;
    testCases: { input: string; expectedOutput: string }[];
    difficulty: "Easy" | "Medium" | "Hard";
}

const door1Questions: CodingQuestion[] = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        description:
            "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice.",
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "nums[0] + nums[1] = 2 + 7 = 9",
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
            },
        ],
        constraints: [
            "2 ≤ nums.length ≤ 10⁴",
            "-10⁹ ≤ nums[i] ≤ 10⁹",
            "Only one valid answer exists",
        ],
        testCases: [
            { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
            { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
            { input: "[3,3]\n6", expectedOutput: "[0,1]" },
        ],
        starterCode: {
            python: `def two_sum(nums, target):
    # Write your solution here
    pass

# Read input
import sys
lines = sys.stdin.read().split('\\n')
nums = list(map(int, lines[0].strip('[]').split(',')))
target = int(lines[1])
print(two_sum(nums, target))`,
            javascript: `function twoSum(nums, target) {
  // Write your solution here
}

const lines = require('fs').readFileSync('/dev/stdin','utf8').split('\\n');
const nums = JSON.parse(lines[0]);
const target = parseInt(lines[1]);
console.log(JSON.stringify(twoSum(nums, target)));`,
            java: `import java.util.*;
public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Parse input and call twoSum
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    // Parse input and call twoSum
}`,
        },
    },
    {
        id: 2,
        title: "Maximum Subarray",
        difficulty: "Medium",
        description:
            "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous part of an array.",
        examples: [
            {
                input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                output: "6",
                explanation: "[4,-1,2,1] has the largest sum = 6",
            },
            { input: "nums = [1]", output: "1" },
            { input: "nums = [5,4,-1,7,8]", output: "23" },
        ],
        constraints: [
            "1 ≤ nums.length ≤ 10⁵",
            "-10⁴ ≤ nums[i] ≤ 10⁴",
        ],
        testCases: [
            { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
            { input: "[1]", expectedOutput: "1" },
            { input: "[5,4,-1,7,8]", expectedOutput: "23" },
        ],
        starterCode: {
            python: `def max_subarray(nums):
    # Write your solution here
    pass

import sys
nums = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))
print(max_subarray(nums))`,
            javascript: `function maxSubArray(nums) {
  // Write your solution here
}

const nums = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(maxSubArray(nums));`,
            java: `import java.util.*;
public class Main {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}
int main() { }`,
        },
    },
    {
        id: 3,
        title: "Merge Intervals",
        difficulty: "Medium",
        description:
            "Given an array of `intervals` where `intervals[i] = [startᵢ, endᵢ]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
        examples: [
            {
                input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
                output: "[[1,6],[8,10],[15,18]]",
                explanation: "[1,3] and [2,6] overlap, merged into [1,6]",
            },
            {
                input: "intervals = [[1,4],[4,5]]",
                output: "[[1,5]]",
                explanation: "[1,4] and [4,5] overlap at 4",
            },
        ],
        constraints: [
            "1 ≤ intervals.length ≤ 10⁴",
            "intervals[i].length == 2",
            "0 ≤ startᵢ ≤ endᵢ ≤ 10⁴",
        ],
        testCases: [
            { input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]" },
            { input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" },
            { input: "[[1,4],[0,4]]", expectedOutput: "[[0,4]]" },
        ],
        starterCode: {
            python: `def merge(intervals):
    # Write your solution here
    pass

import sys, json
intervals = json.loads(sys.stdin.read().strip())
print(json.dumps(merge(intervals)))`,
            javascript: `function merge(intervals) {
  // Write your solution here
}

const intervals = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(JSON.stringify(merge(intervals)));`,
            java: `import java.util.*;
public class Main {
    public static int[][] merge(int[][] intervals) {
        // Write your solution here
        return new int[][]{};
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    // Write your solution here
    return {};
}
int main() { }`,
        },
    },
];

const door2Questions: CodingQuestion[] = [
    {
        id: 1,
        title: "Valid Palindrome",
        difficulty: "Easy",
        description:
            "A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.",
        examples: [
            {
                input: 's = "A man, a plan, a canal: Panama"',
                output: "true",
                explanation: '"amanaplanacanalpanama" is a palindrome',
            },
            { input: 's = "race a car"', output: "false" },
        ],
        constraints: [
            "1 ≤ s.length ≤ 2 × 10⁵",
            "s consists only of printable ASCII characters",
        ],
        testCases: [
            { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
            { input: "race a car", expectedOutput: "false" },
            { input: " ", expectedOutput: "true" },
        ],
        starterCode: {
            python: `def is_palindrome(s):
    # Write your solution here
    pass

import sys
s = sys.stdin.read().strip()
print(str(is_palindrome(s)).lower())`,
            javascript: `function isPalindrome(s) {
  // Write your solution here
}

const s = require('fs').readFileSync('/dev/stdin','utf8').trim();
console.log(isPalindrome(s));`,
            java: `import java.util.*;
public class Main {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
bool isPalindrome(string s) {
    // Write your solution here
    return false;
}
int main() { }`,
        },
    },
    {
        id: 2,
        title: "Longest Common Prefix",
        difficulty: "Easy",
        description:
            "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `\"\"`.",
        examples: [
            {
                input: 'strs = ["flower","flow","flight"]',
                output: '"fl"',
            },
            {
                input: 'strs = ["dog","racecar","car"]',
                output: '""',
                explanation: "There is no common prefix",
            },
        ],
        constraints: [
            "1 ≤ strs.length ≤ 200",
            "0 ≤ strs[i].length ≤ 200",
        ],
        testCases: [
            { input: '["flower","flow","flight"]', expectedOutput: "fl" },
            { input: '["dog","racecar","car"]', expectedOutput: "" },
            { input: '["a"]', expectedOutput: "a" },
        ],
        starterCode: {
            python: `def longest_common_prefix(strs):
    # Write your solution here
    pass

import sys, json
strs = json.loads(sys.stdin.read().strip())
print(longest_common_prefix(strs))`,
            javascript: `function longestCommonPrefix(strs) {
  // Write your solution here
}

const strs = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(longestCommonPrefix(strs));`,
            java: `import java.util.*;
public class Main {
    public static String longestCommonPrefix(String[] strs) {
        // Write your solution here
        return "";
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
string longestCommonPrefix(vector<string>& strs) {
    // Write your solution here
    return "";
}
int main() { }`,
        },
    },
    {
        id: 3,
        title: "Group Anagrams",
        difficulty: "Medium",
        description:
            "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.",
        examples: [
            {
                input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
            },
            { input: 'strs = [""]', output: '[[""]]' },
            { input: 'strs = ["a"]', output: '[["a"]]' },
        ],
        constraints: [
            "1 ≤ strs.length ≤ 10⁴",
            "0 ≤ strs[i].length ≤ 100",
            "strs[i] consists of lowercase English letters",
        ],
        testCases: [
            { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
            { input: '[""]', expectedOutput: '[[""]]' },
            { input: '["a"]', expectedOutput: '[["a"]]' },
        ],
        starterCode: {
            python: `def group_anagrams(strs):
    # Write your solution here
    pass

import sys, json
strs = json.loads(sys.stdin.read().strip())
print(json.dumps(group_anagrams(strs)))`,
            javascript: `function groupAnagrams(strs) {
  // Write your solution here
}

const strs = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(JSON.stringify(groupAnagrams(strs)));`,
            java: `import java.util.*;
public class Main {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        return new ArrayList<>();
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // Write your solution here
    return {};
}
int main() { }`,
        },
    },
];

const door3Questions: CodingQuestion[] = [
    {
        id: 1,
        title: "Number of Islands",
        difficulty: "Medium",
        description:
            "Given an `m x n` 2D binary grid which represents a map of `'1'`s (land) and `'0'`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        examples: [
            {
                input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
                output: "1",
            },
            {
                input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
                output: "3",
            },
        ],
        constraints: [
            "m == grid.length",
            "n == grid[i].length",
            "1 ≤ m, n ≤ 300",
            "grid[i][j] is '0' or '1'",
        ],
        testCases: [
            {
                input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
                expectedOutput: "1",
            },
            {
                input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
                expectedOutput: "3",
            },
        ],
        starterCode: {
            python: `def num_islands(grid):
    # Write your solution here (DFS/BFS)
    pass

import sys, json
grid = json.loads(sys.stdin.read().strip())
print(num_islands(grid))`,
            javascript: `function numIslands(grid) {
  // Write your solution here (DFS/BFS)
}

const grid = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(numIslands(grid));`,
            java: `import java.util.*;
public class Main {
    public static int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
int numIslands(vector<vector<char>>& grid) {
    // Write your solution here
    return 0;
}
int main() { }`,
        },
    },
    {
        id: 2,
        title: "Shortest Path in Binary Matrix",
        difficulty: "Hard",
        description:
            "Given an `n x n` binary matrix `grid`, return the length of the shortest clear path in the matrix. If there is no clear path, return `-1`.\n\nA clear path is a path from the top-left cell to the bottom-right cell such that all visited cells are `0`. You may move in 8 directions.",
        examples: [
            { input: "grid = [[0,1],[1,0]]", output: "2" },
            { input: "grid = [[0,0,0],[1,1,0],[1,1,0]]", output: "4" },
            { input: "grid = [[1,0,0],[1,1,0],[1,1,0]]", output: "-1" },
        ],
        constraints: ["n == grid.length == grid[i].length", "1 ≤ n ≤ 100"],
        testCases: [
            { input: "[[0,1],[1,0]]", expectedOutput: "2" },
            { input: "[[0,0,0],[1,1,0],[1,1,0]]", expectedOutput: "4" },
            { input: "[[1,0,0],[1,1,0],[1,1,0]]", expectedOutput: "-1" },
        ],
        starterCode: {
            python: `from collections import deque

def shortest_path(grid):
    # Write your BFS solution here
    pass

import sys, json
grid = json.loads(sys.stdin.read().strip())
print(shortest_path(grid))`,
            javascript: `function shortestPathBinaryMatrix(grid) {
  // Write your BFS solution here
}

const grid = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(shortestPathBinaryMatrix(grid));`,
            java: `import java.util.*;
public class Main {
    public static int shortestPathBinaryMatrix(int[][] grid) {
        return -1;
    }
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
int shortestPathBinaryMatrix(vector<vector<int>>& grid) {
    return -1;
}
int main() { }`,
        },
    },
    {
        id: 3,
        title: "Clone Graph",
        difficulty: "Hard",
        description:
            "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.\n\nEach node in the graph contains a value (`int`) and a list of its neighbors.\n\nThe graph is represented as an adjacency list where `adj[i]` contains the neighbors of node `i+1`.",
        examples: [
            {
                input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
                output: "[[2,4],[1,3],[2,4],[1,3]]",
                explanation: "4 nodes, node 1 connects to 2 and 4, etc.",
            },
            { input: "adjList = [[2],[1]]", output: "[[2],[1]]" },
        ],
        constraints: [
            "0 ≤ number of nodes ≤ 100",
            "1 ≤ Node.val ≤ 100",
            "No repeated edges, no self-loops",
        ],
        testCases: [
            { input: "[[2,4],[1,3],[2,4],[1,3]]", expectedOutput: "[[2,4],[1,3],[2,4],[1,3]]" },
            { input: "[[2],[1]]", expectedOutput: "[[2],[1]]" },
            { input: "[[]]", expectedOutput: "[[]]" },
        ],
        starterCode: {
            python: `class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors else []

def clone_graph(node):
    # Write your DFS/BFS clone here
    pass

import sys, json
adj = json.loads(sys.stdin.read().strip())
# Build graph from adj list, clone it, output adj list
print(json.dumps(adj))  # placeholder`,
            javascript: `function cloneGraph(node) {
  // Write your DFS/BFS clone here
}

const adj = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8').trim());
console.log(JSON.stringify(adj)); // placeholder`,
            java: `import java.util.*;
public class Main {
    // Node class and cloneGraph method
    public static void main(String[] args) { }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;
// Node class and cloneGraph function
int main() { }`,
        },
    },
];

export function getCodingQuestionsForDoor(door: number): CodingQuestion[] {
    switch (door) {
        case 1:
            return door1Questions;
        case 2:
            return door2Questions;
        case 3:
            return door3Questions;
        default:
            return door1Questions;
    }
}
