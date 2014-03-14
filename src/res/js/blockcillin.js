var BC=function(c){var f=c.Matrix=c.Matrix||{};f.makeLookAt=function(a,b,d){b=BC.Math.normalize(BC.Math.subtractVectors(a,b));d=BC.Math.cross(d,b);var k=BC.Math.cross(b,d);return[d[0],d[1],d[2],0,k[0],k[1],k[2],0,b[0],b[1],b[2],0,a[0],a[1],a[2],1]};f.makePerspective=function(a,b,d,k){a=Math.tan(0.5*Math.PI-0.5*a);var g=1/(d-k);return[a/b,0,0,0,0,a,0,0,0,0,(d+k)*g,-1,0,0,d*k*g*2,0]};f.makeTranslation=function(a,b,d){return[1,0,0,0,0,1,0,0,0,0,1,0,a,b,d,1]};f.makeXRotation=function(a){var b=Math.cos(a);
a=Math.sin(a);return[1,0,0,0,0,b,a,0,0,-a,b,0,0,0,0,1]};f.makeYRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,0,-a,0,0,1,0,0,a,0,b,0,0,0,0,1]};f.makeZRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,a,0,0,-a,b,0,0,0,0,1,0,0,0,0,1]};f.makeScale=function(a,b,d){return[a,0,0,0,0,b,0,0,0,0,d,0,0,0,0,1]};f.makeInverse=function(a){var b=a[0],d=a[1],k=a[2],g=a[3],e=a[4],h=a[5],c=a[6],f=a[7],p=a[8],l=a[9],r=a[10],s=a[11],q=a[12],n=a[13],t=a[14];a=a[15];var v=r*a,u=t*s,m=c*a,w=
t*f,x=c*s,y=r*f,z=k*a,A=t*g,B=k*s,C=r*g,D=k*f,E=c*g,F=p*n,G=q*l,H=e*n,I=q*h,J=e*l,K=p*h,L=b*n,M=q*d,N=b*l,O=p*d,P=b*h,Q=e*d,S=v*h+w*l+x*n-(u*h+m*l+y*n),T=u*d+z*l+C*n-(v*d+A*l+B*n),n=m*d+A*h+D*n-(w*d+z*h+E*n),d=y*d+B*h+E*l-(x*d+C*h+D*l),h=1/(b*S+e*T+p*n+q*d);return[h*S,h*T,h*n,h*d,h*(u*e+m*p+y*q-(v*e+w*p+x*q)),h*(v*b+A*p+B*q-(u*b+z*p+C*q)),h*(w*b+z*e+E*q-(m*b+A*e+D*q)),h*(x*b+C*e+D*p-(y*b+B*e+E*p)),h*(F*f+I*s+J*a-(G*f+H*s+K*a)),h*(G*g+L*s+O*a-(F*g+M*s+N*a)),h*(H*g+M*f+P*a-(I*g+L*f+Q*a)),h*(K*g+N*f+
Q*s-(J*g+O*f+P*s)),h*(H*r+K*t+G*c-(J*t+F*c+I*r)),h*(N*t+F*k+M*r-(L*r+O*t+G*k)),h*(L*c+Q*t+I*k-(P*t+H*k+M*c)),h*(P*r+J*k+O*c-(N*c+Q*r+K*k))]};f.matrixMultiply=function(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12],a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13],a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12],a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13],a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14],a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*
b[15],a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12],a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13],a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12],a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13],a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14],a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]]};return c}(BC||{});$(document).ready(function(){BC.Game.run()});BC=function(c){(c.Time=c.Time||{}).getTimeInSeconds=function(){return 0.001*Date.now()};return c}(BC||{});BC=function(c){var f=c.GL=c.GL||{};f.loadShader=function(a,b,d,c){c=c||BC.Util.error;d=a.createShader(d);a.shaderSource(d,b);a.compileShader(d);return a.getShaderParameter(d,a.COMPILE_STATUS)?d:(lastError=a.getShaderInfoLog(d),c("*** Error compiling shader '"+d+"':"+lastError),a.deleteShader(d),null)};f.createProgram=function(a,b,d,c){for(var g=a.createProgram(),e=0;e<b.length;e++)a.attachShader(g,b[e]);if(d)for(e=0;e<d.length;e++)a.bindAttribLocation(g,c?c[e]:e,d[e]);a.linkProgram(g);return a.getProgramParameter(g,
a.LINK_STATUS)?g:(lastError=a.getProgramInfoLog(g),error("Error in program linking: "+lastError),a.deleteProgram(g),null)};return c}(BC||{});BC=function(c){(c.Game=c.Game||{}).run=function(){function c(){function g(){var a=BC.Time.getTimeInSeconds(),d=a-p;p=a;l[0]+=m[0]*d;l[1]+=m[1]*d;var c=BC.Matrix.makeZRotation(l[2]),a=BC.Matrix.makeYRotation(l[1]),d=BC.Matrix.makeXRotation(l[0]),c=BC.Matrix.matrixMultiply(r,c),c=BC.Matrix.matrixMultiply(c,a),c=BC.Matrix.matrixMultiply(c,d),c=BC.Matrix.matrixMultiply(c,s),c=BC.Matrix.matrixMultiply(c,q),c=BC.Matrix.matrixMultiply(c,t),a=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,a);b.bufferData(b.ARRAY_BUFFER,
new Float32Array([-1,1,1,-1,-1,1,1,-1,1,-1,1,1,1,-1,1,1,1,1,1,1,1,1,-1,1,1,-1,-1,1,1,1,1,-1,-1,1,1,-1,-1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,-1,-1,1,-1,-1,-1,-1,1,1,-1,-1,1,-1,1]),b.STATIC_DRAW);b.enableVertexAttribArray(f);b.vertexAttribPointer(f,3,b.FLOAT,!1,0,0);b.uniformMatrix4fv(U,!1,c);a=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,a);b.enableVertexAttribArray(R);b.vertexAttribPointer(R,
2,b.FLOAT,!1,0,0);b.bufferData(b.ARRAY_BUFFER,new Float32Array([0,0,0,1,1,1,0,0,1,1,1,0,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,0,0,0,0,1,1,1,1,0,1,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,0,1,0,0,1,0,0,1,1,0,1,1]),b.STATIC_DRAW);b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT);b.drawArrays(b.TRIANGLES,0,36);requestAnimationFrame(g)}var e=BC.GL.createProgram(b,[d,k]);b.useProgram(e);var f=b.getAttribLocation(e,"a_position"),R=b.getAttribLocation(e,"a_texcoord"),U=b.getUniformLocation(e,"u_matrix"),p=BC.Time.getTimeInSeconds(),
l=[BC.Math.radians(0),BC.Math.radians(0),BC.Math.radians(0)],e=[1,1,1],r=BC.Matrix.makeScale(e[0],e[1],e[2]),e=[0,0,0],s=BC.Matrix.makeTranslation(e[0],e[1],e[2]),e=BC.Matrix.makeLookAt([0,5,5],[0,0,0],[0,1,0]),q=BC.Matrix.makeInverse(e),e=a.width/a.height,n=BC.Math.radians(55),t=BC.Matrix.makePerspective(n,e,1,2E3),v=b.createTexture();b.bindTexture(b.TEXTURE_2D,v);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,1,1,0,b.RGBA,b.UNSIGNED_BYTE,new Uint8Array([0,0,255,255]));var u=new Image;u.src="images/texture.png";
u.addEventListener("load",function(){b.bindTexture(b.TEXTURE_2D,v);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,u);b.generateMipmap(b.TEXTURE_2D)});var m=[0,0,0];$(document).keydown(function(a){switch(a.keyCode){case 32:m[0]=0;m[1]=0;break;case 37:m[0]=0;m[1]=-1;break;case 38:m[0]=-1;m[1]=0;break;case 39:m[0]=0;m[1]=1;break;case 40:m[0]=1,m[1]=0}});g()}var a=document.getElementById("canvas");if(a){var b=a.getContext("webgl")||a.getContext("experimental-webgl");if(b){b.enable(b.CULL_FACE);
b.enable(b.DEPTH_TEST);var d,k;$.when($.get("/shaders/vertex.glsl",function(a){d=BC.GL.loadShader(b,a,b.VERTEX_SHADER)}),$.get("/shaders/fragment.glsl",function(a){k=BC.GL.loadShader(b,a,b.FRAGMENT_SHADER)})).then(c)}}};return c}(BC||{});BC=function(c){var f=c.Math=c.Math||{};f.radians=function(a){return a*Math.PI/180};f.circlePoints=function(a,b){for(var c=2*Math.PI/b,f=[],g=0;g<b;g++)f[2*g]=a*Math.cos(g*c),f[2*g+1]=a*Math.sin(g*c);return f};f.cross=function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]};f.subtractVectors=function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]};f.normalize=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return 1E-5<b?[a[0]/b,a[1]/b,a[2]/b]:[0,0,0]};return c}(BC||
{});BC=function(c){(c.Util=c.Util||{}).error=function(c){window.console&&(window.console.error?window.console.error(c):window.console.log&&window.console.log(c))};return c}(BC||{});
