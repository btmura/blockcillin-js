var BC=function(h){var c=h.Matrix=h.Matrix||{};c.makeLookAt=function(a,b,c){b=BC.Math.normalize(BC.Math.subtractVectors(a,b));c=BC.Math.cross(c,b);var d=BC.Math.cross(b,c);return[c[0],c[1],c[2],0,d[0],d[1],d[2],0,b[0],b[1],b[2],0,a[0],a[1],a[2],1]};c.makePerspective=function(a,b,c,d){a=Math.tan(0.5*Math.PI-0.5*a);var e=1/(c-d);return[a/b,0,0,0,0,a,0,0,0,0,(c+d)*e,-1,0,0,c*d*e*2,0]};c.makeTranslation=function(a,b,c){return[1,0,0,0,0,1,0,0,0,0,1,0,a,b,c,1]};c.makeXRotation=function(a){var b=Math.cos(a);
a=Math.sin(a);return[1,0,0,0,0,b,a,0,0,-a,b,0,0,0,0,1]};c.makeYRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,0,-a,0,0,1,0,0,a,0,b,0,0,0,0,1]};c.makeZRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,a,0,0,-a,b,0,0,0,0,1,0,0,0,0,1]};c.makeScale=function(a,b,c){return[a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1]};c.makeInverse=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],k=a[4],l=a[5],h=a[6],t=a[7],u=a[8],p=a[9],A=a[10],B=a[11],y=a[12],r=a[13],v=a[14];a=a[15];var q=A*a,s=v*B,f=h*a,z=
v*t,C=h*B,w=A*t,D=d*a,E=v*e,F=d*B,g=A*e,m=d*t,n=h*e,x=u*r,G=y*p,H=k*r,I=y*l,J=k*p,K=u*l,L=b*r,M=y*c,N=b*p,O=u*c,P=b*l,Q=k*c,S=q*l+z*p+C*r-(s*l+f*p+w*r),T=s*c+D*p+g*r-(q*c+E*p+F*r),r=f*c+E*l+m*r-(z*c+D*l+n*r),c=w*c+F*l+n*p-(C*c+g*l+m*p),l=1/(b*S+k*T+u*r+y*c);return[l*S,l*T,l*r,l*c,l*(s*k+f*u+w*y-(q*k+z*u+C*y)),l*(q*b+E*u+F*y-(s*b+D*u+g*y)),l*(z*b+D*k+n*y-(f*b+E*k+m*y)),l*(C*b+g*k+m*u-(w*b+F*k+n*u)),l*(x*t+I*B+J*a-(G*t+H*B+K*a)),l*(G*e+L*B+O*a-(x*e+M*B+N*a)),l*(H*e+M*t+P*a-(I*e+L*t+Q*a)),l*(K*e+N*t+
Q*B-(J*e+O*t+P*B)),l*(H*A+K*v+G*h-(J*v+x*h+I*A)),l*(N*v+x*d+M*A-(L*A+O*v+G*d)),l*(L*h+Q*v+I*d-(P*v+H*d+M*h)),l*(P*A+J*d+O*h-(N*h+Q*A+K*d))]};c.matrixMultiply=function(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12],a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13],a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12],a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13],a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14],a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*
b[15],a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12],a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13],a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12],a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13],a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14],a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]]};return h}(BC||{});BC=function(h){(h.Time=h.Time||{}).getTimeInSeconds=function(){return 0.001*Date.now()};return h}(BC||{});BC=function(h){var c=h.GL=h.GL||{};c.loadShader=function(a,b,c,d){d=d||BC.Util.error;var e=document.getElementById(b);if(!e)return d("** Error getting script element:"+b),null;b=a.createShader(c);a.shaderSource(b,e.text);a.compileShader(b);return a.getShaderParameter(b,a.COMPILE_STATUS)?b:(lastError=a.getShaderInfoLog(b),d("*** Error compiling shader '"+b+"':"+lastError),a.deleteShader(b),null)};c.createProgram=function(a,b,c,d){for(var e=a.createProgram(),k=0;k<b.length;k++)a.attachShader(e,b[k]);
if(c)for(k=0;k<c.length;k++)a.bindAttribLocation(e,d?d[k]:k,c[k]);a.linkProgram(e);return a.getProgramParameter(e,a.LINK_STATUS)?e:(lastError=a.getProgramInfoLog(e),error("Error in program linking: "+lastError),a.deleteProgram(e),null)};c.textureTileSet=function(a,b,c){var d=1/a,e=1/b;return{tile:function(a,b){var h=d*b,t=e*a;return{textureCoord:function(a,b){return[h+c+(d-2*c)*a,t+c+(e-2*c)*b]}}}}};return h}(BC||{});BC=function(h){(h.Selector=h.Selector||{}).makeSelector=function(c){var a=new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]),b=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,b);c.bufferData(c.ARRAY_BUFFER,a,c.STATIC_DRAW);var h=new Uint16Array([0,1,2,0,2,3]),d=c.createBuffer();c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,d);c.bufferData(c.ELEMENT_ARRAY_BUFFER,h,c.STATIC_DRAW);var a=new Float32Array([0,0,1,0,1,1,0,1]),e=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,e);c.bufferData(c.ARRAY_BUFFER,a,c.STATIC_DRAW);return{draw:function(a,
l){c.bindBuffer(c.ARRAY_BUFFER,b);c.enableVertexAttribArray(a);c.vertexAttribPointer(a,3,c.FLOAT,!1,0,0);c.bindBuffer(c.ARRAY_BUFFER,e);c.enableVertexAttribArray(l);c.vertexAttribPointer(l,2,c.FLOAT,!1,0,0);c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,d);c.drawElements(c.TRIANGLES,h.length,c.UNSIGNED_SHORT,0)}}};return h}(BC||{});BC=function(h){(h.Game=h.Game||{}).run=function(){function c(){return h.width!=h.clientWidth||h.height!=h.clientHeight?(h.width=h.clientWidth,h.height=h.clientHeight,!0):!1}function a(){var a=h.width/h.height,b=BC.Math.radians(90);return BC.Matrix.makePerspective(b,a,1,2E3)}function b(){d.viewport(0,0,d.canvas.width,d.canvas.height);var a=BC.Time.getTimeInSeconds(),c=a-u;u=a;p[0]+=q[0]*c;p[1]+=q[1]*c;var e=BC.Matrix.makeZRotation(p[2]),a=BC.Matrix.makeYRotation(p[1]),c=BC.Matrix.makeXRotation(p[0]),
e=BC.Matrix.matrixMultiply(A,e),e=BC.Matrix.matrixMultiply(e,a),e=BC.Matrix.matrixMultiply(e,c),e=BC.Matrix.matrixMultiply(e,B),e=BC.Matrix.matrixMultiply(e,y),e=BC.Matrix.matrixMultiply(e,G);d.uniformMatrix4fv(t,!1,e);d.clear(d.COLOR_BUFFER_BIT|d.DEPTH_BUFFER_BIT);d.bindBuffer(d.ARRAY_BUFFER,H);d.enableVertexAttribArray(l);d.vertexAttribPointer(l,3,d.FLOAT,!1,0,0);d.bindBuffer(d.ARRAY_BUFFER,I);d.enableVertexAttribArray(R);d.vertexAttribPointer(R,2,d.FLOAT,!1,0,0);d.drawArrays(d.TRIANGLES,0,f.length/
3);J.draw(l,R);requestAnimationFrame(b)}var h=document.getElementById("canvas");if(h){var d=h.getContext("webgl")||h.getContext("experimental-webgl");if(d){d.enable(d.CULL_FACE);d.enable(d.DEPTH_TEST);var e=BC.GL.loadShader(d,"vertex-shader",d.VERTEX_SHADER),k=BC.GL.loadShader(d,"fragment-shader",d.FRAGMENT_SHADER),e=BC.GL.createProgram(d,[e,k]);d.useProgram(e);var l=d.getAttribLocation(e,"a_position"),R=d.getAttribLocation(e,"a_texcoord"),t=d.getUniformLocation(e,"u_matrix"),u=BC.Time.getTimeInSeconds(),
p=[BC.Math.radians(0),BC.Math.radians(0),BC.Math.radians(0)],e=[1,1,1],A=BC.Matrix.makeScale(e[0],e[1],e[2]),e=[0,0,0],B=BC.Matrix.makeTranslation(e[0],e[1],e[2]),e=BC.Matrix.makeLookAt([0,0.75,2],[0,0,0],[0,1,0]),y=BC.Matrix.makeInverse(e),r=d.createTexture();d.bindTexture(d.TEXTURE_2D,r);d.texImage2D(d.TEXTURE_2D,0,d.RGBA,1,1,0,d.RGBA,d.UNSIGNED_BYTE,new Uint8Array([255,0,0,255]));var v=new Image;v.src="images/block-texture.png";$(v).load(function(){d.bindTexture(d.TEXTURE_2D,r);d.texImage2D(d.TEXTURE_2D,
0,d.RGBA,d.RGBA,d.UNSIGNED_BYTE,v);d.generateMipmap(d.TEXTURE_2D)});var q=[0,0,0];$(document).keydown(function(a){switch(a.keyCode){case 32:q[0]=0;q[1]=0;break;case 37:q[0]=0;q[1]=-1;break;case 38:q[0]=-1;q[1]=0;break;case 39:q[0]=0;q[1]=1;break;case 40:q[0]=1,q[1]=0}});for(var e=BC.Math.circlePoints(0.75,24),k=BC.Math.circlePoints(1,24),s=BC.GL.textureTileSet(4,4,0.01),s=[s.tile(0,0),s.tile(0,1),s.tile(0,2),s.tile(0,3),s.tile(1,0),s.tile(1,1)],f=[],z=[],C=0,w=function(a,b,c,d,e,f,g){b=a.textureCoord(b,
c);z[C++]=b[0];z[C++]=b[1];b=a.textureCoord(d,e);z[C++]=b[0];z[C++]=b[1];b=a.textureCoord(f,g);z[C++]=b[0];z[C++]=b[1]},D=0,E=0,F=0,g=0,m=0;24>F;F++,m+=2){for(var n=(m+2)%k.length;E===D;)D=Math.floor(Math.random()*s.length);var E=D,x=s[D];f[g++]=e[m];f[g++]=0.15;f[g++]=-e[m+1];f[g++]=k[m];f[g++]=0.15;f[g++]=-k[m+1];f[g++]=k[n];f[g++]=0.15;f[g++]=-k[n+1];w(x,0,0,0,1,1,1);f[g++]=e[m];f[g++]=0.15;f[g++]=-e[m+1];f[g++]=k[n];f[g++]=0.15;f[g++]=-k[n+1];f[g++]=e[n];f[g++]=0.15;f[g++]=-e[n+1];w(x,0,0,1,1,
1,0);f[g++]=e[m];f[g++]=-0.15;f[g++]=-e[m+1];f[g++]=k[n];f[g++]=-0.15;f[g++]=-k[n+1];f[g++]=k[m];f[g++]=-0.15;f[g++]=-k[m+1];w(x,0,0,1,1,0,1);f[g++]=e[m];f[g++]=-0.15;f[g++]=-e[m+1];f[g++]=e[n];f[g++]=-0.15;f[g++]=-e[n+1];f[g++]=k[n];f[g++]=-0.15;f[g++]=-k[n+1];w(x,0,0,1,0,1,1);f[g++]=k[m];f[g++]=-0.15;f[g++]=-k[m+1];f[g++]=k[n];f[g++]=-0.15;f[g++]=-k[n+1];f[g++]=k[n];f[g++]=0.15;f[g++]=-k[n+1];w(x,0,1,1,1,1,0);f[g++]=k[m];f[g++]=-0.15;f[g++]=-k[m+1];f[g++]=k[n];f[g++]=0.15;f[g++]=-k[n+1];f[g++]=
k[m];f[g++]=0.15;f[g++]=-k[m+1];w(x,0,1,1,0,0,0);f[g++]=e[m];f[g++]=-0.15;f[g++]=-e[m+1];f[g++]=e[n];f[g++]=0.15;f[g++]=-e[n+1];f[g++]=e[n];f[g++]=-0.15;f[g++]=-e[n+1];w(x,0,1,1,0,1,1);f[g++]=e[m];f[g++]=-0.15;f[g++]=-e[m+1];f[g++]=e[m];f[g++]=0.15;f[g++]=-e[m+1];f[g++]=e[n];f[g++]=0.15;f[g++]=-e[n+1];w(x,0,1,0,0,1,0)}e=new Float32Array(f);k=new Float32Array(z);c();var G=a();$(window).resize(function(){c()&&(G=a())});var H=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,H);d.bufferData(d.ARRAY_BUFFER,
e,d.STATIC_DRAW);var I=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,I);d.bufferData(d.ARRAY_BUFFER,k,d.STATIC_DRAW);var J=BC.Selector.makeSelector(d);b()}}};return h}(BC||{});$(document).ready(function(){BC.Game.run()});BC=function(h){var c=h.Math=h.Math||{};c.radians=function(a){return a*Math.PI/180};c.circlePoints=function(a,b){for(var c=2*Math.PI/b,d=[],e=0;e<b;e++)d[2*e]=a*Math.cos(e*c),d[2*e+1]=a*Math.sin(e*c);return d};c.cross=function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]};c.subtractVectors=function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]};c.normalize=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return 1E-5<b?[a[0]/b,a[1]/b,a[2]/b]:[0,0,0]};return h}(BC||
{});BC=function(h){(h.Util=h.Util||{}).error=function(c){window.console&&(window.console.error?window.console.error(c):window.console.log&&window.console.log(c))};return h}(BC||{});
