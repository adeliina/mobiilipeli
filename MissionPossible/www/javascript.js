var currentKentta = 0;
var kentat = ["ohjelmointi", "tietokanta", "tietoturva", "verkkokauppa", "mobiiliapplikaatio", "scrum"];
var pisteet = [];
for (var i=0;i<kentat.length;i++) {
	pisteet[kentat[i]] = -1;
}

function Piste(x, y) {
	this.x = x;
	this.y = y;
}

Piste.prototype = {
relative: function(to) {
    return new Vector(to.x - this.x, to.y - this.y);
},
distance: function(to) {
    return Math.sqrt(Math.pow(this.x - to.x, 2) + Math.pow(this.y - to.y, 2));
}
};

function Vector(dx, dy) {
	this.dx = dx;
	this.dy = dy;
}

Vector.prototype = {
add: function(other) {
    return new Vector(this.dx + other.dx, this.dy + other.dy);
},
scale: function(by) {
    return new Vector(this.dx * by, this.dy * by);
},
normalize: function() {
    function norm(value) {
        return value > 0 ? 1 : value < 0 ? -1 : 0;
    }
    return new Vector(norm(this.dx), norm(this.dy));
}
};

var GRAVITY = new Vector(0, 9.81);
var FRICTION = 0.85;
var world = {
x1: 0,
y1: 0
};

$(window).resize(function() {
                 world.x2 = $(window).width();
                 world.y2 = $(window).height();
                 }).trigger("resize");


$(document).ready(function() {
	kentat = arvo(kentat);
	console.log(kentat);

	$('#starttinappi').click(function(){ 
		siirry(kentat[currentKentta]);	
		$("#" + kentat[0]).show();
		currentKentta++;
		$("#starttinappi").hide();		
	});
		
	$('.kentta input').click(function(){
        seuraavakentta(currentKentta);
    });
});	

function siirry(kentta) {
	alusta(kentta);
}

function seuraavakentta(kentta) {
    $(".kentta").hide();
    if (currentKentta == kentat.length ) {
        $('#loppukentta').show();
    }else {
        siirry(kentat[currentKentta]);
        $("#" + kentat[currentKentta]).show();
        currentKentta++;
    }
    
	
}

function arvo(lista) {
    for (var i = lista.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = lista[i];
        lista[i] = lista[j];
        lista[j] = temp;
    }
  return lista;
}

function alusta(kentta) {
	if (kentta == "ohjelmointi") {
		ohjelmointikentta();
	}
	if (kentta == "scrum") {
//	window.addEventListener("touchstart", function(ev){
//		console.log(ev.touches);
//    });
//    window.addEventListener("touchend", function(ed){
//        console.log(ed.touches);
//    });
//    window.addEventListener("touchmove", function(et){
//        console.log(et.touches);
//});
        
		scrumkentta();
	}
	if (kentta == "tietokanta") {
		tietokantakentta();	
	}
	if (kentta == "tietoturva") {
		tietoturvakentta();	
	}
	if (kentta == "verkkokauppa") {
		verkkokauppakentta();	
	}	
	if (kentta == "mobiiliapplikaatio") {
		mobiiliapplikaatiokentta();	
	}				
	
}

