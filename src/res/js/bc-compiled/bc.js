var BC=function(f){var g=f.Matrix=f.Matrix||{};g.makeLookAt=function(a,b,c){b=BC.Math.normalize(BC.Math.subtractVectors(a,b));c=BC.Math.cross(c,b);var m=BC.Math.cross(b,c);return[c[0],c[1],c[2],0,m[0],m[1],m[2],0,b[0],b[1],b[2],0,a[0],a[1],a[2],1]};g.makePerspective=function(a,b,c,m){a=Math.tan(0.5*Math.PI-0.5*a);var r=1/(c-m);return[a/b,0,0,0,0,a,0,0,0,0,(c+m)*r,-1,0,0,c*m*r*2,0]};g.makeTranslation=function(a,b,c){return[1,0,0,0,0,1,0,0,0,0,1,0,a,b,c,1]};g.makeXRotation=function(a){var b=Math.cos(a);
a=Math.sin(a);return[1,0,0,0,0,b,a,0,0,-a,b,0,0,0,0,1]};g.makeYRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,0,-a,0,0,1,0,0,a,0,b,0,0,0,0,1]};g.makeZRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,a,0,0,-a,b,0,0,0,0,1,0,0,0,0,1]};g.makeScale=function(a,b,c){return[a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1]};g.makeInverse=function(a){var b=a[0],c=a[1],m=a[2],r=a[3],g=a[4],l=a[5],f=a[6],p=a[7],v=a[8],x=a[9],y=a[10],z=a[11],s=a[12],q=a[13],n=a[14];a=a[15];var e=y*a,w=n*z,A=f*a,t=
n*p,B=f*z,C=y*p,D=m*a,d=n*r,h=m*z,k=y*r,u=m*p,E=f*r,F=v*q,H=s*x,I=g*q,J=s*l,K=g*x,L=v*l,M=b*q,N=s*c,O=b*x,P=v*c,Q=b*l,R=g*c,T=e*l+t*x+B*q-(w*l+A*x+C*q),U=w*c+D*x+k*q-(e*c+d*x+h*q),q=A*c+d*l+u*q-(t*c+D*l+E*q),c=C*c+h*l+E*x-(B*c+k*l+u*x),l=1/(b*T+g*U+v*q+s*c);return[l*T,l*U,l*q,l*c,l*(w*g+A*v+C*s-(e*g+t*v+B*s)),l*(e*b+d*v+h*s-(w*b+D*v+k*s)),l*(t*b+D*g+E*s-(A*b+d*g+u*s)),l*(B*b+k*g+u*v-(C*b+h*g+E*v)),l*(F*p+J*z+K*a-(H*p+I*z+L*a)),l*(H*r+M*z+P*a-(F*r+N*z+O*a)),l*(I*r+N*p+Q*a-(J*r+M*p+R*a)),l*(L*r+O*p+
R*z-(K*r+P*p+Q*z)),l*(I*y+L*n+H*f-(K*n+F*f+J*y)),l*(O*n+F*m+N*y-(M*y+P*n+H*m)),l*(M*f+R*n+J*m-(Q*n+I*m+N*f)),l*(Q*y+K*m+P*f-(O*f+R*y+L*m))]};g.matrixMultiply=function(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12],a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13],a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12],a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13],a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14],a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*
b[15],a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12],a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13],a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12],a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13],a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14],a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]]};return f}(BC||{});BC=function(f){(f.Time=f.Time||{}).getTimeInSeconds=function(){return 0.001*Date.now()};return f}(BC||{});BC=function(f){var g=f.GL=f.GL||{};g.loadShader=function(a,b,c,m){m=m||BC.Util.error;var g=document.getElementById(b);if(!g)return m("** Error getting script element:"+b),null;b=a.createShader(c);a.shaderSource(b,g.text);a.compileShader(b);return a.getShaderParameter(b,a.COMPILE_STATUS)?b:(lastError=a.getShaderInfoLog(b),m("*** Error compiling shader '"+b+"':"+lastError),a.deleteShader(b),null)};g.createProgram=function(a,b,c,m){for(var g=a.createProgram(),f=0;f<b.length;f++)a.attachShader(g,b[f]);
if(c)for(f=0;f<c.length;f++)a.bindAttribLocation(g,m?m[f]:f,c[f]);a.linkProgram(g);return a.getProgramParameter(g,a.LINK_STATUS)?g:(lastError=a.getProgramInfoLog(g),error("Error in program linking: "+lastError),a.deleteProgram(g),null)};g.textureTileSet=function(a,b,c){var g=1/a,f=1/b;return{tile:function(a,b){var G=g*b,p=f*a;return{textureCoord:function(a,b){return[G+c+(g-2*c)*a,p+c+(f-2*c)*b]}}}}};return f}(BC||{});BC=function(f){(f.Game=f.Game||{}).run=function(){function g(){var a=BC.Time.getTimeInSeconds(),c=a-G;G=a;p[0]+=n[0]*c;p[1]+=n[1]*c;var d=BC.Matrix.makeZRotation(p[2]),a=BC.Matrix.makeYRotation(p[1]),c=BC.Matrix.makeXRotation(p[0]),d=BC.Matrix.matrixMultiply(v,d),d=BC.Matrix.matrixMultiply(d,a),d=BC.Matrix.matrixMultiply(d,c),d=BC.Matrix.matrixMultiply(d,x),d=BC.Matrix.matrixMultiply(d,y),d=BC.Matrix.matrixMultiply(d,z),a=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,a);b.bufferData(b.ARRAY_BUFFER,
E,b.STATIC_DRAW);b.enableVertexAttribArray(r);b.vertexAttribPointer(r,3,b.FLOAT,!1,0,0);b.uniformMatrix4fv(l,!1,d);a=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,a);b.enableVertexAttribArray(S);b.vertexAttribPointer(S,2,b.FLOAT,!1,0,0);b.bufferData(b.ARRAY_BUFFER,F,b.STATIC_DRAW);b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT);b.drawArrays(b.TRIANGLES,0,e.length/3);requestAnimationFrame(g)}var a=document.getElementById("canvas");if(a){var b=a.getContext("webgl")||a.getContext("experimental-webgl");
if(b){b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);var c=BC.GL.loadShader(b,"vertex-shader",b.VERTEX_SHADER),f=BC.GL.loadShader(b,"fragment-shader",b.FRAGMENT_SHADER),c=BC.GL.createProgram(b,[c,f]);b.useProgram(c);var r=b.getAttribLocation(c,"a_position"),S=b.getAttribLocation(c,"a_texcoord"),l=b.getUniformLocation(c,"u_matrix"),G=BC.Time.getTimeInSeconds(),p=[BC.Math.radians(0),BC.Math.radians(0),BC.Math.radians(0)],c=[1,1,1],v=BC.Matrix.makeScale(c[0],c[1],c[2]),c=[0,0,0],x=BC.Matrix.makeTranslation(c[0],
c[1],c[2]),c=BC.Matrix.makeLookAt([0,0.75,2],[0,0,0],[0,1,0]),y=BC.Matrix.makeInverse(c),a=a.width/a.height,c=BC.Math.radians(55),z=BC.Matrix.makePerspective(c,a,1,2E3),s=b.createTexture();b.bindTexture(b.TEXTURE_2D,s);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,1,1,0,b.RGBA,b.UNSIGNED_BYTE,new Uint8Array([255,0,0,255]));var q=new Image;q.src="images/block-texture.png";q.addEventListener("load",function(){b.bindTexture(b.TEXTURE_2D,s);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,q);b.generateMipmap(b.TEXTURE_2D)});
var n=[0,0,0];$(document).keydown(function(a){switch(a.keyCode){case 32:n[0]=0;n[1]=0;break;case 37:n[0]=0;n[1]=-1;break;case 38:n[0]=-1;n[1]=0;break;case 39:n[0]=0;n[1]=1;break;case 40:n[0]=1,n[1]=0}});for(var a=BC.Math.circlePoints(0.75,24),c=BC.Math.circlePoints(1,24),f=BC.GL.textureTileSet(4,4,0.01),f=[f.tile(0,0),f.tile(0,1),f.tile(0,2),f.tile(0,3),f.tile(1,0),f.tile(1,1)],e=[],w=[],A=0,t=function(a,b,c,d,e,f,g){b=a.textureCoord(b,c);w[A++]=b[0];w[A++]=b[1];b=a.textureCoord(d,e);w[A++]=b[0];
w[A++]=b[1];b=a.textureCoord(f,g);w[A++]=b[0];w[A++]=b[1]},B=0,C=0,D=0,d=0,h=0;24>D;D++,h+=2){for(var k=(h+2)%c.length;C===B;)B=Math.floor(Math.random()*f.length);var C=B,u=f[B];e[d++]=a[h];e[d++]=0.15;e[d++]=-a[h+1];e[d++]=c[h];e[d++]=0.15;e[d++]=-c[h+1];e[d++]=c[k];e[d++]=0.15;e[d++]=-c[k+1];t(u,1,1,1,0,0,0);e[d++]=a[h];e[d++]=0.15;e[d++]=-a[h+1];e[d++]=c[k];e[d++]=0.15;e[d++]=-c[k+1];e[d++]=a[k];e[d++]=0.15;e[d++]=-a[k+1];t(u,1,1,0,0,0,1);e[d++]=a[h];e[d++]=-0.15;e[d++]=-a[h+1];e[d++]=c[k];e[d++]=
-0.15;e[d++]=-c[k+1];e[d++]=c[h];e[d++]=-0.15;e[d++]=-c[h+1];t(u,1,1,0,0,1,0);e[d++]=a[h];e[d++]=-0.15;e[d++]=-a[h+1];e[d++]=a[k];e[d++]=-0.15;e[d++]=-a[k+1];e[d++]=c[k];e[d++]=-0.15;e[d++]=-c[k+1];t(u,1,1,0,1,0,0);e[d++]=c[h];e[d++]=-0.15;e[d++]=-c[h+1];e[d++]=c[k];e[d++]=-0.15;e[d++]=-c[k+1];e[d++]=c[k];e[d++]=0.15;e[d++]=-c[k+1];t(u,0,1,1,1,1,0);e[d++]=c[h];e[d++]=-0.15;e[d++]=-c[h+1];e[d++]=c[k];e[d++]=0.15;e[d++]=-c[k+1];e[d++]=c[h];e[d++]=0.15;e[d++]=-c[h+1];t(u,0,1,1,0,0,0);e[d++]=a[h];e[d++]=
-0.15;e[d++]=-a[h+1];e[d++]=a[k];e[d++]=0.15;e[d++]=-a[k+1];e[d++]=a[k];e[d++]=-0.15;e[d++]=-a[k+1];t(u,0,1,1,0,1,1);e[d++]=a[h];e[d++]=-0.15;e[d++]=-a[h+1];e[d++]=a[h];e[d++]=0.15;e[d++]=-a[h+1];e[d++]=a[k];e[d++]=0.15;e[d++]=-a[k+1];t(u,0,1,0,0,1,0)}var E=new Float32Array(e),F=new Float32Array(w);g()}}};return f}(BC||{});$(document).ready(function(){BC.Game.run()});BC=function(f){var g=f.Math=f.Math||{};g.radians=function(a){return a*Math.PI/180};g.circlePoints=function(a,b){for(var c=2*Math.PI/b,f=[],g=0;g<b;g++)f[2*g]=a*Math.cos(g*c),f[2*g+1]=a*Math.sin(g*c);return f};g.cross=function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]};g.subtractVectors=function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]};g.normalize=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return 1E-5<b?[a[0]/b,a[1]/b,a[2]/b]:[0,0,0]};return f}(BC||
{});BC=function(f){(f.Util=f.Util||{}).error=function(f){window.console&&(window.console.error?window.console.error(f):window.console.log&&window.console.log(f))};return f}(BC||{});
