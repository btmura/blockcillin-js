JS_DIR = src/res/js
COMPILED_JS = bc.js
JS_SOURCES = $(shell find $(JS_DIR) -type f \( -name *.js ! -name *_test.js ! -name $(COMPILED_JS) \))
JS_SOURCES_FLAG = $(addprefix --js ,$(JS_SOURCES))
CSS_SOURCES = $(shell find src/res/css -type f \( -name *.css ! -name *.min.css \))

all:
	java -jar yuicompressor-2.4.8.jar -o '.css$$:.min.css' $(CSS_SOURCES)
	java -jar compiler.jar $(JS_SOURCES_FLAG) --js_output_file $(JS_DIR)/$(COMPILED_JS)

ogg:
	oggenc src/res/audio/*.wav

todo:
	@grep --line-number --recursive --with-filename --exclude-dir=docs TODO src

docs: $(JS_SOURCES)
	./node_modules/docker/docker -I -u -n -c monokai -i $(JS_DIR) -x $(COMPILED_JS) -o src/res/docs
