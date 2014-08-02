UNCOMPILED_DIR = src/res/js/bc
COMPILED_DIR = src/res/js/bc-compiled
COMPILED_JS = $(COMPILED_DIR)/bc.js
CSS_SOURCES = $(shell find src/res/css -type f \( -name *.css ! -name *.min.css \))
JS_SOURCES = $(shell find src/res/js/bc -type f -name *.js)
JS_FLAGS = $(addprefix --js ,$(JS_SOURCES))

all: | $(COMPILED_DIR)
	java -jar yuicompressor-2.4.8.jar -o '.css$$:.min.css' $(CSS_SOURCES)
	java -jar compiler.jar $(JS_FLAGS) --js_output_file $(COMPILED_JS)

$(COMPILED_DIR):
	mkdir -p $(COMPILED_DIR)

ogg:
	oggenc src/res/audio/*.wav

todo:
	@grep --line-number --recursive --with-filename TODO src

docs: $(JS_SOURCES)
	./node_modules/docker/docker -I -u -n -c monokai -i $(UNCOMPILED_DIR) -o src/res/docs


