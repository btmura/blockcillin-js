COMPILED_JS = src/res/js/bc-compiled/bc.js
JS_SOURCES = $(shell find src/res/js/bc -type f -name *.js)
JS_FLAGS = $(addprefix --js ,$(JS_SOURCES))

all:
	java -jar compiler.jar $(JS_FLAGS) --js_output_file $(COMPILED_JS)

todo:
	@grep --line-number --recursive --with-filename TODO src