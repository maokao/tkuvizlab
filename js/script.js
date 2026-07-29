window.addEventListener('scroll', () => {
    let parent = document.getElementById('parallax-container');
    let children = parent.getElementsByTagName('div');
    for (let i = 0; i < children.length; i++) {
        if(children[i].id != "skyline")
        children[i].style.transform = 'translateY(-' + (window.pageYOffset * i / children.length) + 'px)';
    }
}, false);

// ページの読み込みを待つ
var today = new Date();
now = today.getHours();
if( (now >=18 && now<=24) || (now >=0 && now<=6)  ){
window.addEventListener("load", init);
document.getElementById("stars").setAttribute("style", "display:block;");
document.getElementById("comet").setAttribute("style", "display:block;");
} else {
window.addEventListener("load", go);
document.getElementById("stars").setAttribute("style", "display:none;");
document.getElementById("comet").setAttribute("style", "display:none;");
}

function init() {
    let rot = 0; // 角度
    let canvas = document.querySelector('canvas');
	canvas.style = 'width: 1792px; height: 927px;"';
	//canvas.style = 'width: 100%;"';

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("canvas"),
        alpha: true
    });

    // シーンを作成
    const scene = new THREE.Scene();

    // フォグを作成
    scene.fog = new THREE.Fog(0xaaaaaa, 50, 2000);

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(70, 1000);

    // 形状データを作成
    //const geometry = new THREE.Geometry();
    const geometry = new THREE.BufferGeometry();
	const positions = [];
    const colors = [];
    const sprite = new THREE.TextureLoader().load( 'sprites/disc.png' );

	const color = new THREE.Color();
	const n = 1000;

    for (let i = 0; i < 5000; i++) {
        const star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(2000);
        star.y = THREE.Math.randFloatSpread(2000);
        star.z = THREE.Math.randFloatSpread(2000);

        const vx = ( star.x / n ) + 0.5;
		const vy = ( star.y / n ) + 0.5;
		const vz = ( star.z / n ) + 0.5;

		//color.setRGB( vx, vy, vz );
		if(i % 4 ==0)
        {
            //color.setRGB(Math.random()/3+0.66 , Math.random() , Math.random() );  

            color.setRGB(0.9, Math.random(), 0);
        }	
        else if(i%4 == 1)
            color.setRGB(0.9, 0.9, 0);		
		else
			color.setRGB(1,1,1 );
		

		colors.push( color.r, color.g, color.b );
		positions.push( star.x, star.y, star.z );

        //geometry.vertices.push(star);
    }
	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
	geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    // マテリアルを作成
    const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 2.5,
        map: sprite, alphaTest: 0.1, transparent: true
        //color: new THREE.Color(Math.random() * 0xffffff)
        //color: 0xa6a66f
        //color: 0xffffff

    });
    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    // 毎フレーム時に実行されるループイベント
    function render() {
        rot += 0.003;
        // ラジアンに変換する
        const radian = (rot * Math.PI) / 180;
        // 角度に応じてカメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        // 原点方向を見つめる
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // レンダリング
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    render();

    // リサイズイベント発生時に実行
    window.addEventListener("resize", onResize);

    function onResize() {
        // サイズを取得
        const width = window.innerWidth;
        const height = window.innerHeight;
        // レンダラーのサイズを調整する
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);

        // カメラのアスペクト比を正す
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    // 初期化のために実行
    onResize();
}


