const React = require("react");
const ReactDOMServer = require("react-dom/server");
const path = require("path");
const babelRegister = require("@babel/register");
const esbuild = require("esbuild");
const fg = require("fast-glob");

babelRegister({
  presets: ["@babel/preset-react"],
  extensions: [".js", ".jsx"],
});

module.exports = function(eleventyConfig) {
  eleventyConfig.on("beforeBuild", async () => {
    const entryFiles = fg.sync("src/_js/entrypoints/*.jsx");

    await esbuild.build({
      entryPoints: entryFiles,
      outdir: "_site/assets/scripts/entrypoints",
      bundle: true,
      minify: process.env.NODE_ENV === "production",
      sourcemap: process.env.NODE_ENV === "development",
      keepNames: true,
      format: "esm",
      loader: {
        ".jsx": "jsx",
      },
      resolveExtensions: [".js", ".jsx"],
    });

    console.log("✅ esbuild completed");
  });

  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("_headers");

  eleventyConfig.addShortcode("reactSsr", function(componentName, props, hydrate = false) {
    const id = `react-ssr-${Math.random().toString(36).substring(2, 15)}`;
    const componentPath = path.join(__dirname, "src", "_js", "entrypoints", `${componentName}.jsx`);
    const Component = require(componentPath).default;
    const html = ReactDOMServer.renderToString(React.createElement(Component, props));

    if (hydrate) {
      return `
        <div id="${id}">
          ${html}
        </div>

        <script type="module">
          import { hydrate } from "/assets/scripts/entrypoints/${componentName}.js";

          hydrate("${id}", ${JSON.stringify(props)});
        </script>
      `;
    }

    return html;
  });

  return {
      dir: {
          input: "src",
          includes: "_includes",
          output: "_site"
      }
  };
};
