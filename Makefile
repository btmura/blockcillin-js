CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2 -lGLEW -lGLU -lGL
EXE = blockcillin

all : ${EXE}

${EXE} : main.o game.o
	${CXX} ${LDFLAGS} $^ -o $@

main.o : main.cpp
	${CXX} ${CXXFLAGS} $<

game.o : game.cpp
	${CXX} ${CXXFLAGS} $<

run:
	./${EXE}

clean:
	rm -f *.o ${EXE}
