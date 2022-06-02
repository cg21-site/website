const esbuild = require("esbuild");
const imageShortcode = require("./src/_11ty/shortcodes/image");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { DateTime } = require("luxon");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const sortByDisplayOrder = require('./src/_11ty/utils/sort-by-display-order.js');
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");

module.exports = function (eleventyConfig) {
	eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(directoryOutputPlugin);

	//DATA DEEP MERGE DEFAULTS TO TRUE IN 1.0
	eleventyConfig.setDataDeepMerge(false);

	//PLUGIN
	eleventyConfig.addPlugin(EleventyRenderPlugin);
	eleventyConfig.addPlugin(eleventyNavigationPlugin);

	//FILTER
	eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
	eleventyConfig.addFilter("postDate", (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});
	eleventyConfig.addFilter("limit", function (arr, limit) {
		return arr.slice(0, limit);
	});
	eleventyConfig.addFilter("pluck", function (arr, selections, attr) {
		return arr.filter((item) => selections.includes(item.data[attr]));
	});
	eleventyConfig.addFilter("addNbsp", (str) => {
		if (!str) {
			return;
		}
		let title = str.replace(/((.*)\s(.*))$/g, "$2&nbsp;$3");
		title = title.replace(/"(.*)"/g, '\\"$1\\"');
		return title;
	});

	//PASSTHROUGH COPY
	eleventyConfig.addPassthroughCopy("./src/fonts");
	eleventyConfig.addPassthroughCopy("./src/img");
	eleventyConfig.addPassthroughCopy("./src/scripts");
	eleventyConfig.addPassthroughCopy("./src/admin");
	eleventyConfig.addPassthroughCopy("./src/favicon.ico");
	eleventyConfig.addPassthroughCopy("./src/icon.svg");
	eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
	eleventyConfig.addPassthroughCopy("./src/icon-192.png");
	eleventyConfig.addPassthroughCopy("./src/icon-512.png");
	eleventyConfig.addPassthroughCopy("./src/manifest.webmanifest");

	//SHORTCODE
	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

	//WATCH TARGET
	eleventyConfig.addWatchTarget("./src/_includes/css/");
	eleventyConfig.addWatchTarget('./src/build-scripts/');
	eleventyConfig.addWatchTarget('./src/scripts/');

	// COLLECTIONS
	eleventyConfig.addCollection("pages", function(collectionApi) {
		return sortByDisplayOrder(collectionApi.getFilteredByGlob("./src/pages/*.md"));
	});
	eleventyConfig.addCollection("posts", function(collectionApi) {
		return collectionApi.getFilteredByGlob("./src/posts/*.md");
	});
	eleventyConfig.addCollection("products", function(collectionApi) {
		return collectionApi.getFilteredByGlob("./src/products/*.md");
	});
	eleventyConfig.addCollection("testimonials", function(collectionApi) {
		return sortByDisplayOrder(collectionApi.getFilteredByGlob("./src/testimonials/*.md"));
	});
	eleventyConfig.addCollection("clients", function(collectionApi) {
		return sortByDisplayOrder(collectionApi.getFilteredByGlob("./src/clients/*.md"));
	});
	
	// Create an array of all tags
	
	function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "nav", "post", "posts", "exports"].indexOf(tag) === -1);
  }
  eleventyConfig.addFilter("filterTagList", filterTagList)
  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });


	//ELEVENTY AFTER EVENT
	eleventyConfig.on('eleventy.after', async () => {
    // Run me after the build ends
		return esbuild.build({
      entryPoints: [
				'src/build-scripts/burger-menu.js',
				'src/build-scripts/globe.js', 
				'src/build-scripts/details-utils.js', 
				'src/build-scripts/lite-yt-embed.js'
			],
      bundle: true,
			minify: true,
      outdir: 'public/scripts'
    });
  });

	//TRANSFORM
	eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath && outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
	collapseBooleanAttributes: true
      });
      return minified;
    }

    return content;
  });

	return {
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
		dir: {
			input: 'src',
			output: 'public'
		}
	};
};
