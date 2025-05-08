import * as fs from 'fs'

// Simulate getting unordered stories from an API
const apiStoriesArray = [
  "Story 1", "Story 2", "Story 3","Story 5"
]

// Where we store our sorting order
const storedSortedStoriesFilename = "src/_data/sorted-stories.json"

// Read existing sorted stories and convert to JS object. 
const storedSortedStories = fs.readFileSync(storedSortedStoriesFilename, 'utf8');
const storedSortedStoriesObj = JSON.parse(storedSortedStories)
const storedSortedStoriesArray = storedSortedStoriesObj.storiesArray

// array to hold our sorted stories
const newStoriesObjectArray = []

// create an object for each story from the API, don't set any ordering
for (const apiStory of apiStoriesArray) {
  newStoriesObjectArray.push({ name: apiStory, order: null })
}


// loop those stories
for (const story of newStoriesObjectArray) {

  // for each story look through the data in storedSortedStoriesArray for a match. 
  for (const storedSortedStory of storedSortedStoriesArray) {
    // if there is a match preserve the order value.
    if (story.name == storedSortedStory.name) {
      story.order = storedSortedStory.order
    }
  }
}

// we now have an up to date list of stories with latet orders.
// Orders will be null for any new stories.
// Orders from existing stories will be preserved.
console.log("newStoriesObjectArray: ", newStoriesObjectArray)

// Create a JSON object to store newStoriesObjectArray
const storiesJSON = JSON.stringify({
  storiesArray: newStoriesObjectArray
})


// Write that out to the file system
fs.writeFile(storedSortedStoriesFilename, storiesJSON, { flag: 'w+' }, err => {
  if (err) {
    console.error(err);
  } else {
  }
});

export default {apiStoriesArray}