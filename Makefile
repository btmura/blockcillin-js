all:
	java -jar compiler.jar \
		--js src/resources/js/bc.js \
		--js src/resources/js/math.js \
		--js src/resources/js/time.js \
		--js src/resources/js/vector.js \
		--js src/resources/js/matrix.js \
		--js src/resources/js/main.js \
		--js_output_file src/resources/js/compiled.js