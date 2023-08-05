var menuTimeout;

    // Function to show the window
    function showWindow() {
      clearTimeout(menuTimeout);
      document.getElementById('window').style.display = 'block';
    }

    // Function to hide the window
    function hideWindow() {
      menuTimeout = setTimeout(function () {
        document.getElementById('window').style.display = 'none';
      }, 300);
    }

    // Add event listeners to show/hide the window
    document.getElementById('navbar').addEventListener('mouseover', showWindow);
    document.getElementById('navbar').addEventListener('mouseout', hideWindow);
    document.getElementById('window').addEventListener('mouseover', showWindow);
    document.getElementById('window').addEventListener('mouseout', hideWindow);


    // name submission
    document.getElementById("nameForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
    
      var name = document.getElementById("nameInput").value; // Retrieve the value from the input field
    
      // Store the name in localStorage to pass it to the next page
      localStorage.setItem("name", name);
    
      var selectedOption = document.querySelector('input[name="option"]:checked').value;
    
      // Redirect to the corresponding page based on the selected option
      switch (selectedOption) {
        case "page1":
          window.location.href = "/hand Eye/index_hand.html";
          break;
        case "page2":
          window.location.href = "/Decision making/index_decision.html";
          break;
        case "page3":
          window.location.href = "/advanced hand eye/index_LR.html";
          break;
        default:
          // Handle the case when no option is selected
          break;
      }
    });
