import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { transform, browserslistToTargets } from "lightningcss";
import { DateTime } from "luxon";
import browserslist from "browserslist";
import path from "path";
import * as sass from "sass";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

export default async function (cfg) {
  /* Plugins */
  cfg.addPlugin(EleventyHtmlBasePlugin);
  cfg.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 4,
      },
    },
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: "en",
      title: "chlio's blog",
      subtitle: "chlio's place to talk about something",
      base: "https://chlio.net/blog",
      author: {
        name: "chlio",
      },
    },
  });

  /* sass & lightningcss */
  cfg.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (input_content, input_path) {
      let parsed = path.parse(input_path);
      if (parsed.name.startsWith("_")) {
        return;
      }

      let result = sass.compileString(input_content, {
        load_paths: [parsed.dir || "."],
        source_map: false,
      });

      this.addDependencies(input_path, result.loadedUrls);

      let targets = browserslistToTargets(browserslist("> 0.2% and not dead"));

      return async () => {
        let { code } = transform({
          code: Buffer.from(result.css),
          minify: true,
          sourceMap: false,
          targets,
        });
        return code;
      };
    },
  });

  /* Filters */
  cfg.addFilter("htmlDateString", (date) => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });
  cfg.addFilter("postDate", (date) => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(
      "yyyy-LL-dd @ TTT",
    );
  });
  cfg.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  /* Shortcodes */
  cfg.addShortcode("build_time", () => `${Date.now()}`); /* for caching */
  cfg.addShortcode("build_time_pretty", () => {
    return DateTime.now().toFormat("yyyy-LL-dd");
  });

  /* Passthrough */
  cfg.addPassthroughCopy("./assets/images/**/*");
  cfg.addPassthroughCopy("./assets/fonts/**/*");
  cfg.addPassthroughCopy("./assets/buttons/**/*");
  cfg.addPassthroughCopy({ "./assets/favicon/*": "/" });
  cfg.addPassthroughCopy({
    "./src/feed/pretty-atom-feed.xsl": "/pretty-atom-feed.xsl",
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "public",
    },

    templateFormats: ["njk", "md", "txt", "scss"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
}
