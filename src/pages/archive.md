---
title: Archive
layout: "layouts/archive.html"
pagination:
  data: collections.posts
  size: 8
  reverse: true
permalink: "archive/{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
displayOrder: 2
---
