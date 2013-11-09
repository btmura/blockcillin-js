CXX = clang++
CXXFLAGS = -std=c++11
EXE = blockcillin

all : ${EXE}

${EXE} : blockcillin.cpp
	${CXX} ${CXXFLAGS} blockcillin.cpp -lSDL2 -o blockcillin

clean:
	rm *.o && rm ${EXE}
