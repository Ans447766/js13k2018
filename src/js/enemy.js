function Enemy(x,y, health, size=8, color=0) {
    this.colors=[18,5,27,19];
    this.color = colors[color];
    this.x = x;
    this.y = y;
    this.oldX = 0;
    this.oldY = 0;
    this.width = size;
    this.height = size;
    this.startHealth = health;
    this.health = health;
    this.hit = false;
    this.facingLeft = true;
    this.following = false;
    this.biting = false;
    this.draw = function(){
        this.oldX = this.x;
        this.oldY = this.y;
        let sx = this.x - viewX;
        let sy = this.y - viewY;
        let ymod = t%30 > 15;
        if(inView(sx,sy,24)){
            // fillCircle(sx+8,sy,8,22,22);
            // circle(sx,sy,8,17,17);
            // circle(sx,sy,2,0,0);
            fillRect(sx,sy-ymod,sx+this.width,sy+this.height,0,0);
            rect(sx,sy-ymod,sx+this.width,sy+this.height,this.color,this.color);
            //fillRect(sx+3,sy+3,sx+6,sy+4,22,22);
            if(this.following){
                //fillRect(sx+4,sy+7,sx+11,sy+11,22,22);
                //setColors(17,17);
                //pset(sx+6,sy+7);pset(sx+12,sy+7);
            }
            if(this.biting){
                //rect(sx,sy-ymod,sx+this.width,sy+this.height,5,5);
            }
            if(this.health < this.startHealth ){
                //draw a health bar, but only after initial damage
                setColors(12,12);
                rect(sx, sy-3, sx+this.health, sy-2)
            }
            if(this.health < 0){
                this.kill();
            }
        }
    }
    this.update = function(){
        let sx = this.x - viewX,
            sy = this.y - viewY;
        this.following = false;
        this.biting = false;
        let tick = t%30 < 10;
        if(inView(sx, sy,24)){
            this.x += random() > .5 ? tick:-tick;
            this.y += random() > .5 ? tick:-tick;
            let xdelta = player.x-this.x, ydelta = player.y-this.y,
                distance = sqrt((ydelta*ydelta+xdelta*xdelta)),
                angle = atan2(ydelta, xdelta);
            if(distance < 100){
                this.following = true;
                this.x += cos(angle)*10/this.width;
                this.y += sin(angle)*10/this.width;;
            }
            if(rectCollision(this, player)){
                player.hit = true;
                this.biting = true;
            }
            if(this.hit){
                this.health-=2; //temp
                score += 5;
                this.hit = false;
            }
            if(getGID(this.x,this.y) == 1 ||
               getGID(this.x+this.width, this.y) == 1 ||
               getGID(this.x+this.width, this.y+this.height) == 1 ||
               getGID(this.x, this.y+this.height) == 1
            ){
                this.x = this.oldX;
                this.y = this.oldY;
            } 
        }   
    } //end update

    this.kill = function(){
        //splode play
        let sx = this.x - viewX, sy = this.y - viewY,
        sndMod = this.width.map(0,32,1.7,0);
        playSound(sounds.sndSplode1, 1+sndMod, 0, 0.7, false);
        fillCircle(sx+this.width/2, sy+this.width/2, this.width*2, 22, 22);
        for(let i = 0; i < 40; i++){
            particles.push(new Particle(this.x,this.y, 22, random()*3-1.5, random()*3-1.5));
          }
        console.log('dropping battery');
        batteries.push(new Battery(this.x+this.width/2, this.y+this.width+2));
        score += 100*this.width;
        enemies.splice( enemies.indexOf(this), 1 );

    }
}  //end enemy