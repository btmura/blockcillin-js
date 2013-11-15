EXE = blockcillin
SRC_DIR = src
OBJ_DIR = out

CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL

OBJS = $(addprefix $(OBJ_DIR)/,main.o game.o)
TESTS = shader_unittest

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

test: $(TESTS)
	$(foreach test,$(TESTS),./$(test);)

clean:
	rm -rf $(OBJ_DIR) $(EXE)
	rm -rf $(TESTS) gtest.a gtest_main.a *.o

GTEST_DIR = gtest-1.7.0

GTEST_HEADERS = $(GTEST_DIR)/include/gtest/*.h \
                $(GTEST_DIR)/include/gtest/internal/*.h

GTEST_SRCS_ = $(GTEST_DIR)/src/*.cc $(GTEST_DIR)/src/*.h $(GTEST_HEADERS)

TEST_CPPFLAGS += -isystem $(GTEST_DIR)/include

TEST_CXXFLAGS += -g -Wall -Wextra -pthread

gtest-all.o : $(GTEST_SRCS_)
	$(CXX) $(TEST_CPPFLAGS) -I$(GTEST_DIR) $(TEST_CXXFLAGS) -c \
            $(GTEST_DIR)/src/gtest-all.cc

gtest_main.o : $(GTEST_SRCS_)
	$(CXX) $(TEST_CPPFLAGS) -I$(GTEST_DIR) $(TEST_CXXFLAGS) -c \
            $(GTEST_DIR)/src/gtest_main.cc

gtest.a : gtest-all.o
	$(AR) $(ARFLAGS) $@ $^

gtest_main.a : gtest-all.o gtest_main.o
	$(AR) $(ARFLAGS) $@ $^

shader.o : $(SRC_DIR)/shader.cc $(SRC_DIR)/shader.h $(GTEST_HEADERS)
	$(CXX) $(TEST_CPPFLAGS) $(TEST_CXXFLAGS) -c $(SRC_DIR)/shader.cc

shader_unittest.o : $(SRC_DIR)/shader_unittest.cc \
                     $(SRC_DIR)/shader.h $(GTEST_HEADERS)
	$(CXX) $(TEST_CPPFLAGS) $(TEST_CXXFLAGS) -c $(SRC_DIR)/shader_unittest.cc

shader_unittest : shader.o shader_unittest.o gtest_main.a
	$(CXX) $(TEST_CPPFLAGS) $(TEST_CXXFLAGS) -lpthread $^ -o $@
