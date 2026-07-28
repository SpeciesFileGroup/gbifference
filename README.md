# gbifference

JavaScript widget that compares your DwC row to that in GBIF, highlighting issues GBIF has found.

## Overview

[GBIF](https://www.gbif.org/) provides a page for each occurrence record. That page includes a table that show original and inferred data, and a column of remarks that may reflect data-quality issues. You can see an [example here](https://www.gbif.org/occurrence/3111547444). This widget replicates this comparsion in simple widget. It is smart enough to know when your local version has diverged from the version on GBIF, and adjusts itself accordingly.  

The code is application agnostic.  It can be used in web or other applications and on your own machine locally through your web-browser.

## Quick start

```
npm install
npm run dev
```

Navigate to the Local host in your browser.

## Implementation

### Package

### CDN

### Native Javascript 

## Styling

The table exposes CSS classes so the host application can apply its own styles.

| Class | Element |
| --- | --- |
| `.table-gbifference` | the `<table>` |
| `.table-gbifference__json` | the `<pre>` wrapping a JSON value |
| `.table-gbifference__remark-cell` | the `<td>` of the remarks column |
| `.table-gbifference__remark` | the `<span>` wrapping the remark type |
| `.table-gbifference__remark--inferred` | remark of an inferred value |
| `.table-gbifference__remark--altered` | remark of an altered value |
| `.table-gbifference__remark--excluded` | remark of an excluded value |

```css
.table-gbifference__remark {
  display: inline-block;
  padding: 0.15em 0.6em;
  border-radius: 1em;
  font-size: 0.85em;
}

.table-gbifference__remark--inferred { background-color: #E3F2FD; }
.table-gbifference__remark--altered { background-color: #FFF8E1; }
.table-gbifference__remark--excluded { background-color: #FFEBEE; }
```


