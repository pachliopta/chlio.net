import { argv, env } from "node:process";
import fs from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import child_process from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const date = new Date();
const name = Math.floor(date.getTime() / 1000).toString() + ".md";
const blog_path = join(
  __dirname,
  "../src/posts/blog",
  date.getFullYear().toString(),
  name,
);
const status_path = join(
  __dirname,
  "../src/posts/status",
  date.getFullYear().toString(),
  name,
);
const has_title = argv.length > 3;
const editor = env.EDITOR || "vi";
var result = false;

switch (argv[2].toLowerCase()) {
  case "blog":
    const post_content = `---
title: ${argv.slice(3, argv.length).join(" ")}
date: ${date.toISOString()}
---`;
    fs.mkdir(dirname(blog_path), { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.writeFile(blog_path, post_content, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("blog created successfully");
      }
    });
    result = blog_path;
    break;
  case "status":
    const status_content = `---
date: ${date.toISOString()}
---

${argv.slice(3, argv.length).join(" ")}`;
    fs.mkdir(dirname(status_path), { recursive: true }, (err) => {
      if (err) throw err;
    });

    fs.writeFile(status_path, status_content, (err) => {
      if (err) {
        throw err;
      } else {
        console.log("status created successfully");
      }
    });
    result = status_path;
    break;
}

if (result != false) {
  var child = child_process.spawn(editor, [result], {
    stdio: "inherit",
  });
  child.on("exit", function (e, code) {
    console.log("finished editing post");
  });
}
