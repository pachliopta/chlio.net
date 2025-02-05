export default {
  layout: "layouts/post.njk",
  tags: "_post",
  eleventyComputed: {
    permalink: function ({ title }) {
      return `/blog/${this.slugify(title)}/index.html`;
    },
  },
};
