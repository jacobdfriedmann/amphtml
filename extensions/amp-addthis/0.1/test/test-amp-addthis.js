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

import {
  createIframePromise,
  doNotLoadExternalResourcesInTest,
} from '../../../../testing/iframe';
import '../amp-addthis';
import {adopt} from '../../../../src/runtime';

adopt(window);

describe('amp-addthis', () => {

  function getIns(pubId, widgetId, opt_responsive, opt_beforeLayoutCallback) {
    return createIframePromise(true, opt_beforeLayoutCallback).then(iframe => {
      doNotLoadExternalResourcesInTest(iframe.win);
      const at = iframe.doc.createElement('amp-addthis');
      at.setAttribute('data-pubId', pubId);
      at.setAttribute('data-widgetId', widgetId);
      at.setAttribute('width', '111');
      at.setAttribute('height', '222');
      if (opt_responsive) {
        at.setAttribute('layout', 'responsive');
      }
      return iframe.addElement(at);
    });
  }

  function testImage(image) {
    expect(image).to.not.be.null;
    // TODO: add real image
    expect(image.getAttribute('src')).to.equal(
        'http://static.boredpanda.com/blog/wp-content/uploads/2016/11/unflattering-donald-trump-chin-photo-ps-battle-35.jpg');
    expect(image.getAttribute('layout')).to.equal('fill');
    expect(image.getAttribute('alt')).to.equal('AddThis website tools');
    expect(image.getAttribute('referrerpolicy')).to.equal('origin');
  }

  function testIframe(iframe) {
    expect(iframe).to.not.be.null;
    expect(iframe.src).to.equal('https://cache-dev.addthis.com/static/amp.html');
    expect(iframe.className).to.match(/-amp-fill-content/);
  }

  it('renders', () => {
    return getIns('ra-12345', 'fBwFP').then(ins => {
      testIframe(ins.querySelector('iframe'));
      testImage(ins.querySelector('amp-img'));
    });
  });

  it('removes iframe after unlayoutCallback', () => {
    return getIns('ra-12345', 'fBwFP').then(ins => {
      const placeholder = ins.querySelector('[placeholder]');
      testIframe(ins.querySelector('iframe'));
      const obj = ins.implementation_;
      obj.unlayoutCallback();
      expect(ins.querySelector('iframe')).to.be.null;
      expect(obj.iframe_).to.be.null;
      expect(obj.iframePromise_).to.be.null;
      expect(placeholder.style.display).to.be.equal('');
    });
  });

  it('renders responsively', () => {
    return getIns('ra-12345', 'fBwFP', true).then(ins => {
      expect(ins.className).to.match(/amp-layout-responsive/);
    });
  });

  it('requires data-pubId', () => {
    expect(getIns('', 'fBwFP')).to.be.rejectedWith(
        /The data-pubId attribute is required for/);
  });

  it('requires data-widgetId', () => {
    expect(getIns('ra-12345', '')).to.be.rejectedWith(
        /The data-widgetId attribute is required for/);
  });
});
