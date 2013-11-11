EXE = blockcillin
SRC_DIR = src
OBJ_DIR = out

CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL

OBJS = $(addprefix $(OBJ_DIR)/,main.o game.o)
TESTS = make -f gtest.mk

all: $(EXE)

$(EXE): $(OBJS)
	$(CXX) $(LDFLAGS) $^ -o $@

$(OBJS): | $(OBJ_DIR)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cc $(SRC_DIR)/%.h
	$(CXX) $(CXXFLAGS) $< -o $@

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cc
	$(CXX) $(CXXFLAGS) $< -o $@

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

run:
	./$(EXE)

test:
	$(TESTS) test

clean:
	rm -rf $(OBJ_DIR) $(EXE)
	$(TESTS) clean
