EXE = blockcillin
SRC_DIR = src
OUT_DIR = out

CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL

OBJS = $(addprefix $(OUT_DIR)/,main.o game.o shader.o)
TESTS = shader_unittest

all: $(EXE)

$(EXE): $(OBJS)
	$(CXX) $(LDFLAGS) $^ -o $@

$(OBJS): | $(OUT_DIR)

$(OUT_DIR)/%.o: $(SRC_DIR)/%.cc $(SRC_DIR)/%.h
	$(CXX) $(CXXFLAGS) $< -o $@

$(OUT_DIR)/%.o: $(SRC_DIR)/%.cc
	$(CXX) $(CXXFLAGS) $< -o $@

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

run:
	./$(EXE)

test: $(TESTS)
	$(foreach test,$(TESTS),./$(test);)

clean:
	rm -rf $(OUT_DIR) $(EXE)
	rm -rf $(TESTS) gtest.a gtest_main.a *.o

GTEST_DIR = gtest-1.7.0
GTEST_HEADERS = $(GTEST_DIR)/include/gtest/*.h \
                $(GTEST_DIR)/include/gtest/internal/*.h
GTEST_SRCS_ = $(GTEST_DIR)/src/*.cc $(GTEST_DIR)/src/*.h $(GTEST_HEADERS)
GTEST_OUTS = $(addprefix $(OUT_DIR)/,gtest-all.o gtest_main.o gtest.a gtest_main.a)

GTEST_CPPFLAGS += -isystem $(GTEST_DIR)/include
GTEST_CXXFLAGS += -g -Wall -Wextra -pthread

$(GTEST_OUTS): | $(OUT_DIR)

$(OUT_DIR)/gtest-all.o: $(GTEST_SRCS_)
	$(CXX) $(GTEST_CPPFLAGS) -I$(GTEST_DIR) $(GTEST_CXXFLAGS) -c \
            $(GTEST_DIR)/src/gtest-all.cc -o $@

$(OUT_DIR)/gtest_main.o: $(GTEST_SRCS_)
	$(CXX) $(GTEST_CPPFLAGS) -I$(GTEST_DIR) $(GTEST_CXXFLAGS) -c \
            $(GTEST_DIR)/src/gtest_main.cc -o $@

$(OUT_DIR)/gtest.a: $(OUT_DIR)/gtest-all.o
	$(AR) $(ARFLAGS) $@ $^

$(OUT_DIR)/gtest_main.a: $(OUT_DIR)/gtest-all.o $(OUT_DIR)/gtest_main.o
	$(AR) $(ARFLAGS) $@ $^

shader_unittest.o: $(SRC_DIR)/shader_unittest.cc \
                     $(SRC_DIR)/shader.h $(GTEST_HEADERS)
	$(CXX) $(GTEST_CPPFLAGS) $(GTEST_CXXFLAGS) -c $(SRC_DIR)/shader_unittest.cc

shader_unittest: $(OUT_DIR)/shader.o shader_unittest.o $(OUT_DIR)/gtest_main.a
	$(CXX) $(GTEST_CPPFLAGS) $(GTEST_CXXFLAGS) -lpthread $^ -o $@
