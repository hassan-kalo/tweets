const inputCategory = document.getElementById('input-category');
const inputTweet = document.getElementById('input-tweet');
const saveBtn = document.getElementById('input-save-btn');
// Open a connection to the database
let request = indexedDB.open("tweetsDB", 1);

// Handle database creation or upgrade
request.onupgradeneeded = function(event) {
// The code inside here is excuted when the second parameter of .open() is changed
  let db = event.target.result;

// Perform database schema upgrades here
  // Create an object store for tweets
  let objectStore = db.createObjectStore("tweets", { keyPath: "id", autoIncrement: true });

  // Create an index for the "category" property
  objectStore.createIndex("category", "category", { unique: false });
};

request.onerror = function(event) {
    console.log("Error opening database");
};

// Handle successful database connection
request.onsuccess = function(event) {
  let db = event.target.result;

  // Save data to object store when "Save" button is clicked
  saveBtn.addEventListener('click', saveData)



  ////////////////////////////
    // Retrieve data from object store and group by category
/*     let objectStore = db.transaction("tweets").objectStore("tweets");
    let getAllRequest = objectStore.getAll();
  
    getAllRequest.onsuccess = function(event) {
      let tweets = event.target.result;
  
      // Group tweets by category
      let groupedTweets = {};
      for (let tweet of tweets) {
        if (!groupedTweets[tweet.category]) {
          groupedTweets[tweet.category] = [];
        }
        groupedTweets[tweet.category].push(tweet.content);
      }
  
      console.log("Data in database:", groupedTweets);
    }; */
  ////////////////////////////
    function saveData(){
        let transaction = db.transaction(["tweets"], "readwrite");
        let objectStore = transaction.objectStore("tweets");

        let tweet = {
          cate: inputCategory.value,
          content: inputTweet.value
        };

        let request = objectStore.add(tweet);

        request.onsuccess = function(event) {
          console.log("Tweet saved to database");
        };

        request.onerror = function(event) {
          console.log("Error saving tweet to database");
        };

        transaction.oncomplete = function(event) {
          inputCategory.value = "";
          inputTweet.value = "";
          console.log("Transaction completed");
        };

    }
};


