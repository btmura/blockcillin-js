COMPILED_JS = src/res/js/bc-compiled/bc.js
JS_SOURCES = $(wildcard src/res/js/bc/*.js)
JS_NESTED_SOURCES = $(wildcard src/res/js/bc/*/*.js)
JS_FLAGS = $(addprefix --js ,$(JS_SOURCES) $(JS_NESTED_SOURCES))

all:
	java -jar compiler.jar $(JS_FLAGS) --js_output_file $(COMPILED_JS)