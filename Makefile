all:
	java -jar compiler.jar \
		--js src/static/js/vector.js \
		--js src/static/js/matrix.js \
		--js src/static/js/main.js \
		--js_output_file src/static/js/compiled.js