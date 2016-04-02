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

        followerCount = 1000;
        followers = new THREE.Geometry();
        followerMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 5
        });


        for (var p = 0; p < followerCount; p++) {
            var type = p > followerCount/2 ? 2 : 1;
            var pX, pY, pZ, particle;
            if(type === 1) {
                pX = Math.random() * 250 - 300;
            }
            else{
                pX = Math.random() * 250 + 50;
            }
            pY = Math.random() * 600 - 300;
            pZ = 0;
            particle = new THREE.Vector3(pX, pY, pZ);
            particle.type = type;
            particle.velocity = new THREE.Vector3(Math.random(), -Math.random(), 0);

            followers.vertices.push(particle);
        }

        followersystem = new THREE.Points(
            followers,
            followerMaterial);
        followersystem.sortParticles = true;

        scene.add(followersystem);


        kingCount = 3;
        kings = new THREE.Geometry();
        kingMaterial = new THREE.PointsMaterial({
            color: 0xB99B30,
            size: 20
        });


        for (var k = 0; k < kingCount; k++) {

            var kX = Math.random() * 800 - 400,
                kY = Math.random() * 800 - 400,
                kZ = 0,
                king = new THREE.Vector3(kX, kY, kZ);

            king.velocity = new THREE.Vector3(Math.random()*3, -Math.random()*3, 0);

            kings.vertices.push(king);
        }

        kingSystem = new THREE.Points(
            kings,
            kingMaterial);
        kingSystem.sortParticles = true;

        scene.add(kingSystem);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

    }

    function animate() {

        requestAnimationFrame( animate );

        for (var i = 0; i < kings.vertices.length; i++) {

            var particle = kings.vertices[i];

            if(particle.y < -400 || particle.y > 400)
                particle.velocity.y *= -1;

            if(particle.x < -400 || particle.x > 400)
                particle.velocity.x *= -1;

            if(particle.z < -400 || particle.z > 400)
                particle.velocity.z *= -1;

            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.z += particle.velocity.z;
        }

        kingSystem.geometry.verticesNeedUpdate = true;

        for(i = 0; i < followers.vertices.length; i++){
            particle = followers.vertices[i];

            var king = getClosestKing(followers.vertices[i]);

            var bounced = false;
            if (particle.type === 1 && (particle.x < -300 || particle.x >= -50)) {
                particle.velocity.x *= -1;
                bounced = true;
            }

            if (particle.type === 2 && (particle.x <= 50 || particle.x > 300)) {
                particle.velocity.x *= -1;
                bounced = true;
            }

            if (particle.z < -300 || particle.z > 300) {
                particle.velocity.z *= -1;
                bounced = true;
            }
            if (particle.y < -300 || particle.y > 300) {
                particle.velocity.y *= -1;
                bounced = true;

            }

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
        followersystem.geometry.verticesNeedUpdate = true;

        renderer.render( scene, camera );
    }
    function getClosestKing(follower){
        var lowDist = 999999999999;
        var king = null;
        for (var i = 0; i < kings.vertices.length; i++) {
            var dist = follower.distanceTo(kings.vertices[i]);
            if(dist < lowDist){
                lowDist = dist;
                king = kings.vertices[i];
            }
        }
        return king;
    }

});
