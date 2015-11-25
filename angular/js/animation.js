var animation =  function(id){
	var e = document.getElementById(id);
	var time = 10;
	var pixels = 10;
	return{
		slideUp : function(){
        	var height = e.offsetHeight;
    		this.move(e,1,time);
    		visibleStatus = 0;
		},
		slideDown : function(){
			this.move(e,2,time);
			visibleStatus = 1;
		},
        move : function(e,move,time){
        	var height = move === 1 ? e.offsetHeight : this.getHeight(e);
        	var tmpHeight = 0;
        	var elementStyle = e.style;
        	elementStyle.height = move === 2 ? 0 : e.offsetHeight ; 
        	var loop = setInterval(function(){
        		e.style.overflow = "hidden";
        		e.style.height = tmpHeight + "px";
        		if(move === 1){//slide up
        			height = height - pixels;
        			elementStyle.height = height + "px";
        			if(height === 0 || height < 0){
    					elementStyle.display = "none";
	    				elementStyle.height = "";
	    				elementStyle.overflow = "";
	        			clearInterval(loop);
	        		}
				}
				else if(move === 2){//slide up
					elementStyle.display = "";
					elementStyle.display = "block";
        			tmpHeight = tmpHeight + pixels ;
        			if(tmpHeight === height || tmpHeight > height){
        				elementStyle.display = "block";
        				elementStyle.height = "";
	    				elementStyle.overflow = "";
        				clearInterval(loop);
        			}
				}
        		
    		}, time);
        },
        getHeight : function(e){
        	var height = 0;
        	var elementStyle = e.style;
        	var position = elementStyle.position;
        	var visibility = elementStyle.visibility;
    		var left = e.style.left;
        	elementStyle.position = "absolute";
        	elementStyle.left = "-9999px" 
        	elementStyle.visibility="hidden"
        	elementStyle.display = "block";
        	height = e.offsetHeight;
        	elementStyle.left = left;
    		e.style.display = "none";
			elementStyle.position = position;
			elementStyle.visibility = visibility;
            return height;
        },
        isVisible : function(){
        	if(e.offsetHeight > 0){
        		return 1;
        	}
        	return 0;
        },
	}
}