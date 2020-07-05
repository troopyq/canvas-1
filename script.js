import modal from './modal.js'

(() => {

   

    let cfg = {
        hue         : 0,
        bgFillColor : 'rgba(50, 50, 50, 0.05)',
        dirsCount   : 6,
        stepsToTurn : 15,
        dotSize     : 3,
        dotsCount   : 1000,
        dotVilocety : 2,
        distance    : 100,
        gradientLen : 4,
        chance      : 0.3,
    }

    let set = {
        hue         : 0,
        bgFillColor : 'rgba(50, 50, 50, 0.05)',
        edge        : cfg.dirsCount,
        steps       : cfg.stepsToTurn,
        size        : cfg.dotSize,
        dots        : cfg.dotsCount,
        vilocety    : cfg.dotVilocety,
        distance    : cfg.distance,
        gradient    : cfg.gradientLen,
        chance      : cfg.chance,
    }

    // localStorage.clear()

    if(localStorage.length > 0){
        
        for (let item in localStorage){
            set[item] = +localStorage[item]
        }
        console.log(localStorage)
        console.log(set)

    }







    // cfg = {
    //     hue         : 0,
    //     bgFillColor : 'rgba(50, 50, 50, 0.05)',
    //     dirsCount   : set.edge,
    //     stepsToTurn : set.steps,
    //     dotSize     : set.size,
    //     dotsCount   : set.dots,
    //     dotVilocety : set.vilocety,
    //     distance    : set.distance,
    //     gradientLen : set.gradient,
    //     chance      : set.chance,
    // }
    // setInterval(() =>{console.log(dirsList)}, 3000)

    const cnv = document.querySelector('canvas');
    const ctx = cnv.getContext('2d');

    let cw, ch, cx, cy;

    function resizeCanvas() {
         cw = cnv.width  = innerWidth;
         ch = cnv.height = innerHeight;
         cx = cw / 2;
         cy = ch / 2; 
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);



    



    function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco){
        ctx.globalCompositeOperation = gco;
        ctx.shadowColor = shadowColor || 'black';
        ctx.shadowBlur = shadowBlur   || 1;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }

    class Dot {
        constructor() {
            this.pos = {x: cx, y:cy};
            this.dir = set.edge === 6 ? (Math.random() * 3 | 0 ) * 2 : (Math.random() * set.edge | 0 );
                                           
            this.step = 0;
        }


        redrawDot() {
            let xy      = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy);
            let makeHue =  (set.hue + xy / set.gradient) % 360;
            let color   = `hsl(${ makeHue }, 100%, 50%)`;
            let blur    = set.size - Math.sin(xy / 8) * 1.5;
            let size    = set.size //- Math.sin(xy / 9) * 1.2 - Math.sin(xy / 5) ;
            let x       = this.pos.x - size / 2;
            let y       = this.pos.y - size / 2;
            

            drawRect(color, x, y, size, size, color, blur, 'lighter')
        }

        moveDot() {
            this.step++;
            this.pos.x += dirsList[this.dir].x * set.vilocety;
            this.pos.y += dirsList[this.dir].y * set.vilocety;
        }

        changeDir() {
            if (this.step % set.steps === 0) {
                this.dir = Math.random() > 0.5 ? (this.dir + 1) % set.edge 
                                               : (this.dir + set.edge - 1) % set.edge;
            }
        }

        killDot(id) {
            let percent = Math.random() * Math.exp(this.step / set.distance);
            if (percent > 100) {
                dotsList.splice(id, 1);
            }
        }
    }

    let dirsList = [];

    function createDirs() {
        for (let i = 0; i < 360; i += 360 / set.edge){
            let x = Math.cos(i * Math.PI / 180);
            let y = Math.sin(i * Math.PI / 180);
            dirsList.push({x: x, y: y});
        }
    }

    createDirs();

    let dotsList = [];

    function addDot() {
        if (dotsList.length < set.dots && Math.random() > set.chance) {
            dotsList.push(new Dot());
            set.hue = (set.hue + 1) % 360;
        }
    }

    function refreshDots() {
        dotsList.forEach( (i, id) => {
            i.moveDot();
            i.redrawDot();
            i.changeDir();
            i.killDot(id);
        })
    }

    let dot = new Dot();
    dot.redrawDot();


    function loop(){
        drawRect(cfg.bgFillColor, 0, 0, cw, ch, 0, 0, 'normal');

        addDot();
        refreshDots();

        requestAnimationFrame(loop);
    }

    loop();






    const block = document.querySelector('.block'),
    areas = document.querySelectorAll('.area'),
    inputs = document.querySelectorAll('input')


areas.forEach(area => {
  let values = area.querySelector('.values')
  let input = area.querySelector('input')
  let idInput = input.id
  input.value = set[idInput]
  values.textContent = input.value
})

inputs.forEach(input => {
  input.addEventListener('input', () => {
      let idInput = input.id
      if (idInput === 'edge'){
        restart.style.color = '#ff2234'
        restart.style.fontWeight = 'bold'
        restart.style.opacity = 0.9
      }
      set[idInput] = +input.value
      input.nextElementSibling.textContent = input.value
      dotsList = []
      localStorage.setItem(idInput, input.value)
      
  })
})


let isOpen = false

block.style.marginTop = `${-block.offsetHeight}px`

const openWind = () => {
  isOpen = true
  block.style.marginTop = '0px'
}

const closeWind = () => {
  isOpen = false
  let h = block.offsetHeight
  block.style.marginTop = `${-h}px`
}

openBtn.addEventListener('click', e => {
  e.preventDefault();

  if (!isOpen){
      openBtn.textContent = 'Close'
      openWind()
  }else {
    openBtn.textContent = 'Open'
      closeWind()
  }
})

restart.addEventListener('click', () => {
    location.reload()
})





})()