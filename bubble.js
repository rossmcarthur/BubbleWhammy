class Bubble {

  constructor(x, y, canX, canY, color){
    this.x = x;
    this.y = y;
    this.canX = canX;
    this.canY = canY;
    this.present = true;
    this.color = color;
  }

  pos() {
    return [this.x, this.y];
  }

  draw(ctx) {
    
  }



}

export default Bubble;
