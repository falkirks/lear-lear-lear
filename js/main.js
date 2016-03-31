require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
        'vendor/three': { exports: 'THREE' },
        'vendor/perlin': { exports: 'noise' }
    }
}, [
    'vendor/three',
    'vendor/perlin'
], function(THREE, noise) {

var scene, camera, renderer;
var geometry, material, mesh;

init();
animate();

    function init() {
        noise.seed(Math.random());

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 700;

        // create the particle variables
        peasentCount = 1000;
        peasents = new THREE.Geometry();
        peasentMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 5
        });


// now create the individual particles
        for (var p = 0; p < peasentCount; p++) {

            // create a particle with random
            // position values, -250 -> 250
            var pX = Math.random() * 600 - 300,
                pY = Math.random() * 600 - 300,
                pZ = 0,
                particle = new THREE.Vector3(pX, pY, pZ);

            particle.velocity = new THREE.Vector3(Math.random(), -Math.random(), 0);

            // add it to the geometry
            peasents.vertices.push(particle);
        }

// create the particle system
        peasentSystem = new THREE.Points(
            peasents,
            peasentMaterial);
        peasentSystem.sortParticles = true;

// add it to the scene
        scene.add(peasentSystem);


        kingCount = 1;
        kings = new THREE.Geometry();
        kingMaterial = new THREE.PointsMaterial({
            color: 0xB99B30,
            size: 20
        });


// now create the individual particles
        for (var k = 0; k < kingCount; k++) {

            // create a particle with random
            // position values, -250 -> 250
            var kX = Math.random() * 800 - 400,
                kY = Math.random() * 800 - 400,
                kZ = 0,
                king = new THREE.Vector3(kX, kY, kZ);

            king.velocity = new THREE.Vector3(Math.random()*3, -Math.random()*3, 0);

            // add it to the geometry
            kings.vertices.push(king);
        }

        kingSystem = new THREE.Points(
            kings,
            kingMaterial);
        kingSystem.sortParticles = true;

// add it to the scene
        scene.add(kingSystem);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {

        requestAnimationFrame( animate );

        for (var i = 0; i < kings.vertices.length; i++) {

            // get the particle
            var particle = kings.vertices[i];
            if(i == 0){
                console.log(particle);
            }

            // check if we need to reset
            if(particle.y < -400 || particle.y > 400){
                particle.velocity.y *= -1;
            }

            if(particle.x < -400 || particle.x > 400){
                particle.velocity.x *= -1;
            }

            if(particle.z < -400 || particle.z > 400){
                particle.velocity.z *= -1;
            }

            // update the velocity with
            // a splat of randomni
            //particle.velocity.y -= Math.random() * 0.1;

            // and the position
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.z += particle.velocity.z;
        }

        // flag to the particle system
        // that we've changed its vertices.
        kingSystem.geometry.verticesNeedUpdate = true;


        // Now let's update the peasents

        for(i = 0; i < peasents.vertices.length; i++){
            particle = peasents.vertices[i];
            if(i == 0){
                console.log(particle);
            }

            var king = getClosestKing(peasents.vertices[i]);
            var bounced = false;

            if(particle.y < -300 || particle.y > 300){
                particle.velocity.y *= -1;
                bounced = true;

            }

            if(particle.x < -300 || particle.x > 300){
                particle.velocity.x *= -1;
                bounced = true;
            }

            if(particle.z < -300 || particle.z > 300){
                particle.velocity.z *= -1;
                bounced = true;
            }
            /*if(!bounced) {
                for (var j = 0; j < peasents.vertices.length; j++) {
                    var dist = particle.distanceTo(peasents.vertices[j]);
                    if (dist <= 1) {
                        bounced = true;
                        //peasents.vertices[j].velocity.negate();
                    }
                }
            }*/
            if(!bounced) {
                if(particle.x > king.x ^ particle.velocity.x < 0){
                    particle.velocity.x *= -1;
                }
                if(particle.y > king.y ^ particle.velocity.y < 0){
                    particle.velocity.y *= -1;
                }
                if(particle.z > king.z ^ particle.velocity.z < 0){
                    particle.velocity.z *= -1;
                }
            }

            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.z += particle.velocity.z;
        }
        peasentSystem.geometry.verticesNeedUpdate = true;


        renderer.render( scene, camera );

    }
    function getClosestKing(peasent){
        var lowDist = 999999999999;
        var king = null;
        for (var i = 0; i < kings.vertices.length; i++) {
            var dist = peasent.distanceTo(kings.vertices[i]);
            if(dist < lowDist){
                lowDist = dist;
                king = kings.vertices[i];
            }
        }
        return king;
    }

});
