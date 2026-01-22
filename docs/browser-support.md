# Browser Support Policy

miruzo-web derives its minimum browser support from required platform
features. We still prioritize testing on the latest stable release and
the previous stable release (n-1) for modern browsers. This document
lists the required web platform features and the derived minimum
versions.

## Required platform features

### JavaScript features
| Feature                                  | Reason              | Chrome | Firefox | Safari | iOS   |
| ---------------------------------------- | ------------------- | ------ | ------- | ------ | ----- |
| [Proxy][proxy]                           | Solid internals     | 49+    | 18+     | 10+    | 10+   |
| [Fetch API][fetch-api]                   | Network requests    | 42+    | 40+     | 10.1+  | 10.3+ |
| [URLSearchParams][urlsearchparams]       | Query parameters    | 49+    | 44+     | 10.1+  | 10.3+ |
| [VisualViewport][visualviewport]         | Edge inset sizing   | 61+    | 91+     | 13+    | 13+   |
| [ResizeObserver][resize-observer]        | Layout sizing       | 64+    | 69+     | 13.1+  | 13.4+ |
| [Optional chaining][optional-chaining]   | Safe access         | 80+    | 74+     | 13.1+  | 13.4+ |
| [Nullish coalescing][nullish-coalescing] | Default fallback    | 85+    | 79+     | 14+    | 14+   |
| [Array.prototype.at][array-at]           | Indexing from end   | 92+    | 90+     | 15.4+  | 15.4+ |
| [Object.hasOwn][object-hasown]           | Own property checks | 93+    | 92+     | 15.4+  | 15.4+ |

### CSS features
| Feature                                  | Reason             | Chrome | Firefox | Safari | iOS   |
| ---------------------------------------- | ------------------ | ------ | ------- | ------ | ----- |
| [CSS masks][css-masks]                   | Card borders       | 120+ (4+ -webkit-) | 53+ | 15.4+ | 15.4+ |
| [object-fit][object-fit]                 | Image cropping     | 32+    | 36+     | 10+    | 10+   |
| [CSS variables][css-variables]           | Theme tokens       | 49+    | 31+     | 10+    | 10+   |
| [CSS filters][css-filters]               | Image effects      | 53+    | 35+     | 9.1+   | 9.3+  |
| [Hex alpha colors][hex-alpha]            | Color tokens       | 62+    | 49+     | 10+    | 9.3+  |
| [rgb() alpha percent][rgb-alpha-percent] | Color tokens       | 65+    | 52+     | 12.1+  | 12.2+ |
| [rgb() alpha float][rgb-alpha-float]     | Color tokens       | 66+    | 52+     | 12.1+  | 12.2+ |
| [aspect-ratio][aspect-ratio]             | Card sizing        | 88+    | 89+     | 15+    | 15+   |
| [color-scheme][color-scheme]             | System theme hints | 98+    | 96+     | 13+    | 13+   |
| [Viewport units][viewport-units]         | `svh`/`lvh`/`dvh`  | 108+   | 101+    | 15.4+  | 15.4+ |

## Optional features

These features are not required for basic functionality. The app falls
back to alternative formats when they are missing, but supporting them
improves performance or fidelity.

| Feature      | Reason         | Chrome | Firefox | Safari            | iOS |
| ------------ | -------------- | ------ | ------- | ----------------- | --- |
| [WebP][webp] | Image delivery | 32+    | 65+     | 16+ (14+ Big Sur) | 14+ |

## Derived minimum versions

These are the highest minimums across the required feature list.

- Chrome 108+
- Firefox 101+
- Safari 15.4+
- iOS 15.4+

## Update process

1. Add new required features to the list above.
2. Look up minimum browser versions (Caniuse/MDN).
3. Recalculate the derived minimums per browser.
4. Compare with the project policy (latest and n-1); the policy wins
   when it is stricter than the derived minimums.

[aspect-ratio]: https://caniuse.com/wf-aspect-ratio
[array-at]: https://caniuse.com/wf-array-at
[color-scheme]: https://caniuse.com/wf-color-scheme
[css-filters]: https://caniuse.com/css-filters
[css-masks]: https://caniuse.com/css-masks
[css-variables]: https://caniuse.com/css-variables
[fetch-api]: https://caniuse.com/fetch
[hex-alpha]: https://caniuse.com/mdn-css_types_color_rgb_hexadecimal_notation_alpha_hexadecimal_notation
[nullish-coalescing]: https://caniuse.com/wf-nullish-coalescing
[object-fit]: https://caniuse.com/object-fit
[object-hasown]: https://caniuse.com/wf-object-hasown
[optional-chaining]: https://caniuse.com/mdn-javascript_operators_optional_chaining
[proxy]: https://caniuse.com/proxy
[resize-observer]: https://caniuse.com/mdn-api_resizeobserver
[rgb-alpha-float]: https://caniuse.com/mdn-css_types_color_rgb_float_values
[rgb-alpha-percent]: https://caniuse.com/mdn-css_types_color_rgb_alpha_parameter
[urlsearchparams]: https://caniuse.com/urlsearchparams
[visualviewport]: https://caniuse.com/mdn-api_visualviewport
[viewport-units]: https://caniuse.com/viewport-unit-variants
[webp]: https://caniuse.com/webp
