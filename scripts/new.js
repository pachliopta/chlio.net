import { argv } from "node:process";
import fs from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const date = new Date();
const blog_path = join(
  __dirname,
  "../src/posts/blog",
  date.getFullYear().toString(),
);
const status_path = join(
  __dirname,
  "../src/posts/status",
  date.getFullYear().toString(),
);
const has_title = argv.length > 3;

switch (argv[2].toLowerCase()) {
  case "blog":
    const post_content = `---
title: ${argv.slice(3, argv.length).join(" ")}
date: ${date.toISOString()}
---`;
    fs.mkdir(blog_path, { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.writeFile(
      join(blog_path, Math.floor(date.getTime() / 1000).toString() + ".md"),
      post_content,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("blog created successfully");
        }
      },
    );
    break;
  case "status":
    const status_content = `---
date: ${date.toISOString()}
---

${argv.slice(3, argv.length).join(" ")}`;
    fs.mkdir(status_path, { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.writeFile(
      join(status_path, Math.floor(date.getTime() / 1000).toString() + ".md"),
      status_content,
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("status created successfully");
        }
      },
    );
    break;
}
