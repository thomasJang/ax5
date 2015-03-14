(function(){
	prettyPrint();

	var util = ax5.util, dom = ax5.dom;
	var po = [], prev_tag, item_name;

	util.each(dom("[data-menu-item]").elements, function() {
		if(this.tagName == "H1" && po.length > 0){
			if(prev_tag == "H2" || prev_tag == "H3") po.push("</ul>");
			po.push("</ul>");
		}
		if(this.tagName == "H1") {
			po.push("<ul>");
		}
		if((this.tagName == "H2" || this.tagName == "H3") && prev_tag == "H1") {
			po.push("<ul>");
		}
		
		item_name = dom(this).attr("data-menu-item");
		dom(this).before("<div style='position:relative;left:0px;top:-75px;' id='"+ item_name +"'></div>");
		po.push('<li><a href="#' + item_name + '">' + this.innerHTML + '</a></li>');
		prev_tag = this.tagName;
	});
	po.push("</ul>");
	dom("#app-nav-left").html(po.join(''));

})();

ax5.dom.scroll(function() {
	if (!window.app_visual) window.app_visual = ax5.dom.get("#app-visual");
	if (!window.app_nav_left) window.app_nav_left = ax5.dom.get("#app-nav-left")
	var stop = ax5.dom.scroll().top;
	if(stop >= 220){
		ax5.dom.class_name(app_visual, "add", "pinned")
		ax5.dom.class_name(app_visual, "add", "scrolled");
		//ax5.dom.class_name(app_nav_left, "add", "pinned");
		ax5.dom.css(app_nav_left, {top:stop - 220});
	}
	else
	if (stop < 60) {
		ax5.dom.class_name(app_visual, "remove", "scrolled");
		ax5.dom.class_name(app_visual, "remove", "pinned");
		ax5.dom.css(app_nav_left, {top:0});
	}
	else
	{
		ax5.dom.class_name(app_visual, "add", "scrolled");
		ax5.dom.class_name(app_visual, "remove", "pinned");
		ax5.dom.css(app_nav_left, {top:0});
	}
});
