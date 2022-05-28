---
title: OG
layout: "layouts/og.html"
eleventyExcludeFromCollections: true
pagination:
  data: collections.pages
  size: 1
  alias: pageData
permalink: "og/{{ pageData.fileSlug | slugify }}/index.html"
---
