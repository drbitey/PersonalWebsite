//js refs
import {square, doubleSquare, cube, pyramid} from './models.js';
import {Camera} from './camera.js';
import {createMesh} from './mesh.js';
import {createWireframeRenderer} from './render.js';
import {randomHex} from './colorconvert.js';

//html refs
const canvas = document.querySelector('canvas');
var x = document.getElementById("xrot");
var y = document.getElementById("yrot");
var wfcol = document.getElementById("wfcol");

var outx = document.getElementById("testx");
var outy = document.getElementById("testy");

const mesh1 = createMesh(cube);
mesh1.color = '#81ff02'; //temp
/*const mesh2 = createMesh(pyramid);
mesh2.color = '#ff02f0';
const mesh3 = createMesh(cube);
mesh3.color = '#ff026d';*/

//separate meshes to be fixed up later, not important now

const scene = [mesh1, /*mesh2, mesh3*/]; //^^

const camera = new Camera();
camera.pos.z = 200;
camera.zoom = 12;

const render = createWireframeRenderer(canvas);

//init stuff, not really necessary to be in a function but nice housekeeping

function init() {
	//set rot value
	mesh1.rotation.x = 0;
	mesh1.rotation.y = 0;
	outx.innerHTML = x.value;
	outy.innerHTML = y.value;
	
	//random hex for wf col, from hsv for better value control
	wfcolINIT = randomHex((math.floor(360 * math.Random())) 100% 100%);
	mesh1.color = wfcolINIT;
	wfcol.value = wfcolINIT;
	
	render(scene, camera);
}

init()

//init end
/*
function animate(time) {

    mesh1.position.x = Math.sin(time / 1000) * 100;
    mesh1.position.z = Math.sin(time / 1200) * 100;
    mesh1.rotation.x += 0.01;
    mesh1.rotation.y += 0.01;
	
    mesh2.position.x = Math.sin(time / 500) * 75;
    mesh2.position.z = Math.sin(time / 2000) * 120;
    mesh2.rotation.x -= 0.01;
    mesh2.rotation.y -= 0.01;

    mesh3.position.x = Math.sin(time / 500) * 100;
    mesh3.position.y = Math.cos(time / 500) * 100;
    mesh3.rotation.y -= 0.005;
	
	
	
    render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
*/

//input responses
x.oninput = function() {
	mesh1.rotation.x = this.value / 50 * (147/180) * (385/360);
	outx.innerHTML = x.value;
	
	render(scene, camera);
}
y.oninput = function() {
	mesh1.rotation.y = this.value / 50 * (147/180) * (385/360);
	outy.innerHTML = y.value;
	
	render(scene, camera);
}
wfcol.oninput = function() {
	mesh1.color = this.value;
	
	render(scene, camera);
}