function go() {
    "use strict";
    // JS1K's HTML shim gives us a canvas (a) and its 2D context (c) for free. We'll set them up here.

    let canvas = document.querySelector('canvas');
    let ctx = canvas.getContext('2d');

    // First off - we define an abbreviation function. This takes an object, iterates over its properties
    // and stores their names as strings in a 2 or 3 letter variable ("this" is the window object).
    //
    // p[0]+p[6] will evaluate to the 1st and 7th letter (or the 1st+"undefined" if there's no 7th),
    // [p[20]] will be an empty string if the property's name is too short ([undefined] gets coerced to
    // an empty string).
    //
    // This is a variation on Marijn Haverbeke's technique - see https://marijnhaverbeke.nl/js1k/
    //
    // We won't be using it in the readable version of the demo.

    // A=o=>{for(p in o)this[p[0]+p[6]+[p[20]]]=p}

    // Next we abbreviate all the properties in our window object because requestAnimationFrame() is
    // kind of long. We can't call A(window) because it will try to abbreviate all our abbreviations (since
    // it stores them in the window object) so we'll use it on "top" which has the same properties.
    // We really just need a shorter requestAnimationFrame().
    //
    // Sidenote: this is a clear violation of JS1K rules, which is why it's very important not to read them
    // before the competition is over.

    // A(top)

    // Now, since our demo is fairly heavy we use a small canvas, but we want it to be fullscreen on a
    // black background, so we waste ~90 bytes on some CSS to stretch it (currently "object-fit:contain"
    // doesn't work for canvas on MS browsers).
    //
    // To avoid wasting 90 bytes just on this, we take this opportunity to define P and Q as 'width' and
    // 'height' for later. This is probably a mistake since I ended up packing it with regpack anyway.
    //
    // The weird bit at the end is an ES6 template literal being abused to call the array's join method
    // with something that will be coerced into the string ':100%;'.

    // a.style=[P='width',Q='height','object-fit:contain;background:#000'].join`:100%;`

    //canvas.style = 'width: 100%; object-fit:contain; background:#000;';
    canvas.style = 'width: 100%; height: 927px; background-color:#000;';

    // Now we need a frame counter.

    // t=0

    let frame = 0;
    // B() is the requestAnimationFrame callback.

    // B=_=>{

    function onFrame() {
        // Set width and height on our canvases, we'll be using a smaller canvas for the godrays. This
        // also clears and resets their states. While we're at it, we'll store their dimensions in one
        // letter vars for later.

        // w=a[P]=512
        // h=a[Q]=256
        // W=E[P]=128
        // H=E[Q]=64

        canvas.width = 3584;
        canvas.height = 1854;
        //canvas.width = 512;
        //canvas.height = 256;
        godraysCanvas.width = 128;
        godraysCanvas.height = 64;

        // Set the sun's vertical position.

        // T=C(t++/w)*24

        let sunY = Math.cos(frame++ / 512) * 24; // This is actually the offset from the middle of the canvas.

        // Get the 2D context for our godrays canvas, and create abbreviations for all the context properties.

        // A(F=E.getContext`2d`)

        let godraysCtx = godraysCanvas.getContext('2d');

        // Now we set the godrays' context fillstyle (window.fy is 'fillStyle') to a newly created gradient
        // (cr is 'createRadialGradient') which we also run through our abbreviator.

        // A(F[fy]=g=F[cR](H,32+T,0,H,32+T,44)) // Could have shaved one more char here...

        let emissionGradient = godraysCtx.createRadialGradient(
            godraysCanvas.width / 2, godraysCanvas.height / 2 + sunY, // The sun's center.
            0,                                                        // Start radius.
            godraysCanvas.width / 2, godraysCanvas.height / 2 + sunY, // Sun's center again.
            44                                                        // End radius.
        );
        godraysCtx.fillStyle = emissionGradient;

        // Now we addColorStops. This needs to be a dark gradient because our godrays effect will basically
        // overlay it on top of itself many many times, so anything lighter will result in lots of white.
        //
        // If you're not space-bound you can add another stop or two, maybe fade out to black, but this
        // actually looks good enough.

        // g[ao](.1,'#0C0804')
        // g[ao](.2,'#060201')

        emissionGradient.addColorStop(.1, '#0C0804'); // Color for pixels in radius 0 to 4.4 (44 * .1).
        emissionGradient.addColorStop(.2, '#060201'); // Color for everything past radius 8.8.

        // Now paint the gradient all over our godrays canvas.

        // F[fc](0,0,W,H)

        godraysCtx.fillRect(0, 0, godraysCanvas.width, godraysCanvas.height);

        // And set the fillstyle to black, we'll use it to paint our occlusion (mountains).

        // F[fy]='#000'

        godraysCtx.fillStyle = '#000';

        // For our 1K demo, we paint our sky a solid #644 reddish-brown. But here - let's do it right.

        // c[fy]=g='#644'
        // c[fc](0,0,w,h)

        let skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGradient.addColorStop(0, '#2a3e55'); // Blueish at the top.
        //skyGradient.addColorStop(0, '#000000'); // Blueish at the top.
        //skyGradient.addColorStop(.7, '#8d4835'); // Reddish at the bottom.
        skyGradient.addColorStop(.7, '#a6925e'); // Reddish at the bottom.
        //skyGradient.addColorStop(.7, '#ffffff'); // Reddish at the bottom.
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Our mountains will be made by summing up sine waves of varying frequencies and amplitudes.

        // m=(f,j)=>[1721,947,547,233,73,31,7].reduce((a,v)=>a*j-C(f*v),0)

        function mountainHeight(position, roughness, mode) {
            // Our frequencies (prime numbers to avoid extra repetitions).
            let frequencies = [5721,4000, 947, 547, 233, 73, 31, 7];
            if(mode == 1)
            {
                frequencies[0] = 7;
                frequencies[1] = 5000;
                frequencies[2] = 3988;
                frequencies[3] = 900;
                frequencies[4] = 600;
                frequencies[5] = 233;
                frequencies[6] = 90;
                frequencies[7] = 40;
            }
            else if(mode == 2)
                frequencies[0] = 6000;
            else
                frequencies[0] = 900;
            //let frequencies = [172, 97, 147, 233, 73, 31, 7];
            // Add them up.
            return frequencies.reduce((height, freq) => height * roughness - Math.cos(freq * position), 0);
        }

        // Draw 4 layers of mountains.

        // for(i=0;i<4;i++)for(X=w,c[fy]=`hsl(7,23%,${23-i*6}%`;X--;F[fc](X/4,U/4+1,1,w))c[fc](X,U=W+i*25+m((t+t*i*i)/1e3+X/2e3,i/19-.5)*45,1,w)
/*
        for(let i = 0; i < 4; i++) {
            // Set the main canvas fillStyle to a shade of brown with variable lightness (darker at the front).
            ctx.fillStyle = `hsl(7, 23%, ${23-i*6}%)`;
            // For each column in our canvas...
            for(let x = canvas.width; x--;) {
                // Ok, I don't really remember the details here, basically the (frame+frame*i*i) makes the
                // near mountains move faster than the far ones. We divide by large numbers because our
                // mountains repeat at position 1/7*Math.PI*2 or something like that...
                //let mountainPosition = (frame+frame*i*i) / 1000 + x / 2000;
                let mountainPosition = x / 2000;
                // Make further mountains more jagged, adds a bit of realism and also makes the godrays
                // look nicer.
                let mountainRoughness = i / 19 - .5;
                // 128 is the middle, i * 25 moves the nearer mountains lower on the screen.
                let y = 728 + i * 45 + mountainHeight(mountainPosition, mountainRoughness, i) * 45;
                // Paint a 1px-wide rectangle from the mountain's top to below the bottom of the canvas.
                ctx.fillRect(x, y, 1, 999); // 999 can be any large number...
                // Paint the same thing in black on the godrays emission canvas, which is 1/4 the size,
                // and move it one pixel down (otherwise there can be a tiny underlit space between the
                // mountains and the sky).
                godraysCtx.fillRect(x/4, y/4+1, 1, 999);
            }
        }
*/
        // The godrays are generated by adding up RGB values, gCt is the bane of all js golfers -
        // globalCompositeOperation. Set it to 'lighter' on both canvases.

        // c[gCt]=F[gCt]='lighter'

        ctx.globalCompositeOperation = godraysCtx.globalCompositeOperation = 'lighter';
        //ctx.globalCompositeOperation = godraysCtx.globalCompositeOperation = 'destination-over';

        // NOW - let's light this motherfucker up! We'll make several passes over our emission canvas,
        // each time adding an enlarged copy of it to itself so at the first pass we get 2 copies, then 4,
        // then 8, then 16 etc... We square our scale factor at each iteration.

        // for(s=1.07;s<5;s*=s)F[da](E,(W-W*s)/2,(H-H*s)/2-T*s+T,W*s,H*s)

        for(let scaleFactor = 1.07; scaleFactor < 5; scaleFactor *= scaleFactor) {
            // The x, y, width and height arguments for drawImage keep the light source (godraysCanvas.width
            // / 2, godraysCanvas.height / 2 + sunY) in the same spot on the enlarged copy. It basically boils
            // down to multiplying a 2D matrix by itself. There's probably a better way to do this, but I
            // couldn't figure it out.
            godraysCtx.drawImage(
                godraysCanvas,
                (godraysCanvas.width - godraysCanvas.width * scaleFactor) / 2,
                (godraysCanvas.height - godraysCanvas.height * scaleFactor) / 2 - sunY * scaleFactor + sunY,
                godraysCanvas.width * scaleFactor,
                godraysCanvas.height * scaleFactor
            );
        }

        // Now that our godrays are rendered, draw them to our output canvas (whose globalCompositeOperation
        // is already set to 'lighter').

        // c[da](E,0,0,w,h)

        ctx.drawImage(godraysCanvas, 0, 0, canvas.width, canvas.height);

        // All done.
        //ctx.fillStyle = "rgba(255,165,0,1)";
//ctx.fillRect(10, 10, 200, 200);
        // this[rte](B)}

        requestAnimationFrame(onFrame);
    }

    // Call our requestAnimationFrame handler to start rendering. Since it takes no arguments use the argument
    // list to create our godrays canvas with cloneNode, which also takes no arguments... use it to setup a
    // Math.cos shortcut (we'll skip this in our longform version).

    // B(E=a.cloneNode(C=Math.cos))

    let godraysCanvas = canvas.cloneNode();

    onFrame();

    // Phew... that took a while, but we're finally done with the visuals. Now for the audio part -
    //
    // The synthesizer is based on the Karplus-Strong algorithm which uses a very short delay loop as a
    // resonator. I was initially aiming for a realistic string quartet but time and space constraints
    // have forced me to massively compromise.
    //
    //
    // The music is a 64-note melody that ends up an octave above where it started, spread out in a 4-voice
    // canon. We pre-render a single voice and then add up 4 in our ScriptProcessor callback.

    // Big hairy render loop, let's break it to pieces and explain...

    // for(M=[Y=[V=J=I=i=0]];i<h;i++)for(j=2e4;j--;T=Y[I|0]=M[J++]=O%9)O=Math.random()-.5+T/5+Y[(I=++I%(7e3/2**(("!!----,*,(444420/20/-0/---,,--//((4444202/;;;;986986420/00--//,,".charCodeAt(i&63)+12*(i>>6))/12)))|0]*.8||0

    let encodedMelody = "!!----,*,(444420/20/-0/---,,--//((4444202/;;;;986986420/00--//,,";

    // M=[Y=[V=J=I=i=0]]
    let voiceBuffer = []; // M = [...]
    let ksDelayBuffer = []; // Y = [...]
    let sampleOffset = 0; // V = 0 (used later)
    let J = 0; // What the hell is J????

    // Oh fuck it. It's 4am and I have no idea how this thing works. Maybe I'll write it up later.
    // Besides, you just came here for the godrays, right?

    // A(G=new AudioContext)
    // A(S=G[cSr](w*8,0,1))
    // S[oo]=e=>{A(e);A(o=e[oB]);for(i=0;i<w*8;o[gn](0)[i++]=O/32,V++)for(O=0,K=4;K--;O+=T>0&&M[T%J])T=V-(K/32*9)*J}
    // S.connect(G[da])
}