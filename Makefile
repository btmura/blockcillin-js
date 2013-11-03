CC = clang++

all : blockcillin

blockcillin : blockcillin.cpp
	${CC} blockcillin.cpp -o blockcillin
