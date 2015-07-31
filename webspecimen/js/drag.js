var words = project.importSVG(document.getElementById('avara'));
words.visible = true; // Turn off the effect of display:none;
// Resize the words to fit snugly inside the view:
words.fitBounds(view.bounds);
words.scale(0.8);

// Select the path, so we can see its handles:
words.fullySelected = true;

var values = {
	paths: 50,
	minPoints: 1,
	maxPoints: 15,
	minRadius: 0,
	maxRadius: 0
};

var hitOptions = {
	segments: true,
	stroke: true,
	fill: true,
	tolerance: 20
   };

var segment, path;
var movePath = true;
function onMouseDown(event) {
	segment = path = null;
	var hitResult = project.hitTest(event.point, hitOptions);
	if (!hitResult)
		return;

	if (event.modifiers.shift) {
		if (hitResult.type == 'segment') {
			hitResult.segment.remove();
		};
		return;
	}

	if (hitResult) {
		path = hitResult.item;
		if (hitResult.type == 'segment') {
			segment = hitResult.segment;
		} else if (hitResult.type == 'stroke') {
			var location = hitResult.location;
			segment = path.insert(location.index + 1, event.point);
			//path.smooth();
		}
	}
	movePath = hitResult.type == 'fill';
	if (movePath)
		project.activeLayer.addChild(hitResult.item);
}

function onMouseMove(event) {
	project.activeLayer.selected = false;
	if (event.item)
		event.item.selected = true;
}

function onMouseDrag(event) {
	if (segment) {
		segment.point += event.delta;
		//path.smooth();
	} else if (path) {
		path.position += event.delta;
	}
}
