//(function () {

class City {
	constructor(prop) {
    prop = prop || {};
    let APP = this;

    let cityDataDefaults = {
          elevStart: 5,
          spread: 2,
          maxIncrCh: 0.5,
          seed: Math.random(),
          plotSize: 32,
          streetSize: 8,
          shape: 'manhattan'
        },
        cityDataStaticVariables = {
          streetColor: '#8c847d',
          zones: {
            lot: {color: '#b8b1ab'},
            resident: {color: '#aebdaf'},
            park: {color: '#66a655'},
            water: {color: '#72b0cc'}
          }
        },
        canvas;

    $.each(cityDataDefaults, function (index, value) {
      APP[index] = value;
      if (typeof(prop[index]) !== 'undefined') APP[index] = prop[index];
    });

    $.each(cityDataStaticVariables, function (index, value) {
      APP[index] = value;
      /*Object.defineProperty(APP, index, {
        value: value,
        writeable: false
      });*/
    });

    this.elev = this.elevStart;
    this.plots = {};

    canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = canvas.width;
    this.ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    this.Plot = class Plot {
      constructor(parent, prop) {
        if (!prop) {
          console.error('Plot failed to initiate: missing arguments.');
          return;
        }
        let app = this,
            plotDataDefaults = {
              x: 0,
              y: 0,
              w: 1,
              h: 1,
              elev: 0,
            };

        $.each(plotDataDefaults, function (index, value) {
          app[index] = value;
          if (typeof(prop[index]) !== 'undefined') app[index] = prop[index];
        });

        for (let h=0, hl=this.h; h<hl; h++) {
          for (let w=0, wl=this.w; w<wl; w++) {
            let x = Math.ceil(this.x + w-wl/2),
                y = Math.ceil(this.y + h-hl/2),
                id = this.genId(x,y);
            parent.plots[id] = this;
          }
        }

        let scale = parent.plotSize;

        let c = Math.round(8 + 7 * (1 - this.elev / parent.elevStart)).toString(16);

        parent.ctx.fillStyle = '#'+c+c+c+c+c+c;
        parent.ctx.strokeStyle = '#000000';
        parent.ctx.fillRect(
          scale * Math.ceil(this.x - this.w / 2),
          scale * Math.ceil(this.y - this.h / 2),
          scale * this.w,
          scale * this.h
        );
        parent.ctx.strokeRect(
          scale * Math.ceil(this.x - this.w / 2),
          scale * Math.ceil(this.y - this.h / 2),
          scale * this.w,
          scale * this.h
        );
        parent.ctx.font = scale/2 + 'px Arial';
        parent.ctx.textAlign = 'center';
        parent.ctx.strokeText(
          //Math.floor(this.elev * 10) / 10,
          Math.ceil(this.elev),
          scale * (this.x + 0.5),
          scale * (this.y + 0.5 + 1/6)
        );

        /**/
        if (this.elev > 0) {
          //for (let nY=-1; nY<=1; nY++) {
          //  for (let nX=-1; nX<=1; nX++) {
          for (let i=0; i<4; i++) {
              let nX, nY;
              switch (i) {
                case 0: nX = -1; nY = 0;  break;
                case 1: nX =  0; nY = -1; break;
                case 2: nX =  1; nY = 0;  break;
                case 3: nX =  0; nY = 1;  break;
              }
              let id = this.genId(this.x + nX, this.y + nY),
                  chance = 0.5,//this.elev/parent.elevStart,//Math.pow((this.elev/parent.elevStart),parent.spread),
                  newElev = this.elev - Math.min(1, Math.random()+0.25),//(Math.random() < chance ? 1 : 0),
                  prop = {
                    elev: newElev,
                    x: this.x + nX,
                    y: this.y + nY
                  };
              if (newElev > 0) {
                if (parent.plots[id]) {
                  if (parent.plots[id].elev < this.elev) {
                    parent.plots[id] = new parent.Plot(parent, prop)
                  }
                } else {
                  new parent.Plot(parent, prop);
                }
              }
            //}
          }
        }
        /**/

        //
      }

      genId(x,y) {
        return 'X' + x + 'Y' + y;
      }
    }

    /*
    for (let methodName of Object.getOwnPropertyNames(City.prototype)) {
      if (methodName !== "constructor") {
        this[methodName] = this[methodName].bind(this);
      }
    }
    */

    this.init()
  }

  init() {
    let width = this.ctx.canvas.width,
        height = this.ctx.canvas.height,
        x = 10,// width/(2 * this.plotSize),
        y = 10;//height/(2 * this.plotSize) + 0.5;

    this.ctx.strokeStyle = '#cccccc';
    for (let h=0; h<height; h+=this.plotSize) {
      this.ctx.strokeRect(0, h, width, this.plotSize);
    }
    for (let w=0; w<width; w+=this.plotSize) {
      this.ctx.strokeRect(w, 0, this.plotSize, height);
    }

    let pnt = new this.Plot(this, {
      elev: this.elevStart,
      x: x,
      y: y
    });

    console.log(this);
    console.log(this.plots);
  }
}

$(document).ready(function() {
	new City();
});

//})();
