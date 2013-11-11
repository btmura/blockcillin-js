CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL
EXE = blockcillin
TESTS = make -f gtest.mk

all : ${EXE}

${EXE} : main.o game.o
	${CXX} ${LDFLAGS} $^ -o $@

%.o : %.cc %.h
	${CXX} ${CXXFLAGS} $< -o $@

run:
	./${EXE}

test:
	${TESTS}

clean:
	rm -f *.o ${EXE}
	${TESTS} clean
