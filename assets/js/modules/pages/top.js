'use strict';

const THREE = require('three');

import pageBase from './pageBase.js';

const indexTop = class top extends pageBase {
	constructor(el, tmpl) {
		super(el, tmpl);
		this.model = {};
	}
	setEl(el) {
		this.$el = $(el);
		return this;
	}
	setEvent() {
		return this;
	}
	onRender() {
		let scene = new THREE.Scene();
		let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		let renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		let geometry = new THREE.CubeGeometry(1,1,1);
		let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		let cube = new THREE.Mesh( geometry, material );
		scene.add( cube );
		camera.position.z = 5;
		function render() {
			requestAnimationFrame(render);
			cube.rotation.x += 0.1;
			cube.rotation.y += 0.1;
			renderer.render(scene, camera);
		}
		render();
		return this;
	}
}
export default indexTop;