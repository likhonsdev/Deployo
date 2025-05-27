/**
 * Example code snippets for the code interpreter
 */

export const helloWorldExample = `# Basic hello world example
print("Hello, world!")`;

export const mathExample = `# Basic math examples
x = 10
y = 20
print(f"x + y = {x + y}")
print(f"x * y = {x * y}")`;

export const loopExample = `# Loop example
for i in range(5):
    print(f"Iteration {i+1}")`;

export const functionExample = `# Function example
def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * calculate_factorial(n-1)

for num in range(1, 6):
    print(f"Factorial of {num} is {calculate_factorial(num)}")`;

export const dataStructuresExample = `# Data structures example
# List
fruits = ["apple", "banana", "cherry"]
print("List example:")
for fruit in fruits:
    print(f"- {fruit}")

# Dictionary
person = {
    "name": "John",
    "age": 30,
    "city": "New York"
}
print("\\nDictionary example:")
for key, value in person.items():
    print(f"{key}: {value}")`;

export const conditionalExample = `# Conditional statements example
temperature = 25

if temperature > 30:
    print("It's hot outside!")
elif temperature > 20:
    print("It's a nice day!")
else:
    print("It's a bit cold!")`;

export const exceptionHandlingExample = `# Exception handling example
try:
    result = 10 / 0
    print("This won't be printed")
except ZeroDivisionError:
    print("Error: Division by zero")
finally:
    print("This will always execute")`;

export const listComprehensionExample = `# List comprehension example
# Create a list of squares from 1 to 10
squares = [x**2 for x in range(1, 11)]
print("Squares:", squares)

# Filter even numbers
even_numbers = [x for x in range(1, 21) if x % 2 == 0]
print("Even numbers:", even_numbers)`;

export const objectOrientedExample = `# Object-oriented programming example
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Hello, my name is {self.name} and I am {self.age} years old."

# Create Person objects
alice = Person("Alice", 25)
bob = Person("Bob", 30)

# Call greet method
print(alice.greet())
print(bob.greet())`;

export const fileIOExample = `# File I/O example (simulated)
# This won't create a real file in the sandbox
# but demonstrates the syntax

# Writing to a file
print("Writing to a file...")
print('with open("example.txt", "w") as file:')
print('    file.write("Hello, this is a test file!\\n")')
print('    file.write("This is the second line.\\n")')

# Reading from a file
print("\\nReading from a file...")
print('with open("example.txt", "r") as file:')
print('    content = file.read()')
print('    print(content)')
`;

export const exampleCategories = {
  basic: [
    { name: "Hello World", code: helloWorldExample },
    { name: "Math Operations", code: mathExample },
    { name: "Conditional Statements", code: conditionalExample },
    { name: "Loops", code: loopExample },
  ],
  intermediate: [
    { name: "Functions", code: functionExample },
    { name: "Data Structures", code: dataStructuresExample },
    { name: "Exception Handling", code: exceptionHandlingExample },
    { name: "List Comprehension", code: listComprehensionExample },
  ],
  advanced: [
    { name: "Object-Oriented Programming", code: objectOrientedExample },
    { name: "File I/O", code: fileIOExample },
  ]
};

export const commandExamples = [
  { name: "Help", command: "/help", description: "Display available commands" },
  { name: "Switch Language", command: "/language python", description: "Switch to Python language" },
  { name: "Switch to JavaScript", command: "/language js", description: "Switch to JavaScript" },
  { name: "Save Code", command: "/save my_code", description: "Save the current code as 'my_code'" },
  { name: "Show Version", command: "/version", description: "Display interpreter version" },
  { name: "Debug Mode", command: "/debug", description: "Toggle debug mode" },
  { name: "List Saved Code", command: "/list saved", description: "List all saved code snippets" }
];
