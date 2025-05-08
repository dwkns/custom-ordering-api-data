import tailwindcss from '../../dev/eleventy-plugin-tailwindcss-4/index.js'
import * as fs from 'fs';
import touch from 'touch'
import logToConsole from "eleventy-plugin-console-plus";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default (eleventyConfig) => {
  eleventyConfig.addPlugin(tailwindcss, {
    input: 'css/tailwind.css',
    debug: false
  });

  eleventyConfig.addPlugin(logToConsole);

  // Copy our JSON file to the output directory
  eleventyConfig.addPassthroughCopy({
    "src/_data/sorted-stories.json": "/sorted-stories.json"
  })


  // Set up our on Request handlers for the server
  eleventyConfig.setServerOptions({
    onRequest: {
      "/reload/:b64String": function ({ url, pattern, patternGroups }) {

        // decode the JSON passed as a b64 string
        const b64String = atob(patternGroups.b64String)

        // Store the JSON back to the file system
        const storedSortedStoriesFilename = "src/_data/sorted-stories.json"
        fs.writeFile(storedSortedStoriesFilename, b64String, { flag: 'w+' }, err => {
          if (err) {
            console.error(err);
          } else {
          }
        });

        const dir = eleventyConfig.dir // get eleventy directories
        // We need to reprocess the stories.js file with the new order
        // Best way to do this is to 'touch' the file so eleventy will reprocess it.
        const dataFile = `./${dir.input}/${dir.data}/stories.js`
        touch.sync(dataFile)

        // Reprocess the template with the new order too

        const templateFile = `./${dir.input}/index.njk.js`
        touch.sync(templateFile)

        return "Nothing to see here" // return is not important but we need to return something
      },
    }
  });



};

export const config = {
  htmlTemplateEngine: "njk",
  dir: {
    input: "src",
    output: "dist"
  },
};