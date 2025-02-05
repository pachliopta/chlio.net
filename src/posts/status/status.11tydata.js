export default {
  layout: "layouts/log.njk",
  tags: "status",
  eleventyComputed: {
    permalink: function (data) {
      var date = Math.floor(data.date.getTime() / 1000);
      return `/status/${date}/index.html`;
    },
  },
};
