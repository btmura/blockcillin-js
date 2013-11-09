CC = clang++

all : blockcillin

blockcillin : blockcillin.cpp
	${CC} blockcillin.cpp -lSDL -o blockcillin
