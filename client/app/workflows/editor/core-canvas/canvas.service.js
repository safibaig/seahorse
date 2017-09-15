import _ from 'lodash';


//TODO Move it to the nodeType table and get from there
const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;

const OFFSET = 30;

const POSITION_BOUNDS = {
  X: [-10000, 0],
  Y: [-10000, 0]
};

const ZOOM_BOUNDS = [0.5, 1.5];

class CanvasService {
  /*@ngInject*/
  constructor(AdapterService, $rootScope) {
    this.AdapterService = AdapterService;
    this.$rootScope = $rootScope;

    this.slidingWindowSize = {
      width: 0,
      height: 0,
    };

    this.slidingWindowPosition = {
      x: 0,
      y: 0,
    };

    this.scale = 1;
  }

  initialize(jsPlumbContainer, slidingWindow) {
    this.$slidingWindow = $(slidingWindow);
    this.AdapterService.initialize(jsPlumbContainer);
    this.$rootScope.$watch(() => this.getWindowSize(), (newValue, oldValue) => {
      const heightDelta = newValue.height - oldValue.height;
      const widthDelta = newValue.width - oldValue.width;
      let ratio;
      if (widthDelta && Math.abs(heightDelta) > Math.abs(widthDelta)) {
        ratio = widthDelta / newValue.width * this.scale;
      } else {
        ratio = heightDelta / newValue.height * this.scale;
      }
      this.centerZoom(ratio);
      this.moveWindow(widthDelta/2, heightDelta/2);
      this.slidingWindowSize = this.getWindowSize();
    }, true); // deep

    this.setZoom(1);
    this.applyToWindow();
  }

  getWindowSize() {
    return {
      width: this.$slidingWindow.width(),
      height: this.$slidingWindow.height()
    }
  }

  applyToWindow() {
    this.$slidingWindow.css({
      'transform': `translate(${this.slidingWindowPosition.x}px, ${this.slidingWindowPosition.y}px) scale(${this.scale})`
    });
  }

  setZoom(zoom) {
    this.scale = _.clamp(zoom, ...ZOOM_BOUNDS);
    this.AdapterService.setZoom(this.scale);
  }

  setPosition(position) {
    const newPosition = {
      x: _.clamp(position.x, POSITION_BOUNDS.X[0] * this.scale + this.slidingWindowSize.width, POSITION_BOUNDS.X[1]),
      y: _.clamp(position.y, POSITION_BOUNDS.Y[0] * this.scale + this.slidingWindowSize.height, POSITION_BOUNDS.Y[1]),
    };
    this.slidingWindowPosition = newPosition;
    this.applyToWindow();
  }

  setWorkflow(workflow) {
    this.nodes = workflow.getNodes();
    this.AdapterService.setWorkflow(workflow);
  }

  setEditable(isEditable) {
    this.AdapterService.isEditable = isEditable;
  }

  render() {
    this.AdapterService.render();
  }

  moveWindow(x = 0, y = 0) {
    this.setPosition({
      x: this.slidingWindowPosition.x + x,
      y: this.slidingWindowPosition.y + y
    });
  }

  fit() {
    this.slidingWindowSize = this.getWindowSize();
    const boundaries = {
      left: Infinity,
      top: 0,
      right: 0,
      bottom: Infinity
    };

    Object.keys(this.nodes).forEach((key) => {
      boundaries.left = Math.min(boundaries.left, this.nodes[key].x);
      boundaries.right = Math.max(boundaries.right, this.nodes[key].x + NODE_WIDTH);
      boundaries.top = Math.max(boundaries.top, this.nodes[key].y + NODE_HEIGHT);
      boundaries.bottom = Math.min(boundaries.bottom, this.nodes[key].y);
    });

    this.setZoom(Math.min(
      (this.slidingWindowSize.width - OFFSET) / (boundaries.right - boundaries.left),
      (this.slidingWindowSize.height - OFFSET) / (boundaries.top - boundaries.bottom)
    ));

    this.setPosition({
      x: -this.scale * ((boundaries.left + boundaries.right) / 2) + (this.slidingWindowSize.width) / 2,
      y: -this.scale * ((boundaries.top + boundaries.bottom) / 2) + (this.slidingWindowSize.height) / 2
    })
  }

  centerZoom(zoomDelta) {
    const initialScale = this.scale;
    this.setZoom(this.scale + zoomDelta);
    const ratio = this.scale / initialScale;
    this.setPosition({
      x: this.slidingWindowSize.width/2 -(this.slidingWindowSize.width/2 - this.slidingWindowPosition.x) * ratio,
      y: this.slidingWindowSize.height/2- (this.slidingWindowSize.height/2 - this.slidingWindowPosition.y) * ratio
    })
  }

  translatePosition(x, y) {
    return [
      -1 * this.slidingWindowPosition.x / this.scale + x,
      -1 * this.slidingWindowPosition.y / this.scale + y
    ];
  }
}

export default CanvasService;
