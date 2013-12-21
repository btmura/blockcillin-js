all:
	mkdir -p appengine/static/js
	java -jar compiler.jar --js src/main.js --js_output_file appengine/static/js/blockcillin.js