COMPILED_JS = src/res/js/bc-compiled/bc.js
JS_SOURCES = $(shell find src/res/js/bc -type f -name *.js)
JS_FLAGS = $(addprefix --js ,$(JS_SOURCES))

all:
	java -jar compiler.jar $(JS_FLAGS) --js_output_file $(COMPILED_JS)

ogg:
	oggenc src/res/audio/*.wav

todo:
	@grep --line-number --recursive --with-filename TODO src

docs: $(JS_SOURCES)
	./node_modules/docker/docker -I -u -n -c monokai -i src/res/js/bc -o docs