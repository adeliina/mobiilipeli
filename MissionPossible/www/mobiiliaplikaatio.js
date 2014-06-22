var hahmo;

function mobiiliapplikaatiokentta(){
	alert("Mobile app!");
    
	function Hahmo() {
        this.output = $("<img>").addClass("hahmo").attr("src", "kuvat/pallo1.png").appendTo("#mobiiliapplikaatio");
        var leveys = this.output.width();
        var korkeus = this.output.height();
		this.position = new Piste((world.x2/2 - (leveys/2)),(world.y2/2 - (korkeus/2)));
        this.velocity = new Vector(0, 0);
        var that = this;
        this.tormays = null;
		$(window).on("touchstart mousedown", function(event) {
                event.preventDefault();
                that.velocity.dy = -world.y2/75;
        });
    }
    
    Hahmo.prototype = {
        
    remove: function() {
        $(this.output).off("touchstart");
        this.output.remove();
        lopetamobiili();
    },
    	
    move: function() {
        // apply gravity
        this.velocity = this.velocity.add(GRAVITY.scale(0.1));
		
        // collision detection against world
        if (this.position.y > world.y2) {
            this.remove();
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
    
    function Vaara() {
        this.vaaratyyppi = Math.floor(Math.random()*2 + 1);
        this.output = $("<img>").addClass("vaara").attr("src", "kuvat/vaara"+this.vaaratyyppi+".png").appendTo("#mobiiliapplikaatio");
        var h = this.output.height();
        if (this.vaaratyyppi == 1) {
                this.position = new Piste(world.x2,world.y1);
        }
        if (this.vaaratyyppi == 2)  {
            this.position = new Piste(world.x2,(world.y2 - h));
        }
        this.velocity;
        this.startPoint;
    }
    Vaara.prototype = {
        
    remove: function() {
        this.output.remove();
        vaarat.splice($.inArray(this, vaarat),1);
    },
    	
    move: function() {
		
        // collision detection against world
        if (this.position.x < world.x1) {
            this.remove();
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

    var palloliike;
    var tormaystarkistus;
    
	function luoHahmo() {
 		hahmo = new Hahmo();
        
        //hahmo.tormays = setInterval(tarkista_vaaratormays, 20);
        tormaystarkistus = setInterval(tarkista_vaaratormays, 20);
        palloliike = setInterval(function() {
                    hahmo.move();
                  }, 25);
    }
    function stopPalloliike() {
        clearInterval(palloliike);
    }
    function stopTormaystarkistus() {
        clearInterval(tormaystarkistus);
    }
    
    var vaarat = [];
	
	var aikavali = Math.floor((Math.random() * 4000) + 1000)
	var uudetVaarat = setInterval(uusiVaara, aikavali);
	var maxVaarat = 3;
    
	function uusiVaara() {
		if (vaarat.length >= maxVaarat) {return;}
 		var vaara = new Vaara();
        var velocityY = 0;
		var velocityX = -2;
 		vaara.velocity = new Vector(Math.floor(velocityX), Math.floor(velocityY));
        vaara.move();
        vaarat.push(vaara);
        
        $(function() {
          setInterval(function() {
                      vaara.move();
                      }, 25);
          });

	}
    
	function stopuudetVaarat() {
		clearInterval(uudetVaarat);
	}

    
    luoHahmo();
     
    function tarkista_vaaratormays() {
        for (var i=0; i<vaarat.length; i++) {
            if (tarkista_tormays_vaara(i)) {
                hahmo.remove();
            }
        }
    }
    
    function tarkista_tormays_vaara(indeksi) {
        var vaara = vaarat[indeksi];
        var vaara_vasen = vaara.output.offset().left;
        var vaara_yla   = vaara.output.offset().top;
        var vaara_ala   = vaara_yla + vaara.output.height();
        var vaara_oikea = vaara_vasen + vaara.output.width();
        
        var hahmo_yla   = hahmo.output.offset().top;
        var hahmo_vasen = hahmo.output.offset().left;
        var hahmo_ala   = hahmo_yla + hahmo.output.height();
        var hahmo_oikea = hahmo_vasen + hahmo.output.width();
        
        if (vaara_oikea < hahmo_vasen) return false;
        if (hahmo_oikea < vaara_vasen) return false;
        if (vaara_ala < hahmo_yla) return false;
        if (hahmo_ala < vaara_yla) return false;
        return true;
    }
    
    function lopetamobiili() {
        delete hahmo.position;
        delete hahmo.output;
        stopPalloliike();
        stopTormaystarkistus();
        vaarat.forEach(function(vaara) {
                       vaara.remove();
                       vaara.output.remove();
                       });
        seuraavakentta(currentKentta);
    }
    
}


// Preload image into memory
function preloadImage(url) {
    var img = new Image();
    img.src = url;
}