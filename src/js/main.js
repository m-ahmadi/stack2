require.config({
	baseUrl: "js/",
	paths: {
		lib: "../lib"
	}
});

import page from "./mediator";

alert(1);

page.beforeReady();

$(function () {
	
	page.onReady();
	
});