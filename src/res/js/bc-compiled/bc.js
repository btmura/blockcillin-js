var BC=function(h){var c=h.Matrix=h.Matrix||{};c.makeLookAt=function(a,b,d){b=BC.Math.normalize(BC.Math.subtractVectors(a,b));d=BC.Math.cross(d,b);var c=BC.Math.cross(b,d);return[d[0],d[1],d[2],0,c[0],c[1],c[2],0,b[0],b[1],b[2],0,a[0],a[1],a[2],1]};c.makePerspective=function(a,b,d,c){a=Math.tan(0.5*Math.PI-0.5*a);var g=1/(d-c);return[a/b,0,0,0,0,a,0,0,0,0,(d+c)*g,-1,0,0,d*c*g*2,0]};c.makeTranslation=function(a,b,d){return[1,0,0,0,0,1,0,0,0,0,1,0,a,b,d,1]};c.makeXRotation=function(a){var b=Math.cos(a);
a=Math.sin(a);return[1,0,0,0,0,b,a,0,0,-a,b,0,0,0,0,1]};c.makeYRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,0,-a,0,0,1,0,0,a,0,b,0,0,0,0,1]};c.makeZRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,a,0,0,-a,b,0,0,0,0,1,0,0,0,0,1]};c.makeScale=function(a,b,d){return[a,0,0,0,0,b,0,0,0,0,d,0,0,0,0,1]};c.identity=c.makeScale(1,1,1);c.makeInverse=function(a){var b=a[0],d=a[1],c=a[2],g=a[3],f=a[4],e=a[5],h=a[6],l=a[7],n=a[8],p=a[9],q=a[10],m=a[11],s=a[12],r=a[13],t=a[14];a=
a[15];var u=q*a,v=t*m,w=h*a,x=t*l,y=h*m,z=q*l,A=c*a,B=t*g,C=c*m,D=q*g,E=c*l,F=h*g,G=n*r,H=s*p,I=f*r,J=s*e,K=f*p,L=n*e,M=b*r,N=s*d,O=b*p,P=n*d,Q=b*e,R=f*d,S=u*e+x*p+y*r-(v*e+w*p+z*r),T=v*d+A*p+D*r-(u*d+B*p+C*r),r=w*d+B*e+E*r-(x*d+A*e+F*r),d=z*d+C*e+F*p-(y*d+D*e+E*p),e=1/(b*S+f*T+n*r+s*d);return[e*S,e*T,e*r,e*d,e*(v*f+w*n+z*s-(u*f+x*n+y*s)),e*(u*b+B*n+C*s-(v*b+A*n+D*s)),e*(x*b+A*f+F*s-(w*b+B*f+E*s)),e*(y*b+D*f+E*n-(z*b+C*f+F*n)),e*(G*l+J*m+K*a-(H*l+I*m+L*a)),e*(H*g+M*m+P*a-(G*g+N*m+O*a)),e*(I*g+N*l+
Q*a-(J*g+M*l+R*a)),e*(L*g+O*l+R*m-(K*g+P*l+Q*m)),e*(I*q+L*t+H*h-(K*t+G*h+J*q)),e*(O*t+G*c+N*q-(M*q+P*t+H*c)),e*(M*h+R*t+J*c-(Q*t+I*c+N*h)),e*(Q*q+K*c+P*h-(O*h+R*q+L*c))]};c.matrixMultiply=function(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12],a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13],a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12],a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13],a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14],a[4]*
b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*b[15],a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12],a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13],a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12],a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13],a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14],a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]]};return h}(BC||{});BC=function(h){(h.CellView=h.CellView||{}).make=function(c,a,b){var d=a.numRingCells,k=a.outerRingRadius,g=a.ringMaxY,f=a.ringMinY,e=-Math.PI/2;a=BC.Math.circlePoints(a.innerRingRadius,d,e);k=BC.Math.circlePoints(k,d,e);d=0;e=[];e[d++]=a[0];e[d++]=g;e[d++]=-a[1];e[d++]=k[0];e[d++]=g;e[d++]=-k[1];e[d++]=k[2];e[d++]=g;e[d++]=-k[3];e[d++]=a[2];e[d++]=g;e[d++]=-a[3];e[d++]=a[0];e[d++]=g;e[d++]=-a[1];e[d++]=a[0];e[d++]=f;e[d++]=-a[1];e[d++]=k[0];e[d++]=f;e[d++]=-k[1];e[d++]=k[0];e[d++]=g;e[d++]=-k[1];
e[d++]=k[2];e[d++]=g;e[d++]=-k[3];e[d++]=k[2];e[d++]=f;e[d++]=-k[3];e[d++]=a[2];e[d++]=f;e[d++]=-a[3];e[d++]=a[2];e[d++]=g;e[d++]=-a[3];e[d++]=k[0];e[d++]=g;e[d++]=-k[1];e[d++]=k[0];e[d++]=f;e[d++]=-k[1];e[d++]=k[2];e[d++]=f;e[d++]=-k[3];e[d++]=k[2];e[d++]=g;e[d++]=-k[3];e[d++]=a[2];e[d++]=g;e[d++]=-a[3];e[d++]=a[2];e[d++]=f;e[d++]=-a[3];e[d++]=a[0];e[d++]=f;e[d++]=-a[1];e[d++]=a[0];e[d++]=g;e[d++]=-a[1];var h=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,h);c.bufferData(c.ARRAY_BUFFER,new Float32Array(e),
c.STATIC_DRAW);g=[];for(d=0;d<b.length;d++)for(f=b[d],g[d]=[],k=a=0;5>a;a++)e=f.textureCoord(0,0),g[d][k++]=e[0],g[d][k++]=e[1],e=f.textureCoord(0,1),g[d][k++]=e[0],g[d][k++]=e[1],e=f.textureCoord(1,1),g[d][k++]=e[0],g[d][k++]=e[1],e=f.textureCoord(1,0),g[d][k++]=e[0],g[d][k++]=e[1];for(var l=[],d=0;d<b.length;d++)l[d]=c.createBuffer(),c.bindBuffer(c.ARRAY_BUFFER,l[d]),c.bufferData(c.ARRAY_BUFFER,new Float32Array(g[d]),c.STATIC_DRAW);b=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,
14,12,14,15,16,17,18,16,18,19]);var n=c.createBuffer();c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,n);c.bufferData(c.ELEMENT_ARRAY_BUFFER,b,c.STATIC_DRAW);var p=b.length;return{draw:function(a,b){var d=b.positionLocation,e=b.textureCoordLocation;c.bindBuffer(c.ARRAY_BUFFER,h);c.enableVertexAttribArray(d);c.vertexAttribPointer(d,3,c.FLOAT,!1,0,0);c.bindBuffer(c.ARRAY_BUFFER,l[a.blockStyle]);c.enableVertexAttribArray(e);c.vertexAttribPointer(e,2,c.FLOAT,!1,0,0);c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,n);c.drawElements(c.TRIANGLES,
p,c.UNSIGNED_SHORT,0)}}};return h}(BC||{});BC=function(h){(h.BoardView=h.BoardView||{}).make=function(c,a,b){var d=b.boardMatrixLocation,k=b.ringMatrixLocation,g=b.cellMatrixLocation,f=BC.GL.textureTileSet(4,4,0.002),e=[f.tile(0,0),f.tile(0,1),f.tile(0,2),f.tile(0,3),f.tile(1,0),f.tile(1,1)],f=f.tile(1,2),h=BC.CellView.make(a,c,e),l=BC.SelectorView.make(a,c,f);return{draw:function(){a.uniformMatrix4fv(d,!1,c.matrix);for(var e=c.rings,f=0;f<e.length;f++){a.uniformMatrix4fv(k,!1,e[f].matrix);for(var q=e[f].cells,m=0;m<q.length;m++)a.uniformMatrix4fv(g,
!1,q[m].matrix),h.draw(q[m],b)}a.uniformMatrix4fv(d,!1,c.selector.matrix);a.uniformMatrix4fv(k,!1,BC.Matrix.identity);a.uniformMatrix4fv(g,!1,BC.Matrix.identity);l.draw(b)}}};return h}(BC||{});BC=function(h){(h.Time=h.Time||{}).getTimeInSeconds=function(){return 0.001*Date.now()};return h}(BC||{});BC=function(h){(h.SelectorView=h.SelectorView||{}).make=function(c,a,b){var d=a.ringMinY,k=a.ringMaxY;a=BC.Math.circlePoints(a.outerRingRadius+0.01,a.numRingCells,-Math.PI/2);var g=a.length-2,f=[],e=0;f[e++]=a[g]+0.001;f[e++]=d;f[e++]=-a[g+1]-0.001;f[e++]=a[0]+0.001;f[e++]=d;f[e++]=-a[1]-0.001;f[e++]=a[0]+0.001;f[e++]=k;f[e++]=-a[1]-0.001;f[e++]=a[g]+0.001;f[e++]=k;f[e++]=-a[g+1]-0.001;f[e++]=a[0]+0.001;f[e++]=d;f[e++]=-a[1]-0.001;f[e++]=a[2]+0.001;f[e++]=d;f[e++]=-a[3]-0.001;f[e++]=a[2]+0.001;f[e++]=
k;f[e++]=-a[3]-0.001;f[e++]=a[0]+0.001;f[e++]=k;f[e++]=-a[1]-0.001;var h=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,h);c.bufferData(c.ARRAY_BUFFER,new Float32Array(f),c.STATIC_DRAW);d=b.textureCoord(0,0);k=b.textureCoord(1,0);a=b.textureCoord(1,1);b=b.textureCoord(0,1);b=new Float32Array([].concat(d,k,a,b,d,k,a,b));var l=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,l);c.bufferData(c.ARRAY_BUFFER,b,c.STATIC_DRAW);var n=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7]),p=c.createBuffer();c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,
p);c.bufferData(c.ELEMENT_ARRAY_BUFFER,n,c.STATIC_DRAW);return{draw:function(a){var b=a.positionLocation;a=a.textureCoordLocation;c.enable(c.BLEND);c.bindBuffer(c.ARRAY_BUFFER,h);c.enableVertexAttribArray(b);c.vertexAttribPointer(b,3,c.FLOAT,!1,0,0);c.bindBuffer(c.ARRAY_BUFFER,l);c.enableVertexAttribArray(a);c.vertexAttribPointer(a,2,c.FLOAT,!1,0,0);c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,p);c.drawElements(c.TRIANGLES,n.length,c.UNSIGNED_SHORT,0);c.disable(c.BLEND)}}};return h}(BC||{});BC=function(h){(h.Constants=h.Constants||{}).Direction={NONE:0,UP:1,DOWN:2,LEFT:3,RIGHT:4};return h}(BC||{});BC=function(h){(h.Board=h.Board||{}).make=function(c){for(var a=BC.Constants.Direction,b=2*Math.PI/c.numRingCells,d=c.ringMaxY-c.ringMinY,k=[],g=0;3>g;g++)k[g]=BC.Ring.make(g,c.numRingCells,c.numBlockStyles,d,b);var f=BC.Selector.make(),e={rings:k,selector:f,matrix:BC.Matrix.identity,numRingCells:c.numRingCells,innerRingRadius:c.innerRingRadius,outerRingRadius:c.outerRingRadius,ringMaxY:c.ringMaxY,ringMinY:c.ringMinY,move:function(b){switch(b){case a.LEFT:f.move(a.LEFT)&&(e.currentCell--,0>e.currentCell&&
(e.currentCell=c.numRingCells-1));break;case a.RIGHT:f.move(a.RIGHT)&&(e.currentCell++,e.currentCell>=c.numRingCells&&(e.currentCell=0));break;case a.UP:0<e.currentRing&&f.move(a.UP)&&e.currentRing--;break;case a.DOWN:e.currentRing+1<e.rings.length&&f.move(a.DOWN)&&e.currentRing++}},swap:function(){var a=e.rings[e.currentRing];a.cells[e.currentCell].swap(a.cells[(e.currentCell+1)%a.cells.length])},update:function(a,c){for(var g=e.rings,k=0;k<g.length;k++)g[j].update(a);var g=BC.Matrix.makeXRotation(e.rotation[0]),
k=BC.Matrix.makeYRotation(e.rotation[1]),h=BC.Matrix.makeZRotation(e.rotation[2]),k=BC.Matrix.matrixMultiply(h,k),k=BC.Matrix.matrixMultiply(k,g);e.matrix=k;f.update(a,c,d,b,e.rotation)},currentRing:0,currentCell:c.numRingCells-1,rotation:[0,0,0]};return e};return h}(BC||{});BC=function(h){(h.Ring=h.Ring||{}).make=function(c,a,b,d,k){for(var g=[],f=0;f<a;f++)g[f]=BC.Cell.make(f,b,k);c=BC.Matrix.makeTranslation(0,-c*d,0);return{cells:g,matrix:c,update:function(a){for(var b=0;b<g.length;b++)g[b].update(a)}}};return h}(BC||{});BC=function(h){(h.Selector=h.Selector||{}).make=function(){var c=BC.Constants.Direction,a={matrix:BC.Matrix.identity,move:function(a){switch(a){case c.LEFT:return b!==c.NONE?a=!1:(b=c.LEFT,k=0,a=!0),a;case c.RIGHT:return b!==c.NONE?a=!1:(b=c.RIGHT,k=0,a=!0),a;case c.UP:return b!==c.NONE?a=!1:(b=c.UP,k=0,a=!0),a;case c.DOWN:return b!==c.NONE?a=!1:(b=c.DOWN,k=0,a=!0),a}},update:function(g,f,e,h,l){if(b!==c.NONE){0.05<k+g&&(g=0.05-k);e=g*e/0.05;h=g*h/0.05;switch(b){case c.UP:d[1]+=e;break;case c.DOWN:d[1]-=
e;break;case c.LEFT:l[1]+=h;break;case c.RIGHT:l[1]-=h}k+=g;0.05<=k&&(b=c.NONE,k=0)}g=1+Math.abs(Math.sin(4*f))/25;g=BC.Matrix.makeScale(g,g,1);f=BC.Matrix.makeTranslation(d[0],d[1],d[2]);a.matrix=BC.Matrix.matrixMultiply(g,f)}},b=c.NONE,d=[0,0,0],k=0;return a};return h}(BC||{});BC=function(h){(h.Game=h.Game||{}).run=function(){function c(){return g.width!=g.clientWidth||g.height!=g.clientHeight?(g.width=g.clientWidth,g.height=g.clientHeight,!0):!1}function a(){var a=g.width/g.height,b=BC.Math.radians(90);return BC.Matrix.makePerspective(b,a,1,2E3)}function b(){var a=BC.Matrix.makeLookAt([0,0.75,2],[0,0,0],[0,1,0]);return BC.Matrix.makeInverse(a)}function d(){f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT);f.viewport(0,0,f.canvas.width,f.canvas.height);f.uniformMatrix4fv(p.projectionMatrixLocation,
!1,q);var a=BC.Time.getTimeInSeconds(),b=a-u;u=a;m.update(b,a);s.draw();requestAnimationFrame(d)}var k=BC.Constants.Direction,g=document.getElementById("canvas");if(g){var f=g.getContext("webgl")||g.getContext("experimental-webgl");if(f){var e=f.createTexture();f.bindTexture(f.TEXTURE_2D,e);f.texImage2D(f.TEXTURE_2D,0,f.RGBA,1,1,0,f.RGBA,f.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));var h=new Image;h.src="images/textures.png";$(h).load(function(){f.bindTexture(f.TEXTURE_2D,e);f.texImage2D(f.TEXTURE_2D,
0,f.RGBA,f.RGBA,f.UNSIGNED_BYTE,h);f.texParameteri(f.TEXTURE_2D,f.TEXTURE_MAG_FILTER,f.LINEAR);f.texParameteri(f.TEXTURE_2D,f.TEXTURE_MIN_FILTER,f.LINEAR_MIPMAP_NEAREST);f.generateMipmap(f.TEXTURE_2D)});f.enable(f.CULL_FACE);f.enable(f.DEPTH_TEST);f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA);var l=BC.GL.loadShader(f,"vertex-shader",f.VERTEX_SHADER),n=BC.GL.loadShader(f,"fragment-shader",f.FRAGMENT_SHADER),l=BC.GL.createProgram(f,[l,n]);f.useProgram(l);var p={positionLocation:f.getAttribLocation(l,
"a_position"),textureCoordLocation:f.getAttribLocation(l,"a_texcoord"),projectionMatrixLocation:f.getUniformLocation(l,"u_projectionMatrix"),viewMatrixLocation:f.getUniformLocation(l,"u_viewMatrix"),boardMatrixLocation:f.getUniformLocation(l,"u_boardMatrix"),ringMatrixLocation:f.getUniformLocation(l,"u_ringMatrix"),cellMatrixLocation:f.getUniformLocation(l,"u_cellMatrix")};c();var q=a();$(window).resize(function(){c()&&(q=a())});l=b();f.uniformMatrix4fv(p.viewMatrixLocation,!1,l);var m=BC.Board.make({numRingCells:24,
numBlockStyles:6,innerRingRadius:0.75,outerRingRadius:1,ringMaxY:0.15,ringMinY:-0.15}),s=BC.BoardView.make(m,f,p),r=0,t=0;$(g).on("touchstart touchmove touchend",function(a){var b=a.originalEvent.changedTouches[0];switch(a.type){case "touchstart":r=b.pageX;t=b.pageY;break;case "touchend":a=b.pageX-r,b=b.pageY-t,50<a?m.move(k.LEFT):-50>a?m.move(k.RIGHT):50<b?m.move(k.DOWN):-50>b?m.move(k.UP):m.swap()}return!1});$(document).keydown(function(a){switch(a.keyCode){case 32:m.swap();break;case 37:m.move(k.LEFT);
break;case 39:m.move(k.RIGHT);break;case 38:m.move(k.UP);break;case 40:m.move(k.DOWN)}return!1});var u=BC.Time.getTimeInSeconds();d()}}};return h}(BC||{});$(document).ready(function(){BC.Game.run()});BC=function(h){var c=h.Math=h.Math||{};c.radians=function(a){return a*Math.PI/180};c.randomInt=function(a){return Math.floor(Math.random()*a)};c.circlePoints=function(a,b,d){d=d||0;for(var c=2*Math.PI/b,g=[],f=0;f<b;f++)g[2*f]=a*Math.cos(d+f*c),g[2*f+1]=a*Math.sin(d+f*c);return g};c.cross=function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]};c.subtractVectors=function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]};c.normalize=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+
a[2]*a[2]);return 1E-5<b?[a[0]/b,a[1]/b,a[2]/b]:[0,0,0]};return h}(BC||{});BC=function(h){(h.Cell=h.Cell||{}).make=function(c,a,b){a=BC.Math.randomInt(a);c=[0,c*b,0];var d={matrix:BC.Matrix.makeYRotation(c[1]),state:0,blockStyle:a,rotation:c,swap:function(a){var c=d.blockStyle;d.blockStyle=a.blockStyle;d.state=2;d.rotation[1]+=b;d.elapsedSwapTime=0;a.blockStyle=c;a.state=1;a.rotation[1]-=b;a.elapsedSwapTime=0},update:function(a){if(1==d.state||2==d.state){var c=a;0.125<d.elapsedSwapTime+a&&(c=0.125-d.elapsedSwapTime);a=b*c/0.125;d.rotation[1]=1==d.state?d.rotation[1]+a:
d.rotation[1]-a;d.matrix=BC.Matrix.makeYRotation(d.rotation[1]);d.elapsedSwapTime+=c;0.125<=d.elapsedSwapTime&&(d.state=0,d.elapsedSwapTime=0)}}};return d};return h}(BC||{});BC=function(h){var c=h.GL=h.GL||{};c.loadShader=function(a,b,d,c){c=c||BC.Util.error;var g=document.getElementById(b);if(!g)return c("** Error getting script element:"+b),null;b=a.createShader(d);a.shaderSource(b,g.text);a.compileShader(b);return a.getShaderParameter(b,a.COMPILE_STATUS)?b:(lastError=a.getShaderInfoLog(b),c("*** Error compiling shader '"+b+"':"+lastError),a.deleteShader(b),null)};c.createProgram=function(a,b,c,h){for(var g=a.createProgram(),f=0;f<b.length;f++)a.attachShader(g,b[f]);
if(c)for(f=0;f<c.length;f++)a.bindAttribLocation(g,h?h[f]:f,c[f]);a.linkProgram(g);return a.getProgramParameter(g,a.LINK_STATUS)?g:(lastError=a.getProgramInfoLog(g),error("Error in program linking: "+lastError),a.deleteProgram(g),null)};c.textureTileSet=function(a,b,c){var h=1/a,g=1/b;return{tile:function(a,b){var U=h*b,l=g*a;return{textureCoord:function(a,b){return[U+c+(h-2*c)*a,l+c+(g-2*c)*b]}}}}};return h}(BC||{});BC=function(h){(h.Util=h.Util||{}).error=function(c){window.console&&(window.console.error?window.console.error(c):window.console.log&&window.console.log(c))};return h}(BC||{});
