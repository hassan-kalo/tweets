// Open the database
let request = indexedDB.open("tweetDB", 1);

request.onerror = function(event) {
  console.log("Error opening database");
};

request.onsuccess = function(event) {
  let db = event.target.result;

  // Save data to object store when "Save" button is clicked
  saveBtn.addEventListener('click', function() {
    let transaction = db.transaction("tweets", "readwrite");
    let objectStore = transaction.objectStore("tweets");

    let tweet = {
      category: inputCatagory.value,
      content: inputTweet.value
    };

    let request = objectStore.add(tweet);

    request.onsuccess = function(event) {
      console.log("Tweet saved to database:", tweet);
    };

    request.onerror = function(event) {
      console.log("Error saving tweet to database");
    };

    transaction.oncomplete = function(event) {
      inputCatagory.value = "";
      inputTweet.value = "";
      console.log("Transaction completed");
    };
  });

  // Retrieve data from object store and group by category
  let objectStore = db.transaction("tweets").objectStore("tweets");
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
  };
};

