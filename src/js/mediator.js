const inst = u.extend( newPubSub() );
	
function addCustomEvts() {
	
}
function beforeReady() {
	alert(2);
}
function onReady() {
	alert(4);
	addCustomEvts();
}

inst.beforeReady = beforeReady;
inst.onReady = onReady;

export default inst;