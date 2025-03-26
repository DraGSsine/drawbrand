/* eslint-disable */

import { fabric } from 'fabric';

// Custom ErasedGroup class for handling erased objects
const ErasedGroup = fabric.util.createClass(fabric.Group, {
  original: null,
  erasedPath: null,
  initialize: function(original: fabric.Object, erasedPath: fabric.Object, options: any, isAlreadyGrouped: boolean) {
    this.original = original;
    this.erasedPath = erasedPath;
    this.callSuper('initialize', [this.original, this.erasedPath], options, isAlreadyGrouped);
  },

  _calcBounds: function(onlyWidthHeight: boolean) {
    const aX: number[] = [];
    const aY: number[] = [];
    const props = ['tr', 'br', 'bl', 'tl'];
    const ignoreZoom = true;

    const o = this.original;
    o.setCoords(ignoreZoom);
    for (let j = 0; j < props.length; j++) {
      const prop = props[j];
      aX.push(o.oCoords[prop].x);
      aY.push(o.oCoords[prop].y);
    }

    this._getBounds(aX, aY, onlyWidthHeight);
  },
});

export default ErasedGroup;