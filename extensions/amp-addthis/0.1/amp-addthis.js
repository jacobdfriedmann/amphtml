/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /**
  * @fileoverview Embeds AddThis website tools.
  * The data-pubId and data-widgetId can easily be found in the AddThis dashboard.
  * Example:
  * <code>
  * <amp-addthis
  *   width="320"
  *   height="392"
  *   layout="responsive"
  *   data-pubId="ra-57bf37af2a1c5d94"
  *   data-widgetId="f2m5">
  * </amp-addthis>
  * </code>
  *
  */

import {loadPromise} from '../../../src/event-helper';
import {tryParseJson} from '../../../src/json';
import {isLayoutSizeDefined} from '../../../src/layout';
import {setStyles} from '../../../src/style';
import {removeElement} from '../../../src/dom';
import {timerFor} from '../../../src/timer';
import {isObject} from '../../../src/types';
import {user} from '../../../src/log';

class AmpAddThis extends AMP.BaseElement {

  /** @param {!AmpElement} element */
  constructor(element) {
    super(element);

    /** @private {?Element} */
    this.iframe_ = null;

    /** @private {?Promise} */
    this.iframePromise_ = null;

    /** @private {?string} */
    this.pubId_ = '';

    /** @private {?string} */
    this.widgetId_ = '';
  }

  /**
   * @param {boolean=} opt_onLayout
   * @override
   */
  preconnectCallback(opt_onLayout) {
    // TODO: prod domains
    this.preconnect.url('https://cache-dev.addthis.com', opt_onLayout);
    this.preconnect.url('https://m-dev.addthis.com', opt_onLayout);
  }

  /** @override */
  renderOutsideViewport() {
    return true;
  }

  /** @override */
  buildCallback() {
    this.pubId_ = user().assert(
        (this.element.getAttribute('data-pubId') ||
        this.element.getAttribute('pubId')),
        'The data-pubId attribute is required for <amp-addthis> %s',
        this.element);
    this.widgetId_ = user().assert(
        (this.element.getAttribute('data-widgetId') ||
        this.element.getAttribute('widgetId')),
        'The data-widgetId attribute is required for <amp-addthis> %s',
        this.element);
  }

  /** @override */
  createPlaceholderCallback() {
    const placeholder = this.win.document.createElement('div');
    placeholder.setAttribute('placeholder', '');
    const image = this.win.document.createElement('amp-img');
    // This will redirect to the image URL. By experimentation this is
    // always the same URL that is actually used inside of the embed.
    image.setAttribute('src', 'http://static.boredpanda.com/blog/wp-content/uploads/2016/11/unflattering-donald-trump-chin-photo-ps-battle-35.jpg');
    image.setAttribute('layout', 'fill');
    image.setAttribute('referrerpolicy', 'origin');
    image.setAttribute('alt', 'AddThis website tools');

    placeholder.appendChild(image);
    return placeholder;
  }

  /** @override */
  isLayoutSupported(layout) {
    return isLayoutSizeDefined(layout);
  }

  /** @override */
  layoutCallback() {
    if (!this.win.ADDTHIS_CONFIG) {
      this.win.ADDTHIS_CONFIG = {
        iframeCount: 0,
      };
    }

    const iframe = this.element.ownerDocument.createElement('iframe');
    const src = `https://cache-dev.addthis.com/static/amp.html`;

    iframe.setAttribute('frameborder', '0');
    setStyles(iframe, {
      'margin-bottom': '-5px',
    });
    iframe.src = src;
    this.applyFillContent(iframe);
    this.element.appendChild(iframe);

    /** @private {!Element} */
    this.iframe_ = iframe;

    this.win.addEventListener(
        'message', event => this.handleAddThisMessages_(event));

    return this.iframePromise_ = loadPromise(iframe).then(() => this.listenToFrame_());
  }

  /** @private */
  handleAddThisMessages_(event) {
    if (event.origin != 'https://cache-dev.addthis.com' ||
        event.source != this.iframe_.contentWindow) {
      return;
    }
    if (!event.data ||
        !(isObject(event.data) || event.data.indexOf('{') == 0)) {
      return;  // Doesn't look like JSON.
    }
    const data = isObject(event.data) ? event.data : tryParseJson(event.data);
    if (data === undefined) {
      return; // We only process valid JSON.
    }
    if (data.event === 'ready') {
      this.sendConfiguration_();
    }
  }

  /**
   * Sends 'listening' message to the AddThis iframe to listen for events.
   * @private
   */
  listenToFrame_() {
    this.iframe_.contentWindow./*OK*/postMessage(JSON.stringify({
      'event': 'listening',
    }), '*');
  }

  /**
   * Sends sharing configuration to AddThis iframe.
   * @private
   */
  sendConfiguration_() {
    this.iframe_.contentWindow./*OK*/postMessage(JSON.stringify({
      'event': 'configuration',
      'iframeCount': ++this.win.ADDTHIS_CONFIG.iframeCount,
      'shareConfig': {
        url: this.element.ownerDocument.location.href,
        title: this.element.ownerDocument.title,
      },
      'pubId': this.pubId_,
      'widgetId': this.widgetId_,
    }), '*');
  }

  /** @override */
  unlayoutCallback() {
    if (this.iframe_) {
      removeElement(this.iframe_);
      this.iframe_ = null;
      this.iframePromise_ = null;
    }
    return true;  // Call layoutCallback again.
  }
};

AMP.registerElement('amp-addthis', AmpAddThis);
