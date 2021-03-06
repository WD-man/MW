
import ImgMove from './img-move';


export default class parallax {
  constructor(block, size = 2000, model) {
    this.block = block;
    this.model = model;
    this.scrollingBlock = this.block.parentElement;
    this.scrollingBlockSize = size;
    this._fixedCoords = this.getFixedCoords();
    this._startParallax = this.getStartParallaxCoords();
    this.images = [];

    this.setBoxSize();

    this._endParallax = this.getEndParallaxCoords();
    this.scrollDuration = this._endParallax - this._startParallax;

    if (this.model.images) {
      this.imgInit();
    }
  }

  setBoxSize() {
    this.scrollingBlock.style.height = this.scrollingBlockSize + `px`;
  }

  imgInit() {
    let i = 0;
    this.images = this.block.querySelectorAll(`.moved-image`);
    this.imageList = [];
    for (let item of this.images) {
      this.imageList[i] = new ImgMove(item, this.model.images[i], this.scrollDuration, this._startParallax);
      i++;
    }
  }

  getElemCoords(elem) {
    const relCoords = elem.getBoundingClientRect();

    return {
      top: relCoords.top + window.pageYOffset,
      left: relCoords.left + window.pageXOffset
    };
  }

  getFixedCoords() {
    const coords = {};
    coords.top = 0;
    coords.left = this.getElemCoords(this.block).left;
    return coords;
  }

  getStartParallaxCoords() {
    const startCoords = this.getElemCoords(this.block).top - this._fixedCoords.top;
    return startCoords;
  }

  getEndParallaxCoords() {
    const scrollingBlockCoords = this.getElemCoords(this.scrollingBlock);
    const endCoords = scrollingBlockCoords.top + this.scrollingBlock.scrollHeight;
    const endParallaxCoords = endCoords - this.block.scrollHeight - this._fixedCoords.top;

    return endParallaxCoords;
  }

  startParallax() {
    this.block.style.position = `fixed`;
    this.block.style.top = this._fixedCoords.top + `px`;
    this.block.style.left = this._fixedCoords.left + `px`;

    if (this.imageList) {
      for (let item of this.imageList) {
        item.move();
      }
    }

  }

  endParallax() {
    this.block.style.position = `absolute`;
    this.block.style.top = this._endParallax + this._fixedCoords.top + `px`;

    if (this.imageList) {
      for (let item of this.imageList) {
        item.endMove();
      }
    }
  }

  cancelParallax() {
    this.block.style.position = `static`;
  }
}
