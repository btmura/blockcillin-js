CXX = clang++
CXXFLAGS = -std=c++11 -Wall -c
LDFLAGS = -lSDL2
EXE = blockcillin

all : ${EXE}

${EXE} : main.o
	${CXX} ${LDFLAGS} $< -o $@

main.o : main.cpp
	${CXX} ${CXXFLAGS} $<

run:
	./${EXE}

clean:
	rm -f *.o ${EXE}
