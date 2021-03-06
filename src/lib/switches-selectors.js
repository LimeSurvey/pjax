import {
  forEachEls
} from './utility';

import defaultSwitches from "./switches";

export default function () {
  return (switches, switchesOptions, selectors, fromEl, toEl, options) => {
    selectors.forEach((selector) => {
      const newEls = fromEl.querySelectorAll(selector);
      const oldEls = toEl.querySelectorAll(selector);
      this.log.log("Pjax switch", selector, newEls, oldEls);
      if (newEls.length !== oldEls.length) {
        const throwError = options.onDomDiffers(toEl, fromEl);
        if (throwError) {
          throw "DOM doesn’t look the same on new loaded page: ’" + selector + "’ - new " + newEls.length + ", old " + oldEls.length;
        }
      }

      forEachEls(newEls, function (newEl, i) {
        let oldEl = oldEls[i];
        if(oldEl == undefined) { return; }
        this.log.log("newEl", newEl, "oldEl", oldEl);
        if (switches[selector]) {
          switches[selector].call(this, oldEl, newEl, options, switchesOptions[selector]);
        } else {
          defaultSwitches.outerHTML.call(this, oldEl, newEl, options);
        }
      }, this);
    });
  };
}
