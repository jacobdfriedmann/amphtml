<!---
Copyright 2015 The AMP HTML Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS-IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# <a name="amp-addthis"></a> `amp-addthis`

<table>
  <tr>
    <td width="40%"><strong>Description</strong></td>
    <td>Displays an AddThis website tools embed.</td>
  </tr>
  <tr>
    <td width="40%"><strong>Availability</strong></td>
    <td>Experimental</td>
  </tr>
  <tr>
    <td width="40%"><strong>Required Script</strong></td>
    <td><code>&lt;script async custom-element="amp-addthis" src="https://cdn.ampproject.org/v0/amp-addthis-0.1.js">&lt;/script></code></td>
  </tr>
  <tr>
    <td class="col-fourty"><strong><a href="https://www.ampproject.org/docs/guides/responsive/control_layout.html">Supported Layouts</a></strong></td>
    <td>fill, fixed, fixed-height, flex-item, nodisplay, responsive</td>
  </tr>
  <tr>
    <td width="40%"><strong>TODO: Examples</strong></td>
    <td><a href="https://ampbyexample.com/components/amp-addthis/">Annotated code example for amp-addthis</a></td>
  </tr>
</table>

## Behavior

Example:
```html
<amp-addthis
  data-pubId="ra-5845adf8aaa34e1d"
  data-widgetId="h8ke"
  width="320"
  height="100"
  layout="responsive">
</amp-addthis>
```

## Attributes

**data-pubId**

The AddThis publisher ID found on the AddThis dashboard (https://addthis.com/dashboard).

**data-widgetId**

The AddThis widget ID found on the AddThis dashboard (https://addthis.com/dashboard).

## Validation

See [amp-instagram rules](https://github.com/ampproject/amphtml/blob/master/extensions/amp-addthis/0.1/validator-amp-addthis.protoascii) in the AMP validator specification.
