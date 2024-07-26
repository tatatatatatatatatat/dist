/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/loaders/OBJLoader */ "./node_modules/three/examples/jsm/loaders/OBJLoader.js");



class ShootingGame {
    scene;
    camera;
    renderer;
    controls;
    clock;
    character;
    bullets = [];
    enemies = [];
    enemySpawnInterval = 2;
    lastEnemySpawnTime = 0;
    moveForward = false;
    moveBackward = false;
    moveLeft = false;
    moveRight = false;
    shoot = false;
    constructor() {
        this.initScene();
        this.initRenderer();
        this.initCamera();
        this.initControls();
        this.initLight();
        this.loadCharacter();
        this.addGround();
        this.addInstructions();
        this.animate();
    }
    initScene() {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        this.scene.background = new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x87ceeb); // 空の色を青色に設定
        this.clock = new three__WEBPACK_IMPORTED_MODULE_2__.Clock();
    }
    initRenderer() {
        this.renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);
    }
    initCamera() {
        this.camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 20, 0); // 上からの視点
        this.camera.lookAt(0, 0, 0); // 地面を見下ろす
    }
    initControls() {
        this.controls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }
    initLight() {
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_2__.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        const directionalLight = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        this.scene.add(directionalLight);
    }
    loadCharacter() {
        const loader = new three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_1__.OBJLoader();
        loader.load('マイクラ.obj', (obj) => {
            console.log('Character model loaded successfully');
            this.character = obj;
            this.character.position.set(0, 0, 0); // キャラクターの位置を調整
            this.character.rotation.y = Math.PI; // キャラクターをY軸で180度回転
            this.scene.add(this.character);
        }, undefined, (error) => {
            console.error('An error occurred while loading the character model:', error);
        });
    }
    addGround() {
        const groundGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.PlaneGeometry(50, 50);
        const groundMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({ color: 0x00ff00 }); // 緑色に設定
        const groundMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);
    }
    addInstructions() {
        const instructions = [
            { text: 'W', position: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 19, 0) },
            { text: 'A', position: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-1, 19, -1) },
            { text: 'S', position: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 19, -1) },
            { text: 'D', position: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 19, -1) },
            { text: 'Space', position: new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 19, -2) }
        ];
        const loader = new three__WEBPACK_IMPORTED_MODULE_2__.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            instructions.forEach(instruction => {
                const textGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.TextGeometry(instruction.text, {
                    font: font,
                    size: 0.5,
                    height: 0.1
                });
                const textMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshBasicMaterial({ color: 0xffffff });
                const textMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(textGeometry, textMaterial);
                textMesh.position.copy(instruction.position);
                textMesh.rotation.x = -Math.PI / 2; // テキストを上から見た時に正しく表示するために回転
                this.scene.add(textMesh);
            });
        });
    }
    spawnEnemy() {
        const loader = new three_examples_jsm_loaders_OBJLoader__WEBPACK_IMPORTED_MODULE_1__.OBJLoader();
        loader.load('マイクラ.obj', (obj) => {
            const enemy = obj.clone(); // クローンして新しい敵を作成
            enemy.position.set(Math.random() * 40 - 20, 0, -30); // 敵の位置を調整
            this.scene.add(enemy);
            this.enemies.push(enemy);
        }, undefined, (error) => {
            console.error('An error occurred while loading the enemy model:', error);
        });
    }
    animate = () => {
        requestAnimationFrame(this.animate);
        const delta = this.clock.getDelta();
        this.updateCharacter(delta);
        this.updateBullets(delta);
        this.updateEnemies(delta);
        const currentTime = this.clock.getElapsedTime();
        if (currentTime - this.lastEnemySpawnTime > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawnTime = currentTime;
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    };
    updateCharacter(delta) {
        const speed = 5;
        if (this.moveForward && this.character)
            this.character.position.z -= speed * delta;
        if (this.moveBackward && this.character)
            this.character.position.z += speed * delta;
        if (this.moveLeft && this.character)
            this.character.position.x -= speed * delta;
        if (this.moveRight && this.character)
            this.character.position.x += speed * delta;
        if (this.shoot)
            this.fireBullet();
    }
    updateBullets(delta) {
        const bulletSpeed = 10;
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].position.z -= bulletSpeed * delta;
            if (this.bullets[i].position.z < -50) {
                this.scene.remove(this.bullets[i]);
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }
    updateEnemies(delta) {
        const enemySpeed = 2;
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].position.z += enemySpeed * delta;
            if (this.enemies[i].position.z > 10) {
                this.scene.remove(this.enemies[i]);
                this.enemies.splice(i, 1);
                i--;
            }
            for (let j = 0; j < this.bullets.length; j++) {
                const enemyBox = new three__WEBPACK_IMPORTED_MODULE_2__.Box3().setFromObject(this.enemies[i]);
                const bulletBox = new three__WEBPACK_IMPORTED_MODULE_2__.Box3().setFromObject(this.bullets[j]);
                if (enemyBox.intersectsBox(bulletBox)) {
                    this.scene.remove(this.enemies[i]);
                    this.enemies.splice(i, 1);
                    this.scene.remove(this.bullets[j]);
                    this.bullets.splice(j, 1);
                    i--;
                    break;
                }
            }
        }
    }
    fireBullet() {
        const bulletGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(0.1, 8, 8);
        const bulletMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({ color: 0x000000 }); // 弾の色を黒に設定
        const bullet = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(bulletGeometry, bulletMaterial);
        if (this.character) {
            bullet.position.set(this.character.position.x, this.character.position.y + 1, this.character.position.z - 1);
            this.scene.add(bullet);
            this.bullets.push(bullet);
            this.shoot = false;
        }
    }
    handleKeyDown = (event) => {
        switch (event.key) {
            case 'w':
                this.moveForward = true;
                break;
            case 's':
                this.moveBackward = true;
                break;
            case 'a':
                this.moveLeft = true;
                break;
            case 'd':
                this.moveRight = true;
                break;
            case ' ':
                this.shoot = true;
                break;
        }
    };
    handleKeyUp = (event) => {
        switch (event.key) {
            case 'w':
                this.moveForward = false;
                break;
            case 's':
                this.moveBackward = false;
                break;
            case 'a':
                this.moveLeft = false;
                break;
            case 'd':
                this.moveRight = false;
                break;
            case ' ':
                this.shoot = false;
                break;
        }
    };
}
window.addEventListener('DOMContentLoaded', () => {
    const game = new ShootingGame();
    window.addEventListener('keydown', game.handleKeyDown);
    window.addEventListener('keyup', game.handleKeyUp);
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js-node_modules_three_examples-763b6d"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZELENBQUMsQ0FBQyxDQUFDOzs7Ozs7O1VDNVBIO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSwrQkFBK0Isd0NBQXdDO1dBQ3ZFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0Esa0JBQWtCLHFCQUFxQjtXQUN2QztXQUNBO1dBQ0EsS0FBSztXQUNMO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0MzQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nLy4vc3JjL2FwcC50cyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFRIUkVFIGZyb20gJ3RocmVlJztcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9scyc7XG5pbXBvcnQgeyBPQkpMb2FkZXIgfSBmcm9tICd0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9PQkpMb2FkZXInO1xuXG5jbGFzcyBTaG9vdGluZ0dhbWUge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgY2FtZXJhOiBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYTtcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBUSFJFRS5XZWJHTFJlbmRlcmVyO1xuICAgIHByaXZhdGUgY29udHJvbHM6IE9yYml0Q29udHJvbHM7XG4gICAgcHJpdmF0ZSBjbG9jazogVEhSRUUuQ2xvY2s7XG4gICAgcHJpdmF0ZSBjaGFyYWN0ZXI6IFRIUkVFLk9iamVjdDNEIHwgdW5kZWZpbmVkO1xuICAgIHByaXZhdGUgYnVsbGV0czogVEhSRUUuTWVzaFtdID0gW107XG4gICAgcHJpdmF0ZSBlbmVtaWVzOiBUSFJFRS5PYmplY3QzRFtdID0gW107XG4gICAgcHJpdmF0ZSBlbmVteVNwYXduSW50ZXJ2YWw6IG51bWJlciA9IDI7XG4gICAgcHJpdmF0ZSBsYXN0RW5lbXlTcGF3blRpbWU6IG51bWJlciA9IDA7XG5cbiAgICBwcml2YXRlIG1vdmVGb3J3YXJkID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBtb3ZlQmFja3dhcmQgPSBmYWxzZTtcbiAgICBwcml2YXRlIG1vdmVMZWZ0ID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBtb3ZlUmlnaHQgPSBmYWxzZTtcbiAgICBwcml2YXRlIHNob290ID0gZmFsc2U7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0U2NlbmUoKTtcbiAgICAgICAgdGhpcy5pbml0UmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5pbml0Q2FtZXJhKCk7XG4gICAgICAgIHRoaXMuaW5pdENvbnRyb2xzKCk7XG4gICAgICAgIHRoaXMuaW5pdExpZ2h0KCk7XG4gICAgICAgIHRoaXMubG9hZENoYXJhY3RlcigpO1xuICAgICAgICB0aGlzLmFkZEdyb3VuZCgpO1xuICAgICAgICB0aGlzLmFkZEluc3RydWN0aW9ucygpO1xuICAgICAgICB0aGlzLmFuaW1hdGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRTY2VuZSgpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgICAgICB0aGlzLnNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoMHg4N2NlZWIpOyAvLyDnqbrjga7oibLjgpLpnZLoibLjgavoqK3lrppcbiAgICAgICAgdGhpcy5jbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdFJlbmRlcmVyKCkge1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoeyBhbnRpYWxpYXM6IHRydWUgfSk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdENhbWVyYSgpIHtcbiAgICAgICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMDApO1xuICAgICAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMjAsIDApOyAvLyDkuIrjgYvjgonjga7oppbngrlcbiAgICAgICAgdGhpcy5jYW1lcmEubG9va0F0KDAsIDAsIDApOyAvLyDlnLDpnaLjgpLopovkuIvjgo3jgZlcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRDb250cm9scygpIHtcbiAgICAgICAgdGhpcy5jb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKHRoaXMuY2FtZXJhLCB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgICAgICB0aGlzLmNvbnRyb2xzLnRhcmdldC5zZXQoMCwgMCwgMCk7XG4gICAgICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0TGlnaHQoKSB7XG4gICAgICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHg0MDQwNDApO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbmFsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZiwgMSk7XG4gICAgICAgIGRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KDUsIDEwLCA3LjUpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRDaGFyYWN0ZXIoKSB7XG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBPQkpMb2FkZXIoKTtcbiAgICAgICAgbG9hZGVyLmxvYWQoJ+ODnuOCpOOCr+ODqS5vYmonLCAob2JqKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQ2hhcmFjdGVyIG1vZGVsIGxvYWRlZCBzdWNjZXNzZnVsbHknKTtcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyID0gb2JqO1xuICAgICAgICAgICAgdGhpcy5jaGFyYWN0ZXIucG9zaXRpb24uc2V0KDAsIDAsIDApOyAvLyDjgq3jg6Pjg6njgq/jgr/jg7zjga7kvY3nva7jgpLoqr/mlbRcbiAgICAgICAgICAgIHRoaXMuY2hhcmFjdGVyLnJvdGF0aW9uLnkgPSBNYXRoLlBJOyAvLyDjgq3jg6Pjg6njgq/jgr/jg7zjgpJZ6Lu444GnMTgw5bqm5Zue6LuiXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNoYXJhY3Rlcik7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgKGVycm9yKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBsb2FkaW5nIHRoZSBjaGFyYWN0ZXIgbW9kZWw6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZEdyb3VuZCgpIHtcbiAgICAgICAgY29uc3QgZ3JvdW5kR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSg1MCwgNTApO1xuICAgICAgICBjb25zdCBncm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweDAwZmYwMCB9KTsgLy8g57eR6Imy44Gr6Kit5a6aXG4gICAgICAgIGNvbnN0IGdyb3VuZE1lc2ggPSBuZXcgVEhSRUUuTWVzaChncm91bmRHZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgICBncm91bmRNZXNoLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICAgIGdyb3VuZE1lc2gucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGdyb3VuZE1lc2gpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYWRkSW5zdHJ1Y3Rpb25zKCkge1xuICAgICAgICBjb25zdCBpbnN0cnVjdGlvbnMgPSBbXG4gICAgICAgICAgICB7IHRleHQ6ICdXJywgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDE5LCAwKSB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnQScsIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygtMSwgMTksIC0xKSB9LFxuICAgICAgICAgICAgeyB0ZXh0OiAnUycsIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygwLCAxOSwgLTEpIH0sXG4gICAgICAgICAgICB7IHRleHQ6ICdEJywgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDE5LCAtMSkgfSxcbiAgICAgICAgICAgIHsgdGV4dDogJ1NwYWNlJywgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDE5LCAtMikgfVxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5sb2FkKCdodHRwczovL3RocmVlanMub3JnL2V4YW1wbGVzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uJywgKGZvbnQpID0+IHtcbiAgICAgICAgICAgIGluc3RydWN0aW9ucy5mb3JFYWNoKGluc3RydWN0aW9uID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0R2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KGluc3RydWN0aW9uLnRleHQsIHtcbiAgICAgICAgICAgICAgICAgICAgZm9udDogZm9udCxcbiAgICAgICAgICAgICAgICAgICAgc2l6ZTogMC41LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDAuMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRleHRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmZmZmZiB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0TWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRleHRHZW9tZXRyeSwgdGV4dE1hdGVyaWFsKTtcbiAgICAgICAgICAgICAgICB0ZXh0TWVzaC5wb3NpdGlvbi5jb3B5KGluc3RydWN0aW9uLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB0ZXh0TWVzaC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyOyAvLyDjg4bjgq3jgrnjg4jjgpLkuIrjgYvjgonopovjgZ/mmYLjgavmraPjgZfjgY/ooajnpLrjgZnjgovjgZ/jgoHjgavlm57ou6JcbiAgICAgICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0ZXh0TWVzaCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzcGF3bkVuZW15KCkge1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgT0JKTG9hZGVyKCk7XG4gICAgICAgIGxvYWRlci5sb2FkKCfjg57jgqTjgq/jg6kub2JqJywgKG9iaikgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW5lbXkgPSBvYmouY2xvbmUoKTsgLy8g44Kv44Ot44O844Oz44GX44Gm5paw44GX44GE5pW144KS5L2c5oiQXG4gICAgICAgICAgICBlbmVteS5wb3NpdGlvbi5zZXQoTWF0aC5yYW5kb20oKSAqIDQwIC0gMjAsIDAsIC0zMCk7IC8vIOaVteOBruS9jee9ruOCkuiqv+aVtFxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoZW5lbXkpO1xuICAgICAgICAgICAgdGhpcy5lbmVtaWVzLnB1c2goZW5lbXkpO1xuICAgICAgICB9LCB1bmRlZmluZWQsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgbG9hZGluZyB0aGUgZW5lbXkgbW9kZWw6JywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFuaW1hdGUgPSAoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGUpO1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuY2xvY2suZ2V0RGVsdGEoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUNoYXJhY3RlcihkZWx0YSk7XG4gICAgICAgIHRoaXMudXBkYXRlQnVsbGV0cyhkZWx0YSk7XG4gICAgICAgIHRoaXMudXBkYXRlRW5lbWllcyhkZWx0YSk7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRpbWUgPSB0aGlzLmNsb2NrLmdldEVsYXBzZWRUaW1lKCk7XG4gICAgICAgIGlmIChjdXJyZW50VGltZSAtIHRoaXMubGFzdEVuZW15U3Bhd25UaW1lID4gdGhpcy5lbmVteVNwYXduSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIHRoaXMuc3Bhd25FbmVteSgpO1xuICAgICAgICAgICAgdGhpcy5sYXN0RW5lbXlTcGF3blRpbWUgPSBjdXJyZW50VGltZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udHJvbHMudXBkYXRlKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUNoYXJhY3RlcihkZWx0YTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHNwZWVkID0gNTtcbiAgICAgICAgaWYgKHRoaXMubW92ZUZvcndhcmQgJiYgdGhpcy5jaGFyYWN0ZXIpIHRoaXMuY2hhcmFjdGVyLnBvc2l0aW9uLnogLT0gc3BlZWQgKiBkZWx0YTtcbiAgICAgICAgaWYgKHRoaXMubW92ZUJhY2t3YXJkICYmIHRoaXMuY2hhcmFjdGVyKSB0aGlzLmNoYXJhY3Rlci5wb3NpdGlvbi56ICs9IHNwZWVkICogZGVsdGE7XG4gICAgICAgIGlmICh0aGlzLm1vdmVMZWZ0ICYmIHRoaXMuY2hhcmFjdGVyKSB0aGlzLmNoYXJhY3Rlci5wb3NpdGlvbi54IC09IHNwZWVkICogZGVsdGE7XG4gICAgICAgIGlmICh0aGlzLm1vdmVSaWdodCAmJiB0aGlzLmNoYXJhY3RlcikgdGhpcy5jaGFyYWN0ZXIucG9zaXRpb24ueCArPSBzcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgIGlmICh0aGlzLnNob290KSB0aGlzLmZpcmVCdWxsZXQoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUJ1bGxldHMoZGVsdGE6IG51bWJlcikge1xuICAgICAgICBjb25zdCBidWxsZXRTcGVlZCA9IDEwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYnVsbGV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5idWxsZXRzW2ldLnBvc2l0aW9uLnogLT0gYnVsbGV0U3BlZWQgKiBkZWx0YTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYnVsbGV0c1tpXS5wb3NpdGlvbi56IDwgLTUwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5idWxsZXRzW2ldKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1bGxldHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlRW5lbWllcyhkZWx0YTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGVuZW15U3BlZWQgPSAyO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW5lbWllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5lbmVtaWVzW2ldLnBvc2l0aW9uLnogKz0gZW5lbXlTcGVlZCAqIGRlbHRhO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5lbmVtaWVzW2ldLnBvc2l0aW9uLnogPiAxMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuZW5lbWllc1tpXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVtaWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBpLS07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5idWxsZXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5lbXlCb3ggPSBuZXcgVEhSRUUuQm94MygpLnNldEZyb21PYmplY3QodGhpcy5lbmVtaWVzW2ldKTtcbiAgICAgICAgICAgICAgICBjb25zdCBidWxsZXRCb3ggPSBuZXcgVEhSRUUuQm94MygpLnNldEZyb21PYmplY3QodGhpcy5idWxsZXRzW2pdKTtcbiAgICAgICAgICAgICAgICBpZiAoZW5lbXlCb3guaW50ZXJzZWN0c0JveChidWxsZXRCb3gpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuZW5lbWllc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5lbWllcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuYnVsbGV0c1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5zcGxpY2UoaiwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaXJlQnVsbGV0KCkge1xuICAgICAgICBjb25zdCBidWxsZXRHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgwLjEsIDgsIDgpO1xuICAgICAgICBjb25zdCBidWxsZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGhvbmdNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDAwMCB9KTsgLy8g5by+44Gu6Imy44KS6buS44Gr6Kit5a6aXG4gICAgICAgIGNvbnN0IGJ1bGxldCA9IG5ldyBUSFJFRS5NZXNoKGJ1bGxldEdlb21ldHJ5LCBidWxsZXRNYXRlcmlhbCk7XG4gICAgICAgIGlmICh0aGlzLmNoYXJhY3Rlcikge1xuICAgICAgICAgICAgYnVsbGV0LnBvc2l0aW9uLnNldCh0aGlzLmNoYXJhY3Rlci5wb3NpdGlvbi54LCB0aGlzLmNoYXJhY3Rlci5wb3NpdGlvbi55ICsgMSwgdGhpcy5jaGFyYWN0ZXIucG9zaXRpb24ueiAtIDEpO1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoYnVsbGV0KTtcbiAgICAgICAgICAgIHRoaXMuYnVsbGV0cy5wdXNoKGJ1bGxldCk7XG4gICAgICAgICAgICB0aGlzLnNob290ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGFuZGxlS2V5RG93biA9IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgY2FzZSAndyc6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlRm9yd2FyZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVCYWNrd2FyZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgICAgIHRoaXMubW92ZVJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2hvb3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhhbmRsZUtleVVwID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIHN3aXRjaCAoZXZlbnQua2V5KSB7XG4gICAgICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVGb3J3YXJkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVCYWNrd2FyZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2hvb3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgZ2FtZSA9IG5ldyBTaG9vdGluZ0dhbWUoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGdhbWUuaGFuZGxlS2V5RG93bik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZ2FtZS5oYW5kbGVLZXlVcCk7XG59KTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfdGhyZWVfZXhhbXBsZXNfanNtX2NvbnRyb2xzX09yYml0Q29udHJvbHNfanMtbm9kZV9tb2R1bGVzX3RocmVlX2V4YW1wbGVzLTc2M2I2ZFwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==