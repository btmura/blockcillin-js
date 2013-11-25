#
# Copyright (C) 2013 Brian Muramatsu
#
# This file is part of blockcillin.
#
# blockcillin is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# blockcillin is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
#

OUT_DIR = out
EXE = $(OUT_DIR)/blockcillin
TEST_EXE = $(OUT_DIR)/blockcillin-tests

all: $(EXE)

run: $(EXE)
	./$(EXE)

test: $(TEST_EXE)
	./$(TEST_EXE)

clean:
	rm -rf $(OUT_DIR)

SRC_DIR = src
GTEST_DIR = gtest-1.7.0

CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL

GTEST_CPPFLAGS += -isystem $(GTEST_DIR)/include
GTEST_CXXFLAGS += -g -Wall -pthread

OBJS = $(addprefix $(OUT_DIR)/,game.o glutil.o ioutil.o log.o main.o shader.o)
TEST_OBJS = $(addprefix $(OUT_DIR)/,shader_unittest.o)
GTEST_OBJS = $(addprefix $(OUT_DIR)/,gtest-all.o gtest_main.o gtest_main.a)

$(EXE): $(OBJS)
	$(CXX) $(LDFLAGS) $^ -o $@

$(TEST_EXE): $(TEST_OBJS) $(OUT_DIR)/gtest_main.a
	$(CXX) $(GTEST_CPPFLAGS) $(GTEST_CXXFLAGS) -lpthread $^ -o $@

$(OBJS): | $(OUT_DIR)
$(TEST_OBJS): | $(OUT_DIR)
$(GTEST_OBJS): | $(OUT_DIR)

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

$(OUT_DIR)/%.o: $(SRC_DIR)/%.cc $(SRC_DIR)/%.h
	$(CXX) $(CXXFLAGS) $< -o $@

$(OUT_DIR)/%.o: $(SRC_DIR)/%.cc
	$(CXX) $(CXXFLAGS) $< -o $@

GTEST_HEADERS = $(GTEST_DIR)/include/gtest/*.h $(GTEST_DIR)/include/gtest/internal/*.h
GTEST_SRCS_ = $(GTEST_DIR)/src/*.cc $(GTEST_DIR)/src/*.h $(GTEST_HEADERS)

$(OUT_DIR)/%_unittest.o: $(SRC_DIR)/%_unittest.cc $(GTEST_HEADERS)
	$(CXX) $(GTEST_CPPFLAGS) $(GTEST_CXXFLAGS) -c $< -o $@

$(OUT_DIR)/gtest%.o: $(GTEST_SRCS_)
	$(CXX) $(GTEST_CPPFLAGS) -I$(GTEST_DIR) $(GTEST_CXXFLAGS) -c $(GTEST_DIR)/src/gtest$*.cc -o $@

$(OUT_DIR)/gtest_main.a: $(OUT_DIR)/gtest-all.o $(OUT_DIR)/gtest_main.o
	$(AR) $(ARFLAGS) $@ $^
