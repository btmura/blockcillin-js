EXE = blockcillin
OBJ_DIR = obj
SRC_DIR = src

CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL

TESTS = make -f gtest.mk

all : $(EXE)

$(EXE) : $(OBJ_DIR)/main.o $(OBJ_DIR)/game.o
	$(CXX) $(LDFLAGS) $^ -o $@

$(OBJ_DIR)/%.o : $(SRC_DIR)/%.cc $(SRC_DIR)/%.h
	@mkdir -p $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $< -o $@

$(OBJ_DIR)/%.o : $(SRC_DIR)/%.cc
	@mkdir -p $(OBJ_DIR)
	$(CXX) $(CXXFLAGS) $< -o $@

run:
	./$(EXE)

test:
	$(TESTS) test

clean:
	rm -rf $(OBJ_DIR) $(EXE)
	$(TESTS) clean
