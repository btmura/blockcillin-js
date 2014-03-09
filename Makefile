all:
	java -jar compiler.jar \
		--js src/res/js/bc.js \
		--js src/res/js/math.js \
		--js src/res/js/matrix.js \
		--js src/res/js/time.js \
		--js src/res/js/util.js \
		--js src/res/js/webgl.js \
		--js src/res/js/main.js \
		--js_output_file src/res/js/compiled.js