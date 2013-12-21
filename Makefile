all:
	mkdir -p appengine/static/js appengine/static/glsl
	cp src/*.glsl appengine/static/glsl
	java -jar compiler.jar --js src/main.js --js_output_file appengine/static/js/blockcillin.js