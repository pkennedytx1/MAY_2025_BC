document.getElementById("hashing-code").textContent = `async function hash(str) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  hash("mypassword").then(console.log);`;
  
  document.getElementById("template-code").textContent = `const user = "Alex";
  const message = \`Welcome, \${user}!
  This is a multiline message.\`;
  console.log(message);`;
  
  document.getElementById("destructuring-code").textContent = `const user = { name: "Sara", age: 28 };
  const { name, age } = user;
  console.log(name, age);`;
  
  document.getElementById("spread-rest-code").textContent = `const nums = [1, 2, 3];
  const more = [...nums, 4, 5];
  
  function sum(...values) {
    return values.reduce((a, b) => a + b);
  }
  console.log(sum(1, 2, 3, 4));`;
  
  document.getElementById("arrow-code").textContent = `const double = x => x * 2;
  console.log(double(4));`;
  
  document.getElementById("closure-code").textContent = `function createCounter() {
    let count = 0;
    return () => ++count;
  }
  const counter = createCounter();
  console.log(counter()); // 1
  console.log(counter()); // 2`;
  
  document.getElementById("scope-code").textContent = `function testScope() {
    if (true) {
      var a = "var scope";
      let b = "let scope";
      const c = "const scope";
    }
    console.log(a); // works
    // console.log(b); // ReferenceError
    // console.log(c); // ReferenceError
  }
  testScope();`;
  

  const myArr = ['Sarah', 'Brian']
  const [name1, name2] = myArr

  console.log(name1, name2)

  const myObj = {name: 'Sarah', age: 22}
  const {name, age} = myObj
  console.log(name, age)


  const arr1 = ['Howdy', 'Hello']
  const arr2 = ['Sup', 'Greetings']

  const newArr = [...arr1, ...arr2]
  console.log(newArr)

  const obj1 = {name: 'Sarah', age: 22}
  const obj2 = {name: 'Sam', favColor: 'purple', school: 'Texas A&M University'}

  const newObj2 = {...obj1, ...obj2}
  console.log(newObj2)

  const myFunc = (arg1, arg2, ...allTheOtherOnes) => {
    console.log('myArgs:', arg1, arg2, allTheOtherOnes)
  }

  myFunc('hello', 'there', 'General', 'Kenobi')

  function createCounter() {
    let count = 0;
    return () => ++count;
  }
  const counter = createCounter();
  console.log(counter()); // 1
  console.log(counter()); // 2

  function testScope() {
    let b = "let scope";
    const c = "const scope";
    if (true) {
      var a = "var scope";
      console.log(b); // ReferenceError
      console.log(c); // ReferenceError
    }
    console.log(a); // works
  }
  testScope();