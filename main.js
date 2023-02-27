const inputCategory = document.getElementById("input-category");
const inputTweet = document.getElementById("input-tweet");
const saveBtn = document.getElementById("input-save-btn");
const checkboxesContainer = document.getElementById("checkboxes-container");
const tweetsContainer = document.querySelector(".tweets-container");
let previousInputCategory = "";
let previousInputTweet = "";
//open a connection to tweetsDB (if doesn't exist create and open)
const initDB = window.indexedDB.open("tweetsDB", 1);

initDB.addEventListener("upgradeneeded", function(e){
    let objectStore = e.target.result.createObjectStore('tweets', { keyPath: "id", autoIncrement: true });
    // first parameter is name , the second is keypath
    objectStore.createIndex("category", "category", { unique: false });
    objectStore.createIndex("category_tweet", ["category", "tweet"], { unique: true });
});

initDB.addEventListener("error", function(event) {
    console.log("Error opening database:", event.target.error);
});
initDB.addEventListener("success",initDBSuccess)

function initDBSuccess(e){
    let result = e.target.result
    saveBtn.addEventListener('click', function(){
        if(/^(|\s+)$/.test(inputCategory.value) || /^(|\s+)$/.test(inputTweet.value)){
            alert('all fields are required')
        }
        else{
            const tx = result.transaction(['tweets'], 'readwrite');
            //const request = tx.objectStore('tweets').index('category_tweet').openCursor(IDBKeyRange.only([inputCategory.value, inputTweet.value]));
            const request = tx.objectStore('tweets').index('category_tweet').get([inputCategory.value, inputTweet.value]);;
            request.onsuccess = (event) => {
                const result = event.target.result;
                // result is either an object or undefined
                if (result) {
                    console.log(result)
                  alert("An object with the same category and tweet already exists!");
                } 
                else {
                    console.log(result)
                    tx.objectStore('tweets').add({
                        category: inputCategory.value, 
                        tweet: inputTweet.value,
                    })
        
                    location.reload() 
                }
    
            }
            request.onerror = (event) => {
                console.error("Error getting tweet:", event.target.error);
            };
        }

    })
    
        //const tx = result.transaction('tweets', 'readonly');
        //const store = tx.objectStore('tweets');
        //const index = store.index('category'); 
        const index = result.transaction('tweets', 'readonly').objectStore('tweets').index('category');
        console.log(index)
        const categoryRequest = index.getAll()
        categoryRequest.onsuccess = (e)=>{
            console.log(e.target.result)
            const categories = [...new Set(e.target.result.map(element => element.category))];
            console.log(categories)
            categories.forEach((element)=>{
                console.log(element)
                const request = index.openCursor(IDBKeyRange.only(element));
                let titleMissing = true;
                const div = document.createElement('div')
                div.id = element
                div.classList.add('collection')
                request.onsuccess = (event) => {
                      const cursor = event.target.result;
                      if (cursor) {
                        //console.log(cursor);
                        //console.log(cursor.value.tweet);
                        //console.log(cursor.value.id);
                        if(titleMissing){           
                            const h3 = document.createElement('h3')
                            h3.innerText = cursor.value.category
                            div.append(h3)           
                            titleMissing = false
                        }
                        const p = document.createElement('p')
                        p.innerText = cursor.value.tweet
                        div.append(p)
                        cursor.continue();
                    }
                    
                };
        
                request.onerror = (event) => {
                    div.innerText = "Error retrieving tweets"
                  console.log("Error retrieving tweets:", event.target.error);
                };
                tweetsContainer.append(div)
            })
        }

}

