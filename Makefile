all : blockcillin

blockcillin : blockcillin.cpp
	 clang++ blockcillin.cpp -o blockcillin
