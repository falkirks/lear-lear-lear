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
        peasentCount = 500;
        peasents = new THREE.Geometry();
        peasentMaterial = new THREE.PointsMaterial({
            size: 10,
            vertexColors: true
        });
        for (var p = 0; p < peasentCount; p++) {
            var pX = Math.random() * 600 - 300,
                pY = Math.random() * 600 - 300,
                pZ = 0,
                particle = new THREE.Vector3(pX, pY, pZ);
            particle.velocity = new THREE.Vector3(Math.random(), -Math.random(), 0);
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
            if(!bounced) {
                for (var j = 0; j < peasents.vertices.length; j++) {
                    var dist = particle.distanceTo(peasents.vertices[j]);
                    if (dist <= 10) {
                        bounced = true;
                        var avg = new THREE.Vector3();
                        avg.addVectors(particle.velocity, peasents.vertices[j].velocity);
                        particle.velocity.subVectors(avg, particle.velocity);
                        peasents.vertices[j].velocity.subVectors(avg, peasents.vertices[j].velocity);
                    }
                }
            }
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.z += particle.velocity.z;
            var c = 40 * Math.abs(noise.perlin2(particle.x / 1000, particle.y / 1000));
            peasentSystem.geometry.colors[i] = new THREE.Color(c, c, c);
        }
        peasentSystem.geometry.colorsNeedUpdate = true;
        peasentSystem.geometry.verticesNeedUpdate = true;
        renderer.render( scene, camera );
    }
});
