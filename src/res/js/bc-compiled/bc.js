var BC=function(k){var e=k.Matrix=k.Matrix||{};e.makeLookAt=function(a,b,c){b=BC.Math.normalize(BC.Math.subtractVectors(a,b));c=BC.Math.cross(c,b);var f=BC.Math.cross(b,c);return[c[0],c[1],c[2],0,f[0],f[1],f[2],0,b[0],b[1],b[2],0,a[0],a[1],a[2],1]};e.makePerspective=function(a,b,c,f){a=Math.tan(0.5*Math.PI-0.5*a);var e=1/(c-f);return[a/b,0,0,0,0,a,0,0,0,0,(c+f)*e,-1,0,0,c*f*e*2,0]};e.makeTranslation=function(a,b,c){return[1,0,0,0,0,1,0,0,0,0,1,0,a,b,c,1]};e.makeXRotation=function(a){var b=Math.cos(a);
a=Math.sin(a);return[1,0,0,0,0,b,a,0,0,-a,b,0,0,0,0,1]};e.makeYRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,0,-a,0,0,1,0,0,a,0,b,0,0,0,0,1]};e.makeZRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,a,0,0,-a,b,0,0,0,0,1,0,0,0,0,1]};e.makeScale=function(a,b,c){return[a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1]};e.identity=e.makeScale(1,1,1);e.makeInverse=function(a){var b=a[0],c=a[1],f=a[2],e=a[3],g=a[4],d=a[5],k=a[6],l=a[7],n=a[8],m=a[9],s=a[10],p=a[11],q=a[12],t=a[13],u=a[14];a=
a[15];var x=s*a,y=u*p,z=k*a,r=u*l,v=k*p,w=s*l,A=f*a,B=u*e,C=f*p,D=s*e,E=f*l,F=k*e,G=n*t,H=q*m,I=g*t,J=q*d,K=g*m,L=n*d,M=b*t,N=q*c,O=b*m,P=n*c,Q=b*d,R=g*c,S=x*d+r*m+v*t-(y*d+z*m+w*t),T=y*c+A*m+D*t-(x*c+B*m+C*t),t=z*c+B*d+E*t-(r*c+A*d+F*t),c=w*c+C*d+F*m-(v*c+D*d+E*m),d=1/(b*S+g*T+n*t+q*c);return[d*S,d*T,d*t,d*c,d*(y*g+z*n+w*q-(x*g+r*n+v*q)),d*(x*b+B*n+C*q-(y*b+A*n+D*q)),d*(r*b+A*g+F*q-(z*b+B*g+E*q)),d*(v*b+D*g+E*n-(w*b+C*g+F*n)),d*(G*l+J*p+K*a-(H*l+I*p+L*a)),d*(H*e+M*p+P*a-(G*e+N*p+O*a)),d*(I*e+N*l+
Q*a-(J*e+M*l+R*a)),d*(L*e+O*l+R*p-(K*e+P*l+Q*p)),d*(I*s+L*u+H*k-(K*u+G*k+J*s)),d*(O*u+G*f+N*s-(M*s+P*u+H*f)),d*(M*k+R*u+J*f-(Q*u+I*f+N*k)),d*(Q*s+K*f+P*k-(O*k+R*s+L*f))]};e.matrixMultiply=function(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12],a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13],a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12],a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13],a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14],a[4]*
b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*b[15],a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12],a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13],a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12],a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13],a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14],a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]]};return k}(BC||{});BC=function(k){(k.Time=k.Time||{}).getTimeInSeconds=function(){return 0.001*Date.now()};return k}(BC||{});BC=function(k){var e=k.GL=k.GL||{};e.loadShader=function(a,b,c,e){e=e||BC.Util.error;var h=document.getElementById(b);if(!h)return e("** Error getting script element:"+b),null;b=a.createShader(c);a.shaderSource(b,h.text);a.compileShader(b);return a.getShaderParameter(b,a.COMPILE_STATUS)?b:(lastError=a.getShaderInfoLog(b),e("*** Error compiling shader '"+b+"':"+lastError),a.deleteShader(b),null)};e.createProgram=function(a,b,c,e){for(var h=a.createProgram(),g=0;g<b.length;g++)a.attachShader(h,b[g]);
if(c)for(g=0;g<c.length;g++)a.bindAttribLocation(h,e?e[g]:g,c[g]);a.linkProgram(h);return a.getProgramParameter(h,a.LINK_STATUS)?h:(lastError=a.getProgramInfoLog(h),error("Error in program linking: "+lastError),a.deleteProgram(h),null)};e.textureTileSet=function(a,b,c){var e=1/a,h=1/b;return{tile:function(a,b){var k=e*b,l=h*a;return{textureCoord:function(a,b){return[k+c+(e-2*c)*a,l+c+(h-2*c)*b]}}}}};return k}(BC||{});BC=function(k){(k.Selector=k.Selector||{}).make=function(e,a,b){var c=a.ringMinY,f=a.ringMaxY;a=BC.Math.circlePoints(a.outerRingRadius+0.01,a.numRingCells,-Math.PI/2);var h=a.length-2,g=[],d=0;g[d++]=a[h]+0.001;g[d++]=c;g[d++]=-a[h+1]-0.001;g[d++]=a[0]+0.001;g[d++]=c;g[d++]=-a[1]-0.001;g[d++]=a[0]+0.001;g[d++]=f;g[d++]=-a[1]-0.001;g[d++]=a[h]+0.001;g[d++]=f;g[d++]=-a[h+1]-0.001;g[d++]=a[0]+0.001;g[d++]=c;g[d++]=-a[1]-0.001;g[d++]=a[2]+0.001;g[d++]=c;g[d++]=-a[3]-0.001;g[d++]=a[2]+0.001;g[d++]=f;g[d++]=
-a[3]-0.001;g[d++]=a[0]+0.001;g[d++]=f;g[d++]=-a[1]-0.001;var k=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,k);e.bufferData(e.ARRAY_BUFFER,new Float32Array(g),e.STATIC_DRAW);c=b.textureCoord(0,0);f=b.textureCoord(1,0);a=b.textureCoord(1,1);b=b.textureCoord(0,1);b=new Float32Array([].concat(c,f,a,b,c,f,a,b));var l=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,l);e.bufferData(e.ARRAY_BUFFER,b,e.STATIC_DRAW);var n=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7]),m=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,
m);e.bufferData(e.ELEMENT_ARRAY_BUFFER,n,e.STATIC_DRAW);return{draw:function(a){var b=a.positionLocation;a=a.textureCoordLocation;e.enable(e.BLEND);e.bindBuffer(e.ARRAY_BUFFER,k);e.enableVertexAttribArray(b);e.vertexAttribPointer(b,3,e.FLOAT,!1,0,0);e.bindBuffer(e.ARRAY_BUFFER,l);e.enableVertexAttribArray(a);e.vertexAttribPointer(a,2,e.FLOAT,!1,0,0);e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,m);e.drawElements(e.TRIANGLES,n.length,e.UNSIGNED_SHORT,0);e.disable(e.BLEND)}}};return k}(BC||{});BC=function(k){(k.Game=k.Game||{}).run=function(){function e(){return c.width!=c.clientWidth||c.height!=c.clientHeight?(c.width=c.clientWidth,c.height=c.clientHeight,!0):!1}function a(){var a=c.width/c.height,b=BC.Math.radians(90);return BC.Matrix.makePerspective(b,a,1,2E3)}function b(){f.clear(f.COLOR_BUFFER_BIT|f.DEPTH_BUFFER_BIT);f.viewport(0,0,f.canvas.width,f.canvas.height);var a=BC.Time.getTimeInSeconds(),c=a-u;u=a;f.uniformMatrix4fv(x,!1,n);f.uniformMatrix4fv(y,!1,d);m.update(c,a);s.draw();
requestAnimationFrame(b)}var c=document.getElementById("canvas");if(c){var f=c.getContext("webgl")||c.getContext("experimental-webgl");if(f){f.enable(f.CULL_FACE);f.enable(f.DEPTH_TEST);f.blendFunc(f.SRC_ALPHA,f.ONE_MINUS_SRC_ALPHA);var h=BC.GL.loadShader(f,"vertex-shader",f.VERTEX_SHADER),g=BC.GL.loadShader(f,"fragment-shader",f.FRAGMENT_SHADER),h=BC.GL.createProgram(f,[h,g]);f.useProgram(h);var h={positionLocation:f.getAttribLocation(h,"a_position"),textureCoordLocation:f.getAttribLocation(h,"a_texcoord"),
projectionMatrixLocation:f.getUniformLocation(h,"u_projectionMatrix"),viewMatrixLocation:f.getUniformLocation(h,"u_viewMatrix"),boardMatrixLocation:f.getUniformLocation(h,"u_boardMatrix"),ringMatrixLocation:f.getUniformLocation(h,"u_ringMatrix"),cellMatrixLocation:f.getUniformLocation(h,"u_cellMatrix")},g=BC.Matrix.makeLookAt([0,0.75,2],[0,0,0],[0,1,0]),d=BC.Matrix.makeInverse(g),k=f.createTexture();f.bindTexture(f.TEXTURE_2D,k);f.texImage2D(f.TEXTURE_2D,0,f.RGBA,1,1,0,f.RGBA,f.UNSIGNED_BYTE,new Uint8Array([0,
0,0,255]));var l=new Image;l.src="images/textures.png";$(l).load(function(){f.bindTexture(f.TEXTURE_2D,k);f.texImage2D(f.TEXTURE_2D,0,f.RGBA,f.RGBA,f.UNSIGNED_BYTE,l);f.generateMipmap(f.TEXTURE_2D)});e();var n=a();$(window).resize(function(){e()&&(n=a())});var m=BC.Board.makeModel({numRingCells:24,numBlockStyles:6,innerRingRadius:0.75,outerRingRadius:1,ringMaxY:0.15,ringMinY:-0.15}),s=BC.Board.makeView(m,f,h),p=BC.Common.Direction,q=0,t=0;$(c).on("touchstart touchmove touchend",function(a){var b=
a.originalEvent.changedTouches[0];switch(a.type){case "touchstart":q=b.pageX;t=b.pageY;break;case "touchend":a=b.pageX-q,b=b.pageY-t,50<a?m.move(p.LEFT):-50>a?m.move(p.RIGHT):50<b?m.move(p.DOWN):-50>b?m.move(p.UP):m.swap()}return!1});$(document).keydown(function(a){switch(a.keyCode){case 32:m.swap();break;case 37:m.move(p.LEFT);break;case 39:m.move(p.RIGHT);break;case 38:m.move(p.UP);break;case 40:m.move(p.DOWN)}return!1});var u=BC.Time.getTimeInSeconds(),x=h.projectionMatrixLocation,y=h.viewMatrixLocation;
b()}}};return k}(BC||{});$(document).ready(function(){BC.Game.run()});BC=function(k){var e=k.Math=k.Math||{};e.radians=function(a){return a*Math.PI/180};e.randomInt=function(a){return Math.floor(Math.random()*a)};e.circlePoints=function(a,b,c){c=c||0;for(var e=2*Math.PI/b,h=[],g=0;g<b;g++)h[2*g]=a*Math.cos(c+g*e),h[2*g+1]=a*Math.sin(c+g*e);return h};e.cross=function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]};e.subtractVectors=function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]};e.normalize=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+
a[2]*a[2]);return 1E-5<b?[a[0]/b,a[1]/b,a[2]/b]:[0,0,0]};return k}(BC||{});BC=function(k){(k.Cell=k.Cell||{}).make=function(e,a,b){var c=a.numRingCells,f=a.outerRingRadius,h=a.ringMaxY,g=a.ringMinY,d=-Math.PI/2;a=BC.Math.circlePoints(a.innerRingRadius,c,d);f=BC.Math.circlePoints(f,c,d);c=0;d=[];d[c++]=a[0];d[c++]=h;d[c++]=-a[1];d[c++]=f[0];d[c++]=h;d[c++]=-f[1];d[c++]=f[2];d[c++]=h;d[c++]=-f[3];d[c++]=a[2];d[c++]=h;d[c++]=-a[3];d[c++]=a[0];d[c++]=h;d[c++]=-a[1];d[c++]=a[0];d[c++]=g;d[c++]=-a[1];d[c++]=f[0];d[c++]=g;d[c++]=-f[1];d[c++]=f[0];d[c++]=h;d[c++]=-f[1];d[c++]=f[2];
d[c++]=h;d[c++]=-f[3];d[c++]=f[2];d[c++]=g;d[c++]=-f[3];d[c++]=a[2];d[c++]=g;d[c++]=-a[3];d[c++]=a[2];d[c++]=h;d[c++]=-a[3];d[c++]=f[0];d[c++]=h;d[c++]=-f[1];d[c++]=f[0];d[c++]=g;d[c++]=-f[1];d[c++]=f[2];d[c++]=g;d[c++]=-f[3];d[c++]=f[2];d[c++]=h;d[c++]=-f[3];d[c++]=a[2];d[c++]=h;d[c++]=-a[3];d[c++]=a[2];d[c++]=g;d[c++]=-a[3];d[c++]=a[0];d[c++]=g;d[c++]=-a[1];d[c++]=a[0];d[c++]=h;d[c++]=-a[1];var k=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,k);e.bufferData(e.ARRAY_BUFFER,new Float32Array(d),e.STATIC_DRAW);
h=[];for(c=0;c<b.length;c++)for(g=b[c],h[c]=[],f=a=0;5>a;a++)d=g.textureCoord(0,0),h[c][f++]=d[0],h[c][f++]=d[1],d=g.textureCoord(0,1),h[c][f++]=d[0],h[c][f++]=d[1],d=g.textureCoord(1,1),h[c][f++]=d[0],h[c][f++]=d[1],d=g.textureCoord(1,0),h[c][f++]=d[0],h[c][f++]=d[1];for(var l=[],c=0;c<b.length;c++)l[c]=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,l[c]),e.bufferData(e.ARRAY_BUFFER,new Float32Array(h[c]),e.STATIC_DRAW);b=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,
17,18,16,18,19]);var n=e.createBuffer();e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n);e.bufferData(e.ELEMENT_ARRAY_BUFFER,b,e.STATIC_DRAW);var m=b.length;return{draw:function(a,b){var c=b.positionLocation,d=b.textureCoordLocation;e.bindBuffer(e.ARRAY_BUFFER,k);e.enableVertexAttribArray(c);e.vertexAttribPointer(c,3,e.FLOAT,!1,0,0);e.bindBuffer(e.ARRAY_BUFFER,l[a.blockStyle]);e.enableVertexAttribArray(d);e.vertexAttribPointer(d,2,e.FLOAT,!1,0,0);e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n);e.drawElements(e.TRIANGLES,
m,e.UNSIGNED_SHORT,0)}}};return k}(BC||{});BC=function(k){(k.Util=k.Util||{}).error=function(e){window.console&&(window.console.error?window.console.error(e):window.console.log&&window.console.log(e))};return k}(BC||{});BC=function(k){(k.Common=k.Common||{}).Direction={NONE:0,UP:1,DOWN:2,LEFT:3,RIGHT:4};return k}(BC||{});BC=function(k){(k.Board=k.Board||{}).makeView=function(e,a,b){var c=b.boardMatrixLocation,f=b.ringMatrixLocation,h=b.cellMatrixLocation,g=BC.GL.textureTileSet(4,4,0.002),d=[g.tile(0,0),g.tile(0,1),g.tile(0,2),g.tile(0,3),g.tile(1,0),g.tile(1,1)],g=g.tile(1,2),k=BC.Cell.make(a,e,d),l=BC.Selector.make(a,e,g);return{draw:function(){a.uniformMatrix4fv(c,!1,e.boardMatrix);for(var d=e.rings,g=0;g<d.length;g++){a.uniformMatrix4fv(f,!1,d[g].matrix);for(var s=d[g].cells,p=0;p<s.length;p++)a.uniformMatrix4fv(h,
!1,s[p].matrix),k.draw(s[p],b)}a.uniformMatrix4fv(c,!1,e.selectorMatrix);a.uniformMatrix4fv(f,!1,BC.Matrix.identity);a.uniformMatrix4fv(h,!1,BC.Matrix.identity);l.draw(b)}}};return k}(BC||{});BC=function(k){(k.Board=k.Board||{}).makeModel=function(e){function a(a){for(var b=[],d=0;d<e.numRingCells;d++){var f=b,g=d,k=d,h=BC.Math.randomInt(e.numBlockStyles),k=[0,k*m,0],l=BC.Matrix.makeYRotation(k[1]);f[g]={blockStyle:h,matrix:l,state:c.NONE,rotation:k,currentSwapTime:0}}a=BC.Matrix.makeTranslation(0,-a*s,0);return{cells:b,matrix:a}}for(var b=BC.Common.Direction,c={NONE:0,SWAP_LEFT:1,SWAP_RIGHT:2},f=[],h=0,g=e.numRingCells-1,d=b.NONE,k=0,l=[0,0,0],n=[0,0,0],m=2*Math.PI/e.numRingCells,s=e.ringMaxY-
e.ringMinY,p={rings:f,boardMatrix:BC.Matrix.identity,selectorMatrix:BC.Matrix.identity,numRingCells:e.numRingCells,innerRingRadius:e.innerRingRadius,outerRingRadius:e.outerRingRadius,ringMaxY:e.ringMaxY,ringMinY:e.ringMinY,selectorTranslation:l,rotation:n,move:function(a){switch(a){case b.LEFT:d===b.NONE&&(d=b.LEFT,k=0,g--,0>g&&(g=e.numRingCells-1));break;case b.RIGHT:d===b.NONE&&(d=b.RIGHT,k=0,g++,g>=e.numRingCells&&(g=0));break;case b.UP:d===b.NONE&&0<h&&(d=b.UP,k=0,h--);break;case b.DOWN:d===b.NONE&&
h+1<f.length&&(d=b.DOWN,k=0,h++)}},swap:function(){console.log("ring: "+h+" cell: "+g);var a=f[h],b=a.cells[g],a=a.cells[(g+1)%a.cells.length],d=b.blockStyle;b.blockStyle=a.blockStyle;b.state=c.SWAP_RIGHT;b.rotation[1]+=m;b.currentSwapTime=0;a.blockStyle=d;a.state=c.SWAP_LEFT;a.rotation[1]-=m;a.currentSwapTime=0},update:function(a,e){for(var g=0;g<f.length;g++)for(var h=f[g].cells,q=0;q<h.length;q++){var r=h[q];if(r.state==c.SWAP_LEFT||r.state==c.SWAP_RIGHT){var v=a;0.125<r.currentSwapTime+a&&(v=
0.125-r.currentSwapTime);var w=m*v/0.125;r.rotation[1]=r.state==c.SWAP_LEFT?r.rotation[1]+w:r.rotation[1]-w;r.matrix=BC.Matrix.makeYRotation(r.rotation[1]);r.currentSwapTime+=v;0.125<=r.currentSwapTime&&(r.state=c.NONE,r.currentSwapTime=0)}}if(d!==b.NONE){0.05<k+a&&(a=0.05-k);g=a*s/0.05;h=a*m/0.05;switch(d){case b.UP:l[1]+=g;break;case b.DOWN:l[1]-=g;break;case b.LEFT:n[1]+=h;break;case b.RIGHT:n[1]-=h}k+=a;0.05<=k&&(d=b.NONE,k=0)}g=BC.Matrix.makeXRotation(n[0]);h=BC.Matrix.makeYRotation(n[1]);q=
BC.Matrix.makeZRotation(n[2]);h=BC.Matrix.matrixMultiply(q,h);h=BC.Matrix.matrixMultiply(h,g);p.boardMatrix=h;g=1+Math.abs(Math.sin(4*e))/25;g=BC.Matrix.makeScale(g,g,1);h=BC.Matrix.makeTranslation(l[0],l[1],l[2]);g=BC.Matrix.matrixMultiply(g,h);p.selectorMatrix=g}},q=0;3>q;q++)f[q]=a(q);return p};return k}(BC||{});
