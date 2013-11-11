EXE = blockcillin
OUT_DIR = out
SRC_DIR = src

CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL

TESTS = make -f gtest.mk

all : $(EXE)

$(EXE) : $(OUT_DIR)/main.o $(OUT_DIR)/game.o
	$(CXX) $(LDFLAGS) $^ -o $@

$(OUT_DIR)/%.o : $(SRC_DIR)/%.cc $(SRC_DIR)/%.h
	@mkdir -p $(OUT_DIR)
	$(CXX) $(CXXFLAGS) $< -o $@

$(OUT_DIR)/%.o : $(SRC_DIR)/%.cc
	@mkdir -p $(OUT_DIR)
	$(CXX) $(CXXFLAGS) $< -o $@

run:
	./$(EXE)

test:
	$(TESTS) test

clean:
	rm -rf $(OUT_DIR) $(EXE)
	$(TESTS) clean
