COMPILED_JS = src/res/js/blockcillin.js
JS_SOURCES = $(wildcard src/res/js/bc/*.js)
JS_FLAGS = $(addprefix --js ,$(JS_SOURCES))

all:
	java -jar compiler.jar $(JS_FLAGS) --js_output_file $(COMPILED_JS)