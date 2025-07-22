function setupUITests() {
  const input = document.getElementById("test-input");
  const button = document.getElementById("test-button");
  const uiResults = document.getElementById("ui-results");
  
  let testCount = 0;
  let passCount = 0;

  function uiAssertEquals(name, actual, expected) {
    testCount++;
    const result = document.createElement("div");
    if (actual === expected) {
      result.textContent = `PASS: ${name}`;
      result.className = "pass";
      passCount++;
    } else {
      result.textContent = `FAIL: ${name} - expected ${expected}, got ${actual}`;
      result.className = "fail";
    }
    uiResults.appendChild(result);
  }

  function runUITests() {
    // Clear previous results
    uiResults.innerHTML = "";
    testCount = 0;
    passCount = 0;

    // Test 1: Check if input field exists
    uiAssertEquals("Input field exists", input !== null, true);
    
    // Test 2: Check if button exists
    uiAssertEquals("Button exists", button !== null, true);
    
    // Test 3: Test input validation with valid number
    input.value = "42";
    uiAssertEquals("Input accepts valid number", input.value, "42");
    
    // Test 4: Test input validation with invalid input
    // Number inputs typically clear invalid values or keep previous value
    const originalValue = input.value;
    input.value = "abc";
    // Check that the value is either empty or unchanged (browser behavior varies)
    const isValidBehavior = input.value === "" || input.value === originalValue;
    uiAssertEquals("Input handles invalid input", isValidBehavior, true);
    
    // Test 5: Test button click functionality
    // Test that the button is properly rendered and accessible
    const buttonIsClickable = button.disabled === false && 
                             button.style.display !== 'none' && 
                             button.offsetWidth > 0;
    uiAssertEquals("Button is clickable", buttonIsClickable, true);
    
    // Test 6: Test input field focus
    input.focus();
    uiAssertEquals("Input field can be focused", document.activeElement === input, true);
    
    // Display summary
    const summary = document.createElement("div");
    summary.style.marginTop = "1rem";
    summary.style.fontWeight = "bold";
    summary.textContent = `UI Tests: ${passCount}/${testCount} passed`;
    summary.className = passCount === testCount ? "pass" : "fail";
    uiResults.appendChild(summary);
  }

  // Run UI tests when button is clicked
  button.addEventListener("click", runUITests);
  
  // Also run initial UI tests when page loads
  setTimeout(runUITests, 100);
}

// Run tests when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupUITests();
});