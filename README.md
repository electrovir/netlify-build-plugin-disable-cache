# netlify-build-plugin-disable-cache

A Netlify build plugin that deletes all Netlify builds caches in all steps to effectively disable the Netlify build cache so it stops crashing your builds.

## Usage

Add the following to your `netlify.toml` file:

```toml
[[plugins]]
package = "netlify-build-plugin-disable-cache"
```
