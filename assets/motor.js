import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// All dimensions share a one-metre display radius; the assembly axis is Z.
const TAU = Math.PI * 2;
const axis = geometry => { geometry.rotateX(Math.PI / 2); return geometry; };

function annulus(inner, outer, depth, material, segments = 128) {
  const profile = [[inner,-depth/2],[outer,-depth/2],[outer,depth/2],[inner,depth/2],[inner,-depth/2]];
  return new THREE.Mesh(axis(new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),segments)),material);
}
function sector(inner, outer, start, end, depth, material, bevel=.002) {
  const s = new THREE.Shape();
  s.absarc(0,0,outer,start,end,false);
  s.absarc(0,0,inner,end,start,true); s.closePath();
  const g = new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,curveSegments:16});
  g.translate(0,0,-depth/2);
  return new THREE.Mesh(g,material);
}
function roundedShape(w,h,r) {
  const s=new THREE.Shape(), x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);
  s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);
  s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
function block(w,h,d,r,material) {
  const g=new THREE.ExtrudeGeometry(roundedShape(w,h,r),{depth:d,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:3,curveSegments:8});
  g.translate(0,0,-d/2);return new THREE.Mesh(g,material);
}
function circularInstances(group,geometry,material,count,radius,z,phase=0) {
  const mesh=new THREE.InstancedMesh(geometry,material,count), t=new THREE.Object3D();
  for(let i=0;i<count;i++) {const a=TAU*i/count+phase;t.position.set(Math.cos(a)*radius,Math.sin(a)*radius,z);t.rotation.set(0,0,a);t.updateMatrix();mesh.setMatrixAt(i,t.matrix);}
  group.add(mesh);return mesh;
}
function fasteners(group,count,radius,z,M,phase=0,size=.012) {
  circularInstances(group,axis(new THREE.CylinderGeometry(size*1.45,size*1.45,.006,24)),M.steel,count,radius,z,phase);
  circularInstances(group,axis(new THREE.CylinderGeometry(size,size,.014,6)),M.titanium,count,radius,z+.007,phase);
  circularInstances(group,axis(new THREE.CylinderGeometry(size*.44,size*.44,.001,6)),M.recess,count,radius,z+.0145,phase);
}
function surfaceTexture(kind) {
  const c=document.createElement('canvas');c.width=1024;c.height=512;
  const g=c.getContext('2d');
  if(kind==='rubber') {
    g.fillStyle='#aaaaaa';g.fillRect(0,0,1024,512);
    // Lathe U runs around the wheel; V follows its rounded cross-section.
    for(let i=-1;i<44;i++) for(const side of [-1,1]) {
      const x=i*25+(side===1?9:0);
      g.strokeStyle='#333';g.lineWidth=3;g.lineCap='round';g.beginPath();
      g.moveTo(x,side===1?18:494);g.bezierCurveTo(x+12,side===1?38:474,x+22,side===1?65:447,x+24,side===1?92:420);g.stroke();
    }
    const pixels=g.getImageData(0,0,1024,512);
    let seed=91;
    for(let i=0;i<pixels.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const n=(seed/4294967296-.5)*9;for(let j=0;j<3;j++)pixels.data[i+j]+=n;}
    g.putImageData(pixels,0,0);
  } else {
    g.fillStyle='#2a2e32';g.fillRect(0,0,1024,512);
    for(let y=0;y<512;y+=8)for(let x=0;x<1024;x+=8){
      const horizontal=((x/8+y/8)%4)<2;
      const gr=horizontal?g.createLinearGradient(x,y,x,y+8):g.createLinearGradient(x,y,x+8,y);
      gr.addColorStop(0,'#14171a');gr.addColorStop(.5,'#5c646a');gr.addColorStop(1,'#1b1e21');g.fillStyle=gr;g.fillRect(x,y,8,8);
      g.strokeStyle='rgba(140,150,155,.12)';g.lineWidth=.4;
      for(let k=2;k<8;k+=2){g.beginPath();g.moveTo(x+(horizontal?0:k),y+(horizontal?k:0));g.lineTo(x+(horizontal?8:k),y+(horizontal?k:8));g.stroke();}
    }
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;
  if(kind==='carbon')t.colorSpace=THREE.SRGBColorSpace;
  return t;
}
function sidewall() {
  const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');
  g.translate(512,512);g.fillStyle='#777a78';g.font='500 21px sans-serif';g.textAlign='center';
  function label(text,start,spacing,r){for(let i=0;i<text.length;i++){g.save();g.rotate(start+(i-text.length/2)*spacing);g.fillText(text[i],0,-r);g.restore();}}
  label('VOLT  /  ARC',-.55,.036,462);label('190 / 55 ZR 17   ·   RADIAL',2.25,.027,462);
  g.strokeStyle='#454747';g.lineWidth=1.5;for(const r of [442,487]){g.beginPath();g.arc(0,0,r,0,TAU);g.stroke();}
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(2.04,2.04),new THREE.MeshStandardMaterial({map,transparent:true,roughness:.95,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));
}

function machinedFinish() {
  const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');
  g.fillStyle='#969696';g.fillRect(0,0,1024,1024);
  for(let r=1;r<724;r++){
    const v=105+Math.round(48*(.5+.5*Math.sin(r*7.13)));
    g.strokeStyle=`rgb(${v},${v},${v})`;g.lineWidth=.55;g.beginPath();g.arc(512,512,r,0,TAU);g.stroke();
  }
  const texture=new THREE.CanvasTexture(c);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
  texture.repeat.set(.72,.72);texture.offset.set(.5,.5);texture.anisotropy=8;return texture;
}

export function createMotor(scene) {
  const carbon=surfaceTexture('carbon'), rubber=surfaceTexture('rubber');
  carbon.repeat.set(1,1);
  const M={
    carbon:new THREE.MeshPhysicalMaterial({map:carbon,color:0xc3cad1,metalness:.25,roughness:.4,clearcoat:1,clearcoatRoughness:.06}),
    tire:new THREE.MeshStandardMaterial({color:0x16191c,roughness:.78,bumpMap:rubber,bumpScale:.014}),
    steel:new THREE.MeshStandardMaterial({color:0x737c84,metalness:1,roughness:.5,roughnessMap:machinedFinish(),envMapIntensity:.75}),
    titanium:new THREE.MeshStandardMaterial({color:0x858e93,metalness:1,roughness:.26}),
    dark:new THREE.MeshStandardMaterial({color:0x242b30,metalness:.85,roughness:.32}),
    recess:new THREE.MeshStandardMaterial({color:0x06080a,metalness:.25,roughness:.65}),
    copper:new THREE.MeshStandardMaterial({color:0xc26a38,metalness:1,roughness:.2,envMapIntensity:1.35}),
    insulation:new THREE.MeshStandardMaterial({color:0x1d1f22,roughness:.55,metalness:.4}),
    gold:new THREE.MeshStandardMaterial({color:0x99815a,metalness:.85,roughness:.32}),
    magnet:new THREE.MeshStandardMaterial({color:0x8a9298,metalness:1,roughness:.24,envMapIntensity:.7}),
    magnetB:new THREE.MeshStandardMaterial({color:0x6a7278,metalness:1,roughness:.3,envMapIntensity:.7}),
    lime:new THREE.MeshStandardMaterial({color:0x9ccc00,emissive:0xC6FF00,emissiveIntensity:.55,metalness:.2,roughness:.4}),
    limeLine:new THREE.MeshBasicMaterial({color:0xC6FF00,toneMapped:false}),
  };
  const wheel=new THREE.Group();scene.add(wheel);const parts=[];
  function addPart(obj,z0,z1,delay,spins=true,out=null){obj.position.z=z0;wheel.add(obj);parts.push({obj,z0,z1,delay,spins,out,base:obj.position.clone()});return obj;}
  function ring(group,inner,outer,depth,z,material){const m=annulus(inner,outer,depth,material);m.position.z=z;group.add(m);return m;}

  // Rounded sport tyre: shoulders, bead seats, sidewall lettering and recessed sipes.
  const tyre=new THREE.Group();const profile=[];
  for(let i=0;i<=64;i++){const a=i/64*TAU;profile.push(new THREE.Vector2(.904+.126*Math.cos(a),.205*Math.sign(Math.sin(a))*Math.pow(Math.abs(Math.sin(a)),.7)));}
  const tyreGeo=axis(new THREE.LatheGeometry(profile,400));
  const position=tyreGeo.attributes.position;
  for(let i=0;i<position.count;i++){
    const x=position.getX(i),y=position.getY(i),z=position.getZ(i),r=Math.hypot(x,y);
    if(r>.953&&Math.abs(z)>.023&&Math.abs(z)<.179){
      const phase=(Math.atan2(y,x)/TAU*40+Math.abs(z)*8+(z>0?.37:0));
      const d=Math.abs(phase-Math.round(phase));
      const taper=Math.min(1,(Math.abs(z)-.023)/.018,(.179-Math.abs(z))/.016);
      const cut=.009*Math.max(0,1-d/.115)*taper;
      position.setXY(i,x*(r-cut)/r,y*(r-cut)/r);
    }
  }
  tyreGeo.computeVertexNormals();
  tyre.add(new THREE.Mesh(tyreGeo,M.tire));
  const letters=sidewall();letters.position.z=.2055;tyre.add(letters);
  for(const z of [-.171,.171])ring(tyre,.784,.801,.022,z,M.recess);
  addPart(tyre,0,-2.24,.37);

  // Carbon monocoque wheel, rolled rim lips and a dished hub.
  const rim=new THREE.Group();
  const dish=[[.105,-.066],[.17,-.074],[.28,-.046],[.58,-.031],[.773,-.08],[.789,-.147],[.811,-.155],[.814,-.142],[.799,-.123],[.794,.123],[.814,.142],[.811,.155],[.789,.147],[.773,.08],[.58,.031],[.28,.046],[.17,.074],[.105,.066],[.105,-.066]];
  const rimGeo=axis(new THREE.LatheGeometry(dish.map(p=>new THREE.Vector2(...p)),160));
  {const P=rimGeo.attributes.position,U=rimGeo.attributes.uv,k=.62;
   for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i),r=Math.hypot(x,y);
     if(r<.77)U.setXY(i,x*k+.5,y*k*2+.5);else U.setXY(i,Math.atan2(y,x)/TAU*5.1,z*k*2);}
   U.needsUpdate=true;}
  rim.add(new THREE.Mesh(rimGeo,M.carbon));
  for(const z of [-.153,.153]){
    ring(rim,.79,.809,.008,z,M.dark);
    ring(rim,.8095,.8135,.004,z+(z>0?.003:-.003),M.limeLine);
    // Three short painted registration accents instead of luminous circles.
    for(let i=0;i<3;i++){const stripe=sector(.799,.805,i*TAU/3,i*TAU/3+.28,.001,M.lime,0);stripe.position.z=z+(z>0?.006:-.006);rim.add(stripe);}
  }
  ring(rim,.09,.177,.16,0,M.dark);ring(rim,.092,.135,.176,0,M.steel);
  fasteners(rim,8,.157,.09,M,Math.PI/8,.011);
  const valve=new THREE.Mesh(axis(new THREE.CylinderGeometry(.012,.014,.068,12)),M.dark);valve.position.set(.70,.27,.17);rim.add(valve);
  addPart(rim,0,-1.49,.29);

  // 32 separate wedge magnets per rotor, in a machined retaining cassette.
  function rotor(front){
    const group=new THREE.Group();
    ring(group,.112,.517,.033,0,M.dark);ring(group,.49,.52,.013,.023,M.titanium);
    ring(group,.112,.21,.026,.027,M.titanium);
    for(let i=0;i<32;i++){
      const a=i*TAU/32;
      const magnet=sector(.273,.474,a+.012,a+TAU/32-.012,.023,i%2?M.magnet:M.magnetB);
      magnet.position.z=.029;group.add(magnet);
      const marking=sector(.482,.49,a+.04,a+.105,.001,i%2?M.dark:M.lime,0);marking.position.z=.032;group.add(marking);
    }
    fasteners(group,12,.503,.033,M,0,.008);
    fasteners(group,6,.163,.047,M,0,.01);
    // Radial machining reliefs on the back remain visible in the assembled view.
    for(let i=0;i<12;i++){const rib=sector(.22,.48,i*TAU/12+.045,i*TAU/12+.075,.008,M.titanium,0);rib.position.z=-.022;group.add(rib);}
    if(front) group.rotation.y=Math.PI;
    return group;
  }
  const frontRotor=rotor(true);frontRotor.userData.revealFace=true;
  frontRotor.userData.internal=true;addPart(frontRotor,.079,.79,.11);
  const rearRotor=rotor(false);rearRotor.userData.internal=true;addPart(rearRotor,-.079,-.76,.20);

  // Stationary carrier with eighteen individually wound, insulated copper coils.
  const stator=new THREE.Group();
  ring(stator,.113,.247,.094,0,M.dark);ring(stator,.468,.505,.08,0,M.dark);
  ring(stator,.486,.511,.014,.052,M.titanium);ring(stator,.486,.511,.014,-.052,M.titanium);
  const coreGeo=block(.158,.074,.09,.01,M.dark).geometry;
  circularInstances(stator,coreGeo,M.insulation,18,.357,0);
  // Each coil is real wire: rounded-rectangle tube turns, two layers deep, stacked along the axis.
  const turnGeo=layer=>{
    const pts=roundedShape(.166+layer*.024,.074+layer*.02,.024+layer*.01).getPoints(10).map(p=>new THREE.Vector3(p.x,p.y,0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true,'centripetal'),40,.0062,5,true);
  };
  const dummy=new THREE.Object3D();let coils;
  for(let layer=0;layer<2;layer++){
    const turns=layer?8:9;
    coils=new THREE.InstancedMesh(turnGeo(layer),M.copper,18*turns);
    for(let i=0;i<18;i++)for(let j=0;j<turns;j++){const a=i/18*TAU;dummy.position.set(Math.cos(a)*.357,Math.sin(a)*.357,(j-(turns-1)/2)*.0118+(layer?.0059:0));dummy.rotation.set(0,0,a);dummy.updateMatrix();coils.setMatrixAt(i*turns+j,dummy.matrix);}
    stator.add(coils);
  }
