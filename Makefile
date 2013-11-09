CXX = clang++
CXXFLAGS = -std=c++11
EXE = blockcillin

all : ${EXE}

${EXE} : main.cpp
	${CXX} ${CXXFLAGS} main.cpp -lSDL2 -o ${EXE}

clean:
	rm *.o && rm ${EXE}
