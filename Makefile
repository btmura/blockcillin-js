all:
	java -jar compiler.jar \
		--js src/client/js/bc.js \
		--js src/client/js/math.js \
		--js src/client/js/time.js \
		--js src/client/js/vector.js \
		--js src/client/js/matrix.js \
		--js src/client/js/main.js \
		--js_output_file src/client/js/compiled.js