fasteners(stator,9,.491,.065,M,0,.008);
  // Laminated tooth ends are visible through the winding apertures.
  for(let z=-.043;z<.049;z+=.008)circularInstances(stator,new THREE.BoxGeometry(.12,.045,.002),M.steel,18,.357,z);
  ring(stator,.052,.112,.29,0,M.titanium);ring(stator,.055,.094,.022,.159,M.steel);
  ring(stator,.057,.069,.024,.175,M.recess);
  // Three phase terminals, insulated feedthroughs and curved copper conductors.
  for(let i=0;i<3;i++){
    const x=(i-1)*.075;
    const terminal=block(.048,.084,.048,.008,M.insulation);terminal.position.set(x,.526,0);stator.add(terminal);
    const path=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.46,.01),new THREE.Vector3(x,.53,.025),new THREE.Vector3(x,.585,.055)]);
    stator.add(new THREE.Mesh(new THREE.TubeGeometry(path,12,.009,8,false),M.copper));
  }
  const glow=new THREE.PointLight(0xe2d3b8,0,1.2,2);stator.add(glow);
  stator.userData.internal=true;addPart(stator,0,.02,.15,false);

  // Floating steel brake disc: true drilled holes, scalloped edge, carrier and bobbins.
  const brake=new THREE.Group(),s=new THREE.Shape();
  for(let i=0;i<=240;i++){const a=i/240*TAU,r=.662+.006*Math.cos(a*12);const x=Math.cos(a)*r,y=Math.sin(a)*r;i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();
  const inner=new THREE.Path();inner.absarc(0,0,.467,0,TAU,true);s.holes.push(inner);
  for(let i=0;i<36;i++)for(let j=0;j<3;j++){const a=i/36*TAU+j*.022,r=.509+j*.054;const h=new THREE.Path();h.absarc(Math.cos(a)*r,Math.sin(a)*r,.0085,0,TAU,true);s.holes.push(h);}
  const brakeGeo=new THREE.ExtrudeGeometry(s,{depth:.015,bevelEnabled:true,bevelSize:.001,bevelThickness:.001,bevelSegments:1,curveSegments:36});brakeGeo.translate(0,0,-.0075);
  brake.add(new THREE.Mesh(brakeGeo,M.steel));
  ring(brake,.104,.185,.034,0,M.dark);
  for(let i=0;i<9;i++){
    const a=i/9*TAU;const carrier=new THREE.Shape();
    carrier.moveTo(.15,-.037);carrier.lineTo(.33,-.023);carrier.lineTo(.472,.012);carrier.lineTo(.494,.046);carrier.lineTo(.46,.071);carrier.lineTo(.30,.035);carrier.lineTo(.15,.025);carrier.closePath();
    const g=new THREE.ExtrudeGeometry(carrier,{depth:.022,bevelEnabled:true,bevelSize:.004,bevelThickness:.003,bevelSegments:2});g.translate(0,0,-.011);
    const arm=new THREE.Mesh(g,M.dark);arm.rotation.z=a;brake.add(arm);
  }
  circularInstances(brake,axis(new THREE.CylinderGeometry(.025,.025,.025,24)),M.gold,9,.478,.014,.08);
  circularInstances(brake,axis(new THREE.CylinderGeometry(.011,.011,.027,16)),M.recess,9,.478,.015,.08);
  fasteners(brake,6,.145,.028,M,0,.01);
  // Concentric surface finishing marks catch the studio light without fake glow.
  for(const r of [.484,.647])ring(brake,r,r+.0015,.0006,.009,M.titanium);
  ring(brake,.054,.102,.048,.026,M.steel);ring(brake,.055,.067,.052,.027,M.recess);
  addPart(brake,.222,1.65,0);

  // Opposed-piston caliper: two cast halves, pad gap, bridge bolts and bleed nipple.
  const caliper=new THREE.Group(),body=new THREE.Group();
  for(const z of [-.048,.048]){
    const half=block(.32,.131,.049,.032,M.gold);half.position.z=z;body.add(half);
    for(const x of [-.088,.088]){const dome=new THREE.Mesh(axis(new THREE.CylinderGeometry(.047,.055,.018,32)),M.gold);dome.position.set(x,0,z+(z>0?.034:-.034));body.add(dome);}
    const pad=block(.24,.092,.012,.013,M.recess);pad.position.set(0,-.014,z>0?.017:-.017);body.add(pad);
  }
  for(const x of [-.127,.127]){
    const bridge=block(.037,.075,.137,.01,M.gold);bridge.position.set(x,.041,0);body.add(bridge);
    const bolt=new THREE.Mesh(axis(new THREE.CylinderGeometry(.015,.015,.008,6)),M.steel);bolt.position.set(x,.041,.076);body.add(bolt);
  }
  for(let i=0;i<4;i++){const slot=block(.014,.073,.002,.004,M.recess);slot.position.set((i-1.5)*.043,0,.075);body.add(slot);}
  const a=.63;body.position.set(Math.cos(a)*.625,Math.sin(a)*.625,0);body.rotation.z=a+Math.PI/2;caliper.add(body);
  const hoseCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(.40,.47,-.02),new THREE.Vector3(.36,.61,-.045),new THREE.Vector3(.27,.67,-.09)]);
  caliper.add(new THREE.Mesh(new THREE.TubeGeometry(hoseCurve,20,.012,8,false),M.recess));
  addPart(caliper,.222,1.65,0,false,new THREE.Vector3(.12,.13,0));
  // Batch fixed details per moving assembly; winding and bolt arrays stay instanced.
  // This keeps the exploded animation independent without hundreds of draw calls.
  wheel.updateMatrixWorld(true);
  for(const part of parts){
    const batches=new Map(), inverse=part.obj.matrixWorld.clone().invert(), originals=[];
    part.obj.traverse(obj=>{
      if(!obj.isMesh||obj.isInstancedMesh||obj.material.transparent)return;
      const geometry=obj.geometry.index?obj.geometry.toNonIndexed():obj.geometry.clone();
      geometry.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse,obj.matrixWorld));
      if(!batches.has(obj.material))batches.set(obj.material,[]);
      batches.get(obj.material).push(geometry);originals.push(obj);
    });
    for(const obj of originals)obj.removeFromParent();
    for(const [material,geometries] of batches){
      const combined=mergeGeometries(geometries,false);
      if(combined)part.obj.add(new THREE.Mesh(combined,material));
      geometries.forEach(g=>g.dispose());
    }
  }
  wheel.traverse(obj=>{if(obj.isMesh&&!obj.material.transparent){obj.castShadow=!(obj.isInstancedMesh&&obj.material===M.copper);obj.receiveShadow=true;}});
  return {wheel,parts,glow};
}
