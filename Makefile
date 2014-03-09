COMPILED_JS = src/res/js/blockcillin.js
JS_SOURCES = $(filter-out $(COMPILED_JS), $(wildcard src/res/js/*.js))
JS_FLAGS = $(addprefix --js ,$(JS_SOURCES))

all:
	java -jar compiler.jar $(JS_SOURCES) --js_output_file $(COMPILED_JS)