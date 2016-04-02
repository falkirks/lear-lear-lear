require({
    baseUrl: 'js',
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

        peasentCount = 1000;
        peasents = new THREE.Geometry();
        peasentMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 5
        });

        for (var p = 0; p < peasentCount; p++) {

            var pX = Math.random() * 600 - 300,
                pY = Math.random() * 600 - 300,
                pZ = 0,
                particle = new THREE.Vector3(pX, pY, pZ);

            particle.velocity = Math.random();

            // Generate our "r" "theta", and "b" constant
            particle.theta = Math.atan2(pY,pX);
            particle.r = particle.distanceTo(new THREE.Vector3(0, 0, 0));
            particle.b = particle.r / particle.theta;


            peasents.vertices.push(particle);
        }

        peasentSystem = new THREE.Points(
            peasents,
            peasentMaterial);
        peasentSystem.sortParticles = true;

        scene.add(peasentSystem);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {

        requestAnimationFrame( animate );
        for(i = 0; i < peasents.vertices.length; i++){
            particle = peasents.vertices[i];
            if(particle.r >= 50) {
                particle.r -= particle.velocity;
                particle.theta = particle.r / particle.b;
            }
            else{
                particle.theta += 0.01;

            }
            particle.x = particle.r * Math.cos(particle.theta);
            particle.y = particle.r * Math.sin(particle.theta);

        }
        peasentSystem.geometry.verticesNeedUpdate = true;


        renderer.render( scene, camera );

    }

});
