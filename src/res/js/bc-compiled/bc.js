var BC=function(g){var k=g.Matrix=g.Matrix||{};k.makeLookAt=function(a,b,d){b=BC.Math.normalize(BC.Math.subtractVectors(a,b));d=BC.Math.cross(d,b);var c=BC.Math.cross(b,d);return[d[0],d[1],d[2],0,c[0],c[1],c[2],0,b[0],b[1],b[2],0,a[0],a[1],a[2],1]};k.makePerspective=function(a,b,d,c){a=Math.tan(0.5*Math.PI-0.5*a);var t=1/(d-c);return[a/b,0,0,0,0,a,0,0,0,0,(d+c)*t,-1,0,0,d*c*t*2,0]};k.makeTranslation=function(a,b,d){return[1,0,0,0,0,1,0,0,0,0,1,0,a,b,d,1]};k.makeXRotation=function(a){var b=Math.cos(a);
a=Math.sin(a);return[1,0,0,0,0,b,a,0,0,-a,b,0,0,0,0,1]};k.makeYRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,0,-a,0,0,1,0,0,a,0,b,0,0,0,0,1]};k.makeZRotation=function(a){var b=Math.cos(a);a=Math.sin(a);return[b,a,0,0,-a,b,0,0,0,0,1,0,0,0,0,1]};k.makeScale=function(a,b,d){return[a,0,0,0,0,b,0,0,0,0,d,0,0,0,0,1]};k.makeInverse=function(a){var b=a[0],d=a[1],c=a[2],t=a[3],k=a[4],n=a[5],g=a[6],q=a[7],u=a[8],v=a[9],w=a[10],x=a[11],s=a[12],r=a[13],p=a[14];a=a[15];var e=w*a,y=p*x,f=g*a,l=
p*q,h=g*x,m=w*q,z=c*a,A=p*t,B=c*x,C=w*t,D=c*q,E=g*t,F=u*r,G=s*v,H=k*r,I=s*n,J=k*v,K=u*n,L=b*r,M=s*d,N=b*v,O=u*d,P=b*n,Q=k*d,T=e*n+l*v+h*r-(y*n+f*v+m*r),U=y*d+z*v+C*r-(e*d+A*v+B*r),r=f*d+A*n+D*r-(l*d+z*n+E*r),d=m*d+B*n+E*v-(h*d+C*n+D*v),n=1/(b*T+k*U+u*r+s*d);return[n*T,n*U,n*r,n*d,n*(y*k+f*u+m*s-(e*k+l*u+h*s)),n*(e*b+A*u+B*s-(y*b+z*u+C*s)),n*(l*b+z*k+E*s-(f*b+A*k+D*s)),n*(h*b+C*k+D*u-(m*b+B*k+E*u)),n*(F*q+I*x+J*a-(G*q+H*x+K*a)),n*(G*t+L*x+O*a-(F*t+M*x+N*a)),n*(H*t+M*q+P*a-(I*t+L*q+Q*a)),n*(K*t+N*q+
Q*x-(J*t+O*q+P*x)),n*(H*w+K*p+G*g-(J*p+F*g+I*w)),n*(N*p+F*c+M*w-(L*w+O*p+G*c)),n*(L*g+Q*p+I*c-(P*p+H*c+M*g)),n*(P*w+J*c+O*g-(N*g+Q*w+K*c))]};k.matrixMultiply=function(a,b){return[a[0]*b[0]+a[1]*b[4]+a[2]*b[8]+a[3]*b[12],a[0]*b[1]+a[1]*b[5]+a[2]*b[9]+a[3]*b[13],a[0]*b[2]+a[1]*b[6]+a[2]*b[10]+a[3]*b[14],a[0]*b[3]+a[1]*b[7]+a[2]*b[11]+a[3]*b[15],a[4]*b[0]+a[5]*b[4]+a[6]*b[8]+a[7]*b[12],a[4]*b[1]+a[5]*b[5]+a[6]*b[9]+a[7]*b[13],a[4]*b[2]+a[5]*b[6]+a[6]*b[10]+a[7]*b[14],a[4]*b[3]+a[5]*b[7]+a[6]*b[11]+a[7]*
b[15],a[8]*b[0]+a[9]*b[4]+a[10]*b[8]+a[11]*b[12],a[8]*b[1]+a[9]*b[5]+a[10]*b[9]+a[11]*b[13],a[8]*b[2]+a[9]*b[6]+a[10]*b[10]+a[11]*b[14],a[8]*b[3]+a[9]*b[7]+a[10]*b[11]+a[11]*b[15],a[12]*b[0]+a[13]*b[4]+a[14]*b[8]+a[15]*b[12],a[12]*b[1]+a[13]*b[5]+a[14]*b[9]+a[15]*b[13],a[12]*b[2]+a[13]*b[6]+a[14]*b[10]+a[15]*b[14],a[12]*b[3]+a[13]*b[7]+a[14]*b[11]+a[15]*b[15]]};return g}(BC||{});BC=function(g){(g.Time=g.Time||{}).getTimeInSeconds=function(){return 0.001*Date.now()};return g}(BC||{});BC=function(g){var k=g.GL=g.GL||{};k.loadShader=function(a,b,d,c){c=c||BC.Util.error;var k=document.getElementById(b);if(!k)return c("** Error getting script element:"+b),null;b=a.createShader(d);a.shaderSource(b,k.text);a.compileShader(b);return a.getShaderParameter(b,a.COMPILE_STATUS)?b:(lastError=a.getShaderInfoLog(b),c("*** Error compiling shader '"+b+"':"+lastError),a.deleteShader(b),null)};k.createProgram=function(a,b,d,c){for(var k=a.createProgram(),g=0;g<b.length;g++)a.attachShader(k,b[g]);
if(d)for(g=0;g<d.length;g++)a.bindAttribLocation(k,c?c[g]:g,d[g]);a.linkProgram(k);return a.getProgramParameter(k,a.LINK_STATUS)?k:(lastError=a.getProgramInfoLog(k),error("Error in program linking: "+lastError),a.deleteProgram(k),null)};return g}(BC||{});BC=function(g){(g.Game=g.Game||{}).run=function(){function k(){var a=BC.Time.getTimeInSeconds(),d=a-S;S=a;q[0]+=p[0]*d;q[1]+=p[1]*d;var c=BC.Matrix.makeZRotation(q[2]),a=BC.Matrix.makeYRotation(q[1]),d=BC.Matrix.makeXRotation(q[0]),c=BC.Matrix.matrixMultiply(u,c),c=BC.Matrix.matrixMultiply(c,a),c=BC.Matrix.matrixMultiply(c,d),c=BC.Matrix.matrixMultiply(c,v),c=BC.Matrix.matrixMultiply(c,w),c=BC.Matrix.matrixMultiply(c,x),a=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,a);b.bufferData(b.ARRAY_BUFFER,
z,b.STATIC_DRAW);b.enableVertexAttribArray(g);b.vertexAttribPointer(g,3,b.FLOAT,!1,0,0);b.uniformMatrix4fv(n,!1,c);a=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,a);b.enableVertexAttribArray(R);b.vertexAttribPointer(R,2,b.FLOAT,!1,0,0);b.bufferData(b.ARRAY_BUFFER,A,b.STATIC_DRAW);b.clear(b.COLOR_BUFFER_BIT|b.DEPTH_BUFFER_BIT);b.drawArrays(b.TRIANGLES,0,e.length/3);requestAnimationFrame(k)}var a=document.getElementById("canvas");if(a){var b=a.getContext("webgl")||a.getContext("experimental-webgl");
if(b){b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);var d=BC.GL.loadShader(b,"vertex-shader",b.VERTEX_SHADER),c=BC.GL.loadShader(b,"fragment-shader",b.FRAGMENT_SHADER),d=BC.GL.createProgram(b,[d,c]);b.useProgram(d);var g=b.getAttribLocation(d,"a_position"),R=b.getAttribLocation(d,"a_texcoord"),n=b.getUniformLocation(d,"u_matrix"),S=BC.Time.getTimeInSeconds(),q=[BC.Math.radians(0),BC.Math.radians(0),BC.Math.radians(0)],d=[1,1,1],u=BC.Matrix.makeScale(d[0],d[1],d[2]),d=[0,0,0],v=BC.Matrix.makeTranslation(d[0],
d[1],d[2]),d=BC.Matrix.makeLookAt([0,1,2],[0,0,0],[0,1,0]),w=BC.Matrix.makeInverse(d),a=a.width/a.height,d=BC.Math.radians(55),x=BC.Matrix.makePerspective(d,a,1,2E3),s=b.createTexture();b.bindTexture(b.TEXTURE_2D,s);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,1,1,0,b.RGBA,b.UNSIGNED_BYTE,new Uint8Array([255,0,0,255]));var r=new Image;r.src="images/texture.png";r.addEventListener("load",function(){b.bindTexture(b.TEXTURE_2D,s);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,r);b.generateMipmap(b.TEXTURE_2D)});
var p=[0,0,0];$(document).keydown(function(a){switch(a.keyCode){case 32:p[0]=0;p[1]=0;break;case 37:p[0]=0;p[1]=-1;break;case 38:p[0]=-1;p[1]=0;break;case 39:p[0]=0;p[1]=1;break;case 40:p[0]=1,p[1]=0}});for(var a=BC.Math.circlePoints(0.7,16),d=BC.Math.circlePoints(1,16),e=[],c=[],y=0,f=0,l=0,h=0;16>y;y++,l+=2){var m=(l+2)%d.length;e[f++]=a[l];e[f++]=0.2;e[f++]=-a[l+1];e[f++]=d[l];e[f++]=0.2;e[f++]=-d[l+1];e[f++]=d[m];e[f++]=0.2;e[f++]=-d[m+1];c[h++]=1;c[h++]=1;c[h++]=1;c[h++]=0;c[h++]=0;c[h++]=0;
e[f++]=a[l];e[f++]=0.2;e[f++]=-a[l+1];e[f++]=d[m];e[f++]=0.2;e[f++]=-d[m+1];e[f++]=a[m];e[f++]=0.2;e[f++]=-a[m+1];c[h++]=1;c[h++]=1;c[h++]=0;c[h++]=0;c[h++]=0;c[h++]=1;e[f++]=a[l];e[f++]=-0.2;e[f++]=-a[l+1];e[f++]=d[m];e[f++]=-0.2;e[f++]=-d[m+1];e[f++]=d[l];e[f++]=-0.2;e[f++]=-d[l+1];c[h++]=1;c[h++]=1;c[h++]=0;c[h++]=0;c[h++]=1;c[h++]=0;e[f++]=a[l];e[f++]=-0.2;e[f++]=-a[l+1];e[f++]=a[m];e[f++]=-0.2;e[f++]=-a[m+1];e[f++]=d[m];e[f++]=-0.2;e[f++]=-d[m+1];c[h++]=1;c[h++]=1;c[h++]=0;c[h++]=1;c[h++]=0;
c[h++]=0;e[f++]=d[l];e[f++]=-0.2;e[f++]=-d[l+1];e[f++]=d[m];e[f++]=-0.2;e[f++]=-d[m+1];e[f++]=d[m];e[f++]=0.2;e[f++]=-d[m+1];c[h++]=0;c[h++]=1;c[h++]=1;c[h++]=1;c[h++]=1;c[h++]=0;e[f++]=d[l];e[f++]=-0.2;e[f++]=-d[l+1];e[f++]=d[m];e[f++]=0.2;e[f++]=-d[m+1];e[f++]=d[l];e[f++]=0.2;e[f++]=-d[l+1];c[h++]=0;c[h++]=1;c[h++]=1;c[h++]=0;c[h++]=0;c[h++]=0;e[f++]=a[l];e[f++]=-0.2;e[f++]=-a[l+1];e[f++]=a[m];e[f++]=0.2;e[f++]=-a[m+1];e[f++]=a[m];e[f++]=-0.2;e[f++]=-a[m+1];c[h++]=0;c[h++]=1;c[h++]=1;c[h++]=0;c[h++]=
1;c[h++]=1;e[f++]=a[l];e[f++]=-0.2;e[f++]=-a[l+1];e[f++]=a[l];e[f++]=0.2;e[f++]=-a[l+1];e[f++]=a[m];e[f++]=0.2;e[f++]=-a[m+1];c[h++]=0;c[h++]=1;c[h++]=0;c[h++]=0;c[h++]=1;c[h++]=0}var z=new Float32Array(e),A=new Float32Array(c);k()}}};return g}(BC||{});$(document).ready(function(){BC.Game.run()});BC=function(g){var k=g.Math=g.Math||{};k.radians=function(a){return a*Math.PI/180};k.circlePoints=function(a,b){for(var d=2*Math.PI/b,c=[],g=0;g<b;g++)c[2*g]=a*Math.cos(g*d),c[2*g+1]=a*Math.sin(g*d);return c};k.cross=function(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]};k.subtractVectors=function(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]};k.normalize=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return 1E-5<b?[a[0]/b,a[1]/b,a[2]/b]:[0,0,0]};return g}(BC||
{});BC=function(g){(g.Util=g.Util||{}).error=function(g){window.console&&(window.console.error?window.console.error(g):window.console.log&&window.console.log(g))};return g}(BC||{});
