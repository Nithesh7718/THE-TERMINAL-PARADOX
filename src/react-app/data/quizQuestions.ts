// Stub quiz questions for demonstration
// In production, these would come from the backend

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
}

// Door 1 - Logic Gate (Programming Fundamentals)
export const door1Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "JavaScript", "HTML", "Ruby"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Linked List", "Tree"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Question Language",
      "Standard Query Logic",
      "Sequential Query Language",
    ],
    correctAnswer: 0,
  },
  {
    id: 6,
    question: "Which operator is used for strict equality in JavaScript?",
    options: ["==", "===", "!=", "="],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What is the default port for HTTP?",
    options: ["443", "21", "80", "8080"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "Which of these is a valid way to declare a variable in Python?",
    options: ["var x = 5", "int x = 5", "x = 5", "let x = 5"],
    correctAnswer: 2,
  },
  {
    id: 9,
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Program Integration",
      "Automated Programming Interface",
      "Application Process Integration",
    ],
    correctAnswer: 0,
  },
  {
    id: 10,
    question: "Which sorting algorithm has the best average time complexity?",
    options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
    correctAnswer: 2,
  },
  {
    id: 11,
    question: "What is the purpose of a constructor in OOP?",
    options: [
      "To destroy objects",
      "To initialize object properties",
      "To create loops",
      "To define classes",
    ],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: "Which of these is NOT a valid HTTP method?",
    options: ["GET", "POST", "FETCH", "DELETE"],
    correctAnswer: 2,
  },
  {
    id: 13,
    question: "What does JSON stand for?",
    options: [
      "JavaScript Object Notation",
      "Java Standard Object Notation",
      "JavaScript Online Notation",
      "Java Serialized Object Notation",
    ],
    correctAnswer: 0,
  },
  {
    id: 14,
    question: "Which data structure is best for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Hash Table"],
    correctAnswer: 2,
  },
  {
    id: 15,
    question: "What is recursion?",
    options: [
      "A loop that runs forever",
      "A function that calls itself",
      "A type of data structure",
      "A sorting algorithm",
    ],
    correctAnswer: 1,
  },
];

// Door 2 - Algorithm Alley (Data Structures & Algorithms)
export const door2Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the space complexity of merge sort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which traversal visits the root node first?",
    options: ["Inorder", "Preorder", "Postorder", "Level order"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the worst-case time complexity of quicksort?",
    options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "Which data structure is used in BFS traversal?",
    options: ["Stack", "Queue", "Heap", "Tree"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What is a hash collision?",
    options: [
      "Two keys producing the same hash value",
      "A hash table overflow",
      "An invalid hash function",
      "Memory corruption",
    ],
    correctAnswer: 0,
  },
  {
    id: 6,
    question: "Which algorithm finds the shortest path in a weighted graph?",
    options: ["DFS", "BFS", "Dijkstra's", "Binary Search"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question: "What is the height of a balanced binary tree with n nodes?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: "Which sorting algorithm is stable?",
    options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
    correctAnswer: 2,
  },
  {
    id: 9,
    question: "What is dynamic programming?",
    options: [
      "Programming at runtime",
      "Breaking problems into subproblems and storing results",
      "Object-oriented programming",
      "Functional programming",
    ],
    correctAnswer: 1,
  },
  {
    id: 10,
    question: "What is the amortized time complexity of push in a dynamic array?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: "Which data structure is used in DFS traversal?",
    options: ["Queue", "Stack", "Heap", "Hash Table"],
    correctAnswer: 1,
  },
  {
    id: 12,
    question: "What is the time complexity of inserting at the head of a linked list?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctAnswer: 2,
  },
  {
    id: 13,
    question: "Which technique is used to handle hash collisions by storing in adjacent slots?",
    options: ["Chaining", "Linear Probing", "Rehashing", "Bucketing"],
    correctAnswer: 1,
  },
  {
    id: 14,
    question: "What is the minimum number of edges in a connected graph with n vertices?",
    options: ["n", "n-1", "n+1", "2n"],
    correctAnswer: 1,
  },
  {
    id: 15,
    question: "Which algorithm is used to find minimum spanning tree?",
    options: ["Dijkstra's", "Bellman-Ford", "Floyd-Warshall", "Kruskal's"],
    correctAnswer: 3,
  },
];

// Door 3 - System Path (OS & Networks)
export const door3Questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does TCP stand for?",
    options: [
      "Transmission Control Protocol",
      "Transfer Control Protocol",
      "Transmission Communication Protocol",
      "Technical Control Protocol",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: "Which OSI layer handles routing?",
    options: ["Transport", "Network", "Data Link", "Physical"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is a deadlock?",
    options: [
      "A system crash",
      "A situation where processes wait indefinitely for resources",
      "A network failure",
      "A memory leak",
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Which scheduling algorithm may cause starvation?",
    options: ["Round Robin", "FIFO", "Priority Scheduling", "Shortest Job First"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is virtual memory?",
    options: [
      "RAM that doesn't exist",
      "A technique to extend physical memory using disk",
      "Cloud storage",
      "A type of cache",
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    question: "Which protocol is used for secure web browsing?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correctAnswer: 2,
  },
  {
    id: 7,
    question: "What is a mutex?",
    options: [
      "A type of virus",
      "A synchronization primitive for mutual exclusion",
      "A network protocol",
      "A file system",
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: "What does DNS stand for?",
    options: [
      "Domain Name System",
      "Data Network Service",
      "Digital Name Server",
      "Domain Network System",
    ],
    correctAnswer: 0,
  },
  {
    id: 9,
    question: "Which page replacement algorithm is optimal?",
    options: ["FIFO", "LRU", "Optimal (OPT)", "Clock"],
    correctAnswer: 2,
  },
  {
    id: 10,
    question: "What is thrashing?",
    options: [
      "A virus attack",
      "Excessive paging causing poor performance",
      "Network congestion",
      "Disk failure",
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: "Which IP address class is used for multicast?",
    options: ["Class A", "Class B", "Class C", "Class D"],
    correctAnswer: 3,
  },
  {
    id: 12,
    question: "What is the purpose of ARP?",
    options: [
      "Map IP addresses to MAC addresses",
      "Route packets",
      "Establish TCP connections",
      "Encrypt data",
    ],
    correctAnswer: 0,
  },
  {
    id: 13,
    question: "Which file system is commonly used in Linux?",
    options: ["NTFS", "FAT32", "ext4", "HFS+"],
    correctAnswer: 2,
  },
  {
    id: 14,
    question: "What is a semaphore?",
    options: [
      "A type of interrupt",
      "A signaling mechanism for process synchronization",
      "A memory allocation technique",
      "A network packet",
    ],
    correctAnswer: 1,
  },
  {
    id: 15,
    question: "What does DHCP provide?",
    options: [
      "Static IP addresses",
      "Automatic IP address assignment",
      "DNS resolution",
      "File transfer",
    ],
    correctAnswer: 1,
  },
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
