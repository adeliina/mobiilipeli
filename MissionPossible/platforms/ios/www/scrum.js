function scrumkentta() {
	alert("Scrum!");
    var ball_no = 0;
	
	function Ball() {
    this.id = "b_" + ball_no;
    this.position = new Piste(0,0);
    this.velocity;
    this.pallotyyppi = Math.floor(Math.random()*5 + 1);
    this.output = $("<img>").addClass("pallo pallo"+this.pallotyyppi).attr("id", this.id).attr("src", "kuvat/pallo"+this.pallotyyppi+".png").appendTo("#scrum");
    this.dragging = false;
    this.korisallittu = false;
    this.startPoint;
    var that = this;
    ball_no++;
    $(this.output).on("touchstart mousedown", function(event) {
                      var ev = event.originalEvent;
                      that.dragging = true;
                      that.startPoint = new Piste(ev.pageX-that.output.offset().left, ev.pageY-that.output.offset().top);
                      that.velocity.dx = 0;
                      that.velocity.dy = 0;
                      that.korisallittu = false;
                      event.preventDefault();
                      });
}
    Ball.prototype = {
        
    remove: function() {
        $(this.output).off("touchstart");
        this.output.remove();
        balls.splice($.inArray(this, balls),1);
    },
    	
    move: function() {
        if (this.dragging) {return;}
        // apply gravity
        this.velocity = this.velocity.add(GRAVITY.scale(0.1));
		
        // collision detection against world
        if (this.position.y > (world.y2 + 20)) {
            this.remove();
            this.output.remove();
            lopetascrum();
        }
        
        // onko pallo sisällä?
        if (this.korisallittu) {
            var px1 = this.position.x;
            var py1 = this.position.y;
            var px2 = this.position.x + this.output.width();
            var py2 = this.position.y + this.output.height() - this.velocity.dy;
            var kx1 = $("#kori" + this.pallotyyppi).offset().left;
            var ky1 = $("#kori" + this.pallotyyppi).offset().top;
            var kx2 = $("#kori" + this.pallotyyppi).offset().left + $("#kori" + this.pallotyyppi).width();
            var ky2 = $("#kori" + this.pallotyyppi).offset().top + $("#kori" + this.pallotyyppi).height();
            if (px1 > kx1 && py1 > ky1 && px2 < kx2 && py2 < ky2) {
                alert("Oikeessa korissa!");
            }
        }
		
        // update position
        this.position.x += this.velocity.dx;
        this.position.y += this.velocity.dy;
		
        // render
        this.output.css({
                        left: this.position.x,
                        top: this.position.y
                        });
    }
	};
	
	var balls = [];
	console.log(balls);
	
	var aikavali = Math.floor((Math.random() * 500) + 1000)
	var uudetPallot = setInterval(uusiPallo, aikavali);
	var maxPallot = 3;
    
	function uusiPallo() {
		if (balls.length >= maxPallot) {return;}
		var start;
 		var ball = new Ball();
		var w = ball.output.width();
		var start;
		start = new Piste(Math.floor((Math.random() + 0.5) * world.x2/2 - w/2), world.y2);
		var end = new Piste(start.x + (Math.random() - 0.5)*50, world.y2 - Math.floor(Math.sqrt((Math.random()+1)*world.y2*GRAVITY.scale(0.1).dy)));
        ball.position = start;
		var l = $("#kori1").offset().left + $("#kori1").width();
        var velocityY = -Math.sqrt((Math.random()+1)*world.y2*GRAVITY.scale(0.1).dy);
		var velocityX = -GRAVITY.scale(0.1).dy*((world.x2-2*l-w)*Math.random()+l-start.x)/(2*velocityY);
 		ball.velocity = new Vector(Math.floor(velocityX), Math.floor(velocityY));
        ball.move();
        balls.push(ball);
	}
    
	function stopuudetPallot() {
		clearInterval(uudetPallot);
	}
    
	$(function() {
      // animation loop
      setInterval(function() {
                  balls.forEach(function(ball) {
                                ball.move();
                                });
                  }, 25);
      
      // clear on escape
      $(document).keyup(function(event) {
                        if (event.keyCode === 27) {
                        balls.forEach(function(ball) {
                                      ball.remove();
                                      });
                        balls.splice(0, balls.length);
                        }
                        });
      
      $(window).on("touchend mouseup", function(event) {
                   var ev = event.originalEvent;
                   for (var i = 0; i < ev.changedTouches.length; i++) {
                   var id = $(ev.changedTouches[i].target).attr("id");
                   var that;
                   for (var j = 0 ; j < balls.length; j++) {
                   if (id == balls[j].id) { that = balls[j]; break; }
                   }
                   if (!that.dragging) {return;}
                   that.dragging = false;
                   that.move();
                   var px1 = that.position.x;
                   var py1 = that.position.y;
                   var px2 = that.position.x + that.output.width();
                   var py2 = that.position.y + that.output.height();
                   var elem = $("#kori" + that.pallotyyppi);
                   var kx1 = elem.offset().left;
                   var ky1 = elem.offset().top - elem.height();
                   var kx2 = elem.offset().left + elem.width();
                   var ky2 = elem.offset().top + elem.height();
                   if (px1 > kx1 && py1 > ky1 && px2 < kx2 && py2 < ky2) {
                   that.korisallittu = true;
                   }
                   }
                   event.preventDefault();
                   });
      
      $(window).on("touchmove mousemove", function(event) {
                   var ev = event.originalEvent;
                   for (var i=0; i < ev.targetTouches.length; i++) {
                   var id = $(ev.targetTouches[i].target).attr("id");
                   str += " " + ev.targetTouches[i].identifier;
                   var that;
                   for (var j = 0 ; j < balls.length; j++) {
                   if (id == balls[j].id) { that = balls[j]; break; }
                   }
                   
                   if (!that.dragging) {continue;}
                   // update position
                   that.position.x = ev.targetTouches[i].pageX - that.startPoint.x;
                   that.position.y = ev.targetTouches[i].pageY - that.startPoint.y;
                   
                   // render
                   that.output.css({
                                   left : that.position.x,
                                   top  : that.position.y
                                   });
                   }
                   event.preventDefault();
                   });
      });
	
    function lopetascrum() {
        balls.forEach(function(ball) {
                      ball.remove();
        });
        stopuudetPallot();
        seuraavakentta(currentKentta);
    }

	function luoKentta() {
		for (var i=1; i<5; i++) {
			$("<img id='kori"+i+"'>").addClass("korit").attr("src", "kuvat/kansio.png").appendTo("#scrum");
		}
	}
	luoKentta();
}