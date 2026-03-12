// Stub quiz questions for demonstration
// In production, these would come from the backend

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  difficulty?: string;
  type?: string;
}

// Door 1 - Programming Logic (Programming Fundamentals)
export const door1Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the output of: print(3 + 2 * 2) ?",
    options: ["10", "7", "8", "12"],
    correctAnswer: 1,
    difficulty: "easy",
    type: "code_output"
  },
  {
    id: 2,
    question: "What is the output of Java code: System.out.println(\"5\" + 2 + 3);",
    options: ["523", "55", "10", "532"],
    correctAnswer: 0,
    difficulty: "easy",
    type: "code_output"
  },
  {
    id: 3,
    question: "Output of Python code: a=[1,2,3]; print(len(a))",
    options: ["1", "2", "3", "Error"],
    correctAnswer: 2,
    difficulty: "easy",
    type: "code_output"
  },
  {
    id: 4,
    question: "What is wrong in Python code: if x = 5:",
    options: [
      "Missing colon",
      "Assignment used instead of comparison",
      "Indentation error",
      "No error"
    ],
    correctAnswer: 1,
    difficulty: "easy",
    type: "debugging"
  },
  {
    id: 5,
    question: "Output of Java code: int x=5; System.out.println(x++ + ++x);",
    options: ["11", "12", "13", "14"],
    correctAnswer: 2,
    difficulty: "medium",
    type: "code_output"
  },
  {
    id: 6,
    question: "Output of Python: print(\"abc\"[1])",
    options: ["a", "b", "c", "Error"],
    correctAnswer: 1,
    difficulty: "medium",
    type: "code_output"
  },
  {
    id: 7,
    question: "What is wrong in this Java loop? for(int i=0;i<=5;i++); { System.out.println(i); }",
    options: [
      "Wrong loop condition",
      "Semicolon after for loop",
      "Print statement incorrect",
      "No error"
    ],
    correctAnswer: 1,
    difficulty: "medium",
    type: "debugging"
  },
  {
    id: 8,
    question: "Output of Python: a=[1,2]; b=a; b.append(3); print(a)",
    options: ["[1,2]", "[1,2,3]", "[3]", "Error"],
    correctAnswer: 1,
    difficulty: "medium",
    type: "code_output"
  },
  {
    id: 9,
    question: "Output of Java: System.out.println(10 + 20 + \"30\");",
    options: ["3030", "102030", "60", "3020"],
    correctAnswer: 0,
    difficulty: "medium",
    type: "code_output"
  },
  {
    id: 10,
    question: "Output of Python: print(bool(\"False\"))",
    options: ["False", "True", "Error", "None"],
    correctAnswer: 1,
    difficulty: "medium",
    type: "code_output"
  },
  {
    id: 11,
    question: "Output of Python: print(2 ** 3 ** 2)",
    options: ["64", "512", "256", "128"],
    correctAnswer: 1,
    difficulty: "hard",
    type: "code_output"
  },
  {
    id: 12,
    question: "Output of Java nested if: int x=10; if(x>5) if(x>8) System.out.print(\"A\"); else System.out.print(\"B\");",
    options: ["A", "B", "AB", "No output"],
    correctAnswer: 0,
    difficulty: "hard",
    type: "code_output"
  },
  {
    id: 13,
    question: "Output of Python recursion: f(n)=n*f(n-1), f(4)",
    options: ["16", "20", "24", "32"],
    correctAnswer: 2,
    difficulty: "hard",
    type: "code_output"
  },
  {
    id: 14,
    question: "What error occurs: int arr[] = new int[5]; arr[5] = 10;",
    options: [
      "Syntax error",
      "Compile error",
      "ArrayIndexOutOfBoundsException",
      "Overflow"
    ],
    correctAnswer: 2,
    difficulty: "hard",
    type: "debugging"
  },
  {
    id: 15,
    question: "Output of Python: a=[1,2,3]; print(a[::-1])",
    options: ["[1,2,3]", "[3,2,1]", "[2,3,1]", "Error"],
    correctAnswer: 1,
    difficulty: "hard",
    type: "code_output"
  }
];

