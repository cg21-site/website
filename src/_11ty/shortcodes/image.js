const Image = require("@11ty/eleventy-img");

//Add default value for size attr https://github.com/AleksandrHovhannisyan/11ty-sass-images-seo/blob/master/11ty/shortcodes/image.js

async function imageShortcode(
  src, 
  alt, 
  sizes = '(max-width: 480px) 100vw, (max-width: 961px) 50vw, 33vw', 
  loading, 
  className = ''
  ) {
  let metadata = await Image(src, {
    // logo width = 112px
    widths: [224, 448],
    // use png instead of jpeg to preserve alpha transparency
    formats: ["avif", "webp", "png"],
		outputDir: "./public/img/"
  });

  let imageAttributes = {
    class: className,
    alt,
    sizes,
    loading,
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = imageShortcode;