// Door 2 - Algorithm Alley (Data Structures & Algorithms)
export const door2Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Tree", "Array"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which algorithm searches sorted arrays efficiently?",
    options: ["Linear Search", "Binary Search", "DFS", "BFS"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Which algorithm finds Minimum Spanning Tree?",
    options: ["DFS", "Kruskal", "Binary Search", "Selection"],
    correctAnswer: 1,
    difficulty: "easy"
  },
  {
    id: 4,
    question: "Which structure stores key-value pairs?",
    options: ["HashMap", "Stack", "Queue", "LinkedList"],
    correctAnswer: 0,
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Average time complexity of Quick Sort?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 6,
    question: "Which traversal outputs sorted BST elements?",
    options: ["Preorder", "Postorder", "Inorder", "Level order"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Which algorithm finds shortest path in weighted graph?",
    options: ["DFS", "BFS", "Dijkstra", "Prim"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Which technique solves N-Queens?",
    options: ["Greedy", "Backtracking", "BFS", "DP"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 9,
    question: "Complexity of heap insertion?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Which technique is used in Merge Sort?",
    options: ["Greedy", "Divide and Conquer", "BFS", "Backtracking"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 11,
    question: "Time complexity of building heap from n elements?",
    options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 12,
    question: "Which algorithm finds strongly connected components?",
    options: ["Dijkstra", "Kosaraju", "Prim", "BFS"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 13,
    question: "Worst-case complexity of Quickselect?",
    options: ["O(n log n)", "O(n²)", "O(log n)", "O(n)"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 14,
    question: "Which algorithm detects negative cycles?",
    options: ["Dijkstra", "Bellman-Ford", "BFS", "Prim"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 15,
    question: "Time complexity of Floyd-Warshall?",
    options: ["O(n²)", "O(n³)", "O(n log n)", "O(n⁴)"],
    correctAnswer: 1,
    difficulty: "hard"
  }
];

// Door 3 - System Path (OS & Networks)
export const door3Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which command prints the current directory?",
    options: ["ls", "pwd", "cd", "dir"],
    correctAnswer: 1,
    difficulty: "easy",
    type: "linux"
  },
  {
    id: 2,
    question: "Which command lists files in Linux?",
    options: ["list", "show", "ls", "files"],
    correctAnswer: 2,
    difficulty: "easy",
    type: "linux"
  },
  {
    id: 3,
    question: "Which memory is fastest?",
    options: ["HDD", "RAM", "Cache", "SSD"],
    correctAnswer: 2,
    difficulty: "easy"
  },
  {
    id: 4,
    question: "Which command changes directory?",
    options: ["cd", "ls", "pwd", "mv"],
    correctAnswer: 0,
    difficulty: "easy",
    type: "linux"
  },
  {
    id: 5,
    question: "Command to create directory?",
    options: ["mkdir", "makedir", "newdir", "createdir"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 6,
    question: "Which command removes file?",
    options: ["del", "rm", "erase", "remove"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 7,
    question: "Command to show running processes?",
    options: ["ps", "run", "process", "top"],
    correctAnswer: 0,
    difficulty: "medium"
  },
  {
    id: 8,
    question: "Which system call creates new process?",
    options: ["exec()", "fork()", "spawn()", "start()"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 9,
    question: "Which command copies files?",
    options: ["mv", "cp", "clone", "paste"],
    correctAnswer: 1,
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Which command shows manual page?",
    options: ["help", "info", "man", "doc"],
    correctAnswer: 2,
    difficulty: "medium"
  },
  {
    id: 11,
    question: "Which scheduling algorithm gives minimum waiting time?",
    options: ["FCFS", "SJF", "Round Robin", "Priority"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 12,
    question: "Deadlock occurs due to:",
    options: [
      "Mutual exclusion",
      "Hold and wait",
      "Circular wait",
      "All of the above"
    ],
    correctAnswer: 3,
    difficulty: "hard"
  },
  {
    id: 13,
    question: "Which OS architecture has minimal kernel?",
    options: ["Monolithic", "Microkernel", "Layered", "Hybrid"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 14,
    question: "Which component handles interrupts?",
    options: ["Shell", "Kernel", "Compiler", "Loader"],
    correctAnswer: 1,
    difficulty: "hard"
  },
  {
    id: 15,
    question: "Which component switches CPU between processes?",
    options: ["Dispatcher", "Loader", "Kernel", "Scheduler"],
    correctAnswer: 0,
    difficulty: "hard"
  }
];

export const getQuestionsForDoor = (doorNumber: number): QuizQuestion[] => {
  switch (doorNumber) {
    case 1:
      return door1Questions;
    case 2:
      return door2Questions;
    case 3:
      return door3Questions;
    default:
      return door1Questions;
  }
};
